/**
 * Search
 *
 * Code for searching for dex information
 *
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license MIT
 */

type ID = string;
type TypeName = string;

type SearchType =
  | "pokemon"
  | "type"
  | "tier"
  | "move"
  | "item"
  | "ability"
  | "egggroup"
  | "category";

type SearchRow =
  | [SearchType, ID, number?, number?]
  | ["sortpokemon" | "sortmove", ""]
  | ["header" | "html", string];

type SearchFilter = [string, string];

/**
 * PokemonSet can be sparse, in which case that entry should be
 * inferred from the rest of the set, according to sensible
 * defaults.
 */
interface PokemonSet {
  species: string;
}

/** ID, SearchType, index (if alias), offset (if offset alias) */
let BattleSearchIndex: [ID, SearchType, number?, number?][] = [];
let BattleSearchIndexOffset: any;
declare const BattleMovedex: any;
declare const BattleAbilities: any;
declare const BattleTypeChart: any;
declare const BattlePokedex: any;
declare const BattleItems: any;
declare const Learnsets: any;

declare function toID(id: string): ID;
declare function getID(set: any, text: string): any;
declare function canLearn(poke: ID, move: ID): boolean;

function hasAbility(pokemon: any, ability: ID) {
  for (let key in pokemon.abilities) {
    if (toID(pokemon.abilities[key]) == toID(ability)) {
      return true;
    }
  }
  return false;
}

function generateSearchIndex() {
  let index: string[] = [];

  // Filter out entries where the data object doesn't have a valid name
  index = index.concat(Object.keys(BattlePokedex).filter(x => BattlePokedex[x]?.name).map((x) => x + " pokemon"));
  index = index.concat(Object.keys(BattleMovedex).filter(x => BattleMovedex[x]?.name).map((x) => x + " move"));
  index = index.concat(Object.keys(BattleItems).filter(x => BattleItems[x]?.name).map((x) => x + " item"));
  index = index.concat(Object.keys(BattleAbilities).filter(x => BattleAbilities[x]?.name).map((x) => x + " ability"));
  index = index.concat(
    Object.keys(BattleTypeChart).filter(x => BattleTypeChart[x]?.name).map((x) => toID(x) + " type")
  );
  index = index.concat(
    ["physical", "special", "status"].map((x) => toID(x) + " category")
  );
  index = index.concat(
    [
      "monster",
      "water1",
      "bug",
      "flying",
      "field",
      "fairy",
      "grass",
      "humanlike",
      "water3",
      "mineral",
      "amorphous",
      "water2",
      "ditto",
      "dragon",
      "undiscovered",
    ].map((x) => toID(x) + " egggroup")
  );

  index.sort();

  // manually rearrange
  index[index.indexOf("grass type")] = "grass egggroup";
  index[index.indexOf("grass egggroup")] = "grass type";

  index[index.indexOf("fairy type")] = "fairy egggroup";
  index[index.indexOf("fairy egggroup")] = "fairy type";

  index[index.indexOf("flying type")] = "flying egggroup";
  index[index.indexOf("flying egggroup")] = "flying type";

  index[index.indexOf("dragon type")] = "dragon egggroup";
  index[index.indexOf("dragon egggroup")] = "dragon type";

  index[index.indexOf("bug type")] = "bug egggroup";
  index[index.indexOf("bug egggroup")] = "bug type";

  index[index.indexOf("psychic type")] = "psychic move";
  index[index.indexOf("psychic move")] = "psychic type";

  if (getID(BattlePokedex, "ditto")) {
    index[index.indexOf("ditto pokemon")] = "ditto egggroup";
    index[index.indexOf("ditto egggroup")] = "ditto pokemon";
  }

  BattleSearchIndex = index.map((x) => {
    let split: [ID, SearchType, number?, number?] = x.split(" ") as any;
    if (split.length > 3) {
      split[3] = Number(split[3]);
      split[2] = index.indexOf(split[2] + " " + split[1]);
    }
    return split;
  });

  BattleSearchIndexOffset = BattleSearchIndex.map((entry, i) => {
    const id = entry[0];
    let name = "";
    switch (entry[1]) {
      case "pokemon":
        name = getID(BattlePokedex, id)?.name ?? "";
        break;
      case "move":
        name = getID(BattleMovedex, id)?.name ?? "";
        break;
      case "item":
        name = getID(BattleItems, id)?.name ?? "";
        break;
      case "ability":
        name = getID(BattleAbilities, id)?.name ?? "";
        break;
    }
    let res = "";
    let nonAlnum = 0;
    for (let i = 0, j = 0; i < id.length; i++, j++) {
      while (!/[a-zA-Z0-9]/.test(name[j])) {
        j++;
        nonAlnum++;
      }
      res += nonAlnum;
    }
    if (nonAlnum) return res;
    return "";
  });
}
/**

/**
 * Backend for search UIs.
 */
