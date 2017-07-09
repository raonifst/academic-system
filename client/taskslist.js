import {Template} from 'meteor/templating';

import './taskslist.html'


Meteor.subscribe('userStats');


Template.taskslist.helpers({

  checkTask1: function () {
    const currentUserId = Meteor.userId();
    if (currentUserId) {
      if (Users.findOne({ idUser: currentUserId }).changedDefaultPassword)
        return "checked";
    }
  },

  checkTask2: function () {
    const currentUserId = Meteor.userId();
    if (currentUserId) {
      if (Users.findOne({ idUser: currentUserId }).uploadedCurricularStructure)
        return "checked";
    }
  },

  checkTask3: function () {
    const currentUserId = Meteor.userId();
    if (currentUserId) {
      if (Users.findOne({ idUser: currentUserId }).uploadedAcademicRecords)
        return "checked";
    }
  }

});
