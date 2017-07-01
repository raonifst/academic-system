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

      const existDisc = Disciplines.find({ nome: item.nome }).count();

      // Pré-condição: Verifica se os items já estão no banco de dados
      if (existCurr !== 0 || existDisc !== 0) {
        console.warn('Rejected. This item already exists.');
        return; // Equivalente ao "continue" em um laço "for" explícito
      }

      const idDisciplina = Disciplines.insert({
        codigo: item.codigo,
        nome: item.nome,
        creditos: parseInt(item.creditos)
      });

      // Array de pré-requisitos:
      // Deve conter os IDs das disciplinas pré-requisitos da disciplina em questão na estrutura
      // curricular. Caso
      var prereqArray = item.prereq.split("; ");
      if (prereqArray.length === 1 && prereqArray[0].localeCompare("") === 0) // Sem pré-requisitos
        prereqArray = [];
      else {
        prereqArray.forEach(function (item, i) {
          const discipline = Disciplines.findOne({ nome: item });
          prereqArray[i] = (discipline != null) ? discipline._id : null;
        });
      }

      CurricularStructure.insert({
        idDisciplina: idDisciplina,
        semestre: parseInt(item.semestre),
        prereq: prereqArray,
        createdBy: currentUser
      });

    });
  },

  showCurricularStructure() {
    console.log(CurricularStructure.find().count());
    console.log(CurricularStructure.find().fetch());
  },

  showDisciplines() {
    console.log(Disciplines.find().count());
    console.log(Disciplines.find().fetch());
  }

});