class DexSearch {
  query = "";

  typedSearch: BattleTypedSearch<SearchType> | null = null;

  results: SearchRow[] | null = null;
  exactMatch = false;

  static typeTable = {
    pokemon: 1,
    type: 2,
    tier: 3,
    move: 4,
    item: 5,
    ability: 6,
    egggroup: 7,
    category: 8,
    article: 9,
  };
  static typeName = {
    pokemon: "Pok&eacute;mon",
    type: "Type",
    tier: "Tiers",
    move: "Moves",
    item: "Items",
    ability: "Abilities",
    egggroup: "Egg group",
    category: "Category",
    article: "Article",
  };
  firstPokemonColumn: "Tier" | "Number" = "Number";

  /**
   * Column to sort by. Default is `null`, a smart sort determined by how good
   * things are according to the base filters, falling back to dex number (for
   * Pokemon) and name (for everything else).
   */
  sortCol: string | null = null;
  reverseSort = false;

  /**
   * Filters for the search result. Does not include the two base filters
   * (format and species).
   */
  filters: SearchFilter[] | null = null;

  constructor(
    searchType: SearchType | "" = "",
    formatid = "" as ID,
    species = "" as ID
  ) {
		generateSearchIndex();
    this.setType(searchType, formatid, species);
  }

  getTypedSearch(
    searchType: SearchType | "",
    format = "" as ID,
    speciesOrSet: ID
  ) {
    if (!searchType) return null;
    switch (searchType) {
      case "pokemon":
        return new BattlePokemonSearch("pokemon", format, speciesOrSet);
      case "item":
        return new BattleItemSearch("item", format, speciesOrSet);
      case "move":
        return new BattleMoveSearch("move", format, speciesOrSet);
      case "ability":
        return new BattleAbilitySearch("ability", format, speciesOrSet);
      case "type":
        return new BattleTypeSearch("type", format, speciesOrSet);
      case "category":
        return new BattleCategorySearch("category", format, speciesOrSet);
    }
    return null;
  }

  find(query: string) {
    query = toID(query);
    if (this.query === query && this.results) {
      return false;
    }
    this.query = query;
    if (!query) {
      this.results =
        this.typedSearch?.getResults(
          this.filters,
          this.sortCol,
          this.reverseSort
        ) || [];
    } else {
      this.results = this.textSearch(query);
    }
    return true;
  }

  setType(searchType: SearchType | "", format = "" as ID, speciesOrSet: ID) {
    // invalidate caches
    this.results = null;

    if (searchType !== this.typedSearch?.searchType) {
      this.filters = null;
      this.sortCol = null;
    }
    this.typedSearch = this.getTypedSearch(searchType, format, speciesOrSet);
  }

  addFilter(entry: SearchFilter): boolean {
    if (!this.typedSearch) return false;
    let [type] = entry;
    if (this.typedSearch.searchType === "pokemon") {
      if (type === this.sortCol) this.sortCol = null;
      if (!["type", "move", "ability", "egggroup", "tier"].includes(type))
        return false;
      if (type === "move") entry[1] = toID(entry[1]);
      if (!this.filters) this.filters = [];
      this.results = null;
      for (const filter of this.filters) {
        if (filter[0] === type && filter[1] === entry[1]) {
          return true;
        }
      }
      this.filters.push(entry);
      return true;
    } else if (this.typedSearch.searchType === "move") {
      if (type === this.sortCol) this.sortCol = null;
      if (!["type", "category", "pokemon"].includes(type)) return false;
      if (type === "pokemon") entry[1] = toID(entry[1]);
      if (!this.filters) this.filters = [];
      this.filters.push(entry);
      this.results = null;
      return true;
    }
    return false;
  }

  removeFilter(entry?: SearchFilter): boolean {
    if (!this.filters) return false;
    if (entry) {
      const filterid = entry.join(":");
      let deleted: string[] | null = null;
      // delete specific filter
      for (let i = 0; i < this.filters.length; i++) {
        if (filterid === this.filters[i].join(":")) {
          deleted = this.filters[i];
          this.filters.splice(i, 1);
          break;
        }
      }
      if (!deleted) return false;
    } else {
      this.filters.pop();
    }
    if (!this.filters.length) this.filters = null;
    this.results = null;
    return true;
  }

  toggleSort(sortCol: string) {
    if (this.sortCol === sortCol) {
      if (!this.reverseSort) {
        this.reverseSort = true;
      } else {
        this.sortCol = null;
        this.reverseSort = false;
      }
    } else {
      this.sortCol = sortCol;
      this.reverseSort = false;
    }
    this.results = null;
  }

  filterLabel(filterType: string) {
    if (this.typedSearch && this.typedSearch.searchType !== filterType) {
      return "Filter";
    }
    return null;
  }
  illegalLabel(id: ID) {
    return this.typedSearch?.illegalReasons?.[id] || null;
  }

