Template.dataremove.helpers({
  uploaded(method){
    const currentUser = Meteor.userId();
    if (currentUser)
      if ((method == 'toCleanCourses' &&
          Meteor.users.findOne({_id: currentUser}).uploadCoursesFlag) ||
          (method == 'toCleanRecords' &&
          Meteor.users.findOne({ _id: currentUser }).uploadRecordsFlag))
            return 'btn-delete waves-effect waves-light';
    return 'disabled';
  },
})

Template.dataremove.events({
  'click .btn-delete': function (event, template) {
    if (!window.confirm("Você tem certeza? Esta operação não pode ser desfeita."))
      return;

    Meteor.call(this.method, (error, results) => {
      if (results) {
        Bert.alert(this.method + ': Troca a msg', 'success', 'growl-top-right');
        Meteor.call(this.changeflagmethod);
        Meteor.call('changeCurrentSemester', 1);
      } else {
        Bert.alert('Já está vazio.', 'warning', 'growl-top-right' );
      }
    });
  },
});
