
Meteor.methods({
	exportAllCurricular: function() {
		var fields = [
			"codigo",
			"nome",
			"creditos",
			"semestre",
			"prereq"
		];

		var data = [];
		var sem = [];
		var pre = [];
		var i=0;
		var curricular = CurricularStructure.find().fetch();
		var disciplina = Disciplines.find().fetch();
		_.each(curricular, function(h) {
			sem.push([
				h.semestre
			]);
		})

		_.each(curricular, function(l) {
			pre.push([
				l.prereq
			]);
		})


		_.each(disciplina, function(p) {
			data.push([
				p.codigo,
				p.nome,
				p.creditos,
				sem[i],
				pre[i]
			]);
			i=i+1;
		})
		return {fields: fields, data: data};
	}
});
