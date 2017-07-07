import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';

Meteor.methods({
  clearStructure(){
    const currentUser = Meteor.userId();
    if (!currentUser) {
      throw new Meteor.Error("not-logged-in", "You're not logged-in.");
    }
    CurricularStructure.remove({ createdBy: currentUser });
    Disciplines.remove({ createdBy: currentUser });
  },

  clearRecords(){
    const currentUser = Meteor.userId();
    if (!currentUser) {
      throw new Meteor.Error("not-logged-in", "You're not logged-in.");
    }
    Records.remove({ createdBy: currentUser });
  }
})
