import {defaultDisciplinesList} from "../../imports/utils/defaultdisciplineslist";
import {defaultAlertTimeList} from "../../imports/utils/defaultbertopt";

import '../main.html'
import '../main.js'


Template.mainsettings.onCreated(function () {

  this.subscribe('courses');
  this.subscribe('userStats');

});


Template.mainsettings.onRendered(function () {
  $(document).ready(function() {
    $('select').material_select();
  });
});


Template.mainsettings.helpers({

  userName: function () {
    const currentUser = Meteor.userId();
    const usr = Users.findOne({ idUser: currentUser });
    return usr ? usr.name : "User not found";
  },

  course: function () {
    // TODO corrigir erro no helper que não retorna os dados contigos na collection Course
    //return Courses.find({}, { sort: {name: 1} }).fetch();
    return defaultDisciplinesList; // Solução provisória
  },

  alertsTime: function () {
    return defaultAlertTimeList;
  },

  isCoureSelected: function () {
    const courseName = this.name;
    const currentUser = Meteor.userId();
    const usr = Users.findOne({ idUser: currentUser });
    if (usr) {
      if (usr.course == courseName)
        return "selected";
    }
  },

  isAlertTimeSelected: function () {
    const time = this.value;
    const currentUser = Meteor.userId();
    const usr = Users.findOne({ idUser: currentUser });
    if (usr) {
      if (usr.durationAlerts == time)
        return "selected";
    }
  }

});


Template.mainsettings.events({

  'submit form': function (event) {
    event.preventDefault();
    const selectedName = $('[name="name"]').val();
    const selectedCourse = $('[name="courses"]').val();
    const selectedTime = parseInt($('[name="alerts_time"]').val());
    const currentUser = Meteor.userId();
    const reg = Users.findOne({ idUser: currentUser });
    if (reg) {
      Bert.defaults.hideDelay = selectedTime;
      Users.update({ _id: reg._id },
        {
          $set: { name: selectedName, course: selectedCourse, durationAlerts: selectedTime }
        });
      Bert.alert('Configurações atualizadas!', 'success', 'growl-top-right');
    }
  }

});
