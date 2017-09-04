import {Meteor} from "meteor/meteor";
import BertMsg from "../../imports/modules/bertmessages";

Template.dataremove.helpers({
  uploaded(method) {
    const currentUser = Meteor.user();
    if (currentUser)
      if ((method == 'clearCourses' && currentUser.uploadCoursesFlag) ||
          (method == 'clearRecords' && currentUser.uploadRecordsFlag))
            return 'btn-delete waves-effect waves-light';
    return 'disabled';
  }
});

Template.dataremove.events({
  'click .btn-delete': function (event, template) {
    if (!window.confirm("Você tem certeza? Esta operação não pode ser desfeita."))
      return;
    Meteor.call(this.method, (error, results) => {
      if (!results) {
        Bert.alert('Já está vazio.', 'warning', 'growl-top-right');
        return;
      }
      switch (this.method) {
        case "clearCourses":
          Bert.alert(BertMsg.courses.successRemove, 'info', 'growl-top-right');
          break;
        case "clearRecords":
          Bert.alert(BertMsg.records.successRemove, 'info', 'growl-top-right');
          break;
        default:
          Bert.alert("Internal error.", 'danger', 'growl-top-right');
          return;
      }
      Meteor.call(this.changeflagmethod, (error, results) => {
        if (!error) {
          Meteor.call('changeCurrentSemester', 1, (error, results) => {
            if (error)
              Bert.alert(error.reason, 'danger', 'growl-top-right');
          });
        }
      });
    });
  }
});

Template.editing.events({
  'click .rmv': function(event) {
    event.preventDefault();
    if (window.confirm("Deseja apagar " + this.nome + "? Esta operação não pode ser desfeita.")) {
      Meteor.call('removeItem', this, (error, results) => {
        if (error)
          Bert.alert(error.reason, 'danger', 'growl-top-right');
        else
          Bert.alert(BertMsg.courses.successRemoveItem, 'success', 'growl-top-right');
      });
    }
  },
});
