import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Records = new Meteor.Collection('record');
/*
Formato dos dados
{
	rga: 201501010101,
	nome: Nome Sobrenome,
	disciplina: Cálculo I,
	situacao: AP (e.g., AP, RM, RF, RMF),
	ano: 2016,
	semestre: 1 (e.g., 1, 2),
}
*/

Meteor.methods({
	updateAcademicRecordData( data ) {
	    check( data, Array );
	    var currentUser = Meteor.userId();


	    for ( var i = 0; i < data.length; i++ ) {

	    	var item = data[ i ];

	    	count = Records.find({ rga: item.rga,
	      	  						disciplina: item.disciplina,
	      	  						ano: item.ano,
	      	  						semestre: item.semestre,
	      	  						createdBy: currentUser }).count();	      	
	    	if ( count == 0 ) {
	      		var record = {
	       			"rga": item.rga,
	       			"nome": item.nome,
	       			"disciplina": item.disciplina,
	       			"situacao": item.situacao,
	       			"ano": item.ano,
	       			"semestre": item.semestre,
	        		createdBy: currentUser
	    		};
	    		Records.insert(record);
	    	} else {

	    		console.warn( 'Rejected. This item already exists.' );
	    	}
	    }

	},
	showRecord() {
		console.log(Records.find().count());
		console.log(Records.find().fetch());
	}
});
