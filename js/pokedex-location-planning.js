function normalizePlannerMetaText(value) {
	var out = (value || '').trim();
	if (!out || /^\(?none\)?$/i.test(out)) return '';
	return out;
}

function plannerTrainerMatchesLocation(trainer, loc) {
	if (!trainer || !loc) return false;
	var trainerLocation = normalizePlannerMetaText(trainer.location);
	if (!trainerLocation) return false;
	var trainerLocID = toID(trainerLocation);
	return trainerLocID === toID(loc.id) || trainerLocID === toID(loc.name);
}

function plannerGetTrainersForLocation(loc) {
	return (window.Trainers || []).filter(function (trainer) {
		return plannerTrainerMatchesLocation(trainer, loc);
	});
}

function plannerStaticEncounterMatchesLocation(staticEncounter, loc) {
	if (!staticEncounter || !loc) return false;
	var staticLocation = normalizePlannerMetaText(staticEncounter.location);
	if (!staticLocation) return false;
	var staticLocID = toID(staticLocation);
	return staticLocID === toID(loc.id) || staticLocID === toID(loc.name);
}

function plannerGetStaticEncountersForLocation(loc) {
	var staticEncounters = window.StaticEncounters || {};
	return Object.keys(staticEncounters).map(function (id) {
		return staticEncounters[id];
	}).filter(function (staticEncounter) {
		return plannerStaticEncounterMatchesLocation(staticEncounter, loc);
	});
}

function plannerParseItemId(itemText) {
	var text = (itemText || '').trim();
	if (!text) return '';
	var tmMatch = text.match(/^(TM\d+)\s*\((.+)\)$/);
	if (tmMatch) return toID(tmMatch[1]);
	var base = text.replace(/\s*\(\d+\)$/, '');
	if (base === 'Poké Ball') return 'pokball';
	var id = toID(base);
	return BattleItems[id] ? id : '';
}

function plannerCloneTrainer(trainer) {
	var team = (trainer.team || []).map(function (mon) {
		var translated = window.translateDisplayName ? window.translateDisplayName(mon.name || '') : (mon.name || '');
		return {
			pokemonId: toID(translated),
			level: Number(mon.level) || 1,
			itemId: plannerParseItemId(mon.item || ''),
			ability: mon.ability || '',
			nature: mon.nature || 'Serious',
			moves: (mon.moves || []).slice(0, 4).map(function (m) { return toID(m); }).concat(['', '', '', '']).slice(0, 4)
		};
	});
	return {
		id: String(trainer.id || ''),
		name: trainer.name || '',
		prizeMoney: trainer.prizeMoney || 0,
		desc: trainer.desc || '',
		team: team
	};
}

