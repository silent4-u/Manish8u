// The ground floor from the drawing, in three.js. Units are feet.
// Plan coordinates: x from the left outside face to the right (0..25),
// z from the front (verandah edge, 0) to the rear (35.25); y up.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const W = 1920, H = 1080;
const FL = 1.5;                 // plinth: floor 1'-6" above the ground
const TOP = FL + 9.5;           // ceiling 9'-6"
const DOOR = 6.75, WIN_SILL = 3, WIN_HEAD = 7, VENT_SILL = 5.5;

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W, H);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.autoUpdate = false;     // the scene is still: shadows are drawn once per shot
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

// three.js looks down -z with +x to the right, so seen from the front (plan z < 0)
// the plan would come out mirrored. Everything is built in plan coordinates inside
// a group mirrored in z; cameras go through place(), which does the same.
const world = new THREE.Scene();
world.background = new THREE.Color(0xcfe2f0);
world.fog = new THREE.Fog(0xcfe2f0, 160, 360);
const pmrem = new THREE.PMREMGenerator(renderer);
world.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
const scene = new THREE.Group(); scene.scale.z = -1; world.add(scene);

// ---- textures, drawn on canvases ---------------------------------------------
function canvasTex(size, draw, repX = 1, repY = 1) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  draw(c.getContext('2d'), size);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repX, repY);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}
function rng(seed) { let s = seed; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }

function tiles(base, grout, n, vary, seed) {
  return (g, s) => {
    const r = rng(seed); const step = s / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const v = (r() - 0.5) * vary;
      g.fillStyle = shade(base, v);
      g.fillRect(i * step, j * step, step, step);
      for (let k = 0; k < 6; k++) {                      // soft marble veins
        g.strokeStyle = `rgba(150,140,130,${0.05 + r() * 0.06})`;
        g.lineWidth = 1 + r() * 2;
        g.beginPath();
        const x = i * step + r() * step, y = j * step + r() * step;
        g.moveTo(x, y); g.quadraticCurveTo(x + r() * step * 0.6, y + r() * step * 0.3, x + r() * step * 0.8, y + r() * step * 0.8);
        g.stroke();
      }
    }
    g.strokeStyle = grout; g.lineWidth = Math.max(2, s / 256);
    for (let i = 0; i <= n; i++) { g.beginPath(); g.moveTo(i * step, 0); g.lineTo(i * step, s); g.stroke(); g.beginPath(); g.moveTo(0, i * step); g.lineTo(s, i * step); g.stroke(); }
  };
}
function planks(seed) {
  return (g, s) => {
    const r = rng(seed); const rows = 8; const h = s / rows;
    for (let j = 0; j < rows; j++) {
      let x = -r() * s * 0.5;
      while (x < s) {
        const w = s * (0.35 + r() * 0.4);
        const base = [176 + r() * 30, 124 + r() * 24, 80 + r() * 18];
        g.fillStyle = `rgb(${base[0] | 0},${base[1] | 0},${base[2] | 0})`;
        g.fillRect(x, j * h, w, h);
        for (let k = 0; k < 14; k++) {
          g.strokeStyle = `rgba(90,55,30,${0.06 + r() * 0.08})`; g.lineWidth = 1;
          const yy = j * h + r() * h;
          g.beginPath(); g.moveTo(x, yy); g.bezierCurveTo(x + w * 0.3, yy + (r() - 0.5) * 6, x + w * 0.7, yy + (r() - 0.5) * 6, x + w, yy); g.stroke();
        }
        g.strokeStyle = 'rgba(60,35,20,0.55)'; g.lineWidth = 2;
        g.strokeRect(x, j * h, w, h);
        x += w;
      }
    }
  };
}
function noiseTex(base, vary, seed, dots = 9000) {
  return (g, s) => {
    g.fillStyle = base; g.fillRect(0, 0, s, s);
    const r = rng(seed);
    for (let i = 0; i < dots; i++) {
      g.fillStyle = shade(base, (r() - 0.5) * vary);
      g.fillRect(r() * s, r() * s, 1 + r() * 3, 1 + r() * 3);
    }
  };
}
function rugTex(g, s) {
  g.fillStyle = '#9c4f3a'; g.fillRect(0, 0, s, s);
  g.strokeStyle = '#e8d6b8'; g.lineWidth = s / 40; g.strokeRect(s * 0.06, s * 0.06, s * 0.88, s * 0.88);
  g.strokeStyle = '#2f4a5c'; g.lineWidth = s / 70; g.strokeRect(s * 0.12, s * 0.12, s * 0.76, s * 0.76);
  g.fillStyle = '#e8d6b8';
  for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) {
    g.save(); g.translate(s * (0.24 + i * 0.13), s * (0.24 + j * 0.13)); g.rotate(Math.PI / 4);
    g.fillRect(-s * 0.025, -s * 0.025, s * 0.05, s * 0.05); g.restore();
  }
}
function shade(hex, v) {
  const c = new THREE.Color(hex); c.offsetHSL(0, 0, v); return '#' + c.getHexString();
}

