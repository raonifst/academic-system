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
      const reinc = Records.find({
        rga: item.rga,
        disciplina: item.disciplina,
        createdBy: currentUser
      }).count();
      //console.log(item.disciplina);
      const existDisc = Disciplines.find({nome: item.disciplina}).count();
      var id_disciplina=0;
      var aprov;
      var reincidenciaaux=0;
      var aprovtwo=0;
      if(existDisc!=0&&existHist==0){
      var disciplina = Disciplines.find({nome: item.disciplina}).fetch();
      _.each(disciplina, function(h) {
        id_disciplina=h._id;
        aprov=h.aprovacoes;
        rep=h.reprovacoes;
        reincidenciaaux:h.reincidencia;
        aprovtwo:h.aprov2;
      });

      //console.log(id_disciplina);
      //console.log(aprov);
      if(item.situacao=='AP'){
        aprov=aprov+1;
        if(reinc==2){
          aprovtwo = aprovtwo+1;
        }
        Disciplines.update({ _id: id_disciplina }, {$set: {aprovacoes:aprov, aprov2:aprovtwo} });
    }
    else{
      if(reinc>=2){
        reincidenciaaux = reincidenciaaux+1;
      }
        rep=rep+1;
      Disciplines.update({ _id: id_disciplina }, {$set: {reprovacoes:rep, reincidencia:reincidenciaaux} });
    }
    var percent=(aprov/(aprov+rep))*100;
    percent=percent.toFixed(3);
    var percentp;
    if((aprovtwo+reincidenciaaux>0)){
      percentp=(aprovtwo/(aprovtwo+reincidenciaaux))*100;
      console.log(percentp)
      percentp=percentp.toFixed(3);
  }
  else {
    percentp='-';
  }
    Disciplines.update({ _id: id_disciplina }, {$set: {perc_ap:percent, perc_reic:percentp}});
  }
  // Pré-condição: Verifica se os items já estão no banco de dados
      if(existDisc == 0){
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
