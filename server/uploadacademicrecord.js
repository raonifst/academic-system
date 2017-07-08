import {Meteor} from 'meteor/meteor';

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
Meteor.publish('record', function(){
    var currentUser = this.userId;
    console.log(currentUser);
    return Records.find({ createdBy: currentUser });
});

Meteor.methods({

  updateAcademicRecordData(data) {

    const currentUser = Meteor.userId();
    var completeUpdate = true;

    data.forEach(item => {

      const existHist = Records.find({
        rga: item.rga,
        disciplina: item.disciplina,
        ano: item.ano,
        semestre: item.semestre,
        createdBy: currentUser
      }).count();

      // Pré-condição: Verifica se os items já estão no banco de dados
      if (existHist !== 0) {
        completeUpdate = false;
        return; // Equivalente ao "continue" em um laço "for" explícito
      }

      Records.insert({
        "rga": item.rga,
        "nome": item.nome,
        "disciplina": item.disciplina,
        "situacao": item.situacao,
        "ano": item.ano,
        "semestre": item.semestre,
        createdBy: currentUser
      });

    });
    return (completeUpdate) ? 0 : 1;

  },

  showRecord() {
    console.log(Records.find().count());
    console.log(Records.find().fetch());
  }

});