// ---- materials ----------------------------------------------------------------
const std = (color, rough = 0.85, metal = 0, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...extra });
const M = {
  wall: std(0xf1ece3, 0.92),
  ext: std(0xead9b8, 0.9),
  cap: std(0x4b4a48, 0.8),
  plinth: std(0x8c7a68, 0.95),
  column: std(0xb48a5e, 0.85),
  ceiling: std(0xfbfaf7, 0.95),
  wood: std(0x7a4a2a, 0.55),
  woodLight: std(0xc59a6a, 0.6),
  frame: std(0x5b3a22, 0.5),
  glass: new THREE.MeshStandardMaterial({ color: 0xbfd8e6, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.28 }),
  steel: std(0xc8cbcf, 0.3, 0.85),
  black: std(0x1c1c1e, 0.4),
  white: std(0xf6f6f4, 0.35),
  sheet: std(0xf0ebe0, 0.95),
  pillow: std(0xfbf8f2, 0.95),
  blanket1: std(0x5d7fa6, 0.95),
  blanket2: std(0xc0705f, 0.95),
  sofa: std(0x8a8279, 0.95),
  cushion: std(0xc9a86a, 0.95),
  granite: std(0x2c2b2b, 0.3, 0.1),
  cabinet: std(0xe8e2d6, 0.6),
  cabinetAccent: std(0x4f7a74, 0.6),
  curtain1: std(0xd9c7a3, 0.95, 0, { side: THREE.DoubleSide }),
  curtain2: std(0xb9cfc4, 0.95, 0, { side: THREE.DoubleSide }),
  lamp: new THREE.MeshStandardMaterial({ color: 0xfff1d6, emissive: 0xffd9a0, emissiveIntensity: 0.9, roughness: 0.8 }),
  screen: new THREE.MeshStandardMaterial({ color: 0x10161c, emissive: 0x1d2a38, emissiveIntensity: 0.5, roughness: 0.2 }),
  leaf: std(0x4f7d3a, 0.9),
  leaf2: std(0x6b9a48, 0.9),
  pot: std(0xa0522d, 0.8),
  railing: std(0xd5d8dc, 0.25, 0.9),
  mirror: std(0xdfe6ea, 0.05, 1.0),
  gate: std(0x2e3b44, 0.5, 0.6),
};
M.tile = std(0xffffff, 0.35, 0, { map: canvasTex(1024, tiles('#e6e1d8', '#bdb5a8', 4, 0.03, 7)) });
M.wood_floor = std(0xffffff, 0.55, 0, { map: canvasTex(1024, planks(11)) });
M.wood_floor2 = std(0xffffff, 0.55, 0, { map: canvasTex(1024, planks(23)) });
M.stone = std(0xffffff, 0.8, 0, { map: canvasTex(512, tiles('#b5ada0', '#8d857a', 4, 0.05, 3)) });
M.bathTile = std(0xffffff, 0.3, 0, { map: canvasTex(512, tiles('#d7e4e6', '#a9b9bc', 6, 0.02, 5)) });
M.bathWall = std(0xffffff, 0.3, 0, { map: canvasTex(512, tiles('#e9f0f1', '#c6d2d4', 6, 0.015, 9)) });
M.backsplash = std(0xffffff, 0.3, 0, { map: canvasTex(512, tiles('#f2efe8', '#cfc8bb', 8, 0.02, 13)) });
M.grass = std(0xffffff, 0.95, 0, { map: canvasTex(512, noiseTex('#6f9a4c', 0.12, 17, 30000), 10, 10) });
M.paver = std(0xffffff, 0.9, 0, { map: canvasTex(512, tiles('#bdb6aa', '#948d82', 4, 0.06, 19)) });
M.rug = std(0xffffff, 0.95, 0, { map: canvasTex(512, rugTex) });
M.wallCompound = std(0xddd0b8, 0.9);

const walls = new THREE.Group(); scene.add(walls);          // full-height walls
const cutWalls = new THREE.Group(); scene.add(cutWalls);    // walls cut at 4 ft, for the plan view
const ceiling = new THREE.Group(); scene.add(ceiling);
const labels = new THREE.Group(); scene.add(labels);
const fans = [];

function addTo(group, mesh, cast = true, recv = true) { mesh.castShadow = cast; mesh.receiveShadow = recv; group.add(mesh); return mesh; }
function bx(x0, x1, y0, y1, z0, z1, mat, group = scene, cast = true) {
  const g = new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0);
  const m = new THREE.Mesh(g, mat);
  m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
  return addTo(group, m, cast);
}
function rb(x0, x1, y0, y1, z0, z1, mat, r = 0.12, group = scene) {
  const w = x1 - x0, h = y1 - y0, d = z1 - z0;
  const g = new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2.05, h / 2.05, d / 2.05));
  const m = new THREE.Mesh(g, mat);
  m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
  return addTo(group, m);
}
function cyl(x, y0, y1, z, r, mat, seg = 24, group = scene, rTop = r) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rTop, r, y1 - y0, seg), mat);
  m.position.set(x, (y0 + y1) / 2, z);
  return addTo(group, m);
}

// ---- walls with openings --------------------------------------------------------
// A wall is an axis-aligned slab x0..x1 by z0..z1; openings run along its long side.
function wall(x0, x1, z0, z1, ops, mat, group, top) {
  const alongX = (x1 - x0) >= (z1 - z0);
  const s0 = alongX ? x0 : z0, s1 = alongX ? x1 : z1;
  const mats = [mat, mat, M.cap, mat, mat, mat];
  const seg = (a, b, ya, yb) => {
    yb = Math.min(yb, top);
    if (b - a < 1e-3 || yb - ya < 1e-3) return;
    const geo = alongX ? [a, b, ya, yb, z0, z1] : [x0, x1, ya, yb, a, b];
    const m = bx(...geo, mats, group);
    return m;
  };
  let cur = s0;
  for (const o of [...ops].sort((p, q) => p.a - q.a)) {
    seg(cur, o.a, FL, top);
    if (o.sill > 0) seg(o.a, o.b, FL, FL + o.sill);
    seg(o.a, o.b, FL + o.head, top);
    cur = o.b;
  }
  seg(cur, s1, FL, top);
}
const win = (a, b) => ({ a, b, sill: WIN_SILL, head: WIN_HEAD, kind: 'win' });
const vent = (a, b) => ({ a, b, sill: VENT_SILL, head: WIN_HEAD, kind: 'vent' });
const dor = (a, b) => ({ a, b, sill: 0, head: DOOR, kind: 'door' });

// [x0, x1, z0, z1, openings, interior material, exterior skin side]
const WALLS = [
  // left outer wall (bedrooms), windows W5
  [0, 0.75, 7.5, 35.25, [win(12.5, 17.5), win(26.5, 31.5)], 'x-'],
  // rear outer wall: W5 (bedroom 2), back door D.3 and W5 (kitchen)
  [0, 25, 34.5, 35.25, [win(4, 9), dor(13.75, 16.75), win(18, 22.5)], 'z+'],
  // right outer wall: ventilators V.2
  [24.25, 25, 0, 35.25, [vent(11.5, 13.5), vent(19.75, 21.25), vent(27, 29)], 'x+'],
  // stair front wall, V.3
  [13, 24.25, 0, 0.75, [vent(17.5, 19.5)], 'z-'],
  // verandah / stair to rooms: W5 (bedroom 1), main door M.D, W4
  [0, 24.25, 7.5, 8.25, [win(4, 9), dor(13.5, 16.25), win(17.5, 21)], 'z-left'],
  // middle partition, bedroom doors D.3
  [13, 13.375, 8.25, 34.5, [dor(8.75, 11.75), dor(23.75, 26.75)], null],
  // between the bedrooms
  [0.75, 13, 22.58, 23.33, [], null],
  // toilet walls, door D.2
  [16.875, 24.25, 18.25, 18.625, [], null],
  [16.875, 24.25, 22.625, 23.0, [], null],
  [16.875, 17.25, 18.625, 22.625, [dor(19.0, 21.5)], null],
];

