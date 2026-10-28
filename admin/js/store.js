// Holds the four JSON documents, tracks which changed, reads and writes them.
//
// Reading: over HTTP from the site root (../) or, once a folder is connected, from disk.
// Writing: to disk through the File System Access API (Chrome/Edge) if connected,
//          otherwise each changed file is downloaded.
//
// Events: load, dirty, dir, log

import { createEmitter } from '../../js/core/emitter.js';

const ROOT = '../';
export const FILES = ['projects', 'info', 'site', 'graph'];

const EMPTY = {
  projects: () => ({ projects: [] }),
  info: () => ({ title: '' }),
  graph: () => ({ nodes: [], links: [] }),
};

// Remove '', [], {} and null keys (shallow) so saved JSON stays tidy.
// Blank link rows are dropped first.
function tidy(obj) {
  for (const key of ['links', 'contact']) {
    if (Array.isArray(obj[key])) obj[key] = obj[key].filter(l => l.label || l.href);
  }
  for (const [k, v] of Object.entries(obj)) {
    const empty = v == null || v === '' || (Array.isArray(v) && !v.length) ||
      (v.constructor === Object && !Object.keys(v).length);
    if (empty) delete obj[k];
  }
  return obj;
}

export const slug = s => String(s).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const safeName = name => {
  const dot = name.lastIndexOf('.');
  const base = dot > 0 ? name.slice(0, dot) : name, ext = dot > 0 ? name.slice(dot).toLowerCase() : '';
  return (slug(base) || 'file') + ext;
};

export class Store {
  constructor() {
    this.data = {};
    this.dirty = new Set();
    this.dir = null;
    this.events = createEmitter();
  }

  path(name) {
    if (name === 'site') return 'data/site.json';
    return this.data.site?.[name] || `data/${name}.json`;
  }

  log(msg) {
    this.events.emit('log', msg);
  }

  touch(name) {
    if (this.dirty.has(name)) return;
    this.dirty.add(name);
    this.events.emit('dirty', this.dirty);
  }

  // --- reading -------------------------------------------------------------

  async read(path) {
    if (this.dir) {
      const file = await (await this.handle(path)).getFile();
      return JSON.parse(await file.text());
    }
    const res = await fetch(ROOT + path, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`${path}: ${res.status}`);
    return res.json();
  }

  async load() {
    this.data.site = await this.read('data/site.json');
    for (const name of ['projects', 'info', 'graph']) {
      try {
        this.data[name] = await this.read(this.path(name));
      } catch {
        this.data[name] = EMPTY[name]();
        this.log(`${this.path(name)} not found; starting empty`);
      }
    }
    this.data.projects.projects ??= [];
    this.dirty.clear();
    this.events.emit('dirty', this.dirty);
    this.events.emit('load');
    this.log(`loaded ${this.data.projects.projects.length} projects from ${this.dir ? `folder "${this.dir.name}"` : 'server'}`);
  }

  // --- folder access -------------------------------------------------------

  get canConnect() {
    return 'showDirectoryPicker' in window;
  }

  async connect() {
    if (!this.canConnect) {
      this.log('Folder access needs Chrome or Edge; Save will download files instead');
      return;
    }
    const dir = await window.showDirectoryPicker({ id: 'portfolio-site', mode: 'readwrite' });
    try {
      await this.handle('data/site.json', false, dir);
    } catch {
      this.log(`"${dir.name}" has no data/site.json; pick the site's root folder`);
      return;
    }
    this.dir = dir;
    this.events.emit('dir', dir);
    if (this.dirty.size) this.log(`connected "${dir.name}"; keeping unsaved edits`);
    else await this.load();
  }

  // Walk "a/b/c.json" from the root folder handle.
  async handle(path, create = false, root = this.dir) {
    const parts = path.split('/').filter(Boolean);
    const name = parts.pop();
    let dir = root;
    for (const p of parts) dir = await dir.getDirectoryHandle(p, { create });
    return dir.getFileHandle(name, { create });
  }

  async write(path, data) {
    const w = await (await this.handle(path, true)).createWritable();
    await w.write(data);
    await w.close();
  }

  // Copy a picked file into <folder>/ and return its site-relative path.
  async importMedia(file, folder) {
    const path = `${folder}/${safeName(file.name)}`;
    if (!this.dir) {
      this.log(`not connected: copy "${file.name}" to ${path} yourself`);
      return path;
    }
    await this.write(path, file);
    this.log(`copied ${path}`);
    return path;
  }

  async exists(src) {
    if (/^(https?:|data:)/.test(src)) return true;
    try {
      if (this.dir) { await (await this.handle(src)).getFile(); return true; }
      const res = await fetch(ROOT + src, { method: 'HEAD', cache: 'no-cache' });
      return res.ok;
    } catch {
      return false;
    }
  }

  // --- validation & saving -------------------------------------------------

  validate() {
    const errors = [], seen = new Set();
    this.data.projects.projects.forEach((p, i) => {
      const where = `project ${i + 1}${p.title ? ` (${p.title})` : ''}`;
      if (!p.id) errors.push(`${where}: missing id`);
      else if (seen.has(p.id)) errors.push(`${where}: duplicate id "${p.id}"`);
      else if (!/^[a-z0-9][a-z0-9_-]*$/.test(p.id)) errors.push(`${where}: id should be lowercase letters, digits, - or _`);
      seen.add(p.id);
      (p.media || []).forEach((m, j) => { if (!m.src) errors.push(`${where}: media ${j + 1} has no src`); });
    });
    (this.data.info.media || []).forEach((m, j) => { if (!m.src) errors.push(`info: media ${j + 1} has no src`); });
    return errors;
  }

  serialize(name) {
    const copy = JSON.parse(JSON.stringify(this.data[name]));
    if (name === 'projects') copy.projects.forEach(tidy);
    if (name === 'info' || name === 'site') tidy(copy);
    return JSON.stringify(copy, null, 2) + '\n';
  }

  async save() {
    if (!this.dirty.size) return this.log('nothing to save');
    const errors = this.validate();
    if (errors.length && !confirm(`Save anyway?\n\n${errors.join('\n')}`)) return;
    if (this.dirty.has('info') && !this.data.site.info) {
      this.data.site.info = 'data/info.json';
      this.dirty.add('site');
    }
    const names = FILES.filter(n => this.dirty.has(n));
    for (const name of names) {
      const path = this.path(name), text = this.serialize(name);
      if (this.dir) await this.write(path, text);
      else download(path.split('/').pop(), text);
    }
    this.dirty.clear();
    this.events.emit('dirty', this.dirty);
    this.log(this.dir ? `saved ${names.map(n => this.path(n)).join(', ')}`
      : `downloaded ${names.length} file(s); move them into data/`);
  }
}

function download(filename, text) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
