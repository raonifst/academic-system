import {Meteor} from 'meteor/meteor';


Meteor.methods({

  clearStructure(){
    const currentUser = Meteor.userId();
    if (!currentUser) {
      throw new Meteor.Error("not-logged-in", "You're not logged-in.");
    }
    const countCurr = CurricularStructure.find({ createdBy: currentUser }).count();
    const countDisc = Disciplines.find({ createdBy: currentUser }).count();
    if (countCurr == 0 && countDisc) {
      return 0;
    }
    CurricularStructure.remove({ createdBy: currentUser });
    Disciplines.remove({ createdBy: currentUser });
    console.log("Estrutura curricular limpa por", currentUser);
    return 1;
  },

  clearRecords(){
    const currentUser = Meteor.userId();
    if (!currentUser) {
      throw new Meteor.Error("not-logged-in", "You're not logged-in.");
    }
    if (Records.find({ createdBy: currentUser }).count() == 0) {
      return 0;
    }
    Records.remove({ createdBy: currentUser });
    console.log("Histórico acadêmico limpo por", currentUser);
    return 1;
  }

});
