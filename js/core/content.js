/*
 * Content versions (decision 22 g): every arc, level set and map file carries a `version` (a whole number), and
 * the save remembers the version it last saw, so a content update never breaks a save.
 *
 *   checkContent(save, kind, data, { id }) -> { status, from, to }
 *     status "new"       first time this save meets it (noted)
 *            "same"      nothing changed
 *            "updated"   newer content: ids it renamed (data.renamed: {old: new}) are carried over in the
 *                        save's opened unlocks; then noted
 *            "older"     the content is older than the save (a rollback): the save is left exactly as it is
 *            "unversioned"  the data has no version: reported, nothing written
 * It never throws and never deletes anything from a save.
 */
export function checkContent(save, kind, data, { id } = {}) {
  const key = id || (data && data.id) || kind;
  const to = data && Number.isInteger(data.version) ? data.version : null;
  if (to == null) return { status: "unversioned", from: null, to: null };
  const from = save.contentVersion(kind, key);
  if (from == null) {
    save.noteContent(kind, key, to);
    return { status: "new", from, to };
  }
  if (to === from) return { status: "same", from, to };
  if (to < from) return { status: "older", from, to };
  const ren = (data && data.renamed) || {};
  if (Object.keys(ren).length) {
    save.update("unlocks", (u) => {
      const open = Object.assign({}, u.open);
      Object.entries(ren).forEach(([o, n]) => {
        if (open[o] && !open[n]) open[n] = Object.assign({}, open[o], { renamedFrom: o });
      });
      u.open = open;
      return u;
    });
  }
  save.noteContent(kind, key, to);
  return { status: "updated", from, to };
}

export default checkContent;
