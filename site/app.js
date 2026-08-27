/* A Design Cookbook for UI/UX of AI — application.
   Taxonomy: 83 patterns in 10 categories, 23 human factors with 97 sub-factors.
   Paper->pattern and paper->factor are both many-to-many; categories are derived from patterns.
   Data arrives as window.__DATA__ (schema 2.0.0). */
(function () {
  'use strict';

  var h = React.createElement;
  var useState = React.useState, useEffect = React.useEffect, useMemo = React.useMemo, useRef = React.useRef;

  /* ---------------------------------------------------------------- stages */
  /* The reading order over the ten categories: one pass through an interaction, chunked
     into stages. The stages themselves come from the data (migration.stages, mirrored on
     every category as `stage` / `stage_order`) so a re-cut of the taxonomy needs no code
     change here. Only the one-line gloss is editorial, and it is keyed by stage name. */

  var STAGE_GLOSS = {
    'Setting the context': 'what you specify, when the system acts, what it may not do',
    'Taking in the output': 'how results arrive, and how you read, inspect and verify them',
    'Acting on the output': 'how you compare, choose and edit what comes back',
    'Fitting into the work': 'workflow, workspace, and the other participants'
  };

  var BANDS = [];
  var CAT_RANK = {};
  var BAND_OF = {};

  // Built once the data is in hand. Falls back to the categories themselves if the data
  // carries no stage list, so the site still renders rather than going blank.
  function buildBands(d) {
    var stages = (d.migration && d.migration.stages) || [];
    if (!stages.length) {
      var seen = {};
      d.categories.forEach(function (c) {
        var name = c.stage || 'Catalogue';
        if (!seen[name]) { seen[name] = { name: name, categories: [] }; stages.push(seen[name]); }
        seen[name].categories.push(c.category_id);
      });
    }
    BANDS = stages.map(function (s, i) {
      return {
        key: 'b' + (i + 1),
        name: s.name,
        gloss: STAGE_GLOSS[s.name] || '',
        categories: s.categories.slice()
      };
    });
    CAT_RANK = {};
    BAND_OF = {};
    BANDS.forEach(function (b, bi) {
      b.categories.forEach(function (cid, ci) {
        CAT_RANK[cid] = bi * 100 + ci;
        BAND_OF[cid] = b;
      });
    });
    return BANDS;
  }

  // categories in stage order, as [{band, categories:[...]}]
  function bandedCategories(d) {
    var byId = {};
    d.categories.forEach(function (c) { byId[c.category_id] = c; });
    return BANDS.map(function (b) {
      return { band: b, categories: b.categories.map(function (id) { return byId[id]; }).filter(Boolean) };
    });
  }

  // patterns in catalogue order: stage, then category within stage, then lens and breadth
  function bandedPatterns(d) {
    return d.patterns.slice().sort(function (a, b) { return a.display_order - b.display_order; });
  }

  /* ------------------------------------------------------------------ util */

  function cx() {
    var out = [];
    for (var i = 0; i < arguments.length; i++) if (arguments[i]) out.push(arguments[i]);
    return out.join(' ');
  }
  function uniq(list) { return Array.from(new Set(list)); }
  function pct(n, d) { return d ? Math.round((n / d) * 100) : 0; }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : (many || one + 's')); }
  // The accent encodes quantity: matrix cells and count bars. Interactive elements stay ink,
  // so colour never has to mean "value" and "clickable" at the same time. TINT_RGB follows
  // whichever palette is active — see PALETTES.
  var TINT_RGB = '11, 107, 79';
  var TINT_DEEP = '11, 107, 79';
  function tintAlpha(t) { return 0.06 + Math.max(0, Math.min(1, t)) * 0.94; }
  // A ramp is the pair the shade runs between: the colour itself at the bottom, a deepened
  // version of its own hue at the top. The matrix builds one per stage so a cell is shaded
  // in the colour of the stage its row belongs to; the legend keeps using the global one.
  function rampOf(baseHex) {
    return { lo: hex(baseHex), hi: hex(deepen(baseHex, 0.22, 0.34)) };
  }
  function globalRamp() {
    return { lo: TINT_RGB.split(',').map(Number), hi: TINT_DEEP.split(',').map(Number) };
  }
  function tintRGB(t, rp) {
    var r = rp || globalRamp();
    var k = Math.max(0, Math.min(1, t));
    return r.lo.map(function (c, i) { return Math.round(c + (r.hi[i] - c) * k); });
  }
  function tint(t, rp) {
    return 'rgba(' + tintRGB(t, rp).join(', ') + ', ' + tintAlpha(t).toFixed(3) + ')';
  }
  // Ink for a number sitting on a shaded cell. The shade is the accent laid over the card
  // at some alpha, so how dark it actually lands depends on the accent — a fixed cutoff
  // would put white type on a pale wash the moment a palette picks a light accent.
  function cellInk(t, rp) {
    var c = tintRGB(t, rp);
    var a = tintAlpha(t);
    var l = [0, 1, 2].map(function (i) {
      var x = (c[i] * a + 255 * (1 - a)) / 255;
      return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    });
    return (0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2]) < 0.42 ? '#ffffff' : 'var(--ink-2)';
  }

  /* -------------------------------------------------------------- palettes */
  /* Skin only. Every palette keeps the same structure: a light ground, four ink steps,
     one accent that carries quantity — bars and matrix cells, nothing else — and one hue
     per reading stage (--b1..--b4). The stage hues are deliberately
     kept off the accent's hue, so no colour has to mean "how many" and "which stage" at
     once. Each has a pale wash for the surfaces those colours label. */

  var PALETTES = [
    {
      id: 'daylight', name: 'Daylight', note: 'cool white · blue quantity, green/violet/amber stages',
      swatch: ['#1d6ff2', '#0e9b6a', '#8b3fd1', '#2f7fd0', '#b7791f'],
      vars: {
        '--paper': '#fbfcff', '--card': '#ffffff', '--band': '#eaf0fb', '--band-alt': '#f5f8ff',
        '--rule': '#dde5f2', '--rule-strong': '#bccce4',
        '--ink': '#0b1524', '--ink-2': '#1b2740', '--ink-3': '#41506a', '--ink-4': '#697893', '--ink-5': '#94a2bb',
        '--accent': '#1d6ff2', '--accent-pale': '#e3edfe',
        '--glass': 'rgba(251, 252, 255, 0.92)', '--notice': '#fff6e6', '--notice-rule': '#f0dcb4',
        '--b1': '#0e9b6a', '--b2': '#8b3fd1', '--b3': '#2f7fd0', '--b4': '#b7791f',
        '--on-ink-mono': '#9ec6ff'
      },
      tint: '29, 111, 242'
    },
    {
      id: 'citrus', name: 'Citrus', note: 'near-white · gold quantity, red/green/blue/yellow stages',
      swatch: ['#face75', '#f25022', '#7fba00', '#00a4ef', '#ffb900'],
      vars: {
        '--paper': '#fafafa', '--card': '#ffffff', '--band': '#f3f2ef', '--band-alt': '#fbfbfa',
        '--rule': '#eae7e1', '--rule-strong': '#d5d0c7',
        '--ink': '#241809', '--ink-2': '#3a2914', '--ink-3': '#5f4728', '--ink-4': '#8a6d4a', '--ink-5': '#b0946d',
        '--accent': '#face75', '--accent-pale': '#fdf3dd',
        '--glass': 'rgba(254, 254, 254, 0.92)', '--notice': '#fdf4e6', '--notice-rule': '#eeddc0',
        '--b1': '#f25022', '--b2': '#7fba00', '--b3': '#00a4ef', '--b4': '#ffb900',
        '--on-ink-mono': '#f4dda2'
      },
      tint: '250, 206, 117'
    },
    {
      id: 'orchid', name: 'Orchid', note: 'pale lilac · violet quantity, teal/rose/olive stages',
      swatch: ['#8b3ff2', '#0e8f8f', '#c0455e', '#4f6ad2', '#7d8b25'],
      vars: {
        '--paper': '#fdfaff', '--card': '#ffffff', '--band': '#f2eafd', '--band-alt': '#faf6ff',
        '--rule': '#e7dcf6', '--rule-strong': '#cbb6e8',
        '--ink': '#1c1030', '--ink-2': '#2e1d4a', '--ink-3': '#4f3a71', '--ink-4': '#7a63a0', '--ink-5': '#a693c4',
        '--accent': '#8b3ff2', '--accent-pale': '#efe4fe',
        '--glass': 'rgba(253, 250, 255, 0.92)', '--notice': '#fdf0f6', '--notice-rule': '#f0cfe0',
        '--b1': '#0e8f8f', '--b2': '#c0455e', '--b3': '#4f6ad2', '--b4': '#7d8b25',
        '--on-ink-mono': '#d3b3ff'
      },
      tint: '139, 63, 242'
    },
    {
      id: 'meadow', name: 'Meadow', note: 'mint white · green quantity, indigo/plum/umber stages',
      swatch: ['#10a45f', '#3b5bd4', '#9a3f8f', '#0e8f8f', '#b07219'],
      vars: {
        '--paper': '#f7fdf9', '--card': '#ffffff', '--band': '#e4f5eb', '--band-alt': '#f2fbf6',
        '--rule': '#d6ecdf', '--rule-strong': '#aed6c1',
        '--ink': '#08221a', '--ink-2': '#12352a', '--ink-3': '#2f5a48', '--ink-4': '#578371', '--ink-5': '#8aab9c',
        '--accent': '#10a45f', '--accent-pale': '#dcf3e7',
        '--glass': 'rgba(247, 253, 249, 0.92)', '--notice': '#fbf5e6', '--notice-rule': '#e6dcbb',
        '--b1': '#3b5bd4', '--b2': '#9a3f8f', '--b3': '#0e8f8f', '--b4': '#b07219',
        '--on-ink-mono': '#8fe6bb'
      },
      tint: '16, 164, 95'
    },
    {
      id: 'coral', name: 'Coral', note: 'blush white · pink quantity, teal/indigo/olive stages',
      swatch: ['#e5326b', '#0e8f8f', '#4356c9', '#a4468f', '#97812a'],
      vars: {
        '--paper': '#fffafb', '--card': '#ffffff', '--band': '#fbe8ee', '--band-alt': '#fff4f7',
        '--rule': '#f4dbe3', '--rule-strong': '#e2b3c4',
        '--ink': '#2a0d18', '--ink-2': '#431627', '--ink-3': '#6d3547', '--ink-4': '#986374', '--ink-5': '#bd94a3',
        '--accent': '#e5326b', '--accent-pale': '#fde3ec',
        '--glass': 'rgba(255, 250, 251, 0.92)', '--notice': '#fdf2e8', '--notice-rule': '#f0d5bd',
        '--b1': '#0e8f8f', '--b2': '#4356c9', '--b3': '#a4468f', '--b4': '#97812a',
        '--on-ink-mono': '#ffabc6'
      },
      tint: '229, 50, 107'
    },
    {
      id: 'swiss', name: 'Swiss Archive', note: 'neutral grey · pine quantity, slate/umber/plum stages',
      swatch: ['#0b6b4f', '#3f5f7a', '#8a6234', '#4a7060', '#6a4a7d'],
      vars: {
        '--paper': '#f4f4f4', '--card': '#ffffff', '--band': '#ececec', '--band-alt': '#fafafa',
        '--rule': '#e3e3e3', '--rule-strong': '#c9c9c9',
        '--ink': '#111111', '--ink-2': '#222222', '--ink-3': '#4a4a4a', '--ink-4': '#6e6e6e', '--ink-5': '#949494',
        '--accent': '#0b6b4f', '--accent-pale': '#e4efe9',
        '--glass': 'rgba(244, 244, 244, 0.94)', '--notice': '#f4ece4', '--notice-rule': '#e3d3c6',
        '--b1': '#3f5f7a', '--b2': '#8a6234', '--b3': '#4a7060', '--b4': '#6a4a7d',
        '--on-ink-mono': '#9bd4bd'
      },
      tint: '11, 107, 79'
    }
  ];

  var DEFAULT_PALETTE = 'citrus';
  // The palette is settled, so its picker is hidden; flip this back to true to return it.
  var SHOW_PALETTE_PICKER = false;
  // Temporary editorial tab, withdrawn now the figures are picked. Flip back to true
  // to revise the choices; the route stays wired either way.
  var SHOW_FIGURE_PICKER = false;
  // Temporary: one matrix per stage, alongside the single grid on the home page.
  var SHOW_STAGE_MATRIX = false;

  /* The matrix ramp normally follows the palette's accent. These are the alternatives a
     reader can pick instead; the ramp is built from whichever colour is chosen, running
     from a faint tint of it to a deep version of its own hue. */
  var SCALES = [
    { id: 'auto', name: 'Palette accent', hex: null },
    { id: 'mint', name: 'Mint', hex: '#daffef' },
    { id: 'aqua', name: 'Aqua', hex: '#c7ffed' },
    { id: 'lilac', name: 'Lilac', hex: '#cfbae1' },
    { id: 'orchid', name: 'Orchid', hex: '#e7bbe3' },
    { id: 'plum', name: 'Plum', hex: '#805d93' },
    { id: 'slate', name: 'Slate', hex: '#2c4251' },
    { id: 'deep-sea', name: 'Deep sea', hex: '#003d5b' },
    { id: 'wine', name: 'Wine', hex: '#632b30' }
  ];

  // The ramp colour is fixed for now and its picker is hidden; flip SHOW_SCALE_PICKER back
  // to true to return the swatch row, along with the reader's stored choice.
  var DEFAULT_SCALE = '#1f1bf8';
  // how far above the header's bottom edge a rotated column label starts (see .colhead > div)
  var LABEL_INSET = 8;
  var SHOW_SCALE_PICKER = false;

  function isHex(v) { return /^#[0-9a-f]{6}$/i.test(v || ''); }
  function scaleById(id) {
    for (var i = 0; i < SCALES.length; i++) if (SCALES[i].id === id) return SCALES[i];
    return SCALES[0];
  }
  // A scale is either one of the presets by id, or any colour the reader picked, as a hex.
  function scaleBase(value, palette) {
    if (isHex(value)) return value.toLowerCase();
    var s = scaleById(value);
    return s.hex || rgbToHex(palette.tint);
  }
  function storedScale() {
    if (!SHOW_SCALE_PICKER) return DEFAULT_SCALE;
    try {
      var v = localStorage.getItem('cookbook-scale') || DEFAULT_SCALE;
      return isHex(v) ? v.toLowerCase() : scaleById(v).id;
    } catch (e) { return DEFAULT_SCALE; }
  }
  var SCALE_ID = 'auto';

  // Point the ramp at a colour: the palette's accent when 'auto', otherwise the pick.
  function applyScale(value, palette) {
    var base = scaleBase(value, palette);
    SCALE_ID = isHex(value) ? value.toLowerCase() : scaleById(value).id;
    TINT_RGB = hex(base).join(', ');
    TINT_DEEP = hex(deepen(base, 0.22, 0.34)).join(', ');
    try { localStorage.setItem('cookbook-scale', SCALE_ID); } catch (e) { /* private mode */ }
  }

  // A muted second tone per stage, mixed from the stage hue toward the palette's own muted
  // ink. Stage headers keep the saturated hue; everything at category level uses this, so
  // the two levels read apart without introducing a second hue.
  function hex(c) {
    var v = c.replace('#', '');
    return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
  }
  // Relative luminance, used only to decide whether a stage colour is light enough that
  // text and rules drawn *in* it would vanish against the page.
  function lum(c) {
    var v = hex(c).map(function (x) {
      x /= 255;
      return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  }

  // Darken a colour while keeping its hue, with a floor on saturation. Used only for the
  // stage name and its rule: a pale wash has to gain a little colour to be readable as
  // type, but stays well short of the saturated tones the rest of the page avoids.
  function deepen(c, l, minS) {
    var v = hex(c).map(function (x) { return x / 255; });
    var mx = Math.max.apply(null, v), mn = Math.min.apply(null, v), d = mx - mn;
    var hh = 0;
    if (d) {
      if (mx === v[0]) hh = ((v[1] - v[2]) / d + (v[1] < v[2] ? 6 : 0)) / 6;
      else if (mx === v[1]) hh = ((v[2] - v[0]) / d + 2) / 6;
      else hh = ((v[0] - v[1]) / d + 4) / 6;
    }
    var sat = Math.max(minS, d ? d / (1 - Math.abs(mx + mn - 1)) : 0);
    var q = l < 0.5 ? l * (1 + sat) : l + sat - l * sat, pp = 2 * l - q;
    function ch(t) {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1 / 6) return pp + (q - pp) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return pp + (q - pp) * (2 / 3 - t) * 6;
      return pp;
    }
    return '#' + [ch(hh + 1 / 3), ch(hh), ch(hh - 1 / 3)].map(function (x) {
      return Math.round(x * 255).toString(16).padStart(2, '0');
    }).join('');
  }

  // WCAG contrast between two opaque colours.
  function contrast(a, b) {
    var x = lum(a), y = lum(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  }

  // The accent doubles as label text on its own pale wash. A light accent fails that job —
  // gold on cream is unreadable — so darken its hue until the pair clears 4.5:1, the WCAG
  // AA threshold for small text. Returns the accent untouched when it already passes.
  function readableOn(accent, background, want) {
    var target = want || 4.5;
    if (contrast(accent, background) >= target) return accent;
    for (var l = 0.50; l >= 0.10; l -= 0.02) {
      var c = deepen(accent, l, 0.32);
      if (contrast(c, background) >= target) return c;
    }
    return deepen(accent, 0.10, 0.32);
  }

  // Rebuild a colour at a rotated hue and a set lightness/saturation. Used for the two lens
  // tags, which have to contrast with each other rather than agree with the accent.
  function spin(c, deg, l, sat) {
    var v = hex(c).map(function (x) { return x / 255; });
    var mx = Math.max.apply(null, v), mn = Math.min.apply(null, v), d = mx - mn;
    var hh = 0;
    if (d) {
      if (mx === v[0]) hh = ((v[1] - v[2]) / d + (v[1] < v[2] ? 6 : 0)) / 6;
      else if (mx === v[1]) hh = ((v[2] - v[0]) / d + 2) / 6;
      else hh = ((v[0] - v[1]) / d + 4) / 6;
    }
    hh = (hh + deg / 360) % 1;
    var q = l < 0.5 ? l * (1 + sat) : l + sat - l * sat, pp = 2 * l - q;
    function ch(t) {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1 / 6) return pp + (q - pp) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return pp + (q - pp) * (2 / 3 - t) * 6;
      return pp;
    }
    return '#' + [ch(hh + 1 / 3), ch(hh), ch(hh - 1 / 3)].map(function (x) {
      return Math.round(x * 255).toString(16).padStart(2, '0');
    }).join('');
  }

  function rgbToHex(triple) {
    return '#' + triple.split(',').map(function (c) {
      return Number(c).toString(16).padStart(2, '0');
    }).join('');
  }
  function mix(a, b, t) {
    var x = hex(a), y = hex(b);
    return '#' + x.map(function (c, i) {
      return Math.round(c + (y[i] - c) * t).toString(16).padStart(2, '0');
    }).join('');
  }

  function paletteById(id) {
    for (var i = 0; i < PALETTES.length; i++) if (PALETTES[i].id === id) return PALETTES[i];
    return PALETTES[0];
  }

  function applyPalette(id) {
    var p = paletteById(id);
    var root = document.documentElement;
    Object.keys(p.vars).forEach(function (k) { root.style.setProperty(k, p.vars[k]); });
    // Three tones derive from each stage colour, so a palette can name a stage in any
    // lightness and still read:
    //   -soft  the muted category-level tone
    //   -text  the stage colour used as text or a rule on the page ground
    //   -pale  the wash behind category rows
    //   -on    text sitting on a fill of the stage colour
    root.style.setProperty('--on-accent', lum(p.vars['--accent']) > 0.55 ? p.vars['--ink'] : '#ffffff');
    root.style.setProperty('--accent-ink', readableOn(p.vars['--accent'], p.vars['--accent-pale']));
    // UX-led and UI-led are a pair, so they sit a third of the wheel apart from each other
    // and two thirds away from the accent — neither can be mistaken for quantity.
    // A quiet pair: each lens gets a pale wash of its own hue with deep type of the same
    // hue on top. The two hues sit 150 degrees apart so they read as different at a glance,
    // and both are well away from the accent, which is the only strong colour on the page.
    [['ux', 150], ['ui', 300]].forEach(function (pair) {
      var bg = spin(p.vars['--accent'], pair[1], 0.93, 0.34);
      var fg = spin(p.vars['--accent'], pair[1], 0.34, 0.36);
      for (var l = 0.34; l >= 0.16 && contrast(fg, bg) < 4.5; l -= 0.02) {
        fg = spin(p.vars['--accent'], pair[1], l, 0.36);
      }
      root.style.setProperty('--lens-' + pair[0], bg);
      root.style.setProperty('--lens-' + pair[0] + '-on', fg);
    });
    // Each stage names one colour; the tones it needs are measured off the page rather than
    // assumed, so a stage can be a pale wash or a fully saturated brand colour and still
    // produce a readable name, a visible rule and a wash that text can sit on.
    ['--b1', '--b2', '--b3', '--b4'].forEach(function (k) {
      var c = p.vars[k];
      if (!c) return;
      var wash = lum(c) > 0.78;   // already pale enough to be a background as it stands
      root.style.setProperty(k + '-pale',
        wash ? mix(c, p.vars['--card'], 0.15) : mix(c, p.vars['--card'], 0.87));
      root.style.setProperty(k + '-text', readableOn(c, p.vars['--paper'], 4.5));
      root.style.setProperty(k + '-soft', readableOn(c, p.vars['--paper'], 3));
      // whichever of the two reads better on this stage's fill, rather than a fixed cutoff
      root.style.setProperty(k + '-on',
        contrast(c, '#ffffff') >= contrast(c, p.vars['--ink']) ? '#ffffff' : p.vars['--ink']);
    });
    root.setAttribute('data-palette', p.id);
    // Top of the scale: a deep version of the ramp colour's own hue, so it stays one colour
    // from faint to dark instead of drifting toward the ink.
    applyScale(SCALE_ID, p);
    try { localStorage.setItem('cookbook-palette', p.id); } catch (e) { /* private mode */ }
    return p;
  }

  function storedPalette() {
    try { return paletteById(localStorage.getItem('cookbook-palette') || DEFAULT_PALETTE).id; }
    catch (e) { return DEFAULT_PALETTE; }
  }
  // Factor ids are stored as F1..F22 and shown as HF1..HF22: the reader sees "human factor",
  // the data keeps the id the catalogue was coded with. Routes accept either spelling.
  /* Display ids. The data keeps the ids the corpus was coded with -- U01..U10 for the
     dimensions, F1..F22 for the human factors -- and those are what routes and files use.
     On screen they are renumbered into reading order, so D01..D10 runs down the matrix and
     HF1..HF21 runs across it. The maps are built from the data at mount. */
  var DIM_NUM = {}, DIM_OF_NUM = {}, FAC_NUM = {}, FAC_OF_NUM = {};

  function buildIds(d) {
    DIM_NUM = {}; DIM_OF_NUM = {}; FAC_NUM = {}; FAC_OF_NUM = {};
    var seat = 0;
    BANDS.forEach(function (b) {
      b.categories.forEach(function (cid) {
        seat++;
        DIM_NUM[cid] = seat;
        DIM_OF_NUM[seat] = cid;
      });
    });
    d.categories.forEach(function (c) {          // anything outside a stage keeps a number
      if (!DIM_NUM[c.category_id]) {
        seat++;
        DIM_NUM[c.category_id] = seat;
        DIM_OF_NUM[seat] = c.category_id;
      }
    });
    d.factors.forEach(function (f, i) {
      FAC_NUM[f.factor_id] = i + 1;
      FAC_OF_NUM[i + 1] = f.factor_id;
    });
  }

  function pad2(n) { return n < 10 ? '0' + n : String(n); }
  function facId(id) {
    var n = FAC_NUM[id];
    return n ? 'HF' + n : (id ? String(id).replace(/^F/, 'HF') : id);
  }
  function dimId(id) {
    var n = DIM_NUM[id];
    return n ? 'D' + pad2(n) : (id ? String(id).replace(/^U(\d)/, 'D$1') : id);
  }
  function unDimId(id) {
    var m = /^D(\d+)$/i.exec(id || '');
    return m ? (DIM_OF_NUM[+m[1]] || id) : id;
  }
  function unFacId(id) {
    var m = /^HF(\d+)$/i.exec(id || '');
    return m ? (FAC_OF_NUM[+m[1]] || id) : id;
  }
  // Prose carried in from the catalogue names sibling factors by their stored id
  function facText(t) { return t ? String(t).replace(/\bF(\d+)\b/g, function (_, n) { return facId('F' + n); }) : t; }

  function venueLabel(p) {
    var v = (p.venue || '').toUpperCase();
    return [v, p.year].filter(Boolean).join(' ');
  }
  function titleOf(p) { return p.title || 'Untitled record · rid ' + p.rid; }

  /* --------------------------------------------------------------- routing */

  function parseHash() {
    var raw = (location.hash || '#/').replace(/^#\/?/, '');
    var qi = raw.indexOf('?');
    var query = {};
    if (qi >= 0) {
      raw.slice(qi + 1).split('&').forEach(function (kv) {
        if (!kv) return;
        var i = kv.indexOf('=');
        var k = decodeURIComponent(i < 0 ? kv : kv.slice(0, i));
        var v = i < 0 ? '' : decodeURIComponent(kv.slice(i + 1).replace(/\+/g, ' '));
        query[k] = v;
      });
      raw = raw.slice(0, qi);
    }
    var parts = raw.split('/').filter(Boolean);
    return { view: parts[0] || 'home', id: parts[1] ? decodeURIComponent(parts[1]) : null, query: query };
  }

  // The five newest factors were renumbered out of the N-series. Old ids keep working —
  // in routes and in filter queries — so links made before the renumbering still land.
  var FACTOR_ID_REMAP = { N1: 'F19', N2: 'F20', N3: 'F21', N4: 'F22' };
  function remapFactorId(id) { return FACTOR_ID_REMAP[id] || id; }

  // Three patterns were withdrawn on review. Their routes say so rather than 404-ing.
  var RETIRED_PATTERNS = {
    'pat-008': 'feedforward preview of a control’s outcome before acting',
    'pat-073': 'deliberately narrowed output bandwidth to a nonvisual channel',
    'pat-084': 'the system’s participants presented as one kind of entity while composed of another'
  };

  // The 15-pattern model is retired. Its routes resolve to the current equivalents and
  // announce themselves rather than silently posing as new patterns.
  function normalizeRoute(r) {
    var legacy = null;
    if (r.view === 'dimension') r = { view: 'category', id: unDimId(r.id), query: r.query };
    else if (r.view === 'category' && /^D\d+$/i.test(r.id || '')) r = { view: 'category', id: unDimId(r.id.toUpperCase()), query: r.query };
    else if (r.view === 'Dimensions') r = { view: 'patterns', id: null, query: r.query };
    if (r.view === 'factor' && /^HF\d+$/i.test(r.id || '')) r = { view: 'factor', id: unFacId(r.id.toUpperCase()), query: r.query };
    if (r.view === 'paradigms') { r = { view: 'patterns', id: null, query: r.query }; legacy = { kind: 'pattern' }; }
    else if (r.view === 'paradigm') { legacy = { kind: 'pattern', code: r.id }; r = { view: 'patterns', id: null, query: r.query }; }
    else if (r.view === 'difficulties') { r = { view: 'factors', id: null, query: r.query }; legacy = { kind: 'factor' }; }
    else if (r.view === 'difficulty') { legacy = { kind: 'factor', code: r.id }; r = { view: 'factor', id: remapFactorId(r.id), query: r.query }; }
    else if (r.view === 'factor' && FACTOR_ID_REMAP[r.id]) {
      legacy = { kind: 'renumbered', code: r.id, now: FACTOR_ID_REMAP[r.id] };
      r = { view: 'factor', id: FACTOR_ID_REMAP[r.id], query: r.query };
    }
    else if (r.view === 'pattern' && RETIRED_PATTERNS[r.id]) {
      legacy = { kind: 'retired', code: r.id, name: RETIRED_PATTERNS[r.id] };
      r = { view: 'patterns', id: null, query: r.query };
    }
    if (r.query && r.query.c) {
      r.query = Object.assign({}, r.query, {
        c: r.query.c.split(',').map(function (x) { return unDimId(x.toUpperCase()); }).join(',')
      });
    }
    if (r.query && r.query.f) {
      r.query = Object.assign({}, r.query, {
        f: r.query.f.split(',').map(function (x) { return remapFactorId(unFacId(x.toUpperCase())); }).join(',')
      });
    }
    return { route: r, legacy: legacy };
  }

  function go(href) { location.hash = href; }
  function qs(params) {
    var out = [];
    Object.keys(params).forEach(function (k) {
      var v = params[k];
      if (v == null || v === '' || (Array.isArray(v) && !v.length)) return;
      out.push(encodeURIComponent(k) + '=' + encodeURIComponent(Array.isArray(v) ? v.join(',') : v));
    });
    return out.length ? '?' + out.join('&') : '';
  }
  function papersHref(f) { return '#/papers' + qs(f); }

  /* ------------------------------------------------------------------ data */

  function buildIndex(d) {
    var ix = {
      paper: {}, pattern: {}, category: {}, factor: {}, sub: {},
      patEdgesByPattern: {}, patEdgesByPaper: {},
      facEdgesByFactor: {}, facEdgesByPaper: {}, facEdgesBySub: {},
      patternsOfPaper: {}, factorsOfPaper: {}
    };
    d.papers.forEach(function (p) { ix.paper[p.rid] = p; });
    d.patterns.forEach(function (p) { ix.pattern[p.pattern_id] = p; });
    d.categories.forEach(function (c) { ix.category[c.category_id] = c; });
    d.factors.forEach(function (f) {
      ix.factor[f.factor_id] = f;
      f.sub_factors.forEach(function (s) { ix.sub[s.sub_factor_id] = Object.assign({ factor_id: f.factor_id }, s); });
    });
    d.paper_patterns.forEach(function (e) {
      (ix.patEdgesByPattern[e.pattern_id] = ix.patEdgesByPattern[e.pattern_id] || []).push(e);
      (ix.patEdgesByPaper[e.rid] = ix.patEdgesByPaper[e.rid] || []).push(e);
    });
    d.paper_factors.forEach(function (e) {
      (ix.facEdgesByFactor[e.factor_id] = ix.facEdgesByFactor[e.factor_id] || []).push(e);
      (ix.facEdgesByPaper[e.rid] = ix.facEdgesByPaper[e.rid] || []).push(e);
      (ix.facEdgesBySub[e.sub_factor_id] = ix.facEdgesBySub[e.sub_factor_id] || []).push(e);
    });
    // membership sets for filtering; counts are always over distinct rids
    ix.ridsOfPattern = {}; ix.ridsOfCategory = {}; ix.ridsOfFactor = {}; ix.ridsOfSub = {};
    Object.keys(d.indexes.by_pattern).forEach(function (k) { ix.ridsOfPattern[k] = new Set(d.indexes.by_pattern[k].rids); });
    Object.keys(d.indexes.by_category).forEach(function (k) { ix.ridsOfCategory[k] = new Set(d.indexes.by_category[k].rids); });
    Object.keys(d.indexes.by_factor).forEach(function (k) { ix.ridsOfFactor[k] = new Set(d.indexes.by_factor[k].rids); });
    Object.keys(d.indexes.by_sub_factor).forEach(function (k) { ix.ridsOfSub[k] = new Set(d.indexes.by_sub_factor[k].rids); });
    return ix;
  }

  /* ------------------------------------------------------------ primitives */

  function Chip(props) {
    var inner = [
      props.code ? h('span', { className: 'mono', key: 'c' }, props.code) : null,
      h('span', { key: 't' }, props.children)
    ];
    if (props.href) return h('a', { className: cx('chip', props.className), href: props.href, title: props.title, style: props.style }, inner);
    return h('span', { className: cx('chip', props.className), title: props.title, style: props.style }, inner);
  }

  function UiUxChip(props) {
    return h(Chip, { className: props.type === 'UI' ? 'chip-ui' : 'chip-ux', title: props.rationale }, props.type + '-led');
  }

  function Bar(props) {
    return h('div', { className: 'bar', title: props.title },
      h('i', { style: { width: Math.max(1.5, props.value * 100) + '%', background: props.color || null } }));
  }

  /* A row of tabs. Both catalogue pages ran to a single page of every card at once, which
     was several screens of scrolling; the tabs cut it to one group at a time. `items` are
     {id, label, code, count, band}, and a count of 0 is shown but not clickable. */
  function Tabs(props) {
    return h('div', {
      className: cx('tabs', props.className), role: 'tablist',
      // a whole row can take one stage's colour; a per-item band overrides it below
      style: props.band ? bandStyle(props.band) : null
    }, props.items.map(function (it) {
      var on = it.id === props.value;
      return h('button', {
        key: it.id, role: 'tab', type: 'button', 'aria-selected': on ? 'true' : 'false',
        className: cx('tab', on && 'on', it.count === 0 && 'off'),
        style: it.band ? bandStyle(it.band) : null,
        title: it.title || null,
        onClick: function () { if (it.count !== 0) props.onPick(it.id); }
      }, [
        it.code ? h('span', { className: 'tab-code', key: 'c' }, it.code) : null,
        h('span', { className: 'tab-label', key: 'l' }, it.label),
        it.count != null ? h('span', { className: 'tab-n', key: 'n' }, it.count) : null
      ]);
    }));
  }

  function SectionHead(props) {
    return h('div', { className: 'sec-head' }, [
      h('h2', { key: 'h' }, props.title),
      props.note ? h('p', { className: 'small dim', key: 'n', style: { marginLeft: 'auto', maxWidth: '52ch' } }, props.note) : null
    ]);
  }

  // Cell content lives inside a clipping wrapper: the slide animates the wrapper's height
  // from zero to auto (grid 0fr -> 1fr), which is how Svelte's `slide` collapses an element
  // — the rows below travel with it instead of the row fading in place.
  function slot(child) {
    return h('div', { className: 'slot' }, h('div', { className: 'slot-in' }, child));
  }

  /* Lucide icons, inlined: the page fetches nothing, so the marks travel with it.
     Paths are verbatim from lucide.dev (ISC), drawn on their 24x24 grid. */
  var ICONS = {
    'arrow-right': ['M5 12h14', 'm12 5 7 7-7 7'],
    plus: ['M5 12h14', 'M12 5v14']
  };
  function icon(name, size) {
    return h('svg', {
      className: 'icon', width: size || 20, height: size || 20, viewBox: '0 0 24 24',
      fill: 'none', stroke: 'currentColor', strokeWidth: 2,
      strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true'
    }, ICONS[name].map(function (dd, i) { return h('path', { key: i, d: dd }); }));
  }

  function Empty(props) { return h('p', { className: 'small dim', style: { padding: '18px 0' } }, props.children); }

  // Each of the three reading stages carries its own hue, supplied by the active palette.
  // The factors are one family with one colour, the way each stage is. Mapping it onto the
  // same --bc-* names lets a factor page wear the marks a stage page wears without a second
  // set of rules.
  function factorStyle() {
    return {
      '--bc': 'var(--accent-ink)',
      '--bc-pale': 'var(--accent-pale)',
      '--bc-soft': 'var(--accent-ink)',
      '--bc-text': 'var(--accent-ink)',
      '--bc-on': '#ffffff'
    };
  }

  function bandStyle(band) {
    if (!band || !band.key) return null;
    return {
      '--bc': 'var(--' + band.key + ')',
      '--bc-pale': 'var(--' + band.key + '-pale)',
      '--bc-soft': 'var(--' + band.key + '-soft)',
      '--bc-text': 'var(--' + band.key + '-text)',
      '--bc-on': 'var(--' + band.key + '-on)'
    };
  }

  function BandHead(props) {
    return h('div', { className: 'band-head', style: bandStyle(props.band) }, [
      h('h3', { key: 'n' }, props.band.name),
      h('p', { className: 'tiny', key: 'g' }, props.band.gloss),
      props.count ? h('span', { className: 'tiny dim', key: 'c' }, props.count) : null
    ]);
  }

  /* ---------------------------------------------------------- paper pieces */

  /* Every pattern a paper carries, in the colour of the stage its dimension belongs to,
     so a row of chips reads as a position in the four-stage arc rather than a list. */
  function PatternChips(props) {
    var ix = props.ix, ids = props.ids;
    return h('div', { className: 'chips' }, ids.map(function (id) {
      var p = ix.pattern[id];
      if (!p) return null;
      return h(Chip, {
        key: id, className: 'chip-pat', style: bandStyle(BAND_OF[p.category_id]),
        code: p.pattern_id.replace('pat-', ''), href: '#/pattern/' + id,
        title: (p.description ? p.description + ' — ' : '') + p.short_summary
      }, p.pattern_name);
    }));
  }

  // The factors alongside them, in one colour of their own: they are a different taxonomy,
  // not another stage.
  function FactorChips(props) {
    var ix = props.ix, ids = props.ids;
    return h('div', { className: 'chips' }, ids.map(function (id) {
      var f = ix.factor[id];
      if (!f) return null;
      return h(Chip, {
        key: id, className: 'chip-fac', code: facId(f.factor_id), href: '#/factor/' + id,
        title: f.definition || ''
      }, f.factor_name);
    }));
  }

  function PaperRow(props) {
    var p = props.paper, ix = props.ix;
    var meta = [venueLabel(p), plural(p.pattern_ids.length, 'pattern'), plural(p.factor_ids.length, 'factor')];
    if (props.metaExtra) meta = meta.concat(props.metaExtra);
    return h('a', { className: 'prow', href: '#/paper/' + p.rid }, [
      h('h3', { key: 't' }, titleOf(p)),
      h('div', { className: 'meta', key: 'm' }, meta.filter(Boolean).join('  ·  ')),
      props.quote ? h('p', { className: 'quote', key: 'q' }, '“' + props.quote + '”') : null,
      props.chips !== false && p.pattern_ids.length
        ? h(PatternChips, { key: 'c', ix: ix, ids: p.pattern_ids })
        : null,
      props.chips !== false && p.factor_ids.length
        ? h(FactorChips, { key: 'f', ix: ix, ids: p.factor_ids })
        : null
    ]);
  }

  function PaperList(props) {
    var step = props.step || 25;
    var st = useState(step), n = st[0], setN = st[1];
    var qs = useState(''), q = qs[0], setQ = qs[1];
    useEffect(function () { setN(step); setQ(''); }, [props.resetKey]);

    var needle = q.trim().toLowerCase();
    // Newest first, whatever order the caller assembled them in. Ties keep that order, so
    // within a year the central papers still lead.
    var rows = props.rows.slice().sort(function (a, b) {
      return (b.paper.year || 0) - (a.paper.year || 0);
    });
    var shown = !needle ? rows : rows.filter(function (r) {
      return (titleOf(r.paper) + ' ' + venueLabel(r.paper) + ' ' + (r.quote || '') + ' ' +
        (r.metaExtra || []).join(' ')).toLowerCase().indexOf(needle) >= 0;
    });

    // A pattern can carry 300 papers, which is more page than anyone wants to scroll past.
    // In panel mode the list keeps its own scrollbar and the whole set is in it, so the
    // sections below stay within reach.
    var panel = props.panel;
    var list = panel ? shown : shown.slice(0, n);

    var search = props.searchable ? h('div', { className: 'plist-search', key: 's' }, [
      h('input', {
        key: 'i', className: 'search', value: q, placeholder: 'Filter these papers by title, venue or quote…',
        onChange: function (e) { setQ(e.target.value); setN(step); }
      }),
      h('span', { className: 'tiny dim', key: 'c' },
        needle ? shown.length + ' of ' + rows.length : plural(rows.length, 'paper'))
    ]) : null;

    if (!rows.length) return h('div', null, [search, h(Empty, { key: 'e' }, props.emptyText || 'No papers match.')]);

    var body = !shown.length
      ? h(Empty, { key: 'e' }, 'No paper here matches that filter.')
      : h('div', { className: cx('plist', panel && 'plist-panel'), key: 'l' }, list.map(function (r) {
          return h(PaperRow, { key: r.paper.rid, paper: r.paper, ix: props.ix, quote: r.quote, metaExtra: r.metaExtra, chips: props.chips });
        }));

    return h('div', null, [
      search,
      body,
      panel ? null : h('div', { key: 'f', style: { display: 'flex', gap: '12px', alignItems: 'center', marginTop: '16px' } }, [
        n < shown.length
          ? h('button', { className: 'btn', key: 'b', onClick: function () { setN(n + 25); } }, 'Show more papers')
          : null,
        h('span', { className: 'tiny', key: 's' }, 'Showing ' + Math.min(n, shown.length) + ' of ' + shown.length + ' papers')
      ])
    ]);
  }

  /* ------------------------------------------------------------------ home */

  // A gap between factor groups, as its own column rather than a fat border: a border
  // widens the first column of each group, and every cell in the grid has to be the same
  // size for the shading to be read as one scale.
  function withColGaps(items, groupStart, tag) {
    var out = [];
    items.forEach(function (node, i) {
      // `true` means every item starts a group -- the group band row, where each cell is
      // already one whole group
      if (i && (groupStart === true || groupStart[i])) {
        out.push(h(tag || 'td', { className: 'colgap', key: 'gap-' + i }));
      }
      out.push(node);
    });
    return out;
  }

  function Matrix(props) {
    var d = props.d, ix = props.ix;
    var hov = useState(null), hover = hov[0], setHover = hov[1];
    var sel = useState(null), selected = sel[0], setSelected = sel[1];

    var md = useState('absolute'), mode = md[0], setMode = md[1];
    var cl = useState({}), collapsed = cl[0], setCollapsed = cl[1];
    var cg = useState({}), closing = cg[0], setClosing = cg[1];
    var timers = useRef([]);
    var headRef = useRef(null);
    var leadRef = useRef(null);
    useEffect(function () {
      return function () { timers.current.forEach(clearTimeout); };
    }, []);

    // Each column's dotted leader runs from where its label begins -- the "HFx" end of the
    // rotated text, at the label's bottom-left -- down to the middle of the first cell in
    // that column that carries a count. The leaders are drawn in an overlay on the table
    // rather than inside the header cells, so they scroll away with the grid instead of
    // sticking to the top with the labels. Offsets are used, not client rects: the header
    // is sticky, so its rect moves as the page scrolls while its offsets stay put.
    useEffect(function () {
      var head = headRef.current, lead = leadRef.current;
      if (!head || !lead) return;
      var heads = [].slice.call(head.querySelectorAll('.colhead'));
      var body = head.parentNode.querySelector('tbody');
      var firstCells = body ? [].slice.call(body.querySelectorAll('tr')).reduce(function (acc, tr) {
        if (acc) return acc;
        var cells = [].slice.call(tr.querySelectorAll('.cell'));
        return cells.some(function (c) { return c.textContent.trim(); }) ? cells : null;
      }, null) : null;
      // Measured against the overlay's own box. A cell's offsetHeight is 0 -- its height comes
      // from the slide wrapper inside it -- so rects are used, and the overlay is not sticky,
      // which keeps these numbers true at any scroll position.
      var marks = [].slice.call(lead.children);
      var pad = lead.parentNode.getBoundingClientRect();
      var lastRow = head.rows[head.rows.length - 1];   // the group band, under the labels
      var start = lastRow.getBoundingClientRect().bottom - pad.top;
      marks.forEach(function (mark, i) {
        var th = heads[i], cell = firstCells && firstCells[i];
        if (!th || !cell) { mark.style.display = 'none'; return; }
        var cr = cell.getBoundingClientRect(), tr = th.getBoundingClientRect();
        var end = cr.top + cr.height / 2 - pad.top;
        mark.style.display = end > start ? 'block' : 'none';
        mark.style.left = Math.round(tr.left + tr.width / 2 - pad.left) + 'px';
        mark.style.top = Math.round(start) + 'px';
        mark.style.height = Math.max(0, Math.round(end - start)) + 'px';
      });
    });

    var cols = d.factors;

    // The factor columns already run in group order, so each group is a contiguous span:
    // [{group, from, span}], used for the band above the labels and the column rules.
    var colGroups = (function () {
      var out = [], byId = {};
      (d.factor_groups || []).forEach(function (g) { byId[g.group_id] = g; });
      cols.forEach(function (f, i) {
        var gid = f.factor_group_id;
        var last = out[out.length - 1];
        if (last && last.id === gid) { last.span++; return; }
        out.push({ id: gid, name: f.factor_group_name || (byId[gid] || {}).group_name || '', from: i, span: 1 });
      });
      return out;
    })();
    var groupStart = {};
    colGroups.forEach(function (g) { groupStart[g.from] = true; });
    var nGaps = Math.max(0, colGroups.length - 1);   // the spacer columns between groups

    // What a pattern returns for the trouble of building it, in two halves weighted equally:
    // how many human factors it serves above the corpus base rate (its distinctive breadth),
    // and how much of the field has already built it (log paper count, so the first hundred
    // papers count for more than the next hundred). Each half is scaled to the strongest
    // pattern in the catalogue, so ROI runs 0..1.
    var roiOf = useMemo(function () {
      var dbMax = 0, lpMax = 0;
      d.patterns.forEach(function (p) {
        if (p.distinctive_breadth > dbMax) dbMax = p.distinctive_breadth;
        var lp = Math.log(1 + p.mapped_paper_count);
        if (lp > lpMax) lpMax = lp;
      });
      var out = {};
      d.patterns.forEach(function (p) {
        var reach = dbMax ? p.distinctive_breadth / dbMax : 0;
        var built = lpMax ? Math.log(1 + p.mapped_paper_count) / lpMax : 0;
        out[p.pattern_id] = 0.5 * reach + 0.5 * built;
      });
      return out;
    }, [d]);

    // A collapsed category is one row of distinct papers, not a column-wise sum: a paper
    // holding two patterns of the same category counts once. Built by intersecting the
    // category's rid set with each factor's rid set, so it never double-counts.
    var catXfactor = useMemo(function () {
      var out = {};
      d.categories.forEach(function (c) {
        var cr = ix.ridsOfCategory[c.category_id] || new Set();
        var row = {};
        cols.forEach(function (f) {
          var fr = ix.ridsOfFactor[f.factor_id] || new Set();
          var small = cr.size <= fr.size ? cr : fr, big = small === cr ? fr : cr;
          var n = 0;
          small.forEach(function (rid) { if (big.has(rid)) n++; });
          if (n) row[f.factor_id] = n;
        });
        out[c.category_id] = row;
      });
      return out;
    }, [d, ix]);

    // Every category keeps one permanent row — its aggregate, with the toggle in the row
    // head — and that row never animates. Only the pattern rows underneath it come and go,
    // so the slide has a fixed anchor to open out of and fold back into.
    var groups = [];
    var lastCat = null;
    bandedPatterns(d).forEach(function (p) {
      if (p.category_id !== lastCat) {
        lastCat = p.category_id;
        groups.push({ cat: ix.category[p.category_id], band: BAND_OF[p.category_id], patterns: [] });
      }
      groups[groups.length - 1].patterns.push(p);
    });

    groups.forEach(function (g) {
      var cid = g.cat.category_id;
      g.collapsed = !!collapsed[cid];
      g.closing = !!closing[cid];
      // The dimension's row is always there as its label and toggle, but it only carries
      // the aggregated counts while its patterns are hidden: open, the patterns are the
      // reading, and repeating their union above them would just be a second scale to read.
      g.catRow = {
        key: 'cat:' + cid, kind: 'category', id: cid, code: cid, name: g.cat.category_name,
        title: g.collapsed
          ? plural(g.patterns.length, 'pattern') + ' aggregated — ' + g.cat.category_description
          : g.cat.category_description,
        counts: catXfactor[cid] || {},
        total: d.indexes.by_category[cid].mapped_paper_count,
        blank: !g.collapsed
      };
      // Patterns stay mounted through a close so they can slide out before they go.
      // UX-led before UI-led, and inside each lens the most-carried pattern first
      var ordered = g.patterns.slice().sort(function (a, b) {
        if (a.lens_order !== b.lens_order) return a.lens_order - b.lens_order;
        return (b.mapped_paper_count - a.mapped_paper_count) || (a.pattern_id < b.pattern_id ? -1 : 1);
      });
      g.patternRows = (g.collapsed && !g.closing) ? [] : ordered.map(function (p) {
        return {
          key: 'pat:' + p.pattern_id, kind: 'pattern', id: p.pattern_id,
          code: p.pattern_id.replace('pat-', ''), name: p.pattern_name,
          title: (p.description ? p.description + ' — ' : '') + p.short_summary +
            '  ·  ROI ' + roiOf[p.pattern_id].toFixed(2) + ' (' + plural(p.distinctive_breadth, 'factor') +
            ' above base rate, ' + plural(p.mapped_paper_count, 'paper') + ')',
          href: '#/pattern/' + p.pattern_id, counts: d.indexes.pattern_x_factor[p.pattern_id] || {},
          total: p.mapped_paper_count, lens: p.ui_ux_type
        };
      });
      g.rows = [g.catRow].concat(g.patternRows);
    });

    // The scale is measured over the cells actually on screen: aggregated rows where a
    // dimension is closed, pattern rows where it is open. Mixed states measure both.
    var display = groups.reduce(function (acc, g) {
      return acc.concat(g.collapsed ? [g.catRow] : g.patternRows);
    }, []);

    // Two shading scales over the same counts.
    //   row      — the cell as a share of its row's own papers, normalized by the largest
    //              such share. Big and small rows stay comparable.
    //   absolute — the raw count placed between the smallest and largest cell on screen.
    //              Comparable across the grid, but large rows dominate.
    // One scale over every cell on screen, category rows included, so any two cells in the
    // matrix can be compared directly.
    function scaleOf(rows) {
      var sc = { maxShare: 0, minCell: Infinity, maxCell: 0, any: false };
      rows.forEach(function (r) {
        Object.keys(r.counts).forEach(function (f) {
          var n = r.counts[f];
          if (!n) return;
          sc.any = true;
          var share = n / (r.total || 1);
          if (share > sc.maxShare) sc.maxShare = share;
          if (n < sc.minCell) sc.minCell = n;
          if (n > sc.maxCell) sc.maxCell = n;
        });
      });
      if (!sc.any) { sc.minCell = 0; sc.maxShare = 1; }
      sc.spread = Math.max(1, sc.maxCell - sc.minCell);
      return sc;
    }

    var scale = scaleOf(display);
    var maxShare = scale.maxShare, minCell = scale.minCell, maxCell = scale.maxCell;

    function intensity(n, share) {
      if (!n) return 0;
      return mode === 'row' ? share / scale.maxShare : (n - scale.minCell) / scale.spread;
    }

    // Rows slide the way Svelte's `slide` transition does: their own height collapses to
    // zero behind a clip, so the rows below travel with them rather than the row fading in
    // place. Opening is immediate; closing plays the reverse first, then swaps in the
    // aggregate row — CLOSE_MS matches the CSS duration.
    var CLOSE_MS = 400;

    function markClosing(ids) {
      if (!ids.length) return false;
      setClosing(function (c) {
        var n = Object.assign({}, c);
        ids.forEach(function (id) { n[id] = true; });
        return n;
      });
      var t = setTimeout(function () {
        setCollapsed(function (prev) {
          var n = Object.assign({}, prev);
          ids.forEach(function (id) { n[id] = true; });
          return n;
        });
        setClosing(function (c) {
          var n = Object.assign({}, c);
          ids.forEach(function (id) { delete n[id]; });
          return n;
        });
      }, CLOSE_MS);
      timers.current.push(t);
      return true;
    }

    function toggleCat(cid) {
      setSelected(null);
      if (collapsed[cid]) {
        var next = Object.assign({}, collapsed);
        delete next[cid];
        setCollapsed(next);
        return;
      }
      markClosing([cid]);
    }

    function setAll(on) {
      setSelected(null);
      if (!on) { setCollapsed({}); return; }
      markClosing(d.categories
        .map(function (c) { return c.category_id; })
        .filter(function (id) { return !collapsed[id]; }));
    }

    var allCollapsed = d.categories.every(function (c) {
      return collapsed[c.category_id] || closing[c.category_id];
    });

    // One ramp per stage: the cells are shaded in the colour of the stage their row sits in,
    // so the grid carries the same four-colour reading the rest of the page does.
    var pvars = paletteById(props.palette).vars;
    var ramps = {};
    function rampFor(band) {
      if (!band || !band.key) return null;
      if (!ramps[band.key]) ramps[band.key] = rampOf(pvars['--' + band.key]);
      return ramps[band.key];
    }

    var body = [];
    var lastBand = null;
    groups.forEach(function (g) {
      var cid = g.cat.category_id;
      var rp = rampFor(g.band);
      if (g.band && g.band !== lastBand) {
        lastBand = g.band;
        body.push(h('tr', { className: 'bandhead', key: 'band-' + g.band.name, style: bandStyle(g.band) },
          h('td', { colSpan: cols.length + 1 + nGaps }, g.band.name)));
      }
      var open = !g.collapsed || g.closing;

      var lastLens = null;
      g.rows.forEach(function (r, ri) {
        var dimRow = hover && hover.p !== r.key;
        var isAgg = r.kind === 'category';
        if (!isAgg && r.lens !== lastLens) {
          lastLens = r.lens;
          var n = g.patternRows.filter(function (x) { return x.lens === r.lens; }).length;
          body.push(h('tr', {
            className: cx('lenshead mrow', g.closing && 'row-out'),
            key: 'lens-' + cid + '-' + r.lens, style: bandStyle(g.band)
          }, h('td', { colSpan: cols.length + 1 + nGaps }, slot(h('span', { className: 'lenshead-in' },
            h('span', {
              className: 'lens-tag ' + (r.lens === 'UI' ? 'chip-ui' : 'chip-ux'),
              title: plural(n, 'pattern')
            }, r.lens + '-led'))))));
        }
        body.push(h('tr', {
          key: r.key,
          // The category row is permanent, so it carries no slide classes at all.
          className: isAgg ? 'aggrow' : cx('mrow', g.closing && 'row-out'),
          style: bandStyle(g.band)
        }, [
          h('th', { className: 'rowhead', key: 'rh', style: { opacity: dimRow && hover.f == null ? 0.4 : 1 } },
            // An aggregated category is a control, not a link: the category page is reachable
            // from the readout after clicking a cell, not from the matrix scaffolding.
            slot(isAgg
              ? h('button', {
                  className: 'rowhead-toggle', 'aria-expanded': open,
                  title: dimId(cid) + ' — ' + plural(g.patterns.length, 'pattern') + ' · ' +
                    d.indexes.by_category[cid].mapped_paper_count.toLocaleString() + ' papers, aggregated — ' +
                    (open ? 'collapse to the aggregate row' : 'expand into its patterns'),
                  onClick: function () { toggleCat(cid); }
                }, [
                  h('span', { className: 'mono', key: 'c' }, dimId(r.code)),
                  h('span', { className: 'nm', key: 'n' }, r.name)
                ])
              : h('a', { href: r.href, title: r.title }, [
                  h('span', { className: 'mono', key: 'c' }, r.code),
                  h('span', { key: 'n' }, r.name)
                ])))
        ].concat(withColGaps(cols.map(function (f, ci) {
          var n = r.blank ? 0 : (r.counts[f.factor_id] || 0);
          var share = n / (r.total || 1);
          var t = intensity(n, share);
          var on = hover && (hover.p === r.key || hover.f === f.factor_id);
          var isSel = selected && selected.key === r.key && selected.f === f.factor_id;
          return h('td', {
            key: f.factor_id,
            // A dimension row with its patterns open carries no counts, so its cells are
            // scaffolding: the group separators would hang there as loose vertical dashes.
            className: cx('cell', !n && 'empty', r.blank && 'blank', groupStart[ci] && 'group-start'),
            title: r.blank ? '' : r.name + ' × ' + f.factor_name + ' — ' + plural(n, 'paper') +
              (r.kind === 'category' ? ' (distinct across the dimension)' : '') + ', ' +
              pct(n, r.total) + '% of this ' + (r.kind === 'category' ? 'dimension' : 'pattern') + ', ' +
              pct(n, f.mapped_paper_count) + '% of this factor',
            style: {
              background: n ? tint(t, rp) : 'transparent',
              color: cellInk(t, rp),
              opacity: !hover || on ? 1 : 0.28,
              boxShadow: isSel ? 'inset 0 0 0 2px var(--ink)' : 'none'
            },
            onMouseEnter: function () { setHover({ p: r.key, f: f.factor_id }); },
            onClick: function () {
              setSelected(n ? { key: r.key, kind: r.kind, id: r.id, name: r.name, total: r.total, f: f.factor_id, n: n } : null);
            }
          }, slot(n || ''));
        }), groupStart))));
      });
    });

    var readout = null;
    if (selected) {
      var f = ix.factor[selected.f];
      var isCat = selected.kind === 'category';
      readout = h('div', { className: 'readout', style: { marginTop: '16px' } }, [
        h('div', { className: 'kicker', key: 'k' },
          (isCat ? dimId(selected.id) : selected.id) + ' × ' + facId(f.factor_id) + (isCat ? ' · aggregated' : '')),
        h('h3', { key: 'h', style: { margin: '8px 0 6px' } }, selected.name + '  ×  ' + f.factor_name),
        h('p', { className: 'small', key: 'n' },
          plural(selected.n, 'paper') + ' carry both — ' + pct(selected.n, selected.total) + '% of this ' +
          (isCat ? 'dimension' : 'pattern') + ', ' + pct(selected.n, f.mapped_paper_count) + '% of this factor.' +
          (isCat ? ' Papers holding several patterns of this dimension are counted once.' : '')),
        h('div', { className: 'tag-row', key: 'l', style: { marginTop: '12px' } }, [
          h('a', {
            className: 'chip', key: 'a',
            href: papersHref(isCat ? { c: selected.id, f: f.factor_id } : { p: selected.id, f: f.factor_id })
          }, 'Browse these papers'),
          h('a', { className: 'chip', key: 'b', href: (isCat ? '#/category/' : '#/pattern/') + selected.id },
            isCat ? 'Dimension page' : 'Pattern page'),
          h('a', { className: 'chip', key: 'c', href: '#/factor/' + f.factor_id }, 'Factor page'),
          h('button', { className: 'chip', key: 'd', onClick: function () { setSelected(null); } }, 'Clear')
        ])
      ]);
    }

    // The controls and the ramp legend sit above the grid rather than in its empty corner:
    // in the corner they were bounded by the row-head column, which is narrow, and they
    // scrolled sideways with the header.
    var controls = h('div', { className: 'matrix-controls', key: 'ctl' }, [

        h('div', { className: 'ctl', key: 'rows' }, [
          h('span', { className: 'ctl-l', key: 'l' }, 'Rows'),
          h('button', {
            key: 'b', className: cx('btn', 'toggle-all', allCollapsed && 'on'),
            'aria-pressed': allCollapsed,
            title: allCollapsed
              ? 'Expand every dimension back into its patterns.'
              : 'Collapse every dimension into one aggregated row.',
            onClick: function () { setAll(!allCollapsed); }
          }, allCollapsed ? 'Expand all' : 'Collapse all')
        ]),
        h('div', { className: 'ctl', key: 'shade' }, [
          h('span', { className: 'ctl-l', key: 'l' }, 'Shade by'),
          h('div', { className: 'tag-row', key: 'tg' }, [
            { key: 'absolute', label: 'Absolute count', title: 'Each cell placed between the smallest and largest cell on screen — comparable across the whole grid.' },
            { key: 'row', label: 'Share of row', title: 'Each cell as a share of that row’s own papers — large and small rows stay comparable.' }
          ].map(function (o) {
            return h('button', {
              key: o.key, className: cx('btn', mode === o.key && 'on'), title: o.title,
              onClick: function () { setMode(o.key); }
            }, o.label);
          }))
        ]),
        // the ramp legend rides with the controls, so it stays readable while scrolling
        h('div', { className: 'matrix-legend', key: 'legend' }, [
          h('span', { key: 'lo' }, mode === 'row' ? '0%' : minCell + (minCell === 1 ? ' paper' : ' papers')),
          // Each swatch carries all four stage ramps at that step, since a cell is
          // shaded in the colour of the stage its row belongs to.
          h('span', { className: 'swatches', key: 'sw' }, [0.05, 0.3, 0.55, 0.8, 1].map(function (t, i) {
            var stops = BANDS.map(function (b, bi) {
              var c = tint(t, rampFor(b));
              return c + ' ' + (bi * 25) + '%, ' + c + ' ' + ((bi + 1) * 25) + '%';
            }).join(', ');
            return h('i', { key: i, style: { backgroundImage: 'linear-gradient(180deg, ' + stops + ')' } });
          })),
          h('span', { key: 'hi' }, mode === 'row'
            ? Math.round(maxShare * 100) + '% of a row’s papers'
            : maxCell + ' papers')
        ]),
        SHOW_SCALE_PICKER ? h('div', { className: 'ctl', key: 'scale' }, [
          h('span', { className: 'ctl-l', key: 'l' }, 'Scale'),
          h('div', { className: 'scale-row', key: 'sr' }, SCALES.map(function (o) {
            return h('button', {
              key: o.id, className: cx('scale-dot', props.scale === o.id && 'on'),
              title: o.name + (o.hex ? ' — ' + o.hex : ' — follows the palette'),
              'aria-label': 'Shade the matrix in ' + o.name, 'aria-pressed': props.scale === o.id,
              style: { background: o.hex || 'var(--accent)' },
              onClick: function () { props.onScale(o.id); }
            });
          }).concat([
            // any other colour: the swatch is the picker
            h('label', {
              key: 'custom', className: cx('scale-dot', 'scale-custom', isHex(props.scale) && 'on'),
              title: isHex(props.scale) ? 'Custom — ' + props.scale : 'Pick any colour',
              style: isHex(props.scale) ? { background: props.scale } : null
            }, h('input', {
              type: 'color', 'aria-label': 'Pick a colour to shade the matrix',
              value: scaleBase(props.scale, paletteById(props.palette)),
              onChange: function (e) { props.onScale(e.target.value); }
            }))
          ]))
        ]) : null
    ]);

    return h('div', null, [
      controls,
      h('div', { className: 'matrix-scroll', key: 'm', onMouseLeave: function () { setHover(null); } },
        h('div', { className: 'matrix-pad' }, [
          h('div', { className: 'leaders', key: 'ld', ref: leadRef, 'aria-hidden': 'true' },
            cols.map(function (f) { return h('i', { key: f.factor_id }); })),
          h('table', { className: 'matrix', key: 'tbl' }, [
            h('thead', { key: 'h', ref: headRef }, [
              h('tr', { key: 'lh' }, [
              h('th', { className: 'rowhead', key: 'x', style: { zIndex: cols.length + 20 } })
            ].concat(
              withColGaps(cols.map(function (f, ci) {
                // A rotated label overhangs the cells to its right, so the columns are
                // stacked left-over-right; otherwise a neighbour's background would clip it.
                return h('th', {
                  className: cx('colhead', groupStart[ci] && 'group-start'), key: f.factor_id,
                  style: { opacity: !hover || hover.f === f.factor_id ? 1 : 0.4, zIndex: cols.length - ci + 10 }
                },
                  h('div', null, h('a', { href: '#/factor/' + f.factor_id }, facId(f.factor_id) + '  ' + f.factor_name)));
              }), groupStart, 'th'))),
              // the groups the factors are read in, banded under their labels and over the grid
              h('tr', { className: 'grouphead', key: 'gh' }, [
                h('th', { key: 'x', className: 'rowhead', style: { zIndex: cols.length + 21 } })
              ].concat(withColGaps(colGroups.map(function (g) {
                return h('th', { key: g.id, colSpan: g.span, className: 'grouphead-cell', title: g.name },
                  h('span', null, g.name));
              }), true, 'th')))
            ]),
            h('tbody', { key: 'b' }, body)
          ])
        ])),
      readout
    ]);
  }

  function Home(props) {
    var d = props.d, ix = props.ix;
    var topPatterns = d.patterns.slice().sort(function (a, b) { return b.mapped_paper_count - a.mapped_paper_count; }).slice(0, 6);
    var topFactors = d.factors.slice().sort(function (a, b) { return b.mapped_paper_count - a.mapped_paper_count; }).slice(0, 6);
    var maxCat = Math.max.apply(null, d.categories.map(function (c) { return d.indexes.by_category[c.category_id].mapped_paper_count; }));

    return h('div', null, [
      h('div', { className: 'hero', key: 'hero' }, [
        // Addressed to someone about to design an AI feature, not to a reviewer checking the
        // method: what the catalogue gives them, and what it saves them from.
        h('h1', { key: 'h' }, 'Patterns behind human-centric AI products'),
        // The counts read as the shape of the taxonomy rather than as loose totals: each axis
        // is boxed with what it resolves into, and the corpus all of it was read off stands
        // on its own.
        h('div', { className: 'statline', key: 's' }, [
          h('div', { className: 'taxo', key: 't' }, [
            // the patterns rule runs through all four stage colours, the factors rule is the
            // one colour that family wears everywhere else
            h('a', { className: 'taxo-col taxo-stages', key: 'p', href: '#/patterns' }, [
              h('div', { className: 'h', key: 'h' }, 'Design Patterns'),
              h('div', { className: 'r', key: 'a' }, [h('b', { key: 'n' }, d.counts.categories), ' dimensions']),
              h('div', { className: 'r', key: 'b' }, [h('b', { key: 'n' }, d.counts.patterns), ' patterns'])
            ]),
            h('a', { className: 'taxo-col taxo-factors', key: 'f', href: '#/factors' }, [
              h('div', { className: 'h', key: 'h' }, 'Human Factors'),
              h('div', { className: 'r', key: 'a' }, [h('b', { key: 'n' }, (d.factor_groups || []).length), ' groups']),
              h('div', { className: 'r', key: 'b' }, [h('b', { key: 'n' }, d.counts.factors), ' factors']),
              h('div', { className: 'r', key: 'c' }, [h('b', { key: 'n' }, d.counts.sub_factors), ' sub-factors'])
            ])
          ]),
          h('a', { className: 'corpus', key: 'c', href: '#/papers' }, [
            h('b', { key: 'n' }, d.counts.papers.toLocaleString()),
            h('span', { key: 'l' }, 'papers read')
          ])
        ])
      ]),

      h('div', { className: 'sec', key: 'cats' }, [
        h(SectionHead, {
          // one word per stage, in that stage's own colour, straight from the logo
          title: h('span', { style: { color: '#9a9a9a' } }, [
            h('span', { key: 'w0' }, 'Across the '),
            h('span', { key: 'w1', style: { color: 'var(--b1)' } }, 'Human'),
            h('span', { key: 'hy' }, '-'),
            h('span', { key: 'w2', style: { color: 'var(--b2)' } }, 'AI'), ' ',
            h('span', { key: 'w3', style: { color: 'var(--b3)' } }, 'Interaction'), ' ',
            h('span', { key: 'w4', style: { color: 'var(--b4)' } }, 'Stages')
          ])
        }),
        h('div', { className: 'stage-flow' }, bandedCategories(d).map(function (g) {
          return h('div', { className: 'band', key: g.band.name, style: bandStyle(g.band) }, [
            h(BandHead, { key: 'h', band: g.band, count: plural(g.categories.length, 'dimension', 'dimensions') }),
            h('div', { className: 'grid g2', key: 'g' }, g.categories.map(function (c) {
              var n = d.indexes.by_category[c.category_id].mapped_paper_count;
              return h('a', { className: 'card', key: c.category_id, href: '#/category/' + c.category_id }, [
                h('div', { className: 'kicker', key: 'k' }, dimId(c.category_id)),
                h('h3', { key: 'h', style: { margin: '8px 0 8px' } }, c.category_name),
                h('p', { className: 'small', key: 'd' }, c.category_description),
                h('div', { key: 'b', style: { marginTop: '14px' } }, h(Bar, { value: n / maxCat })),
                h('p', { className: 'tiny', key: 'm', style: { marginTop: '8px' } },
                  plural(c.pattern_count, 'pattern') + '  ·  ' + c.ui_pattern_count + ' UI / ' + c.ux_pattern_count + ' UX  ·  ' +
                  n.toLocaleString() + ' papers')
              ]);
            }))
          ]);
        }))
      ]),

      h('div', { className: 'sec', key: 'mx' }, [
        h(SectionHead, { title: 'Patterns against human factors' }),
        h('p', { className: 'small', key: 'hint', style: { marginTop: '-8px', marginBottom: '16px' } },
          'Click a cell to see how many papers hold both, and to open them.'),
        h(Matrix, { d: d, ix: ix, scale: props.scale, onScale: props.onScale, palette: props.palette })
      ]),

      // The way out of the home page: the catalogue itself, one tab over.
      h('div', { className: 'sec', key: 'explore' }, [
        h(SectionHead, { title: 'Explore the patterns' }),
        h('p', { className: 'small', key: 'n', style: { marginTop: '-8px', marginBottom: '18px', maxWidth: '62ch' } },
          plural(d.patterns.length, 'pattern') + ' across ' + plural(d.categories.length, 'dimension', 'dimensions') +
          ', each with its definition, its structural signature, the papers that carry it, ' +
          'and the figures that show it.'),
        h('a', { className: 'btn btn-go', key: 'b', href: '#/patterns' }, [
          h('span', { key: 't' }, 'Design Patterns'),
          icon('arrow-right', 16)
        ])
      ])
    ]);
  }

  /* ------------------------------------------------- stage matrices (temp) */
  /* One grid per stage instead of one grid for everything. Splitting it that way pays for
     itself twice: the stage no longer needs a band row inside the grid, and each grid can
     drop the factors its own patterns never touch, so there are no empty columns running
     through it. Rows keep their dimension, which is all the grouping a single stage needs.
     Temporary: flip SHOW_STAGE_MATRIX to false to withdraw the tab. */

  function StageGrid(props) {
    var d = props.d, ix = props.ix, band = props.band, mode = props.mode;
    var hov = useState(null), hover = hov[0], setHover = hov[1];

    var inBand = {};
    band.categories.forEach(function (cid) { inBand[cid] = true; });

    // rows: this stage's patterns, minus any that carry nothing. Dimension order, then
    // UX-led before UI-led, then the most-carried pattern first -- the same reading the
    // grid on the home page uses.
    var rows = d.patterns.filter(function (p) {
      return inBand[p.category_id] && p.mapped_paper_count > 0;
    }).sort(function (a, b) {
      if (a.category_order !== b.category_order) return a.category_order - b.category_order;
      if (a.lens_order !== b.lens_order) return a.lens_order - b.lens_order;
      return (b.mapped_paper_count - a.mapped_paper_count) || (a.pattern_id < b.pattern_id ? -1 : 1);
    }).map(function (p) {
      return {
        id: p.pattern_id, code: p.pattern_id.replace('pat-', ''), name: p.pattern_name,
        cat: p.category_id, lens: p.ui_ux_type, title: p.short_summary,
        counts: d.indexes.pattern_x_factor[p.pattern_id] || {}, total: p.mapped_paper_count
      };
    });

    // columns: only the factors these rows actually reach
    var cols = d.factors.filter(function (f) {
      return rows.some(function (r) { return (r.counts[f.factor_id] || 0) > 0; });
    });

    var colGroups = (function () {
      var out = [];
      cols.forEach(function (f) {
        var last = out[out.length - 1];
        if (last && last.id === f.factor_group_id) { last.span++; return; }
        out.push({ id: f.factor_group_id, name: f.factor_group_name || '', span: 1, from: out.length ? null : 0 });
      });
      return out;
    })();
    var groupStart = {};
    (function () {
      var i = 0;
      colGroups.forEach(function (g) { groupStart[i] = true; i += g.span; });
    })();
    var nGaps = Math.max(0, colGroups.length - 1);

    // the shade runs over this grid's own numbers, so a quiet stage still uses the full ramp
    var lo = Infinity, hi = 0, hiShare = 0;
    rows.forEach(function (r) {
      cols.forEach(function (f) {
        var n = r.counts[f.factor_id] || 0;
        if (!n) return;
        if (n < lo) lo = n;
        if (n > hi) hi = n;
        var sh = n / (r.total || 1);
        if (sh > hiShare) hiShare = sh;
      });
    });
    if (lo === Infinity) lo = 0;
    function intensity(n, share) {
      if (!n) return 0;
      if (mode === 'row') return hiShare ? share / hiShare : 0;
      return hi > lo ? (n - lo) / (hi - lo) : 1;
    }

    var rp = rampOf(paletteById(props.palette).vars['--' + band.key]);
    var body = [], lastCat = null;

    rows.forEach(function (r) {
      if (r.cat !== lastCat) {
        lastCat = r.cat;
        var c = ix.category[r.cat];
        body.push(h('tr', { className: 'sgcat', key: 'c-' + r.cat }, [
          h('th', { className: 'rowhead', key: 'h' },
            h('a', { href: '#/category/' + c.category_id }, [
              h('span', { className: 'mono', key: 'm' }, dimId(c.category_id)),
              h('span', { key: 'n' }, c.category_name)
            ])),
          h('td', { key: 'x', colSpan: cols.length + nGaps })
        ]));
      }
      body.push(h('tr', { key: r.id, style: { opacity: !hover || hover.p === r.id || hover.f ? 1 : 0.45 } }, [
        h('th', { className: 'rowhead', key: 'h' },
          h('a', { href: '#/pattern/' + r.id, title: r.title }, [
            h('span', { className: 'mono', key: 'm' }, r.code),
            h('span', { key: 'n' }, r.name),
            h('span', { className: cx('lens-tag', r.lens === 'UI' ? 'chip-ui' : 'chip-ux'), key: 'l' }, r.lens)
          ]))
      ].concat(withColGaps(cols.map(function (f, ci) {
        var n = r.counts[f.factor_id] || 0;
        var t = intensity(n, n / (r.total || 1));
        var on = hover && (hover.p === r.id || hover.f === f.factor_id);
        return h('td', {
          key: f.factor_id,
          className: cx('cell', !n && 'empty', groupStart[ci] && 'group-start'),
          title: r.name + ' × ' + f.factor_name + ' — ' + plural(n, 'paper') + ', ' +
            pct(n, r.total) + '% of this pattern',
          style: {
            background: n ? tint(t, rp) : 'transparent',
            color: cellInk(t, rp),
            opacity: !hover || on ? 1 : 0.3
          },
          onMouseEnter: function () { setHover({ p: r.id, f: f.factor_id }); }
        }, n ? h('a', { href: papersHref({ p: r.id, f: f.factor_id }) }, n) : '');
      }), groupStart))));
    });

    // The stage is named in the grid's own empty corner -- the block the rotated labels and
    // the row heads leave behind -- rather than in a heading above it.
    // Each grid shades over its own numbers, so each carries its own key to them.
    var legend = h('div', { className: 'sglegend' }, [
      // named, so a sheet printed from this grid says which of the two shadings it carries
      h('div', { className: 'sglegend-mode', key: 'm' }, mode === 'row' ? 'Share of row' : 'Absolute count'),
      h('div', { className: 'sglegend-ramp', key: 'r' }, [
        h('span', { key: 'lo' }, mode === 'row' ? '0%' : (lo ? plural(lo, 'paper') : '0')),
        h('span', { className: 'swatches', key: 'sw' }, [0.05, 0.3, 0.55, 0.8, 1].map(function (t, i) {
          return h('i', { key: i, style: { background: tint(t, rp) } });
        })),
        h('span', { key: 'hi' }, mode === 'row'
          ? Math.round(hiShare * 100) + '% of a row'
          : hi + ' papers')
      ])
    ]);

    var corner = h('div', {
      className: 'sgcorner-in',
      title: band.gloss ? band.name + ' — ' + band.gloss : band.name
    }, [h('h2', { key: 'n' }, band.name), legend]);

    return h('div', { className: 'sgwrap', style: bandStyle(band) }, [
      h('div', { className: 'sgscroll', key: 's', onMouseLeave: function () { setHover(null); } },
        h('div', { className: 'matrix-pad' }, h('table', { className: 'matrix matrix-stage' }, [
          h('thead', { key: 'h' }, [
            h('tr', { key: 'l' }, [h('th', { className: 'rowhead sgcorner', key: 'x' }, corner)].concat(
              withColGaps(cols.map(function (f, ci) {
                return h('th', {
                  className: cx('colhead', groupStart[ci] && 'group-start'), key: f.factor_id,
                  style: { opacity: !hover || hover.f === f.factor_id ? 1 : 0.4, zIndex: cols.length - ci + 10 },
                  onMouseEnter: function () { setHover({ p: null, f: f.factor_id }); }
                }, h('div', null, h('a', { href: '#/factor/' + f.factor_id }, facId(f.factor_id) + '  ' + f.factor_name)));
              }), groupStart, 'th'))),
            h('tr', { className: 'grouphead', key: 'g' }, [h('th', { className: 'rowhead sgcorner-rule', key: 'x' })].concat(
              withColGaps(colGroups.map(function (g, i) {
                return h('th', { key: i, colSpan: g.span, className: 'grouphead-cell', title: g.name }, h('span', null, g.name));
              }), true, 'th')))
          ]),
          h('tbody', { key: 'b' }, body)
        ])))
    ]);
  }

  function StageMatrices(props) {
    var d = props.d, ix = props.ix;
    var md = useState('absolute'), mode = md[0], setMode = md[1];

    // #/stages?only=b2 renders that stage alone, with the page's own furniture out of the
    // way -- the shape each grid is exported from.
    var q = props.query || {};
    var only = q.only ? BANDS.filter(function (b) { return b.key === q.only; })[0] : null;
    if (only) {
      return h('div', { className: 'sgsolo' },
        h(StageGrid, { d: d, ix: ix, band: only, mode: q.mode === 'row' ? 'row' : 'absolute', palette: props.palette }));
    }

    return h('div', { style: { paddingTop: '46px' } }, [
      h('h1', { key: 'h', style: { margin: '0 0 16px' } }, 'A Matrix per Stage'),
      h('p', { className: 'lede', key: 'l', style: { maxWidth: '72ch' } },
        'The same counts as the matrix on the home page, cut into the four stages. Each grid ' +
        'drops the factors its own patterns never reach and shades over its own range, so no ' +
        'stage is read through the scale of a louder one.'),
      h('div', { className: 'notice', key: 'n', style: { marginTop: '20px' } },
        'Temporary tab, for comparison against the single grid.'),

      h('div', { className: 'matrix-controls', key: 'c', style: { marginTop: '26px' } },
        h('div', { className: 'ctl' }, [
          h('span', { className: 'ctl-l', key: 'l' }, 'Shade by'),
          h('div', { className: 'tag-row', key: 't' }, [
            { key: 'absolute', label: 'Absolute count', title: 'Each cell placed between the smallest and largest cell in its own stage.' },
            { key: 'row', label: 'Share of row', title: 'Each cell as a share of that pattern’s own papers.' }
          ].map(function (o) {
            return h('button', {
              key: o.key, className: cx('btn', mode === o.key && 'on'), title: o.title,
              onClick: function () { setMode(o.key); }
            }, o.label);
          }))
        ])),

      h('div', { key: 'g' }, BANDS.map(function (b) {
        return h(StageGrid, { key: b.key, d: d, ix: ix, band: b, mode: mode, palette: props.palette });
      })),

      h('p', { className: 'tiny dim', key: 'pr', style: { marginTop: '34px' } },
        'One stage on its own, ready to print: ' +
        BANDS.map(function (b) { return b.name; }).join(', ') + ' — append ?only=' +
        BANDS.map(function (b) { return b.key; }).join(' / ') + ' to this page’s address.')
    ]);
  }

  /* -------------------------------------------------------------- patterns */

  function Patterns(props) {
    var d = props.d, ix = props.ix;
    var q = useState(''), text = q[0], setText = q[1];
    var lens = useState('all'), lensV = lens[0], setLens = lens[1];
    var bands = bandedCategories(d).filter(function (b) { return b.categories.length; });
    var st = useState(bands[0].band.name), stage = st[0], setStage = st[1];
    var ct = useState(bands[0].categories[0].category_id), catId = ct[0], setCatId = ct[1];
    var max = Math.max.apply(null, d.patterns.map(function (p) { return p.mapped_paper_count; }));

    function matches(p, needle, lensOf) {
      if (lensOf !== 'all' && p.ui_ux_type !== lensOf) return false;
      if (!needle) return true;
      return (p.pattern_name + ' ' + (p.description || '') + ' ' + p.short_summary + ' ' + p.definition + ' ' +
        (p.sub_pattern || '') + ' ' + p.category_name)
        .toLowerCase().indexOf(needle) >= 0;
    }
    function tally(needle, lensOf) {
      var n = {};
      d.patterns.forEach(function (p) {
        if (matches(p, needle, lensOf)) n[p.category_id] = (n[p.category_id] || 0) + 1;
      });
      return n;
    }
    function inStage(b, n) {
      return b.categories.reduce(function (t, c) { return t + (n[c.category_id] || 0); }, 0);
    }

    // Narrowing the filters can empty the open tab. Rather than leave the reader on a blank
    // one, move to the first stage and dimension that still has something -- but only when
    // the filters change, never when they have just chosen a tab themselves.
    function refocus(needle, lensOf) {
      var n = tally(needle, lensOf);
      if ((n[catId] || 0) > 0) return;
      var band = bands.filter(function (b) { return inStage(b, n) > 0; })[0];
      if (!band) return;
      var cat = band.categories.filter(function (c) { return n[c.category_id] > 0; })[0];
      setStage(band.band.name);
      setCatId(cat.category_id);
    }

    var needle = text.trim().toLowerCase();
    var counts = tally(needle, lensV);
    var band = bands.filter(function (b) { return b.band.name === stage; })[0] || bands[0];
    var cat = band.categories.filter(function (c) { return c.category_id === catId; })[0];
    var items = cat ? d.patterns.filter(function (p) {
      return p.category_id === cat.category_id && matches(p, needle, lensV);
    }) : [];
    var total = d.patterns.filter(function (p) { return matches(p, needle, lensV); }).length;

    return h('div', null, [
      h('div', { key: 'h', style: { paddingTop: '46px' } }, [
        h('h1', { style: { margin: '0 0 16px' } },
          d.counts.patterns + ' Patterns in ' + d.counts.categories + ' Dimensions'),
        h('p', { className: 'lede', style: { maxWidth: '68ch' } },
          'Two zoom levels on one catalogue: the dimension says what part of the interaction is at stake, the pattern ' +
          'is the observable interaction or interface structure inside it — not a topic, a model, or an outcome. Each ' +
          'pattern is labelled UI-led (a rendering or control commitment) or UX-led (a commitment about the experience).')
      ]),
      h('div', { className: 'filterbar', key: 'f', style: { marginTop: '26px' } }, [
        h('div', { className: 'row', key: 'r1' }, [
          h('label', { key: 'l' }, 'Search'),
          h('input', {
            key: 'i', className: 'search', style: { flex: 1 }, value: text, placeholder: 'name, definition, sub-pattern…',
            onChange: function (e) {
              setText(e.target.value);
              refocus(e.target.value.trim().toLowerCase(), lensV);
            }
          }),
          needle || lensV !== 'all'
            ? h('span', { className: 'tiny dim', key: 'n' }, plural(total, 'match', 'matches'))
            : null
        ]),
        h('div', { className: 'row', key: 'r2' }, [
          h('label', { key: 'l' }, 'Lens'),
          h('div', { className: 'tag-row', key: 't' }, ['all', 'UI', 'UX'].map(function (v) {
            return h('button', {
              key: v, className: cx('btn', lensV === v && 'on'),
              onClick: function () { setLens(v); refocus(needle, v); }
            }, v === 'all' ? 'All ' + d.counts.patterns : (v + '-led ' + d.patterns.filter(function (p) { return p.ui_ux_type === v; }).length));
          }))
        ])
      ]),

      // Stage, then dimension, then the patterns in it.
      h(Tabs, {
        key: 't1', className: 'tabs-stage',
        value: band.band.name,
        onPick: function (name) {
          var b = bands.filter(function (x) { return x.band.name === name; })[0];
          var pick = b.categories.filter(function (c) { return counts[c.category_id] > 0; })[0] || b.categories[0];
          setStage(name);
          setCatId(pick.category_id);
        },
        // numbered, because the four stages are a sequence and not four categories
        items: bands.map(function (b, i) {
          return {
            id: b.band.name, label: b.band.name, code: String(i + 1),
            count: inStage(b, counts), band: b.band, title: b.band.gloss
          };
        })
      }),
      h(Tabs, {
        key: 't2', className: 'tabs-dim', band: band.band,
        value: cat ? cat.category_id : null,
        onPick: setCatId,
        items: band.categories.map(function (c) {
          return {
            id: c.category_id, label: c.category_name, code: dimId(c.category_id),
            count: counts[c.category_id] || 0, title: c.category_description
          };
        })
      }),

      !cat ? h(Empty, { key: 'e' }, 'Nothing in this stage.') :
      h('div', { key: 'g', className: 'band', style: bandStyle(band.band) }, [
        h('div', { className: 'sec-head', key: 'h', style: { marginTop: '26px' } }, [
          h('h2', { key: 'a' }, h('a', { href: '#/category/' + cat.category_id }, cat.category_name)),
          h('span', { className: 'kicker', key: 'b' }, dimId(cat.category_id)),
          h('span', { className: 'tiny', key: 'c', style: { marginLeft: 'auto' } },
            plural(items.length, 'pattern') + '  ·  ' +
            d.indexes.by_category[cat.category_id].mapped_paper_count + ' papers')
        ]),
        h('p', { className: 'small', key: 'cd', style: { maxWidth: '78ch', marginTop: '-8px', marginBottom: '18px' } },
          cat.category_description),
        !items.length
          ? h(Empty, { key: 'e' }, 'No pattern in this dimension matches that search.')
          : h('div', { className: 'grid g2', key: 'g' }, items.map(function (p) {
              return h('a', { className: 'card', key: p.pattern_id, href: '#/pattern/' + p.pattern_id }, [
                h('div', { key: 'top', style: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' } }, [
                  h('span', { className: 'mono', key: 'c', style: { fontSize: '11px', color: 'var(--ink-4)' } }, p.pattern_id),
                  h(UiUxChip, { key: 'u', type: p.ui_ux_type, rationale: p.ui_ux_rationale })
                ]),
                h('h3', { key: 'n' }, p.pattern_name),
                p.description ? h('p', { className: 'tiny', key: 'w', style: { marginTop: '5px' } }, p.description) : null,
                p.sub_pattern ? h('p', { className: 'tiny', key: 's', style: { marginTop: '4px' } }, p.sub_pattern) : null,
                h('p', { className: 'small', key: 'd', style: { marginTop: '10px' } }, p.short_summary),
                h('div', { key: 'b', style: { marginTop: '14px' } }, h(Bar, { value: p.mapped_paper_count / max })),
                h('p', { className: 'tiny', key: 'm', style: { marginTop: '8px' } },
                  p.mapped_paper_count + ' papers  ·  ' + p.mapped_central_count + ' central')
              ]);
            }))
      ])
    ]);
  }

  function factorProfile(d, ix, rids, limit) {
    var counts = {};
    d.factors.forEach(function (f) {
      var n = 0;
      rids.forEach(function (rid) { if (ix.ridsOfFactor[f.factor_id].has(rid)) n++; });
      if (n) counts[f.factor_id] = n;
    });
    return Object.keys(counts)
      .sort(function (a, b) { return counts[b] - counts[a]; })
      .slice(0, limit || 8)
      .map(function (fid) { return { factor: ix.factor[fid], n: counts[fid] }; });
  }

  /* -------------------------------------------------------------- exemplars */
  /* One or more papers per pattern, each with the figure that shows the move. The
     figures are WebP data URIs carried in the bundle -- see build/exemplar_site_figures.py.
     Selection kept three exemplars per pattern with a curator's writeup and let the
     lower-ranked candidates through with a rater score only, so `why` is often null;
     those show the figure and the citation alone rather than borrowed prose. */

  function Exemplars(props) {
    var d = props.d, ix = props.ix, p = props.pattern;
    var ex = (d.exemplars && d.exemplars.by_pattern && d.exemplars.by_pattern[p.pattern_id]) || null;
    var zs = useState(null), zoom = zs[0], setZoom = zs[1];
    var ns = useState(false), notesOpen = ns[0], setNotesOpen = ns[1];

    useEffect(function () {
      if (!zoom) return;
      function esc(e) { if (e.key === 'Escape') setZoom(null); }
      window.addEventListener('keydown', esc);
      return function () { window.removeEventListener('keydown', esc); };
    }, [zoom]);

    if (!ex || !ex.papers.length) return null;

    return h('div', { className: 'sec', key: 'ex' }, [
      h(SectionHead, { key: 'h', title: 'Exemplars' }),

      h('div', { className: 'exlist', key: 'l' }, ex.papers.map(function (x, i) {
        var paper = ix.paper[x.rid];
        // venueLabel would read "TVCG-2024 2024": the venue slug already carries the year.
        var venue = paper ? String(paper.venue || '').replace(/-\d{4}$/, '').toUpperCase() : null;
        var meta = [
          [venue, paper && paper.year].filter(Boolean).join(' ') || null,
          x.source === 'curated' ? 'curated' : x.source === 'manual' ? 'added by hand' : 'further candidate',
          x.score != null ? 'rater consensus ' + x.score.toFixed(2) : null
        ].filter(Boolean).join('  ·  ');

        return h('div', { className: cx('excard', !x.why && 'bare'), key: x.rid }, [
          h('div', { className: 'exfigs', key: 'f' }, x.figures.map(function (f, j) {
            return h('figure', {
              key: j, className: 'exfig', onClick: function () { setZoom(f.src); },
              title: 'View full size'
            }, h('img', { src: f.src, width: f.w, height: f.h, loading: 'lazy', alt:
              'Figure from ' + x.title }));
          })),
          h('div', { className: 'exbody', key: 'b' }, [
            h('div', { className: 'exrank', key: 'r' }, i + 1),
            h('a', {
              className: 'extitle', key: 't',
              href: '#/paper/' + x.rid
            }, x.title),
            h('div', { className: 'exmeta', key: 'm' }, [
              meta,
              x.url ? h('a', { key: 'u', href: x.url, target: '_blank', rel: 'noreferrer' }, 'DOI ↗') : null
            ]),
            x.why
              ? h('p', { className: 'exwhy', key: 'w' }, x.why)
              : h('p', { className: 'exwhy dim', key: 'w' },
                  'Ranked here by the raters; no curator’s note was written for it.')
          ])
        ]);
      })),

      ex.curator_notes ? h('div', { className: 'exnotes', key: 'n' }, [
        h('button', {
          key: 'b', className: 'exnotes-toggle',
          onClick: function () { setNotesOpen(!notesOpen); }
        }, (notesOpen ? '▾' : '▸') + '  What the curator flagged as worth distrusting'),
        notesOpen ? h('p', { key: 'p' }, ex.curator_notes) : null
      ]) : null,

      zoom ? h('div', {
        className: 'lightbox', key: 'z', onClick: function () { setZoom(null); }
      }, h('img', { src: zoom, alt: '' })) : null
    ]);
  }

  function PatternPage(props) {
    var d = props.d, ix = props.ix;
    var p = ix.pattern[props.id];
    if (!p) return h(Empty, null, 'No pattern with id ' + props.id + '.');
    var cat = ix.category[p.category_id];
    var edges = (ix.patEdgesByPattern[p.pattern_id] || []).slice().sort(function (a, b) {
      if (a.role !== b.role) return a.role === 'central' ? -1 : 1;
      var w = { high: 0, medium: 1, low: 2 };
      return w[a.confidence] - w[b.confidence];
    });
    var rids = d.indexes.by_pattern[p.pattern_id].rids;
    var profile = factorProfile(d, ix, rids, 8);
    var maxF = profile.length ? profile[0].n : 1;
    var siblings = d.patterns.filter(function (x) { return x.category_id === p.category_id && x.pattern_id !== p.pattern_id; });

    var rows = edges.map(function (e) {
      return {
        paper: ix.paper[e.rid],
        quote: e.evidence_quote,
        metaExtra: [e.role === 'central' ? 'central to this pattern' : 'present', e.evidence_location, e.confidence + ' confidence']
      };
    });

    // The page takes its stage's colour, so the header says where the pattern sits in the
    // four-stage arc without spelling it out.
    var band = BAND_OF[p.category_id];

    // `band` is the site's own stage scope -- it turns the bars to the stage tone -- and
    // `stagepage` carries the marks a page inside a stage wears. The dimension page takes
    // the same pair, so the two read as one family.
    return h('div', { className: 'stagepage band', style: bandStyle(band) }, [
      h('a', { className: 'back', key: 'b', href: '#/patterns' }, '← All patterns'),
      h('div', { key: 'head', style: { marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' } }, [
        h('span', { className: 'kicker', key: 'c', style: { color: 'var(--bc-text)' } }, p.pattern_id),
        h(UiUxChip, { key: 'u', type: p.ui_ux_type, rationale: p.ui_ux_rationale }),
        band ? h(Chip, { key: 'band', className: 'chip-pat' }, band.name) : null,
        h(Chip, { key: 'cat', className: 'chip-pat', href: '#/category/' + cat.category_id, code: dimId(cat.category_id) }, cat.category_name),
        p.sub_pattern ? h(Chip, { key: 's' }, p.sub_pattern) : null
      ]),
      h('h1', { key: 'h', style: { margin: '18px 0 10px' } }, p.pattern_name),
      p.description ? h('p', { className: 'small', key: 'w', style: { margin: '0 0 16px', maxWidth: '72ch' } }, p.description) : null,
      h('p', { className: 'lede', key: 'd', style: { maxWidth: '72ch' } }, p.definition),

      h(Exemplars, { key: 'ex', d: d, ix: ix, pattern: p }),

      // A tile each, laid out in columns. A bar the width of the page carried the same one
      // number in a hundred times the space, and read as a ranking of the page rather than
      // of the factors.
      profile.length ? h('div', { className: 'sec', key: 'prof' }, [
        h(SectionHead, { title: 'Human factors it is deployed against', note: 'Distinct papers holding both this pattern and that factor.' }),
        h('div', { className: 'facgrid' }, profile.map(function (row) {
          var share = pct(row.n, p.mapped_paper_count);
          return h('a', {
            className: 'factile', key: row.factor.factor_id,
            href: papersHref({ p: p.pattern_id, f: row.factor.factor_id }),
            title: row.n + ' of this pattern\u2019s ' + p.mapped_paper_count + ' papers also carry ' + row.factor.factor_name
          }, [
            h('div', { className: 'factile-head', key: 'h' }, [
              h('span', { className: 'mono', key: 'c' }, facId(row.factor.factor_id)),
              h('span', { className: 'factile-pct', key: 'p' }, share + '%')
            ]),
            h('div', { className: 'factile-name', key: 'n' }, row.factor.factor_name),
            h('div', { className: 'factile-bar', key: 'b' }, h(Bar, { value: row.n / maxF })),
            h('div', { className: 'factile-n', key: 'm' }, plural(row.n, 'paper'))
          ]);
        }))
      ]) : null,

      h('div', { className: 'sec', key: 'papers' }, [
        h(SectionHead, { title: 'Papers' }),
        // the counts the three stat cards used to carry, on one line
        h('p', { className: 'tiny', key: 'n', style: { marginTop: '-10px', marginBottom: '14px' } },
          plural(p.mapped_paper_count, 'paper') + ' carry it  ·  ' + p.mapped_central_count +
          ' centrally about it  ·  ' + plural(p.n_venue_families, 'venue family', 'venue families')),
        h(PaperList, { rows: rows, ix: ix, resetKey: p.pattern_id, searchable: true, panel: true })
      ]),

      siblings.length ? h('div', { className: 'sec', key: 'sib' }, [
        h(SectionHead, { title: 'Others in ' + cat.category_name }),
        h('div', { className: 'tag-row' }, siblings.map(function (s) {
          return h(Chip, { key: s.pattern_id, className: 'chip-pat', href: '#/pattern/' + s.pattern_id, code: s.pattern_id.replace('pat-', ''), title: s.short_summary }, s.pattern_name);
        }))
      ]) : null
    ]);
  }

  /* ------------------------------------------------------------ categories */

  function CategoryPage(props) {
    var d = props.d, ix = props.ix;
    var c = ix.category[props.id];
    if (!c) return h(Empty, null, 'No dimension with id ' + props.id + '.');
    var idx = d.indexes.by_category[c.category_id];
    var pats = d.patterns.filter(function (p) { return p.category_id === c.category_id; });
    var max = Math.max.apply(null, pats.map(function (p) { return p.mapped_paper_count; }));
    var rows = idx.rids.map(function (rid) { return { paper: ix.paper[rid] }; });

    var band = BAND_OF[c.category_id];

    return h('div', { className: 'stagepage band', style: bandStyle(band) }, [
      h('a', { className: 'back', key: 'b', href: '#/patterns' }, '← All patterns & dimensions'),
      h('div', { key: 'head', style: { marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' } }, [
        h('span', { className: 'kicker', key: 'k' }, dimId(c.category_id)),
        band ? h(Chip, { key: 'band', className: 'chip-pat' }, band.name) : null,
        h(Chip, { key: 'lens', className: c.dominant_lens === 'UI' ? 'chip-ui' : 'chip-ux' }, c.dominant_lens + '-dominant')
      ]),
      h('h1', { key: 'h', style: { margin: '14px 0 18px' } }, c.category_name),
      h('p', { className: 'lede', key: 'd', style: { maxWidth: '72ch' } }, c.category_description),
      h('div', { className: 'sec', key: 'bd' }, h('dl', { className: 'deflist' }, [
        h('dt', { key: 'a' }, 'Classification boundary'),
        h('dd', { key: 'b' }, c.classification_boundary)
      ])),
      h('div', { className: 'sec', key: 'p' }, [
        h(SectionHead, {
          title: plural(pats.length, 'pattern'),
          note: c.ui_pattern_count + ' UI-led, ' + c.ux_pattern_count + ' UX-led. ' + idx.mapped_paper_count.toLocaleString() + ' distinct papers reach this dimension.'
        }),
        h('div', { className: 'grid g2' }, pats.map(function (p) {
          return h('a', { className: 'card', key: p.pattern_id, href: '#/pattern/' + p.pattern_id }, [
            h('div', { key: 'top', style: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' } }, [
              h('span', { className: 'mono', key: 'c', style: { fontSize: '11px', color: 'var(--ink-4)' } }, p.pattern_id),
              h(UiUxChip, { key: 'u', type: p.ui_ux_type, rationale: p.ui_ux_rationale })
            ]),
            h('h3', { key: 'n' }, p.pattern_name),
            p.description ? h('p', { className: 'tiny', key: 'w', style: { marginTop: '5px' } }, p.description) : null,
            h('p', { className: 'small', key: 'd', style: { marginTop: '9px' } }, p.short_summary),
            h('div', { key: 'b', style: { marginTop: '13px' } }, h(Bar, { value: p.mapped_paper_count / max })),
            h('p', { className: 'tiny', key: 'm', style: { marginTop: '8px' } }, p.mapped_paper_count + ' papers')
          ]);
        }))
      ]),
      h('div', { className: 'sec', key: 'papers' }, [
        h(SectionHead, { title: 'Papers reaching this dimension', note: 'Distinct papers — a paper holding two patterns from this dimension is counted once.' }),
        h(PaperList, { rows: rows, ix: ix, resetKey: c.category_id, searchable: true, panel: true })
      ])
    ]);
  }

  /* --------------------------------------------------------------- factors */

  function Factors(props) {
    var d = props.d;
    var max = Math.max.apply(null, d.factors.map(function (f) { return f.mapped_paper_count; }));
    var byId = {};
    d.factors.forEach(function (f) { byId[f.factor_id] = f; });
    var groups = (d.factor_groups ||
      [{ group_id: 'all', group_name: 'All factors', factor_ids: d.factors.map(function (f) { return f.factor_id; }) }])
      .map(function (g) {
        return {
          id: g.group_id, name: g.group_name,
          members: g.factor_ids.map(function (id) { return byId[id]; }).filter(Boolean)
        };
      }).filter(function (g) { return g.members.length; });

    var sel = useState(groups[0].id), gid = sel[0], setGid = sel[1];
    var q = useState(''), text = q[0], setText = q[1];

    // the same search the pattern catalogue has, over the text a factor actually carries
    function matches(f, needle) {
      if (!needle) return true;
      return (f.factor_name + ' ' + (f.definition || '') + ' ' + (f.boundary_rule || '') + ' ' +
        f.sub_factors.map(function (s) { return s.sub_factor_name + ' ' + (s.definition || ''); }).join(' '))
        .toLowerCase().indexOf(needle) >= 0;
    }
    function hits(g, needle) {
      return g.members.filter(function (f) { return matches(f, needle); }).length;
    }
    // narrowing the search can empty the open group; move to the first that still has one
    function refocus(needle) {
      var g = groups.filter(function (x) { return x.id === gid; })[0];
      if (g && hits(g, needle)) return;
      var next = groups.filter(function (x) { return hits(x, needle); })[0];
      if (next) setGid(next.id);
    }

    var needle = text.trim().toLowerCase();
    var g = groups.filter(function (x) { return x.id === gid; })[0] || groups[0];
    var members = g.members.filter(function (f) { return matches(f, needle); });
    var total = d.factors.filter(function (f) { return matches(f, needle); }).length;

    return h('div', { className: 'facpage', style: Object.assign({ paddingTop: '46px' }, factorStyle()) }, [
      h('h1', { key: 'h', style: { margin: '0 0 16px' } }, plural(d.counts.factors, 'Human Factor')),
      h('p', { className: 'lede', key: 'l', style: { maxWidth: '70ch' } },
        'The difficulties, capacities and stakes these interfaces are aimed at. ' +
        'Each factor holds ' + 'a set of sub-factors — ' + d.counts.sub_factors + ' in total — and a paper carries as many as its ' +
        'claims support. There is no single primary factor per paper in this taxonomy.'),

      h('div', { className: 'filterbar', key: 'f', style: { marginTop: '26px' } }, [
        h('div', { className: 'row', key: 'r1' }, [
          h('label', { key: 'l' }, 'Search'),
          h('input', {
            key: 'i', className: 'search', style: { flex: 1 }, value: text, placeholder: 'name, definition, sub-factor…',
            onChange: function (e) { setText(e.target.value); refocus(e.target.value.trim().toLowerCase()); }
          }),
          needle ? h('span', { className: 'tiny dim', key: 'n' }, plural(total, 'match', 'matches')) : null
        ])
      ]),

      // the six groups the factors are read in, one at a time
      h(Tabs, {
        key: 't', className: 'tabs-group', value: g.id, onPick: setGid,
        items: groups.map(function (x) {
          return { id: x.id, label: x.name, code: x.id, count: hits(x, needle) };
        })
      }),

      h('div', { key: 'g' }, [
        h('div', { className: 'sec-head', key: 'h', style: { marginTop: '26px' } }, [
          h('h2', { key: 'a' }, g.name),
          h('span', { className: 'kicker', key: 'b' }, g.id),
          h('span', { className: 'tiny', key: 'c', style: { marginLeft: 'auto' } },
            plural(members.length, 'factor') + '  ·  ' +
            members.reduce(function (t, f) { return t + f.sub_factors.length; }, 0) + ' sub-factors')
        ]),
        !members.length
          ? h(Empty, { key: 'e' }, 'No factor in this group matches that search.')
          : h('div', { className: 'grid g2', key: 'g' }, members.map(function (f) {
              return h('a', { className: 'card', key: f.factor_id, href: '#/factor/' + f.factor_id }, [
                h('div', { key: 'top', style: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '9px' } }, [
                  h('span', { className: 'mono', key: 'c', style: { fontSize: '11px', color: 'var(--ink-4)' } }, facId(f.factor_id)),
                  f.is_new_in_v2 ? h(Chip, { key: 'n', className: 'chip-new' }, 'new') : null
                ]),
                h('h3', { key: 'h' }, f.factor_name),
                h('p', { className: 'small', key: 'd', style: { marginTop: '9px' } },
                  f.definition ? f.definition.split(/(?<=\.)\s/)[0] : f.sub_factors[0].definition.split(/(?<=\.)\s/)[0]),
                h('div', { key: 'b', style: { marginTop: '13px' } }, h(Bar, { value: f.mapped_paper_count / max })),
                h('p', { className: 'tiny', key: 'm', style: { marginTop: '8px' } },
                  f.mapped_paper_count.toLocaleString() + ' papers  ·  ' + f.mapped_central_count + ' central  ·  ' + plural(f.sub_factors.length, 'sub-factor'))
              ]);
            }))
      ])
    ]);
  }

  /* Nine sub-factors, each with a definition and a framing note, ran to several screens as
     open cards. The row carries the name, the share and the bar; the prose is one click away. */
  function SubFactorRow(props) {
    var s = props.sub, st = useState(false), open = st[0], setOpen = st[1];
    return h('div', { className: cx('subrow', open && 'on') }, [
      h('button', {
        key: 'h', className: 'subrow-head', type: 'button', 'aria-expanded': open ? 'true' : 'false',
        onClick: function () { setOpen(!open); }
      }, [
        h('span', { className: 'subrow-caret', key: 'c' }, open ? '▾' : '▸'),
        h('span', { className: 'subrow-name', key: 'n' }, s.sub_factor_name),
        h('span', { className: 'subrow-bar', key: 'b' }, h(Bar, { value: s.mapped_paper_count / props.max })),
        h('span', { className: 'subrow-n', key: 'm' },
          s.mapped_paper_count + ' · ' + s.mapped_central_count + ' central' +
          (s.origin === 'proposed' ? ' · proposed' : ''))
      ]),
      open ? h('div', { className: 'subrow-body', key: 'd' }, [
        h('p', { className: 'small', key: 'a' }, facText(s.definition)),
        s.framing ? h('p', { className: 'tiny', key: 'b' }, facText(s.framing)) : null,
        h('div', { className: 'tag-row', key: 'c' }, [
          h('a', { className: 'chip', key: 'a', href: papersHref({ s: s.sub_factor_id }) }, 'Browse its papers')
        ])
      ]) : null
    ]);
  }

  function FactorPage(props) {
    var d = props.d, ix = props.ix;
    var f = ix.factor[props.id];
    if (!f) return h(Empty, null, 'No factor with id ' + props.id + '.');
    var idx = d.indexes.by_factor[f.factor_id];
    var edges = ix.facEdgesByFactor[f.factor_id] || [];
    var maxSub = Math.max.apply(null, f.sub_factors.map(function (s) { return s.mapped_paper_count; }));

    // patterns most often carried by this factor's papers
    var counts = {};
    idx.rids.forEach(function (rid) {
      (ix.paper[rid].pattern_ids || []).forEach(function (pid) { counts[pid] = (counts[pid] || 0) + 1; });
    });
    var topPats = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; }).slice(0, 8);
    var maxP = topPats.length ? counts[topPats[0]] : 1;

    var byPaper = {};
    edges.forEach(function (e) { (byPaper[e.rid] = byPaper[e.rid] || []).push(e); });
    var rows = Object.keys(byPaper).sort(function (a, b) {
      var ac = byPaper[a].some(function (e) { return e.role === 'central'; });
      var bc = byPaper[b].some(function (e) { return e.role === 'central'; });
      return (bc ? 1 : 0) - (ac ? 1 : 0);
    }).map(function (rid) {
      var es = byPaper[rid];
      var lead = es.filter(function (e) { return e.role === 'central'; })[0] || es[0];
      return {
        paper: ix.paper[rid], quote: lead.evidence_quote,
        metaExtra: [ix.sub[lead.sub_factor_id].sub_factor_name, lead.role === 'central' ? 'central' : 'present']
      };
    });

    // The same marks a pattern page wears, in the factors' own colour rather than a stage's.
    return h('div', { className: 'stagepage band', style: factorStyle() }, [
      h('a', { className: 'back', key: 'b', href: '#/factors' }, '← All factors'),
      h('div', { key: 'k', style: { marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' } }, [
        h('span', { className: 'kicker', key: 'c' }, facId(f.factor_id)),
        f.factor_group_name ? h(Chip, { key: 'g', className: 'chip-fac' }, f.factor_group_name) : null,
        f.is_new_in_v2 ? h(Chip, { key: 'n', className: 'chip-new' }, 'new') : null
      ]),
      h('h1', { key: 'h', style: { margin: '16px 0 18px' } }, f.factor_name),
      h('p', { className: 'lede', key: 'd', style: { maxWidth: '72ch' } }, facText(f.definition)),
      f.boundary_rule ? h('div', { className: 'sec', key: 'bd' }, h('dl', { className: 'deflist' }, [
        h('dt', { key: 'a' }, 'Boundary rule'),
        h('dd', { key: 'b' }, facText(f.boundary_rule))
      ])) : null,

      h('div', { className: 'sec', key: 'subs' }, [
        h(SectionHead, {
          title: plural(f.sub_factors.length, 'sub-factor'),
          note: 'The grain the corpus was coded at. Open one for its definition. A paper can hold several sub-factors of one factor; the factor counts it once.'
        }),
        h('div', { className: 'sublist' }, f.sub_factors.map(function (s) {
          return h(SubFactorRow, { key: s.sub_factor_id, sub: s, max: maxSub });
        }))
      ]),

      topPats.length ? h('div', { className: 'sec', key: 'pat' }, [
        h(SectionHead, { title: 'Patterns most often deployed against it', note: 'Distinct papers holding both this factor and that pattern.' }),
        h('div', { className: 'facgrid' }, topPats.map(function (pid) {
          var p = ix.pattern[pid];
          // a pattern keeps its own stage colour even here
          return h('a', {
            className: 'factile', key: pid, style: bandStyle(BAND_OF[p.category_id]),
            href: papersHref({ p: pid, f: f.factor_id }),
            title: counts[pid] + ' of this factor\u2019s ' + f.mapped_paper_count + ' papers also carry ' + p.pattern_name
          }, [
            h('div', { className: 'factile-head', key: 'h' }, [
              h('span', { className: 'mono', key: 'c' }, p.pattern_id.replace('pat-', '')),
              h('span', { className: 'factile-pct', key: 'p' }, pct(counts[pid], f.mapped_paper_count) + '%')
            ]),
            h('div', { className: 'factile-name', key: 'n' }, p.pattern_name),
            h('div', { className: 'factile-bar', key: 'b' }, h(Bar, { value: counts[pid] / maxP })),
            h('div', { className: 'factile-n', key: 'm' }, plural(counts[pid], 'paper'))
          ]);
        }))
      ]) : null,

      h('div', { className: 'sec', key: 'papers' }, [
        h(SectionHead, { title: 'Papers' }),
        h('p', { className: 'tiny', key: 'n', style: { marginTop: '-10px', marginBottom: '14px' } },
          plural(f.mapped_paper_count, 'paper') + ' carry it  ·  ' + f.mapped_central_count +
          ' centrally about it  ·  ' + plural(f.sub_factors.length, 'sub-factor')),
        h(PaperList, { rows: rows, ix: ix, resetKey: f.factor_id, searchable: true, panel: true })
      ])
    ]);
  }

  /* ----------------------------------------------------------------- paper */

  function PaperPage(props) {
    var d = props.d, ix = props.ix;
    var p = ix.paper[props.id];
    if (!p) return h(Empty, null, 'No paper with rid ' + props.id + '.');
    var patEdges = (ix.patEdgesByPaper[p.rid] || []).slice().sort(function (a, b) {
      return (a.role === 'central' ? 0 : 1) - (b.role === 'central' ? 0 : 1);
    });
    var facEdges = (ix.facEdgesByPaper[p.rid] || []).slice().sort(function (a, b) {
      return (a.role === 'central' ? 0 : 1) - (b.role === 'central' ? 0 : 1);
    });
    var cats = p.category_ids.map(function (c) { return ix.category[c]; });
    var lg = p.legacy || {};

    function edgeCard(key, head, sub, quote, meta) {
      return h('div', { className: 'subcard', key: key }, [
        h('div', { key: 'h', style: { display: 'flex', gap: '10px', alignItems: 'baseline', flexWrap: 'wrap' } }, [
          h('h3', { key: 'n', style: { fontSize: '16.5px' } }, head),
          h('span', { className: 'tiny', key: 'm', style: { marginLeft: 'auto' } }, meta)
        ]),
        sub ? h('p', { className: 'tiny', key: 's', style: { marginTop: '4px' } }, sub) : null,
        quote ? h('p', { className: 'quote', key: 'q', style: { marginTop: '10px' } }, '“' + quote + '”') : null
      ]);
    }

    return h('div', { style: { paddingTop: '38px' } }, [
      h('a', { className: 'back', key: 'b', href: '#/papers' }, '← All papers'),
      h('div', { className: 'kicker', key: 'k', style: { marginTop: '20px' } },
        [venueLabel(p), 'rid ' + p.rid].filter(Boolean).join('  ·  ')),
      h('h1', { key: 'h', style: { margin: '14px 0 18px', fontSize: '34px', maxWidth: '30ch' } }, titleOf(p)),
      h('div', { className: 'tag-row', key: 'l' }, [
        p.url ? h('a', { className: 'chip', key: 'u', href: p.url, target: '_blank', rel: 'noopener' }, 'Open paper ↗') : null,
        p.doi ? h('span', { className: 'chip mono', key: 'd' }, p.doi) : null,
        p.source_status === 'legacy_no_fit' ? h(Chip, { key: 'n', className: 'chip-new' }, 'was excluded under the old taxonomy') : null
      ]),

      h('div', { className: 'grid g3', key: 'stats', style: { marginTop: '28px' } }, [
        { n: p.pattern_ids.length, l: 'design patterns' },
        { n: p.category_ids.length, l: 'dimensions reached' },
        { n: p.factor_ids.length, l: 'human factors' }
      ].map(function (s, i) {
        return h('div', { className: 'card', key: i },
          h('div', { className: 'stat' }, [
            h('div', { className: 'n', key: 'n' }, s.n),
            h('div', { className: 'l', key: 'l' }, s.l)
          ]));
      })),

      cats.length ? h('div', { className: 'sec', key: 'cats' }, [
        h(SectionHead, { title: 'Dimensions', note: 'Derived from this paper’s patterns, deduplicated.' }),
        h('div', { className: 'tag-row' }, cats.map(function (c) {
          return h(Chip, { key: c.category_id, href: '#/category/' + c.category_id, code: dimId(c.category_id) }, c.category_name);
        }))
      ]) : null,

      h('div', { className: 'sec', key: 'pats' }, [
        h(SectionHead, { title: 'Design patterns', note: 'Every pattern the interface was coded for, with the evidence for each.' }),
        patEdges.length ? h('div', null, patEdges.map(function (e) {
          var pat = ix.pattern[e.pattern_id];
          return edgeCard(e.pattern_id,
            h('a', { href: '#/pattern/' + e.pattern_id }, pat.pattern_name),
            pat.pattern_id + '  ·  ' + ix.category[pat.category_id].category_name + '  ·  ' + pat.ui_ux_type + '-led',
            e.evidence_quote,
            [e.role === 'central' ? 'central' : 'present', e.evidence_location, e.confidence + ' confidence',
              e.review_status === 'needs_review' ? 'needs review' : null].filter(Boolean).join('  ·  '));
        })) : h(Empty, null, 'No pattern was assigned to this paper under the current taxonomy.')
      ]),

      h('div', { className: 'sec', key: 'facs' }, [
        h(SectionHead, { title: 'Human factors', note: 'Coded at sub-factor grain; the parent factor is linked on each.' }),
        facEdges.length ? h('div', null, facEdges.map(function (e) {
          var s = ix.sub[e.sub_factor_id], f = ix.factor[e.factor_id];
          return edgeCard(e.sub_factor_id,
            h('a', { href: '#/factor/' + e.factor_id }, s.sub_factor_name),
            facId(f.factor_id) + '  ·  ' + f.factor_name,
            e.evidence_quote,
            [e.role === 'central' ? 'central' : 'present', e.evidence_location, e.confidence + ' confidence'].filter(Boolean).join('  ·  '));
        })) : h(Empty, null, 'No factor was assigned to this paper.')
      ]),

      h('div', { className: 'sec', key: 'legacy' }, [
        h(SectionHead, { title: 'Legacy coding', note: 'The retired 15-pattern / primary-secondary-factor model, kept for audit only.' }),
        h('div', { className: 'card' }, h('p', { className: 'small' },
          lg.pattern_id
            ? 'Was ' + lg.pattern_id + ' ' + lg.pattern_name + (lg.sub_pattern ? ' (' + lg.sub_pattern + ')' : '') +
              '; primary factor ' + (lg.primary_factor || '—') +
              (lg.secondary_factors && lg.secondary_factors.length ? ', secondary ' + lg.secondary_factors.join(', ') : '') + '.'
            : 'Was excluded as no-fit' + (lg.no_fit_reason ? ': ' + lg.no_fit_reason : '.')))
      ])
    ]);
  }

  /* ---------------------------------------------------------------- browse */

  function Picker(props) {
    var st = useState(false), open = st[0], setOpen = st[1];
    var box = useRef(null);
    useEffect(function () {
      function away(e) { if (box.current && !box.current.contains(e.target)) setOpen(false); }
      document.addEventListener('mousedown', away);
      return function () { document.removeEventListener('mousedown', away); };
    }, []);
    var n = props.selected.length;
    return h('div', { className: 'picker', ref: box }, [
      h('button', {
        key: 'b', className: cx('btn', n && 'on'), onClick: function () { setOpen(!open); }
      }, props.label + (n ? ' · ' + n : '')),
      open ? h('div', { className: 'pop', key: 'p' }, props.groups.map(function (g, gi) {
        return h('div', { key: gi }, [
          g.label ? h('h4', { key: 'h' }, g.label) : null,
          g.options.map(function (o) {
            var on = props.selected.indexOf(o.id) >= 0;
            return h('button', {
              key: o.id, className: cx('opt', on && 'on'),
              onClick: function () { props.onToggle(o.id); }
            }, [
              h('span', { className: 'mono', key: 'c' }, o.code),
              h('span', { key: 'n' }, o.name),
              h('span', { className: 'n', key: 'v' }, o.n)
            ]);
          })
        ]);
      })) : null
    ]);
  }

  function PalettePicker(props) {
    var st = useState(false), open = st[0], setOpen = st[1];
    var box = useRef(null);
    useEffect(function () {
      function away(e) { if (box.current && !box.current.contains(e.target)) setOpen(false); }
      document.addEventListener('mousedown', away);
      return function () { document.removeEventListener('mousedown', away); };
    }, []);
    var current = paletteById(props.value);
    return h('div', { className: 'picker palette-picker', ref: box }, [
      h('button', {
        key: 'b', className: 'palette-btn', title: 'Colour palette — ' + current.name,
        'aria-label': 'Colour palette', onClick: function () { setOpen(!open); }
      }, [
        h('span', { className: 'sw', key: 's' }, current.swatch.map(function (c, i) {
          return h('i', { key: i, style: { background: c } });
        })),
        h('span', { key: 'n' }, current.name)
      ]),
      open ? h('div', { className: 'pop pop-palette', key: 'p' }, [
        h('h4', { key: 'h' }, 'Palette'),
        PALETTES.map(function (p) {
          return h('button', {
            key: p.id, className: cx('opt', p.id === props.value && 'on'),
            onClick: function () { props.onPick(p.id); setOpen(false); }
          }, [
            h('span', { className: 'sw', key: 's' }, p.swatch.map(function (c, i) {
              return h('i', { key: i, style: { background: c } });
            })),
            h('span', { key: 'n' }, p.name),
            h('span', { className: 'n', key: 'd' }, p.note)
          ]);
        })
      ]) : null
    ]);
  }

  function Papers(props) {
    var d = props.d, ix = props.ix, query = props.query;
    var listRef = useRef(null);

    var sel = {
      p: (query.p || '').split(',').filter(Boolean),
      c: (query.c || '').split(',').filter(Boolean),
      f: (query.f || '').split(',').filter(Boolean),
      s: (query.s || '').split(',').filter(Boolean)
    };
    var text = query.q || '';
    var qState = useState(text), draft = qState[0], setDraft = qState[1];
    useEffect(function () { setDraft(query.q || ''); }, [query.q]);

    function setFilter(next) {
      go('#/papers' + qs({ p: next.p, c: next.c, f: next.f, s: next.s, q: next.q != null ? next.q : text }));
    }
    function toggle(dim, id) {
      var cur = sel[dim].slice();
      var i = cur.indexOf(id);
      if (i >= 0) cur.splice(i, 1); else cur.push(id);
      var next = Object.assign({}, sel); next[dim] = cur;
      setFilter(next);
    }

    // OR within a dimension, AND across dimensions; counts always over distinct rids.
    var results = useMemo(function () {
      var needle = text.trim().toLowerCase();
      return d.papers.filter(function (p) {
        if (sel.p.length && !sel.p.some(function (id) { return ix.ridsOfPattern[id] && ix.ridsOfPattern[id].has(p.rid); })) return false;
        if (sel.c.length && !sel.c.some(function (id) { return ix.ridsOfCategory[id] && ix.ridsOfCategory[id].has(p.rid); })) return false;
        if (sel.f.length && !sel.f.some(function (id) { return ix.ridsOfFactor[id] && ix.ridsOfFactor[id].has(p.rid); })) return false;
        if (sel.s.length && !sel.s.some(function (id) { return ix.ridsOfSub[id] && ix.ridsOfSub[id].has(p.rid); })) return false;
        if (needle) {
          var hay = (p.title || '') + ' ' + (p.venue || '') + ' ' + (p.doi || '') + ' ' + p.rid;
          if (hay.toLowerCase().indexOf(needle) < 0) return false;
        }
        return true;
      });
    }, [query.p, query.c, query.f, query.s, query.q]);

    var active = sel.p.concat(sel.c, sel.f, sel.s).length + (text ? 1 : 0);
    var rows = results.map(function (p) { return { paper: p }; });

    return h('div', { style: { paddingTop: '46px' } }, [
      h('h1', { key: 'h', style: { margin: '0 0 16px' } }, 'Browse Papers'),
      h('p', { className: 'lede', key: 'l', style: { maxWidth: '70ch' } },
        'Selecting several patterns, dimensions or factors returns the union within that facet. ' +
        'Selections in different dimensions are combined with AND. Every count is distinct papers.'),

      h('div', { className: 'filterbar', key: 'f', style: { marginTop: '26px' } }, [
        h('div', { className: 'row', key: 'q' }, [
          h('label', { key: 'l' }, 'Search'),
          h('input', {
            key: 'i', className: 'search', style: { flex: 1 }, value: draft, placeholder: 'title, venue, DOI, rid…',
            onChange: function (e) { setDraft(e.target.value); },
            onKeyDown: function (e) { if (e.key === 'Enter') setFilter(Object.assign({}, sel, { q: draft })); },
            onBlur: function () { if (draft !== text) setFilter(Object.assign({}, sel, { q: draft })); }
          })
        ]),
        h('div', { className: 'row', key: 'd' }, [
          h('label', { key: 'l' }, 'Filter'),
          h(Picker, {
            key: 'p', label: 'Patterns', selected: sel.p, onToggle: function (id) { toggle('p', id); },
            groups: bandedCategories(d).reduce(function (acc, g) {
              return acc.concat(g.categories.map(function (c, i) {
                return {
                  label: (i === 0 ? g.band.name.toUpperCase() + ' — ' : '') + dimId(c.category_id) + ' · ' + c.category_name,
                  options: d.patterns.filter(function (p) { return p.category_id === c.category_id; }).map(function (p) {
                    return { id: p.pattern_id, code: p.pattern_id.replace('pat-', ''), name: p.pattern_name, n: p.mapped_paper_count };
                  })
                };
              }));
            }, [])
          }),
          h(Picker, {
            key: 'c', label: 'Dimensions', selected: sel.c, onToggle: function (id) { toggle('c', id); },
            groups: bandedCategories(d).map(function (g) {
              return {
                label: g.band.name,
                options: g.categories.map(function (c) {
                  return { id: c.category_id, code: dimId(c.category_id), name: c.category_name, n: d.indexes.by_category[c.category_id].mapped_paper_count };
                })
              };
            })
          }),
          h(Picker, {
            key: 'f', label: 'Factors', selected: sel.f, onToggle: function (id) { toggle('f', id); },
            groups: [{ options: d.factors.map(function (f) {
              return { id: f.factor_id, code: facId(f.factor_id), name: f.factor_name, n: f.mapped_paper_count };
            }) }]
          }),
          h(Picker, {
            key: 's', label: 'Sub-factors', selected: sel.s, onToggle: function (id) { toggle('s', id); },
            groups: d.factors.map(function (f) {
              return {
                label: facId(f.factor_id) + ' · ' + f.factor_name,
                options: f.sub_factors.map(function (s) {
                  return { id: s.sub_factor_id, code: '', name: s.sub_factor_name, n: s.mapped_paper_count };
                })
              };
            })
          }),
          active ? h('button', {
            key: 'x', className: 'btn', onClick: function () { go('#/papers'); }
          }, 'Clear all') : null
        ]),
        active ? h('div', { className: 'row', key: 'chips' }, [
          h('label', { key: 'l' }, 'Active'),
          h('div', { className: 'tag-row', key: 't' },
            sel.p.map(function (id) { return h('button', { key: id, className: 'chip on', onClick: function () { toggle('p', id); } }, ix.pattern[id].pattern_name + ' ✕'); })
              .concat(sel.c.map(function (id) { return h('button', { key: id, className: 'chip on', onClick: function () { toggle('c', id); } }, ix.category[id].category_name + ' ✕'); }))
              .concat(sel.f.map(function (id) { return h('button', { key: id, className: 'chip on', onClick: function () { toggle('f', id); } }, ix.factor[id].factor_name + ' ✕'); }))
              .concat(sel.s.map(function (id) { return h('button', { key: id, className: 'chip on', onClick: function () { toggle('s', id); } }, ix.sub[id].sub_factor_name + ' ✕'); })))
        ]) : null
      ]),

      h('p', { className: 'small', key: 'n', style: { margin: '20px 0 4px' } },
        results.length.toLocaleString() + ' of ' + d.counts.papers.toLocaleString() + ' papers' +
        (sel.p.length > 1 || sel.c.length > 1 || sel.f.length > 1 || sel.s.length > 1 ? ' · union within each dimension, AND across' : '')),
      h('div', { key: 'list', ref: listRef },
        h(PaperList, { rows: rows, ix: ix, resetKey: JSON.stringify(query), emptyText: 'No paper matches every dimension you selected.' }))
    ]);
  }


  // The taxonomy is no longer presented as a numbered edition, so prose carried in from the
  // source data is de-versioned on the way to the screen. Evidence quotes are never touched:
  // a paper's own "V2" refers to that paper's prototype, not to this catalogue.
  function deVersion(t) {
    if (!t) return t;
    return String(t)
      .replace(/\bnew in v2\b/gi, 'new')
      .replace(/\bno v2\b/gi, 'no')
      .replace(/\b(in|into|to|from) v2\b/gi, '$1 this edition')
      .replace(/\bv2\b/gi, 'this edition');
  }

  /* ------------------------------------------------------------------- app */

  function App(props) {
    var d = props.data;
    var ix = useMemo(function () { return buildIndex(d); }, [d]);
    var rs = useState(parseHash()), route = rs[0], setRoute = rs[1];
    var ls = useState(null), legacy = ls[0], setLegacy = ls[1];
    var ps = useState(storedPalette), palette = ps[0], setPalette = ps[1];
    var ss = useState(storedScale), scale = ss[0], setScale = ss[1];

    function pickScale(id) { applyScale(id, paletteById(palette)); setScale(id); }

    // Applied before the state change lands, so the tint the matrix reads is never a
    // render behind the CSS variables.
    function pickPalette(id) { applyPalette(id); setPalette(id); }

    useEffect(function () {
      function onHash() {
        var n = normalizeRoute(parseHash());
        setRoute(n.route);
        setLegacy(n.legacy);
        window.scrollTo(0, 0);
      }
      window.addEventListener('hashchange', onHash);
      onHash();
      return function () { window.removeEventListener('hashchange', onHash); };
    }, []);

    var view = route.view;
    var body;
    // Categories and patterns are two zoom levels on one catalogue, so they share a tab and
    // a page; the old #/categories route lands on it rather than 404-ing.
    if (view === 'patterns' || view === 'categories') body = h(Patterns, { d: d, ix: ix });
    else if (view === 'pattern') body = h(PatternPage, { d: d, ix: ix, id: route.id });
    else if (view === 'category') body = h(CategoryPage, { d: d, ix: ix, id: route.id });
    else if (view === 'factors') body = h(Factors, { d: d, ix: ix });
    else if (view === 'factor') body = h(FactorPage, { d: d, ix: ix, id: route.id });
    else if (view === 'papers') body = h(Papers, { d: d, ix: ix, query: route.query });
    else if (view === 'paper') body = h(PaperPage, { d: d, ix: ix, id: route.id });
    else if (view === 'figures' && SHOW_FIGURE_PICKER) body = h(FigurePicker, null);
    else if (view === 'stages' && SHOW_STAGE_MATRIX) body = h(StageMatrices, { d: d, ix: ix, palette: palette, query: route.query });
    else body = h(Home, { d: d, ix: ix, scale: scale, onScale: pickScale, palette: palette });

    var nav = [
      ['#/patterns', 'Design Patterns', ['patterns', 'pattern', 'categories', 'category']],
      ['#/factors', 'Human Factors', ['factors', 'factor']],
      ['#/papers', 'Papers', ['papers', 'paper']]
    ];
    if (SHOW_FIGURE_PICKER) nav.push(['#/figures', 'Figures ▾', ['figures']]);
    if (SHOW_STAGE_MATRIX) nav.push(['#/stages', 'Stage Matrices ▾', ['stages']]);

    return h('div', null, [
      h('div', { className: 'topbar', key: 'top' },
        h('div', { className: 'wrap topbar-in' }, [
          h('a', { className: 'brand', key: 'b', href: '#/' }, 'A Design Cookbook for UI/UX of AI'),
          h('nav', { className: 'nav', key: 'n' }, nav.map(function (item) {
            return h('a', { key: item[0], href: item[0], className: cx(item[2].indexOf(view) >= 0 && 'on') }, item[1]);
          })),
          SHOW_PALETTE_PICKER ? h(PalettePicker, { key: 'pal', value: palette, onPick: pickPalette }) : null
        ])),
      h('div', { className: 'wrap', key: 'main' }, [
        legacy ? h('div', { className: 'notice', key: 'lg', style: { marginTop: '22px' } },
          legacy.kind === 'pattern'
            ? ('Archived route' + (legacy.code ? ' — ' + legacy.code : '') + '. The 15-pattern model this URL belongs to has been ' +
               'retired; the catalogue now holds ' + d.counts.patterns + ' patterns in ' + d.counts.categories +
               ' dimensions, and old pattern codes have no equivalent among them. Showing the current catalogue instead.')
          : legacy.kind === 'renumbered'
            ? ('Factor ' + legacy.code + ' is now ' + legacy.now + '. The five factors added in this taxonomy were renumbered ' +
               'into the F-series; the factor, its sub-factors and its papers are unchanged. Showing it under its current id.')
          : legacy.kind === 'retired'
            ? ('Pattern ' + legacy.code + ' — “' + legacy.name + '” — was withdrawn on review: too few papers to attest it as a ' +
               'named pattern. Its papers keep every other pattern and factor they carry. Showing the current catalogue instead.')
            : ('Archived route' + (legacy.code ? ' — ' + legacy.code : '') + '. Factor ids and membership were both revised in this ' +
               'edition: every paper–factor relationship was re-coded, the primary/secondary distinction was dropped, and the ' +
               'five newest factors moved from the N-series into the F-series.')) : null,
        body
      ]),
      h('footer', { key: 'f' }, h('div', { className: 'wrap' }, [
        h('p', { key: 'a' }, 'Schema ' + d.schema_version + '  ·  ' + d.counts.papers.toLocaleString() + ' papers  ·  ' +
          d.counts.patterns + ' patterns  ·  ' + d.counts.categories + ' dimensions  ·  ' +
          d.counts.factors + ' factors  ·  ' + d.counts.sub_factors + ' sub-factors'),
        h('p', { key: 'b' }, 'Counts are distinct papers throughout.')
      ]))
    ]);
  }

  /* -------------------------------------------------------- figure picker */
  /* Temporary editorial tool: choose which figure represents each pattern. Set
     SHOW_FIGURE_PICKER to false to withdraw the tab once the choices are made;
     nothing else in the app references it. The manifest and the images are read
     from disk, so this tab only works when the site is served from the repo root
     (see .claude/launch.json) and is inert in the packed single-file build. */

  var FIGURE_STORE = 'cookbook-figure-picks';
  var PICKS_API = 'api/picks';

  function loadPicks() {
    try { return JSON.parse(localStorage.getItem(FIGURE_STORE) || '{}'); }
    catch (e) { return {}; }
  }

  function savePicks(picks) {
    try { localStorage.setItem(FIGURE_STORE, JSON.stringify(picks)); }
    catch (e) { /* private mode */ }
  }

  /* Picks live in two places. localStorage is instant and always written, so a
     reload never loses anything. The server copy is the durable one: it survives a
     cache clear, moves between browsers, and is backed up on every write. When the
     two disagree on load the larger set wins, since work is only ever added. */
  function mergePicks(local, remote) {
    var out = {}, keys = {};
    Object.keys(local || {}).forEach(function (k) { keys[k] = 1; });
    Object.keys(remote || {}).forEach(function (k) { keys[k] = 1; });
    Object.keys(keys).forEach(function (k) {
      var a = (local || {})[k] || [], b = (remote || {})[k] || [];
      out[k] = b.length > a.length ? b.slice() : a.slice();
    });
    return out;
  }

  function FigurePicker() {
    var st = useState(null), man = st[0], setMan = st[1];
    var st2 = useState(loadPicks), picks = st2[0], setPicks = st2[1];
    var st3 = useState(0), at = st3[0], setAt = st3[1];
    var st4 = useState('all'), filter = st4[0], setFilter = st4[1];
    var st5 = useState(null), zoom = st5[0], setZoom = st5[1];
    var st6 = useState(null), err = st6[0], setErr = st6[1];
    var st7 = useState(false), copied = st7[0], setCopied = st7[1];
    // 'local' until the server answers; then 'saved' / 'saving' / 'offline'.
    var st8 = useState('local'), sync = st8[0], setSync = st8[1];
    var st9 = useState(null), savedAt = st9[0], setSavedAt = st9[1];
    var timer = useRef(null), loaded = useRef(false);

    // Pull the saved picks once, before any autosave can fire, so a fresh browser
    // recovers the work rather than overwriting it with an empty set.
    useEffect(function () {
      fetch(PICKS_API)
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(function (saved) {
          var remote = {};
          Object.keys(saved.picks || {}).forEach(function (pid) {
            var v = saved.picks[pid];
            remote[pid] = Array.isArray(v) ? v : (v.figures || []).map(function (f) { return f.src; });
          });
          setPicks(function (cur) {
            var merged = mergePicks(cur, remote);
            savePicks(merged);
            return merged;
          });
          setSavedAt(saved.saved_at || null);
          setSync('saved');
          loaded.current = true;
        })
        .catch(function () { setSync('offline'); loaded.current = true; });
    }, []);

    useEffect(function () {
      fetch('build/exemplars/figure_manifest.json')
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(setMan)
        .catch(function (e) { setErr(String(e)); });
    }, []);

    // Escape closes the lightbox; arrows step through patterns when it is shut.
    useEffect(function () {
      function onKey(ev) {
        if (ev.key === 'Escape') { setZoom(null); return; }
        if (zoom) return;
        if (ev.target && /^(INPUT|TEXTAREA)$/.test(ev.target.tagName)) return;
        if (ev.key === 'ArrowRight' || ev.key === 'j') setAt(function (i) { return i + 1; });
        if (ev.key === 'ArrowLeft' || ev.key === 'k') setAt(function (i) { return Math.max(0, i - 1); });
      }
      window.addEventListener('keydown', onKey);
      return function () { window.removeEventListener('keydown', onKey); };
    }, [zoom]);

    // A pending debounce would be lost if the tab closed inside that window, so the
    // last state is flushed synchronously on the way out.
    useEffect(function () {
      function flush() {
        if (!loaded.current || sync === 'offline' || !timer.current) return;
        clearTimeout(timer.current);
        timer.current = null;
        var body = JSON.stringify({ picks: decoratePicks(picks) });
        if (navigator.sendBeacon) navigator.sendBeacon(PICKS_API, new Blob([body], { type: 'application/json' }));
      }
      window.addEventListener('beforeunload', flush);
      return function () { window.removeEventListener('beforeunload', flush); };
    });

    if (err) return h('div', { className: 'notice', style: { marginTop: '46px' } },
      'Could not load build/exemplars/figure_manifest.json (' + err + '). This tab reads the ' +
      'manifest and the figures from disk, so it needs the site served from the repo root — ' +
      'run the "cookbook" launch configuration, or python3 -m http.server 8931 in the project directory.');
    if (!man) return h('div', { className: 'notice', style: { marginTop: '46px' } }, 'Loading figures…');

    var all = man.patterns;
    var shown = all.filter(function (p) {
      var n = (picks[p.pattern_id] || []).length;
      return filter === 'all' || (filter === 'todo' ? n === 0 : n > 0);
    });
    var idx = Math.min(at, Math.max(0, shown.length - 1));
    var pat = shown[idx];
    var doneCount = all.filter(function (p) { return (picks[p.pattern_id] || []).length; }).length;

    function toggle(pid, src) {
      var next = {};
      Object.keys(picks).forEach(function (k) { next[k] = picks[k].slice(); });
      var list = next[pid] || (next[pid] = []);
      var i = list.indexOf(src);
      if (i >= 0) list.splice(i, 1); else list.push(src);
      if (!list.length) delete next[pid];
      setPicks(next);
      savePicks(next);
      pushPicks(next);
    }

    /* Debounced so a burst of clicks is one write, and the payload is the full set
       rather than a delta, so a dropped request cannot leave the file half-updated. */
    function pushPicks(next) {
      if (!loaded.current || sync === 'offline') return;
      setSync('saving');
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(function () {
        fetch(PICKS_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ picks: decoratePicks(next) })
        })
          .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
          .then(function (res) { setSync('saved'); setSavedAt(res.saved_at); })
          .catch(function () { setSync('error'); });
      }, 600);
    }

    /* The saved shape carries pattern and paper identity alongside the paths, so the
       file is readable on its own and survives a re-run of the manifest. */
    function decoratePicks(source) {
      var out = {};
      all.forEach(function (p) {
        var chosen = (source || {})[p.pattern_id] || [];
        if (!chosen.length) return;
        out[p.pattern_id] = {
          pattern_name: p.pattern_name,
          category_id: p.category_id,
          category_name: p.category_name,
          stage: p.stage,
          figures: chosen.map(function (src) {
            var rid = (src.split('/')[1] || '');
            var ex = p.exemplars.filter(function (e) { return e.rid === rid; })[0] || {};
            return { src: src, rid: rid, title: ex.title || null };
          })
        };
      });
      return out;
    }

    function buildExport() {
      return JSON.stringify({ generated_from: 'figure picker', picks: decoratePicks(picks) }, null, 1);
    }

    function exportPicks() {
      var blob = new Blob([buildExport()], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'figure_picks.json';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    }

    // Some browsers block a blob download outright, so the clipboard is the
    // fallback route out of the picker.
    function copyPicks() {
      var text = buildExport();
      function ok() { setCopied(true); setTimeout(function () { setCopied(false); }, 1400); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(ok, function () { window.prompt('Copy the picks:', text); });
      } else {
        window.prompt('Copy the picks:', text);
      }
    }

    return h('div', { className: 'picker', style: { paddingTop: '30px' } }, [
      h('div', { className: 'picker-bar', key: 'bar' }, [
        h('div', { key: 'l' }, [
          h('span', { className: 'kicker', key: 'k' }, 'Figure picker  ·  temporary'),
          h('div', { className: 'picker-count', key: 'c' }, [
            doneCount + ' of ' + all.length + ' patterns have a figure  ·  ' +
              Object.keys(picks).reduce(function (n, k) { return n + picks[k].length; }, 0) + ' chosen',
            h('span', { key: 's', className: cx('sync', 'sync-' + sync) },
              sync === 'saving' ? 'saving…'
              : sync === 'saved' ? ('saved to disk' + (savedAt ? ' ' + savedAt.replace('T', ' ') : ''))
              : sync === 'error' ? 'save failed — kept in this browser'
              : sync === 'offline' ? 'this browser only — start build/picker_server.py to save to disk'
              : 'loading…')
          ])
        ]),
        h('div', { className: 'picker-tools', key: 'r' }, [
          h('div', { className: 'seg', key: 'f' }, ['all', 'todo', 'done'].map(function (f) {
            return h('button', {
              key: f, className: cx(filter === f && 'on'),
              onClick: function () { setFilter(f); setAt(0); }
            }, f);
          })),
          h('button', { key: 'c', className: 'btn', onClick: copyPicks }, copied ? 'Copied' : 'Copy JSON'),
          h('button', { key: 'x', className: 'btn', onClick: exportPicks }, 'Download JSON')
        ])
      ]),

      !pat ? h('div', { className: 'notice', key: 'none' }, 'Nothing in this filter.') :
      h('div', { className: 'picker-main', key: 'main' }, [
        // Grouped by the catalogue's own reading order: stage, then dimension.
        // The manifest arrives pre-sorted, so a linear walk finds the group breaks.
        h('div', { className: 'picker-nav', key: 'nav' }, (function () {
          var rows = [], lastStage = null, lastCat = null;
          shown.forEach(function (p, i) {
            if (p.stage !== lastStage) {
              lastStage = p.stage; lastCat = null;
              rows.push(h('div', { className: 'picker-nav-stage', key: 'st-' + p.stage }, p.stage));
            }
            if (p.category_id !== lastCat) {
              lastCat = p.category_id;
              var inCat = shown.filter(function (q) { return q.category_id === p.category_id; });
              var doneIn = inCat.filter(function (q) { return (picks[q.pattern_id] || []).length; }).length;
              rows.push(h('div', { className: 'picker-nav-dim', key: 'dm-' + p.category_id }, [
                h('span', { key: 'a' }, p.category_id + '  ' + (p.category_name || '')),
                h('span', { className: 'tally', key: 'b' },
                  (p.dominant_lens ? p.dominant_lens + '  ·  ' : '') + doneIn + '/' + inCat.length)
              ]));
            }
            var n = (picks[p.pattern_id] || []).length;
            rows.push(h('button', {
              key: p.pattern_id, className: cx('picker-nav-row', i === idx && 'on', n && 'has'),
              onClick: function () { setAt(i); }
            }, [
              h('span', { className: 'pid', key: 'a' }, p.pattern_id),
              h('span', { className: 'pnm', key: 'b' }, p.pattern_name),
              p.ui_ux_type ? h('span', {
                className: cx('lens', 'lens-' + String(p.ui_ux_type).toLowerCase()), key: 'l'
              }, p.ui_ux_type) : null,
              n ? h('span', { className: 'dot', key: 'c' }, n) : null
            ]));
          });
          return rows;
        })()),

        h('div', { className: 'picker-body', key: 'body' }, [
          h('div', { className: 'kicker', key: 'k' },
            [pat.stage, pat.category_id + ' ' + (pat.category_name || ''), pat.pattern_id,
             (idx + 1) + ' of ' + shown.length].filter(Boolean).join('  ·  ')),
          h('h1', { key: 'h', style: { margin: '10px 0 8px' } }, [
            pat.pattern_name,
            pat.ui_ux_type ? h('span', {
              key: 'l', className: cx('lens', 'lens-lg', 'lens-' + String(pat.ui_ux_type).toLowerCase())
            }, pat.ui_ux_type + '-led') : null
          ]),
          pat.ui_ux_type ? h('p', { className: 'lenshint', key: 'lh' }, [
            h('b', { key: 'a' }, pat.ui_ux_type === 'UI'
              ? 'UI-led — look for a figure showing the interface itself: the control, the layout, the on-screen state.'
              : 'UX-led — the move is behavioural, so a screenshot may not show it. Prefer a diagram, a flow, or a before/after.'),
            pat.ui_ux_rationale ? h('span', { key: 'b' }, '  ' + pat.ui_ux_rationale) : null
          ]) : null,
          pat.short_summary ? h('p', { className: 'lede', key: 's', style: { maxWidth: '78ch' } },
            pat.short_summary) : null,
          pat.structural_signature ? h('p', { className: 'sig', key: 'sig' },
            'Structural signature — ' + pat.structural_signature) : null,

          h('div', { className: 'grouphead', key: 'gh1' },
            'Curated  ·  ' + pat.exemplars.length +
            (pat.rated ? '  of  ' + pat.rated + ' rated' : '')),

          pat.exemplars.map(function (ex) {
            return h('div', { className: 'picker-paper', key: ex.rid }, [
              h('div', { className: 'picker-paper-head', key: 'h' }, [
                h('a', { key: 't', href: ex.url || ('#/paper/' + ex.rid), target: ex.url ? '_blank' : null },
                  ex.title),
                h('span', { className: 'meta', key: 'm' }, [
                  [ex.venue, ex.year, 'rid ' + ex.rid,
                   ex.final_score != null ? ex.final_score.toFixed(2) : null]
                    .filter(Boolean).join('  ·  '),
                  // An editorial addition is flagged here too, so the tab shows the
                  // same provenance the report does.
                  ex.added_manually ? h('span', { key: 'x', className: 'manualtag' }, 'added by hand') : null
                ])
              ]),
              ex.why ? h('p', { className: 'why', key: 'w' }, ex.why) : null,
              !ex.figures.length
                ? h('div', { className: 'notice', key: 'n' }, 'No figures on disk for this paper.')
                : h('div', { className: 'figgrid', key: 'g' }, ex.figures.map(function (src) {
                    var on = (picks[pat.pattern_id] || []).indexOf(src) >= 0;
                    var order = (picks[pat.pattern_id] || []).indexOf(src) + 1;
                    return h('figure', {
                      key: src, className: cx('figcell', on && 'on'),
                      onClick: function () { toggle(pat.pattern_id, src); }
                    }, [
                      h('img', { key: 'i', src: src, loading: 'lazy', alt: '' }),
                      h('figcaption', { key: 'c' }, src.split('/').pop().replace(/\.png$/, '')),
                      on ? h('span', { className: 'badge', key: 'b' }, order) : null,
                      h('button', {
                        key: 'z', className: 'zoom', title: 'View full size',
                        onClick: function (e) { e.stopPropagation(); setZoom(src); }
                      }, '⤢')
                    ]);
                  }))
            ]);
          }),

          !(pat.candidates || []).length ? null :
            h('div', { className: 'grouphead', key: 'gh2' },
              'Further candidates  ·  ranks ' +
              pat.candidates[0].rank + '–' + pat.candidates[pat.candidates.length - 1].rank +
              ' by rater consensus, not curated'),

          (pat.candidates || []).map(function (c) {
            return h('div', { className: 'picker-paper cand', key: 'c-' + c.rid }, [
              h('div', { className: 'picker-paper-head', key: 'h' }, [
                h('a', { key: 't', href: c.url || ('#/paper/' + c.rid), target: c.url ? '_blank' : null },
                  c.title || ('rid ' + c.rid)),
                h('span', { className: 'meta', key: 'm' }, [
                  ['#' + c.rank, c.venue, c.year, 'rid ' + c.rid,
                   c.consensus != null ? c.consensus.toFixed(2) : null]
                    .filter(Boolean).join('  ·  '),
                  c.spread >= 1 ? h('span', { key: 'sp', className: 'manualtag' },
                    'raters disagreed') : null
                ])
              ]),
              (c.rater_notes || []).length
                ? h('ul', { className: 'raternotes', key: 'n' }, c.rater_notes.map(function (n, i) {
                    return h('li', { key: i }, [h('b', { key: 'a' }, n.lens + ': '), n.reason]);
                  }))
                : null,
              !c.figures.length
                ? h('div', { className: 'notice nofigs', key: 'x' },
                    c.figures_unavailable
                      ? 'No figures — extraction failed for this paper. It stays in the exemplars without one.'
                      : 'No figures extracted for this paper yet (rid ' + c.rid + ').')
                : h('div', { className: 'figgrid', key: 'g' }, c.figures.map(function (src) {
                    var on = (picks[pat.pattern_id] || []).indexOf(src) >= 0;
                    var order = (picks[pat.pattern_id] || []).indexOf(src) + 1;
                    return h('figure', {
                      key: src, className: cx('figcell', on && 'on'),
                      onClick: function () { toggle(pat.pattern_id, src); }
                    }, [
                      h('img', { key: 'i', src: src, loading: 'lazy', alt: '' }),
                      h('figcaption', { key: 'c' }, src.split('/').pop().replace(/\.png$/, '')),
                      on ? h('span', { className: 'badge', key: 'b' }, order) : null,
                      h('button', {
                        key: 'z', className: 'zoom', title: 'View full size',
                        onClick: function (e) { e.stopPropagation(); setZoom(src); }
                      }, '⤢')
                    ]);
                  }))
            ]);
          })
        ])
      ]),

      zoom ? h('div', { className: 'lightbox', key: 'lb', onClick: function () { setZoom(null); } },
        h('img', { src: zoom, alt: '' })) : null
    ]);
  }

  /* ------------------------------------------------------------------ boot */

  function mount(data) {
    buildBands(data);
    buildIds(data);
    SCALE_ID = storedScale();
    applyPalette(storedPalette());
    var root = document.getElementById('root');
    ReactDOM.createRoot(root).render(h(App, { data: data }));
  }
  window.__mountCookbook = mount;
})();
