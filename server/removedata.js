import {Meteor} from 'meteor/meteor';
import Courses from '../imports/api/collections/courses'

Meteor.methods({
  toCleanCourses() {
    const currentUser = Meteor.userId();

    if (!currentUser)
      throw new Meteor.Error("not-logged-in", "You're not logged-in.");

    if (!Courses.find({ createdBy: currentUser }).count()) {
      return 0;
    }

    Courses.remove({ createdBy: currentUser });
    console.log("Estrutura curricular limpa por", currentUser);
    return 1;
  },

  toCleanRecords(){
    const currentUser = Meteor.userId();

    if (!currentUser)
      throw new Meteor.Error("not-logged-in", "You're not logged-in.");

    if (!Records.find({ createdBy: currentUser }).count())
      return 0;

    Records.remove({ createdBy: currentUser });
    console.log("Histórico acadêmico limpo por", currentUser);
    return 1;
  },
});
