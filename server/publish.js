Meteor.publish('userDisciplines', function(){
    return Disciplines.find({ createdBy: this.userId });
});