function buildWalls(group, top) {
  for (const [x0, x1, z0, z1, ops, skin] of WALLS) {
    if (!skin) { wall(x0, x1, z0, z1, ops, M.wall, group, top); continue; }
    const t = 0.15;  // exterior paint layer
    if (skin === 'x-') { wall(x0, x0 + t, z0, z1, ops, M.ext, group, top); wall(x0 + t, x1, z0, z1, ops, M.wall, group, top); }
    if (skin === 'x+') { wall(x1 - t, x1, z0, z1, ops, M.ext, group, top); wall(x0, x1 - t, z0, z1, ops, M.wall, group, top); }
    if (skin === 'z+') { wall(x0, x1, z1 - t, z1, ops, M.ext, group, top); wall(x0, x1, z0, z1 - t, ops, M.wall, group, top); }
    if (skin === 'z-') { wall(x0, x1, z0, z0 + t, ops, M.ext, group, top); wall(x0, x1, z0 + t, z1, ops, M.wall, group, top); }
    if (skin === 'z-left') {          // the verandah side is painted outside colour
      const left = ops.filter(o => o.b <= 13.375), right = ops.filter(o => o.a >= 13.375);
      wall(x0, 13.375, z0, z0 + t, left, M.ext, group, top); wall(x0, 13.375, z0 + t, z1, left, M.wall, group, top);
      wall(13.375, x1, z0, z1, right.map(o => o), M.wall, group, top);
    }
  }
  // columns, 12" x 12"
  const cols = [[0, 0], [12.5, 0], [24, 0], [0, 7.25], [12.5, 7.25], [24, 7.25], [0, 22.45], [12.5, 22.45], [24, 22.45], [0, 34.25], [12.5, 34.25], [24, 34.25]];
  for (const [x, z] of cols) {
    const outside = z < 1 || x < 0.1 || x > 23.9 || z > 34;
    bx(x, x + 1, FL, top, z, z + 1, [outside ? M.column : M.wall, outside ? M.column : M.wall, M.cap, M.wall, outside ? M.column : M.wall, outside ? M.column : M.wall], group);
  }
}
buildWalls(walls, TOP);
buildWalls(cutWalls, FL + 4);
// beams over the verandah
bx(0, 13.5, TOP - 1.0, TOP, 0, 1, M.column, walls);
bx(0, 1, TOP - 1.0, TOP, 0, 8.25, M.column, walls);

// window frames and glass, door frames
function openingParts(x0, x1, z0, z1, ops) {
  const alongX = (x1 - x0) >= (z1 - z0);
  for (const o of ops) {
    const y0 = FL + o.sill, y1 = FL + o.head;
    const fw = 0.18;
    const mk = (a, b, ya, yb, t0, t1, mat) => alongX ? bx(a, b, ya, yb, t0, t1, mat, walls) : bx(t0, t1, ya, yb, a, b, mat, walls);
    const tc0 = alongX ? z0 : x0, tc1 = alongX ? z1 : x1, mid = (tc0 + tc1) / 2;
    if (o.kind === 'door') {
      mk(o.a, o.a + fw, FL, y1, tc0, tc1, M.frame); mk(o.b - fw, o.b, FL, y1, tc0, tc1, M.frame); mk(o.a, o.b, y1 - fw, y1, tc0, tc1, M.frame);
      continue;
    }
    mk(o.a, o.a + fw, y0, y1, mid - 0.15, mid + 0.15, M.frame); mk(o.b - fw, o.b, y0, y1, mid - 0.15, mid + 0.15, M.frame);
    mk(o.a, o.b, y0, y0 + fw, mid - 0.15, mid + 0.15, M.frame); mk(o.a, o.b, y1 - fw, y1, mid - 0.15, mid + 0.15, M.frame);
    if (o.kind === 'win') {
      const c = (o.a + o.b) / 2; mk(c - 0.07, c + 0.07, y0, y1, mid - 0.12, mid + 0.12, M.frame);
      mk(o.a, o.b, y0 - 0.12, y0, tc0 - 0.15, tc1 + 0.15, M.granite);     // sill
    } else {
      for (let k = 1; k < 4; k++) mk(o.a, o.b, y0 + k * (y1 - y0) / 4 - 0.04, y0 + k * (y1 - y0) / 4 + 0.04, mid - 0.1, mid + 0.1, M.frame);
    }
    const gl = mk(o.a + fw, o.b - fw, y0 + fw, y1 - fw, mid - 0.02, mid + 0.02, M.glass);
    gl.castShadow = false;
  }
}
for (const [x0, x1, z0, z1, ops] of WALLS) openingParts(x0, x1, z0, z1, ops);

// door leaves, open: hinge (x, z), width, angle of the leaf (radians, 0 = +x)
function leaf(x, z, w, ang, h = DOOR - 0.2, mat = M.wood) {
  const g = new THREE.Group();
  const p = bx(0, w, FL + 0.05, FL + h, -0.08, 0.08, mat, g);
  bx(w - 0.45, w - 0.3, FL + 3.2, FL + 3.45, -0.14, 0.14, M.steel, g);
  for (const [ya, yb] of [[FL + 0.6, FL + 2.8], [FL + 3.6, FL + h - 0.6]]) {
    bx(0.3, w - 0.3, ya, yb, 0.07, 0.1, M.frame, g, false); bx(0.3, w - 0.3, ya, yb, -0.1, -0.07, M.frame, g, false);
  }
  g.position.set(x, 0, z); g.rotation.y = -ang;
  scene.add(g); return g;
}
leaf(16.1, 8.2, 2.6, Math.PI / 2 + 0.15);        // main door, hinged on its right, open into the living room
leaf(13.0, 8.9, 2.85, Math.PI - 0.1);            // bedroom 1, open against its front wall
leaf(13.0, 23.9, 2.85, Math.PI - 0.1);           // bedroom 2
leaf(17.25, 19.15, 2.3, 0.1);                    // toilet door, open into the toilet
leaf(13.9, 34.6, 2.85, 0.0);                     // back door, shut

