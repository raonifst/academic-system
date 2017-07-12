import {Template} from 'meteor/templating';


Template.buttonremovestructure.events({

  "click .js-clearstructure": function () {

    if (!window.confirm("Você tem certeza? Esta operação não pode ser desfeita."))
      return;
    Meteor.call('clearStructure', (error, results) => {
      if (results == 1) {
        Bert.alert('Estrutura curricular limpa.', 'success', 'growl-top-right');
        Meteor.call('changeUserUploadCurricularStructureFlag');
      } else {
        Bert.alert('Estrutura curricular já está vazio.', 'warning', 'growl-top-right' );
      }
    });

  }

});


Template.buttonremoverecords.events({

  "click .js-clearrecords": function () {

    if (!window.confirm("Você tem certeza? Esta operação não pode ser desfeita."))
      return;
    Meteor.call('clearRecords', (error, results) => {
      if (results == 1) {
        Bert.alert('Histórico acadêmico limpo.', 'success', 'growl-top-right' );
        Meteor.call('changeUserUploadAcademicRecordsFlag');
      } else {
        Bert.alert('Histórico acadêmico já está vazio.', 'warning', 'growl-top-right' );
      }
    });

  }

});


Template.buttonremoverecords.helpers({

  uploaded: function() {
    const currentUserId = Meteor.userId();
    const user = (currentUserId)? Users.findOne({ idUser: currentUserId }) : null;
    return user && Users.findOne({ idUser: currentUserId }).uploadedAcademicRecords;
  }

});


Template.buttonremovestructure.helpers({

  uploaded: function() {
    const currentUserId = Meteor.userId();
    const user = (currentUserId)? Users.findOne({ idUser: currentUserId }) : null;
    return user && Users.findOne({ idUser: currentUserId }).uploadedCurricularStructure;
  }

});
