/* A Design Cookbook for UI of AI — v2 application.
   Taxonomy: 83 patterns in 10 categories, 23 human factors with 97 sub-factors.
   Paper->pattern and paper->factor are both many-to-many; categories are derived from patterns.
   Data arrives as window.__DATA__ (schema 2.0.0). */
(function () {
  'use strict';

  var h = React.createElement;
  var useState = React.useState, useEffect = React.useEffect, useMemo = React.useMemo, useRef = React.useRef;

  /* ----------------------------------------------------------------- bands */
  /* Reading order for the ten categories: one pass through an interaction, chunked into
     three bands. Display only — category_order and the U01-U10 ids are untouched. */

  var BANDS = [
    {
      name: 'Setting the specs',
      gloss: 'what you specify, when the system acts, what it may not do',
      categories: ['U01', 'U02', 'U03']
    },
    {
      name: 'Working the output',
      gloss: 'how results arrive, and how you compare, edit and verify them',
      categories: ['U04', 'U05', 'U06', 'U07']
    },
    {
      name: 'Fitting into the work',
      gloss: 'workflow, workspace, and the other participants',
      categories: ['U08', 'U09', 'U10']
    }
  ];

  var CAT_RANK = {};
  var BAND_OF = {};
  BANDS.forEach(function (b, bi) {
    b.categories.forEach(function (cid, ci) {
      CAT_RANK[cid] = bi * 100 + ci;
      BAND_OF[cid] = b;
    });
  });

  // categories in band order, as [{band, categories:[...]}]
  function bandedCategories(d) {
    var byId = {};
    d.categories.forEach(function (c) { byId[c.category_id] = c; });
    return BANDS.map(function (b) {
      return { band: b, categories: b.categories.map(function (id) { return byId[id]; }).filter(Boolean) };
    });
  }

  // patterns sorted by category (already renumbered into reading order), then pattern_order
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
  // Pine encodes quantity: matrix cells and count bars. Interactive elements stay ink,
  // so colour never has to mean "value" and "clickable" at the same time.
  function tint(t) {
    var a = Math.max(0, Math.min(1, t));
    return 'rgba(11, 107, 79, ' + (0.06 + a * 0.88).toFixed(3) + ')';
  }
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

  // The 15-pattern model is retired. Its routes resolve to the v2 equivalents and
  // announce themselves rather than silently posing as new patterns.
  function normalizeRoute(r) {
    var legacy = null;
    if (r.view === 'paradigms') { r = { view: 'patterns', id: null, query: r.query }; legacy = { kind: 'pattern' }; }
    else if (r.view === 'paradigm') { legacy = { kind: 'pattern', code: r.id }; r = { view: 'patterns', id: null, query: r.query }; }
    else if (r.view === 'difficulties') { r = { view: 'factors', id: null, query: r.query }; legacy = { kind: 'factor' }; }
    else if (r.view === 'difficulty') { legacy = { kind: 'factor', code: r.id }; r = { view: 'factor', id: r.id, query: r.query }; }
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
    if (props.href) return h('a', { className: cx('chip', props.className), href: props.href, title: props.title }, inner);
    return h('span', { className: cx('chip', props.className), title: props.title }, inner);
  }

  function UiUxChip(props) {
    return h(Chip, { className: props.type === 'UI' ? 'chip-ui' : 'chip-ux', title: props.rationale }, props.type + '-led');
  }

  function Bar(props) {
    return h('div', { className: 'bar', title: props.title },
      h('i', { style: { width: Math.max(1.5, props.value * 100) + '%', background: props.color || null } }));
  }

  function SectionHead(props) {
    return h('div', { className: 'sec-head' }, [
      h('h2', { key: 'h' }, props.title),
      props.note ? h('p', { className: 'small dim', key: 'n', style: { marginLeft: 'auto', maxWidth: '52ch' } }, props.note) : null
    ]);
  }

  function Empty(props) { return h('p', { className: 'small dim', style: { padding: '18px 0' } }, props.children); }

  function BandHead(props) {
    return h('div', { className: 'band-head' }, [
      h('h3', { key: 'n' }, props.band.name),
      h('p', { className: 'tiny', key: 'g' }, props.band.gloss),
      props.count ? h('span', { className: 'tiny dim', key: 'c' }, props.count) : null
    ]);
  }

  /* ---------------------------------------------------------- paper pieces */

  function PatternChips(props) {
    var ix = props.ix, ids = props.ids, max = props.max || 99;
    var shown = ids.slice(0, max);
    return h('div', { className: 'chips' }, shown.map(function (id) {
      var p = ix.pattern[id];
      if (!p) return null;
      return h(Chip, { key: id, code: p.pattern_id.replace('pat-', ''), href: '#/pattern/' + id, title: p.short_summary }, p.pattern_name);
    }).concat(ids.length > max
      ? [h('span', { className: 'chip', key: 'more' }, '+' + (ids.length - max) + ' more')]
      : []));
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
        ? h(PatternChips, { key: 'c', ix: ix, ids: p.pattern_ids, max: 5 })
        : null
    ]);
  }

  function PaperList(props) {
    var step = props.step || 25;
    var st = useState(step), n = st[0], setN = st[1];
    var rows = props.rows;
    useEffect(function () { setN(step); }, [props.resetKey]);
    if (!rows.length) return h(Empty, null, props.emptyText || 'No papers match.');
    return h('div', null, [
      h('div', { className: 'plist', key: 'l' }, rows.slice(0, n).map(function (r) {
        return h(PaperRow, { key: r.paper.rid, paper: r.paper, ix: props.ix, quote: r.quote, metaExtra: r.metaExtra, chips: props.chips });
      })),
      h('div', { key: 'f', style: { display: 'flex', gap: '12px', alignItems: 'center', marginTop: '16px' } }, [
        n < rows.length
          ? h('button', { className: 'btn', key: 'b', onClick: function () { setN(n + 25); } }, 'Show more papers')
          : null,
        h('span', { className: 'tiny', key: 's' }, 'Showing ' + Math.min(n, rows.length) + ' of ' + rows.length + ' papers')
      ])
    ]);
  }

  /* ------------------------------------------------------------------ home */

  function Matrix(props) {
    var d = props.d, ix = props.ix;
    var hov = useState(null), hover = hov[0], setHover = hov[1];
    var sel = useState(null), selected = sel[0], setSelected = sel[1];

    var md = useState('row'), mode = md[0], setMode = md[1];

    var rows = bandedPatterns(d);
    var cols = d.factors;

    // Two shading scales over the same counts.
    //   row      — the cell as a share of its pattern's own papers, normalized by the largest
    //              such share. Big and small patterns stay comparable.
    //   absolute — the raw count placed between the smallest and largest cell in the whole
    //              matrix. Comparable across the grid, but large patterns dominate.
    var maxShare = 0, minCell = Infinity, maxCell = 0;
    rows.forEach(function (p) {
      var row = d.indexes.pattern_x_factor[p.pattern_id] || {};
      Object.keys(row).forEach(function (f) {
        var n = row[f];
        var s = n / (p.mapped_paper_count || 1);
        if (s > maxShare) maxShare = s;
        if (n < minCell) minCell = n;
        if (n > maxCell) maxCell = n;
      });
    });
    if (minCell === Infinity) minCell = 0;
    var spread = Math.max(1, maxCell - minCell);

    function intensity(n, share) {
      if (!n) return 0;
      return mode === 'row' ? share / maxShare : (n - minCell) / spread;
    }

    var body = [];
    var lastCat = null, lastBand = null;
    rows.forEach(function (p) {
      var band = BAND_OF[p.category_id];
      if (band && band !== lastBand) {
        lastBand = band;
        body.push(h('tr', { className: 'bandhead', key: 'band-' + band.name },
          h('td', { colSpan: cols.length + 1 }, band.name)));
      }
      if (p.category_id !== lastCat) {
        lastCat = p.category_id;
        var c = ix.category[p.category_id];
        body.push(h('tr', { className: 'cathead', key: 'cat-' + c.category_id },
          h('td', { colSpan: cols.length + 1 },
            h('a', { href: '#/category/' + c.category_id }, c.category_id + ' · ' + c.category_name))));
      }
      var row = d.indexes.pattern_x_factor[p.pattern_id] || {};
      var dimRow = hover && hover.p !== p.pattern_id;
      body.push(h('tr', { key: p.pattern_id }, [
        h('th', { className: 'rowhead', key: 'rh', style: { opacity: dimRow && hover.f == null ? 0.4 : 1 } },
          h('a', { href: '#/pattern/' + p.pattern_id, title: p.short_summary }, [
            h('span', { className: 'mono', key: 'c' }, p.pattern_id.replace('pat-', '')),
            h('span', { key: 'n' }, p.pattern_name)
          ]))
      ].concat(cols.map(function (f) {
        var n = row[f.factor_id] || 0;
        var share = n / (p.mapped_paper_count || 1);
        var t = intensity(n, share);
        var on = hover && (hover.p === p.pattern_id || hover.f === f.factor_id);
        var isSel = selected && selected.p === p.pattern_id && selected.f === f.factor_id;
        return h('td', {
          key: f.factor_id,
          className: cx('cell', !n && 'empty'),
          title: p.pattern_name + ' × ' + f.factor_name + ' — ' + plural(n, 'paper') + ', ' +
            pct(n, p.mapped_paper_count) + '% of this pattern, ' + pct(n, f.mapped_paper_count) + '% of this factor',
          style: {
            background: n ? tint(t) : 'var(--band)',
            color: t > 0.42 ? '#ffffff' : 'var(--ink-3)',
            opacity: !hover || on ? 1 : 0.28,
            boxShadow: isSel ? 'inset 0 0 0 2px var(--ink)' : 'none'
          },
          onMouseEnter: function () { setHover({ p: p.pattern_id, f: f.factor_id }); },
          onClick: function () { setSelected(n ? { p: p.pattern_id, f: f.factor_id, n: n } : null); }
        }, n || '');
      }))));
    });

    var readout = null;
    if (selected) {
      var p = ix.pattern[selected.p], f = ix.factor[selected.f];
      readout = h('div', { className: 'readout', style: { marginTop: '16px' } }, [
        h('div', { className: 'kicker', key: 'k' }, p.pattern_id + ' × ' + f.factor_id),
        h('h3', { key: 'h', style: { margin: '8px 0 6px' } }, p.pattern_name + '  ×  ' + f.factor_name),
        h('p', { className: 'small', key: 'n' },
          plural(selected.n, 'paper') + ' carry both — ' + pct(selected.n, p.mapped_paper_count) + '% of this pattern, ' +
          pct(selected.n, f.mapped_paper_count) + '% of this factor.'),
        h('div', { className: 'tag-row', key: 'l', style: { marginTop: '12px' } }, [
          h('a', { className: 'chip', key: 'a', href: papersHref({ p: p.pattern_id, f: f.factor_id }) }, 'Browse these papers'),
          h('a', { className: 'chip', key: 'b', href: '#/pattern/' + p.pattern_id }, 'Pattern page'),
          h('a', { className: 'chip', key: 'c', href: '#/factor/' + f.factor_id }, 'Factor page'),
          h('button', { className: 'chip', key: 'd', onClick: function () { setSelected(null); } }, 'Clear')
        ])
      ]);
    }

    return h('div', null, [
      h('div', { className: 'matrix-legend', key: 'lg', style: { marginBottom: '10px' } }, [
        h('span', { key: 'lo' }, mode === 'row' ? '0%' : minCell + (minCell === 1 ? ' paper' : ' papers')),
        h('span', { className: 'swatches', key: 'sw' }, [0.05, 0.3, 0.55, 0.8, 1].map(function (t, i) {
          return h('i', { key: i, style: { background: tint(t) } });
        })),
        h('span', { key: 'hi' }, mode === 'row'
          ? Math.round(maxShare * 100) + '% of a pattern’s papers'
          : maxCell + ' papers'),
        h('span', { key: 'sp', style: { marginLeft: 'auto' } }, 'Shade by'),
        h('div', { className: 'tag-row', key: 'tg' }, [
          { key: 'row', label: 'Share of row', title: 'Each cell as a share of that pattern’s own papers — large and small patterns stay comparable.' },
          { key: 'absolute', label: 'Absolute count', title: 'Each cell placed between the smallest and largest cell in the matrix — comparable across the whole grid.' }
        ].map(function (o) {
          return h('button', {
            key: o.key, className: cx('btn', mode === o.key && 'on'), title: o.title,
            style: { padding: '5px 10px', fontSize: '12px' },
            onClick: function () { setMode(o.key); }
          }, o.label);
        }))
      ]),
      h('div', { className: 'matrix-scroll', key: 'm', onMouseLeave: function () { setHover(null); } },
        h('table', { className: 'matrix' }, [
          h('thead', { key: 'h' }, h('tr', null, [h('th', { className: 'rowhead', key: 'x' }, '')].concat(
            cols.map(function (f) {
              return h('th', { className: 'colhead', key: f.factor_id, style: { opacity: !hover || hover.f === f.factor_id ? 1 : 0.4 } },
                h('div', null, h('a', { href: '#/factor/' + f.factor_id }, f.factor_id + '  ' + f.factor_name)));
            })))),
          h('tbody', { key: 'b' }, body)
        ])),
      readout,
      h('p', { className: 'tiny', key: 'n', style: { marginTop: '12px' } },
        'Each cell counts the distinct papers carrying both the pattern and the factor. Because a paper can hold several ' +
        'patterns and several factors, rows and columns sum past the paper count — they are co-occurrences, not partitions. ' +
        (mode === 'row'
          ? 'Shading is each cell as a share of that pattern’s own papers, normalized to the strongest share in the ' +
            'matrix (' + Math.round(maxShare * 100) + '%). Rows are internally comparable; a dark cell in a small pattern ' +
            'and a dark cell in a large one mean the same thing about that pattern, not the same number of papers.'
          : 'Shading runs from the smallest cell in the matrix (' + minCell + ') to the largest (' + maxCell + '), on raw ' +
            'counts. Comparable across the whole grid, but the largest patterns dominate and small patterns read as empty ' +
            'even where a factor accounts for most of their papers.'))
    ]);
  }

  function Home(props) {
    var d = props.d, ix = props.ix;
    var topPatterns = d.patterns.slice().sort(function (a, b) { return b.mapped_paper_count - a.mapped_paper_count; }).slice(0, 6);
    var topFactors = d.factors.slice().sort(function (a, b) { return b.mapped_paper_count - a.mapped_paper_count; }).slice(0, 6);
    var maxCat = Math.max.apply(null, d.categories.map(function (c) { return d.indexes.by_category[c.category_id].mapped_paper_count; }));

    return h('div', null, [
      h('div', { className: 'hero', key: 'hero' }, [
        h('div', { className: 'kicker', key: 'k' }, 'Design cookbook'),
        h('h1', { key: 'h' }, 'Interfaces that coordinate humans with generative models'),
        h('p', { className: 'lede', key: 'l' },
          'A catalogue of ' + d.counts.patterns + ' interface design patterns, read off ' + d.counts.papers.toLocaleString() +
          ' HCI papers published 2022–2026, and the human factors each pattern is deployed against. ' +
          'A paper holds as many patterns as its interface actually shows — the average is ' +
          (d.counts.paper_pattern_edges / (d.counts.papers - d.counts.papers_with_no_pattern)).toFixed(1) + '.'),
        h('div', { className: 'stats', key: 's' }, [
          { n: d.counts.patterns, l: 'design patterns' },
          { n: d.counts.categories, l: 'categories' },
          { n: d.counts.factors, l: 'human factors' },
          { n: d.counts.sub_factors, l: 'sub-factors' },
          { n: d.counts.papers.toLocaleString(), l: 'papers' },
          { n: (d.counts.paper_pattern_edges + d.counts.paper_factor_edges).toLocaleString(), l: 'coded relationships' }
        ].map(function (s, i) {
          return h('div', { className: 'stat', key: i }, [
            h('div', { className: 'n', key: 'n' }, s.n),
            h('div', { className: 'l', key: 'l' }, s.l)
          ]);
        }))
      ]),

      h('div', { className: 'sec', key: 'cats' }, [
        h(SectionHead, {
          title: 'The ten categories',
          note: 'Read as one pass through an interaction: what you set up, what comes back, and where it all lives. Every pattern sits in exactly one category, and a paper reaches a category through its patterns — so counts are distinct papers, never sums.'
        }),
        h('div', null, bandedCategories(d).map(function (g) {
          return h('div', { className: 'band', key: g.band.name }, [
            h(BandHead, { key: 'h', band: g.band, count: plural(g.categories.length, 'category', 'categories') }),
            h('div', { className: 'grid g2', key: 'g' }, g.categories.map(function (c) {
              var n = d.indexes.by_category[c.category_id].mapped_paper_count;
              return h('a', { className: 'card', key: c.category_id, href: '#/category/' + c.category_id }, [
                h('div', { className: 'kicker', key: 'k' }, c.category_id),
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
        h(SectionHead, { title: 'Patterns against human factors', note: 'Click a cell to see how many papers hold both, and to open them.' }),
        h(Matrix, { d: d, ix: ix })
      ]),

      h('div', { className: 'sec', key: 'top' }, [
        h('div', { className: 'grid g2' }, [
          h('div', { key: 'p' }, [
            h(SectionHead, { title: 'Most-carried patterns' }),
            h('div', { className: 'plist' }, topPatterns.map(function (p) {
              return h('a', { className: 'prow', key: p.pattern_id, href: '#/pattern/' + p.pattern_id }, [
                h('h3', { key: 'h' }, p.pattern_name),
                h('div', { className: 'meta', key: 'm' }, p.pattern_id + '  ·  ' + ix.category[p.category_id].category_name + '  ·  ' + p.mapped_paper_count + ' papers')
              ]);
            }))
          ]),
          h('div', { key: 'f' }, [
            h(SectionHead, { title: 'Most-cited human factors' }),
            h('div', { className: 'plist' }, topFactors.map(function (f) {
              return h('a', { className: 'prow', key: f.factor_id, href: '#/factor/' + f.factor_id }, [
                h('h3', { key: 'h' }, f.factor_name),
                h('div', { className: 'meta', key: 'm' }, f.factor_id + '  ·  ' + plural(f.sub_factors.length, 'sub-factor') + '  ·  ' + f.mapped_paper_count + ' papers' + (f.is_new_in_v2 ? '  ·  new in v2' : ''))
              ]);
            }))
          ])
        ])
      ])
    ]);
  }

  /* -------------------------------------------------------------- patterns */

  function Patterns(props) {
    var d = props.d, ix = props.ix;
    var q = useState(''), text = q[0], setText = q[1];
    var lens = useState('all'), lensV = lens[0], setLens = lens[1];
    var needle = text.trim().toLowerCase();
    var max = Math.max.apply(null, d.patterns.map(function (p) { return p.mapped_paper_count; }));

    var shown = d.patterns.filter(function (p) {
      if (lensV !== 'all' && p.ui_ux_type !== lensV) return false;
      if (!needle) return true;
      return (p.pattern_name + ' ' + p.short_summary + ' ' + p.definition + ' ' + (p.sub_pattern || '') + ' ' + p.category_name)
        .toLowerCase().indexOf(needle) >= 0;
    });

    var bands = bandedCategories(d).map(function (g) {
      return {
        band: g.band,
        groups: g.categories.map(function (c) {
          return { cat: c, items: shown.filter(function (p) { return p.category_id === c.category_id; }) };
        }).filter(function (g2) { return g2.items.length; })
      };
    }).filter(function (b) { return b.groups.length; });

    return h('div', null, [
      h('div', { key: 'h', style: { paddingTop: '46px' } }, [
        h('div', { className: 'kicker' }, 'Catalogue'),
        h('h1', { style: { margin: '12px 0 16px' } }, plural(d.counts.patterns, 'design pattern')),
        h('p', { className: 'lede', style: { maxWidth: '68ch' } },
          'Each pattern is an observable interaction or interface structure — not a topic, a model, or an outcome. ' +
          'Patterns are grouped into ' + d.counts.categories + ' categories, and each is labelled UI-led (a rendering or control commitment) ' +
          'or UX-led (a commitment about the experience).')
      ]),
      h('div', { className: 'filterbar', key: 'f', style: { marginTop: '26px' } }, [
        h('div', { className: 'row', key: 'r1' }, [
          h('label', { key: 'l' }, 'Search'),
          h('input', {
            key: 'i', className: 'search', style: { flex: 1 }, value: text, placeholder: 'name, definition, sub-pattern…',
            onChange: function (e) { setText(e.target.value); }
          })
        ]),
        h('div', { className: 'row', key: 'r2' }, [
          h('label', { key: 'l' }, 'Lens'),
          h('div', { className: 'tag-row', key: 't' }, ['all', 'UI', 'UX'].map(function (v) {
            return h('button', {
              key: v, className: cx('btn', lensV === v && 'on'), onClick: function () { setLens(v); }
            }, v === 'all' ? 'All ' + d.counts.patterns : (v + '-led ' + d.patterns.filter(function (p) { return p.ui_ux_type === v; }).length));
          }))
        ])
      ]),
      h('div', { key: 'g' }, bands.length ? bands.map(function (b) {
        return h('div', { className: 'sec band', key: b.band.name }, [
          h(BandHead, {
            key: 'bh', band: b.band,
            count: plural(b.groups.reduce(function (t, g) { return t + g.items.length; }, 0), 'pattern')
          })
        ].concat(b.groups.map(function (g) {
        return h('div', { className: 'sec', key: g.cat.category_id, style: { marginTop: '30px' } }, [
          h('div', { className: 'sec-head', key: 'h' }, [
            h('h2', { key: 'a' }, h('a', { href: '#/category/' + g.cat.category_id }, g.cat.category_name)),
            h('span', { className: 'kicker', key: 'b' }, g.cat.category_id),
            h('span', { className: 'tiny', key: 'c', style: { marginLeft: 'auto' } },
              plural(g.items.length, 'pattern') + '  ·  ' + d.indexes.by_category[g.cat.category_id].mapped_paper_count + ' papers')
          ]),
          h('div', { className: 'grid g2', key: 'g' }, g.items.map(function (p) {
            return h('a', { className: 'card', key: p.pattern_id, href: '#/pattern/' + p.pattern_id }, [
              h('div', { key: 'top', style: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' } }, [
                h('span', { className: 'mono', key: 'c', style: { fontSize: '11px', color: 'var(--ink-4)' } }, p.pattern_id),
                h(UiUxChip, { key: 'u', type: p.ui_ux_type, rationale: p.ui_ux_rationale })
              ]),
              h('h3', { key: 'n' }, p.pattern_name),
              p.sub_pattern ? h('p', { className: 'tiny', key: 's', style: { marginTop: '4px' } }, p.sub_pattern) : null,
              h('p', { className: 'small', key: 'd', style: { marginTop: '10px' } }, p.short_summary),
              h('div', { key: 'b', style: { marginTop: '14px' } }, h(Bar, { value: p.mapped_paper_count / max })),
              h('p', { className: 'tiny', key: 'm', style: { marginTop: '8px' } },
                p.mapped_paper_count + ' papers  ·  ' + p.mapped_central_count + ' central')
            ]);
          }))
        ]);
        })));
      }) : h(Empty, null, 'No pattern matches that search.'))
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

    var stages = {};
    rids.forEach(function (rid) {
      (ix.paper[rid].lifecycle_stages || []).forEach(function (s) { stages[s] = (stages[s] || 0) + 1; });
    });
    var stageLine = Object.keys(stages).sort().map(function (s) {
      var lab = ((d.lifecycle && d.lifecycle.stages && d.lifecycle.stages[s]) || {}).label || s;
      return lab + ' (' + stages[s] + ')';
    }).join('  ·  ');

    var rows = edges.map(function (e) {
      return {
        paper: ix.paper[e.rid],
        quote: e.evidence_quote,
        metaExtra: [e.role === 'central' ? 'central to this pattern' : 'present', e.evidence_location, e.confidence + ' confidence']
      };
    });

    return h('div', { style: { paddingTop: '38px' } }, [
      h('a', { className: 'back', key: 'b', href: '#/patterns' }, '← All patterns'),
      h('div', { key: 'head', style: { marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' } }, [
        h('span', { className: 'kicker', key: 'c' }, p.pattern_id),
        h(UiUxChip, { key: 'u', type: p.ui_ux_type, rationale: p.ui_ux_rationale }),
        h(Chip, { key: 'cat', href: '#/category/' + cat.category_id, code: cat.category_id }, cat.category_name),
        p.sub_pattern ? h(Chip, { key: 's' }, p.sub_pattern) : null
      ]),
      h('h1', { key: 'h', style: { margin: '18px 0 18px', maxWidth: '22ch' } }, p.pattern_name),
      h('p', { className: 'lede', key: 'd', style: { maxWidth: '72ch' } }, p.definition),

      h('div', { className: 'grid g3', key: 'stats', style: { marginTop: '30px' } }, [
        { n: p.mapped_paper_count, l: 'papers carry it' },
        { n: p.mapped_central_count, l: 'centrally about it' },
        { n: p.n_venue_families, l: 'venue families' }
      ].map(function (s, i) {
        return h('div', { className: 'card', key: i }, [
          h('div', { className: 'stat', key: 's' }, [
            h('div', { className: 'n', key: 'n' }, s.n),
            h('div', { className: 'l', key: 'l' }, s.l)
          ])
        ]);
      })),

      h('div', { className: 'sec', key: 'def' }, [
        h('dl', { className: 'deflist' }, [
          h('dt', { key: 'a' }, 'Structural signature'),
          h('dd', { key: 'b' }, p.structural_signature),
          h('dt', { key: 'c' }, p.ui_ux_type === 'UI' ? 'Why UI-led' : 'Why UX-led'),
          h('dd', { key: 'd' }, p.ui_ux_rationale),
          stageLine ? h('dt', { key: 'e' }, 'Lifecycle stages of its papers') : null,
          stageLine ? h('dd', { className: 'small', key: 'f' }, stageLine) : null
        ])
      ]),

      profile.length ? h('div', { className: 'sec', key: 'prof' }, [
        h(SectionHead, { title: 'Human factors it is deployed against', note: 'Distinct papers holding both this pattern and that factor.' }),
        h('div', { className: 'stack' }, profile.map(function (row) {
          return h('a', { key: row.factor.factor_id, href: papersHref({ p: p.pattern_id, f: row.factor.factor_id }), style: { display: 'block' } }, [
            h('div', { key: 'l', style: { display: 'flex', gap: '10px', alignItems: 'baseline', fontFamily: 'var(--sans)', fontSize: '13px' } }, [
              h('span', { className: 'mono', key: 'c', style: { fontSize: '11px', color: 'var(--ink-4)', width: '34px' } }, row.factor.factor_id),
              h('span', { key: 'n' }, row.factor.factor_name),
              h('span', { className: 'dim', key: 'v', style: { marginLeft: 'auto' } }, row.n + ' papers · ' + pct(row.n, p.mapped_paper_count) + '%')
            ]),
            h('div', { key: 'b', style: { marginTop: '5px' } }, h(Bar, { value: row.n / maxF }))
          ]);
        }))
      ]) : null,

      h('div', { className: 'sec', key: 'papers' }, [
        h(SectionHead, {
          title: 'Papers',
          note: 'Each quote is the line from that paper which justified this pattern. Central means the paper is substantially about this move.'
        }),
        h(PaperList, { rows: rows, ix: ix, resetKey: p.pattern_id })
      ]),

      siblings.length ? h('div', { className: 'sec', key: 'sib' }, [
        h(SectionHead, { title: 'Others in ' + cat.category_name }),
        h('div', { className: 'tag-row' }, siblings.map(function (s) {
          return h(Chip, { key: s.pattern_id, href: '#/pattern/' + s.pattern_id, code: s.pattern_id.replace('pat-', ''), title: s.short_summary }, s.pattern_name);
        }))
      ]) : null
    ]);
  }

  /* ------------------------------------------------------------ categories */

  function Categories(props) {
    var d = props.d;
    return h('div', { style: { paddingTop: '46px' } }, [
      h('div', { className: 'kicker', key: 'k' }, 'Catalogue'),
      h('h1', { key: 'h', style: { margin: '12px 0 16px' } }, 'Ten categories'),
      h('p', { className: 'lede', key: 'l', style: { maxWidth: '70ch' } },
        'Categories partition the ' + d.counts.patterns + ' patterns, and are laid out as one pass through an ' +
        'interaction. Papers do not belong to categories directly — a paper reaches a category through the ' +
        'patterns it carries, so a paper can sit in several at once.'),
      h('div', { className: 'sec', key: 'g' }, bandedCategories(d).map(function (g) {
        return h('div', { className: 'band', key: g.band.name }, [
          h(BandHead, { key: 'h', band: g.band }),
          h('div', { className: 'grid g2', key: 'g' }, g.categories.map(function (c) {
            var idx = d.indexes.by_category[c.category_id];
            return h('a', { className: 'card', key: c.category_id, href: '#/category/' + c.category_id }, [
              h('div', { className: 'kicker', key: 'k' }, c.category_id + '  ·  ' + c.dominant_lens),
              h('h3', { key: 'h', style: { margin: '8px 0 10px' } }, c.category_name),
              h('p', { className: 'small', key: 'd' }, c.category_description),
              h('p', { className: 'tiny', key: 'm', style: { marginTop: '12px' } },
                plural(c.pattern_count, 'pattern') + '  ·  ' + idx.mapped_paper_count.toLocaleString() + ' papers')
            ]);
          }))
        ]);
      }))
    ]);
  }

  function CategoryPage(props) {
    var d = props.d, ix = props.ix;
    var c = ix.category[props.id];
    if (!c) return h(Empty, null, 'No category with id ' + props.id + '.');
    var idx = d.indexes.by_category[c.category_id];
    var pats = d.patterns.filter(function (p) { return p.category_id === c.category_id; });
    var max = Math.max.apply(null, pats.map(function (p) { return p.mapped_paper_count; }));
    var rows = idx.rids.map(function (rid) { return { paper: ix.paper[rid] }; });

    return h('div', { style: { paddingTop: '38px' } }, [
      h('a', { className: 'back', key: 'b', href: '#/categories' }, '← All categories'),
      h('div', { className: 'kicker', key: 'k', style: { marginTop: '20px' } },
        [c.category_id, BAND_OF[c.category_id] && BAND_OF[c.category_id].name, c.dominant_lens + '-dominant']
          .filter(Boolean).join('  ·  ')),
      h('h1', { key: 'h', style: { margin: '14px 0 18px' } }, c.category_name),
      h('p', { className: 'lede', key: 'd', style: { maxWidth: '72ch' } }, c.category_description),
      h('div', { className: 'sec', key: 'bd' }, h('dl', { className: 'deflist' }, [
        h('dt', { key: 'a' }, 'Classification boundary'),
        h('dd', { key: 'b' }, c.classification_boundary)
      ])),
      h('div', { className: 'sec', key: 'p' }, [
        h(SectionHead, {
          title: plural(pats.length, 'pattern'),
          note: c.ui_pattern_count + ' UI-led, ' + c.ux_pattern_count + ' UX-led. ' + idx.mapped_paper_count.toLocaleString() + ' distinct papers reach this category.'
        }),
        h('div', { className: 'grid g2' }, pats.map(function (p) {
          return h('a', { className: 'card', key: p.pattern_id, href: '#/pattern/' + p.pattern_id }, [
            h('div', { key: 'top', style: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' } }, [
              h('span', { className: 'mono', key: 'c', style: { fontSize: '11px', color: 'var(--ink-4)' } }, p.pattern_id),
              h(UiUxChip, { key: 'u', type: p.ui_ux_type, rationale: p.ui_ux_rationale })
            ]),
            h('h3', { key: 'n' }, p.pattern_name),
            h('p', { className: 'small', key: 'd', style: { marginTop: '9px' } }, p.short_summary),
            h('div', { key: 'b', style: { marginTop: '13px' } }, h(Bar, { value: p.mapped_paper_count / max })),
            h('p', { className: 'tiny', key: 'm', style: { marginTop: '8px' } }, p.mapped_paper_count + ' papers')
          ]);
        }))
      ]),
      h('div', { className: 'sec', key: 'papers' }, [
        h(SectionHead, { title: 'Papers reaching this category', note: 'Distinct papers — a paper holding two patterns from this category is counted once.' }),
        h(PaperList, { rows: rows, ix: ix, resetKey: c.category_id })
      ])
    ]);
  }

  /* --------------------------------------------------------------- factors */

  function Factors(props) {
    var d = props.d;
    var max = Math.max.apply(null, d.factors.map(function (f) { return f.mapped_paper_count; }));
    return h('div', { style: { paddingTop: '46px' } }, [
      h('div', { className: 'kicker', key: 'k' }, 'Human factors'),
      h('h1', { key: 'h', style: { margin: '12px 0 16px' } }, plural(d.counts.factors, 'human factor')),
      h('p', { className: 'lede', key: 'l', style: { maxWidth: '70ch' } },
        'The difficulties, capacities and stakes these interfaces are aimed at. ' +
        'Each factor holds ' + 'a set of sub-factors — ' + d.counts.sub_factors + ' in total — and a paper carries as many as its ' +
        'claims support. There is no single primary factor per paper in this taxonomy.'),
      h('div', { className: 'sec', key: 'g' }, h('div', { className: 'grid g2' }, d.factors.map(function (f) {
        return h('a', { className: 'card', key: f.factor_id, href: '#/factor/' + f.factor_id }, [
          h('div', { key: 'top', style: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '9px' } }, [
            h('span', { className: 'mono', key: 'c', style: { fontSize: '11px', color: 'var(--ink-4)' } }, f.factor_id),
            f.is_new_in_v2 ? h(Chip, { key: 'n', className: 'chip-new' }, 'new in v2') : null
          ]),
          h('h3', { key: 'h' }, f.factor_name),
          h('p', { className: 'small', key: 'd', style: { marginTop: '9px' } },
            f.definition ? f.definition.split(/(?<=\.)\s/)[0] : f.sub_factors[0].definition.split(/(?<=\.)\s/)[0]),
          h('div', { key: 'b', style: { marginTop: '13px' } }, h(Bar, { value: f.mapped_paper_count / max })),
          h('p', { className: 'tiny', key: 'm', style: { marginTop: '8px' } },
            f.mapped_paper_count.toLocaleString() + ' papers  ·  ' + f.mapped_central_count + ' central  ·  ' + plural(f.sub_factors.length, 'sub-factor'))
        ]);
      })))
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

    return h('div', { style: { paddingTop: '38px' } }, [
      h('a', { className: 'back', key: 'b', href: '#/factors' }, '← All factors'),
      h('div', { key: 'k', style: { marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' } }, [
        h('span', { className: 'kicker', key: 'c' }, 'Factor ' + f.factor_id),
        f.is_new_in_v2 ? h(Chip, { key: 'n', className: 'chip-new' }, 'new in v2') : null
      ]),
      h('h1', { key: 'h', style: { margin: '16px 0 18px' } }, f.factor_name),
      h('p', { className: 'lede', key: 'd', style: { maxWidth: '72ch' } }, f.definition),
      f.boundary_rule ? h('div', { className: 'sec', key: 'bd' }, h('dl', { className: 'deflist' }, [
        h('dt', { key: 'a' }, 'Boundary rule'),
        h('dd', { key: 'b' }, f.boundary_rule)
      ])) : null,

      h('div', { className: 'grid g3', key: 'stats', style: { marginTop: '30px' } }, [
        { n: f.mapped_paper_count.toLocaleString(), l: 'papers carry it' },
        { n: f.mapped_central_count.toLocaleString(), l: 'centrally about it' },
        { n: f.sub_factors.length, l: 'sub-factors' }
      ].map(function (s, i) {
        return h('div', { className: 'card', key: i },
          h('div', { className: 'stat' }, [
            h('div', { className: 'n', key: 'n' }, s.n),
            h('div', { className: 'l', key: 'l' }, s.l)
          ]));
      })),

      h('div', { className: 'sec', key: 'subs' }, [
        h(SectionHead, {
          title: plural(f.sub_factors.length, 'sub-factor'),
          note: 'The grain the corpus was coded at. A paper can hold several sub-factors of one factor; the factor counts it once.'
        }),
        h('div', null, f.sub_factors.map(function (s) {
          return h('div', { className: 'subcard', key: s.sub_factor_id }, [
            h('div', { key: 'h', style: { display: 'flex', gap: '12px', alignItems: 'baseline', flexWrap: 'wrap' } }, [
              h('h3', { key: 'n', style: { fontSize: '17px' } }, s.sub_factor_name),
              h('span', { className: 'tiny', key: 'm', style: { marginLeft: 'auto' } },
                s.mapped_paper_count + ' papers · ' + s.mapped_central_count + ' central' + (s.origin === 'proposed' ? ' · proposed' : ''))
            ]),
            h('div', { key: 'b', style: { marginTop: '9px' } }, h(Bar, { value: s.mapped_paper_count / maxSub })),
            h('p', { className: 'small', key: 'd', style: { marginTop: '11px' } }, s.definition),
            s.framing ? h('p', { className: 'tiny', key: 'f', style: { marginTop: '8px' } }, s.framing) : null,
            h('div', { className: 'tag-row', key: 'l', style: { marginTop: '11px' } }, [
              h('a', { className: 'chip', key: 'a', href: papersHref({ s: s.sub_factor_id }) }, 'Browse its papers')
            ])
          ]);
        }))
      ]),

      topPats.length ? h('div', { className: 'sec', key: 'pat' }, [
        h(SectionHead, { title: 'Patterns most often deployed against it' }),
        h('div', { className: 'stack' }, topPats.map(function (pid) {
          var p = ix.pattern[pid];
          return h('a', { key: pid, href: papersHref({ p: pid, f: f.factor_id }), style: { display: 'block' } }, [
            h('div', { key: 'l', style: { display: 'flex', gap: '10px', alignItems: 'baseline', fontFamily: 'var(--sans)', fontSize: '13px' } }, [
              h('span', { className: 'mono', key: 'c', style: { fontSize: '11px', color: 'var(--ink-4)', width: '58px' } }, p.pattern_id),
              h('span', { key: 'n' }, p.pattern_name),
              h('span', { className: 'dim', key: 'v', style: { marginLeft: 'auto' } }, counts[pid] + ' papers')
            ]),
            h('div', { key: 'b', style: { marginTop: '5px' } }, h(Bar, { value: counts[pid] / maxP }))
          ]);
        }))
      ]) : null,

      h('div', { className: 'sec', key: 'papers' }, [
        h(SectionHead, { title: 'Papers', note: 'Quote shown is the evidence for the sub-factor the paper is most centrally coded to here.' }),
        h(PaperList, { rows: rows, ix: ix, resetKey: f.factor_id })
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
        { n: p.category_ids.length, l: 'categories reached' },
        { n: p.factor_ids.length, l: 'human factors' }
      ].map(function (s, i) {
        return h('div', { className: 'card', key: i },
          h('div', { className: 'stat' }, [
            h('div', { className: 'n', key: 'n' }, s.n),
            h('div', { className: 'l', key: 'l' }, s.l)
          ]));
      })),

      cats.length ? h('div', { className: 'sec', key: 'cats' }, [
        h(SectionHead, { title: 'Categories', note: 'Derived from this paper’s patterns, deduplicated.' }),
        h('div', { className: 'tag-row' }, cats.map(function (c) {
          return h(Chip, { key: c.category_id, href: '#/category/' + c.category_id, code: c.category_id }, c.category_name);
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
        })) : h(Empty, null, 'No pattern was assigned to this paper under the v2 taxonomy.')
      ]),

      h('div', { className: 'sec', key: 'facs' }, [
        h(SectionHead, { title: 'Human factors', note: 'Coded at sub-factor grain; the parent factor is linked on each.' }),
        facEdges.length ? h('div', null, facEdges.map(function (e) {
          var s = ix.sub[e.sub_factor_id], f = ix.factor[e.factor_id];
          return edgeCard(e.sub_factor_id,
            h('a', { href: '#/factor/' + e.factor_id }, s.sub_factor_name),
            f.factor_id + '  ·  ' + f.factor_name,
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
      h('div', { className: 'kicker', key: 'k' }, 'Corpus'),
      h('h1', { key: 'h', style: { margin: '12px 0 16px' } }, 'Browse papers'),
      h('p', { className: 'lede', key: 'l', style: { maxWidth: '70ch' } },
        'Selecting several patterns, categories or factors returns the union within that dimension. ' +
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
                  label: (i === 0 ? g.band.name.toUpperCase() + ' — ' : '') + c.category_id + ' · ' + c.category_name,
                  options: d.patterns.filter(function (p) { return p.category_id === c.category_id; }).map(function (p) {
                    return { id: p.pattern_id, code: p.pattern_id.replace('pat-', ''), name: p.pattern_name, n: p.mapped_paper_count };
                  })
                };
              }));
            }, [])
          }),
          h(Picker, {
            key: 'c', label: 'Categories', selected: sel.c, onToggle: function (id) { toggle('c', id); },
            groups: bandedCategories(d).map(function (g) {
              return {
                label: g.band.name,
                options: g.categories.map(function (c) {
                  return { id: c.category_id, code: c.category_id, name: c.category_name, n: d.indexes.by_category[c.category_id].mapped_paper_count };
                })
              };
            })
          }),
          h(Picker, {
            key: 'f', label: 'Factors', selected: sel.f, onToggle: function (id) { toggle('f', id); },
            groups: [{ options: d.factors.map(function (f) {
              return { id: f.factor_id, code: f.factor_id, name: f.factor_name, n: f.mapped_paper_count };
            }) }]
          }),
          h(Picker, {
            key: 's', label: 'Sub-factors', selected: sel.s, onToggle: function (id) { toggle('s', id); },
            groups: d.factors.map(function (f) {
              return {
                label: f.factor_id + ' · ' + f.factor_name,
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

  /* ---------------------------------------------------------------- method */

  function Method(props) {
    var d = props.d, m = d.meta || {}, mig = d.migration || {};
    var corpus = m.corpus || {};
    return h('div', { style: { paddingTop: '46px' } }, [
      h('div', { className: 'kicker', key: 'k' }, 'Method'),
      h('h1', { key: 'h', style: { margin: '12px 0 16px' } }, 'How this catalogue was built'),
      h('p', { className: 'lede', key: 'l', style: { maxWidth: '72ch' } }, m.note || m.source || ''),

      h('div', { className: 'sec', key: 'corpus' }, [
        h(SectionHead, { title: 'Corpus' }),
        h('dl', { className: 'deflist' }, [
          h('dt', { key: 'a' }, 'Scope'),
          h('dd', { key: 'b' }, (corpus.n_pdfs || d.counts.papers) + ' papers across ' +
            ((corpus.venues || []).join(', ')) + ', ' + ((corpus.year_range || []).join('–')) + '.'),
          h('dt', { key: 'c' }, 'Coding'),
          h('dd', { key: 'd' }, d.counts.paper_pattern_edges.toLocaleString() + ' paper–pattern relationships and ' +
            d.counts.paper_factor_edges.toLocaleString() + ' paper–sub-factor relationships, each carrying its own ' +
            'verbatim evidence quote, evidence location, role and confidence.')
        ])
      ]),

      m.method ? h('div', { className: 'sec', key: 'meth' }, [
        h(SectionHead, { title: 'Derivation' }),
        h('dl', { className: 'deflist' }, [
          h('dt', { key: 'a' }, 'Pattern derivation'), h('dd', { key: 'b' }, m.method.derivation),
          h('dt', { key: 'c' }, 'Factor axis'), h('dd', { key: 'd' }, m.method.axis),
          h('dt', { key: 'e' }, 'Naming'), h('dd', { key: 'f' }, m.method.naming)
        ])
      ]) : null,

      h('div', { className: 'sec', key: 'mig' }, [
        h(SectionHead, {
          title: 'Migration to v2',
          note: 'This site previously presented 15 patterns with one pattern per paper, and 18 factors with one primary factor per paper. Both were replaced.'
        }),
        h('div', { className: 'grid g2' }, [
          ['Patterns', d.counts.patterns + ' patterns in ' + d.counts.categories + ' categories, replacing the 15-pattern model. A paper carries as many as its interface shows.'],
          ['Factors', d.counts.factors + ' factors with ' + d.counts.sub_factors + ' sub-factors, replacing 18 factors with primary/secondary roles. There is no primary factor in v2.'],
          ['Papers without a pattern', d.counts.papers_with_no_pattern + ' of ' + d.counts.papers.toLocaleString() + ' papers carry no v2 pattern and are excluded from pattern pages, but remain browsable.'],
          ['Retired', 'The legacy exemplar sets and cross-cutting pattern list were both anchored to the 15-pattern model and have been removed. Legacy P1–P15 routes are archived, not remapped.']
        ].map(function (row, i) {
          return h('div', { className: 'card', key: i }, [
            h('h3', { key: 'h', style: { fontSize: '17px' } }, row[0]),
            h('p', { className: 'small', key: 'p', style: { marginTop: '8px' } }, row[1])
          ]);
        }))
      ]),

      mig.notes ? h('div', { className: 'sec', key: 'notes' }, [
        h(SectionHead, { title: 'Known limits' }),
        h('div', { className: 'stack' }, mig.notes.map(function (t, i) {
          return h('p', { className: 'small', key: i, style: { maxWidth: '78ch' } }, '— ' + t);
        }))
      ]) : null,

      (m.caveats && m.caveats.length) ? h('div', { className: 'sec', key: 'cav' }, [
        h(SectionHead, { title: 'Caveats carried from the source data' }),
        h('div', { className: 'stack' }, m.caveats.map(function (t, i) {
          return h('p', { className: 'small', key: i, style: { maxWidth: '78ch' } }, '— ' + t);
        }))
      ]) : null
    ]);
  }

  /* ------------------------------------------------------------------- app */

  function App(props) {
    var d = props.data;
    var ix = useMemo(function () { return buildIndex(d); }, [d]);
    var rs = useState(parseHash()), route = rs[0], setRoute = rs[1];
    var ls = useState(null), legacy = ls[0], setLegacy = ls[1];

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
    if (view === 'patterns') body = h(Patterns, { d: d, ix: ix });
    else if (view === 'pattern') body = h(PatternPage, { d: d, ix: ix, id: route.id });
    else if (view === 'categories') body = h(Categories, { d: d, ix: ix });
    else if (view === 'category') body = h(CategoryPage, { d: d, ix: ix, id: route.id });
    else if (view === 'factors') body = h(Factors, { d: d, ix: ix });
    else if (view === 'factor') body = h(FactorPage, { d: d, ix: ix, id: route.id });
    else if (view === 'papers') body = h(Papers, { d: d, ix: ix, query: route.query });
    else if (view === 'paper') body = h(PaperPage, { d: d, ix: ix, id: route.id });
    else if (view === 'method') body = h(Method, { d: d, ix: ix });
    else body = h(Home, { d: d, ix: ix });

    var nav = [
      ['#/patterns', 'Patterns', ['patterns', 'pattern']],
      ['#/categories', 'Categories', ['categories', 'category']],
      ['#/factors', 'Factors', ['factors', 'factor']],
      ['#/papers', 'Papers', ['papers', 'paper']],
      ['#/method', 'Method', ['method']]
    ];

    return h('div', null, [
      h('div', { className: 'topbar', key: 'top' },
        h('div', { className: 'wrap topbar-in' }, [
          h('a', { className: 'brand', key: 'b', href: '#/' }, [
            'A Design Cookbook for UI of AI',
            h('span', { className: 'brand-v', key: 'v' }, 'V2')
          ]),
          h('nav', { className: 'nav', key: 'n' }, nav.map(function (item) {
            return h('a', { key: item[0], href: item[0], className: cx(item[2].indexOf(view) >= 0 && 'on') }, item[1]);
          }))
        ])),
      h('div', { className: 'wrap', key: 'main' }, [
        legacy ? h('div', { className: 'notice', key: 'lg', style: { marginTop: '22px' } },
          legacy.kind === 'pattern'
            ? ('Archived route' + (legacy.code ? ' — ' + legacy.code : '') + '. The 15-pattern model this URL belongs to has been ' +
               'retired; the catalogue now holds ' + d.counts.patterns + ' patterns in ' + d.counts.categories +
               ' categories, and old pattern codes have no equivalent among them. Showing the current catalogue instead.')
            : ('Archived route' + (legacy.code ? ' — ' + legacy.code : '') + '. Factor ids carried over, but v2 re-coded ' +
               'every paper–factor relationship and dropped the primary/secondary distinction, so this factor’s membership ' +
               'differs from the version this URL was written for.')) : null,
        body
      ]),
      h('footer', { key: 'f' }, h('div', { className: 'wrap' }, [
        h('p', { key: 'a' }, 'Schema ' + d.schema_version + '  ·  ' + d.counts.papers.toLocaleString() + ' papers  ·  ' +
          d.counts.patterns + ' patterns  ·  ' + d.counts.categories + ' categories  ·  ' +
          d.counts.factors + ' factors  ·  ' + d.counts.sub_factors + ' sub-factors'),
        h('p', { key: 'b' }, 'Counts are distinct papers throughout.')
      ]))
    ]);
  }

  /* ------------------------------------------------------------------ boot */

  function mount(data) {
    var root = document.getElementById('root');
    ReactDOM.createRoot(root).render(h(App, { data: data }));
  }
  window.__mountCookbook = mount;
})();
