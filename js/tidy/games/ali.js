/*
 * T4 Ali's turn (D.2, D.4 S2): T1, T2 or T3 played backwards (kind K5). The
 * child sees the finished layout on Nani's card; Ali can't. The child SAYS
 * each instruction; Ali (`tell`) does what he heard, wrongly if it was
 * unclear; Nani's check catches it ("Arre re! You said limu") and the child
 * says it again. Level 1: the noun (Ali knows the place from the card,
 * D.9.3); level 2: the count, then the noun; level 3: the noun, then the
 * place. Every listen falls back to audio pills or a parent's tick and
 * never blocks. The voice star needs >= 2 rows said right first time.
 */
(function (global) {
  const Tidy = global.Tidy;
  const Rules = Tidy.Rules;
  const $ = (s) => document.querySelector(s);

  /** Nani's card: the finished layout, drawn small in the sidebar. */
  function card(H) {
    let box = $("#ali-card");
    if (!box) {
      box = document.createElement("div");
      box.id = "ali-card";
      box.className = "card";
      $("#live").before(box);
    }
    box.innerHTML = `<div style="font-weight:800">Nani's card</div><div class="pic" style="position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;border-radius:10px"></div>`;
    const pic = box.querySelector(".pic");
    const mini = document.createElement("div");
    mini.className = "zone mini";
    pic.appendChild(mini);
    Tidy.el("div", "backdrop", mini);
    const fake = {
      R: H.R,
      pl: Object.assign({}, H.R.solution),
      at(s) {
        return Object.keys(this.pl).filter((i) => this.pl[i] === s);
      },
      state() {
        return { placements: this.pl, items: H.R.items };
      },
    };
    const v = new Tidy.View({ el: mini }, fake);
    // only what the rows are about: extras stay off the card
    const said = new Set(H.said.rowsList.flatMap((x) => [x.row.item]));
    Object.keys(v.nodes).forEach((i) => (fake.pl[i] === "tray" || !said.has(H.R.items[i].word)) && v.nodes[i].remove());
    mini.querySelector(".tray").remove();
    const fit = () => (mini.style.transform = `scale(${pic.getBoundingClientRect().width / 1600})`);
    fit();
    H.cleanup = (H.cleanup || []).concat(() => box.remove());
    return fit;
  }

  const numOf = (id) => Number(String(id).replace(/^num-0?/, ""));

  Tidy.Game.define("ali", {
    name: "Ali's turn",
    zones: () => [{ id: "board", main: true, region: [0, 0, 1600, 900], mechs: [] }],
    async run(H) {
      H.voiceRound = true;
      H.locked = true;
      H.said.rowsList = Rules.aliListens(H.R, H.level);
      const fit = card(H);
      global.addEventListener("resize", fit);
      const z = H.main;
      const tell = Tidy.Mech.run("tell", z, {});
      Tidy.Sidebar.rows(H, {});
      document.querySelector("#rows").classList.add("hidden"); // the child makes the rows
      const k = Tidy.Mech.knobs("tell", H.level);
      const ask = {
        noun: () => Tidy.frame("whatsthis"),
        count: () => Tidy.frame("whichone"),
        place: () => Tidy.frame("whichone"),
      };
      const listenRow = async (x, first) => {
        const heard = {};
        let allVoice = true;
        let allRight = true;
        for (const l of x.listens) {
          const r = await Tidy.Say.moment({ ask: ask[l.slot](), choices: l.choices, answer: l.answer, timeoutMs: k.timeoutMs, parent: H.opts.grandparent });
          heard[l.slot] = r.choice;
          if (r.by === "pill") allVoice = false;
          if (r.choice !== l.answer) allRight = false;
        }
        if (first) {
          H.said.rows++;
          if (allRight) H.said.right++;
          if (allRight && allVoice) H.said.voice++;
          if (!allRight) H.loseRow(x.row.id);
        }
        return heard;
      };
      const toAct = (x, heard) => {
        const place = heard.place ? H.R.B.groups.find((g) => {
          const a = H.R.B.aById[g.anchor];
          const w = a ? (a.kind === "person-seat" ? H.R.people[g.anchor] : a.word) : Tidy.data.relations[g.rel].word;
          return w === heard.place && H.R.addressable.includes(g.key);
        }) : null;
        return { noun: heard.noun, count: heard.count ? numOf(heard.count) : null, place: place ? place.key : null };
      };
      const put = {};
      for (const x of H.said.rowsList) {
        if (H.dead) return;
        const heard = await listenRow(x, true);
        put[x.row.id] = { heard, put: await tell.act(x.row, toAct(x, heard)) };
      }
      // Nani checks what Ali did, row by row; a wrong one is said again
      for (const x of Rules.util.shuffle(Math.random, H.said.rowsList)) {
        for (let tries = 0; tries < 3; tries++) {
          if (H.holds(x.row)) {
            Tidy.Sidebar.mark(x.row.id, "ok");
            put[x.row.id].put.forEach((p) => H.view.anim(p.iid, "hop"));
            Tidy.sfx("right");
            await Tidy.nani(Tidy.rowLine(x.row, H.R));
            break;
          }
          put[x.row.id].put.forEach((p) => H.view.anim(p.iid, "wiggle"));
          const said = put[x.row.id].heard.noun;
          await Tidy.nani({ segs: [...Tidy.frame("oops").segs, { t: " ", lang: null }, ...Tidy.frame("yousaid", Cook.Lang.phrase([said])).segs], en: "" });
          tell.undo(put[x.row.id].put);
          const heard = await listenRow(x, false);
          put[x.row.id] = { heard, put: await tell.act(x.row, toAct(x, heard)) };
        }
      }
      global.removeEventListener("resize", fit);
      return Tidy.finish(H);
    },
  });
  const Cook = global.Cook;
})(window);
