/*
 * Nani's house: the app shell's home screen (index.html). "One app, one
 * save", phase B; build/reports/shell.md has the why.
 *
 * LAUNCH
 *   - nobody on this device yet (a first launch): make "Player 1" and go
 *     straight into the first launch (first.html: the character, the pantry
 *     round, chai, the Eid story). No menu, no tutorial (docs/UX-PRINCIPLES.md
 *     7). The house appears after it.
 *   - a player who hasn't had it yet (a child a grown-up just added) goes the
 *     same way the moment they're picked.
 *   - two or more players: "Who's playing?" first, once per visit.
 *   - otherwise the house: a door per mode. Cook, Find it and the clinic now;
 *     with ?labs=1 the lab modes too, as "coming soon" doors.
 * The world map, fog of war and "the world is the menu" replace this house
 * in phase C; the doors are data (DOORS) so that move is a swap.
 */
(function (global) {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const Save = global.Save;
  const App = global.NjgApp;
  const params = new URLSearchParams(global.location.search);
  const labs = params.get("labs") === "1";
  const v = global.njgV || ((u) => u);

  const DOORS = [
    { id: "cook", url: "cook.html", name: "Cook with Nani", room: "The kitchen" },
    { id: "find", url: "find.html", name: "Find it", room: "The bazaar" },
    { id: "clinic", url: "clinic.html", name: "The clinic", room: "The doctor's" },
  ];
  const SOON = [
    { id: "tidy", url: "tidy.html", name: "Tidy up" },
    { id: "who", url: "who.html?lab=1", name: "Who did it?" },
    { id: "dress", url: "dress.html", name: "Dress up" },
    { id: "monsoon", url: "monsoon.html", name: "Monsoon rush" },
    { id: "snap", url: "snap.html?lab=1", name: "Snap" },
  ];
  // THE FIRST-LAUNCH HOOK. A player without the "firstDone" flag is sent here (a brand-new
  // device, or a child a grown-up just added): first.html, the first launch (make your character,
  // the pantry round, chai for Nani, the Eid picture story; docs/first-launch-story.md). It ends
  // with Save.setFlag("firstDone", true) and NjgApp.home("first"). docs/shared-api.md sections 12-13.
  // (?speed= is passed on for the browser tests, which play the Cook rounds fast)
  const FIRST = "first.html?app=1" + (params.get("speed") ? `&speed=${encodeURIComponent(params.get("speed"))}` : "");

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const initial = (name) => (String(name || "?").trim()[0] || "?").toUpperCase();
  const session = {
    get(k) {
      try {
        return global.sessionStorage.getItem(k);
      } catch (e) {
        return null;
      }
    },
    set(k, val) {
      try {
        global.sessionStorage.setItem(k, val);
      } catch (e) {
        /* fine: the picker just shows again */
      }
    },
  };

  /* ---------------- has this player had their first round? ---------------- */
  function started(id) {
    if (Save.flag("firstDone", id)) return true;
    // a save migrated from before the shell: they've played already
    const cook = Save.get("cook", id);
    if ((cook.orders || 0) > 0 || Object.keys(cook.words || {}).length || Object.keys(Save.get("ui", id)).length) {
      Save.setFlag("firstDone", true, id);
      return true;
    }
    return false;
  }
  function play(id) {
    Save.select(id);
    session.set("njg-who", id);
    if (!started(id)) App.go(FIRST);
    else render();
  }

  /* ---------------- the house ---------------- */
  function door(d, soon) {
    const href = App.link(d.url);
    return `<a class="door${soon ? " is-soon" : ""}" href="${esc(href)}" data-door="${d.id}">
      <span class="arch"><img alt="" loading="lazy" src="${esc(v(`assets/shell/door-${d.id}.webp`))}">${soon ? '<span class="ribbon">Coming soon</span>' : ""}</span>
      <span class="label">${esc(d.name)}</span>
    </a>`;
  }
  function render() {
    const p = Save.current();
    if (p) {
      $("#who .dot").textContent = initial(p.name);
      $("#who .dot").style.background = p.colour;
      $("#who .dot").classList.remove("has-char");
      // the player's own character, once they've made one (js/shared/character.js)
      if (global.Character) global.Character.badge($("#who .dot"), p.id);
      $("#who .nm").textContent = p.name;
    }
    $("#doors").innerHTML = DOORS.map((d) => door(d)).join("");
    const ld = $("#lab-doors");
    ld.hidden = !labs;
    ld.innerHTML = labs ? SOON.map((d) => door(d, true)).join("") : "";
    document.querySelectorAll("a.door").forEach((a) =>
      a.addEventListener("click", (e) => {
        e.preventDefault();
        App.go(a.getAttribute("href"));
      })
    );
    $("#notice").hidden = Save.persistent();
    document.body.classList.remove("is-loading");
  }

  /* ---------------- who's playing ---------------- */
  function swatches(el, chosen, onPick) {
    el.innerHTML = Save.COLOURS.map(
      (c) => `<button type="button" role="radio" aria-checked="${c === chosen}" aria-label="Colour ${c}" data-c="${c}" style="background:${c}"></button>`
    ).join("");
    el.querySelectorAll("button").forEach((b) =>
      b.addEventListener("click", () => {
        el.querySelectorAll("button").forEach((x) => x.setAttribute("aria-checked", String(x === b)));
        onPick(b.dataset.c);
      })
    );
  }
  function openPicker(opts = {}) {
    const sheet = $("#picker");
    const players = Save.players();
    $(".tiles", sheet).innerHTML =
      players
        .map(
          (p) => `<button type="button" class="tile${p.id === Save.currentId() ? " on" : ""}" data-id="${esc(p.id)}">
          <span class="dot" style="background:${esc(p.colour)}">${esc(initial(p.name))}</span><span class="nm">${esc(p.name)}</span></button>`
        )
        .join("") + `<button type="button" class="tile add-tile" aria-label="Add a player"><span class="dot plus">+</span><span class="nm">Add</span></button>`;
    if (global.Character) sheet.querySelectorAll(".tile[data-id] .dot").forEach((d) => global.Character.badge(d, d.closest(".tile").dataset.id));
    sheet.querySelectorAll(".tile[data-id]").forEach((t) =>
      t.addEventListener("click", () => {
        sheet.hidden = true;
        play(t.dataset.id);
      })
    );
    const form = $("form.add", sheet);
    form.hidden = true;
    $(".add-tile", sheet).addEventListener("click", () => {
      form.hidden = false;
      form.name.value = "";
      let colour = Save.COLOURS[players.length % Save.COLOURS.length];
      swatches($(".swatches", form), colour, (c) => (colour = c));
      form.onsubmit = (e) => {
        e.preventDefault();
        const name = form.name.value.trim();
        if (!name) return form.name.focus();
        const p = Save.addPlayer({ name, colour });
        sheet.hidden = true;
        play(p.id);
      };
      form.name.focus();
    });
    $(".cancel", form).onclick = () => (form.hidden = true);
    sheet.hidden = false;
    sheet.onclick = (e) => {
      if (e.target === sheet && !opts.must) sheet.hidden = true;
    };
  }

  /* ---------------- grown-ups: press and hold the cog ---------------- */
  function holdToOpen(btn, ms, open) {
    let t = null;
    const stop = () => {
      clearTimeout(t);
      t = null;
      btn.classList.remove("holding");
    };
    btn.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      btn.classList.add("holding");
      t = setTimeout(() => {
        stop();
        open();
      }, ms);
    });
    ["pointerup", "pointerleave", "pointercancel"].forEach((k) => btn.addEventListener(k, stop));
    btn.addEventListener("contextmenu", (e) => e.preventDefault());
    // keyboard: hold Enter/Space the same way
    btn.addEventListener("keydown", (e) => {
      if ((e.key === "Enter" || e.key === " ") && !t && !e.repeat) {
        btn.classList.add("holding");
        t = setTimeout(() => (stop(), open()), ms);
      }
    });
    btn.addEventListener("keyup", stop);
  }
  function openGrown() {
    const sheet = $("#grown");
    const list = $(".players", sheet);
    const status = (msg) => ($(".status", sheet).textContent = msg || "");
    const draw = () => {
      list.innerHTML = Save.players()
        .map(
          (p) => `<div class="prow" data-id="${esc(p.id)}">
          <span class="dot" style="background:${esc(p.colour)}">${esc(initial(p.name))}</span>
          <input value="${esc(p.name)}" maxlength="24" aria-label="Name">
          <div class="swatches small"></div>
          <button type="button" class="btn small remove">Remove</button></div>`
        )
        .join("");
      list.querySelectorAll(".prow").forEach((row) => {
        const id = row.dataset.id;
        if (global.Character) global.Character.badge($(".dot", row), id);
        const p = Save.player(id);
        swatches($(".swatches", row), p.colour, (c) => {
          Save.updatePlayer(id, { colour: c });
          draw();
          render();
        });
        $("input", row).addEventListener("change", (e) => {
          Save.updatePlayer(id, { name: e.target.value });
          draw();
          render();
        });
        $(".remove", row).addEventListener("click", () => {
          if (!global.confirm(`Remove ${p.name} and all of their progress from this device? This can't be undone (unless you saved a copy).`)) return;
          Save.removePlayer(id);
          if (!Save.players().length) return global.location.reload();
          draw();
          render();
        });
      });
    };
    draw();
    // Story help (docs/first-launch-story.md): English then Kutchi (the default), or Kutchi only
    const helpBtns = sheet.querySelectorAll("#story-help [data-help]");
    const showHelp = () => {
      const h = Save.setting("storyHelp") === "k" ? "k" : "en-k";
      helpBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.help === h)));
    };
    helpBtns.forEach((b) => (b.onclick = () => (Save.setSetting("storyHelp", b.dataset.help), showHelp())));
    showHelp();
    status(Save.persistent() ? "" : "This browser is blocking storage: progress lasts until the page is closed.");
    $("#export").onclick = () => {
      const blob = new Blob([Save.exportJSON()], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `nani-jo-ghar-save-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => (URL.revokeObjectURL(a.href), a.remove()), 1000);
      status("Saved a copy to your downloads.");
    };
    $("#import-file").onchange = async (e) => {
      const f = e.target.files && e.target.files[0];
      e.target.value = "";
      if (!f) return;
      try {
        const text = await f.text();
        if (!global.confirm("Load this copy? Players in the file replace the same players here; everyone else stays.")) return;
        const r = Save.importJSON(text);
        status(`Loaded: ${r.added} added, ${r.replaced} replaced.`);
        draw();
        render();
      } catch (err) {
        status(err.message || "That file couldn't be loaded.");
      }
    };
    $(".close", sheet).onclick = () => (sheet.hidden = true);
    sheet.hidden = false;
  }

  /* ---------------- launch ---------------- */
  function boot() {
    Save.init();
    if (!Save.players().length) {
      // a first launch: straight into the pantry round
      Save.addPlayer({ name: "Player 1", auto: true });
      global.location.replace(FIRST);
      return;
    }
    const cur = Save.currentId();
    if (!started(cur)) {
      global.location.replace(FIRST);
      return;
    }
    render();
    $("#who").addEventListener("click", () => openPicker());
    holdToOpen($("#grownups"), 1500, openGrown);
    // more than one child: ask who's playing, once a visit (not when coming back from a room)
    if (Save.players().length > 1 && !session.get("njg-who") && !params.get("from")) openPicker({ must: true });
    else session.set("njg-who", cur);
  }
  // test hook: what the house shows
  global.__home = {
    state: () => ({ players: Save.players(), current: Save.currentId(), doors: Array.from(document.querySelectorAll("a.door")).map((a) => a.dataset.door), picker: !$("#picker").hidden }),
  };
  boot();
})(window);
