import {CsvUtils} from "../imports/utils/csvutils";

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
		var curriculars = CurricularStructure.find().fetch();
		var disciplines = Disciplines.find().fetch();

		for (var j = 0; j < curriculars.length; j++) {
			data.push([
        disciplines[j].codigo,
				disciplines[j].nome,
				disciplines[j].creditos,
				curriculars[j].semestre,
        CsvUtils.prereqArrayToString(curriculars[j].prereq)
			]);
		}

		return {fields: fields, data: data};
	}
});
