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
    return Records.find({ createdBy: currentUser });
});

Meteor.methods({

  updateAcademicRecordData(data) {

    const currentUser = Meteor.userId();
    var completeUpdate = true;
    var discError = false;
    data.forEach(item => {

      const existHist = Records.find({
        rga: item.rga,
        disciplina: item.disciplina,
        ano: item.ano,
        semestre: item.semestre,
        createdBy: currentUser
      }).count();
      //console.log(item.disciplina);
      const existDisc = Disciplines.find({nome: item.disciplina}).count();
      var id_disciplina=0;
      var aprov;
      if(existDisc!=0&&existHist==0){
      var disciplina = Disciplines.find({nome: item.disciplina}).fetch();
      _.each(disciplina, function(h) {
        id_disciplina=h._id;
        aprov=h.aprovacoes;
        rep=h.reprovacoes;
      });
      console.log(id_disciplina);
      console.log(aprov);
      if(item.situacao=='AP'){
        aprov=aprov+1;
      Disciplines.update({ _id: id_disciplina }, {$set: {aprovacoes:aprov} });
    }
    else{
        rep=rep+1;
      Disciplines.update({ _id: id_disciplina }, {$set: {reprovacoes:rep} });
    }
    var percent=(aprov/(aprov+rep))*100;
    Disciplines.update({ _id: id_disciplina }, {$set: {perc_ap:percent} });
  }
  // Pré-condição: Verifica se os items já estão no banco de dados
      if(existDisc==0){
        completeUpdate=2;
        return;
      }
      else {
        if (existHist !== 0) {
        completeUpdate = false;
        return; // Equivalente ao "continue" em um laço "for" explícito
      }}

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
    return completeUpdate;

  }

});