  textSearch(query: string): SearchRow[] {
    query = toID(query);

    this.exactMatch = false;
    let searchType: SearchType | "" = this.typedSearch?.searchType || "";

    // If searchType exists, we're searching mainly for results of that type.
    // We'll still search for results of other types, but those results
    // will only be used to filter results for that type.
    let searchTypeIndex = searchType ? DexSearch.typeTable[searchType] : -1;

    /** searching for "Psychic type" will make the type come up over the move */
    let qFilterType: "type" | "" = "";
    if (query.slice(-4) === "type") {
      if (query.slice(0, -4) in BattleTypeChart) {
        query = query.slice(0, -4);
        qFilterType = "type";
      }
    }

    // i represents the location of the search index we're looking at
    let i = DexSearch.getClosest(query);
    this.exactMatch = BattleSearchIndex[i][0] === query;

    // Even with output buffer buckets, we make multiple passes through
    // the search index. searchPasses is a queue of which pass we're on:
    // [passType, i, query]

    // By doing an alias pass after the normal pass, we ensure that
    // mid-word matches only display after start matches.
    let passType: SearchPassType | "" = "";
    /**
     * pass types:
     * * '': time to pop the next pass off the searchPasses queue
     * * 'normal': start at i and stop when results no longer start with query
     * * 'alias': like normal, but output aliases instead of non-alias results
     * * 'fuzzy': start at i and stop when you have two results
     * * 'exact': like normal, but stop at i
     */
    type SearchPassType = "normal" | "alias" | "fuzzy" | "exact";
    /**
     * [passType, i, query]
     *
     * i = index of BattleSearchIndex to start from
     *
     * By doing an alias pass after the normal pass, we ensure that
     * mid-word matches only display after start matches.
     */
    type SearchPass = [SearchPassType, number, string];
    let searchPasses: SearchPass[] = [["normal", i, query]];

    // For performance reasons, only do an alias pass if query is at
    // least 2 chars long
    if (query.length > 1) searchPasses.push(["alias", i, query]);

    // If there are no matches starting with query: Do a fuzzy match pass
    // Fuzzy matches will still be shown after alias matches
    if (
      !this.exactMatch &&
      BattleSearchIndex[i][0].substr(0, query.length) !== query
    ) {
      // No results start with this. Do a fuzzy match pass.
      let matchLength = query.length - 1;
      if (!i) i++;
      while (
        matchLength &&
        BattleSearchIndex[i][0].substr(0, matchLength) !==
          query.substr(0, matchLength) &&
        BattleSearchIndex[i - 1][0].substr(0, matchLength) !==
          query.substr(0, matchLength)
      ) {
        matchLength--;
      }
      let matchQuery = query.substr(0, matchLength);
      while (
        i >= 1 &&
        BattleSearchIndex[i - 1][0].substr(0, matchLength) === matchQuery
      )
        i--;
      searchPasses.push(["fuzzy", i, ""]);
    }

    // We split the output buffers into 8 buckets.
    // Bucket 0 is usually unused, and buckets 1-7 represent
    // pokemon, types, moves, etc (see typeTable).

    // When we're done, the buffers are concatenated together to form
    // our results, with each buffer getting its own header, unlike
    // multiple-pass results, which have no header.

    // Notes:
    // - if we have a searchType, that searchType's buffer will be on top
    let bufs: SearchRow[][] = [[], [], [], [], [], [], [], [], [], []];
    let topbufIndex = -1;

    let count = 0;
    let nearMatch = false;

    /** [type, id, typeIndex] */
    let instafilter: [SearchType, ID, number] | null = null;
    let instafilterSort = [0, 1, 2, 5, 4, 3, 6, 7, 8];
    let illegal = this.typedSearch?.illegalReasons;

    // We aren't actually looping through the entirety of the searchIndex
    for (i = 0; i < BattleSearchIndex.length; i++) {
      if (!passType) {
        let searchPass = searchPasses.shift();
        if (!searchPass) break;
        passType = searchPass[0];
        i = searchPass[1];
        query = searchPass[2];
      }

      let entry = BattleSearchIndex[i];
      let id = entry[0];
      let type = entry[1];

      if (!id) break;

      if (passType === "fuzzy") {
        // fuzzy match pass; stop after 2 results
        if (count >= 2) {
          passType = "";
          continue;
        }
        nearMatch = true;
      } else if (passType === "exact") {
        // exact pass; stop after 1 result
        if (count >= 1) {
          passType = "";
          continue;
        }
      } else if (id.substr(0, query.length) !== query) {
        // regular pass, time to move onto our next match
        passType = "";
        continue;
      }

      if (entry.length > 2) {
        // alias entry
        if (passType !== "alias") continue;
      } else {
        // normal entry
        if (passType === "alias") continue;
      }

      let typeIndex = DexSearch.typeTable[type];

      // For performance, with a query length of 1, we only fill the first bucket
      if (
        query.length === 1 &&
        typeIndex !== (searchType ? searchTypeIndex : 1)
      )
        continue;

      // For pokemon queries, accept types/tier/abilities/moves/eggroups as filters
      if (searchType === "pokemon" && (typeIndex === 5 || typeIndex > 7))
        continue;
      // For move queries, accept types/categories as filters
      if (
        searchType === "move" &&
        ((typeIndex !== 8 && typeIndex > 4) || typeIndex === 3)
      )
        continue;
      // For move queries in the teambuilder, don't accept pokemon as filters
      if (searchType === "move" && illegal && typeIndex === 1) continue;
      // For ability/item queries, don't accept anything else as a filter
      if (
        (searchType === "ability" || searchType === "item") &&
        typeIndex !== searchTypeIndex
      )
        continue;
      // Query was a type name followed 'type'; only show types
      if (qFilterType === "type" && typeIndex !== 2) continue;
      // hardcode cases of duplicate non-consecutive aliases
      if ((id === "megax" || id === "megay") && "mega".startsWith(query))
        continue;

      let matchStart = 0;
      let matchEnd = 0;
      if (passType === "alias") {
        // alias entry
        // [aliasid, type, originalid, matchStart, originalindex]
        matchStart = entry[3]!;
        let originalIndex = entry[2]!;
        if (matchStart) {
          matchEnd = matchStart + query.length;
          matchStart +=
            (
              BattleSearchIndexOffset[originalIndex][matchStart] || "0"
            ).charCodeAt(0) - 48;
          matchEnd +=
            (
              BattleSearchIndexOffset[originalIndex][matchEnd - 1] || "0"
            ).charCodeAt(0) - 48;
        }
        id = BattleSearchIndex[originalIndex][0];
      } else {
        matchEnd = query.length;
        if (matchEnd)
          matchEnd +=
            (BattleSearchIndexOffset[i][matchEnd - 1] || "0").charCodeAt(0) -
            48;
      }

      if (searchType && searchTypeIndex !== typeIndex) {
        // This is a filter, set it as an instafilter candidate
        if (
          !instafilter ||
          instafilterSort[typeIndex] < instafilterSort[instafilter[2]]
        ) {
          instafilter = [type, id, typeIndex];
        }
      }

      // show types above Arceus formes
      if (
        topbufIndex < 0 &&
        searchTypeIndex < 2 &&
        passType === "alias" &&
        !bufs[1].length &&
        bufs[2].length
      ) {
        topbufIndex = 2;
      }

      if (illegal && typeIndex === searchTypeIndex) {
        // Always show illegal results under legal results.
        // This is done by putting legal results (and the type header)
        // in bucket 0, and illegal results in the searchType's bucket.
        // searchType buckets are always on top (but under bucket 0), so
        // illegal results will be seamlessly right under legal results.
        if (!bufs[typeIndex].length && !bufs[0].length) {
          bufs[0] = [["header", DexSearch.typeName[type]]];
        }
        if (!(id in illegal)) typeIndex = 0;
      } else {
        if (!bufs[typeIndex].length) {
          bufs[typeIndex] = [["header", DexSearch.typeName[type]]];
        }
      }

      // don't match duplicate aliases
      let curBufLength = passType === "alias" && bufs[typeIndex].length;
      if (curBufLength && bufs[typeIndex][curBufLength - 1][1] === id) continue;

      bufs[typeIndex].push([type, id, matchStart, matchEnd]);

      count++;
    }

    let topbuf: SearchRow[] = [];
    if (nearMatch) {
      topbuf = [
        [
          "html",
          `<em>No exact match found. The closest matches alphabetically are:</em>`,
        ],
      ];
    }
    if (topbufIndex >= 0) {
      topbuf = topbuf.concat(bufs[topbufIndex]);
      bufs[topbufIndex] = [];
    }
    if (searchTypeIndex >= 0) {
      topbuf = topbuf.concat(bufs[0]);
      topbuf = topbuf.concat(bufs[searchTypeIndex]);
      bufs[searchTypeIndex] = [];
      bufs[0] = [];
    }

    if (instafilter && count < 20) {
      // Result count is less than 20, so we can instafilter
      bufs.push(this.instafilter(searchType, instafilter[0], instafilter[1]));
    }

    this.results = Array.prototype.concat.apply(topbuf, bufs);
    return this.results ?? [];
  }
  private instafilter(
    searchType: SearchType | "",
    fType: SearchType,
    fId: ID
  ): SearchRow[] {
    let buf: SearchRow[] = [];
    let illegalBuf: SearchRow[] = [];
    let illegal = this.typedSearch?.illegalReasons;
    if (searchType === "pokemon") {
      switch (fType) {
        case "type":
          let type = (fId.charAt(0).toUpperCase() + fId.slice(1)) as TypeName;
          buf.push(["header", `${type}-type Pok&eacute;mon`]);
          for (let id in BattlePokedex) {
            if (!BattlePokedex[id].types) continue;
            if (BattlePokedex[id].types.includes(type)) {
              (illegal && id in illegal ? illegalBuf : buf).push([
                "pokemon",
                id as ID,
              ]);
            }
          }
          break;
        case "ability":
          let ability = getID(BattleAbilities, fId).name;
          buf.push(["header", `${ability} Pok&eacute;mon`]);
          for (let id in BattlePokedex) {
            if (!BattlePokedex[id].abilities) continue;
            if (hasAbility(BattlePokedex[id], ability)) {
              (illegal && id in illegal ? illegalBuf : buf).push([
                "pokemon",
                id as ID,
              ]);
            }
          }
          break;
      }
    } else if (searchType === "move") {
      switch (fType) {
        case "type":
          let type = fId.charAt(0).toUpperCase() + fId.slice(1);
          buf.push(["header", `${type}-type moves`]);
          for (let id in BattleMovedex) {
            if (BattleMovedex[id].type === type) {
              (illegal && id in illegal ? illegalBuf : buf).push([
                "move",
                id as ID,
              ]);
            }
          }
          break;
        case "category":
          let category = fId.charAt(0).toUpperCase() + fId.slice(1);
          buf.push(["header", `${category} moves`]);
          for (let id in BattleMovedex) {
            if (BattleMovedex[id].category === category) {
              (illegal && id in illegal ? illegalBuf : buf).push([
                "move",
                id as ID,
              ]);
            }
          }
          break;
      }
    }
    return [...buf, ...illegalBuf];
  }

