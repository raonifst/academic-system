export const userHasCompletedTasks = function() {
  const currentUserId = Meteor.userId();
  const user = Users.findOne({ idUser: currentUserId });
  return user && user.changedDefaultPassword &&
    user.uploadedCurricularStructure && user.uploadedAcademicRecords;
};