// ---- plinth, floors, ceiling --------------------------------------------------------
bx(-0.3, 25.3, 0, FL, -0.3, 35.55, M.plinth);
function floor(x0, x1, z0, z1, mat, rep, y = FL + 0.005) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), mat.clone());
  m.material.map = mat.map.clone(); m.material.map.needsUpdate = true;
  m.material.map.repeat.set((x1 - x0) / rep, (z1 - z0) / rep);
  m.rotation.x = -Math.PI / 2; m.position.set((x0 + x1) / 2, y, (z0 + z1) / 2);
  m.receiveShadow = true; scene.add(m); return m;
}
floor(0, 13.0, 0, 7.5, M.stone, 4);
floor(13.0, 24.25, 0.75, 7.5, M.tile, 8);
floor(0.75, 13.0, 8.25, 22.58, M.wood_floor, 8);
floor(0.75, 13.0, 23.33, 34.5, M.wood_floor2, 8);
floor(13.375, 24.25, 8.25, 34.5, M.tile, 8);
floor(17.25, 24.25, 18.625, 22.625, M.bathTile, 4, FL + 0.01);
for (const [x0, x1, z0, z1] of [[0.75, 13, 8.25, 22.58], [0.75, 13, 23.33, 34.5]]) {   // skirting
  bx(x0, x1, FL, FL + 0.3, z0, z0 + 0.03, M.wood); bx(x0, x1, FL, FL + 0.3, z1 - 0.03, z1, M.wood);
}
const ceil = new THREE.Mesh(new THREE.PlaneGeometry(25, 35.25), M.ceiling);
ceil.rotation.x = Math.PI / 2; ceil.position.set(12.5, TOP - 0.01, 17.625); ceil.castShadow = true; ceil.receiveShadow = true;
ceiling.add(ceil);
bx(-0.3, 25.3, TOP, TOP + 0.5, -0.3, 35.55, M.ext, ceiling);    // the slab above, seen from outside

// ---- stair: two flights and a landing, as drawn -----------------------------------------
const RISE = 10 / 18, TREAD = 10 / 12, SX = 13.375;
const stair = new THREE.Group(); scene.add(stair);
for (let k = 1; k <= 8; k++) {                       // first flight, front half, going right
  bx(SX + (k - 1) * TREAD, SX + k * TREAD, FL, FL + k * RISE, 0.75, 4.0, M.tile, stair);
  bx(SX + (k - 1) * TREAD, SX + k * TREAD, FL + k * RISE - 0.03, FL + k * RISE, 0.75, 4.0, M.granite, stair);
}
const LX = SX + 8 * TREAD;
bx(LX, 24.25, FL, FL + 9 * RISE, 0.75, 7.5, M.tile, stair);                 // landing on a solid base
bx(LX, 24.25, FL + 9 * RISE - 0.03, FL + 9 * RISE, 0.75, 7.5, M.granite, stair);
for (let k = 1; k <= 8; k++) {                       // second flight, rear half, going left (raised, open below)
  const top = FL + 9 * RISE + k * RISE;
  bx(LX - k * TREAD, LX - (k - 1) * TREAD, top - RISE - 0.45, top, 4.25, 7.5, M.tile, stair);
  bx(LX - k * TREAD, LX - (k - 1) * TREAD, top - 0.03, top, 4.25, 7.5, M.granite, stair);
}
bx(SX + 0.6, LX, FL, FL + 9 * RISE * 0.9, 4.0, 4.25, M.wall, stair);         // a low spine wall between the flights
// railings
function rail(x0, y0, x1, y1, z) {
  const n = Math.max(2, Math.round(Math.abs(x1 - x0) / 1.25));
  for (let i = 0; i <= n; i++) {
    const x = x0 + (x1 - x0) * i / n, y = y0 + (y1 - y0) * i / n;
    cyl(x, y, y + 3, z, 0.05, M.railing, 10, stair);
  }
  const len = Math.hypot(x1 - x0, y1 - y0);
  const m = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, len, 12), M.railing);
  m.position.set((x0 + x1) / 2, (y0 + y1) / 2 + 3, z);
  m.rotation.z = Math.atan2(y1 - y0, x1 - x0) - Math.PI / 2;
  stair.add(m);
}
rail(SX + 0.4, FL + RISE, LX, FL + 9 * RISE, 4.12);
rail(LX, FL + 9 * RISE, SX + 0.4, FL + 17 * RISE, 4.38);

// ---- verandah and yard -------------------------------------------------------------------
for (const [z0, z1, y1] of [[-3, 0, 0.5], [-2, 0, 1.0], [-1, 0, 1.5]]) bx(4.5, 9.5, 0, y1, z0, z1, M.stone);
function railLine(x0, z0, x1, z1) {
  const n = Math.round(Math.hypot(x1 - x0, z1 - z0) / 0.5);
  for (let i = 0; i <= n; i++) cyl(x0 + (x1 - x0) * i / n, FL, FL + 3, z0 + (z1 - z0) * i / n, 0.035, M.railing, 8);
  const len = Math.hypot(x1 - x0, z1 - z0);
  const m = new THREE.Mesh(new THREE.BoxGeometry(len, 0.12, 0.25), M.railing);
  m.position.set((x0 + x1) / 2, FL + 3, (z0 + z1) / 2); m.rotation.y = -Math.atan2(z1 - z0, x1 - x0);
  m.castShadow = true; scene.add(m);
}
railLine(1, 0.25, 4.5, 0.25); railLine(9.5, 0.25, 12.5, 0.25); railLine(0.25, 1, 0.25, 7.25);
// two chairs and a tea table on the verandah
function chair(x, z, rot, mat = M.woodLight) {
  const g = new THREE.Group();
  rb(-0.9, 0.9, FL + 1.4, FL + 1.65, -0.9, 0.9, mat, 0.08, g);
  rb(-0.9, 0.9, FL + 1.65, FL + 3.2, 0.7, 0.9, mat, 0.08, g);
  for (const [a, b] of [[-0.8, -0.8], [0.8, -0.8], [-0.8, 0.8], [0.8, 0.8]]) cyl(a, FL, FL + 1.4, b, 0.07, M.wood, 8, g);
  g.position.set(x, 0, z); g.rotation.y = rot; scene.add(g);
}
chair(2.6, 4.4, Math.PI / 2 + 0.3); chair(2.6, 1.9, Math.PI / 2 - 0.2);
cyl(4.6, FL, FL + 1.7, 3.2, 0.15, M.wood, 12); cyl(4.6, FL + 1.7, FL + 1.8, 3.2, 1.1, M.woodLight, 32);
function plant(x, z, s = 1, y = FL) {
  cyl(x, y, y + 1.4 * s, z, 0.55 * s, M.pot, 20, scene, 0.7 * s);
  for (let i = 0; i < 6; i++) {
    const m = new THREE.Mesh(new THREE.IcosahedronGeometry((0.55 + (i % 3) * 0.12) * s, 1), i % 2 ? M.leaf : M.leaf2);
    m.position.set(x + Math.cos(i * 1.7) * 0.45 * s, y + (2.0 + (i % 3) * 0.55) * s, z + Math.sin(i * 1.7) * 0.45 * s);
    m.castShadow = true; scene.add(m);
  }
}
plant(1.3, 6.6, 0.9); plant(3.6, -3.6, 0.9, 0); plant(10.4, -3.6, 0.9, 0);
// ground, front yard, compound wall
const grass = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), M.grass);
grass.rotation.x = -Math.PI / 2; grass.position.set(12.5, -0.02, 10); grass.receiveShadow = true; scene.add(grass);
M.grass.map.repeat.set(80, 80);
floor(-3, 26, -17.4, 0, M.paver, 4, 0.01);
floor(-3, 0, 0, 35.25, M.paver, 4, 0.01); floor(25, 26, 0, 35.25, M.paver, 4, 0.01);
for (const [x0, x1, z0, z1] of [[-3.5, -3, -17.4, 36.5], [26, 26.5, -17.4, 36.5], [-3.5, 26.5, 36, 36.5], [-3.5, 2, -17.9, -17.4], [11, 26.5, -17.9, -17.4]]) {
  bx(x0, x1, 0, 4, z0, z1, M.wallCompound); bx(x0 - 0.1, x1 + 0.1, 4, 4.25, z0 - 0.1, z1 + 0.1, M.cap);
}
for (const x of [1.5, 11]) bx(x, x + 1.2, 0, 5, -18.1, -16.9, M.column);       // gate pillars
for (let i = 0; i < 18; i++) cyl(2.9 + i * 0.45, 0.2, 4.2, -17.65, 0.04, M.gate, 6);  // gate
bx(2.7, 10.8, 3.9, 4.1, -17.75, -17.55, M.gate); bx(2.7, 10.8, 0.4, 0.6, -17.75, -17.55, M.gate);

