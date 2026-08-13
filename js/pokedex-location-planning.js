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
	return (window.Trainers || []).filter(function(trainer) {
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
	return Object.keys(staticEncounters).map(function(id) {
		return staticEncounters[id];
	}).filter(function(staticEncounter) {
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

window.PokedexLocationPlanningPanel = PokedexResultPanel.extend({
	initialize: function() {
		this.shortTitle = 'Location Planning';
		this.plannerLocations = [];
		this.selectedIndex = -1;
		this.activeTab = 'obtainable';
		this.addingLocation = false;
		this.renderPlanner();
	},
	events: {
		'click .planner-add-toggle': 'showAddLocation',
		'click .planner-add-cancel': 'hideAddLocation',
		'click .planner-add-submit': 'addLocation',
		'click .planner-location-link': 'selectLocation',
		'click .planner-tabbar button': 'selectTab',
		'change .planner-slot-select': 'updateSlot',
		'click .planner-add-slot': 'addSlot'
	},
	getPokemonOptions: function() {
		var options = [];
		for (var id in BattlePokedex) {
			var mon = BattlePokedex[id];
			if (!mon || !mon.name) continue;
			options.push({id: id, name: mon.name});
		}
		options.sort(function(a, b) { return a.name.localeCompare(b.name); });
		return options;
	},
	getItemOptions: function() {
		var options = [];
		for (var id in BattleItems) {
			var item = BattleItems[id];
			if (!item || !item.name) continue;
			options.push({id: id, name: item.name});
		}
		options.sort(function(a, b) { return a.name.localeCompare(b.name); });
		return options;
	},
	getTrainerOptions: function() {
		var options = (window.Trainers || []).map(function(trainer) {
			var id = String(trainer.id || '');
			return {
				id: id,
				label: '[' + id.padStart(3, '0') + '] ' + (trainer.name || ('Trainer ' + id))
			};
		});
		options.sort(function(a, b) { return a.label.localeCompare(b.label); });
		return options;
	},
	getUsageCountsExcluding: function(skipIndex) {
		var counts = {pokemon: {}, item: {}, trainer: {}};
		var add = function(bucket, value) {
			if (!value) return;
			bucket[value] = (bucket[value] || 0) + 1;
		};
		for (var i = 0; i < this.plannerLocations.length; i++) {
			if (i === skipIndex) continue;
			var loc = this.plannerLocations[i];
			(loc.wildSlots || []).forEach(function(slot) { add(counts.pokemon, slot.pokemonId); });
			(loc.obtainableStaticSlots || []).forEach(function(slot) { add(counts.pokemon, slot.pokemonId); });
			(loc.battleStaticSlots || []).forEach(function(slot) { add(counts.pokemon, slot.pokemonId); });
			(loc.itemSlots || []).forEach(function(slot) { add(counts.item, slot.itemId); });
			(loc.trainerSlots || []).forEach(function(slot) { add(counts.trainer, slot.trainerId); });
		}
		return counts;
	},
	buildSelectOptions: function(options, currentValue, usageMap, emptyLabel) {
		var buf = '<option value="">' + escapeHTML(emptyLabel || 'None') + '</option>';
		for (var i = 0; i < options.length; i++) {
			var option = options[i];
			var usedElsewhere = !!usageMap[option.id];
			var selected = option.id === currentValue ? ' selected' : '';
			var usedLabel = usedElsewhere ? ' \u2605' : '';
			var usedStyle = usedElsewhere ? ' style="background:#f7df9f;color:#5d4300"' : '';
			buf += '<option value="' + escapeHTML(option.id) + '"' + selected + usedStyle + '>'
				+ escapeHTML(option.name || option.label || option.id) + usedLabel + '</option>';
		}
		return buf;
	},
	cloneFromExistingLocation: function(loc) {
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
			plan.trainerSlots.push({
				label: 'Trainer ' + (ti + 1),
				trainerId: String(trainers[ti].id || '')
			});
		}
		return plan;
	},
	createEmptyLocation: function(name) {
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
	showAddLocation: function(e) {
		e.preventDefault();
		this.addingLocation = true;
		this.renderPlanner();
	},
	hideAddLocation: function(e) {
		e.preventDefault();
		this.addingLocation = false;
		this.renderPlanner();
	},
	addLocation: function(e) {
		e.preventDefault();
		var selectedExisting = this.$('.planner-existing-select').val();
		var customName = (this.$('.planner-custom-name').val() || '').trim();
		var selectedPlan = null;
		if (customName) {
			selectedPlan = this.createEmptyLocation(customName);
		} else if (selectedExisting) {
			var existing = (window.Locations || []).find(function(loc) { return toID(loc.id) === selectedExisting; });
			selectedPlan = existing ? this.cloneFromExistingLocation(existing) : null;
		}
		if (!selectedPlan) return;
		this.plannerLocations.push(selectedPlan);
		this.selectedIndex = this.plannerLocations.length - 1;
		this.activeTab = 'obtainable';
		this.addingLocation = false;
		this.renderPlanner();
	},
	selectLocation: function(e) {
		e.preventDefault();
		var index = Number($(e.currentTarget).attr('data-index'));
		if (isNaN(index)) return;
		this.selectedIndex = index;
		this.renderPlanner();
	},
	selectTab: function(e) {
		e.preventDefault();
		this.activeTab = e.currentTarget.value;
		this.renderPlanner();
	},
	updateSlot: function(e) {
		var $el = $(e.currentTarget);
		var section = $el.attr('data-section');
		var index = Number($el.attr('data-index'));
		var value = $el.val() || '';
		var loc = this.plannerLocations[this.selectedIndex];
		if (!loc || isNaN(index)) return;
		if (section === 'wild' && loc.wildSlots[index]) loc.wildSlots[index].pokemonId = value;
		if (section === 'obtainableStatic' && loc.obtainableStaticSlots[index]) loc.obtainableStaticSlots[index].pokemonId = value;
		if (section === 'items' && loc.itemSlots[index]) loc.itemSlots[index].itemId = value;
		if (section === 'trainers' && loc.trainerSlots[index]) loc.trainerSlots[index].trainerId = value;
		if (section === 'battleStatic' && loc.battleStaticSlots[index]) loc.battleStaticSlots[index].pokemonId = value;
		this.renderPlanner();
	},
	addSlot: function(e) {
		e.preventDefault();
		var group = $(e.currentTarget).attr('data-slot-group');
		var loc = this.plannerLocations[this.selectedIndex];
		if (!loc) return;
		if (group === 'wild') loc.wildSlots.push({label: 'Wild Slot ' + (loc.wildSlots.length + 1), pokemonId: ''});
		if (group === 'obtainableStatic') loc.obtainableStaticSlots.push({label: 'Obtainable Slot ' + (loc.obtainableStaticSlots.length + 1), pokemonId: ''});
		if (group === 'items') loc.itemSlots.push({label: 'Item Slot ' + (loc.itemSlots.length + 1), itemId: ''});
		if (group === 'trainers') loc.trainerSlots.push({label: 'Trainer Slot ' + (loc.trainerSlots.length + 1), trainerId: ''});
		if (group === 'battleStatic') loc.battleStaticSlots.push({label: 'Static Slot ' + (loc.battleStaticSlots.length + 1), pokemonId: ''});
		this.renderPlanner();
	},
	renderPlanner: function() {
		var allLocations = window.Locations || [];
		var selected = this.plannerLocations[this.selectedIndex] || null;
		var usage = this.getUsageCountsExcluding(this.selectedIndex);
		var pokemonOptions = this.getPokemonOptions();
		var itemOptions = this.getItemOptions();
		var trainerOptions = this.getTrainerOptions();
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
			+ '.planner-slot-table th,.planner-slot-table td{padding:6px;border-bottom:1px solid #ddd;text-align:left}'
			+ '.planner-slot-table select{width:100%}'
			+ 'body.dark-mode .planner-add-box{background:#1a2740;border-color:#405a84}'
			+ 'body.dark-mode .planner-location-link{background:#17243b;border-color:#365179;color:#d9e6f8}'
			+ 'body.dark-mode .planner-location-link.cur{background:#21365a;border-color:#78a8ff}'
			+ '</style>';
		buf += '<a href="' + Config.baseurl + 'dex" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Pok&eacute;dex</a>';
		buf += '<h1><a href="' + Config.baseurl + 'location-planning/" data-target="push" class="subtle">Location Planning</a></h1>';
		buf += '<div class="planner-layout">';
		buf += '<div class="planner-actions"><button class="button planner-add-toggle">Add Location</button><span style="color:#666">Planning list starts empty and only affects this page.</span></div>';
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
					buf += this.buildSelectOptions(pokemonOptions, wildSlot.pokemonId, usage.pokemon, 'Choose Pok\u00e9mon...');
					buf += '</select></td></tr>';
				}
				buf += '</tbody></table><p><button class="button planner-add-slot" data-slot-group="wild">Add Wild Slot</button></p>';
				buf += '<h3>Static / Gift Pok&eacute;mon</h3>';
				buf += '<table class="planner-slot-table"><thead><tr><th style="width:180px">Slot</th><th>Pok&eacute;mon</th></tr></thead><tbody>';
				for (var os = 0; os < selected.obtainableStaticSlots.length; os++) {
					var obtainableSlot = selected.obtainableStaticSlots[os];
					buf += '<tr><td>' + escapeHTML(obtainableSlot.label) + '</td><td><select class="planner-slot-select" data-section="obtainableStatic" data-index="' + os + '">';
					buf += this.buildSelectOptions(pokemonOptions, obtainableSlot.pokemonId, usage.pokemon, 'Choose Pok\u00e9mon...');
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
					buf += this.buildSelectOptions(itemOptions, itemSlot.itemId, usage.item, 'Choose Item...');
					buf += '</select></td></tr>';
				}
				buf += '</tbody></table><p><button class="button planner-add-slot" data-slot-group="items">Add Item Slot</button></p>';
			}
			if (this.activeTab === 'battles') {
				buf += '<h3>Trainers</h3>';
				buf += '<table class="planner-slot-table"><thead><tr><th style="width:180px">Slot</th><th>Trainer</th></tr></thead><tbody>';
				for (var ts = 0; ts < selected.trainerSlots.length; ts++) {
					var trainerSlot = selected.trainerSlots[ts];
					buf += '<tr><td>' + escapeHTML(trainerSlot.label) + '</td><td><select class="planner-slot-select" data-section="trainers" data-index="' + ts + '">';
					buf += this.buildSelectOptions(trainerOptions, trainerSlot.trainerId, usage.trainer, 'Choose Trainer...');
					buf += '</select></td></tr>';
				}
				buf += '</tbody></table><p><button class="button planner-add-slot" data-slot-group="trainers">Add Trainer Slot</button></p>';
				buf += '<h3>Static Encounters</h3>';
				buf += '<table class="planner-slot-table"><thead><tr><th style="width:180px">Slot</th><th>Pok&eacute;mon</th></tr></thead><tbody>';
				for (var bs = 0; bs < selected.battleStaticSlots.length; bs++) {
					var battleStaticSlot = selected.battleStaticSlots[bs];
					buf += '<tr><td>' + escapeHTML(battleStaticSlot.label) + '</td><td><select class="planner-slot-select" data-section="battleStatic" data-index="' + bs + '">';
					buf += this.buildSelectOptions(pokemonOptions, battleStaticSlot.pokemonId, usage.pokemon, 'Choose Pok\u00e9mon...');
					buf += '</select></td></tr>';
				}
				buf += '</tbody></table><p><button class="button planner-add-slot" data-slot-group="battleStatic">Add Static Slot</button></p>';
			}
			buf += '<p class="resultsub" style="margin-top:8px">\u2605 options are already used in other planning locations (still selectable).</p>';
			buf += '</div>';
		}
		buf += '</div></div>';
		this.html(buf);
	}
});
