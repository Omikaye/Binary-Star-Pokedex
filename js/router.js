var Pokedex = Panels.App.extend({
	topbarView: Topbar,
	backButtonPrefix: '<i class="fa fa-chevron-left"></i> ',
	states2: {
		'pokemon/:pokemon': PokedexPokemonPanel,
		'pokeedit/:pokemon': PokedexPokeeditPanel,
		'moves/:move': PokedexMovePanel,
		'items/:item': PokedexItemPanel,
		'abilities/:ability': PokedexAbilityPanel,
		'types/:type': PokedexTypePanel,
		'categories/:category': PokedexCategoryPanel,
		'tags/:tag': PokedexTagPanel,
		'egggroups/:egggroup': PokedexEggGroupPanel,
		'tiers/:tier': PokedexTierPanel,
		'articles/:article': PokedexArticlePanel,
		'trainers/:id': PokedexTrainerPanel,
		'encounters/:id': PokedexStaticEncounterPanel,
        'locations/:locid': PokedexLocationPanel,
		'location-planning/': PokedexLocationPlanningPanel,
		'usage/:pokemon': PokedexUsagePanel,

		'': PokedexHomePanel,
		'dex': PokedexSearchPanel,
		'pokemon/': PokedexSearchPanel,
		'pokeedit/': PokedexSearchPanel,
		'moves/': PokedexSearchPanel,
		'abilities/': PokedexSearchPanel,
		'items/': PokedexSearchPanel,
		'mechanics/': PokedexSearchPanel,
		'locations/': PokedexLocationsPanel,
		'location-planning/': PokedexLocationPlanningPanel,
		'trainers/': PokedexSearchPanel,
		'encounters/': PokedexSearchPanel,
		'usage/': PokedexSearchPanel,
		':q': PokedexSearchPanel
	},
	initialize: function() {
		this.routePanel('*path', PokedexSearchPanel); // catch-all default

		let root = Config.baseurl.slice(1);
		for (var i in this.states2) {
			this.routePanel(root + i, this.states2[i]);
		}
	}
});
var pokedex = new Pokedex();
