window.PokedexSearchPanel = Panels.Panel.extend({
	minWidth: 639,
	maxWidth: 639,
	sidebarWidth: 280,
	search: null,
	events: {
		'keyup input.searchbox': 'updateSearch',
		'change input.searchbox': 'updateSearch',
		'search input.searchbox': 'updateSearch',
		'submit': 'submit',
		'keydown': 'keydown',
		'keyup': 'keyup',
		'click': 'click',
		'click .result a': 'clickResult',
		'click .filter': 'removeFilter',
		'mouseover .result a': 'hoverlink'
	},
	activeLink: null,
	initialize: function () {
		var fragment = this.fragment.slice(Config.baseurl.length - 1);
		var questionIndex = fragment.indexOf('?');
		if (fragment === 'moves') fragment = 'moves/';
		if (fragment === 'pokemon') fragment = 'pokemon/';
		if (fragment === 'abilities') fragment = 'abilities/';
		if (fragment === 'items') fragment = 'items/';
		if (fragment === 'locations') fragment = 'locations/';
		if (fragment === 'trainers') fragment = 'trainers/';
		if (fragment === 'usage') fragment = 'usage/';
		if (fragment === 'mechanics') fragment = 'mechanics/';
		if (fragment === 'pokeedit') fragment = 'pokeedit/';
		if (questionIndex >= 0) fragment = fragment.slice(0, questionIndex);
		var buf = '<div class="pfx-body"><form class="pokedex">';
		buf += '<h1><a href="'+Config.baseurl+'"" data-target="replace">Pok&eacute;dex</a></h1>';
		buf += '<ul class="tabbar centered" style="margin-bottom: 18px"><li><button class="button nav-first' + (fragment === '' ? ' cur' : '') + '" value="'+Config.baseurl+'dex">Search</button></li>';
		buf += '<li><button class="button' + (fragment === 'pokemon/' ? ' cur' : '') + '" value="'+Config.baseurl+'pokemon/">Pok&eacute;mon</button></li>';
		buf += '<li><button class="button' + (fragment === 'moves/' ? ' cur' : '') + '" value="'+Config.baseurl+'moves/">Moves</button></li>';
		buf += '<li><button class="button' + (fragment === 'abilities/' ? ' cur' : '') + '" value="'+Config.baseurl+'abilities/">Abilities</button></li>';
		buf += '<li><button class="button' + (fragment === 'items/' ? ' cur' : '') + '" value="'+Config.baseurl+'items/">Items</button></li>';
		buf += '<li><button class="button' + (fragment === 'mechanics/' ? ' cur' : '') + '" value="'+Config.baseurl+'mechanics/">Mechanics</button></li>';
		buf += '<li><button class="button' + (fragment === 'locations/' ? ' cur' : '') + '" value="'+Config.baseurl+'locations/">Locations</button></li>';
		buf += '<li><button class="button' + (fragment === 'trainers/' ? ' cur' : '') + '" value="'+Config.baseurl+'trainers/">Trainers</button></li>';
		buf += '<li><button class="button nav-last' + (fragment === 'usage/' ? ' cur' : '') + '" value="'+Config.baseurl+'usage/">Usage</button></li>';
		buf += '<li style="display:none"><button class="button' + (fragment === 'pokeedit/' ? ' cur' : '') + '" value="'+Config.baseurl+'pokeedit/">Pok&eacute;edit</button></li></ul>';
		buf += '<div class="searchboxwrapper"><input class="textbox searchbox" type="search" name="q" value="' + escapeHTML(this.$('.searchbox').val() || '') + '" autocomplete="off" autofocus placeholder="Search Pok&eacute;mon, moves, abilities, items, types, or more" /></div>';
		if (fragment === '') {
			buf += '<p class="buttonbar"><button class="button"><strong>Pok&eacute;dex Search</strong></button> <button name="lucky" class="button">I\'m Feeling Lucky</button></p>';
		}
		buf += '</form>';
		buf += '<div class="results"></div></div>';
		this.$el.html(buf);
		var $searchbox = this.$('.searchbox');
		this.$searchbox = $searchbox;
		this.$searchfilters = null;
		var results = this.$('.results');
		
		// Handle mechanics page early - render articles list and return
		if (fragment === 'mechanics/') {
			this.$('.buttonbar').remove();
			this.$('.searchboxwrapper').remove();
			var articles = [
				{id: 'criticalhit', name: 'Critical Hits'},
				{id: 'grounded', name: 'Grounded'},
				{id: 'hazards', name: 'Entry Hazards'},
				{id: 'maxmoves', name: 'Max Moves'},
				{id: 'phazing', name: 'Phazing'},
				{id: 'submoves', name: 'Substitute Moves'},
				{id: 'terrain', name: 'Terrain'},
				{id: 'zmoveresonation', name: 'Z-Move Resonation'},
				{id: 'zpokemon', name: 'Z-Pokemon'},
				{id: 'zmoves', name: 'Z-Moves'}
			];
			var articlesBuf = '<ul class="utilichart nokbd">';
			for (var i = 0; i < articles.length; i++) {
				var article = articles[i];
				articlesBuf += '<li class="result"><a href="'+Config.baseurl+'articles/'+article.id+'" data-target="push"><span class="col namecol">'+article.name+'</span></a></li>';
			}
			articlesBuf += '</ul>';
			results.html(articlesBuf);
			this.search = null;
			return;
		}
		
		if (results.length) {
			var search = this.search = new BattleSearch(results, this.$el);
			this.$el.on('scroll', function () {
				search.updateScroll();
			});
			if (fragment === 'pokemon/') {
				search.setType('pokemon');
				$searchbox.attr('placeholder', 'Search pokemon OR filter by type, move, ability, egg group');
				this.$('.buttonbar').remove();
			} else if (fragment === 'pokeedit/') {
				search.setType('pokeedit');
				$searchbox.attr('placeholder', 'Search editable pokemon OR filter by type, move, ability, egg group');
				this.$('.buttonbar').remove();
			} else if (fragment === 'moves/') {
				search.setType('move');
				$searchbox.attr('placeholder', 'Search moves OR filter by type, category, pokemon');
				this.$('.buttonbar').remove();
			} else if (fragment === 'abilities/') {
				search.setType('ability');
				$searchbox.attr('placeholder', 'Search abilities OR filter by pokemon');
				this.$('.buttonbar').remove();
			} else if (fragment === 'items/') {
				search.setType('item');
				$searchbox.attr('placeholder', 'Search items');
				this.$('.buttonbar').remove();
			} else if (fragment === 'locations/') {
				// Locations type - to be implemented later
				$searchbox.attr('placeholder', 'Search locations');
				this.$('.buttonbar').remove();
				this.$('.results').html('<p style="padding:20px;text-align:center;color:#999">Locations feature coming soon!</p>');
			} else if (fragment === 'trainers/') {
				// Trainers list
				$searchbox.attr('placeholder', 'Search trainers by name or id');
				this.$('.buttonbar').remove();
				this.trainersMode = true;
				this.renderTrainers('');
			} else if (fragment === 'usage/') {
				// Usage tracking
				search.setType('usage');
				$searchbox.attr('placeholder', 'Search pokemon to see wild/trainer usage');
				this.$('.buttonbar').remove();
			}
			this.search.externalFilter = true;
		} else {
			this.search = null;
		}
		if ($searchbox.length) {
			$searchbox.focus();
			this.find($searchbox.val());
			this.checkExactMatch();
		}
	},
	updateSearch: function(e) {
		this.find(e.currentTarget.value);
	},
	removeFilter: function(e) {
		this.search.removeFilter(e);
		this.updateFilters();
		this.$searchbox.focus();
	},
	updateFilters: function() {
		// this.search.externalFilter = true;
		var buf = '';
		if (this.search.qType === 'pokemon') {
			buf = '<button class="filter noclear" value=":">Pokémon</button> ';
		} else if (this.search.qType === 'move') {
			buf = '<button class="filter noclear" value=":">Moves</button> ';
		} else if (this.search.qType === 'ability') {
			buf = '<button class="filter noclear" value=":">Abilities</button> ';
		} else if (this.search.qType === 'item') {
			buf = '<button class="filter noclear" value=":">Items</button> ';
		} else {
			this.$('.searchbox-filters').remove();
			this.$searchbox.css('padding', '2px');
			return;
		}
		if (this.search.filters) {
			for (var i = 0; i < this.search.filters.length; i++) {
				var filter = this.search.filters[i];
				var text = filter[1];
				if (filter[0] === 'move') text = getID(BattleMovedex, text).name;
				if (filter[0] === 'pokemon') text = getID(BattlePokedex, text).name;
				buf += '<button class="filter" value="' + escapeHTML(filter.join(':')) + '">' + text + ' <i class="fa fa-times-circle"></i></button> ';
			}
		}
		if (!this.$searchfilters) {
			this.$searchfilters = $('<div class="searchbox-filters"></div>').insertAfter(this.$searchbox);
		}
		this.$searchfilters.html(buf);
		var filterWidth = this.$searchfilters.width();
		if (filterWidth > this.$searchbox.outerWidth() / 2) {
			this.$searchbox.css('padding', '' + (this.$searchfilters.height() + 4) + 'px 2px 2px 2px');
		} else {
			this.$searchbox.css('padding', '2px 2px 2px ' + (filterWidth + 6) + 'px');
		}
	},
	submit: function(e) {
		e.preventDefault();
		this.$('.searchbox').attr('placeholder', 'Type in: Pokemon, move, item, ability...').focus();
	},
	keyup: function (e) {
		var val = this.$searchbox.val();
		var id = toID(val);
		if (!id) return;
		var lastchar = val.charAt(val.length - 1);
		if (lastchar === ',' || lastchar === ' ') {
			if (id === 'ds' || id === 'dexsearch' || id === 'pokemon') {
				this.app.go('pokemon/', this, true);
				return;
			}
			if (id === 'ms' || id === 'movesearch' || id === 'move' || id === 'moves') {
				this.app.go('moves/', this, true);
				return;
			}
			if (id === 'as' || id === 'abilitysearch' || id === 'ability' || id === 'abilities') {
				this.app.go('abilities/', this, true);
				return;
			}
		}
		if (lastchar === ',') {
			if (this.search.addFilter(this.activeLink)) {
				this.$searchbox.val('');
				this.find('');
				return;
			}
		}
	},
	keydown: function(e) {
		switch (e.keyCode) {
		case 13: // enter
			e.preventDefault();
			e.stopPropagation();
			if (this.search.addFilter(this.activeLink)) {
				this.$searchbox.val('');
				this.find('');
				return;
			}
			if (this.activeLink) {
				var path = this.activeLink.pathname.substr(1);
				if (path === 'moves/' || path === 'pokemon/') {
					this.app.go(path, this, true);
					return;
				}
				this.app.go(path, this, false, $(this.activeLink));
			} else if (!this.$searchbox.val()) {
				this.app.slicePanel(this);
			}
			break;
		case 188: // comma
			if (this.search.addFilter(this.activeLink)) {
				e.preventDefault();
				e.stopPropagation();
				this.$searchbox.val('');
				this.find('');
				return;
			}
			break;
		case 32: // space
			var id = toID(this.$searchbox.val());
			if (id === 'ds' || id === 'pokemon') {
				e.preventDefault();
				e.stopPropagation();
				this.app.go('pokemon/', this, true);
				return;
			}
			if (id === 'ms' || id === 'move' || id === 'moves') {
				e.preventDefault();
				e.stopPropagation();
				this.app.go('moves/', this, true);
				return;
			}
			if (id === 'as' || id === 'ability' || id === 'abilities') {
				e.preventDefault();
				e.stopPropagation();
				this.app.go('abilities/', this, true);
				return;
			}
			break;
		case 38: // up
			e.preventDefault();
			e.stopPropagation();
			var $link = $(this.activeLink).parent().prev();
			while ($link[0] && $link[0].firstChild.tagName !== 'A') $link = $link.prev();
			if ($link[0] && $link.children()[0]) {
				$(this.activeLink).removeClass('active');
				this.activeLink = $link.children()[0];
				$(this.activeLink).addClass('active');
			}
			break;
		case 40: // down
			e.preventDefault();
			e.stopPropagation();
			var $link = $(this.activeLink).parent().next();
			while ($link[0] && $link[0].firstChild.tagName !== 'A') $link = $link.next();
			if ($link[0] && $link.children()[0]) {
				$(this.activeLink).removeClass('active');
				this.activeLink = $link.children()[0];
				$(this.activeLink).addClass('active');
			}
			break;
		case 27: // esc
		case 8: // backspace
			if (this.$searchbox.val()) break;

			if (this.search.removeFilter()) {
				this.find('');
				return;
			}
			if (this.search.qType) {
				this.app.go('', this, true);
				return;
			}
			if (this.app.panels.length > 1) {
				e.preventDefault();
				e.stopPropagation();
				this.app.slicePanel(this);
			}
			break;
		}
	},
	click: function(e) {
		if (e.target.tagName === 'BUTTON' && $(e.target).closest('.tabbar').length) {
			e.preventDefault();
			e.stopPropagation();
			this.app.go(e.target.value, this, true);
			return;
		}
		if (e.target.tagName === 'BUTTON' && e.target.name === 'lucky') {
			e.preventDefault();
			e.stopPropagation();
			alert(['That\'s pretty cool.','Your mom\'s feeling lucky.','I see.','If you feel lucky for more than four hours, perhaps you should see a doctor.'][Math.floor(Math.random()*4)]);
			return;
		}
		var scrollLoc = this.$el.scrollTop();
		this.$searchbox.focus();
		this.$el.scrollTop(scrollLoc);
	},
	clickResult: function(e) {
		if (this.search.addFilter(e.currentTarget)) {
			e.preventDefault();
			e.stopImmediatePropagation();
			this.$searchbox.val('');
			this.find('');
			return;
		}
	},
	hoverlink: function(e) {
		$(this.activeLink).removeClass('active');
		this.activeLink = e.currentTarget;
		$(this.activeLink).addClass('active');
	},
	find: function(val) {
		if (this.trainersMode) {
			this.renderTrainers(val || '');
			return;
		}
		if (!this.search) return;
		if (!val) val = '';
		this.updateFilters();
		if (!this.search.find(val)) return;
		if (this.search.q || this.search.filters) {
			this.$('.pokedex').addClass('aboveresults');
			this.activeLink = this.search.el.getElementsByTagName('a')[0];
			$(this.activeLink).addClass('active');
		} else {
			this.$('.pokedex').removeClass('aboveresults');
			this.activeLink = null;
		}
	},
		renderTrainers: function(q) {
		q = (q || '').toLowerCase().trim();
		const list = (window.Trainers || []);
		const staticEncounters = Object.values(window.StaticEncounters || {});
		let buf = '<ul class="utilichart nokbd">';

		// Helper: check if a team member has an illegal ability or move
		const isIllegal = function(pokemon, speciesData) {
			if (!speciesData) return false;
			if (pokemon.ability) {
				let abilityLegal = false;
				for (let slot in speciesData.abilities) {
					if (speciesData.abilities[slot] === pokemon.ability) { abilityLegal = true; break; }
				}
				if (!abilityLegal) return true;
			}
			if (pokemon.moves && pokemon.moves.length > 0) {
				const speciesLearnset = window.Learnsets[speciesData.id] || [];
				for (let j = 0; j < pokemon.moves.length; j++) {
					const moveID = toID(pokemon.moves[j]);
					const moveData = BattleMovedex[moveID];
					if (!moveData) continue;
					let moveLegal = false;
					for (let k = 0; k < speciesLearnset.length; k++) {
						if (toID(speciesLearnset[k].move) === moveID) { moveLegal = true; break; }
					}
					if (!moveLegal) return true;
				}
			}
			return false;
		};

		// Helper: render a single trainer list item
		const renderTrainerItem = function(t) {
			let hasIllegal = false;
			for (let j = 0; j < (t.team || []).length; j++) {
				const m = t.team[j];
				const disp = window.translateDisplayName ? window.translateDisplayName(m.name || '') : (m.name || '');
				const monData = BattlePokedex[toID(disp)];
				if (isIllegal(m, monData)) { hasIllegal = true; break; }
			}
			const display = '[' + t.id + '] ' + escapeHTML(t.name);
			const teamSprites = (t.team || []).map(m => {
				const disp = window.translateDisplayName ? window.translateDisplayName(m.name || '') : (m.name || '');
				return '<span class="picon" style="' + getPokemonIcon(toID(disp)) + ';display:inline-block;vertical-align:middle"></span>';
			}).join('');
			const trainerSpriteUrl = (typeof getTrainerSpriteUrl === 'function') ? getTrainerSpriteUrl(t, true) : null;
			const trainerBg = (typeof getTrainerBackground === 'function') ? getTrainerBackground(t, true) : getTrainerIcon(t.name, true);
			const thumb = trainerSpriteUrl
				? '<div style="position:absolute;left:-10px;top:-6px;width:148px;height:92px;opacity:0.35;pointer-events:none;overflow:hidden;">' +
					'<img src="' + escapeHTML(trainerSpriteUrl) + '" alt="" style="width:100%;height:100%;object-fit:contain;object-position:right top;" loading="lazy" />' +
				  '</div>'
				: '<div style="position:absolute;left:-30px;top:-4px;width:128px;height:85px;opacity:0.35;pointer-events:none;overflow:hidden;">' +
					'<div style="width:512px;height:256px;transform:scale(0.175);transform-origin:top left;' + trainerBg + ';"></div>' +
				  '</div>';
			const nameStyle = hasIllegal ? 'color:red;' : '';
			return '<li class="result">' +
				'<a href="' + Config.baseurl + 'trainers/' + t.id + '" data-target="push" style="position:relative;overflow:hidden;">' +
					thumb +
					'<span class="col namecol" style="display:inline-block;vertical-align:middle;position:relative;z-index:1;' + nameStyle + '">' + display + '</span>' +
					'<span class="col" style="float:right;text-align:right;white-space:nowrap;display:flex;align-items:center;gap:2px;position:relative;z-index:1">' + teamSprites + '</span>' +
				'</a>' +
				'</li>';
		};

		// Helper: render a single static encounter list item
		const renderStaticItem = function(s) {
			const translatedName = window.translateDisplayName ? window.translateDisplayName(s.name) : s.name;
			const monID = toID(translatedName);
			return '<li class="result">' +
				'<a href="' + Config.baseurl + 'encounters/' + s.id + '" data-target="push">' +
					'<span class="col namecol">[' + s.id + '] ' + escapeHTML(translatedName) + ' (Lv. ' + s.level + ')</span>' +
					'<span class="col" style="float:right;text-align:right;white-space:nowrap;display:flex;align-items:center;gap:2px">' +
						'<span class="picon" style="' + getPokemonIcon(monID) + ';display:inline-block;vertical-align:middle"></span>' +
					'</span>' +
				'</a>' +
				'</li>';
		};

		if (q) {
			// Detect if the query matches any Pokémon name (partial)
			const matchingPokemonIds = new Set();
			for (const pokeId in BattlePokedex) {
				const poke = BattlePokedex[pokeId];
				if (poke && poke.name && poke.name.toLowerCase().indexOf(q) >= 0) {
					matchingPokemonIds.add(pokeId);
				}
			}

			if (matchingPokemonIds.size > 0) {
				// Pokémon search mode: show categorised results
				const trainerMatches = list.filter(t =>
					(t.team || []).some(m => {
						const disp = window.translateDisplayName ? window.translateDisplayName(m.name || '') : (m.name || '');
						return matchingPokemonIds.has(toID(disp));
					})
				);
				const staticMatches = staticEncounters.filter(s => {
					const translatedName = window.translateDisplayName ? window.translateDisplayName(s.name) : s.name;
					return matchingPokemonIds.has(toID(translatedName));
				});

				if (trainerMatches.length > 0) {
					buf += '<li class="result"><h3>Owned by Trainers</h3></li>';
					for (const t of trainerMatches) buf += renderTrainerItem(t);
				}
				if (staticMatches.length > 0) {
					buf += '<li class="result"><h3>Static Encounters</h3></li>';
					for (const s of staticMatches) buf += renderStaticItem(s);
				}
				if (trainerMatches.length === 0 && staticMatches.length === 0) {
					buf += '<li class="result"><p class="search-no-results">No trainers or static encounters found for that Pokémon.</p></li>';
				}
			} else {
				// Normal search: filter trainers and statics by name/ID
				for (let i = 0; i < list.length; i++) {
					const t = list[i];
					if (('[' + t.id + '] ' + t.name).toLowerCase().indexOf(q) === -1) continue;
					buf += renderTrainerItem(t);
				}
				for (let i = 0; i < staticEncounters.length; i++) {
					const s = staticEncounters[i];
					const translatedName = window.translateDisplayName ? window.translateDisplayName(s.name) : s.name;
					if (('[' + s.id + '] ' + translatedName).toLowerCase().indexOf(q) === -1) continue;
					buf += renderStaticItem(s);
				}
			}
		} else {
			// No query: render all trainers then all statics
			for (let i = 0; i < list.length; i++) buf += renderTrainerItem(list[i]);
			for (let i = 0; i < staticEncounters.length; i++) buf += renderStaticItem(staticEncounters[i]);
		}

		buf += '</ul>';
		this.$('.results').html(buf);
		this.$('.pokedex').addClass('aboveresults');
		this.activeLink = this.$('.results a')[0] || null;
		if (this.activeLink) $(this.activeLink).addClass('active');
	},
	checkExactMatch: function() {
		if (this.search && this.search.exactMatch && this.search.q !== 'metronome' && this.search.q !== 'psychic') {
			setTimeout(function(){
				this.app.go($(this.activeLink).attr('href'), this, false, $(this.activeLink), true);
			}.bind(this));
		}
	}
});
