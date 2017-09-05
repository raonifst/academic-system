import { Meteor } from 'meteor/meteor'
import { AccountsServer } from 'meteor/accounts-base'
import '../imports/api/server/publishs.js'
import Default from "../imports/modules/defaults";

Meteor.startup(() => {
  /* Solução provisória: não há registro de usuários.
     Quando o sistema 'sobe' e não há usuarios cadastrados,
     o usuário a seguir é cadastrado. */
  if (Meteor.users.find().count()<2) {
    const userId = Accounts.createUser({
      email:              'raoni@ufmt.br',
      password:           '123',
    });
    Meteor.users.update({ _id: userId }, {
      $set:
      { name:             Default.rootUser.name,
        gradProgram:      Default.rootUser.gradProgram
      }
    });

    const userId2 = Accounts.createUser({
      email:              'juliorosa01@live.com',
      password:           '456',
    });
    Meteor.users.update({ _id: userId2 }, {
      $set:
      { name:             'Usuario Teste',
        gradProgram:      Default.rootUser.gradProgram
      }
    });

}

process.env.MAIL_URL = 'smtp://postmaster@sandbox5ffba6824ec44ec983c30f89b9fe3543.mailgun.org:2dc4e7b3d2fb77cb8ddbf299258bcae0@smtp.mailgun.org:587';
let templateEmailrecovery ={
    from:function(){
        return 'academicsystem@ufmt.com.br';
    },
    subject:function(user){
        return 'Recuperação de Senha';
    },
    text:function(user, url){
              var newUrl = url.replace('#/reset-password','reset');
               return 'Olá,\nPara recuperar sua senha, clique no link...\n'+newUrl;;
        }
}
Accounts.emailTemplates.resetPassword = templateEmailrecovery;

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
Meteor.methods({
  checkResetToken(token) {
      const user = Meteor.users.findOne({
        "services.password.reset.token": token});
      if (!user) {
        throw new Meteor.Error(403, "Token expired");
      }

      const when = user.services.password.reset.when;
      const reason = user.services.password.reset.reason;
      let tokenLifetimeMs = Accounts._getPasswordResetTokenLifetimeMs();
      if (reason === "enroll") {
        tokenLifetimeMs = Accounts._getPasswordEnrollTokenLifetimeMs();
      }
      const currentTimeMs = Date.now();
      if ((currentTimeMs - when) > tokenLifetimeMs) { // timeout
        throw new Meteor.Error(403, "Token expired");
      }
    }
});
