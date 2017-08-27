import {Meteor} from 'meteor/meteor';
import {uploadDataStatus} from "../imports/modules/status"
import Courses from '../imports/api/collections/courses'
import Records from '../imports/api/collections/records'
import '../imports/modules/auxiliar'
import {approvedAndRecidivists} from "../imports/modules/auxiliar";

Meteor.methods({
  uploadCoursesData(data) {
    var resultCode = uploadDataStatus.SUCCESS;
    data.forEach(item => {
      // Pré-condição: Verifica se os items já estão no banco de dados
      if (Courses.findOne({ codigo: item.codigo, createdBy: Meteor.userId() })) {
        resultCode = uploadDataStatus.WARNINGS;
        return; // Equivalente ao "continue" em um laço "for" explícito
      }
      Courses.insert(item);
    });
    return resultCode;
  },

  updateRecordsData(data) {
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

  changeUploadCoursesFlag() {
    const currentUser = Meteor.user();
    const serverLog = function (id, value) {
      return "Flag de upload de estrutura curricular (usuário " + id + ") alterado para: " + value;
    };
    if (currentUser) {
      const boolVal = Courses.findOne({ createdBy: currentUser._id }) !== undefined;
      Meteor.users.update({ _id: currentUser._id },
        {
          $set: { uploadCoursesFlag: boolVal }
        });
      console.log(serverLog(currentUser._id, boolVal));
    }
  },

  changeUploadRecordsFlag() {
    const currentUser = Meteor.user();
    const serverLog = function (id, value) {
      return "Flag de upload de histórico acadêmico (usuário " + id + ") alterado para: " + value;
    };
    if (currentUser) {
      const boolVal = Records.findOne({ createdBy:currentUser._id }) !== undefined;
      Meteor.users.update({ _id: currentUser._id },
        {
          $set: { uploadRecordsFlag: boolVal }
        });
      console.log(serverLog(currentUser._id, boolVal));
    }
  },

  changeCurrentSemester(resetFlag) {
    var cSemester = "-";
    var cYear = "-";
    const currentUser = Meteor.user();
    const semesterParser = function (n) { return ((n + 1) % 2) + 1; };
    const serverLog = function (id, year, semester) {
      return "Semestre atual (usuário " + id + ") alterado para " + year + "/" + semester;
    };
    if (currentUser) {
      if (!resetFlag) {
        const record = Records.findOne({ createdBy: currentUser._id },
          { sort: { ano: -1, semestre: -1} }); // Devolve o registro mais recente
        if (!record)
          throw new Meteor.Error("records-empty", "Operação não permitida. " +
                                                  "Não há registros no histórico acadêmico.");
        cSemester = semesterParser(record.semestre + 1);
        cYear = (cSemester == 1) ? record.ano + 1 : record.ano;
      }
      Meteor.users.update({ _id: currentUser._id },
        {
          $set: { currentYear: cYear, currentSemester: cSemester }
        });
      console.log(serverLog(currentUser._id, cYear, cSemester));
    }
  }
});
