import {defaultDisciplinesList} from "../../imports/utils/defaultdisciplineslist";


Template.settings.onCreated(function () {

  this.subscribe('courses');
  this.subscribe('userStats');

});


Template.settings.onRendered(function () {
  $(document).ready(function() {
    $('select').material_select();
  });
});


Template.settings.helpers({

  course: function () {
    // TODO corrigir erro no helper que não retorna os dados contigos na collection Course
    //return Courses.find({}, { sort: {name: 1} }).fetch();
    return defaultDisciplinesList; // Solução provisória
  },

  isselected: function () {
    const courseName = this.name;
    const currentUser = Meteor.userId();
    const usr = Users.findOne({ idUser: currentUser });
    if (usr) {
      if (usr.course == courseName)
        return "selected";
    }
  }

});


Template.settings.events({

  'submit form': function (event) {
    event.preventDefault();
    const selected = $('[name="courses"]').val();
    const currentUser = Meteor.userId();
    const reg = Users.findOne({ idUser: currentUser });
    if (reg) {
      Users.update({ _id: reg._id }, { $set: { course: selected }});
      Bert.alert('Você selecionou o curso ' + selected, 'success', 'growl-top-right');
    }
  }

});
