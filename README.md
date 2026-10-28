# Index of Works — node portfolio

A full-screen projector navigated by a small node graph. No dependencies, no build step.

```
python3 -m http.server     # or any static server; file:// won't work (fetch + ES modules)
```

All media and project text in `data/` and `media/` is placeholder.

## Admin

Open `/admin/` on the same local server. It loads `data/*.json` and edits projects, info,
site settings and the default graph. **Save** (or Ctrl/Cmd+S) writes the changed files:

- **Connect folder** (Chrome/Edge): pick the site's root folder once per session. Save writes the
  JSON to disk, and files chosen with **File…** are copied into `media/<project-id>/` (or `media/info/`).
- Not connected (any browser): Save downloads the changed JSON files; move them into `data/`.
  Files chosen with File… only set the path; copy them there yourself.

The admin is a local tool. It does nothing harmful if deployed, but there's no reason to upload
`/admin/` to the live site.

```
admin/index.html, admin.css
admin/js/main.js      tabs, toolbar
admin/js/store.js     load / validate / save (disk or download), media import
admin/js/forms.js     bound inputs, key/value rows, repeaters
admin/js/media.js     media list editor with thumbnails
admin/js/views/       projects.js, info.js, site.js, graph.js
```

## How it works

```
projects.json ─► Archive ─► Filter ─► Sort ─► Pick ─► Media ─┬─► Projector   (full-screen media)
                                                             └─► Console     (floating text panel)
```

The graph is evaluated in topological order whenever anything changes (link, param, clock tick).
Only the two sink nodes have effects: whatever reaches **Projector** is shown, whatever reaches
**Console** is printed. The default graph (`data/graph.json`) sorts by year and picks index 0, so it
opens on the most recent project.

Mobile (`site.json → mobile.query`) skips the graph: random order, auto-advance, tap image for next,
tap the panel to expand.

## Files

```
data/site.json        title, about, contact, theme, wire style, grid, fade, mobile settings
data/projects.json    content
data/graph.json       default graph + initial view
js/main.js            boot, chooses desktop or mobile
js/app/               desktop.js, mobile.js
js/graph/             Graph.js (model), evaluate.js, types.js (socket types + conversions)
js/nodes/             one file per node type + registry.js
js/projector/         Projector.js (A/B crossfade) + media/{image,video,iframe}.js
js/ui/                Canvas (pan/zoom), Editor (views+wires sync), NodeView, Wires, Interact,
                      widgets, Console, Menu, record (shared record renderers)
css/                  tokens, base, projector, canvas, node, wire, widgets, record, console,
                      chrome (bars + menu), mobile, themes/
```

## projects.json

```json
{
  "id": "slow-life",               // used in URLs: #p=slow-life&m=1
  "title": "Slow Life",
  "year": 2026,
  "tags": ["video", "software"],
  "summary": "One or two sentences.",
  "body": ["Paragraph", "Paragraph"],
  "fields": { "Medium": "Video", "Status": "In progress" },   // any key/value rows
  "links": [{ "label": "Documentation", "href": "https://…" }],
  "media": [
    { "type": "video",  "src": "…mp4", "poster": "…jpg", "caption": "Loop" },
    { "type": "image",  "src": "…jpg", "caption": "Still", "fit": "contain" },
    { "type": "iframe", "src": "https://…", "caption": "Live" }
  ]
}
```

`fit` is `cover` (default) or `contain`. Records are numbered by their position in the file (No. 001…).

## info.json

Bio for the Info node; path set by `"info"` in `site.json`. Uses the same keys as a project
(`title`, `summary`, `body`, `fields`, `links`, `media`), so it renders anywhere a project does.
It appears as record No. 000.

## graph.json

```json
{
  "view": { "x": 40, "y": 72, "z": 1 },
  "nodes": [{ "id": "N04", "type": "pick", "x": 0, "y": 200, "params": { "index": 0 } }],
  "links": [["N03", "collection", "N04", "collection"]]
}
```

Easiest way to author it: arrange the graph in the browser, press **Ctrl/Cmd+S** to download
`graph.json`, and drop it into `data/`.

## Interaction

| Action | Result |
|---|---|
| Drag background / middle-drag | Pan |
| Wheel / two-finger scroll | Pan |
| Ctrl/Cmd + wheel, pinch | Zoom |
| Drag node | Move (snaps to `grid`) |
| Drag from an output | New link (snaps to nearest valid socket) |
| Drag from a linked input | Re-route the link, or drop in empty space to cut it |
| Click wire, Delete | Cut link |
| Click node, Delete | Remove node (Projector and Console can't be removed) |
| Double-click background / Add node | Add menu |
| F / H / Esc | Fit / hide graph / deselect |

Hide the graph to interact with iframe media.

## Node types

| Type | In → Out | Params |
|---|---|---|
| archive | → collection | |
| info | → project | (reads `data/info.json`) |
| inspect | any → same | (pass-through; lists what flows through) |
| preview | media → | (in-node projector, resizable) |
| filter | collection → collection | tag |
| sort | collection → collection | by, order |
| shuffle | collection, seed → collection | seed |
| pick | collection, index → project | index (wraps) |
| media | project, index → media | index (wraps) |
| number | → number | value |
| clock | → number | seconds, run |
| projector | media → | |
| console | media \| project \| text → | |

Implicit conversions: project→media (first item), media→project, collection→project (first),
project→text (title), number→text.

### Adding a node type

Write `js/nodes/mynode.js` and add it to `registry.js`:

```js
export default {
  type: 'mynode', label: 'My Node', group: 'Collection',
  inputs:  [{ name: 'collection', label: 'Records', type: 'collection' },
            { name: 'n', label: 'N', type: 'number', param: 'n' }],   // param: inline widget, disabled when linked
  outputs: [{ name: 'collection', label: 'Records', type: 'collection' }],
  params:  [{ key: 'n', label: 'N', widget: 'stepper', default: 3, min: 1 }],  // select | stepper | toggle
  evaluate({ in: i, connected, params, state, ctx }) {
    const n = connected.n ? i.n : params.n;
    return { collection: (i.collection || []).slice(0, n) };
  },
  readout: node => `${node.out.collection?.length ?? 0} records`,  // optional footer line
  // init(node, graph) / dispose(node) for timers etc.; call graph.changed() to re-evaluate
};
```

Optional extras (see `preview.js`, `inspect.js`):

- `view(node) → { el, update(), dispose() }` puts custom DOM in the node body; `update` runs after every evaluation.
- `size: { w, h, minW, minH }` adds a resize grip; the size is saved in `params.w` / `params.h`.
- An output `{ type: 'any', from: '<input>' }` is a pass-through: it carries whatever type is linked into that input.

### Adding a media type

Write `js/projector/media/mytype.js` returning `{ el, ready: Promise, dispose() }` and add it to
`HANDLERS` in `Projector.js`.

## Styling

Every color, size and font is a custom property in `css/tokens.css`. Themes live in `css/themes/`
and only redefine tokens inside `@layer theme` (which always wins over component styles).
Set `"theme": "dark"` in `site.json` to try the included alternative. JS only toggles state
classes (`is-selected`, `is-connected`, `is-linking`, …) and data attributes (`data-type`), never
colors.

`"wires": "curve"` in `site.json` switches from orthogonal routing to béziers.
