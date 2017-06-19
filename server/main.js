import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check'

//Records = new Meteor.Collection('record');

import './uploadacademicrecord.js'


Meteor.startup(() => {

  /* 
     Gambiarra:
     Se não há usuarios cadastrados, entao cadastra o 'admin' do sistema
  */
  if(!Meteor.users.find().count()){
    Accounts.createUser({
      email: 'raoni@ufmt.br',
      password: '123'
    })
  }

});


Meteor.methods({
    changeUserPassword:function(newPassword){
		var currentUser = Meteor.userId();

		if(!currentUser){
	        throw new Meteor.Error("not-logged-in", "You're not logged-in.");
	    }	    
	    
    	Accounts.setPassword(currentUser, newPassword, {logout: false});
    	console.warn( new Date(), ': A senha do usuario', currentUser, ' foi alterada.');
  	}  	
});