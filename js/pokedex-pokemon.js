window.PokedexPokemonPanel = PokedexResultPanel.extend({
	initialize: function(id) {
		// Translate display names (e.g., "Charizard 1" -> "Charizard-Mega-X") before converting to ID
		id = translateDisplayName(id);
		id = toID(id);
		var pokemon = BattlePokedex[id]
		this.id = id;
		this.shortTitle = pokemon.baseSpecies || pokemon.name;

		var buf = '<div class="pfx-body dexentry">';

		buf += `<a href="${Config.baseurl}dex" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Pok&eacute;dex</a>`;
		buf += '<h1>';
		if (pokemon.forme) {
			buf += `<a href="${Config.baseurl}pokemon/${id}" data-target="push" class="subtle">${pokemon.baseSpecies}<small>-${pokemon.forme}</small></a>`;
		} else {
			buf += `<a href="${Config.baseurl}pokemon/${id}" data-target="push" class="subtle">${pokemon.name}</a>`;
		}
		if (pokemon.num > 0) buf += ` <code>#${pokemon.num}</code>`;
		buf += '</h1>';

		if (pokemon.isNonstandard) {
			buf += '<div class="warning"><strong>Note:</strong> This Pok&eacute;mon is unreleased.</div>';
		}

		buf += `<img src="${ResourcePrefix}sprites/gen5/${id}.png" alt="" width="96" height="96" class="sprite" />`

		buf += '<dl class="typeentry">';
		buf += '<dt>Types:</dt> <dd>';
		for (var i=0; i<pokemon.types.length; i++) {
			buf += `<a class="type ${toID(pokemon.types[i])}" href="${Config.baseurl}types/${toID(pokemon.types[i])}" data-target="push">${pokemon.types[i]}</a> `;
		}
		buf += '</dd>';
		buf += '</dl>';

		buf += '<dl class="sizeentry">';
		buf += '<dt>Size:</dt> <dd>';
		var gkPower = (function(weightkg) {
			if (weightkg >= 200) return 120;
			if (weightkg >= 100) return 100;
			if (weightkg >= 50) return 80;
			if (weightkg >= 25) return 60;
			if (weightkg >= 10) return 40;
			return 20;
		})(pokemon.weightkg);
		buf += `${pokemon.heightm} m, ${pokemon.weightkg} kg<br /><small><a class="subtle" href="${Config.baseurl}moves/grassknot" data-target="push">Grass Knot</a>: ${gkPower}</small>`;
		buf += '</dd>';
		buf += '</dl>';

		buf += '<dl class="abilityentry">';
		buf += '<dt>Abilities:</dt> <dd class="imgentry">';
		for (var i in pokemon.abilities) {
			var ability = pokemon.abilities[i];
			if (!ability) continue;

			if (i !== '0') buf += ' | ';
			if (i === 'H') ability = `<em>${pokemon.abilities[i]}</em>`;
			buf += `<a href="${Config.baseurl}abilities/${toID(pokemon.abilities[i])}" data-target="push">${ability}</a>`;
			if (i === 'H') buf += '<small> (H)</small>';
			if (i === 'S') buf += '<small> (special)</small>';
		}
		buf += '</dd>';
		buf += '</dl>';

		buf += '<dl>';
		buf += '<dt style="clear:left">Base stats:</dt><dd><table class="stats">';

		var StatTitles = {
			hp: "HP",
			atk: "Attack",
			def: "Defense",
			spa: "Sp. Atk",
			spd: "Sp. Def",
			spe: "Speed"
		};
		buf += '<tr><td></td><td></td><td style="width:200px"></td><th class="ministat"><abbr title="0 IVs, 0 EVs, negative nature">min&minus;</a></th><th class="ministat"><abbr title="31 IVs, 0 EVs, neutral nature">min</abbr></th><th class="ministat"><abbr title="31 IVs, 252 EVs, neutral nature">max</abbr></th><th class="ministat"><abbr title="31 IVs, 252 EVs, positive nature">max+</abbr></th>';
		var bst = 0;
		for (var stat in BattleStatNames) {
			var baseStat = pokemon.baseStats[stat];
			bst += baseStat;
			var width = Math.floor(baseStat*200/200);
			if (width > 200) width = 200;
			var color = Math.floor(baseStat*180/255);
			if (color > 360) color = 360;
			buf += `<tr><th>${StatTitles[stat]}:</th><td class="stat">${baseStat}</td>`;
			buf += `<td class="statbar"><span style="width:${Math.floor(width)}px;background:hsl(${color},85%,45%);border-color:hsl(${color},75%,35%)"></span></td>`;
			buf += '<td class="ministat"><small>'+(stat==='hp'?'':this.getStat(baseStat, false, 100, 0, 0, 0.9))+'</small></td><td class="ministat"><small>'+this.getStat(baseStat, stat==='hp', 100, 31, 0, 1.0)+'</small></td>';
			buf += '<td class="ministat"><small>'+this.getStat(baseStat, stat==='hp', 100, 31, 255, 1.0)+'</small></td><td class="ministat"><small>'+(stat==='hp'?'':this.getStat(baseStat, false, 100, 31, 255, 1.1))+'</small></td></tr>';
		}
		buf += `<tr><th class="bst">Total:</th><td class="bst">${bst}</td><td></td><td class="ministat" colspan="4">at level <input type="text" class="textbox" name="level" placeholder="100" size="5" /></td>`;

		buf += '</table></dd>';

		// Show changes from base game if available
		var baseGame = BaseGameStats[this.id];
		if (baseGame) {
			buf += '<dt>Changes from Base Game:</dt><dd>';
			var hasChanges = false;
			var statChanges = [];
			
			// Check stat changes
			for (var stat in BattleStatNames) {
				var currentStat = pokemon.baseStats[stat];
				var baseStat = baseGame.baseStats[stat];
				if (currentStat !== baseStat) {
					hasChanges = true;
					var color = currentStat > baseStat ? '#22AA22' : '#CC2222';
					statChanges.push(`<strong>${BattleStatNames[stat]}:</strong> <span style="color:${color}">${baseStat} &rarr; ${currentStat}</span>`);
				}
			}
			
			// Check BST change
			var baseGameBst = 0;
			for (var stat in baseGame.baseStats) {
				baseGameBst += baseGame.baseStats[stat];
			}
			if (bst !== baseGameBst) {
				hasChanges = true;
				var bstColor = bst > baseGameBst ? '#22AA22' : '#CC2222';
				statChanges.push(`<strong>BST:</strong> <span style="color:${bstColor}">${baseGameBst} &rarr; ${bst}</span>`);
			}
			
			// Check weight change
			if (pokemon.weightkg !== baseGame.weightkg) {
				hasChanges = true;
				var weightColor = pokemon.weightkg > baseGame.weightkg ? '#22AA22' : '#CC2222';
				statChanges.push(`<strong>Weight:</strong> <span style="color:${weightColor}">${baseGame.weightkg} kg &rarr; ${pokemon.weightkg} kg</span>`);
			}
			
			if (hasChanges) {
				buf += statChanges.join('<br />');
			} else {
				buf += '<em>No stat changes from base game</em>';
			}
			buf += '</dd>';
		}

	// Show Z-Move information if available
	buf += '<dt>Z-Move:</dt><dd style="line-height:1.8">';
	if (pokemon.zmove && pokemon.zmove.zMove) {
		// Z-Crystal with item icon
		var zCrystalId = toID(pokemon.zmove.zCrystal);
		var zCrystalItem = BattleItems[zCrystalId];
		buf += `<div style="margin-bottom:4px"><strong>Z-Crystal:</strong> ${pokemon.zmove.zCrystal} `;
		if (zCrystalItem) {
			buf += `<span class="itemicon" style="${getItemIcon(zCrystalItem)};width:32px;height:32px;margin-left:4px;display:inline-block;vertical-align:middle"></span>`;
		}
		buf += `</div>`;
		
		// Base Move as a short text link (no button)
		var baseMoveId = toID(pokemon.zmove.baseMove);
		var baseMoveData = BattleMovedex[baseMoveId];
		buf += `<div style="margin-bottom:4px"><strong>Base Move:</strong> `;
		if (baseMoveData) {
			buf += `<a href="${Config.baseurl}moves/${baseMoveId}" data-target="push">${baseMoveData.name}</a>`;
		} else {
			buf += `${pokemon.zmove.baseMove}`;
		}
		buf += `</div>`;
		
		// Z-Move as a short text link (no button)
		var zMoveId = toID(pokemon.zmove.zMove);
		var zMoveData = BattleMovedex[zMoveId];
		buf += `<div style="margin-bottom:4px"><strong>Z-Move:</strong> `;
		if (zMoveData) {
			buf += `<a href="${Config.baseurl}moves/${zMoveId}" data-target="push">${zMoveData.name}</a>`;
		} else {
			buf += `${pokemon.zmove.zMove}`;
		}
		buf += `</div>`;
	} else {
		buf += '<em>No Z-Move</em>';
	}
	buf += '</dd>';

	{
		buf += '<dt>Evolution:</dt> <dd>';
		
		// Helper function to find all pre-evolutions (reverse lookup in BattleEvolutions)
		const findPreEvos = (pokemonId) => {
			const preEvos = [];
			for (const sourceId in BattleEvolutions) {
				const evos = BattleEvolutions[sourceId];
				for (const evo of evos) {
					if (toID(evo.target) === pokemonId) {
						preEvos.push({ sourceId, evo });
					}
				}
			}
			return preEvos;
		};
		
		// Find all roots of the evolution tree by following pre-evos recursively
		const MAX_EVOLUTION_DEPTH = 100; // Maximum depth to prevent infinite loops
		const findAllRoots = (pokemonId, visited) => {
			// Use a visited set to guard against potential cycles or excessively deep chains
			if (!visited) visited = new Set();
			if (visited.has(pokemonId) || visited.size > MAX_EVOLUTION_DEPTH) {
				// Cycle detected or depth limit reached; return empty to avoid infinite loops
				return [];
			}
			visited.add(pokemonId);

			const preEvos = findPreEvos(pokemonId);
			if (preEvos.length === 0) {
				return [pokemonId]; // This is a root
			}
			// Recursively find all roots from all pre-evolutions
			const allRoots = [];
			for (const preEvo of preEvos) {
				const roots = findAllRoots(preEvo.sourceId, visited);
				allRoots.push(...roots);
			}
			return allRoots;
		};
		
		// Helper to build a single evolution path starting from a root
		const buildEvolutionPath = (startId) => {
			const path = [];
			let currentStage = [getID(BattlePokedex, startId)].filter(Boolean);
			
			while (currentStage.length > 0) {
				path.push(currentStage);
				const nextStage = [];
				const seenIds = new Set(); // Use Set for O(1) duplicate detection
				for (const pokemon of currentStage) {
					const evos = BattleEvolutions[pokemon.id] || [];
					for (const evo of evos) {
						const target = getID(BattlePokedex, evo.target);
						if (target && !seenIds.has(target.id)) {
							seenIds.add(target.id);
							nextStage.push(target);
						}
					}
				}
				currentStage = nextStage;
			}
			return path;
		};
		
		// Start from all roots of the evolution tree
		const rootIds = findAllRoots(this.id);
		const uniqueRootIds = [...new Set(rootIds)];
		
		// Check if this Pokemon has any evolutions or pre-evolutions
		const hasEvolutions = BattleEvolutions[this.id] && BattleEvolutions[this.id].length > 0;
		const hasPreEvolutions = findPreEvos(this.id).length > 0;
		
		if (hasEvolutions || hasPreEvolutions) {
			// Build evolution tree for each root
			for (let rootIdx = 0; rootIdx < uniqueRootIds.length; rootIdx++) {
				const rootId = uniqueRootIds[rootIdx];
				const evolutionPath = buildEvolutionPath(rootId);
				
				if (rootIdx > 0) {
					buf += '<div style="margin-top: 5px;"></div>'; // Add spacing between trees
				}
				
				buf += '<table class="evos"><tr><td>';
				for (let stageIdx = 0; stageIdx < evolutionPath.length; stageIdx++) {
					const stage = evolutionPath[stageIdx];
					for (let i = 0; i < stage.length; i++) {
						const template = stage[i];
						const name = (template.forme ? template.baseSpecies+`<small>-${template.forme}</small>` : template.name);
						const fullName = `<span class="picon" style="${getPokemonIcon(template)}"></span>`+name;
						if (template.id === this.id) {
							buf += `<div><strong>${fullName}</strong></div>`;
						} else {
							buf += `<div><a href="${Config.baseurl}pokemon/${template.id}" data-target="replace">${fullName}</a></div>`;
						}
					}
					if (stageIdx < evolutionPath.length - 1) {
						buf += '</td><td class="arrow"><span>&rarr;</span></td><td>';
					}
				}
				buf += '</td></tr></table>';
			}

			// Show evolution methods from pre-evos
			const preEvosList = findPreEvos(this.id);
			for (let preEvoInfo of preEvosList) {
				const prevoMon = getID(BattlePokedex, preEvoInfo.sourceId);
				if (prevoMon) {
					buf += `<div><small>Evolves from ${prevoMon.name} (${this.getEvoMethod(preEvoInfo.evo)})</small></div>`;
				}
			}

			// Show evolution methods to evos
			const currentEvos = BattleEvolutions[this.id] || [];
			for (let evo of currentEvos) {
				const evoMon = getID(BattlePokedex, evo.target);
				if (evoMon) {
					buf += `<div><small>Evolves into ${evoMon.name} (${this.getEvoMethod(evo)})</small></div>`;
				}
			}

		} else {
			buf += '<em>Does not evolve</em>';
		}
		
		// Add mega evolution section
		const megaEvos = MegaEvolutions[this.id] || [];
		if (megaEvos.length > 0) {
			buf += '</dd><dt>Mega Evolution:</dt> <dd>';
			for (let megaEvo of megaEvos) {
				const megaFormeId = toID(megaEvo.forme);
				const megaFormePokemon = getID(BattlePokedex, megaFormeId);
				if (megaFormePokemon) {
					const formeName = megaFormePokemon.forme || megaEvo.forme;
					buf += `<div><span class="picon" style="${getPokemonIcon(megaFormePokemon)}"></span>`;
					buf += `<a href="${Config.baseurl}pokemon/${megaFormeId}" data-target="replace">${formeName}</a>`;
					buf += ` <small>(requires ${megaEvo.item})</small></div>`;
				}
			}
		}
	}

		if (pokemon.formes) {
			buf += '</dd><dt>Formes:</dt> <dd>';
			var otherFormes = pokemon.formes;
			var template; // Declare template variable to avoid reference error
			for (var i = 0; i < otherFormes.length; i++) {
				template = getID(BattlePokedex, otherFormes[i]);
				if (!template) continue;
				var name = template.forme || 'Base';
				name = `<span class="picon" style="${getPokemonIcon(template)}"></span>` + name;
				if (i > 0) buf += ', '
				if (template === pokemon) {
					buf += `<strong>${name}</strong>`;
				} else {
					buf += `<a href="${Config.baseurl}pokemon/${template.id}" data-target="replace">${name}</a>`;
				}
			}
			if (pokemon.requiredItem && template) { // Check if template exists before accessing its properties
				buf += `<div><small>Must hold <a href="${Config.baseurl}items/${toID(template.requiredItem)}" data-target="push">${template.requiredItem}</a></small></div>`;
			}
		}
		if (pokemon.cosmeticFormes) {
			buf += '</dd><dt>Cosmetic formes:</dt> <dd>';
			name = `<span class="picon" style="${getPokemonIcon(pokemon)}"></span>` + pokemon.name;
			buf += ''+name;

			for (var i = 0; i < pokemon.cosmeticFormes.length; i++) {
				name = `<span class="picon" style="${getPokemonIcon(pokemon.name + '-' + pokemon.cosmeticFormes[i])}"></span>` + pokemon.cosmeticFormes[i];
				buf += "," + name ;
			}
		}
		buf += '</dd></dl>';

		if (pokemon.eggGroups) {
			buf += '<dl class="colentry"><dt>Egg groups:</dt><dd><span class="picon" style="margin-top:-12px;'+getPokemonIcon('egg')+`"></span><a href="${Config.baseurl}egggroups/`+pokemon.eggGroups.map(toID).join('+')+'" data-target="push">'+pokemon.eggGroups.join(', ')+'</a></dd></dl>';
			buf += '<dl class="colentry"><dt>Gender ratio:</dt><dd>';
			if (pokemon.gender) switch (pokemon.gender) {
			case 'M':
				buf += '100% male';
				break;
			case 'F':
				buf += '100% female';
				break;
			case 'N':
				buf += '100% genderless';
				break;
			} else if (pokemon.genderRatio) {
				buf += `${(pokemon.genderRatio.M*100)}% male, ${(pokemon.genderRatio.F*100)}% female`;
			} else {
				buf += '50% male, 50% female';
			}
		buf += '</dd></dl>';
		buf += '<div style="clear:left"></div>';
	}

	// Related items - items that mention this Pokémon's name
	var relatedItemIds = ItemPokemonLinks.pokemonToItems[this.id] || [];
	if (relatedItemIds.length > 0) {
		var relatedItems = relatedItemIds.map(function(itemId) {
			return BattleItems[itemId];
		}).filter(Boolean);
		
		buf += '<dl class="colentry"><dt>Related item(s):</dt><dd>';
		for (var i = 0; i < relatedItems.length; i++) {
			if (i > 0) buf += ', ';
			var relItem = relatedItems[i];
			buf += `<span class="itemicon" style="${getItemIcon(relItem)};width:32px;height:32px"></span><a href="${Config.baseurl}items/${relItem.id}" data-target="push">${relItem.name}</a>`;
		}
		buf += '</dd></dl>';
		buf += '<div style="clear:left"></div>';
	}

		// learnset
		buf += '<ul class="tabbar"><li><button class="button nav-first cur" value="learnset">Learnset</button></li><li><button class="button nav-last" value="compare">Compare Moves</button></li></ul>';
		buf += '<ul class="utilichart nokbd">';
		buf += '<li class="resultheader"><h3>Level-up</h3></li>';
		buf += '</ul>';
		
		// Pre-evo only moves section placeholder
		buf += '<ul class="utilichart nokbd prevo-moves" style="display:none">';
		buf += '<li class="resultheader"><h3>Pre-evo only moves</h3></li>';
		buf += '</ul>';
		
		// Compare Moves section placeholder (hidden until tab selected)
		buf += '<div class="compare-moves" style="display:none"></div>';
		
		buf += '</div>';		this.html(buf);
		setTimeout(this.renderFullLearnset.bind(this));
	},
	events: {
		'click .tabbar button': 'selectTab',
		'input input[name=level]': 'updateLevel',
		'keyup input[name=level]': 'updateLevel',
		'change input[name=level]': 'updateLevel',
	},
	updateLevel: function(e) {
		var val = this.$('input[name=level]').val();
		var level = val === '' ? 100 : parseInt(val, 10);
		var lowIV = 31, highIV = 31;
		var lowEV = 0, highEV = 255;
		if (val.slice(-1) === ':') {
			lowIV = 0;
			highEV = 0;
		}
		var i = 0;
		var $entries = this.$('table.stats td.ministat small');
		var pokemon = getID(BattlePokedex, this.id);
		for (var stat in BattleStatNames) {
			var baseStat = pokemon.baseStats[stat];

			$entries.eq(4 * i + 0).text(stat==='hp'?'':this.getStat(baseStat, false, level, 0, 0, 0.9));
			$entries.eq(4 * i + 1).text(this.getStat(baseStat, stat==='hp', level, lowIV, lowEV, 1.0));
			$entries.eq(4 * i + 2).text(this.getStat(baseStat, stat==='hp', level, highIV, highEV, 1.0));
			$entries.eq(4 * i + 3).text(stat==='hp'?'':this.getStat(baseStat, false, level, highIV, highEV, 1.1));
			i++;
		}
	},
	getEvoMethod: function(evo) {
		switch (evo.condition) {
		case undefined:
			if (evo.level) {
				return 'level ' + evo.level;
			}
			if (evo.item) {
				return 'use ' + evo.item;
			}
			return 'unknown'
		case 'trade':
			return 'When traded';
		case 'friendship':
			return 'High Friendship';
		default:
			return evo.condition;
		}
	},
	selectTab: function(e) {
		this.$('.tabbar button').removeClass('cur');
		$(e.currentTarget).addClass('cur');
		switch (e.currentTarget.value) {
		case 'learnset':
			this.$('.utilichart, .prevo-moves').show();
			this.$('.compare-moves').hide();
			this.renderFullLearnset();
			break;
		case 'compare':
			this.$('.utilichart, .prevo-moves').hide();
			this.$('.compare-moves').show();
			this.renderCompareMoves();
			break;
		case 'move':
			this.renderFullLearnset();
			break;
		case 'details':
			//this.renderDetails();
			break;
		case 'events':
			//this.renderEvents();
			break;
		}
	},
	renderFullLearnset: function() {
		var pokemon = getID(BattlePokedex, this.id);
		var learnset = getLearnset(this.id);
		var last;
		var buf = "", desc = "";
		for (let learn of learnset) {
			// Normalize move name or id to canonical BattleMovedex entry
			let move = getID(BattleMovedex, learn.move);
			if (!move) {
				// If still not found, fall back to showing a placeholder without the noisy error prefix
				buf += `<li class="result"><span class="col tagcol"></span> <span class="col shortmovenamecol">${escapeHTML(learn.move)}</span> <span class="col typecol">&mdash;</span> <span class="col labelcol"></span> <span class="col widelabelcol"></span> <span class="col pplabelcol"></span> <span class="col movedesccol"><em>Unknown move</em></span></li>`;
				continue;
			} 
			var newCategory = last == undefined || last.how != learn.how;
			switch(learn.how) {
				case 'lvl': // level-up move
					if (newCategory) buf += '<li class="resultheader"><h3>Level-up</h3></li>';
					let level = learn.level
					if (level === 0) {
						desc = 'Evo';
					} else {
						desc = level <= 1 ? '&ndash;' : '<small>L</small>' + level;
					}
					break;
			case 'prevo': // prevo
				if (newCategory) buf += '<li class="resultheader"><h3>From preevo</h3></li>';
				desc = ""
				break;
			case 'tm': // tm/hm
				if (newCategory) buf += '<li class="resultheader"><h3>TM/HM</h3></li>';
				desc = `<span class="itemicon" style="margin-top:-3px;background:transparent url(${ResourcePrefix}sprites/itemicons-sheet.png) no-repeat scroll -133px -364px;width:32px;height:32px;display:inline-block"></span>`;
				break;
			case 'tutor': // tutor
				if (newCategory) buf += '<li class="resultheader"><h3>Tutor</h3></li>';
				desc = `<img src="${ResourcePrefix}sprites/tutor.png" style="margin-top:-4px;opacity:.7" width="27" height="26" alt="T" />`;
				break;
				case 'egg': // egg move
					if (newCategory) buf += '<li class="resultheader"><h3>Egg</h3></li>';
					desc = '<span class="picon" style="margin-top:-12px;'+getPokemonIcon('egg')+'"></span>';
					break;
			}
			last = learn;
			var moveRow = BattleSearch.renderTaggedMoveRow(move, desc);
			
			// Make move name bold if it's not a Status move and matches Pokémon's types
			if (move.category !== 'Status' && pokemon && pokemon.types && pokemon.types.length > 0) {
				var moveTypeId = toID(move.type);
				var hasMatchingType = pokemon.types.some(function(t) { return toID(t) === moveTypeId; });
				if (hasMatchingType) {
					// Wrap the move name in <b> tags with black color and no underline to override link styles
					moveRow = moveRow.replace(
						/<span class="col shortmovenamecol">([^<]*)<\/span>/,
						'<span class="col shortmovenamecol"><b style="color:#000;text-decoration:none">$1</b></span>'
					);
				}
			}
			
			buf += moveRow;
		}
		this.$('.utilichart').html(buf);
		
		// Render pre-evo only moves
		this.renderPreEvoMoves();
	},
	renderPreEvoMoves: function() {
		var pokemon = getID(BattlePokedex, this.id);
		if (!pokemon) return;
		
		// Use the prevo field set up in data.js
		var prevoId = pokemon.prevo;
		
		if (!prevoId) {
			// No pre-evo, hide the section
			this.$('.prevo-moves').hide();
			return;
		}
		
		// Get both learnsets
		var prevoLearnset = getLearnset(prevoId);
		var currentLearnset = getLearnset(this.id);
		
		// Build set of moves the current Pokémon can learn
		var currentMoves = new Set();
		for (var learn of currentLearnset) {
			var moveId = toID(learn.move);
			currentMoves.add(moveId);
		}
		
		// Find moves only in pre-evo (level-up, tm, tutor)
		var prevoOnlyMoves = [];
		for (var learn of prevoLearnset) {
			if (learn.how === 'egg') continue; // Skip egg moves
			var moveId = toID(learn.move);
			if (!currentMoves.has(moveId)) {
				prevoOnlyMoves.push(learn);
			}
		}
		
		if (prevoOnlyMoves.length === 0) {
			this.$('.prevo-moves').hide();
			return;
		}
		
		// Render the pre-evo only moves
		var buf = '<li class="resultheader"><h3>Pre-evo only moves</h3></li>';
		var last = null;
		for (var learn of prevoOnlyMoves) {
			var move = getID(BattleMovedex, learn.move);
			if (!move) continue;
			
			var desc = "";
			var newCategory = last == null || last.how != learn.how;
			switch(learn.how) {
				case 'lvl': // level-up move
					if (newCategory) buf += '<li class="resultheader"><h3>Level-up</h3></li>';
					var level = learn.level;
					if (level === 0) {
						desc = 'Evo';
					} else {
						desc = level <= 1 ? '&ndash;' : '<small>L</small>' + level;
					}
					break;
				case 'tm': // tm/hm
					if (newCategory) buf += '<li class="resultheader"><h3>TM/HM</h3></li>';
					desc = `<span class="itemicon" style="margin-top:-3px;background:transparent url(${ResourcePrefix}sprites/itemicons-sheet.png) no-repeat scroll -133px -364px;width:32px;height:32px;display:inline-block"></span>`;
					break;
				case 'tutor': // tutor
					if (newCategory) buf += '<li class="resultheader"><h3>Tutor</h3></li>';
					desc = `<img src="${ResourcePrefix}sprites/tutor.png" style="margin-top:-4px;opacity:.7" width="27" height="26" alt="T" />`;
					break;
			}
			last = learn;
			buf += BattleSearch.renderTaggedMoveRow(move, desc);
		}
		
		this.$('.prevo-moves').html(buf).show();
	},
	renderCompareMoves: function() {
		var binaryStarLearnset = getLearnset(this.id) || [];
		var baseGameMoves = (window.BaseGameLearnsets && window.BaseGameLearnsets[this.id]) || [];

		// Build sets of move IDs for quick lookup
		var binaryStarMoveIds = new Set();
		for (var learn of binaryStarLearnset) {
			binaryStarMoveIds.add(toID(learn.move));
		}
		var baseGameMoveIds = new Set(baseGameMoves.map(function(m) { return toID(m); }));

		// Also include base game moves from pre-evolutions so that evolution-inherited
		// moves are not incorrectly flagged as "new" to Binary Star.
		var visited = new Set([this.id]);
		var prevoChainId = (getID(BattlePokedexEdit, this.id) || {}).prevo;
		while (prevoChainId && !visited.has(prevoChainId)) {
			visited.add(prevoChainId);
			var prevoBaseMoves = (window.BaseGameLearnsets && window.BaseGameLearnsets[prevoChainId]) || [];
			for (var pm of prevoBaseMoves) {
				baseGameMoveIds.add(toID(pm));
			}
			prevoChainId = (BattlePokedexEdit[prevoChainId] || {}).prevo;
		}

		// Moves new to Binary Star: in Binary Star but NOT in base game, with data
		// Unknown moves: in Binary Star learnset but have no BattleMovedex entry
		var newMoves = [];
		var unknownMoves = [];
		for (var learn of binaryStarLearnset) {
			var moveId = toID(learn.move);
			if (!getID(BattleMovedex, learn.move)) {
				unknownMoves.push(learn);
				continue;
			}
			if (!baseGameMoveIds.has(moveId)) {
				newMoves.push(learn);
			}
		}

		// Removed moves: in base game but NOT in Binary Star
		var removedMoveIds = [];
		for (var moveId of baseGameMoveIds) {
			if (!binaryStarMoveIds.has(moveId)) {
				removedMoveIds.push(moveId);
			}
		}
		removedMoveIds.sort();

		var buf = '';

		// Helper to generate learn method descriptor
		var getLearnDesc = function(learn) {
			switch (learn.how) {
			case 'lvl':
				if (learn.level === 0) return 'Evo';
				return learn.level <= 1 ? '&ndash;' : '<small>L</small>' + learn.level;
			case 'tm':
				return `<span class="itemicon" style="margin-top:-3px;background:transparent url(${ResourcePrefix}sprites/itemicons-sheet.png) no-repeat scroll -133px -364px;width:32px;height:32px;display:inline-block"></span>`;
			case 'tutor':
				return `<img src="${ResourcePrefix}sprites/tutor.png" style="margin-top:-4px;opacity:.7" width="27" height="26" alt="T" />`;
			case 'egg':
				return '<span class="picon" style="margin-top:-12px;' + getPokemonIcon('egg') + '"></span>';
			default:
				return '';
			}
		};

		// Section: Moves New to Binary Star
		buf += '<ul class="utilichart nokbd">';
		buf += '<li class="resultheader"><h3>Moves New to Binary Star</h3></li>';
		if (newMoves.length > 0) {
			for (var learn of newMoves) {
				var move = getID(BattleMovedex, learn.move);
				buf += BattleSearch.renderTaggedMoveRow(move, getLearnDesc(learn));
			}
		} else {
			buf += '<li class="result"><span class="col movedesccol" style="padding:6px 8px"><em>None</em></span></li>';
		}
		buf += '</ul>';

		// Section: Removed Moves
		buf += '<ul class="utilichart nokbd">';
		buf += '<li class="resultheader"><h3>Removed Moves</h3></li>';
		if (removedMoveIds.length > 0) {
			for (var removedId of removedMoveIds) {
				var move = getID(BattleMovedex, removedId);
				if (move) {
					buf += BattleSearch.renderTaggedMoveRow(move, '');
				} else {
					buf += `<li class="result"><span class="col tagcol"></span> <span class="col shortmovenamecol">${escapeHTML(removedId)}</span> <span class="col typecol">&mdash;</span> <span class="col labelcol"></span> <span class="col widelabelcol"></span> <span class="col pplabelcol"></span> <span class="col movedesccol"><em>Not in Binary Star</em></span></li>`;
				}
			}
		} else {
			buf += '<li class="result"><span class="col movedesccol" style="padding:6px 8px"><em>None</em></span></li>';
		}
		buf += '</ul>';

		// Section: Moves not in Binary Star (moves in learnset with no move data)
		if (unknownMoves.length > 0) {
			buf += '<ul class="utilichart nokbd">';
			buf += '<li class="resultheader"><h3>Moves not in Binary Star</h3></li>';
			for (var learn of unknownMoves) {
				buf += `<li class="result"><span class="col tagcol">${getLearnDesc(learn)}</span> <span class="col shortmovenamecol">${escapeHTML(learn.move)}</span> <span class="col typecol">&mdash;</span> <span class="col labelcol"></span> <span class="col widelabelcol"></span> <span class="col pplabelcol"></span> <span class="col movedesccol"><em>Not in Binary Star</em></span></li>`;
			}
			buf += '</ul>';
		}

		this.$('.compare-moves').html(buf);
	},
	getStat: function(baseStat, isHP, level, iv, ev, natureMult) {
		if (isHP) {
			if (baseStat === 1) return 1;
			return Math.floor(Math.floor(2*baseStat+(iv||0)+Math.floor((ev||0)/4)+100)*level / 100 + 10);
		}
		var val = Math.floor(Math.floor(2*baseStat+(iv||0)+Math.floor((ev||0)/4))*level / 100 + 5);
		if (natureMult && !isHP) val *= natureMult;
		return Math.floor(val);
	}
});
