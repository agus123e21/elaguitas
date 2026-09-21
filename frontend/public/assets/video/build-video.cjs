const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const dir = __dirname;
const musicPath = path.join(dir, 'music-b2b.mp3');
const outputFile = path.join(dir, 'el-aguitas-b2b.mp4');

// We have 6 scenes. Each scene will be rendered with subtle slow zoom/motion and crossfaded.
// Scene 0: 15s (offset 0)
// Scene 1: 15s (transition at 14s, dur 1s)
// Scene 2: 15s (transition at 28s, dur 1s)
// Scene 3: 15s (transition at 42s, dur 1s)
// Scene 4: 15s (transition at 56s, dur 1s)
// Scene 5: 16s (transition at 70s, dur 1s -> total 85s)

// Let's create an input concat file or filter_complex
// With zoompan for subtle movement on each scene:
// zoompan=z='min(zoom+0.0003,1.05)':d=25*15:s=1920x1080:fps=25

console.log('Generating high-resolution 1080p B2B video with FFmpeg...');

// Clean up previous output if any
if (fs.existsSync(outputFile)) {
  fs.unlinkSync(outputFile);
}

const filterComplex = `
[0:v]loop=loop=375:size=1:start=0,zoompan=z='min(zoom+0.0003,1.05)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=375:s=1920x1080:fps=25[v0];
[1:v]loop=loop=375:size=1:start=0,zoompan=z='min(zoom+0.0003,1.05)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=375:s=1920x1080:fps=25[v1];
[2:v]loop=loop=375:size=1:start=0,zoompan=z='min(zoom+0.0003,1.05)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=375:s=1920x1080:fps=25[v2];
[3:v]loop=loop=375:size=1:start=0,zoompan=z='min(zoom+0.0003,1.05)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=375:s=1920x1080:fps=25[v3];
[4:v]loop=loop=375:size=1:start=0,zoompan=z='min(zoom+0.0003,1.05)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=375:s=1920x1080:fps=25[v4];
[5:v]loop=loop=400:size=1:start=0,zoompan=z='min(zoom+0.0003,1.05)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=400:s=1920x1080:fps=25[v5];
[v0][v1]xfade=transition=fade:duration=1.2:offset=13.8[x1];
[x1][v2]xfade=transition=fade:duration=1.2:offset=27.6[x2];
[x2][v3]xfade=transition=fade:duration=1.2:offset=41.4[x3];
[x3][v4]xfade=transition=fade:duration=1.2:offset=55.2[x4];
[x4][v5]xfade=transition=fade:duration=1.2:offset=69.0[x5];
[6:a]afade=t=in:st=0:d=1.5,afade=t=out:st=82:d=3,volume=0.45[a]
`.trim().replace(/\n/g, '');

const ffmpegCmd = [
  'ffmpeg -y',
  `-i "${path.join(dir, 'scene-0.png')}"`,
  `-i "${path.join(dir, 'scene-1.png')}"`,
  `-i "${path.join(dir, 'scene-2.png')}"`,
  `-i "${path.join(dir, 'scene-3.png')}"`,
  `-i "${path.join(dir, 'scene-4.png')}"`,
  `-i "${path.join(dir, 'scene-5.png')}"`,
  `-i "${musicPath}"`,
  `-filter_complex "${filterComplex}"`,
  '-map "[x5]" -map "[a]"',
  '-t 85',
  '-c:v libx264 -pix_fmt yuv420p -preset medium -crf 20',
  '-c:a aac -b:a 192k',
  `"${outputFile}"`
].join(' ');

console.log('Running FFmpeg rendering pipeline...');
try {
  execSync(ffmpegCmd, { stdio: 'inherit' });
  console.log(`Video generated successfully: ${outputFile}`);
} catch (e) {
  console.error('Error rendering video:', e.message);
  process.exit(1);
}
