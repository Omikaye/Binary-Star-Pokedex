window.PokedexPokemonPanel = PokedexResultPanel.extend({
	initialize: function(id) {
		id = toID(id);
		var pokemon = BattlePokedex[id]
		this.id = id;
		this.shortTitle = pokemon.baseSpecies;

		var buf = '<div class="pfx-body dexentry">';

		buf += `<a href="${Config.baseurl}" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Pok&eacute;dex</a>`;
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
							buf += `<div><a href="${Config.baseurl}pokemon/${template.id}" data-target="replace">${name}</a></div>`;
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
					buf += `<a href="${Config.baseurl}pokemon/${template.id}" data-target="replace">${name}</a>`;
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
					desc = `<span class="itemicon" style="margin-top:-3px;${getItemIcon("tr01")};width:32px;height:32px"></span>`;
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
			buf += BattleSearch.renderTaggedMoveRow(move, desc);
		}
		this.$('.utilichart').html(buf);
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
