

Template.buttonremovestructure.events({
  "click .js-clearstructure": function () {
    Meteor.call('clearStructure', (error, results) => {
      if (results == 1) {
        console.log("Estrutura Curricular limpa por",Meteor.userId());
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
    Meteor.call('clearRecords', (error, results) => {
      if (results == 1) {
        console.log("Histórico acadêmico limpo por ", Meteor.userId());
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
    const user = (currentUserId)? Users.findOne({ idUser: currentUserId }):null;
    return user && Users.findOne({ idUser: currentUserId }).uploadedAcademicRecords;
  }
});

Template.buttonremovestructure.helpers({
  uploaded: function() {
    const currentUserId = Meteor.userId();
    const user = (currentUserId)? Users.findOne({ idUser: currentUserId }):null;
    return user && Users.findOne({ idUser: currentUserId }).uploadedCurricularStructure;
  }
});