  static getClosest(query: string) {
    // binary search through the index!
    let left = 0;
    let right = BattleSearchIndex.length - 1;
    while (right > left) {
      let mid = Math.floor((right - left) / 2 + left);
      if (
        BattleSearchIndex[mid][0] === query &&
        (mid === 0 || BattleSearchIndex[mid - 1][0] !== query)
      ) {
        // that's us
        return mid;
      } else if (BattleSearchIndex[mid][0] < query) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    if (left >= BattleSearchIndex.length - 1)
      left = BattleSearchIndex.length - 1;
    else if (
      BattleSearchIndex[left + 1][0] &&
      BattleSearchIndex[left][0] < query
    )
      left++;
    if (left && BattleSearchIndex[left - 1][0] === query) left--;
    return left;
  }
}

abstract class BattleTypedSearch<T extends SearchType> {
  searchType: T;
  /**
   * `species` is the second of two base filters. It constrains results to
   * things that species can use, and affects the default sort.
   */
  species = "" as ID;
  /**
   * `set` is a pseudo-base filter; it has minor effects on move sorting.
   * (Abilities/items can affect what moves are sorted as usable.)
   */
  set: PokemonSet | null = null;

  /**
   * Cached copy of what the results list would be with only base filters
   * (i.e. with an empty `query` and `filters`)
   */
  baseResults: SearchRow[] | null = null;
  /**
   * Cached copy of all results not in `baseResults` - mostly in case a user
   * is wondering why a specific result isn't showing up.
   */
  baseIllegalResults: SearchRow[] | null = null;
  illegalReasons: { [id: string]: string } | null = null;
  results: SearchRow[] | null = null;

