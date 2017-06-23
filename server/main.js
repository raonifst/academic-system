import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check'

//Records = new Meteor.Collection('record');

import './uploadacademicrecord.js'


Meteor.startup(() => {

  /* 
     Solução provisória: não há registro de usuários.
     Quando o sistema 'sobe' e não há usuarios cadastrados, 
     o usuário a seguir é cadastrado.
  */
  if (!Meteor.users.find().count()) {
    Accounts.createUser({
      email: 'raoni@ufmt.br',
      password: '123'
    })
  }

});


Meteor.methods({
  changeUserPassword: function (newPassword) {
    const currentUser = Meteor.userId();

    if (!currentUser) {
      throw new Meteor.Error("not-logged-in", "You're not logged-in.");
    }

    Accounts.setPassword(currentUser, newPassword, {logout: false});
    console.warn(new Date(), ': A senha do usuario', currentUser, ' foi alterada.');
  }
});