function tree(x, z, s = 1) {
  cyl(x, 0, 6 * s, z, 0.45 * s, M.wood, 10);
  for (let i = 0; i < 5; i++) {
    const m = new THREE.Mesh(new THREE.IcosahedronGeometry((2.6 + (i % 2) * 0.8) * s, 1), i % 2 ? M.leaf : M.leaf2);
    m.position.set(x + Math.cos(i * 1.3) * 1.6 * s, (7 + (i % 3) * 1.4) * s, z + Math.sin(i * 1.3) * 1.6 * s);
    m.castShadow = true; scene.add(m);
  }
}
for (const [x, z, s] of [[-16, 27, 1.2], [-18, 45, 1.3], [41, 25, 1.1], [40, 46, 1.3], [6, 56, 1.2], [24, 58, 1.0], [-34, -26, 1.0], [58, -20, 1.1]]) tree(x, z, s);

// ---- furniture -----------------------------------------------------------------------------
function bed(x0, x1, z0, z1, headAt, blanket) {     // headAt: 'z1' or 'z0'
  const hz = headAt === 'z1' ? z1 : z0, dir = headAt === 'z1' ? -1 : 1;
  bx(x0, x1, FL, FL + 1.15, z0, z1, M.wood);
  rb(x0 + 0.1, x1 - 0.1, FL + 1.15, FL + 1.85, z0 + 0.1, z1 - 0.1, M.sheet, 0.2);
  bx(x0 - 0.1, x1 + 0.1, FL, FL + 3.6, Math.min(hz, hz + dir * 0.3), Math.max(hz, hz + dir * 0.3), M.wood);
  const pw = (x1 - x0 - 0.6) / 2;
  for (let i = 0; i < 2; i++) {
    const px = x0 + 0.3 + i * pw;
    const pz0 = hz + dir * 0.45, pz1 = hz + dir * 1.55;
    rb(px + 0.05, px + pw - 0.05, FL + 1.85, FL + 2.3, Math.min(pz0, pz1), Math.max(pz0, pz1), M.pillow, 0.2);
  }
  const bz0 = hz + dir * 2.4, bz1 = headAt === 'z1' ? z0 + 0.05 : z1 - 0.05;
  rb(x0 + 0.02, x1 - 0.02, FL + 1.3, FL + 1.97, Math.min(bz0, bz1), Math.max(bz0, bz1), blanket, 0.18);
  for (const sx of [x0 - 1.8, x1 + 0.3]) {         // side tables with lamps
    const tz0 = headAt === 'z1' ? z1 - 1.8 : z0 + 0.3;
    rb(sx, sx + 1.5, FL, FL + 2.0, tz0, tz0 + 1.5, M.woodLight, 0.06);
    cyl(sx + 0.75, FL + 2.0, FL + 2.8, tz0 + 0.75, 0.1, M.steel, 10);
    cyl(sx + 0.75, FL + 2.8, FL + 3.5, tz0 + 0.75, 0.5, M.lamp, 20, scene, 0.32);
  }
}
function wardrobe(x0, x1, z0, z1, facing) {
  rb(x0, x1, FL, FL + 7, z0, z1, M.woodLight, 0.04);
  const alongX = (x1 - x0) > (z1 - z0);
  const n = Math.round((alongX ? x1 - x0 : z1 - z0) / 2);
  for (let i = 1; i < n; i++) {
    if (alongX) { const x = x0 + i * (x1 - x0) / n; const z = facing > 0 ? z1 + 0.01 : z0 - 0.01; bx(x - 0.02, x + 0.02, FL + 0.2, FL + 6.8, z - 0.01, z + 0.01, M.frame); }
    else { const z = z0 + i * (z1 - z0) / n; const x = facing > 0 ? x1 + 0.01 : x0 - 0.01; bx(x - 0.01, x + 0.01, FL + 0.2, FL + 6.8, z - 0.02, z + 0.02, M.frame); }
  }
}
function curtains(xa, xb, za, zb, mat, inset) {      // two panels either side of a window, on the room side
  const alongX = Math.abs(xb - xa) > Math.abs(zb - za);
  for (const end of [0, 1]) {
    const geo = new THREE.BoxGeometry(alongX ? 1.4 : 0.12, 6.6, alongX ? 0.12 : 1.4, 6, 1, 6);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {           // folds
      const u = alongX ? pos.getX(i) : pos.getZ(i);
      const w = Math.sin(u * 9) * 0.09;
      if (alongX) pos.setZ(i, pos.getZ(i) + w); else pos.setX(i, pos.getX(i) + w);
    }
    geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, mat);
    const c = end === 0 ? (alongX ? xa - 0.5 : za - 0.5) : (alongX ? xb + 0.5 : zb + 0.5);
    if (alongX) m.position.set(c, FL + 4.2, za + inset); else m.position.set(xa + inset, FL + 4.2, c);
    m.castShadow = true; scene.add(m);
    if (alongX) bx(xa - 1.4, xb + 1.4, FL + 7.55, FL + 7.65, za + inset - 0.05, za + inset + 0.05, M.steel);
    else bx(xa + inset - 0.05, xa + inset + 0.05, FL + 7.55, FL + 7.65, za - 1.4, zb + 1.4, M.steel);
  }
}
function fan(x, z) {
  const g = new THREE.Group();
  cyl(0, TOP - 1.2, TOP, 0, 0.05, M.white, 8, g);
  cyl(0, TOP - 1.45, TOP - 1.15, 0, 0.35, M.white, 20, g);
  for (let i = 0; i < 3; i++) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.04, 0.42), M.white);
    b.position.set(Math.cos(i * 2.094) * 1.3, TOP - 1.3, Math.sin(i * 2.094) * 1.3);
    b.rotation.y = -i * 2.094; g.add(b);
  }
  g.position.set(x, 0, z); ceiling.add(g); fans.push(g);
}
function ceilingLight(x, z, intensity = 22) {
  const l = new THREE.PointLight(0xffe7c4, intensity, 26, 1.6);
  l.position.set(x, TOP - 0.7, z); ceiling.add(l);
  const d = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.08, 24), M.lamp);
  d.position.set(x, TOP - 0.05, z); ceiling.add(d);
}

