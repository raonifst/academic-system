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


Template.changepassForm.onRendered( function(){

  var validator = $('.login').validate({

    onkeyup: false,
    keypress: false,

    errorPlacement: function (error, element) {
      Bert.alert(error.text(),'danger' );
    },

    submitHandler:function(event){
      const newPassword = $('[name=password]').val();
      const oldPassword = $('[name=oldpassword]').val();
      Accounts.changePassword(oldPassword, newPassword, function(error){
        if (error) {
          if (error.reason === "User not found") {
            Bert.alert( 'Usuário não cadastrado', 'danger' );
          }
          else if (error.reason === "Incorrect password") {
            Bert.alert( 'Senha incorreta', 'danger' );
          }
          /*validator.showErrors({
            password:error.reason
          })*/
        } else {
          Meteor.call('isFirstLogin', (error, results) => {
            Meteor.call('changeFirstLogin');
            if (results) {
              Router.go('home');
            } else {
              Bert.alert('Senha alterada!', 'success', 'growl-top-right');
            }
          });
        }
      });
    }
  });

});


Template.changepassForm.events({

  'submit form': function (event) {
    event.preventDefault();
  }

});
