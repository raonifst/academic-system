import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import Default from "../../imports/modules/defaults";

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
    event.preventDefault();
    if (event.target.password.value != event.target.password2.value) {
      Bert.alert("Senhas precisam ser iguais.", 'danger', 'growl-top-right');
    } else if (event.target.oldpassword.value == event.target.password.value) {
      Bert.alert("Senha precisa ser diferente da senha primária.", 'danger', 'growl-top-right');
    } else {
      const oldpassword = event.target.oldpassword.value;
      const newpassword = event.target.password.value;
      Accounts.changePassword(oldpassword, newpassword, function (error) {
        if (error) {
          if (error.reason === "User not found")
            Bert.alert('Usuário não cadastrado', 'danger');
          else if (error.reason === "Incorrect password")
            Bert.alert('Senha incorreta', 'danger', 'growl-top-right');
        } else {
          Bert.alert('Senha alterada!', 'success', 'growl-top-right');
        }
      });
    }
    $(event.target.oldpassword).removeClass('valid');
    $(event.target.password).removeClass('valid');
    $(event.target.password2).removeClass('valid');
    event.target.oldpassword.value = '';
    event.target.password.value = '';
    event.target.password2.value = '';
    $(event.target.oldpassword).blur();
    $(event.target.password).blur();
    $(event.target.password2).blur();
  }
});
