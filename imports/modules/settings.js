import {Meteor} from "meteor/meteor";
import BertMsg from "./bertmessages";

const Settings = Object.freeze({
  changePassword(event, isFirstLogin) {
    event.preventDefault();
    const currentUser = Meteor.user();
    const oldpassword = event.target.oldpassword.value;
    const newpassword = event.target.password.value;
    const newpasswordconfirm = event.target.password2.value;
    // Condição de verificação de senha
    const passcondition =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,}/;
    const time = currentUser.durationAlerts;
    if (!passcondition.test(newpassword)){
      Bert.defaults.hideDelay = 6000;
      Bert.alert(BertMsg.password.validationError, 'danger', 'growl-top-right');
      Bert.defaults.hideDelay = time;
    } else if (newpassword != newpasswordconfirm) {
      Bert.alert(BertMsg.password.matchError, 'danger', 'growl-top-right');
    } else if (oldpassword == newpassword) {
      Bert.alert(BertMsg.password.invarianceError, 'danger', 'growl-top-right');
    } else {
      Accounts.changePassword(oldpassword, newpassword, function (error) {
        if (error) {
          if (error.reason === "User not found")
            Bert.alert(BertMsg.login.userNotFoundError, 'danger');
          else if (error.reason === "Incorrect password")
            Bert.alert(BertMsg.password.incorrectPasswordError, 'danger', 'growl-top-right');
        } else {
          if (isFirstLogin)
            Meteor.call('changeFirstLogin');
          Bert.alert(BertMsg.password.success, 'success', 'growl-top-right');
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
