/**
 * Minimal dependency-free raster canvas + PNG encoder.
 * Used at build time to generate original thumbnails, OG images and favicons.
 * Rendered at 2x then box-downsampled for clean anti-aliased edges.
 */
import { deflateSync } from 'node:zlib';

/* ------------------------------------------------------------------ */
/* CRC + PNG encoding                                                  */
/* ------------------------------------------------------------------ */

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

export function encodePNG(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    rgba.copy
      ? rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride)
      : Buffer.from(rgba.buffer, y * stride, stride).copy(raw, y * (stride + 1) + 1);
  }
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/* ------------------------------------------------------------------ */
/* Colour parsing                                                      */
/* ------------------------------------------------------------------ */

function parseColor(input) {
  if (Array.isArray(input)) return input;
  const s = String(input).trim();
  if (s[0] === '#') {
    let hex = s.slice(1);
    if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
      hex.length === 8 ? parseInt(hex.slice(6, 8), 16) : 255,
    ];
  }
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const p = m[1].split(',').map((v) => parseFloat(v));
    return [p[0] | 0, p[1] | 0, p[2] | 0, p[3] === undefined ? 255 : Math.round(p[3] * 255)];
  }
  throw new Error('Unsupported colour: ' + s);
}

/* ------------------------------------------------------------------ */
/* Canvas                                                              */
/* ------------------------------------------------------------------ */

export class Canvas {
  constructor(width, height, fill = '#000000') {
    this.width = width;
    this.height = height;
    this.data = Buffer.alloc(width * height * 4);
    if (fill) this.fill(fill);
  }

  clone() {
    const c = new Canvas(this.width, this.height, null);
    this.data.copy(c.data);
    return c;
  }

  blendPixel(x, y, color) {
    x |= 0;
    y |= 0;
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;
    const [r, g, b, a] = color;
    if (a <= 0) return;
    const i = (y * this.width + x) * 4;
    const d = this.data;
    if (a >= 255) {
      d[i] = r;
      d[i + 1] = g;
      d[i + 2] = b;
      d[i + 3] = 255;
      return;
    }
    const sa = a / 255;
    const da = d[i + 3] / 255;
    const outA = sa + da * (1 - sa);
    if (outA === 0) return;
    d[i] = Math.round((r * sa + d[i] * da * (1 - sa)) / outA);
    d[i + 1] = Math.round((g * sa + d[i + 1] * da * (1 - sa)) / outA);
    d[i + 2] = Math.round((b * sa + d[i + 2] * da * (1 - sa)) / outA);
    d[i + 3] = Math.round(outA * 255);
  }

  fill(color) {
    const c = parseColor(color);
    for (let i = 0; i < this.data.length; i += 4) {
      this.data[i] = c[0];
      this.data[i + 1] = c[1];
      this.data[i + 2] = c[2];
      this.data[i + 3] = c[3];
    }
    return this;
  }

  rect(x, y, w, h, color) {
    const c = parseColor(color);
    const x0 = Math.max(0, Math.round(x));
    const y0 = Math.max(0, Math.round(y));
    const x1 = Math.min(this.width, Math.round(x + w));
    const y1 = Math.min(this.height, Math.round(y + h));
    for (let py = y0; py < y1; py++) {
      for (let px = x0; px < x1; px++) this.blendPixel(px, py, c);
    }
    return this;
  }

  vgrad(x, y, w, h, stops) {
    const x0 = Math.max(0, Math.round(x));
    const y0 = Math.max(0, Math.round(y));
    const x1 = Math.min(this.width, Math.round(x + w));
    const y1 = Math.min(this.height, Math.round(y + h));
    const cols = stops.map((s) => [s[0], parseColor(s[1])]);
    for (let py = y0; py < y1; py++) {
      const t = h <= 1 ? 0 : (py - y) / (h - 1);
      let a = cols[0];
      let b = cols[cols.length - 1];
      for (let i = 0; i < cols.length - 1; i++) {
        if (t >= cols[i][0] && t <= cols[i + 1][0]) {
          a = cols[i];
          b = cols[i + 1];
          break;
        }
      }
      const span = b[0] - a[0] || 1;
      const lt = Math.min(1, Math.max(0, (t - a[0]) / span));
      const col = [
        a[1][0] + (b[1][0] - a[1][0]) * lt,
        a[1][1] + (b[1][1] - a[1][1]) * lt,
        a[1][2] + (b[1][2] - a[1][2]) * lt,
        a[1][3] + (b[1][3] - a[1][3]) * lt,
      ];
      for (let px = x0; px < x1; px++) this.blendPixel(px, py, col);
    }
    return this;
  }

  glow(cx, cy, radius, color, strength = 1) {
    const [r, g, b] = parseColor(color);
    const r0 = Math.max(0, Math.floor(cx - radius));
    const r1 = Math.min(this.width, Math.ceil(cx + radius));
    const c0 = Math.max(0, Math.floor(cy - radius));
    const c1 = Math.min(this.height, Math.ceil(cy + radius));
    for (let y = c0; y < c1; y++) {
      for (let x = r0; x < r1; x++) {
        const d = Math.hypot(x - cx, y - cy) / radius;
        if (d >= 1) continue;
        const a = Math.pow(1 - d, 2.2) * 255 * strength;
        this.blendPixel(x, y, [r, g, b, a]);
      }
    }
    return this;
  }

