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
      //console.log(reinc);
      const existDisc = Disciplines.find({nome: item.disciplina}).count();
      var id_disciplina=0;
      var aprov;
      var reincidenciaaux;
      var aprovtwo;
      var alunos;
      if(existDisc!=0&&existHist==0){
      var disciplina = Disciplines.find({nome: item.disciplina}).fetch();
      _.each(disciplina, function(h) {
        id_disciplina=h._id;
        aprov=h.aprovacoes;
        rep=h.reprovacoes;
        reincidenciaaux=h.reincidencia;
        aprovtwo=h.aprov2;
        alunos=h.alunos;
      });
      if(reinc==0){
        alunos = alunos + 1;
      }
      if(item.situacao=='AP'){
        aprov=aprov+1;
        if(reinc==1){
          aprovtwo = aprovtwo+1;
        }
        Disciplines.update(
          { _id: id_disciplina },
          {$set: {aprovacoes:aprov,alunos:alunos, aprov2:aprovtwo} });
    }
    else{
      if(reinc==1){
        reincidenciaaux = reincidenciaaux+1;
      }
        rep=rep+1;
      Disciplines.update(
        { _id: id_disciplina },
        {$set: {reprovacoes:rep, reincidencia:reincidenciaaux, alunos:alunos} });
    }
    var percent=(aprov/(aprov+rep))*100;
    percent=percent.toFixed(3);
    var percentp;
    var percentl;
    if(reincidenciaaux){
      percentp=(reincidenciaaux/alunos)*100;
      percentp=percentp.toFixed(3);
  }
  else {
    percentp='-';
  }
  if(aprovtwo){
    percentl=(aprovtwo/alunos)*100;
    percentl=percentl.toFixed(3);
  }
  else{
    percentl='-';
  }
  console.log(alunos);
    Disciplines.update({ _id: id_disciplina }, {$set: {perc_ap:percent, perc_reic:percentp,perc_aprov2:percentl}});
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
