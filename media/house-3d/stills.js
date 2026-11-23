const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const b = await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const p = await b.newPage({viewport:{width:1920,height:1080}});
  p.on('console', m => { if (m.type()==='error' || m.type()==='warning') console.log('console:', m.text()); });
  p.on('pageerror', e => console.log('pageerror:', e.message));
  await p.goto('http://localhost:8765/index.html');
  await p.waitForFunction('window.ready===true', null, {timeout:120000}); await p.evaluate(() => window.size(2560, 1440));
  const names = process.argv.slice(2);
  for (const n of names) {
    const t0 = Date.now();
    const d = await p.evaluate(([n]) => window.frame(n, 0), [n]);
    fs.writeFileSync(`still-${n}.jpg`, Buffer.from(d.split(',')[1], 'base64'));
    console.log(n, Date.now() - t0, 'ms');
  }
  await b.close();
})();
