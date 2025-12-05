/**
 * Fix trainer sprite coordinates to use proper 512x256 dimensions with 1px border
 * Original coordinates were for 64x64, need to convert to 512x256 with -1,-1 offset
 */

const fs = require('fs');
const path = require('path');

const spriteFile = path.join(__dirname, '../data/trainer-sprites.json');
const sprites = JSON.parse(fs.readFileSync(spriteFile, 'utf8'));

// Trainer sprites are 512x256 with 1px blue border between them
// So actual spacing is 257px vertically (256 + 1 border)
// First sprite starts at (-1, -1) to account for the border

const SPRITE_WIDTH = 512;
const SPRITE_HEIGHT = 256;
const BORDER = 1;
const VERTICAL_SPACING = SPRITE_HEIGHT + BORDER; // 257

const fixedSprites = {};

for (const [trainerId, [oldX, oldY]] of Object.entries(sprites)) {
  // Determine column (0 or 1) based on old X coordinate
  const column = oldX === 0 ? 0 : 1;
  
  // Calculate row based on old Y coordinate
  // Old Y coordinates were in 64px increments, so divide by 64 to get row
  const oldSpacing = oldX === 0 ? 64 : 64; // Old spacing was 64px
  const row = Math.abs(oldY) / oldSpacing;
  
  // New coordinates with proper spacing and -1 offset for border
  const newX = column === 0 ? -1 : -(SPRITE_WIDTH + BORDER + 1);
  const newY = row === 0 ? -1 : -(VERTICAL_SPACING * row + 1);
  
  fixedSprites[trainerId] = [newX, newY];
}

// Write the fixed coordinates
fs.writeFileSync(spriteFile, JSON.stringify(fixedSprites, null, 2) + '\n', 'utf8');

console.log('Fixed trainer sprite coordinates!');
console.log('Sprite dimensions: 512x256');
console.log('Border: 1px');
console.log('Vertical spacing: 257px (256 + 1)');
console.log('First sprite offset: (-1, -1)');
console.log('Total trainers updated:', Object.keys(fixedSprites).length);
