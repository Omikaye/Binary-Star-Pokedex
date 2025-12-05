/**
 * Render markdown articles to HTML for the .articles-cached directory
 * This script converts all .md files in the articles/ directory to HTML
 */

const fs = require('fs');
const path = require('path');

// Simple markdown to HTML converter
function markdownToHTML(markdown) {
  let html = markdown;
  
  // Convert headers
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  
  // Convert [[links]] to anchor tags (for moves, abilities, items)
  html = html.replace(/\[\[([^\]]+)\]\]/g, function(match, text) {
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '');
    // Try to determine type - if it contains "berry" or common item words, link to items
    // Otherwise default to moves for most game mechanics
    let type = 'moves';
    if (text.match(/berry|ball|stone|shard|fossil|incense|mail|plate|gem|orb|scarf|band|lens|herb|seed|powder|wing|feather|scale|claw|fang|bone|pearl|nugget|stardust|dust|honey|mushroom|root|shell|shard|evo|mega|z-/i)) {
      type = 'items';
    } else if (text.match(/ability|stance|form|mode/i)) {
      type = 'abilities';
    }
    return '<a href="/Binary-Star-Pokedex/' + type + '/' + id + '" data-target="push">' + text + '</a>';
  });
  
  // Convert bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');
  
  // Convert lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  
  // Convert paragraphs (lines not already in tags)
  const lines = html.split('\n');
  let inList = false;
  let result = [];
  
  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (!inList) result.push('');
      continue;
    }
    
    if (trimmed.startsWith('<ul>')) {
      inList = true;
      result.push(line);
    } else if (trimmed.startsWith('</ul>')) {
      inList = false;
      result.push(line);
    } else if (trimmed.startsWith('<li>') || trimmed.startsWith('<h') || trimmed.startsWith('</')) {
      result.push(line);
    } else if (!inList) {
      // Wrap in paragraph if not already in a tag
      if (!trimmed.startsWith('<')) {
        result.push('<p>' + line + '</p>');
      } else {
        result.push(line);
      }
    } else {
      result.push(line);
    }
  }
  
  return result.join('\n');
}

// Main execution
const articlesDir = path.join(__dirname, '../articles');
const cacheDir = path.join(__dirname, '../.articles-cached');

// Create cache directory if it doesn't exist
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
  console.log('Created .articles-cached directory');
}

// Read all markdown files
const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));

console.log(`Converting ${files.length} articles to HTML...`);

for (const file of files) {
  const articlePath = path.join(articlesDir, file);
  const markdown = fs.readFileSync(articlePath, 'utf8');
  const html = markdownToHTML(markdown);
  
  const outputFile = file.replace('.md', '.html');
  const outputPath = path.join(cacheDir, outputFile);
  
  fs.writeFileSync(outputPath, html, 'utf8');
  console.log(`  ✓ ${file} → ${outputFile}`);
}

console.log(`\nSuccessfully rendered ${files.length} articles!`);
