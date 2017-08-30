Template.dataremove.helpers({
  uploaded(method){
    const currentUser = Meteor.user();
    if (currentUser)
      if ((method == 'toCleanCourses' && currentUser.uploadCoursesFlag) ||
          (method == 'toCleanRecords' && currentUser.uploadRecordsFlag))
            return 'btn-delete waves-effect waves-light';
    return 'disabled';
  }
});

Template.dataremove.events({
  'click .btn-delete': function (event, template) {
    if (!window.confirm("Você tem certeza? Esta operação não pode ser desfeita."))
      return;

    Meteor.call(this.method, (error, results) => {
      if (results) {
        Bert.alert(this.method + 'ERRO: É necessario um histórico acadêmico inserido para funcionamento correto do sistema. Insira novamente um arquivo válido.', 'success', 'growl-top-right');
        Meteor.call(this.changeflagmethod);
        Meteor.call('changeCurrentSemester', 1);
      } else {
        Bert.alert('Já está vazio.', 'warning', 'growl-top-right' );
      }
    });
  }
});


Template.editing.events({
  'click .rmv': function(event) {
    event.preventDefault();
    if (window.confirm("Deseja apagar "+this.nome+"?"))
      Meteor.call('removeItem', this);
  },
});

Template.dataremoveinvalid.events({
  'mouseenter .btn':function(event){
      event.preventDefault();
      Bert.alert('Você deve excluir o histórico Acadêmico antes.' , 'info', 'growl-top-right');

  },

});
