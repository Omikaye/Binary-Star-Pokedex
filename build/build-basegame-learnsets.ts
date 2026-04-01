/*
 * build-basegame-learnsets.ts
 *
 * Converts data/BaseGameLearnsets.ts into data/BaseGameLearnsets.json.
 *
 * The output maps each Pokémon's ID to the sorted array of move IDs it knows
 * in the base game, combining:
 *   - keys from the `learnset` object (one key per learnable move)
 *   - moves listed inside each `eventData` entry's `moves` array
 *
 * Usage:
 *   npx tsx build/build-basegame-learnsets.ts
 */

import * as fs from "fs";
import * as path from "path";

const rootDir = path.resolve(__dirname, "..");

function main() {
  const tsContent = fs.readFileSync(
    path.join(rootDir, "data/BaseGameLearnsets.ts"),
    "utf8"
  );

  // Result: pokemonId -> sorted array of unique move IDs
  const result: Record<string, string[]> = {};

  // -----------------------------------------------------------------------
  // State-machine line parser
  // -----------------------------------------------------------------------
  // The file has this shape (indented with tabs):
  //
  //   export const Learnsets: ... = {
  //     <pokemonId>: {
  //       learnset: {
  //         <moveId>: [...],
  //         ...
  //       },
  //       eventData: [
  //         {generation: N, ..., moves: ["moveId", ...], ...},
  //         ...
  //       ],
  //     },
  //     ...
  //   };
  //
  // We track depth by counting `{` / `}` and `[` / `]` tokens per line.
  // -----------------------------------------------------------------------

  type State =
    | "OUTER"          // between top-level pokemon entries
    | "IN_POKEMON"     // inside a pokemon's outer block
    | "IN_LEARNSET"    // inside the learnset: { } block
    | "IN_EVENTDATA"   // inside the eventData: [ ] block
    | "IN_EVENT_OBJ";  // inside a single event object { }

  let state: State = "OUTER";

  // Depth counters used to know when we exit a block
  let pokemonBraceDepth = 0;   // brace depth when we entered IN_POKEMON
  let learnsetBraceDepth = 0;  // brace depth when we entered IN_LEARNSET
  let eventDataBracketDepth = 0; // bracket depth when we entered IN_EVENTDATA
  let eventObjBraceDepth = 0;  // brace depth when we entered IN_EVENT_OBJ

  // Running depth counters
  let braceDepth = 0;
  let bracketDepth = 0;

  let currentPokemon = "";
  let currentMoves = new Set<string>();

  // Regex patterns  (file uses one tab per depth level)
  const rePokemonId = /^\t([a-z0-9]+):\s*\{/;         // depth-1: <id>: {
  const reLearnsetKey = /^\t\tlearnset:\s*\{/;         // depth-2: learnset: {
  const reLearnsetMove = /^\t\t\t([a-z0-9]+):\s*\[/;  // depth-3: <moveId>: [
  const reEventData = /^\t\teventData:\s*\[/;          // depth-2: eventData: [
  const reMovesArray = /moves:\s*\[([^\]]*)\]/;        // moves: ["id1","id2",...]

  function countChars(line: string, ch: string): number {
    let n = 0;
    for (const c of line) if (c === ch) n++;
    return n;
  }

  const lines = tsContent.split("\n");
  for (const line of lines) {
    // Update depth counters BEFORE state transitions so we can compare on exit
    const openBraces = countChars(line, "{");
    const closeBraces = countChars(line, "}");
    const openBrackets = countChars(line, "[");
    const closeBrackets = countChars(line, "]");

    switch (state) {
      case "OUTER": {
        braceDepth += openBraces - closeBraces;
        bracketDepth += openBrackets - closeBrackets;

        const m = rePokemonId.exec(line);
        if (m) {
          currentPokemon = m[1];
          currentMoves = new Set<string>();
          pokemonBraceDepth = braceDepth; // depth AFTER counting this line
          state = "IN_POKEMON";
        }
        break;
      }

      case "IN_POKEMON": {
        braceDepth += openBraces - closeBraces;
        bracketDepth += openBrackets - closeBrackets;

        if (reLearnsetKey.test(line)) {
          learnsetBraceDepth = braceDepth;
          state = "IN_LEARNSET";
        } else if (reEventData.test(line)) {
          eventDataBracketDepth = bracketDepth;
          state = "IN_EVENTDATA";
        } else if (braceDepth < pokemonBraceDepth) {
          // Exiting the pokemon block
          if (currentMoves.size > 0) {
            result[currentPokemon] = [...currentMoves].sort();
          }
          currentPokemon = "";
          state = "OUTER";
        }
        break;
      }

      case "IN_LEARNSET": {
        braceDepth += openBraces - closeBraces;
        bracketDepth += openBrackets - closeBrackets;

        if (braceDepth < learnsetBraceDepth) {
          // Exiting learnset block
          state = "IN_POKEMON";
        } else {
          const m = reLearnsetMove.exec(line);
          if (m) currentMoves.add(m[1]);
        }
        break;
      }

      case "IN_EVENTDATA": {
        braceDepth += openBraces - closeBraces;
        bracketDepth += openBrackets - closeBrackets;

        if (bracketDepth < eventDataBracketDepth) {
          // Exiting eventData block
          state = "IN_POKEMON";
        } else {
          // Look for moves: [...] on the same line (they're always on one line)
          const m = reMovesArray.exec(line);
          if (m) {
            const movesStr = m[1];
            const moveIds = movesStr.match(/"([a-z0-9]+)"/g);
            if (moveIds) {
              for (const raw of moveIds) {
                currentMoves.add(raw.slice(1, -1)); // strip quotes
              }
            }
          }
        }
        break;
      }
    }
  }

  // Flush last pokemon if file ended inside one (shouldn't happen but be safe)
  if (currentPokemon && currentMoves.size > 0) {
    result[currentPokemon] = [...currentMoves].sort();
  }

  const outPath = path.join(rootDir, "data/BaseGameLearnsets.json");
  fs.writeFileSync(outPath, JSON.stringify(result));

  const totalMoves = Object.values(result).reduce((s, m) => s + m.length, 0);
  console.log(
    `Generated ${outPath}\n` +
    `  ${Object.keys(result).length} Pokémon, ${totalMoves} total move entries`
  );
}

main();
