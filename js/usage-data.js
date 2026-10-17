// Shared usage computation for the Usage search list and Usage pages.
(function () {
  var cache = null;

  function translate(name) {
    return typeof window.translateDisplayName === 'function' ? window.translateDisplayName(name) : name;
  }
  function nameToID(name) {
    return toID(translate(name));
  }
  function getTrainerById(trainerId) {
    var padded = String(trainerId || '').padStart(3, '0');
    var trainers = window.Trainers || [];
    for (var i = 0; i < trainers.length; i++) {
      if (String(trainers[i].id || '').padStart(3, '0') === padded) return trainers[i];
    }
    return null;
  }

  // megaFormeId -> list of { base, item } needed to count it as "used"
  function buildMegaSources() {
    var sources = {};
    var megas = window.MegaEvolutions || {};
    Object.keys(megas).forEach(function (baseId) {
      megas[baseId].forEach(function (megaEvo) {
        var megaId = nameToID(megaEvo.forme);
        if (!sources[megaId]) sources[megaId] = [];
        sources[megaId].push({ base: baseId, item: toID(megaEvo.item) });
      });
    });
    return sources;
  }

  function getPreEvolutions(pokemonId, seen) {
    seen = seen || {};
    var prevos = [];
    var evolutions = window.BattleEvolutions || {};
    Object.keys(evolutions).forEach(function (evoId) {
      var list = evolutions[evoId];
      if (!Array.isArray(list)) return;
      for (var i = 0; i < list.length; i++) {
        if (toID(list[i].target) === pokemonId && !seen[evoId]) {
          seen[evoId] = true;
          prevos.push(evoId);
          prevos = prevos.concat(getPreEvolutions(evoId, seen));
          break;
        }
      }
    });
    return prevos;
  }

  function build() {
    var wildByMon = {};
    var trainerByMon = {};
    var megaSources = buildMegaSources();

    function addWild(id, entry) {
      (wildByMon[id] = wildByMon[id] || []).push(entry);
    }
    function addTrainer(id, entry) {
      (trainerByMon[id] = trainerByMon[id] || []).push(entry);
    }

    (window.Locations || []).forEach(function (loc) {
      (loc.encounters || []).forEach(function (encounter) {
        (encounter.pokemon || []).forEach(function (mon) {
          if (mon.name) {
            addWild(nameToID(mon.name), { location: loc, encounter: encounter, pokemon: mon, type: 'normal', name: translate(mon.name) });
          }
          (mon.sos || []).forEach(function (sosName) {
            addWild(nameToID(sosName), { location: loc, encounter: encounter, pokemon: { name: sosName }, type: 'sos', parentMon: mon, name: translate(sosName) });
          });
        });
        (encounter.weatherSos || []).forEach(function (sosName) {
          addWild(nameToID(sosName), { location: loc, encounter: encounter, pokemon: { name: sosName }, type: 'sos', name: translate(sosName) });
        });
      });

      // Only trainers assigned to this location in the Locations data are tracked
      var seenTrainers = {};
      (loc.trainerRefs || []).forEach(function (ref) {
        var trainer = getTrainerById(ref.id);
        if (!trainer || seenTrainers[trainer.id]) return;
        seenTrainers[trainer.id] = true;
        (trainer.team || []).forEach(function (teamMon) {
          if (!teamMon.name) return;
          var monId = nameToID(teamMon.name);
          addTrainer(monId, { trainer: trainer, location: loc, pokemon: teamMon, type: 'trainer' });
          // Mega forms count as used when the base species holds its Mega Stone
          Object.keys(megaSources).forEach(function (megaId) {
            megaSources[megaId].forEach(function (src) {
              if (src.base === monId && toID(teamMon.item) === src.item) {
                addTrainer(megaId, { trainer: trainer, location: loc, pokemon: teamMon, type: 'trainer', megaOf: teamMon.name });
              }
            });
          });
        });
      });
    });

    return { wildByMon: wildByMon, trainerByMon: trainerByMon, prevoCache: {} };
  }

  function getData() {
    if (!cache) cache = build();
    return cache;
  }

  window.getPokemonUsageDetail = function (id) {
    id = toID(id);
    var data = getData();
    if (!data.prevoCache[id]) data.prevoCache[id] = getPreEvolutions(id);
    var prevos = data.prevoCache[id];
    var direct = data.wildByMon[id] || [];
    var prevoWild = [];
    prevos.forEach(function (prevoId) {
      (data.wildByMon[prevoId] || []).forEach(function (entry) {
        prevoWild.push(Object.assign({}, entry, { prevoName: entry.name }));
      });
    });
    return {
      wild: direct.filter(function (e) { return e.type === 'normal'; }),
      sos: direct.filter(function (e) { return e.type === 'sos'; }),
      prevoWild: prevoWild,
      trainer: data.trainerByMon[id] || []
    };
  };

  window.getPokemonUsage = function (id) {
    var d = window.getPokemonUsageDetail(id);
    var wild = d.wild.length + d.sos.length;
    var trainer = d.trainer.length;
    var status = '';
    if (!wild && !trainer) status = 'unused';
    else if (!wild && trainer && !d.prevoWild.length) status = 'trainer-only';
    return { wild: wild, trainer: trainer, status: status };
  };
})();
