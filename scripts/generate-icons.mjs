import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const sizes = [16, 32, 48, 128];
const ink = [22, 21, 19, 255];
const paper = [255, 255, 255, 255];
const accent = [33, 88, 82, 255];

function crc32(buffer) {
  let crc = ~0;
  for (const byte of buffer) {
    crc ^= byte;
    for (let i = 0; i < 8; i += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return ~crc >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const typeBuffer = Buffer.from(type);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])));
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function roundedRectSdf(x, y, size, radius) {
  const half = size / 2;
  const qx = Math.abs(x + 0.5 - half) - (half - radius);
  const qy = Math.abs(y + 0.5 - half) - (half - radius);
  return (
    Math.min(Math.max(qx, qy), 0) +
    Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) -
    radius
  );
}

function mix(a, b, t) {
  const k = Math.min(1, Math.max(0, t));
  return [
    Math.round(a[0] + (b[0] - a[0]) * k),
    Math.round(a[1] + (b[1] - a[1]) * k),
    Math.round(a[2] + (b[2] - a[2]) * k),
    Math.round(a[3] + (b[3] - a[3]) * k),
  ];
}

function paint(x, y, size) {
  const radius = size * 0.22;
  const sdf = roundedRectSdf(x, y, size, radius);
  const alpha = Math.min(1, Math.max(0, 0.5 - sdf));
  const nx = (x + 0.5) / size;
  const ny = (y + 0.5) / size;

  let color = ink;
  const inDoc = nx > 0.3 && nx < 0.7 && ny > 0.24 && ny < 0.78;

  if (inDoc) {
    color = paper;
    const line = (from, to) => ny > from && ny < to && nx > 0.38 && nx < 0.62;
    if (line(0.4, 0.45) || line(0.5, 0.55) || line(0.6, 0.65)) {
      color = ink;
    }
  }

  if (nx > 0.3 && nx < 0.36 && ny > 0.24 && ny < 0.78) {
    color = accent;
  }

  return mix([0, 0, 0, 0], color, alpha);
}

function createPng(size) {
  const stride = size * 4 + 1;
  const raw = Buffer.alloc(stride * size);

  for (let y = 0; y < size; y += 1) {
    raw[y * stride] = 0;
    for (let x = 0; x < size; x += 1) {
      const [r, g, b, a] = paint(x, y, size);
      const index = y * stride + 1 + x * 4;
      raw[index] = r;
      raw[index + 1] = g;
      raw[index + 2] = b;
      raw[index + 3] = a;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const publicDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
mkdirSync(publicDir, { recursive: true });

for (const size of sizes) {
  writeFileSync(join(publicDir, `icon-${size}.png`), createPng(size));
}
