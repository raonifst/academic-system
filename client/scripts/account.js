import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import Settings from "../../imports/modules/settings";

Template.login.events({
  'submit form': function(event){
    event.preventDefault();
    var email = event.target.email.value;
    var password = event.target.password.value;
    Meteor.loginWithPassword(email, password, function(error){
    if (error) {
      if(error.reason === "Incorrect password")
      Bert.alert('Senha incorreta', 'danger', 'growl-top-right');
      if (error.reason === "User not found")
      Bert.alert('Usuário não cadastrado', 'danger', 'growl-top-right');
    }
    });
  }
});

Template.layout.helpers({
  changepass() {
    const currentUser = Meteor.user();
    //console.log(currentUser.passwordFlag);
    return currentUser && currentUser.passwordFlag;
  }
});

Template.layout.events({
  'click .exit': function(event){
      event.preventDefault();
      Meteor.logout();
      Router.go('/');
  }
});

Template.changepass.events({
  'submit #changepassform': function (event) {
    Settings.changePassword(event, true);
  }
});

Template.navigation.events({
    'click .exit': function(event){
        event.preventDefault();
        Meteor.logout();
        Router.go('/');
    }
});

Template.navigation.helpers({
  nome() {
    return Meteor.user().name;
  },

  curso() {
    return Meteor.user().gradProgram;
  }
});

Template.navbar.helpers({
  ano() {
    return Meteor.user().currentYear;
  },

  semestre() {
    return Meteor.user().currentSemester;
  }
});

Template.formpassword.events({
'submit form': function (event) {
    event.preventDefault();
    let myemail = event.target.email.value

        Accounts.forgotPassword({email:myemail},function(err){
          if(err){
            if(err.message === 'User not found [403]')
                Bert.alert('Email não cadastrado.', 'danger', 'growl-top-right');
            else
              Bert.alert('Houve algum erro interno.', 'danger', 'growl-top-right');

          }else{
              Bert.alert('Link de recuperação de senha enviado com sucesso.', 'success', 'growl-top-right');
          }

        });
      }
});



Template.resetpass.events({
  'submit #resetpassform':function(){
    event.preventDefault();
    const newpassword = event.target.password.value;
    const newpasswordconfirm = event.target.passwordconfirm.value;
    const passcondition =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,}/;

    if(!passcondition.test(newpassword)){
      Bert.alert("A nova senha deve ter mais que 6 caracteres, pelo menos uma letra maiúscula, uma minúscula, um número e um caracter especial", 'danger', 'growl-top-right');
    }else if (newpassword != newpasswordconfirm) {
      Bert.alert("As senhas digitadas não coincidem.", 'danger', 'growl-top-right');
    }else{

      Accounts.resetPassword(Accounts._resetPasswordToken, newpassword, function(err) {
        if (err) {
              Bert.alert('Houve algum erro interno.', 'danger', 'growl-top-right');
          } else {
              Bert.alert('Senha alterada com sucesso.', 'success', 'growl-top-right');
                Accounts._resetPasswordToken = null;
          }
        });
    }

  }

});