  protected readonly sortRow: SearchRow | null = null;

  constructor(
    searchType: T,
    format = "" as ID,
    speciesOrSet: ID | PokemonSet = "" as ID
  ) {
    this.searchType = searchType;

    this.baseResults = null;
    this.baseIllegalResults = null;

    this.species = "" as ID;
    this.set = null;
    if (typeof speciesOrSet === "string") {
      if (speciesOrSet) this.species = speciesOrSet;
    } else {
      this.set = speciesOrSet as PokemonSet;
      this.species = toID(this.set.species);
    }
    if (!searchType || !this.set) return;
  }
  getResults(
    filters?: SearchFilter[] | null,
    sortCol?: string | null,
    reverseSort?: boolean
  ): SearchRow[] {
    if (sortCol === "type") {
      return [
        this.sortRow!,
        ...BattleTypeSearch.prototype.getDefaultResults.call(this),
      ];
    } else if (sortCol === "category") {
      return [
        this.sortRow!,
        ...BattleCategorySearch.prototype.getDefaultResults.call(this),
      ];
    } else if (sortCol === "ability") {
      return [
        this.sortRow!,
        ...BattleAbilitySearch.prototype.getDefaultResults.call(this),
      ];
    }

    if (!this.baseResults) {
      this.baseResults = this.getBaseResults();
    }

    if (!this.baseIllegalResults) {
      const legalityFilter: { [id: string]: 1 } = {};
      for (const [resultType, value] of this.baseResults) {
        if (resultType === this.searchType) legalityFilter[value] = 1;
      }
      this.baseIllegalResults = [];
      this.illegalReasons = {};

      for (const id in this.getTable()) {
        if (!(id in legalityFilter)) {
          this.baseIllegalResults.push([this.searchType, id as ID]);
          this.illegalReasons[id] = "Illegal";
        }
      }
    }

    let results: SearchRow[];
    let illegalResults: SearchRow[] | null;

    if (filters) {
      results = [];
      illegalResults = [];
      for (const result of this.baseResults) {
        if (this.filter(result, filters)) {
          if (
            results.length &&
            result[0] === "header" &&
            results[results.length - 1][0] === "header"
          ) {
            results[results.length - 1] = result;
          } else {
            results.push(result);
          }
        }
      }
      if (results.length && results[results.length - 1][0] === "header") {
        results.pop();
      }
      for (const result of this.baseIllegalResults) {
        if (this.filter(result, filters)) {
          illegalResults.push(result);
        }
      }
    } else {
      results = [...this.baseResults];
      illegalResults = null;
    }

    if (sortCol) {
      results = results.filter(([rowType]) => rowType === this.searchType);
      results = this.sort(results, sortCol, reverseSort);
      if (illegalResults) {
        illegalResults = illegalResults.filter(
          ([rowType]) => rowType === this.searchType
        );
        illegalResults = this.sort(illegalResults, sortCol, reverseSort);
      }
    }

    if (this.sortRow) {
      results = [this.sortRow, ...results];
    }
    if (illegalResults && illegalResults.length) {
      results = [...results, ["header", "Illegal results"], ...illegalResults];
    }
    return results;
  }

