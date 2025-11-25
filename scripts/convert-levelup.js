#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");

function toID(text) {
  if (!text && text !== 0) return "";
  if (text?.id) text = text.id;
  if (text?.userid) text = text.userid;
  text = String(text);
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function parseLevelUpFile(inputPath) {
  const raw = fs.readFileSync(inputPath, "utf8");

  // Split into blocks separated by a line that contains only dashes (e.g. "------").
  // Use multiline flag so separators at the start of file are handled.
  const blocks = raw.split(/^\s*-{4,}\s*$/m);

  const learnsets = {};

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    const lines = trimmed.split(/\r?\n/).map(l => l.trim()).filter(l => l);
    if (!lines.length) continue;

    const speciesLine = lines[0];
    const speciesId = toID(speciesLine);
    if (!speciesId) continue;

    // remaining lines are the move lists (possibly wrapped), join with space
    const movesText = lines.slice(1).join(" ");
    if (!movesText) {
      learnsets[speciesId] = [];
      continue;
    }

    // split on commas, filter empties
    const rawMoves = movesText.split(",").map(s => s.trim()).filter(s => s);

    const seen = new Set();
    const moves = [];

    for (const entry of rawMoves) {
      // Expect format like: '1 - Leer' or '0 - Mach Punch'
      const m = entry.match(/^\s*(\d+)\s*-\s*(.+)$/);
      if (!m) continue;
      const level = Number(m[1]);
      let moveName = m[2].trim();

      // Normalize move id: remove non-letters/numbers, lower-case
      const moveId = moveName.toLowerCase().replace(/[^a-z0-9]+/g, "");
      if (!moveId) continue;

      const key = `${moveId}:lvl:${level}`;
      if (seen.has(key)) continue;
      seen.add(key);

      moves.push({ move: moveId, how: "lvl", level: level });
    }

    // sort by level asc, then move id
    moves.sort((a, b) => a.level - b.level || a.move.localeCompare(b.move));

    learnsets[speciesId] = moves;
  }

  return learnsets;
}

function main() {
  const repoRoot = path.resolve(__dirname, "..");
  const input = process.argv[2] || path.join(repoRoot, "data", "rawtxt", "LevelUpMoves.txt");
  const output = process.argv[3] || path.join(repoRoot, "data", "learnsets.json");

  if (!fs.existsSync(input)) {
    console.error("Input file not found:", input);
    process.exit(1);
  }

  console.log("Parsing", input);
  const learnsets = parseLevelUpFile(input);

  // Optionally preserve existing entries for species not present in the txt
  // For now, we will replace the entire file as requested.

  fs.writeFileSync(output, JSON.stringify(learnsets, null, 2), "utf8");
  console.log("Wrote", output, `(species: ${Object.keys(learnsets).length})`);
}

if (require.main === module) main();
