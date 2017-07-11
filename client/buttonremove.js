Template.buttonremovestructure.events({
  "click .js-clearstructure": function () {
    Meteor.call('clearStructure');
    console.log("Estrutura Curricular limpa por",Meteor.userId());
    Bert.alert( 'Estrutura curricular limpa.', 'success', 'growl-top-right' );
  }
});

Template.buttonremoverecords.events({
  "click .js-clearrecords": function () {
    Meteor.call('clearRecords');
    console.log("Histórico Acadêmico limpo por",Meteor.userId());
    Bert.alert( 'Histórico acadêmico limpo.', 'success', 'growl-top-right' );
  }
});
