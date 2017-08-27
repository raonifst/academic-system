import {Meteor} from "meteor/meteor";

const Settings = Object.freeze({
  changePassword(event, isFirstLogin) {
    event.preventDefault();
    const oldpassword = event.target.oldpassword.value;
    const newpassword = event.target.password.value;
    const newpasswordconfirm = event.target.password2.value;
    if (newpassword != newpasswordconfirm) {
      Bert.alert("As senhas digitadas não coincidem.", 'danger', 'growl-top-right');
    } else if (oldpassword == newpassword) {
      Bert.alert("Nova senha digitada é igual à senha antiga.", 'danger', 'growl-top-right');
    } else {
      Accounts.changePassword(oldpassword, newpassword, function (error) {
        if (error) {
          if (error.reason === "User not found")
            Bert.alert("Usuário não cadastrado.", 'danger');
          else if (error.reason === "Incorrect password")
            Bert.alert("Senha incorreta.", 'danger', 'growl-top-right');
        } else {
          if (isFirstLogin)
            Meteor.call('changeFirstLogin');
          Bert.alert("Senha alterada com sucesso.", 'success', 'growl-top-right');
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

export default Settings;
