import {Meteor} from 'meteor/meteor';

//Records = new Meteor.Collection('record');

import '../imports/api/server/publications.js'
import '../imports/api/server/permissions.js'
import './uploadacademicrecord.js'
import './uploadcurricularstructure.js'
import {defaultDisciplinesList} from "../imports/utils/defaultdisciplineslist";


Meteor.startup(() => {

  /*
     Solução provisória: não há registro de usuários.
     Quando o sistema 'sobe' e não há usuarios cadastrados,
     o usuário a seguir é cadastrado.
  */
  if (!Meteor.users.find().count()) {

    const usr = Accounts.createUser({
      email: 'raoni@ufmt.br',
      password: '123'
    });
    Users.insert({
      idUser: usr,
      course: "Engenharia de Computação",
      name: "Fabricio Barbosa de Carvalho",
      changedDefaultPassword: false,
      uploadedCurricularStructure: false,
      uploadedAcademicRecords: false,
      currentYear: null,
      currentSemester: null
    });
  }

  if (!Courses.find().count()) {
    Courses.insert(defaultDisciplinesList);
  }

});


Meteor.methods({

  changeUserPassword: function (newPassword) {
    const currentUser = Meteor.userId();

    if (!currentUser) {
      throw new Meteor.Error("not-logged-in", "You're not logged-in.");
    }

    Accounts.setPassword(currentUser, newPassword, {logout: false});
    console.log("A senha do usuario " + currentUser + " foi alterada.");
  },

  isFirstLogin() {
    const currentUser = Meteor.userId();
    return !(Users.findOne({ idUser: currentUser }).changedDefaultPassword);
  },

  isFirstTimeHere() {
    const currentUser = Meteor.userId();
    return !(Users.findOne({ idUser: currentUser }).receivedStartupTip);
  },

  changeFirstLogin() {
    const currentUser = Meteor.userId();
    const registry = Users.findOne({ idUser: currentUser });
    if (registry) {
      Users.update({
        idUser: currentUser },
        {
          $set: { changedDefaultPassword: true }
        });
    }
  },

  changeUserUploadCurricularStructureFlag() {
    const currentUser = Meteor.userId();
    const registry = Users.findOne({ idUser: currentUser });
    if (registry) {
      const val = Users.findOne({ idUser: currentUser }).uploadedCurricularStructure;
      Users.update({
        idUser: currentUser },
        {
          $set: { uploadedCurricularStructure: !val }
        });
    }
  },

  changeUserUploadAcademicRecordsFlag() {
    const currentUser = Meteor.userId();
    const registry = Users.findOne({ idUser: currentUser });
    if (registry) {
      const val = Users.findOne({ idUser: currentUser }).uploadedAcademicRecords;
      Users.update({
        idUser: currentUser },
        {
          $set: { uploadedAcademicRecords: !val }
        });
    }
  },

  changeCurrentSemester(data, reset_flag) {

    var cSemester = null, cYear = null;
    const currentUser = Meteor.userId();
    const registry = Users.findOne({ idUser: currentUser });

    const semesterParser = function (n) { return ((n + 1) % 2) + 1; };

    if (registry) {
      if (!reset_flag) {
        cSemester = semesterParser(data.semestre + 1);
        cYear = (cSemester == 1) ? data.ano + 1 : data.ano;
      }
      Users.update({
        idUser: currentUser },
        {
          $set: { currentYear: cYear, currentSemester: cSemester }
        });
    }
    console.log('Semestre atual alterado para ' + cYear + '/' + cSemester);
  }

});

