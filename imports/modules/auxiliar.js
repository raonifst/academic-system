import {Meteor} from 'meteor/meteor';
import Courses from '../../imports/api/collections/courses'
import Records from '../../imports/api/collections/records'

function reinc(item) {
  const currentUserId = Meteor.userId();
  return Records.find({
    rga: item.rga,
    disciplina: item.disciplina,
    createdBy: currentUserId
  }).count();
}

updateCoursesRemoveRecords = function updateCoursesRemoveRecords(currentUserId) {
  Courses.update({ createdBy: currentUserId }, { $set:
  { perc_ap:      0,
    perc_reic:    0,
    perc_aprov2:  0,
    reprovacoes:  0,
    aprovacoes:   0,
    alunos:       0}}, {multi: true});
}

export function approvedAndRecidivists(item) {
  var idDisciplina, aprov, rep, reincidenciaAux, aprovtwo, alunos;
  //console.log(item); /* Descomente p/ debug */

  var disciplina = Courses.findOne({nome: item.disciplina});
  if (!disciplina) return;

  idDisciplina = disciplina._id;
  aprov = disciplina.aprovacoes;
  rep = disciplina.reprovacoes;
  reincidenciaAux = disciplina.reincidencia;
  aprovtwo = disciplina.aprov2;
  alunos = disciplina.alunos;

  var reincident = reinc(item);
  if (reincident == 0) {
    alunos = alunos + 1;
  }

  if (item.situacao == 'AP') {
    aprov++;
    if (reincident == 1) {
      aprovtwo++;
    }
    Courses.update(
      { _id: idDisciplina },
      { $set: { aprovacoes: aprov, alunos: alunos, aprov2: aprovtwo } });
  } else {
    if (reincident == 1) {
      reincidenciaAux++;
    }
    rep++;
    Courses.update({ _id: idDisciplina }, { $set:
    { reprovacoes: rep,
      reincidencia: reincidenciaAux,
      alunos: alunos }
    });
  }

  var percent = (aprov/(aprov+rep))*100;
  percent = percent.toFixed(2);
  var percentp, percentl;
  if (reincidenciaAux) {
    percentp = (reincidenciaAux/alunos)*100;
    percentp = percentp.toFixed(2);
  } else {
    percentp = 0;
  }
  if (aprovtwo) {
    percentl = (aprovtwo/alunos)*100;
    percentl = percentl.toFixed(2);
  } else {
    percentl = 0;
  }
  Courses.update({ _id: idDisciplina }, { $set:
  { perc_ap:      percent,
    perc_reic:    percentp,
    perc_aprov2:  percentl }
  });
}
