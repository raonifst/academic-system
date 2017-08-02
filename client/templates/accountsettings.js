import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'


Template.accountsettings.onRendered(function(){

  $('.changepassform').validate({

    onkeyup: false,

    keypress: false,

    errorPlacement: function (error, element) {
      Bert.alert(error.text(), 'danger', 'growl-top-right');
    },

    submitHandler: function (event) {
      const oldPassword = $('[name=oldpassword]');
      const newPassword = $('[name=password]');
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
          oldPassword.val('');
          newPassword.val('');
          Meteor.call('changeFirstLogin');
        }
      });
    }
  });

});
