import { Meteor } from 'meteor/meteor'
import { AccountsServer } from 'meteor/accounts-base'
import Settings from '../imports/api/collections/settings';
import '../imports/api/server/publishs.js'

Meteor.startup(() => {
  /* Solução provisória: não há registro de usuários.
     Quando o sistema 'sobe' e não há usuarios cadastrados,
     o usuário a seguir é cadastrado. */
  if (!Meteor.users.find().count()) {
    const usrId = Accounts.createUser({
      email:              'raoni@ufmt.br',
      password:           '123',
    });

    Meteor.users.update({ _id: usrId }, {
      $set:
      { name:             'Fabricio Barbosa de Carvalho',
        gradProgram:      'Engenharia de Computação',
        currentYear:      '2014',
        currentSemester:  '2',
      }
    });

    Settings.insert({
      navbarfixed:        true,
      menufixed:          true,
      createdBy:          usrId,
    })
  }
});

Accounts.onCreateUser((options, user) => {
  const customUser = Object.assign(user, {
    durationAlerts:               4000,
    changedDefaultPassword:       false,
    uploadedCurricularStructure:  false,
    uploadedAcademicRecords:      false
  });
  if (options.profile) {
    customUser.profile = options.profile;
  }
  return customUser;
});
