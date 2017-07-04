import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';

/* Formato dos dados
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
  updateAcademicRecordData(data) {
    check(data, Array);
    const currentUser = Meteor.userId();

    data.forEach(item => {
      if (!Records.find({
          rga: item.rga,
          disciplina: item.disciplina,
          ano: item.ano,
          semestre: item.semestre,
          createdBy: currentUser
        }).count()) {
        Records.insert({
          "rga": item.rga,
          "nome": item.nome,
          "disciplina": item.disciplina,
          "situacao": item.situacao,
          "ano": item.ano,
          "semestre": item.semestre,
          createdBy: currentUser
        });
        
      } else {
        console.warn('Rejected. This item already exists.');
      }
    });

  },
  showRecord() {
    console.log(Records.find().count());
    console.log(Records.find().fetch());
  }
});
