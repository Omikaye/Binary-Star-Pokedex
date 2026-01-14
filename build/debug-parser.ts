import * as fs from 'fs';
import * as path from 'path';

const filePath = path.resolve(__dirname, '../data/rawtxt/StaticEncounters.txt');
console.log('Reading from:', filePath);
console.log('File exists:', fs.existsSync(filePath));

const content = fs.readFileSync(filePath, 'utf-8');

// Try different split methods
console.log('File size:', content.length);
console.log('First 100 chars:', content.substring(0, 100));

// Try different line ending patterns
const lines1 = content.split('\n');
const lines2 = content.split('\r\n');
const lines3 = content.split('\r');

console.log('\nSplit by \\n:', lines1.length, 'lines');
console.log('Split by \\r\\n:', lines2.length, 'lines');
console.log('Split by \\r:', lines3.length, 'lines');

// Use the most lines
let lines = lines1;
if (lines2.length > lines1.length) lines = lines2;
if (lines3.length > lines.length) lines = lines3;

console.log('Using split with', lines.length, 'lines\n');
console.log('First 20 lines:');
for (let i = 0; i < Math.min(20, lines.length); i++) {
  const trimmed = lines[i].trim();
  console.log(`${i}: "${trimmed}"`);
}
