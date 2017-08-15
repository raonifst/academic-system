import {Meteor} from 'meteor/meteor';
import Courses from '../imports/api/collections/courses';
import Records from '../imports/api/collections/records';

Meteor.methods({
  toCleanCourses() {
    const currentUserId = Meteor.userId();

    if (!currentUserId)
      throw new Meteor.Error("not-logged-in", "You're not logged-in.");

    if (!Courses.find({ createdBy: currentUserId }).count()) {
      return 0;
    }

    Courses.remove({ createdBy: currentUserId });
    console.log("Estrutura curricular limpa por", currentUserId);
    return 1;
  },

  toCleanRecords(){
    const currentUserId = Meteor.userId();

    if (!currentUserId)
      throw new Meteor.Error("not-logged-in", "You're not logged-in.");

    if (!Records.find({ createdBy: currentUserId }).count())
      return 0;

    Records.remove({ createdBy: currentUserId });
    console.log("Histórico acadêmico limpo por", currentUserId);
    return 1;
  },
});
