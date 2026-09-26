/* Nani jo Ghar - thin shell: launch flow, profile picker, create profile,
 * hub, settings, leave-errand. Owns the flow around js/game.js's one
 * errand. See Build Brief v4 section 2 / the Roadmap's thin shell spec.
 * Nothing here ever leaves the device. */
(function (global) {
  "use strict";

  const el = (id) => document.getElementById(id);

  const AVATARS = [
    { id: "avatar-01", initial: "A", color: "#a63b3b" },
    { id: "avatar-02", initial: "I", color: "#2f3e6b" },
    { id: "avatar-03", initial: "Z", color: "#6f8f4a" },
    { id: "avatar-04", initial: "M", color: "#c07a2b" },
    { id: "avatar-05", initial: "S", color: "#8a4a9c" },
    { id: "avatar-06", initial: "N", color: "#b3492f" },
    { id: "avatar-07", initial: "R", color: "#2e8a8a" },
    { id: "avatar-08", initial: "F", color: "#a67c3d" },
  ];
  const avatarById = (id) => AVATARS.find((a) => a.id === id) || AVATARS[0];

  let currentProfile = null;
  let storageOK = true;

  async function persistCurrentProfile() {
    if (!currentProfile) return;
    if (storageOK) {
      try { await NjgStorage.saveProfile(currentProfile); } catch (e) { /* best-effort */ }
    }
  }

  // Exposed so js/ui.js can keep the quilt (and any other per-profile
  // display) reading/writing the ACTIVE PROFILE's own patches, not one
  // shared localStorage blob - each profile keeps its own progress.
  global.NjgProfile = {
    get: () => currentProfile,
    save: persistCurrentProfile,
  };

  // ================= reusable confirm dialog =================
  function confirm(message) {
    return new Promise((resolve) => {
      el("confirm-message").textContent = message;
      el("overlay-confirm").style.display = "flex";
      const cleanup = (v) => {
        el("overlay-confirm").style.display = "none";
        el("confirm-yes").onclick = null;
        el("confirm-cancel").onclick = null;
        resolve(v);
      };
      el("confirm-yes").onclick = () => cleanup(true);
      el("confirm-cancel").onclick = () => cleanup(false);
    });
  }

  // ================= profile picker =================
  async function showPicker() {
    hideHub();
    const grid = el("picker-grid");
    grid.innerHTML = "";
    storageOK = await NjgStorage.isAvailable();
    el("picker-notice").style.display = storageOK ? "none" : "block";
    if (!storageOK) el("picker-notice").textContent = "Progress won't be saved on this device.";

    const profiles = storageOK ? await NjgStorage.listProfiles() : [];
    profiles.forEach((p) => {
      const tile = document.createElement("button");
      tile.className = "picker-tile";
      const av = avatarById(p.avatar);
      tile.innerHTML = `<div class="picker-avatar" style="background:${av.color}">${av.initial}</div><span></span>`;
      tile.querySelector("span").textContent = p.name;
      tile.onclick = () => chooseProfile(p);
      grid.appendChild(tile);
    });
    if (profiles.length < 6) {
      const add = document.createElement("button");
      add.className = "picker-tile add";
      add.innerHTML = '<div class="picker-avatar">+</div><span>New</span>';
      add.onclick = showCreate;
      grid.appendChild(add);
    }
    el("overlay-picker").style.display = "flex";
  }

  function showCreate() {
    el("overlay-picker").style.display = "none";
    el("create-name").value = "";
    el("create-reads").checked = false;
    el("create-writes").checked = false;
    const grid = el("create-avatars");
    grid.innerHTML = "";
    let selected = AVATARS[0].id;
    AVATARS.forEach((a) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "picker-avatar" + (a.id === selected ? " selected" : "");
      b.style.background = a.color;
      b.textContent = a.initial;
      b.onclick = () => {
        selected = a.id;
        grid.querySelectorAll(".picker-avatar").forEach((x) => x.classList.remove("selected"));
        b.classList.add("selected");
      };
      grid.appendChild(b);
    });
    el("overlay-create").style.display = "flex";
    el("create-cancel").onclick = () => { el("overlay-create").style.display = "none"; showPicker(); };
    el("create-save").onclick = async () => {
      const name = el("create-name").value.trim() || "Player";
      const profile = {
        schema_version: 1,
        id: NjgStorage.newProfileId(),
        name,
        avatar: selected,
        reads: el("create-reads").checked,
        writes: el("create-writes").checked,
        words: {},
        errands_done: [],
        patches: [],
        in_progress: null,
        hub_dressing: [],
        settings: { volume: 0.8 },
      };
      el("overlay-create").style.display = "none";
      if (storageOK) await NjgStorage.saveProfile(profile);
      chooseProfile(profile);
    };
  }

  function chooseProfile(profile) {
    currentProfile = profile;
    Progress.attachProfile(profile, () => persistCurrentProfile());
    el("overlay-picker").style.display = "none";
    showHub();
  }

  // ================= hub =================
  function decorationAnchor(kitchenDef, name) {
    const shelf = kitchenDef.eid_shelf;
    if (name === "bunting") return { x: (shelf.bunting.x0 + shelf.bunting.x1) / 2, y: shelf.bunting.y + 20 };
    if (name === "crescent") return shelf.crescent;
    if (name === "lights") return { x: (shelf.lights.x0 + shelf.lights.x1) / 2, y: shelf.lights.y + 24 };
    return { x: shelf.lantern.x, y: shelf.lantern.y };
  }

  function renderHubDecorations() {
    const kitchenDef = NjgData.scene("kitchen");
    const layer = el("hub-decorations");
    layer.innerHTML = "";
    (currentProfile.hub_dressing || []).forEach((name) => {
      const img = document.createElement("img");
      img.src = njgV(`assets/scene/eid/${name === "crescent" ? "crescent-star" : name}.png`);
      const a = decorationAnchor(kitchenDef, name);
      img.style.left = `${(a.x / 1600) * 100}%`;
      img.style.top = `${(a.y / 900) * 100}%`;
      img.style.width = "9%";
      layer.appendChild(img);
    });
  }

  // Same idea as js/game.js's letterbox fill for the canvas: the hub is a
  // separate full-viewport overlay (no sidebar column to eat the extra
  // width on very wide screens like the Flip), so it needs its own
  // dominant-colour sample rather than showing black bars either side.
  let hubBgColorCache = null;
  function setHubLetterboxColor(url) {
    if (hubBgColorCache) { el("hub-screen").style.background = hubBgColorCache; return; }
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = 1; c.height = 1;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      hubBgColorCache = `rgb(${r},${g},${b})`;
      el("hub-screen").style.background = hubBgColorCache;
    };
    img.src = url;
  }

  async function showHub() {
    el("overlay-picker").style.display = "none";
    el("overlay-create").style.display = "none";
    if (!NjgData.content) await NjgGame.prepare();
    const kitchenDef = NjgData.scene("kitchen");
    el("hub-bg").style.backgroundImage = `url(${kitchenDef.background})`;
    setHubLetterboxColor(kitchenDef.background);
    renderHubDecorations();
    el("hub-profile-name").textContent = currentProfile.name;
    const label = currentProfile.errands_done.includes(NjgGame.errandId()) ? "Play again →" : "Nani needs you →";
    el("hub-go-btn").textContent = label;
    el("hub-go-btn").onclick = enterErrand;
    el("hub-screen").style.display = "block";
  }

  function hideHub() {
    el("hub-screen").style.display = "none";
  }

  async function enterErrand() {
    hideHub();
    currentProfile.in_progress = { errand_id: NjgGame.errandId(), phase: "intro" };
    await persistCurrentProfile();
    await NjgGame.playErrand();
  }

  function wireGameCallback() {
    NjgGame.onErrandComplete = async (errandId, patch) => {
      // js/ui.js's addPatch() already pushed `patch` into the active
      // profile's own patches array (js/game.js's finish() calls it) -
      // this hook only updates the other hub-facing fields.
      if (!currentProfile.errands_done.includes(errandId)) currentProfile.errands_done.push(errandId);
      const dec = patch.hub_decoration;
      if (dec && !currentProfile.hub_dressing.includes(dec)) currentProfile.hub_dressing.push(dec);
      currentProfile.in_progress = null;
      await persistCurrentProfile();
      showHub();
    };
  }

  // ---------------- leave mid-errand (home tab) ----------------
  el("tab-home").addEventListener("click", async () => {
    const yes = await confirm("Leave and go home? What you've learned so far is kept.");
    if (!yes) return;
    NjgGame.leaveErrand();
    if (currentProfile) { currentProfile.in_progress = null; await persistCurrentProfile(); }
    showHub();
  });

  // ---------------- switch profile from the hub ----------------
  el("hub-profile-name").addEventListener("click", () => {
    currentProfile = null;
    hideHub();
    showPicker();
  });

  // ---------------- quilt from the hub ----------------
  el("hub-quilt").addEventListener("click", () => {
    NjgUI.renderQuiltOverlay();
    el("overlay-quilt").style.display = "flex";
  });

  // ---------------- settings: press-and-hold the cog for 3s ----------------
  let holdTimer = null;
  function startHold() {
    el("hub-cog-ring").classList.add("filling");
    holdTimer = setTimeout(() => { el("hub-cog-ring").classList.remove("filling"); openSettings(); }, 3000);
  }
  function cancelHold() {
    clearTimeout(holdTimer);
    el("hub-cog-ring").classList.remove("filling");
  }
  ["pointerdown"].forEach((ev) => el("hub-cog").addEventListener(ev, startHold));
  ["pointerup", "pointerleave", "pointercancel"].forEach((ev) => el("hub-cog").addEventListener(ev, cancelHold));

  function openSettings() {
    el("settings-volume").value = Math.round((currentProfile.settings.volume || 0.8) * 100);
    el("settings-rename").value = currentProfile.name;
    el("overlay-settings").style.display = "flex";
  }
  el("settings-close").addEventListener("click", async () => {
    const newName = el("settings-rename").value.trim();
    if (newName) { currentProfile.name = newName; el("hub-profile-name").textContent = newName; }
    await persistCurrentProfile();
    el("overlay-settings").style.display = "none";
  });
  el("settings-volume").addEventListener("input", async (e) => {
    currentProfile.settings.volume = Number(e.target.value) / 100;
    if (global.__njg && global.__njg.game) global.__njg.game.sound.volume = currentProfile.settings.volume;
    await persistCurrentProfile();
  });
  el("settings-reset").addEventListener("click", async () => {
    const yes = await confirm("Reset this profile's progress? Words learned and patches earned will be cleared.");
    if (!yes) return;
    currentProfile.words = {};
    currentProfile.errands_done = [];
    currentProfile.patches = [];
    currentProfile.hub_dressing = [];
    currentProfile.in_progress = null;
    await persistCurrentProfile();
    el("overlay-settings").style.display = "none";
    showHub();
  });
  el("settings-delete").addEventListener("click", async () => {
    const yes = await confirm(`Delete ${currentProfile.name}'s profile? This can't be undone.`);
    if (!yes) return;
    if (storageOK) await NjgStorage.deleteProfile(currentProfile.id);
    el("overlay-settings").style.display = "none";
    currentProfile = null;
    hideHub();
    showPicker();
  });

  // ================= boot =================
  async function boot() {
    wireGameCallback();
    el("start-btn").onclick = async () => {
      el("overlay-start").style.display = "none";
      await NjgGame.unlockAudioAndFullscreen();
      await NjgGame.prepare();
      showPicker();
    };
  }

  boot();
})(window);
