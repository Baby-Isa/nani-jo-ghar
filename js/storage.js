/* Nani jo Ghar - thin shell storage. The ONLY module that touches
 * storage. IndexedDB, one object store "profiles", one record per
 * profile, per Build Brief v4 section 2.1 / the Roadmap's thin shell
 * spec. Nothing is uploaded, synced or exported off the device. */
(function (global) {
  "use strict";

  const DB_NAME = "njg_shell";
  const DB_VERSION = 1;
  const STORE = "profiles";

  let dbPromise = null;

  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      if (!("indexedDB" in window)) return reject(new Error("no indexedDB"));
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: "id" });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
      // private-browsing Safari can hang open() forever instead of erroring
      setTimeout(() => reject(new Error("indexedDB open timed out")), 2000);
    });
    return dbPromise;
  }

  function tx(mode) {
    return openDB().then((db) => db.transaction(STORE, mode).objectStore(STORE));
  }

  let availableCache = null;
  async function isAvailable() {
    if (availableCache != null) return availableCache;
    try {
      await openDB();
      availableCache = true;
    } catch (e) {
      availableCache = false;
    }
    return availableCache;
  }

  async function listProfiles() {
    if (!(await isAvailable())) return [];
    const store = await tx("readonly");
    return new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async function getProfile(id) {
    if (!(await isAvailable())) return null;
    const store = await tx("readonly");
    return new Promise((resolve, reject) => {
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  let persistAsked = false;
  async function saveProfile(p) {
    if (!(await isAvailable())) return p;
    if (!persistAsked) {
      persistAsked = true;
      try {
        if (navigator.storage && navigator.storage.persist) await navigator.storage.persist();
      } catch (e) { /* best-effort */ }
    }
    const store = await tx("readwrite");
    return new Promise((resolve, reject) => {
      const req = store.put(p);
      req.onsuccess = () => resolve(p);
      req.onerror = () => reject(req.error);
    });
  }

  async function deleteProfile(id) {
    if (!(await isAvailable())) return;
    const store = await tx("readwrite");
    return new Promise((resolve, reject) => {
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  function newProfileId() {
    return "p_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  global.NjgStorage = { isAvailable, listProfiles, getProfile, saveProfile, deleteProfile, newProfileId };
})(window);
