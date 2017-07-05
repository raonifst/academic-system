
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
		var aux = [];
		var i=0;
		var curricular = CurricularStructure.find().fetch();
		var disciplina = Disciplines.find().fetch();
		/*_.each(curricular, function(h) {
			aux.push([
				h.semestre,
				h.prereq
			]);
		})*/
		_.each(disciplina, function(p) {
			data.push([
				p.codigo,
				p.nome,
				p.creditos//,
				//aux[i]
			]);
			//i=i+1;
		})
		return {fields: fields, data: data};
	}
});