// bedroom 1
bed(4.3, 9.3, 15.9, 22.55, 'z1', M.blanket1);
wardrobe(11.0, 12.95, 13.8, 20.2, -1);
bx(1.0, 4.0, FL, FL + 2.5, 8.6, 10.2, M.woodLight); rb(1.4, 3.6, FL + 2.5, FL + 5.2, 8.35, 8.5, M.mirror, 0.05);   // dresser
rb(3.4, 10.2, FL + 0.01, FL + 0.05, 12.0, 15.6, M.rug, 0.02);
curtains(0.85, 0.85, 12.5, 17.5, M.curtain1, 0.25); curtains(4, 9, 8.25, 8.25, M.curtain1, 0.25);
// bedroom 2
bed(3.2, 8.2, 23.4, 30.0, 'z0', M.blanket2);
wardrobe(11.0, 12.95, 27.8, 34.4, -1);
bx(1.0, 4.4, FL, FL + 2.6, 32.4, 34.45, M.woodLight); rb(1.2, 2.8, FL, FL + 1.6, 30.9, 32.2, M.cabinetAccent, 0.08);   // study table + stool
curtains(0.85, 0.85, 26.5, 31.5, M.curtain2, 0.25); curtains(4, 9, 34.5, 34.5, M.curtain2, -0.25);
// living room
const sofa = (x0, x1, z0, z1) => {
  rb(x0, x1, FL, FL + 1.4, z0, z1, M.sofa, 0.15);
  rb(x1 - 0.8, x1, FL + 1.4, FL + 3.0, z0, z1, M.sofa, 0.2);
  rb(x0, x1, FL + 1.4, FL + 2.3, z0, z0 + 0.6, M.sofa, 0.2); rb(x0, x1, FL + 1.4, FL + 2.3, z1 - 0.6, z1, M.sofa, 0.2);
  const n = 3, len = (z1 - z0 - 1.2) / n;
  for (let i = 0; i < n; i++) rb(x0 + 0.1, x1 - 0.85, FL + 1.4, FL + 1.85, z0 + 0.6 + i * len + 0.05, z0 + 0.6 + (i + 1) * len - 0.05, M.sofa, 0.15);
  rb(x1 - 1.3, x1 - 0.8, FL + 1.85, FL + 2.9, z0 + 1.2, z0 + 2.3, M.cushion, 0.15); rb(x1 - 1.3, x1 - 0.8, FL + 1.85, FL + 2.9, z1 - 2.3, z1 - 1.2, M.cushion, 0.15);
};
sofa(21.1, 24.2, 9.9, 17.1);
rb(17.6, 20.0, FL + 1.25, FL + 1.4, 11.8, 15.2, M.woodLight, 0.05);
for (const [x, z] of [[17.8, 12.0], [19.8, 12.0], [17.8, 15.0], [19.8, 15.0]]) cyl(x, FL, FL + 1.25, z, 0.07, M.wood, 8);
rb(16.4, 21.0, FL + 0.01, FL + 0.05, 10.6, 16.6, M.rug, 0.02);
rb(13.4, 14.9, FL, FL + 1.8, 12.0, 17.2, M.wood, 0.05);
bx(13.42, 13.6, FL + 3.0, FL + 5.6, 12.4, 16.8, M.black); bx(13.6, 13.62, FL + 3.1, FL + 5.5, 12.5, 16.7, M.screen);
plant(14.3, 17.6, 0.7);
// passage: wash basin and mirror
cyl(14.1, FL, FL + 2.6, 20.25, 0.3, M.white, 16); rb(13.4, 14.9, FL + 2.6, FL + 2.95, 19.5, 21.0, M.white, 0.12);
bx(13.4, 13.45, FL + 3.8, FL + 6.0, 19.6, 20.9, M.mirror);
// toilet: wall tiles to 7', WC, shower
bx(17.25, 24.25, FL, FL + 7, 18.63, 18.68, M.bathWall); bx(17.25, 24.25, FL, FL + 7, 22.57, 22.62, M.bathWall);
bx(24.2, 24.25, FL, FL + 7, 18.63, 22.62, M.bathWall);
bx(17.25, 17.3, FL, FL + 7, 18.63, 19.0, M.bathWall); bx(17.25, 17.3, FL, FL + 7, 21.5, 22.62, M.bathWall);
bx(23.3, 24.2, FL, FL + 2.6, 19.9, 21.3, M.white);
const bowl = cyl(22.7, FL, FL + 1.3, 20.6, 0.55, M.white, 24); bowl.scale.set(1.3, 1, 0.85);
cyl(20.0, FL + 6.0, FL + 6.2, 22.3, 0.35, M.steel, 16); cyl(20.0, FL + 6.2, FL + 7.0, 22.5, 0.04, M.steel, 8);
// kitchen: L counter, sink, hob, chimney, wall cabinets, fridge, table
bx(16.9, 24.25, FL, FL + 2.8, 32.5, 34.5, M.cabinet); bx(16.85, 24.25, FL + 2.8, FL + 2.95, 32.4, 34.5, M.granite);
bx(22.25, 24.25, FL, FL + 2.8, 25.4, 32.5, M.cabinet); bx(22.15, 24.25, FL + 2.8, FL + 2.95, 25.4, 32.5, M.granite);
for (let x = 17.5; x < 24; x += 1.6) bx(x, x + 0.04, FL + 0.2, FL + 2.6, 32.48, 32.5, M.frame);
for (let z = 26.0; z < 32.5; z += 1.6) bx(22.23, 22.25, FL + 0.2, FL + 2.6, z, z + 0.04, M.frame);
bx(16.9, 24.25, FL + 2.95, FL + 5.0, 34.42, 34.47, M.backsplash); bx(24.17, 24.22, FL + 2.95, FL + 5.0, 25.4, 34.47, M.backsplash);
bx(19.0, 21.5, FL + 2.75, FL + 2.96, 32.8, 34.2, M.steel); bx(19.2, 21.3, FL + 2.5, FL + 2.97, 33.0, 34.0, std(0x9aa0a5, 0.25, 0.9));
bx(22.4, 24.0, FL + 2.95, FL + 3.0, 27.2, 29.6, M.black);
for (const z of [27.8, 29.0]) cyl(23.2, FL + 3.0, FL + 3.06, z, 0.3, M.steel, 20);
bx(22.6, 24.25, FL + 6.0, FL + 6.8, 27.0, 29.8, M.steel); bx(23.3, 24.25, FL + 6.8, TOP, 27.9, 28.9, M.steel);
bx(23.0, 24.25, FL + 5.2, FL + 7.6, 30.0, 34.45, M.cabinetAccent); bx(23.0, 24.25, FL + 5.2, FL + 7.6, 25.4, 26.9, M.cabinetAccent);
rb(22.1, 24.2, FL, FL + 5.9, 23.05, 25.3, M.white, 0.12);
rb(15.0, 18.0, FL + 2.45, FL + 2.6, 28.0, 31.0, M.woodLight, 0.05);
for (const [x, z] of [[15.2, 28.2], [17.8, 28.2], [15.2, 30.8], [17.8, 30.8]]) cyl(x, FL, FL + 2.45, z, 0.07, M.wood, 8);
for (const [x, z, r] of [[16.5, 27.2, 0], [16.5, 31.8, Math.PI], [14.2, 29.5, -Math.PI / 2], [18.8, 29.5, Math.PI / 2]]) chair(x, z, r, M.wood);

