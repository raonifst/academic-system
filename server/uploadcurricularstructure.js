import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';


// Coleção contendo a estrutura curricular de cada disciplina
CurricularStructure = new Meteor.Collection('curricularstructure');

// Coleção contendo as disciplinas registradas
Disciplines = new Meteor.Collection('disciplines');


/* Formato dos dados das coleções (exemplo):

 Disciplines:
 {
   _id: HYXZ
   codigo: 90000007,
   nome: CÁLCULO I,
   creditos: 4
 }
 {
   _id: XYZ8
   codigo: 90000008,
   nome: CÁLCULO II,
   creditos: 4
 }

 CurricularStructure:
 {
   _id: ...
   idDisciplina: HYXZ
   semestre: 1,
   prereq: [ ]
 }
 {
   _id: ...
   idDisciplina: XYZ8
   semestre: 2,
   prereq: [ HYXZ ]
 }
 */

Meteor.methods({

  uploadCurricularStruture( data ) {
    check( data, Array );
    const currentUser = Meteor.userId();

    data.forEach(item => {
      const existCurr = CurricularStructure.find({
        nome: item.nome,
        createdBy: currentUser
      }).count();
      const existDisc = Disciplines.find({
        nome: item.nome
      }).count();

      if ( existCurr === 0 && existDisc === 0) {

        const idDisciplina = Disciplines.insert({
          codigo: item.codigo,
          nome: item.nome,
          creditos: parseInt(item.creditos)
        });
        // TODO retirar esta linha após testes concluídos.
        console.log("Added discipline: " + idDisciplina);

        const prereq1 = Disciplines.findOne({ nome: item.prereq1 });
        const prereq2 = Disciplines.findOne({ nome: item.prereq2 });
        const prereq3 = Disciplines.findOne({ nome: item.prereq3 });

        const idCurrStr = CurricularStructure.insert({
          idDisciplina: idDisciplina,
          semestre: parseInt(item.semestre),
          prereq1: (prereq1) ? prereq1._id : null,
          prereq2: (prereq2) ? prereq1._id : null,
          prereq3: (prereq3) ? prereq1._id : null,
          createdBy: currentUser
        });
        // TODO retirar esta linha após testes concluídos.
        console.log("Added structure: " + idCurrStr);

      } else {
        console.warn('Rejected. This item already exists.');
      }
    });
  },

  showCurricularStructure() {
    console.log(CurricularStructure.find().count());
    console.log(CurricularStructure.find().fetch());
  }

});
