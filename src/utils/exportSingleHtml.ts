import { FOOTER_COLUMNS, SafelightPreset } from '../data/footerData';

export interface SingleHtmlExportOptions {
  wordmark: string;
  brandName: string;
  preset: SafelightPreset;
  lineCount: number;
  animated: boolean;
  showBackgroundLines: boolean;
  year?: number;
}

export function escapeHtml(input: string): string {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * Generates a standalone, zero-dependency single HTML file containing the complete
 * Darkroom-inspired footer, live studio clocks, and interactive scanline wordmark.
 */
export function buildSingleHtmlDocument(options: SingleHtmlExportOptions): string {
  const wordmark = (options.wordmark.trim() || 'DARKROOM').toUpperCase();
  const brandName = (options.brandName.trim() || 'DARKROOM.ENGINEERING').toUpperCase();
  const safeWordmark = escapeHtml(wordmark);
  const safeBrand = escapeHtml(brandName);
  const safeWordmarkJs = JSON.stringify(wordmark);
  const year = options.year ?? new Date().getFullYear();
  const { preset, lineCount, animated, showBackgroundLines } = options;

  const columnsMarkup = FOOTER_COLUMNS.map((col) => {
    const linksHtml = col.links
      .map(
        (item) =>
          `<li><a href="${escapeHtml(item.href)}" class="dr-link">${escapeHtml(item.label)}</a></li>`
      )
      .join('\n                ');
    return `
            <div class="dr-col">
              <h2 class="dr-col-head">${escapeHtml(col.heading)}</h2>
              <ul class="dr-col-list">
                ${linksHtml}
              </ul>
            </div>`;
  }).join('');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeBrand} — Footer</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@800;900&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
    <style>
      :root {
        --dr-bg: ${preset.bg};
        --dr-accent: ${preset.accent};
        --dr-accent-muted: ${preset.accentMuted};
        --dr-surface: ${preset.surface};
        --dr-surface-hover: ${preset.surfaceHover};
        --dr-line: ${preset.line};
        --dr-line-strong: ${preset.lineStrong};
        --dr-cta-text: ${preset.ctaText};
      }

      *, *::before, *::after { box-sizing: border-box; }

      html, body {
        margin: 0;
        padding: 0;
        background: var(--dr-bg);
        color: var(--dr-accent);
        font-family: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
        -webkit-font-smoothing: antialiased;
      }

      .dr-footer {
        position: relative;
        min-height: 100vh;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow-x: clip;
        background: var(--dr-bg);
      }

      .dr-top-strip {
        position: relative;
        padding: 12px 16px 16px;
      }

      .dr-top-hairline {
        position: absolute;
        left: 0;
        right: 0;
        top: 26px;
        height: 1px;
        background: var(--dr-line);
        pointer-events: none;
      }

      .dr-top-grid {
        position: relative;
        z-index: 2;
        display: grid;
        grid-template-columns: 1fr;
        gap: 12px;
        align-items: center;
      }

      .dr-top-left {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      .dr-btn-row { display: flex; align-items: center; gap: 8px; }

      .dr-sq-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        background: var(--dr-surface);
        border: 1px solid var(--dr-line);
        cursor: pointer;
        padding: 0;
      }

      .dr-sq-btn:hover { border-color: var(--dr-accent); }

      .dr-sponsor-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
      }

      .dr-sponsor-btn {
        display: inline-block;
        padding: 6px 12px;
        background: var(--dr-surface);
        color: var(--dr-accent);
        text-decoration: none;
        border: 0;
        font-family: inherit;
        font-size: 11px;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        cursor: pointer;
      }

      .dr-sponsor-btn:hover { background: var(--dr-surface-hover); }

      .dr-main {
        position: relative;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .dr-raster {
        position: absolute;
        left: 0;
        right: 0;
        top: 308px;
        bottom: 0;
        pointer-events: none;
        background-image: repeating-linear-gradient(
          to top,
          transparent 0px,
          transparent 6px,
          var(--dr-line) 6px,
          var(--dr-line) 7px,
          transparent 7px,
          transparent 14px
        );
        background-position: left bottom;
      }

      .dr-content-grid {
        position: relative;
        z-index: 2;
        padding: 8px 16px 16px;
        display: grid;
        grid-template-columns: 1fr;
        gap: 32px;
      }

      .dr-cta-wrap {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        gap: 18px;
      }

      .dr-cta {
        width: 174px;
        height: 48px;
        padding: 0 16px;
        background: var(--dr-accent);
        color: var(--dr-cta-text);
        border: 0;
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        font-family: inherit;
        font-size: 12px;
        font-weight: 500;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        text-decoration: none;
        cursor: pointer;
      }

      .dr-cta:hover { opacity: 0.9; }

      .dr-clocks {
        padding-top: 2px;
        font-size: 11px;
        line-height: 1.35;
        letter-spacing: 0.05em;
        font-variant-numeric: tabular-nums;
        text-transform: uppercase;
      }

      .dr-clock-code { display: inline-block; width: 30px; }

      .dr-nav-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 24px 16px;
      }

      .dr-col-head {
        margin: 0 0 10px;
        font-size: 10px;
        font-weight: 400;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--dr-accent-muted);
      }

      .dr-col-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .dr-link {
        color: var(--dr-accent);
        text-decoration: none;
        font-size: 12px;
        line-height: 1.45;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .dr-link:hover { text-decoration: underline; text-underline-offset: 4px; }

      .dr-bottom-zone {
        position: relative;
        z-index: 2;
        margin-top: auto;
        display: flex;
        flex-direction: column;
      }

      .dr-canvas-wrap {
        position: relative;
        width: 100%;
        height: ${lineCount * 14}px;
        max-height: 260px;
        overflow: hidden;
      }

      #dr-scanline-canvas {
        display: block;
        width: 100%;
        height: 100%;
        cursor: crosshair;
      }

      .dr-legal {
        height: 42px;
        padding: 0 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        font-size: 11px;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }

      @media (min-width: 640px) {
        .dr-nav-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        .dr-canvas-wrap { max-height: 340px; }
      }

      @media (min-width: 1024px) {
        .dr-top-grid, .dr-content-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0;
        }
        .dr-raster { top: 140px; }
        .dr-canvas-wrap { max-height: none; }
      }
    </style>
  </head>
  <body>
    <footer class="dr-footer">
      <div class="dr-top-strip">
        <div class="dr-top-hairline" aria-hidden="true"></div>
        <div class="dr-top-grid">
          <div class="dr-top-left">
            <div class="dr-btn-row">
              <button type="button" class="dr-sq-btn" id="dr-toggle-wave" aria-label="Toggle scanline animation">
                <span style="width:8px;height:8px;background:#fff;display:block;"></span>
              </button>
              <button type="button" class="dr-sq-btn" id="dr-toggle-raster" aria-label="Toggle background raster">
                <span style="width:8px;height:1.5px;background:var(--dr-accent);display:block;"></span>
              </button>
            </div>
          </div>
          <div class="dr-sponsor-row">
            <a href="#sponsor" class="dr-sponsor-btn">BECOME AN OPEN SOURCE SPONSOR</a>
          </div>
        </div>
      </div>

      <div class="dr-main">
        ${showBackgroundLines ? '<div class="dr-raster" id="dr-raster-layer" aria-hidden="true"></div>' : ''}

        <div class="dr-content-grid">
          <div class="dr-cta-wrap">
            <a href="mailto:hello@darkroom.engineering" class="dr-cta">
              <span>LET'S TALK</span>
              <span aria-hidden="true">→</span>
            </a>
            <div class="dr-clocks" id="dr-clocks" aria-label="Studio local times"></div>
          </div>

          <nav class="dr-nav-grid" aria-label="Footer navigation">
            ${columnsMarkup}
          </nav>
        </div>

        <div class="dr-bottom-zone">
          <div class="dr-canvas-wrap" id="dr-canvas-wrap">
            <canvas id="dr-scanline-canvas" aria-label="${safeWordmark} scanline halftone wordmark"></canvas>
          </div>
          <div class="dr-legal">
            <span>&copy;${year} ${safeBrand}</span>
            <span>ALL RIGHTS RESERVED</span>
          </div>
        </div>
      </div>
    </footer>

    <script>
      (function () {
        var WORDMARK = ${safeWordmarkJs};
        var TOTAL_LINES = ${lineCount};
        var ANIMATED = ${animated ? 'true' : 'false'};
        var SHOW_LINES = ${showBackgroundLines ? 'true' : 'false'};
        var ACCENT = ${JSON.stringify(preset.accent)};

        var zones = [
          { code: 'ARG', tz: 'America/Argentina/Buenos_Aires' },
          { code: 'CET', tz: 'Europe/Madrid' },
          { code: 'WET', tz: 'Europe/Lisbon' }
        ];

        function formatZone(date, tz) {
          var parts = new Intl.DateTimeFormat('en-US', {
            timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: true
          }).formatToParts(date);
          var h = (parts.find(function (p) { return p.type === 'hour'; }) || {}).value || '12';
          var m = (parts.find(function (p) { return p.type === 'minute'; }) || {}).value || '00';
          var ap = ((parts.find(function (p) { return p.type === 'dayPeriod'; }) || {}).value || 'AM').toUpperCase();
          return h.padStart(2, '0') + ':' + m.padStart(2, '0') + ' ' + ap;
        }

        function updateClocks() {
          var el = document.getElementById('dr-clocks');
          if (!el) return;
          var now = new Date();
          el.innerHTML = zones.map(function (z) {
            return '<div><span class="dr-clock-code">' + z.code + '</span><span>' + formatZone(now, z.tz) + '</span></div>';
          }).join('');
        }
        updateClocks();
        setInterval(updateClocks, 1000);

        var wrap = document.getElementById('dr-canvas-wrap');
        var canvas = document.getElementById('dr-scanline-canvas');
        var ctx = canvas.getContext('2d');
        var pointer = { x: 0, y: 0, active: false };
        var mask = null;
        var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        function buildMask(w, h) {
          var mw = 840;
          var mh = Math.max(160, Math.round((h / Math.max(1, w)) * mw));
          var off = document.createElement('canvas');
          off.width = mw;
          off.height = mh;
          var octx = off.getContext('2d');
          var fontFamily = '"Barlow Condensed", "Arial Narrow", Impact, sans-serif';
          var fontSize = mh * 0.78;
          var chars = Array.from(WORDMARK);
          var tracking = 0.055;
          function measure(fs) {
            octx.font = '800 ' + fs + 'px ' + fontFamily;
            var widths = chars.map(function (c) { return octx.measureText(c).width; });
            var sum = widths.reduce(function (a, b) { return a + b; }, 0);
            return { widths: widths, total: sum + Math.max(0, chars.length - 1) * (fs * tracking) };
          }
          var layout = measure(fontSize);
          var rawRatio = (mw * 0.94) / Math.max(1, layout.total);
          var scaleX = Math.min(1.55, Math.max(0.55, rawRatio));
          if (rawRatio < 0.55) {
            fontSize = fontSize * (rawRatio / 0.55);
            layout = measure(fontSize);
          }
          var cx = (mw - layout.total * scaleX) / 2;
          var cy = mh / 2 + fontSize * 0.04;
          octx.font = '800 ' + fontSize + 'px ' + fontFamily;
          octx.textAlign = 'left';
          octx.textBaseline = 'middle';
          octx.fillStyle = '#fff';
          chars.forEach(function (ch, idx) {
            octx.save();
            octx.translate(cx, cy);
            octx.scale(scaleX, 1);
            octx.fillText(ch, 0, 0);
            octx.restore();
            cx += (layout.widths[idx] + fontSize * tracking) * scaleX;
          });
          var img = octx.getImageData(0, 0, mw, mh).data;
          var alpha = new Uint8ClampedArray(mw * mh);
          for (var i = 0; i < alpha.length; i++) alpha[i] = img[i * 4 + 3];
          mask = { data: alpha, width: mw, height: mh };
        }

        function render(now) {
          var rect = wrap.getBoundingClientRect();
          var w = Math.max(1, Math.round(rect.width));
          var h = Math.max(1, Math.round(rect.height));
          var dpr = Math.min(window.devicePixelRatio || 1, 2);
          if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            buildMask(w, h);
          }
          if (!mask) buildMask(w, h);

          var t = now * 0.001;
          var cols = w < 640 ? 84 : 144;
          var spacing = h / TOTAL_LINES;
          var maxHalf = Math.max(1, spacing * 0.44);
          var baseHalf = SHOW_LINES ? 0.52 : 0;

          ctx.save();
          ctx.scale(dpr, dpr);
          ctx.clearRect(0, 0, w, h);

          for (var row = 0; row < TOTAL_LINES; row++) {
            var yc = (row + 0.5) * spacing;
            var my0 = Math.max(0, Math.floor((yc / h) * mask.height - (mask.height / TOTAL_LINES) * 0.28));
            var my1 = Math.min(mask.height - 1, Math.ceil((yc / h) * mask.height + (mask.height / TOTAL_LINES) * 0.28));
            var vals = new Array(cols + 1);
            for (var c = 0; c <= cols; c++) {
              var xn = c / cols;
              var mx0 = Math.max(0, Math.floor(xn * mask.width - (mask.width / cols) * 0.35));
              var mx1 = Math.min(mask.width - 1, Math.ceil(xn * mask.width + (mask.width / cols) * 0.35));
              var sum = 0, cnt = 0;
              for (var my = my0; my <= my1; my++) {
                var off = my * mask.width;
                for (var mx = mx0; mx <= mx1; mx++) { sum += mask.data[off + mx]; cnt++; }
              }
              var base = cnt ? sum / (cnt * 255) : 0;
              var wave = Math.sin(xn * 11.5 + row * 0.45 + (ANIMATED && !reducedMotion ? t * 1.45 : 0.65)) * 0.5;
              var val = base > 0.14 ? Math.min(1, Math.max(0.18, base + wave * 0.1)) : 0;
              if (pointer.active) {
                var dist = Math.hypot(xn * w - pointer.x, yc - pointer.y);
                var rad = w < 640 ? 110 : 185;
                if (dist < rad) {
                  var rip = 0.5 * (1 - Math.cos(Math.PI * (1 - dist / rad)));
                  val = Math.min(1, val + rip * 0.45 * (base > 0.15 ? 0.35 : 0.78));
                }
              }
              vals[c] = val;
            }
            var maxI = 0;
            var halfs = vals.map(function (v, idx) {
              var p = idx > 0 ? vals[idx - 1] : 0;
              var n = idx < vals.length - 1 ? vals[idx + 1] : 0;
              var sm = Math.max(0, Math.min(1, p * 0.15 + v * 0.7 + n * 0.15));
              if (sm > maxI) maxI = sm;
              var sh = sm > 0.08 ? Math.min(1, Math.pow(sm, 0.58)) : 0;
              return baseHalf + sh * (maxHalf - baseHalf);
            });
            if (maxI <= 0.08) continue;
            ctx.beginPath();
            ctx.moveTo(0, yc - halfs[0]);
            for (var i = 1; i <= cols; i++) ctx.lineTo((i / cols) * w, yc - halfs[i]);
            for (var j = cols; j >= 0; j--) ctx.lineTo((j / cols) * w, yc + halfs[j]);
            ctx.closePath();
            ctx.fillStyle = ACCENT;
            ctx.fill();
          }
          ctx.restore();

          if (ANIMATED && !reducedMotion) requestAnimationFrame(render);
        }

        canvas.addEventListener('pointermove', function (e) {
          var r = canvas.getBoundingClientRect();
          pointer = { x: e.clientX - r.left, y: e.clientY - r.top, active: true };
          if (!ANIMATED || reducedMotion) render(performance.now());
        });
        canvas.addEventListener('pointerleave', function () { pointer.active = false; });

        var waveBtn = document.getElementById('dr-toggle-wave');
        if (waveBtn) waveBtn.addEventListener('click', function () {
          ANIMATED = !ANIMATED;
          if (ANIMATED && !reducedMotion) requestAnimationFrame(render);
        });

        var rasterBtn = document.getElementById('dr-toggle-raster');
        if (rasterBtn) rasterBtn.addEventListener('click', function () {
          var layer = document.getElementById('dr-raster-layer');
          SHOW_LINES = !SHOW_LINES;
          if (layer) layer.style.display = SHOW_LINES ? 'block' : 'none';
          if (!ANIMATED || reducedMotion) render(performance.now());
        });

        (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () {
          var r = wrap.getBoundingClientRect();
          buildMask(r.width, r.height);
          requestAnimationFrame(render);
        });
      })();
    </script>
  </body>
</html>
`;
}
