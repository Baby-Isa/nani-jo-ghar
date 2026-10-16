#!/usr/bin/env python3
"""Upscale a picture ×2 with Real-ESRGAN (RealESRGAN_x2plus weights), on the CPU, then resize to an exact size.

    python3 build/tools/art/upscale.py IN.png OUT.png [--size 2100x1400] [--weights PATH] [--tile 256]

It only sharpens the picture ChatGPT drew; nothing new is invented (Zafar, 15 Oct: "chatgpt can redraw but you might
need to upscale as well after"). Needs torch and the weights file
(https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.1/RealESRGAN_x2plus.pth). The network (RRDBNet) is
written out here because the realesrgan/basicsr packages do not build on this Python.
"""
import argparse
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from PIL import Image


class RDB(nn.Module):
    def __init__(self, nf=64, gc=32):
        super().__init__()
        self.conv1 = nn.Conv2d(nf, gc, 3, 1, 1)
        self.conv2 = nn.Conv2d(nf + gc, gc, 3, 1, 1)
        self.conv3 = nn.Conv2d(nf + 2 * gc, gc, 3, 1, 1)
        self.conv4 = nn.Conv2d(nf + 3 * gc, gc, 3, 1, 1)
        self.conv5 = nn.Conv2d(nf + 4 * gc, nf, 3, 1, 1)
        self.lrelu = nn.LeakyReLU(0.2, True)

    def forward(self, x):
        x1 = self.lrelu(self.conv1(x))
        x2 = self.lrelu(self.conv2(torch.cat((x, x1), 1)))
        x3 = self.lrelu(self.conv3(torch.cat((x, x1, x2), 1)))
        x4 = self.lrelu(self.conv4(torch.cat((x, x1, x2, x3), 1)))
        x5 = self.conv5(torch.cat((x, x1, x2, x3, x4), 1))
        return x5 * 0.2 + x


class RRDB(nn.Module):
    def __init__(self, nf, gc=32):
        super().__init__()
        self.rdb1, self.rdb2, self.rdb3 = RDB(nf, gc), RDB(nf, gc), RDB(nf, gc)

    def forward(self, x):
        return self.rdb3(self.rdb2(self.rdb1(x))) * 0.2 + x


class RRDBNet(nn.Module):
    """Real-ESRGAN's generator; scale 2 works on a pixel-unshuffled input (4× the channels)."""

    def __init__(self, scale=2, nf=64, nb=23, gc=32):
        super().__init__()
        self.scale = scale
        cin = 3 * (4 if scale == 2 else 1)
        self.conv_first = nn.Conv2d(cin, nf, 3, 1, 1)
        self.body = nn.Sequential(*[RRDB(nf, gc) for _ in range(nb)])
        self.conv_body = nn.Conv2d(nf, nf, 3, 1, 1)
        self.conv_up1 = nn.Conv2d(nf, nf, 3, 1, 1)
        self.conv_up2 = nn.Conv2d(nf, nf, 3, 1, 1)
        self.conv_hr = nn.Conv2d(nf, nf, 3, 1, 1)
        self.conv_last = nn.Conv2d(nf, 3, 3, 1, 1)
        self.lrelu = nn.LeakyReLU(0.2, True)

    def forward(self, x):
        if self.scale == 2:
            x = F.pixel_unshuffle(x, 2)
        feat = self.conv_first(x)
        feat = feat + self.conv_body(self.body(feat))
        feat = self.lrelu(self.conv_up1(F.interpolate(feat, scale_factor=2, mode="nearest")))
        feat = self.lrelu(self.conv_up2(F.interpolate(feat, scale_factor=2, mode="nearest")))
        return self.conv_last(self.lrelu(self.conv_hr(feat)))


def upscale(img, net, tile=256, pad=12):
    """×2, tile by tile (with an overlap that is cut away) so a 1536-wide picture fits in memory."""
    x = torch.from_numpy(np.asarray(img, dtype=np.float32) / 255.0).permute(2, 0, 1)[None]
    _, _, h, w = x.shape
    out = torch.zeros(1, 3, h * 2, w * 2)
    for y0 in range(0, h, tile):
        for x0 in range(0, w, tile):
            y1, x1 = min(y0 + tile, h), min(x0 + tile, w)
            py0, px0, py1, px1 = max(y0 - pad, 0), max(x0 - pad, 0), min(y1 + pad, h), min(x1 + pad, w)
            with torch.no_grad():
                o = net(x[:, :, py0:py1, px0:px1])
            oy, ox = (y0 - py0) * 2, (x0 - px0) * 2
            out[:, :, y0 * 2:y1 * 2, x0 * 2:x1 * 2] = o[:, :, oy:oy + (y1 - y0) * 2, ox:ox + (x1 - x0) * 2]
    arr = (out[0].clamp(0, 1).permute(1, 2, 0).numpy() * 255.0).round().astype(np.uint8)
    return Image.fromarray(arr)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("src")
    ap.add_argument("dst")
    ap.add_argument("--size", help="exact output size WxH after the ×2 (Lanczos)")
    ap.add_argument("--weights", default="RealESRGAN_x2plus.pth")
    ap.add_argument("--tile", type=int, default=256)
    a = ap.parse_args()
    torch.set_num_threads(max(1, torch.get_num_threads()))
    net = RRDBNet(scale=2)
    sd = torch.load(a.weights, map_location="cpu")
    net.load_state_dict(sd.get("params_ema", sd.get("params", sd)), strict=True)
    net.eval()
    src = Image.open(a.src)
    alpha = src.getchannel("A") if src.mode in ("RGBA", "LA") else None
    big = upscale(src.convert("RGB"), net, a.tile)
    if alpha is not None:
        big.putalpha(alpha.resize(big.size, Image.LANCZOS))
    if a.size:
        w, h = (int(v) for v in a.size.lower().split("x"))
        big = big.resize((w, h), Image.LANCZOS)
    big.save(a.dst)
    print(f"{a.src} {src.size} -> {a.dst} {big.size}")


if __name__ == "__main__":
    main()
