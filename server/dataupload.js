import {Meteor} from 'meteor/meteor';
import {uploadDataStatus} from "../imports/modules/status"
import Courses from '../imports/api/collections/courses'
import Records from '../imports/api/collections/records'
import '../imports/modules/auxiliar'
import {approvedAndRecidivists} from "../imports/modules/auxiliar";

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
    var resultCode = uploadDataStatus.SUCCESS;

    data.forEach(item => {
      const existHist = Records.find({
        rga: item.rga,
        disciplina: item.disciplina,
        ano: item.ano,
        semestre: item.semestre,
        createdBy: Meteor.userId()
      }).count();

      const existDisc = Courses.find({ nome: item.disciplina }).count();

      if (existDisc !=0 && existHist == 0) {
        //Dados de cada disicplina
        console.log("reincidencia");
        approvedAndRecidivists(item);
      }
      // Pré-condição: Verifica se os items já estão no banco de dados
      if (existDisc == 0) {
        console.log("não inseriu dados");
        resultCode = uploadDataStatus.ERROR;
        return;
      } else if (existHist !== 0) {
        resultCode = uploadDataStatus.WARNINGS;
        return; // Equivalente ao "continue" em um laço "for" explícito
      }

      Records.insert(item);
    });
    return resultCode;
  },

  changeUserUploadCurricularStructureFlag() {
    const currentUser = Meteor.userId();
    const user = Meteor.users.findOne({ _id: currentUser });
    if (user) {
      const val = Meteor.users.findOne({ _id: currentUser }).uploadCoursesFlag;
      Meteor.users.update({ _id: currentUser },
        {
          $set: { uploadCoursesFlag: !val }
        });
      console.log("Flag de upload de estrutura curricular alterado para: " + !val);
    }
  },

  changeUserUploadAcademicRecordsFlag() {
    const currentUser = Meteor.userId();
    const user = Meteor.users.findOne({ _id: currentUser });
    if (user) {
      const val = Meteor.users.findOne({ _id: currentUser }).uploadRecordsFlag;
      Meteor.users.update({ _id: currentUser },
        {
          $set: { uploadRecordsFlag: !val }
        });
      console.log("Flag de upload de histórico acadêmico alterado para: " + !val);
    }
  },

  changeCurrentSemester(resetFlag) {
    var cSemester = "-";
    var cYear = "-";
    const currentUser = Meteor.userId();
    const user = Meteor.users.findOne({ _id: currentUser });

    const semesterParser = function (n) { return ((n + 1) % 2) + 1; };

    if (user) {
      if (!resetFlag) {
        const record = Records.findOne({ createdBy: currentUser },
          { sort: { ano: -1, semestre: -1} }); // Devolve o registro mais recente
        if (!record)
          throw new Meteor.Error(403, "Operação não permitida. Não há registros no histórico" +
            " acadêmico.");
        cSemester = semesterParser(record.semestre + 1);
        cYear = (cSemester == 1) ? record.ano + 1 : record.ano;
      }
      Meteor.users.update({ _id: currentUser },
        {
          $set: { currentYear: cYear, currentSemester: cSemester }
        });
      console.log('Semestre atual alterado para ' + cYear + '/' + cSemester);
    }
  }
});
