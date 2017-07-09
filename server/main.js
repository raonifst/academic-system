import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check'

//Records = new Meteor.Collection('record');

import './uploadacademicrecord.js'
import './uploadcurricularstructure.js'


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
      changedDefaultPassword: false,
      uploadedCurricularStructure: false,
      uploadedAcademicRecords: false,
    });
  }

});


Meteor.methods({

  changeUserPassword: function (newPassword) {
    const currentUser = Meteor.userId();

    if (!currentUser) {
      throw new Meteor.Error("not-logged-in", "You're not logged-in.");
    }

    Accounts.setPassword(currentUser, newPassword, {logout: false});
    console.warn(new Date(), ': A senha do usuario', currentUser, ' foi alterada.');
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
    const changedPass = Users.findOne({ idUser: currentUser }).changedDefaultPassword;
    if (!changedPass) {
      Users.update({ idUser: currentUser }, {$set: { changedDefaultPassword: true }});
    }
  },

  changeUserUploadCurricularStructureFlag() {
    const currentUser = Meteor.userId();
    const changedPass = Users.findOne({ idUser: currentUser }).uploadedCurricularStructure;
    if (!changedPass) {
      Users.update({ idUser: currentUser }, {$set: { uploadedCurricularStructure: true }});
    }
  },

  changeUserUploadAcademicRecordsFlag() {
    const currentUser = Meteor.userId();
    const changedPass = Users.findOne({ idUser: currentUser }).uploadedAcademicRecords;
    if (!changedPass) {
      Users.update({ idUser: currentUser }, {$set: { uploadedAcademicRecords: true }});
    }
  },

});


Meteor.publish('userStats', function () {
  return Users.find({ idUser: this.userId });
});