  abstract getTable(): { [id: string]: any };
  abstract getDefaultResults(): SearchRow[];
  abstract getBaseResults(): SearchRow[];
  abstract filter(input: SearchRow, filters: string[][]): boolean;
  abstract sort(
    input: SearchRow[],
    sortCol: string,
    reverseSort?: boolean
  ): SearchRow[];
}

class BattlePokemonSearch extends BattleTypedSearch<"pokemon"> {
  filter(row: SearchRow, filters: string[][]): boolean {
    if (!filters) return true;
    if (row[0] !== "pokemon") return true;
    const poke = getID(BattlePokedex, row[1]);
    for (const [filterType, value] of filters) {
      switch (filterType) {
        case "type":
          if (poke.types.every((t) => t != value)) return false;
          break;
        case "move":
          if (!canLearn(poke.id, value)) return false;
          break;
        case "ability":
          if (!hasAbility(poke, value)) return false;
          break;
        case "egggroup":
          if (poke.eggGroups.every((t) => t != value)) return false;
          break;
      }
    }
    return true;
  }
  sortRow: SearchRow = ["sortpokemon", ""];
  getTable() {
    return BattlePokedex;
  }
  getDefaultResults(): SearchRow[] {
    // Group all entries by their base species ID and then output: base followed immediately by each form.
    interface Group { base: ID; num: number; forms: ID[] }
    const groups: { [base: string]: Group } = {};
    for (const id in BattlePokedex) {
      const p = BattlePokedex[id];
      if (!p) continue;
      const baseId = toID(p.baseSpecies || p.name);
      if (!groups[baseId]) {
        groups[baseId] = { base: id as ID, num: p.num || 0, forms: [] };
      }
      // Identify base (prefer the entry whose name equals baseSpecies or has no forme)
      const isBase = !p.forme || p.name === p.baseSpecies;
      if (isBase) {
        groups[baseId].base = id as ID;
        groups[baseId].num = p.num || groups[baseId].num;
      } else {
        groups[baseId].forms.push(id as ID);
      }
    }
    // Sort forms within each group deterministically (by name/forme)
    for (const baseId in groups) {
      groups[baseId].forms.sort((a, b) => {
        const pa = BattlePokedex[a];
        const pb = BattlePokedex[b];
        const fa = (pa.forme || pa.name).toLowerCase();
        const fb = (pb.forme || pb.name).toLowerCase();
        return fa < fb ? -1 : fa > fb ? 1 : 0;
      });
    }
    // Order groups by dex number then base id
    const ordered = Object.values(groups).sort((a, b) => a.num - b.num || (a.base < b.base ? -1 : a.base > b.base ? 1 : 0));

    // Build global form order mapping for suffix rendering in UI
    (window as any).BattleFormOrder = {};
    for (const g of ordered) {
      (window as any).BattleFormOrder[toID(BattlePokedex[g.base].baseSpecies || BattlePokedex[g.base].name)] = g.forms.slice();
    }

    const results: SearchRow[] = [];
    for (const g of ordered) {
      const baseId = g.base;
      switch (baseId) {
        case "bulbasaur":
          results.push(["header", "Generation 1"]);
          break;
        case "chikorita":
          results.push(["header", "Generation 2"]);
          break;
        case "treecko":
          results.push(["header", "Generation 3"]);
          break;
        case "turtwig":
          results.push(["header", "Generation 4"]);
          break;
        case "victini":
          results.push(["header", "Generation 5"]);
          break;
        case "chespin":
          results.push(["header", "Generation 6"]);
          break;
        case "rowlet":
          results.push(["header", "Generation 7"]);
          break;
        case "grookey":
          results.push(["header", "Generation 8"]);
          break;
        case "sprigatito":
          results.push(["header", "Generation 9"]);
          break;
        case "missingno":
          results.push(["header", "Glitch"]);
          break;
        case "syclar":
          results.push(["header", "CAP"]);
          break;
        case "pikachucosplay":
          continue; // skip cosplay aggregate
      }
      results.push(["pokemon", baseId]);
      for (const fid of g.forms) {
        results.push(["pokemon", fid]);
      }
    }
    return results;
  }
  getBaseResults(): SearchRow[] {
    return this.getDefaultResults();
  }
  sort(results: SearchRow[], sortCol: string, reverseSort?: boolean) {
    const sortOrder = reverseSort ? -1 : 1;
    if (["hp", "atk", "def", "spa", "spd", "spe"].includes(sortCol)) {
      return results.sort(([rowType1, id1], [rowType2, id2]) => {
        const stat1 = getID(BattlePokedex, id1).baseStats[sortCol];
        const stat2 = getID(BattlePokedex, id2).baseStats[sortCol];
        return (stat2 - stat1) * sortOrder;
      });
    } else if (sortCol === "bst") {
      return results.sort(([rowType1, id1], [rowType2, id2]) => {
        const base1 = getID(BattlePokedex, id1).baseStats;
        const base2 = getID(BattlePokedex, id2).baseStats;
        const bst1 =
          base1.hp + base1.atk + base1.def + base1.spa + base1.spd + base1.spe;
        const bst2 =
          base2.hp + base2.atk + base2.def + base2.spa + base2.spd + base2.spe;
        return (bst2 - bst1) * sortOrder;
      });
    } else if (sortCol === "name") {
      return results.sort(([rowType1, id1], [rowType2, id2]) => {
        const name1 = id1;
        const name2 = id2;
        return (name1 < name2 ? -1 : name1 > name2 ? 1 : 0) * sortOrder;
      });
    }
    throw new Error("invalid sortcol");
  }
}

class BattleAbilitySearch extends BattleTypedSearch<"ability"> {
  getTable() {
    return BattleAbilities;
  }
  getDefaultResults(): SearchRow[] {
    const results: SearchRow[] = [];
    for (let id in BattleAbilities) {
      results.push(["ability", id as ID]);
    }
    return results;
  }
  getBaseResults() {
    return this.getDefaultResults();
  }
  filter(row: SearchRow, filters: string[][]) {
    if (!filters) return true;
    if (row[0] !== "ability") return true;
    const ability = getID(BattleAbilities, row[1]);
    for (const [filterType, value] of filters) {
      switch (filterType) {
        case "pokemon":
          if (!hasAbility(getID(BattlePokedex, value), ability.name))
            return false;
          break;
      }
    }
    return true;
  }
  sort(
    results: SearchRow[],
    sortCol: string | null,
    reverseSort?: boolean
  ): SearchRow[] {
    throw new Error("invalid sortcol");
  }
}

class BattleItemSearch extends BattleTypedSearch<"item"> {
  getTable() {
    return BattleItems;
  }
  getDefaultResults(): SearchRow[] {
    let results: SearchRow[] = [];
    results.push(["header", "Items"]);
    // Sort by index number
    const sortedIds = Object.keys(BattleItems).sort((a, b) => {
      const numA = BattleItems[a].num || 0;
      const numB = BattleItems[b].num || 0;
      return numA - numB;
    });
    for (let id of sortedIds) {
      results.push(["item", id as ID]);
    }
    return results;
  }

