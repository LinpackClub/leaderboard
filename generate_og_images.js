import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));


const files = [
  { input: 'og-leaderboard.svg', output: 'og-leaderboard.png' },
  { input: 'og-admin.svg', output: 'og-admin.png' },
];

(async () => {
  for (const file of files) {
    const inputPath = path.join(__dirname, 'public', file.input);
    const outputPath = path.join(__dirname, 'public', file.output);
    try {
      const info = await sharp(inputPath, { density: 150 })
        .resize(1200, 630)
        .png()
        .toFile(outputPath);
      console.log(`✓ ${file.output}`, info);
    } catch (err) {
      console.error(`✗ ${file.output}:`, err.message);
    }
  }
})();
