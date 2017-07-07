Template.buttonremovestructure.events({
  "click .js-clearstructure": function () {
    Meteor.call('clearStructure');
    Bert.alert( 'Estrutura curricular limpa.', 'success', 'growl-top-right' );
  }
});

Template.buttonremoverecords.events({
  "click .js-clearrecords": function () {
    Meteor.call('clearRecords');
    Bert.alert( 'Histórico acadêmico limpo.', 'success', 'growl-top-right' );
  }
});
