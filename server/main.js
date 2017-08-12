import { Meteor } from 'meteor/meteor'
import { AccountsServer } from 'meteor/accounts-base'
import '../imports/api/server/publishs.js'

Meteor.startup(() => {
  /* Solução provisória: não há registro de usuários.
     Quando o sistema 'sobe' e não há usuarios cadastrados,
     o usuário a seguir é cadastrado. */
  if (!Meteor.users.find().count()) {
    const userId = Accounts.createUser({
      email:              'raoni@ufmt.br',
      password:           '123',
    });
    Meteor.users.update({ _id: userId }, {
      $set:
      { name:             'Fabricio Barbosa de Carvalho',
        gradProgram:      'Engenharia de Computação',
        currentYear:      2014,
        currentSemester:  2,
      }
    });
  }
});

Accounts.onCreateUser((options, user) => {
  // Estes são os campos padrão acrescidos para qualquer usuário que cadastre-se no sistema
  const customUser = Object.assign(user, {
    name:               '-',
    gradProgram:        '-',
    currentYear:        0,
    currentSemester:    0,
    durationAlerts:     4000,
    passwordFlag:       false,
    uploadCoursesFlag:  false,
    uploadRecordsFlag:  false,
    navbarFixed:        true,
    menuFixed:          true
  });
  if (options.profile) {
    customUser.profile = options.profile;
  }
  return customUser;
});
