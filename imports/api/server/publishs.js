Meteor.publish('Courses', function(){
    return Courses.find({ createdBy: this.userId });
});
