// Node types available to graph.json and the Add menu (in this order).
// To add a type: write a module like the others and list it here.
import archive from './archive.js';
import filter from './filter.js';
import sort from './sort.js';
import shuffle from './shuffle.js';
import pick from './pick.js';
import media from './media.js';
import number from './number.js';
import clock from './clock.js';
import projector from './projector.js';
import consoleNode from './console.js';
import info from './info.js';
import inspect from './inspect.js';
import preview from './preview.js';
import random from './random.js';

export const registry = Object.fromEntries(
  [archive, info, filter, sort, shuffle, random, pick, media, number, clock, inspect, preview, projector, consoleNode]
    .map(d => [d.type, d]),
);
