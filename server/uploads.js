import {Meteor} from 'meteor/meteor';
import {uploadDataStatus} from "../imports/modules/status"
import Courses from '../imports/api/collections/courses'
import Records from '../imports/api/collections/records'
import '../imports/modules/auxiliar'
Meteor.methods({
  uploadCurricularStruture(data) {
    var resultCode = uploadDataStatus.SUCCESS;

    data.forEach(item => {
      const existCurr = Courses.find({
        codigo: item.codigo,
        createdBy: Meteor.userId()
      }).count();

      // Pré-condição: Verifica se os items já estão no banco de dados
      if (existCurr !== 0) {
        resultCode = uploadDataStatus.WARNINGS;
        return; // Equivalente ao "continue" em um laço "for" explícito
      }

      // Cria o array de pré-requisitos com base no _id das disciplinas já inseridas no banco
      for (var i = 0; i < item.prereq.length; i++) {
        const course = Courses.findOne({ codigo: item.prereq[i] });
        if (course)
          item.prereq[i] = course._id;
        else {
          resultCode = uploadDataStatus.ERROR; // Disciplina é inválida
          break;
        }
      }

      if (resultCode == uploadDataStatus.ERROR)
        return;

      Courses.insert(item);
    });
    return resultCode;
  },

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
      const existDisc = Courses.find({nome: item.disciplina}).count();
      console.log(existDisc);
      if(existDisc!=0&&existHist==0){
  //Dados de cada disicplina
      console.log("reincidencia");
      ApprovedAndRecidivists(item);
    }
  // Pré-condição: Verifica se os items já estão no banco de dados
      if(existDisc == 0){
        console.log("não inseriu dados");
        completeUpdate=2;
        return;
      }
      else {
        if (existHist !== 0) {
        completeUpdate = false;
        return; // Equivalente ao "continue" em um laço "for" explícito
        }
      }

      Records.insert(item);
    });
    return completeUpdate;
  },
});
