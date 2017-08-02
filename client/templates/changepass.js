import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

import '../main.js'


Router.route('/changepass', {
  name: 'changepass',
  template: 'changepass',
  onBeforeAction() {
    if (Meteor.userId()) {
      this.next();
    } else {
      this.render("login");
    }
  }
});


Template.changepassForm.onRendered(function(){

  $('.changepassform').validate({

    onkeyup: false,

    keypress: false,

    errorPlacement: function (error, element) {
      Bert.alert(error.text(),'danger' );
    },

    submitHandler: function (event) {
      const oldPassword = $('[name=oldpassword]');
      const newPassword = $('[name=password]');
      Accounts.changePassword(oldPassword.val(), newPassword.val(), function (error) {
        if (error) {
          if (error.reason === "User not found") {
            Bert.alert( 'Usuário não cadastrado', 'danger' );
          }
          else if (error.reason === "Incorrect password") {
            Bert.alert( 'Senha incorreta', 'danger' );
          }
        } else {
          Meteor.call('changeFirstLogin');
          Router.go('home');
          Bert.alert('Primeira senha alterada com sucesso!', 'success', 'growl-top-right');
        }
      });
    }
  });

});


Template.changepassForm.helpers({

  hasMadeFirstLogin: function () {
    const currentUserId = Meteor.userId();
    const user = Users.findOne({ idUser: currentUserId });
    return user && user.changedDefaultPassword;
  }

});


Template.changepassForm.events({

  'submit form': function (event) {
    event.preventDefault();
  }

});
