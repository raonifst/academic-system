import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import Courses from '../imports/api/collections/courses';
import Records from '../imports/api/collections/records';
import '../imports/modules/auxiliar';
import {updateCoursesRemoveRecords} from "../imports/modules/auxiliar";
import {updateCoursesRemoveItem} from "../imports/modules/auxiliar";
import BertMsg from "../imports/modules/bertmessages";

Meteor.methods({
  clearCourses() {
    const currentUserId = Meteor.userId();
    if (!currentUserId)
      throw new Meteor.Error("not-logged-in", "You're not logged-in.");
    if (!Courses.find({ createdBy: currentUserId }).count())
      return 0;
    Courses.remove({ createdBy: currentUserId });
    console.log("Estrutura curricular limpa por", currentUserId);
    return 1;
  },

  clearRecords() {
    const currentUserId = Meteor.userId();
    if (!currentUserId)
      throw new Meteor.Error("not-logged-in", "You're not logged-in.");
    if (!Records.find({ createdBy: currentUserId }).count())
      return 0;
    Records.remove({ createdBy: currentUserId });
    updateCoursesRemoveRecords(currentUserId);
    console.log("Histórico acadêmico limpo por", currentUserId);
    return 1;
  },

  removeItem(item) {
    check(item, Object);
    check(item._id, String);
    const currentUserId = Meteor.userId();
    const id = item._id;
    if (!currentUserId)
      throw new Meteor.Error("not-logged-in", "You're not logged-in.");
    if (item.rga) { // Item de histórico acadêmico
      updateCoursesRemoveItem(item);
      Records.remove({ _id: id, createdBy: currentUserId });
      }
    else { // Item de estrutura curricular
      if (Records.find({ createdBy: currentUserId }).count())
        throw new Meteor.Error("records-not-empty", BertMsg.courses.errorNotEmptyRecordsOnRemove);
      Courses.remove({ _id: id, createdBy: currentUserId });
    }
  }
});
