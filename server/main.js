import '../imports/api/server/publish.js'
Meteor.startup(() => {

  /*
     Solução provisória: não há registro de usuários.
     Quando o sistema 'sobe' e não há usuarios cadastrados,
     o usuário a seguir é cadastrado.
  */
  if (!Meteor.users.find().count()) {
    const usr = Accounts.createUser({
      email: 'raoni@ufmt.br',
      password: '123'
    });
    /*Users.insert({
      idUser:                       usr,
      course:                       DefaultRootUser.course,
      name:                         DefaultRootUser.name,
      currentYear:                  DefaultRootUser.currentYear,
      currentSemester:              DefaultRootUser.currentSemester,
      durationAlerts:               DefaultRootUser.durationAlerts,
      changedDefaultPassword:       false,
      uploadedCurricularStructure:  false,
      uploadedAcademicRecords:      false
    })*/
  }
});
