// Import pokedex.js to ensure PokedexResultPanel is available
import './pokedex.js';

window.PokedexMovePanel = PokedexResultPanel.extend({
	initialize: function(id) {
		id = toID(id);
		var move = getID(BattleMovedex, id);
		this.id = id;
		this.shortTitle = move.name;

		var buf = '<div class="pfx-body dexentry">';

		buf += '<a href="'+Config.baseurl+'" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Pok&eacute;dex</a>';
		buf += '<h1><a href="'+Config.baseurl+'moves/'+id+'" data-target="push" class="subtle">'+move.name+'</a></h1>';

		if (move.id === 'magikarpsrevenge') {
			buf += '<div class="warning"><strong>Note:</strong> Made for testing on Pok&eacute;mon Showdown, not a real move.</div>';
		} else if (move.isNonstandard) {
			buf += '<div class="warning"><strong>Note:</strong> ';
			switch (move.isNonstandard) {
			case 'Past':
				buf += 'This move is only available in past generations.';
				break;
			case 'Future':
				buf += 'This move is only available in future generations.';
				break;
			case 'Unobtainable':
				if (move.isMax) {
					buf += 'This move can\'t be learned normally, it can only be used by ' + (move.isMax === true ? 'Dynamaxing' : 'Gigantamaxing') + '.';
				} else if (move.isZ) {
					buf += 'This move can\'t be learned normally, it can only be used with a Z-Crystal.';
				} else {
					buf += 'This move can\'t be learned normally.';
				}
				break;
			case 'CAP':
				buf += 'This is a made-up move by <a href="http://www.smogon.com/cap/" target="_blank">Smogon CAP</a>.';
				break;
			case 'LGPE':
				buf += 'This move is only available in Let\'s Go! Pikachu and Eevee.';
				break;
			case 'Custom':
				buf += 'This is a custom move, not available during normal gameplay.';
				break;
			}
			buf += '</div>';
		}

		buf += '<dl class="movetypeentry">';
		buf += '<dt>Type:</dt> <dd>';
		buf += '<a class="type '+toID(move.type)+'" href="'+Config.baseurl+'types/'+toID(move.type)+'" data-target="push">'+move.type+'</a> ';
		buf += '<a class="type '+toID(move.category)+'" href="'+Config.baseurl+'categories/'+toID(move.category)+'" data-target="push">'+move.category+'</a>';
		buf += '</dd></dl>';

		if (move.category !== 'Status') {
			buf += '<dl class="powerentry"><dt>Base power:</dt> <dd><strong>'+(move.basePower||'&mdash;')+'</strong></dd></dl>';
		}
		buf += '<dl class="accuracyentry"><dt>Accuracy:</dt> <dd>'+(move.accuracy && move.accuracy!==true?move.accuracy+'%':'&mdash;')+'</dd></dl>';
		buf += '<dl class="ppentry"><dt>PP:</dt> <dd>'+(move.pp)+(move.noPPBoosts ? '':' <small class="minor">(max: '+(8/5*move.pp)+')</small>')+'</dd>';
		buf += '</dl><div style="clear:left;padding-top:1px"></div>';

		if (move.isZ) {
			buf += '<p><strong><a href="'+Config.baseurl+'tags/zmove" data-target="push">[Z-Move]</a></strong>';
			if (move.isZ !== true) {
				var zItem = getID(BattleItems, move.isZ);
				buf += ' requiring <a href="'+Config.baseurl+'items/' + zItem.id + '" data-target="push">' + zItem.name + '</a>';
			}
			buf += '</p>';
		} else if (move.isMax) {
			if (move.isMax !== true) {
				buf += '<p><strong><a href="'+Config.baseurl+'tags/gmaxmove" data-target="push">[G-Max Move]</a></strong>';
				var maxUser = getID(BattlePokedex, move.isMax);
				buf += ' used by <a href="'+Config.baseurl+'pokemon/' + maxUser.id + 'gmax" data-target="push">' + maxUser.name + '-Gmax</a>';
				if (maxUser.name === "Toxtricity") {
					buf += ' or <a href="'+Config.baseurl+'pokemon/' + maxUser.id + 'lowkeygmax" data-target="push">' + maxUser.name + '-Low-Key-Gmax</a>';
				}
			} else {
				buf += '<p><strong><a href="'+Config.baseurl+'tags/maxmove" data-target="push">[Max Move]</a></strong>';
			}
		}

		if (move.priority > 1) {
			buf += '<p>Nearly always moves first <em>(priority +' + move.priority + ')</em>.</p>';
		} else if (move.priority <= -1) {
			buf += '<p>Nearly always moves last <em>(priority &minus;' + (-move.priority) + ')</em>.</p>';
		} else if (move.priority === 1) {
			buf += '<p>Usually moves first <em>(priority +' + move.priority + ')</em>.</p>';
		}

		buf += '<p>'+escapeHTML(move.desc||move.shortDesc)+'</p>';

		// Special case: Certain moves should link to their related tag pages
		if (id === 'snatch') {
			buf += '<p class="movetag"><a href="'+Config.baseurl+'tags/snatchable" data-target="push">See all Snatchable moves</a></p>';
		}
		if (id === 'protect' || id === 'detect' || id === 'kingsshield' || id === 'spikyshield' || id === 'banefulbunker') {
			buf += '<p class="movetag"><a href="'+Config.baseurl+'tags/bypassprotect" data-target="push">See all moves that bypass Protect</a></p>';
		}
		if (id === 'magiccoat') {
			buf += '<p class="movetag"><a href="'+Config.baseurl+'tags/nonreflectable" data-target="push">See all Nonreflectable moves</a></p>';
		}
		if (id === 'mirrormove') {
			buf += '<p class="movetag"><a href="'+Config.baseurl+'tags/nonmirror" data-target="push">See all Nonmirror moves</a></p>';
		}
		if (id === 'substitute') {
			buf += '<p class="movetag"><a href="'+Config.baseurl+'tags/bypasssub" data-target="push">See all moves that bypass Substitute</a></p>';
		}

		if ('defrost' in move.flags) {
			buf += '<p><a class="subtle" href="'+Config.baseurl+'tags/defrost" data-target="push">The user thaws out</a> if it is frozen.</p>';
		}
		if (!('protect' in move.flags) && move.target !== 'self') {
			buf += '<p class="movetag"><a href="'+Config.baseurl+'tags/bypassprotect" data-target="push">Bypasses Protect</a> <small>(bypasses <a class="subtle" href="'+Config.baseurl+'moves/protect" data-target="push">Protect</a>, <a class="subtle" href="'+Config.baseurl+'moves/detect" data-target="push">Detect</a>, <a class="subtle" href="'+Config.baseurl+'moves/kingsshield" data-target="push">King\'s Shield</a>, and <a class="subtle" href="'+Config.baseurl+'moves/spikyshield" data-target="push">Spiky Shield</a>)</small></p>';
		}
		if ('bypasssub' in move.flags) {
			buf += '<p class="movetag"><a href="'+Config.baseurl+'tags/bypasssub" data-target="push">Bypasses Substitute</a> <small>(bypasses but does not break a <a class="subtle" href="'+Config.baseurl+'moves/substitute" data-target="push">Substitute</a>)</small></p>';
		}
		if (!('reflectable' in move.flags) && move.target !== 'self' && move.category === 'Status') {
			buf += '<p class="movetag"><a href="'+Config.baseurl+'tags/nonreflectable" data-target="push">&#x2713; Nonreflectable</a> <small>(can\'t be bounced by <a class="subtle" href="'+Config.baseurl+'moves/magiccoat" data-target="push">Magic Coat</a> or <a class="subtle" href="'+Config.baseurl+'abilities/magicbounce" data-target="push">Magic Bounce</a>)</small></p>';
		}
		if (!('mirror' in move.flags) && move.target !== 'self') {
			buf += '<p class="movetag"><a href="'+Config.baseurl+'tags/nonmirror" data-target="push">&#x2713; Nonmirror</a> <small>(can\'t be copied by <a class="subtle" href="'+Config.baseurl+'moves/mirrormove" data-target="push">Mirror Move</a>)</small></p>';
		}
		if (!('snatch' in move.flags) && (move.target === 'self' || move.target === 'allyTeam' || move.target === 'adjacentAllyOrSelf')) {
			// Previously showed Nonsnatchable; now inverted so we only show tag when snatchable
		} else if (('snatch' in move.flags) && (move.target === 'self' || move.target === 'allyTeam' || move.target === 'adjacentAllyOrSelf')) {
			buf += '<p class="movetag"><a href="'+Config.baseurl+'tags/snatchable" data-target="push">&#x2713; Snatchable</a> <small>(can be copied by <a class="subtle" href="'+Config.baseurl+'moves/snatch" data-target="push">Snatch</a>)</small></p>';
		}

		if ('contact' in move.flags) {
			buf += '<p class="movetag"><a href="'+Config.baseurl+'tags/contact" data-target="push">&#x2713; Contact</a> <small>(affected by many abilities like Iron Barbs and moves like Spiky Shield)</small></p>';
		}
		if ('sound' in move.flags) {
			buf += '<p class="movetag"><a href="'+Config.baseurl+'tags/sound" data-target="push">&#x2713; Sound</a> <small>(bypasses <a class="subtle" href="'+Config.baseurl+'moves/substitute" data-target="push">Substitute</a>, doesn\'t affect <a class="subtle" href="'+Config.baseurl+'abilities/soundproof" data-target="push">Soundproof</a> pokemon)</small></p>';
		}
		if ('powder' in move.flags) {
			buf += '<p class="movetag"><a href="'+Config.baseurl+'tags/powder" data-target="push">&#x2713; Powder</a> <small>(doesn\'t affect <a class="subtle" href="'+Config.baseurl+'types/grass" data-target="push">Grass</a>-types, <a class="subtle" href="'+Config.baseurl+'abilities/overcoat" data-target="push">Overcoat</a> pokemon, and <a class="subtle" href="'+Config.baseurl+'items/safetygoggles" data-target="push">Safety Goggles</a> holders)</small></p>';
		}
		if ('punch' in move.flags) {
			buf += '<p class="movetag"><a href="'+Config.baseurl+'tags/fist" data-target="push">&#x2713; Fist</a> <small>(boosted by <a class="subtle" href="'+Config.baseurl+'abilities/ironfist" data-target="push">Iron Fist</a>)</small></p>';
		}
		if ('pulse' in move.flags) {
			buf += '<p class="movetag"><a href="'+Config.baseurl+'tags/pulse" data-target="push">&#x2713; Pulse</a> <small>(boosted by <a class="subtle" href="'+Config.baseurl+'abilities/megalauncher" data-target="push">Mega Launcher</a>)</small></p>';
		}
		if ('bite' in move.flags) {
			buf += '<p class="movetag"><a href="'+Config.baseurl+'tags/bite" data-target="push">&#x2713; Bite</a> <small>(boosted by <a class="subtle" href="'+Config.baseurl+'abilities/strongjaw" data-target="push">Strong Jaw</a>)</small></p>';
		}
		if ('bullet' in move.flags) {
			buf += '<p class="movetag"><a href="'+Config.baseurl+'tags/ballistic" data-target="push">&#x2713; Ballistic</a> <small>(doesn\'t affect <a class="subtle" href="'+Config.baseurl+'abilities/bulletproof" data-target="push">Bulletproof</a> pokemon)</small></p>';
		}
		if ('slicing' in move.flags) {
			buf += '<p class="movetag"><a href="'+Config.baseurl+'tags/slicing" data-target="push">&#x2713; Slicing</a> <small>(boosted by <a class="subtle" href="'+Config.baseurl+'abilities/sharpness" data-target="push">Sharpness</a>)</small></p>';
		}
		if ('wind' in move.flags) {
			buf += '<p class="movetag"><a href="'+Config.baseurl+'tags/wind" data-target="push">&#x2713; Wind</a> <small>(interacts with <a class="subtle" href="'+Config.baseurl+'abilities/windpower" data-target="push">Wind Power</a> and <a class="subtle" href="'+Config.baseurl+'abilities/windrider" data-target="push">Wind Rider</a>)</small></p>';
		}

		if (move.target === 'allAdjacent') {
			buf += '<p class="movetag"><small>In Doubles, hits all adjacent Pokémon (including allies)</small></p>';
		} else if (move.target === 'allAdjacentFoes') {
			buf += '<p class="movetag"><small>In Doubles, hits all adjacent foes</small></p>';
		} else if (move.target === 'randomNormal') {
			buf += '<p class="movetag"><small>In Doubles, hits a random foe (you can\'t choose its target)</small></p>';
		} else if (move.target === 'adjacentAllyOrSelf') {
			buf += '<p class="movetag"><small>In Doubles, can be used either on the user or an adjacent ally</small></p>';
		}

		// Z-Move
		var zMoveTable = {
			Poison: "Acid Downpour",
			Fighting: "All-Out Pummeling",
			Dark: "Black Hole Eclipse",
			Grass: "Bloom Doom",
			Normal: "Breakneck Blitz",
			Rock: "Continental Crush",
			Steel: "Corkscrew Crash",
			Dragon: "Devastating Drake",
			Electric: "Gigavolt Havoc",
			Water: "Hydro Vortex",
			Fire: "Inferno Overdrive",
			Ghost: "Never-Ending Nightmare",
			Bug: "Savage Spin-Out",
			Psychic: "Shattered Psyche",
			Ice: "Subzero Slammer",
			Flying: "Supersonic Skystrike",
			Ground: "Tectonic Rage",
			Fairy: "Twinkle Tackle",
		};
		var zMoveVersionTable = {
			spiritshackle: "Sinister Arrow Raid",
			volttackle: "Catastropika",
			lastresort: "Extreme Evoboost",
			psychic: "Genesis Supernova",
			naturesmadness: "Guardian of Alola",
			darkestlariat: "Malicious Moonsault",
			sparklingaria: "Oceanic Operetta",
			gigaimpact: "Pulverizing Pancake",
			spectralthief: "Soul-Stealing 7-Star Strike",
			thunderbolt: "Stoked Sparksurfer",
			thunderbolt2: "10,000,000 Volt Thunderbolt",
			photongeyser: "Light That Burns the Sky",
			sunsteelstrike: "Searing Sunraze Smash",
			moongeistbeam: "Menacing Moonraze Maelstrom",
			playrough: "Let's Snuggle Forever",
			stoneedge: "Splintered Stormshards",
			clangingscales: "Clangorous Soulblaze",
		};
		if (!move.isMax && (move.zMovePower || move.zMoveEffect || move.zMoveBoost)) {
			buf += '<h3>Z-Move(s)</h3>';
			if (move.zMovePower) {
				buf += '<p><strong><a href="'+Config.baseurl+'moves/' + toID(zMoveTable[move.type]) + '" data-target="push">';
				buf += zMoveTable[move.type];
				buf += '</a></strong>: ';
				buf += '' + move.zMovePower + ' base power, ' + move.category + '</p>';
			}
			if (move.zMoveBoost) {
				buf += '<p><strong>Z-' + move.name + '</strong>: ';
				var isFirst = true;
				for (var i in move.zMoveBoost) {
					if (!isFirst) buf += ', ';
					isFirst = false;
					buf += '+' + move.zMoveBoost[i] + ' ' + (BattleStatNames[i] || i);
				}
				buf += ', then uses ' + move.name + '</p>';
			}
			if (move.zMoveEffect === 'heal') {
				buf += '<p><strong>Z-' + move.name + '</strong>: fully heals the user, then uses ' + move.name + '</p>';
			} else if (move.zMoveEffect === 'clearnegativeboost') {
				buf += '<p><strong>Z-' + move.name + '</strong>: clears the user\'s negative stat boosts, then uses ' + move.name + '</p>';
			} else if (move.zMoveEffect === 'healreplacement') {
				buf += '<p><strong>Z-' + move.name + '</strong>: uses ' + move.name + ', then heals the replacement' + '</p>';
			} else if (move.zMoveEffect === 'crit2') {
				buf += '<p><strong>Z-' + move.name + '</strong>: increases the user\'s crit rate by 2, then uses ' + move.name + '</p>';
			} else if (move.zMoveEffect === 'redirect') {
				buf += '<p><strong>Z-' + move.name + '</strong>: redirects opponent\'s moves to the user (like Follow Me) in doubles, then uses ' + move.name + '</p>';
			} else if (move.zMoveEffect === 'curse') {
				buf += '<p><strong>Z-' + move.name + '</strong>: +1 Atk if the user is a ghost, or fully heals the user otherwise, then uses ' + move.name + '</p>';
			}
			else if (move.zMoveEffect) {
				// For Status moves: show the base move name (e.g. "Z-Swords Dance: +1 Accuracy, then uses Swords Dance")
				// For Physical/Special moves: show the base Z-Move name (e.g. "Z-Bide: recovers all of user's HP, then uses Breakneck Blitz")
				var zMoveName = (move.category === 'Status') ? move.name : zMoveTable[move.type];
				buf += '<p><strong>Z-' + move.name + '</strong>: ' + escapeHTML(move.zMoveEffect) + ', then uses ' + zMoveName + '</p>';
			}
			if (id in zMoveVersionTable) {
				var zMove = getID(BattleMovedex, zMoveVersionTable[id]);
				buf += '<p><strong><a href="'+Config.baseurl+'moves/' + zMove.id + '" data-target="push">' + zMove.name + '</a></strong>: ';
				if (zMove.basePower) {
					buf += '' + zMove.basePower + ' base power, ' + zMove.category + '</p>';
				} else {
					buf += zMove.shortDesc;
				}
				buf += '</p>';
			}
			if ((id + '2') in zMoveVersionTable) {
				var zMove = getID(BattleMovedex, zMoveVersionTable[id + '2']);
				buf += '<p><strong><a href="'+Config.baseurl+'moves/' + zMove.id + '" data-target="push">' + zMove.name + '</a></strong>: ';
				if (zMove.basePower) {
					buf += '' + zMove.basePower + ' base power, ' + zMove.category + '</p>';
				} else {
					buf += zMove.shortDesc;
				}
				buf += '</p>';
			}
		}

		// Max Move
		var maxMoveTable = {
			Poison: "Ooze",
			Fighting: "Knuckle",
			Dark: "Darkness",
			Grass: "Overgrowth",
			Normal: "Strike",
			Rock: "Rockfall",
			Steel: "Steelspike",
			Dragon: "Wyrmwind",
			Electric: "Lightning",
			Water: "Geyser",
			Fire: "Flare",
			Ghost: "Phantasm",
			Bug: "Flutterby",
			Psychic: "Mindstorm",
			Ice: "Hailstorm",
			Flying: "Airstream",
			Ground: "Quake",
			Fairy: "Starfall",
			Status: "Guard",
		};
		var gmaxMoveTable = {
			Bug: ["Befuddle"],
			Fire: ["Centiferno", "Wildfire"],
			Fighting: ["Chi Strike"],
			Normal: ["Cuddle", "Gold Rush", 'Replenish'],
			Dragon: ["Depletion"],
			Fairy: ["Finale", "Smite"],
			Water: ["Foam Burst", "Stonesurge"],
			Psychic: ["Gravitas"],
			Poison: ["Malodor"],
			Steel: ["Meltdown", "Steelsurge"],
			Ice: ["Resonance"],
			Ground: ["Sandblast"],
			Dark: ["Snooze"],
			Electric: ["Stun Shock", "Volt Crash"],
			Grass: ["Sweetness", "Tartness"],
			Ghost: ["Terror"],
			Rock: ["Volcalith"],
			Flying: ["Wind Rage"],
		};
		if (move.gmaxPower && !move.isZ && !move.isMax) {
			buf += '<h3>Max Move</h3>';
			if (move.category !== 'Status') {
				buf += '<p><strong><a href="'+Config.baseurl+'moves/max' + toID(maxMoveTable[move.type]) + '" data-target="push">';
				buf += 'Max ' + maxMoveTable[move.type];
				buf += '</a></strong>: ';
				buf += '' + move.gmaxPower + ' base power, ' + move.category + '</p>';
			} else {
				buf += '<p><strong><a href="'+Config.baseurl+'moves/maxguard" data-target="push">';
				buf += 'Max Guard';
				buf += '</a></strong>';
				buf += move.shortDesc;
			}
			if (move.type in gmaxMoveTable && move.category !== 'Status') {
				for (let i = 0; i < gmaxMoveTable[move.type].length; i++) {
					var gmaxMove = getID(BattleMovedex, 'gmax' + gmaxMoveTable[move.type][i]);
					buf += '<p>Becomes <strong><a href="'+Config.baseurl+'moves/' + gmaxMove.id + '" data-target="push">' + gmaxMove.name + '</a></strong> ';
					buf += 'if used by <strong><a href="'+Config.baseurl+'pokemon/' + gmaxMove.isMax + 'gmax" data-target="push">' + gmaxMove.isMax + '-Gmax</a></strong>';
					if (gmaxMove.isMax === 'Toxtricity') {
						buf += ' or <strong><a href="'+Config.baseurl+'pokemon/' + gmaxMove.isMax + 'lowkeygmax" data-target="push">' + gmaxMove.isMax + '-Low-Key-Gmax</a></strong>';
					}
					buf += '</p>';
				}
			}
		}

		// distribution
		buf += '<ul class="utilichart metricchart nokbd">';
		buf += '</ul>';

		buf += '</div>';

		this.html(buf);

		setTimeout(this.renderDistribution.bind(this));
	},
	getDistribution: function() {
		var results = []
		for (let pokeId in BattlePokedex) {
			let learnset = getLearnset(pokeId);
			results = results.concat(
        learnset
          .filter((m) => m.move == this.id)
          .map((m) => {
            return { poke: pokeId, ...m };
          })
      );
		}
		const methods = ["lvl", "tm", "tutor", "egg"];
		results.sort((a, b) => {
			if (a.how != b.how) return methods.indexOf(a.how) - methods.indexOf(b.how);
      if (a.how == "lvl" && a.level != b.level) return a.level - b.level;
			return a.poke.localeCompare(b.poke);
		});

		for (let method of methods) {
			let index = results.findIndex(r => r.how == method)
			if (index < 0) continue;
			results.splice(index, 0, {start: true, method})
		}
		
		return this.results = results
	},
	renderDistribution: function() {
		var results = this.getDistribution();
		this.$chart = this.$('.utilichart');

		if (results.length > 1600/33) {
			this.streamLoading = true;
			this.$el.on('scroll', this.handleScroll.bind(this));

			var panelTop = this.$el.children().offset().top;
			var panelHeight = this.$el.outerHeight();
			var chartTop = this.$chart.offset().top;
			var scrollLoc = this.scrollLoc = this.$el.scrollTop();

			var start = Math.floor((scrollLoc - (chartTop-panelTop)) / 33 - 35);
			var end = Math.floor(start + 35 + panelHeight / 33 + 35);
			if (start < 0) start = 0;
			if (end > results.length-1) end = results.length-1;
			this.start = start, this.end = end;

			// distribution
			var buf = '';
			for (var i=0, len=results.length; i<len; i++) {
				buf += '<li class="result">'+this.renderRow(i, i < start || i > end)+'</li>';
			}
			this.$chart.html(buf);
		} else {
			var buf = '';
			for (var i=0, len=results.length; i<len; i++) {
				buf += '<li class="result">'+this.renderRow(i)+'</li>';
			}
			this.$chart.html(buf);
		}
	},
	renderRow: function(i, offscreen) {
		var results = this.results;
		var template = BattlePokedex[results[i].poke];
		if (results[i].start) {
			switch(results[i].method) {
				case 'lvl': // level-up move
					return '<h3>Level-up</h3>';
				case 'tm': // tm/hm
					return '<h3>TM/HM</h3>';
				case 'tutor': // tutor
					return '<h3>Tutor</h3>';
				case 'egg': // egg move
					return '<h3>Egg</h3>';
			}
		} else if (offscreen) {
			return ''+template.name+' '+template.abilities['0']+' '+(template.abilities['1']||'')+' '+(template.abilities['H']||'')+'';
		} else {
			var desc = '';
			switch (results[i].how) {
			case 'lvl': // level-up move
				desc = results[i].level <= 1 ?'&ndash;' : '<small>L</small>'+(results[i].level || '?');
				break;
			case 'tm': // tm/hm
				desc = `<span class="itemicon" style="margin-top:-3px;${getItemIcon("tr01")}"></span>`;
				break;
			case 'tutor': // tutor
				desc = '<img src="' + ResourcePrefix + 'sprites/tutor.png" style="margin-top:-4px;opacity:.7" width="27" height="26" alt="T" />';
				break;
			case 'egg': // egg move
				desc = '<span class="picon" style="margin-top:-12px;'+getPokemonIcon('egg')+'"></span>';
				break;
			case 'event': // event
				desc = '!';
				break;
			case 'past': // past generation
				desc = '...';
				break;
			}
			return BattleSearch.renderTaggedPokemonRowInner(template, desc);
		}
	},
	handleScroll: function() {
		var scrollLoc = this.$el.scrollTop();
		if (Math.abs(scrollLoc - this.scrollLoc) > 20*33) {
			this.renderUpdateDistribution();
		}
	},
	debouncedPurgeTimer: null,
	renderUpdateDistribution: function(fullUpdate) {
		if (this.debouncedPurgeTimer) {
			clearTimeout(this.debouncedPurgeTimer);
			this.debouncedPurgeTimer = null;
		}

		var panelTop = this.$el.children().offset().top;
		var panelHeight = this.$el.outerHeight();
		var chartTop = this.$chart.offset().top;
		var scrollLoc = this.scrollLoc = this.$el.scrollTop();

		var results = this.results;

		var rowFit = Math.floor(panelHeight / 33);

		var start = Math.floor((scrollLoc - (chartTop-panelTop)) / 33 - 35);
		var end = start + 35 + rowFit + 35;
		if (start < 0) start = 0;
		if (end > results.length-1) end = results.length-1;

		var $rows = this.$chart.children();

		if (fullUpdate || start < this.start - rowFit - 30 || end > this.end + rowFit + 30) {
			var buf = '';
			for (var i=0, len=results.length; i<len; i++) {
				buf += '<li class="result">'+this.renderRow(i, (i < start || i > end))+'</li>';
			}
			this.$chart.html(buf);
			this.start = start, this.end = end;
			return;
		}

		if (start < this.start) {
			for (var i = start; i<this.start; i++) {
				$rows[i].innerHTML = this.renderRow(i);
			}
			this.start = start;
		}

		if (end > this.end) {
			for (var i = this.end+1; i<=end; i++) {
				$rows[i].innerHTML = this.renderRow(i);
			}
			this.end = end;
		}

		if (this.end - this.start > rowFit+90) {
			var self = this;
			this.debouncedPurgeTimer = setTimeout(function() {
				self.renderUpdateDistribution(true);
			}, 1000);
		}
	}
});
