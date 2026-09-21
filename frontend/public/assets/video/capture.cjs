const { execSync } = require('child_process');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlPath = path.resolve(__dirname, '..', '..', 'video-b2b.html');
const outDir = __dirname;

for (let i = 0; i < 6; i++) {
  const outFile = path.join(outDir, `scene-${i}.png`);
  const url = `file:///${htmlPath.replace(/\\/g, '/')}#scene=${i}`;
  const cmd = `"${edgePath}" --headless=new --hide-scrollbars --window-size=1920,1080 "--screenshot=${outFile}" "${url}"`;
  console.log(`Capturing scene ${i}...`);
  try {
    execSync(cmd, { stdio: 'ignore' });
    console.log(`Saved: scene-${i}.png`);
  } catch (err) {
    console.error(`Error scene ${i}:`, err.message);
  }
}
