Template.buttonremovestructure.events({
  "click .js-clearstructure": function () {
    Meteor.call('clearStructure');
    Bert.alert( 'Estrutura Curricular Limpa', 'success', 'growl-top-right' );
  }
});

Template.buttonremoverecords.events({
  "click .js-clearrecords": function () {
    Meteor.call('clearRecords');
    Bert.alert( 'Histórico Acadêmico Limpo', 'success', 'growl-top-right' );
  }
});