// ceiling fans and lights (seen in the walkthrough)
fan(6.9, 15.4); fan(6.9, 28.9); fan(18.8, 13.3);
ceilingLight(6.9, 12.0); ceilingLight(6.9, 26.0); ceilingLight(18.8, 10.5); ceilingLight(15.1, 20.6, 12);
ceilingLight(18.8, 28.5); ceilingLight(20.7, 20.6, 8); ceilingLight(6.5, 3.8, 14); ceilingLight(18.8, 4.1, 10);

// ---- room labels, for the plan view ------------------------------------------------------
function label(text, sub, x, z) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 256;
  const g = c.getContext('2d');
  g.font = 'bold 92px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  const w = Math.max(g.measureText(text).width, 520) + 90;
  g.fillStyle = 'rgba(255,255,255,0.86)';
  g.beginPath(); g.roundRect((1024 - w) / 2, 18, w, 220, 40); g.fill();
  g.fillStyle = '#222'; g.fillText(text, 512, 92);
  g.font = '64px sans-serif'; g.fillStyle = '#555'; g.fillText(sub, 512, 182);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false }));
  s.scale.set(7.2, 1.8, 1); s.position.set(x, FL + 6.5, z); s.renderOrder = 10;
  labels.add(s);
}
label('VERANDAH', "7'-6\" wide", 6.5, 3.4);
label('STAIR', 'U-type', 18.8, 4.1);
label('BEDROOM', "12'-3\" × 14'-4\"", 6.9, 11.6);
label('BEDROOM', "12'-2\" × 11'-2\"", 6.9, 31.8);
label('LIVING ROOM', "10'-8\" × 10'-0\"", 18.4, 12.9);
label('TOILET', "7'-0\" × 4'-0\"", 20.75, 20.6);
label('KITCHEN', "11'-0\" × 11'-2\"", 19.6, 26.6);

// ---- lights ---------------------------------------------------------------------------------
const hemi = new THREE.HemisphereLight(0xe3efff, 0xbfae94, 0.75); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff1dc, 3.2);
sun.position.set(12.5 - 38, 70, 17.6 - 48); sun.target.position.set(12.5, 0, 17.6);
sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
Object.assign(sun.shadow.camera, { left: -45, right: 45, top: 45, bottom: -45, near: 10, far: 220 });
sun.shadow.bias = -0.0003; sun.shadow.normalBias = 0.04;
scene.add(sun, sun.target);

// ---- cameras and shots --------------------------------------------------------------------
const camera = new THREE.PerspectiveCamera(50, W / H, 0.2, 600);
const C = new THREE.Vector3(12.5, FL, 17.6);
function place(px, py, pz, tx, ty, tz) { camera.position.set(px, py, -pz); camera.lookAt(tx, ty, -tz); }
const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function hermite(keys, t) {          // keys: [time, ...values]; Catmull-Rom with uneven times
  const n = keys.length;
  if (t <= keys[0][0]) return keys[0].slice(1);
  if (t >= keys[n - 1][0]) return keys[n - 1].slice(1);
  let i = 0; while (keys[i + 1][0] < t) i++;
  const k0 = keys[Math.max(0, i - 1)], k1 = keys[i], k2 = keys[i + 1], k3 = keys[Math.min(n - 1, i + 2)];
  const dt = k2[0] - k1[0], u = (t - k1[0]) / dt;
  const h00 = 2 * u ** 3 - 3 * u ** 2 + 1, h10 = u ** 3 - 2 * u ** 2 + u, h01 = -2 * u ** 3 + 3 * u ** 2, h11 = u ** 3 - u ** 2;
  return k1.slice(1).map((v, j) => {
    const m1 = (k2[j + 1] - k0[j + 1]) / (k2[0] - k0[0] || 1) * dt;
    const m2 = (k3[j + 1] - k1[j + 1]) / (k3[0] - k1[0] || 1) * dt;
    return h00 * v + h10 * m1 + h01 * k2[j + 1] + h11 * m2;
  });
}

