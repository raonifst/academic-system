
Meteor.methods({
	exportAllRecords: function() {
		var fields = [
			"rga",
			"nome",
			"disciplina",
			"situacao",
			"ano",
			"semestre"
		];

		var data = [];

		var records = Records.find().fetch();
		_.each(records, function(h) {
			data.push([
				h.rga,
				h.nome,
				h.disciplina,
				h.situacao,
				h.ano,
				h.semestre
			]);
		});

		return {fields: fields, data: data};
	}
});
