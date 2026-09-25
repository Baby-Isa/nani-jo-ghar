/*
 * Cache-busting stamp, loaded before every other script. GitHub Pages lets
 * browsers cache files, so a returning player could keep old art or code.
 * Every css/js tag in the pages carries ?v=<stamp>, and code wraps the URLs
 * it builds (data fetches, pictures, backgrounds, voice) in njgV(url).
 * Load it right after Phaser (where there is one) and before everything else,
 * so every file a Phaser scene loads gets the stamp as well.
 *
 * build/bump_version.py rewrites the stamp here and on every tag: run it
 * before each push to main.
 */
(function (global) {
  const V = "20260925T223729Z";
  global.NJG_V = V;
  /** url -> url?v=<stamp> (relative URLs only; data:, blob: and full URLs are left alone). */
  global.njgV = function (url) {
    if (typeof url !== "string" || !url || /^(data:|blob:|[a-z]+:\/\/)/i.test(url) || /[?&]v=/.test(url)) return url;
    return url + (url.includes("?") ? "&" : "?") + "v=" + V;
  };
  // Phaser (when it's loaded before this file): every file a scene loads gets the stamp
  const P = global.Phaser;
  if (P && P.Loader && P.Loader.LoaderPlugin && !P.Loader.LoaderPlugin.prototype._njgV) {
    const proto = P.Loader.LoaderPlugin.prototype;
    const addFile = proto.addFile;
    proto.addFile = function (file) {
      [].concat(file).forEach((f) => {
        if (f && typeof f.url === "string") f.url = global.njgV(f.url);
      });
      return addFile.call(this, file);
    };
    proto._njgV = true;
  }
})(window);
