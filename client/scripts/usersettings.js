import {Meteor} from "meteor/meteor";
import Default from "../../imports/modules/defaults";
import Settings from "../../imports/modules/settings";

/*-------------------- PROFILE SETTINGS --------------------*/
Template.profilesettings.onRendered(function () {
  $(document).ready(function() {
    $('select').material_select();
  });
});

Template.profilesettings.helpers({
  userName() {
    const currentUser = Meteor.user();
    return (currentUser && currentUser.name) ? currentUser.name : "User not found";
  },

  course() {
    return Default.gradProgramsList;
  },

  alertsTime() {
    return Default.alertTimeList;
  },

  isCoureSelected() {
    const currentUser = Meteor.user();
    if (currentUser) {
      const gradProgramName = this.name;
      if (currentUser.gradProgram == gradProgramName)
        return "selected";
    }
  },

  isAlertTimeSelected() {
    const currentUser = Meteor.user();
    if (currentUser) {
      const time = this.value;
      if (currentUser.durationAlerts == time)
        return "selected";
    }
  }
});

Template.profilesettings.events({
  'submit form': function (event) {
    event.preventDefault();
    const name = $('[name="name"]').val();
    const gradProgram = $('[name="courses"]').val();
    const time = parseInt($('[name="alerts_time"]').val());
    Meteor.call('updateProfile', name, gradProgram, time, (error, results) => {
      if (error) {
        Bert.alert(e.reason, 'danger', 'growl-top-right');
      } else {
        Bert.defaults.hideDelay = time;
        Bert.alert('Configurações atualizadas!', 'success', 'growl-top-right');
      }
    });
  }
});

/*-------------------- ACCOUNT SETTINGS --------------------*/
Template.settings.events({
  'submit #changepassform': function (event) {
    Settings.changePassword(event, false);
  }
});