  getBaseResults(): SearchRow[] {
    return this.getDefaultResults();
  }
  filter(row: SearchRow, filters: string[][]): boolean {
    throw new Error("invalid filter");
  }
  sort(
    results: SearchRow[],
    sortCol: string | null,
    reverseSort?: boolean
  ): SearchRow[] {
    throw new Error("invalid sortcol");
  }
}

class BattleMoveSearch extends BattleTypedSearch<"move"> {
  sortRow: SearchRow = ["sortmove", ""];
  getTable() {
    return BattleMovedex;
  }
  getDefaultResults(): SearchRow[] {
    let results: SearchRow[] = [];
    results.push(["header", "Moves"]);
    for (let id in BattleMovedex) {
      results.push(["move", id as ID]);
    }
    return results;
  }

  getBaseResults() {
    return this.getDefaultResults();
  }

  filter(row: SearchRow, filters: string[][]) {
    if (!filters) return true;
    if (row[0] !== "move") return true;
    const move = getID(BattleMovedex, row[1]);
    for (const [filterType, value] of filters) {
      switch (filterType) {
        case "type":
          if (move.type !== value) return false;
          break;
        case "category":
          if (move.category !== value) return false;
          break;
        case "pokemon":
          if (!canLearn(value as ID, move.id)) return false;
          break;
      }
    }
    return true;
  }
  sort(
    results: SearchRow[],
    sortCol: string,
    reverseSort?: boolean
  ): SearchRow[] {
    const sortOrder = reverseSort ? -1 : 1;
    switch (sortCol) {
      case "power":
        let powerTable: { [id: string]: number | undefined } = {
          return: 102,
          frustration: 102,
          spitup: 300,
          trumpcard: 200,
          naturalgift: 80,
          grassknot: 120,
          lowkick: 120,
          gyroball: 150,
          electroball: 150,
          flail: 200,
          reversal: 200,
          present: 120,
          wringout: 120,
          crushgrip: 120,
          heatcrash: 120,
          heavyslam: 120,
          fling: 130,
          magnitude: 150,
          beatup: 24,
          punishment: 1020,
          psywave: 1250,
          nightshade: 1200,
          seismictoss: 1200,
          dragonrage: 1140,
          sonicboom: 1120,
          superfang: 1350,
          endeavor: 1399,
          sheercold: 1501,
          fissure: 1500,
          horndrill: 1500,
          guillotine: 1500,
        };
        return results.sort(([rowType1, id1], [rowType2, id2]) => {
          let move1 = getID(BattleMovedex, id1);
          let move2 = getID(BattleMovedex, id2);
          let pow1 =
            move1.basePower ||
            powerTable[id1] ||
            (move1.category === "Status" ? -1 : 1400);
          let pow2 =
            move2.basePower ||
            powerTable[id2] ||
            (move2.category === "Status" ? -1 : 1400);
          return (pow2 - pow1) * sortOrder;
        });
      case "accuracy":
        return results.sort(([rowType1, id1], [rowType2, id2]) => {
          let accuracy1 = getID(BattleMovedex, id1).accuracy || 0;
          let accuracy2 = getID(BattleMovedex, id2).accuracy || 0;
          if (accuracy1 === true) accuracy1 = 101;
          if (accuracy2 === true) accuracy2 = 101;
          return (accuracy2 - accuracy1) * sortOrder;
        });
      case "pp":
        return results.sort(([rowType1, id1], [rowType2, id2]) => {
          let pp1 = getID(BattleMovedex, id1).pp || 0;
          let pp2 = getID(BattleMovedex, id2).pp || 0;
          return (pp2 - pp1) * sortOrder;
        });
      case "name":
        return results.sort(([rowType1, id1], [rowType2, id2]) => {
          const name1 = id1;
          const name2 = id2;
          return (name1 < name2 ? -1 : name1 > name2 ? 1 : 0) * sortOrder;
        });
    }
    throw new Error("invalid sortcol");
  }
}

class BattleCategorySearch extends BattleTypedSearch<"category"> {
  getTable() {
    return { physical: 1, special: 1, status: 1 };
  }
  getDefaultResults(): SearchRow[] {
    return [
      ["category", "physical" as ID],
      ["category", "special" as ID],
      ["category", "status" as ID],
    ];
  }
  getBaseResults() {
    return this.getDefaultResults();
  }
  filter(row: SearchRow, filters: string[][]): boolean {
    throw new Error("invalid filter");
  }
  sort(
    results: SearchRow[],
    sortCol: string | null,
    reverseSort?: boolean
  ): SearchRow[] {
    throw new Error("invalid sortcol");
  }
}

class BattleTypeSearch extends BattleTypedSearch<"type"> {
  getTable() {
    return BattleTypeChart;
  }
  getDefaultResults(): SearchRow[] {
    const results: SearchRow[] = [];
    for (let id in BattleTypeChart) {
      results.push(["type", id as ID]);
    }
    return results;
  }
  getBaseResults() {
    return this.getDefaultResults();
  }
  filter(row: SearchRow, filters: string[][]): boolean {
    throw new Error("invalid filter");
  }
  sort(
    results: SearchRow[],
    sortCol: string | null,
    reverseSort?: boolean
  ): SearchRow[] {
    throw new Error("invalid sortcol");
  }
}


export {}
declare global {
  interface Window {
    DexSearch: typeof DexSearch;
  }
}
window.DexSearch = DexSearch;
