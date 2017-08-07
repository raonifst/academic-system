Meteor.publish('pDisciplinas', function(){
    return Disciplinas.find({ createdBy: this.userId });
});
