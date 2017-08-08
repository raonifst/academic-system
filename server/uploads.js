import {Meteor} from 'meteor/meteor';
import {uploadDataStatus} from "../imports/utils/status"
import Courses from '../imports/api/collections/courses'

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
});