window.PokedexLocationPlanningPanel = PokedexResultPanel.extend({
	initialize: function () {
		this.shortTitle = 'Location Planning';
		this.plannerLocations = [];
		this.selectedIndex = -1;
		this.activeTab = 'obtainable';
		this.addingLocation = false;
		this.editingTrainerSlotIndex = -1;
		this.renderPlanner();
	},
	events: {
		'click .planner-add-toggle': 'showAddLocation',
		'click .planner-add-cancel': 'hideAddLocation',
		'click .planner-add-submit': 'addLocation',
		'click .planner-location-link': 'selectLocation',
		'click .planner-tabbar button': 'selectTab',
		'change .planner-slot-select': 'updateSlot',
		'click .planner-add-slot': 'addSlot',
		'click .planner-edit-trainer': 'openTrainerEditor',
		'click .planner-close-trainer-editor': 'closeTrainerEditor',
		'click .planner-add-team-mon': 'addTrainerTeamMon',
		'click .planner-remove-team-mon': 'removeTrainerTeamMon',
		'change .planner-trainer-field': 'updateTrainerTeamField'
	},
	getTrainerById: function (id) {
		var norm = String(id || '').replace(/[^0-9]/g, '').padStart(3, '0');
		return (window.Trainers || []).find(function (t) { return String(t.id || '').padStart(3, '0') === norm; }) || null;
	},
	getPokemonOptions: function () {
		var options = [];
		for (var id in BattlePokedex) {
			var mon = BattlePokedex[id];
			if (!mon || !mon.name) continue;
			options.push({ id: id, name: mon.name });
		}
		options.sort(function (a, b) { return a.name.localeCompare(b.name); });
		return options;
	},
	getItemOptions: function () {
		var options = [];
		for (var id in BattleItems) {
			var item = BattleItems[id];
			if (!item || !item.name) continue;
			options.push({ id: id, name: item.name });
		}
		options.sort(function (a, b) { return a.name.localeCompare(b.name); });
		return options;
	},
	getTrainerOptions: function () {
		var options = (window.Trainers || []).map(function (trainer) {
			var id = String(trainer.id || '');
			return {
				id: id,
				label: '[' + id.padStart(3, '0') + '] ' + (trainer.name || ('Trainer ' + id))
			};
		});
		options.sort(function (a, b) { return a.label.localeCompare(b.label); });
		return options;
	},
	getNatureOptions: function () {
		return [
			'Hardy', 'Lonely', 'Brave', 'Adamant', 'Naughty',
			'Bold', 'Docile', 'Relaxed', 'Impish', 'Lax',
			'Timid', 'Hasty', 'Serious', 'Jolly', 'Naive',
			'Modest', 'Mild', 'Quiet', 'Bashful', 'Rash',
			'Calm', 'Gentle', 'Sassy', 'Careful', 'Quirky'
		];
	},
	getPokemonAbilityOptions: function (pokemonId) {
		var mon = BattlePokedex[pokemonId];
		if (!mon || !mon.abilities) return [];
		var seen = {};
		var out = [];
		for (var slot in mon.abilities) {
			var abilityName = mon.abilities[slot];
			if (!abilityName || seen[abilityName]) continue;
			seen[abilityName] = true;
			var label = abilityName;
			if (slot === 'H') label += ' (H)';
			if (slot === 'S') label += ' (S)';
			out.push({ id: abilityName, name: label });
		}
		return out;
	},
	getPokemonMoveOptions: function (pokemonId) {
		var learnset = getLearnset(pokemonId) || [];
		var map = {};
		for (var i = 0; i < learnset.length; i++) {
			var learn = learnset[i];
			var moveName = (learn && learn.move) ? learn.move : learn;
			var moveId = toID(moveName || '');
			if (!moveId) continue;
			var method = 'Other';
			if (learn && typeof learn === 'object') {
				if (learn.how === 'lvl') method = 'Lv ' + (learn.level != null ? learn.level : '?');
				else if (learn.how === 'tm') method = 'TM';
				else if (learn.how === 'tutor') method = 'Tutor';
				else if (learn.how === 'egg') method = 'Egg';
				else if (learn.how === 'event') method = 'Event';
				else if (learn.how) method = String(learn.how).toUpperCase();
			}
			if (!map[moveId]) map[moveId] = { id: moveId, name: (BattleMovedex[moveId] && BattleMovedex[moveId].name) || moveName || moveId, methods: {} };
			map[moveId].methods[method] = true;
		}
		var out = Object.keys(map).map(function (id) {
			var methods = Object.keys(map[id].methods);
			methods.sort(function (a, b) {
				var aLvl = /^Lv /.test(a), bLvl = /^Lv /.test(b);
				if (aLvl && bLvl) return Number(a.slice(3)) - Number(b.slice(3));
				if (aLvl) return -1;
				if (bLvl) return 1;
				return a.localeCompare(b);
			});
			return {
				id: id,
				name: map[id].name + ' (' + methods.join(', ') + ')'
			};
		});
		out.sort(function (a, b) { return a.name.localeCompare(b.name); });
		return out;
	},
	getLastLevelUpMoves: function (pokemonId, level) {
		var learnset = getLearnset(pokemonId) || [];
		var lvlMoves = [];
		for (var i = 0; i < learnset.length; i++) {
			var learn = learnset[i];
			if (!learn || typeof learn !== 'object') continue;
			if (learn.how !== 'lvl') continue;
			var moveId = toID(learn.move || '');
			var moveLevel = Number(learn.level);
			if (!moveId || isNaN(moveLevel) || moveLevel > level) continue;
			lvlMoves.push({ moveId: moveId, level: moveLevel, index: i });
		}
		lvlMoves.sort(function (a, b) {
			if (a.level !== b.level) return a.level - b.level;
			return a.index - b.index;
		});
		var selected = [];
		var seen = {};
		for (var j = lvlMoves.length - 1; j >= 0 && selected.length < 4; j--) {
			var id = lvlMoves[j].moveId;
			if (seen[id]) continue;
			seen[id] = true;
			selected.unshift(id);
		}
		while (selected.length < 4) selected.push('');
		return selected.slice(0, 4);
	},
	getUsageCountsExcluding: function (skipIndex) {
		var counts = { pokemonWild: {}, pokemonTrainer: {}, item: {}, trainer: {} };
		var add = function (bucket, value) {
			if (!value) return;
			bucket[value] = (bucket[value] || 0) + 1;
		};
		for (var i = 0; i < this.plannerLocations.length; i++) {
			if (i === skipIndex) continue;
			var loc = this.plannerLocations[i];
			(loc.wildSlots || []).forEach(function (slot) { add(counts.pokemonWild, slot.pokemonId); });
			(loc.obtainableStaticSlots || []).forEach(function (slot) { add(counts.pokemonWild, slot.pokemonId); });
			(loc.battleStaticSlots || []).forEach(function (slot) { add(counts.pokemonWild, slot.pokemonId); });
			(loc.itemSlots || []).forEach(function (slot) { add(counts.item, slot.itemId); });
			(loc.trainerSlots || []).forEach(function (slot) {
				add(counts.trainer, slot.trainerId);
				var planningTrainer = slot.planningTrainer;
				if (!planningTrainer || !planningTrainer.team) return;
				planningTrainer.team.forEach(function (mon) { add(counts.pokemonTrainer, mon.pokemonId); });
			});
		}
		return counts;
	},
	buildBasicSelectOptions: function (options, currentValue, usageMap, emptyLabel) {
		var buf = '<option value="">' + escapeHTML(emptyLabel || 'None') + '</option>';
		for (var i = 0; i < options.length; i++) {
			var option = options[i];
			var usedElsewhere = usageMap ? !!usageMap[option.id] : false;
			var selected = option.id === currentValue ? ' selected' : '';
			var usedLabel = usedElsewhere ? ' ⭐' : '';
			var usedStyle = usedElsewhere ? ' style="background:#f7df9f;color:#5d4300"' : '';
			buf += '<option value="' + escapeHTML(option.id) + '"' + selected + usedStyle + '>'
				+ escapeHTML(option.name || option.label || option.id) + usedLabel + '</option>';
		}
		return buf;
	},
	buildPokemonSelectOptions: function (options, currentValue, wildUsageMap, trainerUsageMap) {
		var buf = '<option value="">Choose Pokémon...</option>';
		for (var i = 0; i < options.length; i++) {
			var option = options[i];
			var usedWild = wildUsageMap ? !!wildUsageMap[option.id] : false;
			var usedTrainer = trainerUsageMap ? !!trainerUsageMap[option.id] : false;
			var selected = option.id === currentValue ? ' selected' : '';
			var marker = (usedWild ? ' ⭐' : '') + (usedTrainer ? ' ▲' : '');
			var style = '';
			if (usedWild && usedTrainer) style = ' style="background:#d8edc6;color:#2d4f1a"';
			else if (usedWild) style = ' style="background:#f7df9f;color:#5d4300"';
			else if (usedTrainer) style = ' style="background:#cceccb;color:#1f5a1f"';
			buf += '<option value="' + escapeHTML(option.id) + '"' + selected + style + '>'
				+ escapeHTML(option.name || option.id) + marker + '</option>';
		}
		return buf;
	},
	initPlanningTrainerForSlot: function (slot) {
		if (!slot || !slot.trainerId) {
			slot.planningTrainer = { id: '', name: 'Custom Trainer', prizeMoney: 0, desc: '', team: [] };
			return;
		}
		var trainer = this.getTrainerById(slot.trainerId);
		slot.planningTrainer = trainer ? plannerCloneTrainer(trainer) : { id: slot.trainerId, name: 'Custom Trainer', prizeMoney: 0, desc: '', team: [] };
	},
	cloneFromExistingLocation: function (loc) {
		var plan = {
			id: toID(loc.id || loc.name || ('location' + (this.plannerLocations.length + 1))),
			name: loc.name || loc.id || ('Location ' + (this.plannerLocations.length + 1)),
			wildSlots: [],
			obtainableStaticSlots: [],
			itemSlots: [],
			trainerSlots: [],
			battleStaticSlots: []
		};
		var encounters = loc.encounters || [];
		for (var i = 0; i < encounters.length; i++) {
			var encounter = encounters[i];
			var spot = encounter.spot || 'Spot';
			var mons = encounter.pokemon || [];
			for (var j = 0; j < mons.length; j++) {
				var mon = mons[j];
				var translated = window.translateDisplayName ? window.translateDisplayName(mon.name || '') : (mon.name || '');
				plan.wildSlots.push({
					label: spot + ' - ' + (mon.chance != null ? mon.chance + '%' : ('Slot ' + (j + 1))),
					pokemonId: toID(translated)
				});
			}
		}
		var giftsTrades = loc.giftsTrades || [];
		for (var gi = 0; gi < giftsTrades.length; gi++) {
			var gt = giftsTrades[gi];
			var gtTranslated = window.translateDisplayName ? window.translateDisplayName(gt.name || '') : (gt.name || '');
			plan.obtainableStaticSlots.push({
				label: 'Gift/Trade ' + (gi + 1),
				pokemonId: toID(gtTranslated)
			});
		}
		var staticEncounters = plannerGetStaticEncountersForLocation(loc);
		for (var si = 0; si < staticEncounters.length; si++) {
			var stat = staticEncounters[si];
			var statTranslated = window.translateDisplayName ? window.translateDisplayName(stat.name || '') : (stat.name || '');
			plan.obtainableStaticSlots.push({
				label: 'Static ' + (si + 1),
				pokemonId: toID(statTranslated)
			});
			plan.battleStaticSlots.push({
				label: 'Static Battle ' + (si + 1),
				pokemonId: toID(statTranslated)
			});
		}
		var items = loc.items || [];
		for (var it = 0; it < items.length; it++) {
			plan.itemSlots.push({
				label: 'Item ' + (it + 1),
				itemId: plannerParseItemId(items[it].item)
			});
		}
		var trainers = plannerGetTrainersForLocation(loc);
		for (var ti = 0; ti < trainers.length; ti++) {
			var trainer = trainers[ti];
			plan.trainerSlots.push({
				label: 'Trainer ' + (ti + 1),
				trainerId: String(trainer.id || ''),
				planningTrainer: plannerCloneTrainer(trainer)
			});
		}
		return plan;
	},
	createEmptyLocation: function (name) {
		var safeName = (name || '').trim();
		return {
			id: toID(safeName || ('location' + (this.plannerLocations.length + 1))),
			name: safeName || ('Location ' + (this.plannerLocations.length + 1)),
			wildSlots: [],
			obtainableStaticSlots: [],
			itemSlots: [],
			trainerSlots: [],
			battleStaticSlots: []
		};
	},
	showAddLocation: function (e) {
		e.preventDefault();
		this.addingLocation = true;
		this.renderPlanner();
	},
	hideAddLocation: function (e) {
		e.preventDefault();
		this.addingLocation = false;
		this.renderPlanner();
	},
	addLocation: function (e) {
		e.preventDefault();
		var selectedExisting = this.$('.planner-existing-select').val();
		var customName = (this.$('.planner-custom-name').val() || '').trim();
		var selectedPlan = null;
		if (customName) {
			selectedPlan = this.createEmptyLocation(customName);
		} else if (selectedExisting) {
			var existing = (window.Locations || []).find(function (loc) { return toID(loc.id) === selectedExisting; });
			selectedPlan = existing ? this.cloneFromExistingLocation(existing) : null;
		}
		if (!selectedPlan) return;
		this.plannerLocations.push(selectedPlan);
		this.selectedIndex = this.plannerLocations.length - 1;
		this.activeTab = 'obtainable';
		this.addingLocation = false;
		this.editingTrainerSlotIndex = -1;
		this.renderPlanner();
	},
	selectLocation: function (e) {
		e.preventDefault();
		var index = Number($(e.currentTarget).attr('data-index'));
		if (isNaN(index)) return;
		this.selectedIndex = index;
		this.editingTrainerSlotIndex = -1;
		this.renderPlanner();
	},
	selectTab: function (e) {
		e.preventDefault();
		this.activeTab = e.currentTarget.value;
		this.renderPlanner();
	},
	updateSlot: function (e) {
		var $el = $(e.currentTarget);
		var section = $el.attr('data-section');
		var index = Number($el.attr('data-index'));
		var value = $el.val() || '';
		var loc = this.plannerLocations[this.selectedIndex];
		if (!loc || isNaN(index)) return;
		if (section === 'wild' && loc.wildSlots[index]) loc.wildSlots[index].pokemonId = value;
		if (section === 'obtainableStatic' && loc.obtainableStaticSlots[index]) loc.obtainableStaticSlots[index].pokemonId = value;
		if (section === 'items' && loc.itemSlots[index]) loc.itemSlots[index].itemId = value;
		if (section === 'trainers' && loc.trainerSlots[index]) {
			loc.trainerSlots[index].trainerId = value;
			this.initPlanningTrainerForSlot(loc.trainerSlots[index]);
		}
		if (section === 'battleStatic' && loc.battleStaticSlots[index]) loc.battleStaticSlots[index].pokemonId = value;
		this.renderPlanner();
	},
	addSlot: function (e) {
		e.preventDefault();
		var group = $(e.currentTarget).attr('data-slot-group');
		var loc = this.plannerLocations[this.selectedIndex];
		if (!loc) return;
		if (group === 'wild') loc.wildSlots.push({ label: 'Wild Slot ' + (loc.wildSlots.length + 1), pokemonId: '' });
		if (group === 'obtainableStatic') loc.obtainableStaticSlots.push({ label: 'Obtainable Slot ' + (loc.obtainableStaticSlots.length + 1), pokemonId: '' });
		if (group === 'items') loc.itemSlots.push({ label: 'Item Slot ' + (loc.itemSlots.length + 1), itemId: '' });
		if (group === 'trainers') loc.trainerSlots.push({ label: 'Trainer Slot ' + (loc.trainerSlots.length + 1), trainerId: '', planningTrainer: { id: '', name: 'Custom Trainer', prizeMoney: 0, desc: '', team: [] } });
		if (group === 'battleStatic') loc.battleStaticSlots.push({ label: 'Static Slot ' + (loc.battleStaticSlots.length + 1), pokemonId: '' });
		this.renderPlanner();
	},
	openTrainerEditor: function (e) {
		e.preventDefault();
		var idx = Number($(e.currentTarget).attr('data-index'));
		var loc = this.plannerLocations[this.selectedIndex];
		if (!loc || isNaN(idx) || !loc.trainerSlots[idx]) return;
		if (!loc.trainerSlots[idx].planningTrainer) this.initPlanningTrainerForSlot(loc.trainerSlots[idx]);
		this.editingTrainerSlotIndex = idx;
		this.renderPlanner();
	},
	closeTrainerEditor: function (e) {
		e.preventDefault();
		this.editingTrainerSlotIndex = -1;
		this.renderPlanner();
	},
	addTrainerTeamMon: function (e) {
		e.preventDefault();
		var slotIndex = Number($(e.currentTarget).attr('data-slot-index'));
		var loc = this.plannerLocations[this.selectedIndex];
		if (!loc || isNaN(slotIndex) || !loc.trainerSlots[slotIndex]) return;
		var planningTrainer = loc.trainerSlots[slotIndex].planningTrainer;
		if (!planningTrainer) {
			this.initPlanningTrainerForSlot(loc.trainerSlots[slotIndex]);
			planningTrainer = loc.trainerSlots[slotIndex].planningTrainer;
		}
		planningTrainer.team.push({
			pokemonId: '',
			level: 1,
			itemId: '',
			ability: '',
			nature: 'Serious',
			moves: ['', '', '', '']
		});
		this.renderPlanner();
	},
	removeTrainerTeamMon: function (e) {
		e.preventDefault();
		var slotIndex = Number($(e.currentTarget).attr('data-slot-index'));
		var monIndex = Number($(e.currentTarget).attr('data-mon-index'));
		var loc = this.plannerLocations[this.selectedIndex];
		if (!loc || isNaN(slotIndex) || isNaN(monIndex) || !loc.trainerSlots[slotIndex]) return;
		var planningTrainer = loc.trainerSlots[slotIndex].planningTrainer;
		if (!planningTrainer || !planningTrainer.team[monIndex]) return;
		planningTrainer.team.splice(monIndex, 1);
		this.renderPlanner();
	},
	updateTrainerTeamField: function (e) {
		var $el = $(e.currentTarget);
		var slotIndex = Number($el.attr('data-slot-index'));
		var monIndex = Number($el.attr('data-mon-index'));
		var field = $el.attr('data-field');
		var moveIndex = Number($el.attr('data-move-index'));
		var value = $el.val();
		var loc = this.plannerLocations[this.selectedIndex];
		if (!loc || isNaN(slotIndex) || !loc.trainerSlots[slotIndex]) return;
		var planningTrainer = loc.trainerSlots[slotIndex].planningTrainer;
		if (!planningTrainer) return;
		if (isNaN(monIndex) || !planningTrainer.team[monIndex]) return;
		var mon = planningTrainer.team[monIndex];

		if (field === 'pokemonId') {
			mon.pokemonId = value || '';
			var level = Number(mon.level) || 1;
			mon.moves = this.getLastLevelUpMoves(mon.pokemonId, level);
			var abilities = this.getPokemonAbilityOptions(mon.pokemonId);
			mon.ability = abilities.length ? abilities[0].id : '';
			this.renderPlanner();
			return;
		}
		if (field === 'level') {
			var parsed = Number(value);
			if (isNaN(parsed)) parsed = 1;
			if (parsed < 1) parsed = 1;
			if (parsed > 100) parsed = 100;
			mon.level = parsed;
			mon.moves = this.getLastLevelUpMoves(mon.pokemonId, mon.level);
			this.renderPlanner();
			return;
		}
		if (field === 'itemId') mon.itemId = value || '';
		if (field === 'ability') mon.ability = value || '';
		if (field === 'nature') mon.nature = value || 'Serious';
		if (field === 'move' && !isNaN(moveIndex) && moveIndex >= 0 && moveIndex < 4) {
			mon.moves[moveIndex] = value || '';
		}
		this.renderPlanner();
	},
	renderPlanner: function () {
		var allLocations = window.Locations || [];
		var selected = this.plannerLocations[this.selectedIndex] || null;
		var usage = this.getUsageCountsExcluding(this.selectedIndex);
		var pokemonOptions = this.getPokemonOptions();
		var itemOptions = this.getItemOptions();
		var trainerOptions = this.getTrainerOptions();
		var natureOptions = this.getNatureOptions();
		var buf = '<div class="pfx-body dexentry">';
		buf += '<style>'
			+ '.planner-layout{display:flex;flex-direction:column;gap:12px}'
			+ '.planner-actions{display:flex;flex-wrap:wrap;gap:8px;align-items:center}'
			+ '.planner-add-box{background:#f5f7fb;border:1px solid #cfd8e3;border-radius:6px;padding:10px}'
			+ '.planner-list{margin:0;padding:0;list-style:none}'
			+ '.planner-list li{margin:0 0 6px 0}'
			+ '.planner-location-link{display:block;padding:8px 10px;border:1px solid #d7dbe6;border-radius:6px;background:#fff;text-decoration:none}'
			+ '.planner-location-link.cur{background:#eef5ff;border-color:#6ea5ff}'
			+ '.planner-slot-table{width:100%;border-collapse:collapse}'
			+ '.planner-slot-table th,.planner-slot-table td{padding:6px;border-bottom:1px solid #ddd;text-align:left;vertical-align:middle}'
			+ '.planner-slot-table select,.planner-slot-table input{width:100%}'
			+ '.planner-trainer-editor{margin-top:10px;border:1px solid #b7c8e8;border-radius:8px;background:#f4f8ff;padding:10px}'
			+ '.planner-team-card{border:1px solid #d5deef;border-radius:8px;background:#fff;margin-bottom:10px;overflow:hidden}'
			+ '.planner-team-card-head{background:#4b6fae;color:#fff;padding:7px 10px;font-weight:700;display:flex;justify-content:space-between;align-items:center}'
			+ '.planner-team-card-body{padding:10px}'
			+ '.planner-team-grid{display:grid;grid-template-columns:150px 1fr;gap:8px 10px;align-items:center}'
			+ '.planner-team-grid label{font-weight:600;color:#345}'
			+ '.planner-moves-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}'
			+ '.planner-edit-btn{font-size:11px;padding:2px 6px;line-height:1.3}'
			+ 'body.dark-mode .planner-add-box{background:#1a2740;border-color:#405a84}'
			+ 'body.dark-mode .planner-location-link{background:#17243b;border-color:#365179;color:#d9e6f8}'
			+ 'body.dark-mode .planner-location-link.cur{background:#21365a;border-color:#78a8ff}'
			+ 'body.dark-mode .planner-trainer-editor{background:#172843;border-color:#3e5f8f}'
			+ 'body.dark-mode .planner-team-card{background:#122035;border-color:#3a547d}'
			+ 'body.dark-mode .planner-team-card-head{background:#35598f}'
			+ 'body.dark-mode .planner-team-grid label{color:#d5e3f8}'
			+ '</style>';
		buf += '<a href="' + Config.baseurl + 'dex" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Pok&eacute;dex</a>';
		buf += '<h1><a href="' + Config.baseurl + 'location-planning/" data-target="push" class="subtle">Location Planning</a></h1>';
		buf += '<div class="planner-layout">';
		buf += '<div class="planner-actions"><button class="button planner-add-toggle">Add Location</button><span style="color:#666">Planning data is isolated to this planner page and does not modify the actual location/trainer datasets.</span></div>';
		if (this.addingLocation) {
			buf += '<div class="planner-add-box">';
			buf += '<div style="margin-bottom:8px"><strong>Add Location</strong></div>';
			buf += '<div style="margin-bottom:6px">Pick existing location:</div>';
			buf += '<select class="planner-existing-select" style="width:100%;margin-bottom:8px"><option value="">Choose existing location...</option>';
			for (var i = 0; i < allLocations.length; i++) {
				var loc = allLocations[i];
				buf += '<option value="' + escapeHTML(toID(loc.id)) + '">' + escapeHTML(loc.name || loc.id) + '</option>';
			}
			buf += '</select>';
			buf += '<div style="margin-bottom:6px">Or create new location name:</div>';
			buf += '<input class="textbox planner-custom-name" type="text" style="width:100%;margin-bottom:8px" placeholder="Custom location name" />';
			buf += '<div><button class="button planner-add-submit">Add</button> <button class="button planner-add-cancel">Cancel</button></div>';
			buf += '</div>';
		}
		buf += '<div>';
		if (!this.plannerLocations.length) {
			buf += '<p class="resultsub">No planning locations yet.</p>';
		} else {
			buf += '<ul class="planner-list">';
			for (var li = 0; li < this.plannerLocations.length; li++) {
				var planningLoc = this.plannerLocations[li];
				buf += '<li><a href="#" class="planner-location-link' + (li === this.selectedIndex ? ' cur' : '') + '" data-index="' + li + '">' + escapeHTML(planningLoc.name) + '</a></li>';
			}
			buf += '</ul>';
		}
		buf += '</div>';
		if (selected) {
			buf += '<div>';
			buf += '<ul class="tabbar planner-tabbar">';
			buf += '<li><button class="button nav-first' + (this.activeTab === 'obtainable' ? ' cur' : '') + '" value="obtainable">Obtainable Pok&eacute;mon</button></li>';
			buf += '<li><button class="button' + (this.activeTab === 'items' ? ' cur' : '') + '" value="items">Items</button></li>';
			buf += '<li><button class="button nav-last' + (this.activeTab === 'battles' ? ' cur' : '') + '" value="battles">Battles</button></li>';
			buf += '</ul>';
			if (this.activeTab === 'obtainable') {
				buf += '<h3>Wild Pok&eacute;mon</h3>';
				buf += '<table class="planner-slot-table"><thead><tr><th style="width:180px">Encounter Slot</th><th>Pok&eacute;mon</th></tr></thead><tbody>';
				for (var ws = 0; ws < selected.wildSlots.length; ws++) {
					var wildSlot = selected.wildSlots[ws];
					buf += '<tr><td>' + escapeHTML(wildSlot.label) + '</td><td><select class="planner-slot-select" data-section="wild" data-index="' + ws + '">';
					buf += this.buildPokemonSelectOptions(pokemonOptions, wildSlot.pokemonId, usage.pokemonWild, usage.pokemonTrainer);
					buf += '</select></td></tr>';
				}
				buf += '</tbody></table><p><button class="button planner-add-slot" data-slot-group="wild">Add Wild Slot</button></p>';
				buf += '<h3>Static / Gift Pok&eacute;mon</h3>';
				buf += '<table class="planner-slot-table"><thead><tr><th style="width:180px">Slot</th><th>Pok&eacute;mon</th></tr></thead><tbody>';
				for (var os = 0; os < selected.obtainableStaticSlots.length; os++) {
					var obtainableSlot = selected.obtainableStaticSlots[os];
					buf += '<tr><td>' + escapeHTML(obtainableSlot.label) + '</td><td><select class="planner-slot-select" data-section="obtainableStatic" data-index="' + os + '">';
					buf += this.buildPokemonSelectOptions(pokemonOptions, obtainableSlot.pokemonId, usage.pokemonWild, usage.pokemonTrainer);
					buf += '</select></td></tr>';
				}
				buf += '</tbody></table><p><button class="button planner-add-slot" data-slot-group="obtainableStatic">Add Static/Gift Slot</button></p>';
			}
			if (this.activeTab === 'items') {
				buf += '<h3>Items</h3>';
				buf += '<table class="planner-slot-table"><thead><tr><th style="width:180px">Slot</th><th>Item</th></tr></thead><tbody>';
				for (var is = 0; is < selected.itemSlots.length; is++) {
					var itemSlot = selected.itemSlots[is];
					buf += '<tr><td>' + escapeHTML(itemSlot.label) + '</td><td><select class="planner-slot-select" data-section="items" data-index="' + is + '">';
					buf += this.buildBasicSelectOptions(itemOptions, itemSlot.itemId, usage.item, 'Choose Item...');
					buf += '</select></td></tr>';
				}
				buf += '</tbody></table><p><button class="button planner-add-slot" data-slot-group="items">Add Item Slot</button></p>';
			}
			if (this.activeTab === 'battles') {
				buf += '<h3>Trainers</h3>';
				buf += '<table class="planner-slot-table"><thead><tr><th style="width:180px">Slot</th><th>Trainer</th><th style="width:80px;text-align:center">Edit</th></tr></thead><tbody>';
				for (var ts = 0; ts < selected.trainerSlots.length; ts++) {
					var trainerSlot = selected.trainerSlots[ts];
					buf += '<tr><td>' + escapeHTML(trainerSlot.label) + '</td><td><select class="planner-slot-select" data-section="trainers" data-index="' + ts + '">';
					buf += this.buildBasicSelectOptions(trainerOptions, trainerSlot.trainerId, usage.trainer, 'Choose Trainer...');
					buf += '</select></td><td style="text-align:center"><button class="button planner-edit-trainer planner-edit-btn" data-index="' + ts + '" title="Edit planning team">➤</button></td></tr>';
				}
				buf += '</tbody></table><p><button class="button planner-add-slot" data-slot-group="trainers">Add Trainer Slot</button></p>';

				if (this.editingTrainerSlotIndex >= 0 && selected.trainerSlots[this.editingTrainerSlotIndex]) {
					var editingSlot = selected.trainerSlots[this.editingTrainerSlotIndex];
					if (!editingSlot.planningTrainer) this.initPlanningTrainerForSlot(editingSlot);
					var planningTrainer = editingSlot.planningTrainer;
					buf += '<div class="planner-trainer-editor">';
					buf += '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">';
					buf += '<h4 style="margin:0">Trainer Team Editor — ' + escapeHTML(editingSlot.label) + ' (' + escapeHTML(planningTrainer.name || 'Custom Trainer') + ')</h4>';
					buf += '<button class="button planner-close-trainer-editor">Close</button>';
					buf += '</div>';
					buf += '<p class="resultsub" style="margin:6px 0 10px 0">Team edits here are planning-only and never overwrite actual trainer data.</p>';

					for (var tm = 0; tm < planningTrainer.team.length; tm++) {
						var teamMon = planningTrainer.team[tm];
						var monMoveOptions = this.getPokemonMoveOptions(teamMon.pokemonId);
						var abilityOptions = this.getPokemonAbilityOptions(teamMon.pokemonId);
						buf += '<div class="planner-team-card">';
						buf += '<div class="planner-team-card-head"><span>Pokémon ' + (tm + 1) + '</span><button class="button planner-remove-team-mon planner-edit-btn" data-slot-index="' + this.editingTrainerSlotIndex + '" data-mon-index="' + tm + '">Remove</button></div>';
						buf += '<div class="planner-team-card-body">';
						buf += '<div class="planner-team-grid">';
						buf += '<label>Pokémon</label><select class="planner-trainer-field" data-slot-index="' + this.editingTrainerSlotIndex + '" data-mon-index="' + tm + '" data-field="pokemonId">';
						buf += this.buildPokemonSelectOptions(pokemonOptions, teamMon.pokemonId, usage.pokemonWild, usage.pokemonTrainer);
						buf += '</select>';
						buf += '<label>Level</label><input class="textbox planner-trainer-field" type="number" min="1" max="100" data-slot-index="' + this.editingTrainerSlotIndex + '" data-mon-index="' + tm + '" data-field="level" value="' + escapeHTML(String(teamMon.level || 1)) + '" />';
						buf += '<label>Item</label><select class="planner-trainer-field" data-slot-index="' + this.editingTrainerSlotIndex + '" data-mon-index="' + tm + '" data-field="itemId">';
						buf += this.buildBasicSelectOptions(itemOptions, teamMon.itemId, null, 'Choose Item...');
						buf += '</select>';
						buf += '<label>Ability</label><select class="planner-trainer-field" data-slot-index="' + this.editingTrainerSlotIndex + '" data-mon-index="' + tm + '" data-field="ability">';
						buf += this.buildBasicSelectOptions(abilityOptions, teamMon.ability, null, 'Choose Ability...');
						buf += '</select>';
						buf += '<label>Nature</label><select class="planner-trainer-field" data-slot-index="' + this.editingTrainerSlotIndex + '" data-mon-index="' + tm + '" data-field="nature">';
						for (var ni = 0; ni < natureOptions.length; ni++) {
							var nat = natureOptions[ni];
							buf += '<option value="' + escapeHTML(nat) + '"' + (nat === (teamMon.nature || 'Serious') ? ' selected' : '') + '>' + escapeHTML(nat) + '</option>';
						}
						buf += '</select>';
						buf += '<label style="align-self:start;padding-top:5px">Moves</label><div class="planner-moves-grid">';
						for (var mi = 0; mi < 4; mi++) {
							var currentMove = (teamMon.moves || [])[mi] || '';
							buf += '<select class="planner-trainer-field" data-slot-index="' + this.editingTrainerSlotIndex + '" data-mon-index="' + tm + '" data-field="move" data-move-index="' + mi + '">';
							buf += this.buildBasicSelectOptions(monMoveOptions, currentMove, null, 'Move ' + (mi + 1));
							buf += '</select>';
						}
						buf += '</div>';
						buf += '</div></div></div>';
					}
					buf += '<p><button class="button planner-add-team-mon" data-slot-index="' + this.editingTrainerSlotIndex + '">Add Pokémon to Team</button></p>';
					buf += '</div>';
				}

				buf += '<h3>Static Encounters</h3>';
				buf += '<table class="planner-slot-table"><thead><tr><th style="width:180px">Slot</th><th>Pok&eacute;mon</th></tr></thead><tbody>';
				for (var bs = 0; bs < selected.battleStaticSlots.length; bs++) {
					var battleStaticSlot = selected.battleStaticSlots[bs];
					buf += '<tr><td>' + escapeHTML(battleStaticSlot.label) + '</td><td><select class="planner-slot-select" data-section="battleStatic" data-index="' + bs + '">';
					buf += this.buildPokemonSelectOptions(pokemonOptions, battleStaticSlot.pokemonId, usage.pokemonWild, usage.pokemonTrainer);
					buf += '</select></td></tr>';
				}
				buf += '</tbody></table><p><button class="button planner-add-slot" data-slot-group="battleStatic">Add Static Slot</button></p>';
			}
			buf += '<p class="resultsub" style="margin-top:8px">⭐ used in wild/static planning elsewhere, ▲ used in trainer teams elsewhere (both remain selectable).</p>';
			buf += '</div>';
		}
		buf += '</div></div>';
		this.html(buf);
	}
});
