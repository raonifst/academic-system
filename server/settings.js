import { Meteor } from 'meteor/meteor'

Meteor.methods({
  updateProfile(name, gradProgram, bertTime) {
    const currentUser = Meteor.user();
    if (!currentUser)
      throw new Meteor.Error("user-not-found", "User not found");
    Meteor.users.update({ _id: currentUser._id },
      {
        $set: {name: name, gradProgram: gradProgram, durationAlerts: bertTime}
      });
    return 1;
  },

  changeFirstLogin() {
    const currentUser = Meteor.user();
    if (!currentUser)
      throw new Meteor.Error("user-not-found", "User not found");
      Meteor.users.update({ _id: currentUser._id },
        {
          $set: { passwordFlag: true }
        });
    }
});
