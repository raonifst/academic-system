import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import {defaultAlertTimeList, defaultGradProgramsList} from "../../imports/modules/defaults";

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
    return defaultGradProgramsList;
  },

  alertsTime() {
    return defaultAlertTimeList;
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
    const currentUser = Meteor.user();
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
Template.accountsettings.onRendered(function(){
  $('.changepassform').validate({
    onkeyup: false,
    keypress: false,
    errorPlacement(error, element) {
      Bert.alert(error.text(), 'danger', 'growl-top-right');
    },
    submitHandler(event) {
      const oldPassword = $('[name=oldpassword]');
      const newPassword = $('[name=password]');
      const newPassword2 = $('[name=password2]');
      /*console.log(oldPassword.val());
      if (newPassword.val() != newPassword2.val())
        Bert.alert('As senhas precisam ser iguais', 'danger', 'growl-top-right');
      else*/
      Accounts.changePassword(oldPassword.val(), newPassword.val(), function (error) {
        if (error) {
          if (error.reason === "User not found") {
            Bert.alert('Usuário não cadastrado', 'danger');
          }
          else if (error.reason === "Incorrect password") {
            Bert.alert('Senha incorreta', 'danger', 'growl-top-right');
          }
        } else {
          Bert.alert('Senha alterada!', 'success', 'growl-top-right');
          //Meteor.call('changeFirstLogin');
        }
      });
      oldPassword.val('');
      newPassword.val('');
    }
  });
});