  roundRect(x, y, w, h, r, color) {
    const c = parseColor(color);
    const rad = Math.min(r, w / 2, h / 2);
    const x0 = Math.round(x);
    const y0 = Math.round(y);
    const x1 = Math.round(x + w);
    const y1 = Math.round(y + h);
    for (let py = Math.max(0, y0); py < Math.min(this.height, y1); py++) {
      for (let px = Math.max(0, x0); px < Math.min(this.width, x1); px++) {
        const dx = Math.max(x0 + rad - px, 0, px - (x1 - rad));
        const dy = Math.max(y0 + rad - py, 0, py - (y1 - rad));
        if (dx * dx + dy * dy <= rad * rad) this.blendPixel(px, py, c);
      }
    }
    return this;
  }

  strokeRoundRect(x, y, w, h, r, thickness, color) {
    const c = parseColor(color);
    const rad = Math.min(r, w / 2, h / 2);
    const x0 = Math.round(x);
    const y0 = Math.round(y);
    const x1 = Math.round(x + w);
    const y1 = Math.round(y + h);
    const t = thickness;
    for (let py = Math.max(0, y0); py < Math.min(this.height, y1); py++) {
      for (let px = Math.max(0, x0); px < Math.min(this.width, x1); px++) {
        const outerDx = Math.max(x0 + rad - px, 0, px - (x1 - rad));
        const outerDy = Math.max(y0 + rad - py, 0, py - (y1 - rad));
        const outer = outerDx * outerDx + outerDy * outerDy <= rad * rad;
        const inx0 = x0 + t;
        const iny0 = y0 + t;
        const inx1 = x1 - t;
        const iny1 = y1 - t;
        const irad = Math.max(0, rad - t);
        const innerDx = Math.max(inx0 + irad - px, 0, px - (inx1 - irad));
        const innerDy = Math.max(iny0 + irad - py, 0, py - (iny1 - irad));
        const inner =
          px >= inx0 && px < inx1 && py >= iny0 && py < iny1
            ? innerDx * innerDx + innerDy * innerDy <= irad * irad
            : false;
        if (outer && !inner) this.blendPixel(px, py, c);
      }
    }
    return this;
  }

  circle(cx, cy, radius, color) {
    const c = parseColor(color);
    const r2 = radius * radius;
    for (let y = Math.max(0, Math.floor(cy - radius)); y < Math.min(this.height, Math.ceil(cy + radius)); y++) {
      for (let x = Math.max(0, Math.floor(cx - radius)); x < Math.min(this.width, Math.ceil(cx + radius)); x++) {
        const dx = x - cx;
        const dy = y - cy;
        if (dx * dx + dy * dy <= r2) this.blendPixel(x, y, c);
      }
    }
    return this;
  }

  ring(cx, cy, radius, thickness, color) {
    const c = parseColor(color);
    const inner = radius - thickness;
    for (let y = Math.max(0, Math.floor(cy - radius)); y < Math.min(this.height, Math.ceil(cy + radius)); y++) {
      for (let x = Math.max(0, Math.floor(cx - radius)); x < Math.min(this.width, Math.ceil(cx + radius)); x++) {
        const d = Math.hypot(x - cx, y - cy);
        if (d <= radius && d >= inner) this.blendPixel(x, y, c);
      }
    }
    return this;
  }

  line(x1, y1, x2, y2, thickness, color) {
    const c = parseColor(color);
    const steps = Math.ceil(Math.hypot(x2 - x1, y2 - y1));
    const half = thickness / 2;
    for (let i = 0; i <= steps; i++) {
      const t = steps === 0 ? 0 : i / steps;
      const x = x1 + (x2 - x1) * t;
      const y = y1 + (y2 - y1) * t;
      for (let oy = -half; oy <= half; oy += 1) {
        for (let ox = -half; ox <= half; ox += 1) this.blendPixel(x + ox, y + oy, c);
      }
    }
    return this;
  }

  /** Draw a filled convex polygon (scanline). */
  poly(points, color) {
    const c = parseColor(color);
    const ys = points.map((p) => p[1]);
    const y0 = Math.max(0, Math.floor(Math.min(...ys)));
    const y1 = Math.min(this.height, Math.ceil(Math.max(...ys)));
    for (let y = y0; y < y1; y++) {
      const xs = [];
      for (let i = 0; i < points.length; i++) {
        const a = points[i];
        const b = points[(i + 1) % points.length];
        if ((a[1] <= y && b[1] > y) || (b[1] <= y && a[1] > y)) {
          xs.push(a[0] + ((y - a[1]) / (b[1] - a[1])) * (b[0] - a[0]));
        }
      }
      xs.sort((m, n) => m - n);
      for (let i = 0; i < xs.length; i += 2) {
        const sx = Math.max(0, Math.round(xs[i]));
        const ex = Math.min(this.width, Math.round(xs[i + 1]));
        for (let x = sx; x < ex; x++) this.blendPixel(x, y, c);
      }
    }
    return this;
  }

  downsample(factor = 2) {
    const w = Math.round(this.width / factor);
    const h = Math.round(this.height / factor);
    const out = new Canvas(w, h, null);
    const src = this.data;
    const dst = out.data;
    const area = factor * factor;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let r = 0;
        let g = 0;
        let b = 0;
        let a = 0;
        for (let sy = 0; sy < factor; sy++) {
          for (let sx = 0; sx < factor; sx++) {
            const i = ((y * factor + sy) * this.width + (x * factor + sx)) * 4;
            r += src[i];
            g += src[i + 1];
            b += src[i + 2];
            a += src[i + 3];
          }
        }
        const o = (y * w + x) * 4;
        dst[o] = Math.round(r / area);
        dst[o + 1] = Math.round(g / area);
        dst[o + 2] = Math.round(b / area);
        dst[o + 3] = Math.round(a / area);
      }
    }
    return out;
  }

  toPNG() {
    return encodePNG(this.width, this.height, this.data);
  }
}