const E = FL + 5.2;   // eye height indoors
// time, camera x, y, z, look-at x, y, z
const WALK = [
  [0, 6.5, 5.4, -16, 8, 6, 6],
  [4, 7.0, 5.4, -7.5, 8, 6.0, 5],
  [7, 7.0, 6.4, -1.8, 8.5, 6.5, 6],
  [9.5, 7.5, E, 2.5, 11, 6.4, 6.5],
  [12, 10.5, E, 5.5, 16, 7.5, 5.2],
  [14.5, 13.8, E, 6.0, 15.0, 6.3, 12],
  [16.5, 15.0, E, 9.8, 19.5, 6.0, 14],
  [20, 17.0, E, 12.0, 23.5, 5.2, 13.5],
  [23, 17.6, E, 13.6, 14.0, 5.6, 15.0],
  [26, 16.2, E, 15.6, 16.0, 6.0, 26],
  [28.5, 15.5, E, 19.8, 18.6, 6.0, 20.6],
  [31, 15.6, E, 23.6, 21, 5.5, 31],
  [34, 17.5, E, 25.2, 20.5, 5.5, 34],
  [36.5, 16.0, E, 25.6, 9.0, 6.0, 25.5],
  [39, 12.0, E, 25.3, 4.0, 5.2, 29.0],
  [42, 9.5, E, 26.5, 3.0, 5.0, 33.0],
  [44.5, 9.2, E, 27.0, 12.0, 6.0, 24.0],
  [46.5, 12.4, E, 25.1, 16, 6.5, 22],
  [49, 15.3, E, 21.8, 15.2, 6.5, 12],
  [52, 15.3, E, 13.2, 12.0, 6.5, 10.2],
  [54.5, 11.5, E, 10.3, 5.0, 5.2, 19.0],
  [57.5, 8.6, E, 12.0, 4.0, 5.0, 21.0],
  [60, 8.2, E, 12.6, 0.5, 6.0, 14.5],
];
const SHOTS = {
  aerial: { dur: 11, setup() { walls.visible = true; cutWalls.visible = false; ceiling.visible = false; labels.visible = false; renderer.toneMappingExposure = 0.95; },
    cam(t) { const u = ease(t / 11); const a = THREE.MathUtils.degToRad(208 + 122 * u); const r = 40 - 5 * u, h = 33 - 6 * u;
      place(C.x + r * Math.cos(a), h, C.z + r * Math.sin(a), C.x, 2, C.z + 1.5); } },
  plan: { dur: 7, setup() { walls.visible = false; cutWalls.visible = true; ceiling.visible = false; labels.visible = true; renderer.toneMappingExposure = 1.0; },
    cam(t) { const u = ease(t / 7); place(12.5, 47 - 8 * u, 1 + 3 * u, 12.5, 0, 18.0); } },
  walk: { dur: 60, setup() { walls.visible = true; cutWalls.visible = false; ceiling.visible = true; labels.visible = false; renderer.toneMappingExposure = 1.1; },
    cam(t) { const [x, y, z, tx, ty, tz] = hermite(WALK, t); place(x, y, z, tx, ty, tz);
      for (const f of fans) f.rotation.y = t * 9; } },
  stillA: { dur: 1, setup() { SHOTS.aerial.setup(); }, cam() { const a = THREE.MathUtils.degToRad(232); place(C.x + 37 * Math.cos(a), 31, C.z + 37 * Math.sin(a), C.x, 2, C.z + 1.5); } },
  stillB: { dur: 1, setup() { SHOTS.aerial.setup(); }, cam() { const a = THREE.MathUtils.degToRad(305); place(C.x + 37 * Math.cos(a), 31, C.z + 37 * Math.sin(a), C.x, 2, C.z + 1.5); } },
  stillPlan: { dur: 1, setup() { SHOTS.plan.setup(); }, cam() { place(12.5, 41, 3.5, 12.5, 0, 18.0); } },
  stillLiving: { dur: 1, setup() { SHOTS.walk.setup(); }, cam() { place(15.2, E, 17.6, 20.5, 5.0, 10.0); } },
  stillKitchen: { dur: 1, setup() { SHOTS.walk.setup(); }, cam() { place(14.4, E, 24.0, 21.5, 5.0, 32.5); } },
  stillBed1: { dur: 1, setup() { SHOTS.walk.setup(); }, cam() { place(9.8, E, 9.0, 5.6, 4.4, 21.0); } },
  stillBed2: { dur: 1, setup() { SHOTS.walk.setup(); }, cam() { place(7.9, E, 34.0, 5.8, 4.4, 24.0); } },
  stillVerandah: { dur: 1, setup() { SHOTS.walk.setup(); }, cam() { place(7.0, 5.6, -9.0, 9.5, 6.0, 5.0); } },
  stillEntry: { dur: 1, setup() { SHOTS.walk.setup(); }, cam() { place(7.6, E, 1.6, 16.5, 6.2, 6.8); } },
  stillLiving2: { dur: 1, setup() { SHOTS.walk.setup(); }, cam() { place(22.0, E, 15.8, 13.4, 5.2, 12.2); } },
  stillPassage: { dur: 1, setup() { SHOTS.walk.setup(); }, cam() { place(14.3, E, 15.4, 17.2, 4.8, 22.0); } },
  stillToilet: { dur: 1, fov: 60, setup() { SHOTS.walk.setup(); }, cam() { place(15.4, E, 20.6, 24.0, 3.6, 20.3); } },
  stillKitchen2: { dur: 1, setup() { SHOTS.walk.setup(); }, cam() { place(14.4, E, 33.5, 22.4, 4.8, 24.6); } },
};

window.shots = Object.fromEntries(Object.entries(SHOTS).map(([k, v]) => [k, v.dur]));
let lastShot = null;
window.frame = (name, t) => {
  const s = SHOTS[name]; s.setup(); s.cam(t);
  if (name !== lastShot) { renderer.shadowMap.needsUpdate = true; lastShot = name; }
  camera.fov = s.fov || (name === 'walk' || name.startsWith('still') && !['stillA', 'stillB', 'stillPlan'].includes(name) ? 62 : 50);
  camera.updateProjectionMatrix();
  renderer.render(world, camera);
  return renderer.domElement.toDataURL('image/jpeg', 0.93);
};
window.size = (w, h) => { renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); };
window.ready = true;
