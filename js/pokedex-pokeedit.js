window.PokedexPokeeditPanel = PokedexResultPanel.extend({
	initialize: function(id) {
		// Translate display names (e.g., "Charizard 1" -> "Charizard-Mega-X") before converting to ID
		id = translateDisplayName(id);
		id = toID(id);
		var pokemon = BattlePokedexEdit[id]
		this.id = id;
		this.shortTitle = pokemon.baseSpecies || pokemon.name;

		var buf = '<div class="pfx-body dexentry">';

		buf += `<a href="${Config.baseurl}dex" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Pok&eacute;edit</a>`;
		buf += '<div style="float:right; margin-top: 10px;"><button class="button save-pokemon" style="font-size:14px; padding:8px 16px;"><strong>Save Changes</strong></button></div>';
		buf += '<h1>';
		if (pokemon.forme) {
			buf += `<a href="${Config.baseurl}pokeedit/${id}" data-target="push" class="subtle">${pokemon.baseSpecies}<small>-${pokemon.forme}</small></a>`;
		} else {
			buf += `<a href="${Config.baseurl}pokeedit/${id}" data-target="push" class="subtle">${pokemon.name}</a>`;
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
			buf += `<a href="#" class="type ${toID(pokemon.types[i])} edit-type" data-slot="${i}" style="cursor:pointer;">${pokemon.types[i]}</a> `;
		}
		// Add button to add a second type if only one type exists
		if (pokemon.types.length === 1) {
			buf += `<button class="button add-type" style="font-size:11px;padding:2px 8px;margin-left:8px;">+ Add Type</button>`;
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
			var abilityText = (i === 'H') ? `<em>${pokemon.abilities[i]}</em>` : pokemon.abilities[i];
			buf += `<a href="#" class="edit-ability" data-slot="${i}" style="cursor:pointer;text-decoration:underline;">${abilityText}</a>`;
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
			buf += `<tr><th>${StatTitles[stat]}:</th><td class="stat"><input type="number" class="stat-input textbox" data-stat="${stat}" value="${baseStat}" min="1" max="255" style="width:50px;" /></td>`;
			buf += `<td class="statbar"><span class="statbar-fill" data-stat="${stat}" style="width:${Math.floor(width)}px;background:hsl(${color},85%,45%);border-color:hsl(${color},75%,35%)"></span></td>`;
			buf += '<td class="ministat"><small>'+(stat==='hp'?'':this.getStat(baseStat, false, 100, 0, 0, 0.9))+'</small></td><td class="ministat"><small>'+this.getStat(baseStat, stat==='hp', 100, 31, 0, 1.0)+'</small></td>';
			buf += '<td class="ministat"><small>'+this.getStat(baseStat, stat==='hp', 100, 31, 255, 1.0)+'</small></td><td class="ministat"><small>'+(stat==='hp'?'':this.getStat(baseStat, false, 100, 31, 255, 1.1))+'</small></td></tr>';
		}
		buf += `<tr><th class="bst">Total:</th><td class="bst bst-total">${bst}</td><td></td><td class="ministat" colspan="4">at level <input type="text" class="textbox" name="level" placeholder="100" size="5" /></td>`;

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
		var template = pokemon;
		while (template.prevo) template = getID(BattlePokedex, template.prevo);
			if (template.evos) {
				buf += '<table class="evos"><tr><td>';
				var evos = [template];
				while (evos.length > 0) {
					var nextEvos = [];
					for (var i=0; i<evos.length; i++) {
						template = evos[i];
						var name = (template.forme ? template.baseSpecies+`<small>-${template.forme}</small>` : template.name);
						name = `<span class="picon" style="${getPokemonIcon(template)}"></span>`+name;
						if (template === pokemon) {
							buf += `<div><strong>${name}</strong></div>`;
						} else {
							buf += `<div><a href="${Config.baseurl}pokeedit/${template.id}" data-target="replace">${name}</a></div>`;
						}
						for (let evo of template.evos ?? []) {
							if (!nextEvos.find((e) => e.target == evo.target)) {
								nextEvos.push(evo);
							}
						}
					}
					evos = nextEvos.map((evo) => getID(BattlePokedex, evo.target));
					if (evos.length > 0)
						buf += '</td><td class="arrow"><span>&rarr;</span></td><td>';
				}
				buf += '</td></tr></table>';

				if (pokemon.prevo) {
					let prevo = getID(BattlePokedex, pokemon.prevo)
					let evos_from_prevo = prevo.evos.filter(evo => toID(evo.target) == pokemon.id);
					for (let evo of evos_from_prevo) {
						buf += `<div><small>Evolves from ${  getID(BattlePokedex, pokemon.prevo).name  } (${  this.getEvoMethod(evo)  })</small></div>`;
					}
				}

				let a = []
				if (pokemon.evos) {
					for (let evo of pokemon.evos) {
						buf += `<div><small>Evolves into ${  getID(BattlePokedex, evo.target).name  } (${  this.getEvoMethod(evo)  })</small></div>`;
					}
				}

			} else {
				buf += '<em>Does not evolve</em>';
			}
		}

		if (pokemon.formes) {
			buf += '</dd><dt>Formes:</dt> <dd>';
			var otherFormes = pokemon.formes;
			for (var i = 0; i < otherFormes.length; i++) {
				template = getID(BattlePokedex, otherFormes[i]);
				if (!template) continue;
				var name = template.forme || 'Base';
				name = `<span class="picon" style="${getPokemonIcon(template)}"></span>` + name;
				if (i > 0) buf += ', '
				if (template === pokemon) {
					buf += `<strong>${name}</strong>`;
				} else {
					buf += `<a href="${Config.baseurl}pokeedit/${template.id}" data-target="replace">${name}</a>`;
				}
			}
			if (pokemon.requiredItem) {
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
		buf += '<ul class="utilichart nokbd">';
		buf += '<li class="resultheader"><h3>Level-up</h3></li>';
		buf += '</ul>';
		
		// Pre-evo only moves section placeholder
		buf += '<ul class="utilichart nokbd prevo-moves" style="display:none">';
		buf += '<li class="resultheader"><h3>Pre-evo only moves</h3></li>';
		buf += '</ul>';
		
		buf += '</div>';		this.html(buf);
		setTimeout(this.renderFullLearnset.bind(this));
	},
	events: {
		'click .tabbar button': 'selectTab',
		'input input[name=level]': 'updateLevel',
		'keyup input[name=level]': 'updateLevel',
		'change input[name=level]': 'updateLevel',
		'click .save-pokemon': 'savePokemon',
		'click .edit-ability': 'editAbility',
		'click .edit-move': 'editMove',
		'click .add-move': 'addMove',
		'click .remove-move': 'removeMove',
		'change .move-level-input': 'updateMoveLevel',
		'click .move-level-input': 'preventMoveLevelClick',
		'change .stat-input': 'updateStat',
		'click .edit-type': 'editType',
		'click .add-type': 'addType',
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
		var pokemon = getID(BattlePokedexEdit, this.id);
		var learnset = getLearnsetEdit(this.id);
		var last;
		var buf = "", desc = "";
		var moveIndex = 0;
		for (let learn of learnset) {
			// Normalize move name or id to canonical BattleMovedex entry
			let move = getID(BattleMovedex, learn.move);
			if (!move) {
				// If still not found, fall back to showing a placeholder without the noisy error prefix
				buf += `<li class="result"><span class="col tagcol"></span> <span class="col shortmovenamecol">${escapeHTML(learn.move)}</span> <span class="col typecol">&mdash;</span> <span class="col labelcol"></span> <span class="col widelabelcol"></span> <span class="col pplabelcol"></span> <span class="col movedesccol"><em>Unknown move</em></span></li>`;
				moveIndex++;
				continue;
			} 
			var newCategory = last == undefined || last.how != learn.how;
			switch(learn.how) {
				case 'lvl': // level-up move - make editable
					if (newCategory) {
						buf += '<li class="resultheader"><h3>Level-up <button class="button add-move" style="font-size:11px;padding:2px 8px;margin-left:10px;">+ Add Move</button></h3></li>';
					}
					let level = learn.level;
					// Just the level input in the tag column, no × button here
					if (level === 0) {
						desc = '<input type="text" class="move-level-input textbox" data-index="' + moveIndex + '" value="0" size="3" style="width:40px;text-align:center;" />';
					} else {
						desc = '<input type="text" class="move-level-input textbox" data-index="' + moveIndex + '" value="' + level + '" size="3" style="width:40px;text-align:center;" />';
					}
					break;
			case 'prevo': // prevo
				if (newCategory) buf += '<li class="resultheader"><h3>From preevo</h3></li>';
				desc = "";
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
			// For level-up moves, make them clickable but with custom structure
			if (learn.how === 'lvl') {
				var moveRow = BattleSearch.renderTaggedMoveRow(move, desc);
				// Add edit-move class and data-index to the link
				moveRow = moveRow.replace('<a href=', '<a class="edit-move" data-index="' + moveIndex + '" href="#" data-original-href=');
				// Remove the closing </a></li> and add × button on the right, then close
				moveRow = moveRow.replace('</a></li>', '</a> <button class="button remove-move" data-index="' + moveIndex + '" style="font-size:11px;padding:2px 6px;margin-left:8px;float:right;">×</button></li>');
				buf += moveRow;
			} else {
				buf += BattleSearch.renderTaggedMoveRow(move, desc);
			}
			moveIndex++;
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
		var prevoLearnset = getLearnsetEdit(prevoId);
		var currentLearnset = getLearnsetEdit(this.id);
		
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
	getStat: function(baseStat, isHP, level, iv, ev, natureMult) {
		if (isHP) {
			if (baseStat === 1) return 1;
			return Math.floor(Math.floor(2*baseStat+(iv||0)+Math.floor((ev||0)/4)+100)*level / 100 + 10);
		}
		var val = Math.floor(Math.floor(2*baseStat+(iv||0)+Math.floor((ev||0)/4))*level / 100 + 5);
		if (natureMult && !isHP) val *= natureMult;
		return Math.floor(val);
	},
	savePokemon: function(e) {
		e.preventDefault();
		var pokemon = BattlePokedexEdit[this.id];
		var learnset = LearnsetsEdit[this.id];
		
		// Show saving indicator
		var $btn = this.$('.save-pokemon');
		var originalText = $btn.html();
		$btn.html('Saving...').prop('disabled', true);
		
		try {
			// Update the global objects with current edits
			BattlePokedexEdit[this.id] = pokemon;
			LearnsetsEdit[this.id] = learnset;
			
			// Create download links for both JSON files
			var pokedexJson = JSON.stringify(BattlePokedexEdit, null, 2);
			var learnsetsJson = JSON.stringify(LearnsetsEdit, null, 2);
			
			// Download pokedex-edit.json
			var pokedexBlob = new Blob([pokedexJson], { type: 'application/json' });
			var pokedexUrl = URL.createObjectURL(pokedexBlob);
			var pokedexLink = document.createElement('a');
			pokedexLink.href = pokedexUrl;
			pokedexLink.download = 'pokedex-edit.json';
			document.body.appendChild(pokedexLink);
			pokedexLink.click();
			document.body.removeChild(pokedexLink);
			URL.revokeObjectURL(pokedexUrl);
			
			// Download learnsets-edit.json
			var learnsetsBlob = new Blob([learnsetsJson], { type: 'application/json' });
			var learnsetsUrl = URL.createObjectURL(learnsetsBlob);
			var learnsetsLink = document.createElement('a');
			learnsetsLink.href = learnsetsUrl;
			learnsetsLink.download = 'learnsets-edit.json';
			document.body.appendChild(learnsetsLink);
			learnsetsLink.click();
			document.body.removeChild(learnsetsLink);
			URL.revokeObjectURL(learnsetsUrl);
			
			// Show success
			$btn.html('<span style="color:green;">✓ Files Downloaded!</span>');
			setTimeout(function() {
				$btn.html(originalText).prop('disabled', false);
			}, 2000);
			
		} catch(err) {
			$btn.html('<span style="color:red;">Error saving</span>');
			setTimeout(function() {
				$btn.html(originalText).prop('disabled', false);
			}, 2000);
			console.error('Save error:', err);
		}
	},
	editAbility: function(e) {
		e.preventDefault();
		var slot = $(e.currentTarget).data('slot');
		var pokemon = BattlePokedexEdit[this.id];
		var currentAbility = pokemon.abilities[slot];
		
		// Show a prompt for now - in future could be a fancy search dialog
		var newAbility = prompt('Enter new ability name:', currentAbility);
		if (newAbility && newAbility.trim()) {
			// Verify ability exists
			var abilityObj = getID(BattleAbilities, newAbility);
			if (abilityObj) {
				pokemon.abilities[slot] = abilityObj.name;
				// Update display
				var displayText = (slot === 'H') ? `<em>${abilityObj.name}</em>` : abilityObj.name;
				$(e.currentTarget).html(displayText);
			} else {
				alert('Ability "' + newAbility + '" not found. Please check the spelling.');
			}
		}
	},
	editMove: function(e) {
		e.preventDefault();
		var index = parseInt($(e.currentTarget).data('index'));
		var learnset = LearnsetsEdit[this.id];
		var currentMove = learnset[index];
		
		// Show a prompt for now - in future could be a fancy search dialog
		var newMove = prompt('Enter new move name:', currentMove.move);
		if (newMove && newMove.trim()) {
			// Verify move exists
			var moveObj = getID(BattleMovedex, newMove);
			if (moveObj) {
				currentMove.move = moveObj.name;
				// Re-render the learnset
				this.renderFullLearnset();
			} else {
				alert('Move "' + newMove + '" not found. Please check the spelling.');
			}
		}
	},
	updateMoveLevel: function(e) {
		var index = parseInt($(e.currentTarget).data('index'));
		var newLevel = parseInt($(e.currentTarget).val());
		var learnset = LearnsetsEdit[this.id];
		
		if (!isNaN(newLevel) && newLevel >= 0) {
			learnset[index].level = newLevel;
			
			// Sort the learnset by level
			learnset.sort(function(a, b) {
				// Group by 'how' first to keep level-up moves together
				if (a.how !== b.how) {
					var order = {'lvl': 0, 'prevo': 1, 'tm': 2, 'tutor': 3, 'egg': 4};
					return (order[a.how] || 5) - (order[b.how] || 5);
				}
				// Within level-up moves, sort by level
				if (a.how === 'lvl' && b.how === 'lvl') {
					return a.level - b.level;
				}
				return 0;
			});
			
			// Re-render to show the sorted list
			this.renderFullLearnset();
		}
	},
	preventMoveLevelClick: function(e) {
		// Prevent the edit-move dialog from opening when clicking on level input
		e.stopPropagation();
	},
	addMove: function(e) {
		e.preventDefault();
		var learnset = LearnsetsEdit[this.id];
		
		// Prompt for move name
		var moveName = prompt('Enter move name to add:');
		if (moveName && moveName.trim()) {
			var moveObj = getID(BattleMovedex, moveName);
			if (moveObj) {
				var level = prompt('Enter learn level (0 for evolution):', '1');
				var levelNum = parseInt(level);
				if (!isNaN(levelNum)) {
					// Add new move to learnset
					learnset.push({
						move: moveObj.name,
						how: 'lvl',
						level: levelNum
					});
					// Re-render
					this.renderFullLearnset();
				}
			} else {
				alert('Move "' + moveName + '" not found. Please check the spelling.');
			}
		}
	},
	removeMove: function(e) {
		e.preventDefault();
		var index = parseInt($(e.currentTarget).data('index'));
		var learnset = LearnsetsEdit[this.id];
		
		if (confirm('Remove this move from the learnset?')) {
			learnset.splice(index, 1);
			this.renderFullLearnset();
		}
	},
	updateStat: function(e) {
		var stat = $(e.currentTarget).data('stat');
		var newValue = parseInt($(e.currentTarget).val());
		var pokemon = BattlePokedexEdit[this.id];
		
		if (!isNaN(newValue) && newValue >= 1 && newValue <= 255) {
			pokemon.baseStats[stat] = newValue;
			
			// Update the stat bar
			var width = Math.floor(newValue * 200 / 200);
			if (width > 200) width = 200;
			var color = Math.floor(newValue * 180 / 255);
			if (color > 360) color = 360;
			this.$('.statbar-fill[data-stat="' + stat + '"]')
				.css('width', width + 'px')
				.css('background', 'hsl(' + color + ',85%,45%)')
				.css('border-color', 'hsl(' + color + ',75%,35%)');
			
			// Recalculate BST
			var bst = 0;
			for (var s in BattleStatNames) {
				bst += pokemon.baseStats[s];
			}
			this.$('.bst-total').text(bst);
			
			// Update calculated stats
			this.updateLevel({});
		}
	},
	editType: function(e) {
		e.preventDefault();
		var slot = parseInt($(e.currentTarget).data('slot'));
		var pokemon = BattlePokedexEdit[this.id];
		var currentType = pokemon.types[slot];
		
		// List of all possible types
		var types = ['Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison', 
					 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'];
		
		var newType = prompt('Enter new type (' + types.join(', ') + '):', currentType);
		if (newType && newType.trim()) {
			// Capitalize first letter
			newType = newType.charAt(0).toUpperCase() + newType.slice(1).toLowerCase();
			
			if (types.indexOf(newType) !== -1) {
				pokemon.types[slot] = newType;
				// Re-render the entire panel to update types display
				this.initialize(this.id);
			} else {
				alert('Invalid type. Please choose from: ' + types.join(', '));
			}
		}
	},
	addType: function(e) {
		e.preventDefault();
		var pokemon = BattlePokedexEdit[this.id];
		
		if (pokemon.types.length >= 2) {
			alert('Pokémon can only have up to 2 types.');
			return;
		}
		
		var types = ['Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison', 
					 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'];
		
		var newType = prompt('Enter second type (' + types.join(', ') + '):');
		if (newType && newType.trim()) {
			// Capitalize first letter
			newType = newType.charAt(0).toUpperCase() + newType.slice(1).toLowerCase();
			
			if (types.indexOf(newType) !== -1) {
				pokemon.types.push(newType);
				// Re-render the entire panel to update types display
				this.initialize(this.id);
			} else {
				alert('Invalid type. Please choose from: ' + types.join(', '));
			}
		}
	}
});
