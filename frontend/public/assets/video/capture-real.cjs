const { execSync } = require('child_process');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outDir = path.resolve(__dirname, 'real-screens');
const fs = require('fs');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const pages = [
  { name: 'real-home', url: 'http://localhost:4173/' },
  { name: 'real-catalog', url: 'http://localhost:4173/productos' },
  { name: 'real-driver', url: 'http://localhost:4173/repartos' },
  { name: 'real-login', url: 'http://localhost:4173/login' },
  { name: 'real-admin', url: 'http://localhost:4173/admin' }
];

for (const p of pages) {
  const outFile = path.join(outDir, `${p.name}.png`);
  // Smartphone viewport (iPhone 15 Pro size: 430x932)
  const cmd = `"${edgePath}" --headless=new --hide-scrollbars --window-size=430,932 "--screenshot=${outFile}" "${p.url}"`;
  console.log(`Capturing ${p.name}...`);
  try {
    execSync(cmd, { stdio: 'ignore' });
    console.log(`Saved: ${p.name}.png`);
  } catch (err) {
    console.error(`Error ${p.name}:`, err.message);
  }
}
