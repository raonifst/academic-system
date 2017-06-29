import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';

CurricularStructure = new Meteor.Collection('curricularstructure');

/* Formato dos dados
{
  codigo: 90000008,
  nome: CÁLCULO II,
  semestre: 2,
  creditos: 4,
  prereq1: CÁLCULO I,
  prereq2: null,
  prereq3: null,
}*/

Meteor.methods({
  uploadCurricularStruture( data ) {
    check( data, Array );
    const currentUser = Meteor.userId();

    data.forEach(item => {
      exists = CurricularStructure.find({
                 disciplina: item.disciplina,
                 semestre: item.semestre,
                 createdBy: currentUser
      }).count();

      if ( !exists ) {
        CurricularStructure.insert({
                 codigo: item.codigo,
                 nome: item.nome,
                 semestre: item.semestre,
                 creditos: item.creditos,
                 prereq1: item.prereq1,
                 prereq2: item.prereq2,
                 prereq3: item.prereq3,
                 createdBy: currentUser
        });
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
