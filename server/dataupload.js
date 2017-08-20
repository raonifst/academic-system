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
      const existCurr = Courses.find({
        codigo: item.codigo,
        createdBy: Meteor.userId()
      }).count();
      // Pré-condição: Verifica se os items já estão no banco de dados
      if (existCurr !== 0) {
        console.log(item.createdBy);
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
      console.log("é noix");
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
    if (currentUser) {
      const val = Courses.findOne({createdBy:currentUser._id});
      if(val) {
        Meteor.users.update({ _id: currentUser._id },
          {
            $set: { uploadCoursesFlag: true }
          });
          console.log("Flag de upload de estrutura curricular alterado para: true");
      }
      else {
        Meteor.users.update({ _id: currentUser._id },
          {
            $set: { uploadCoursesFlag: false }
          });
          console.log("Flag de upload de estrutura curricular alterado para: false");
      }
    }
  },

  changeUploadRecordsFlag() {
    const currentUser = Meteor.user();
    if (currentUser) {
      const val = Records.findOne({createdBy:currentUser._id});
      if(val) {
        Meteor.users.update({ _id: currentUser._id },
          {
            $set: { uploadRecordsFlag: true }
          });
          console.log("Flag de upload de histórico acadêmico alterado para: true");
      }
      else {
        Meteor.users.update({ _id: currentUser._id },
          {
            $set: { uploadRecordsFlag: false }
          });
          console.log("Flag de upload de histórico acadêmico alterado para: false");
      }
    }
  },

  changeCurrentSemester(resetFlag) {
    var cSemester = "-";
    var cYear = "-";
    const currentUser = Meteor.user();

    const semesterParser = function (n) { return ((n + 1) % 2) + 1; };

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
      console.log('Semestre atual alterado para ' + cYear + '/' + cSemester);
    }
  }
});
