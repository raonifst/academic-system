/* Permissões de modificações do banco de dados (como insert, update e remove) devem ser
 declaradas aqui */

Users.allow({

  insert(userId, doc) {
    return userId && userId == doc.idUser;
  },

  update(userId, doc, fields, modifier) {
    return userId && userId == doc.idUser;
  },

  remove(userId, doc) {
    return userId && userId == doc.idUser;
  }

});


Users.deny({

  update(userId, doc, fields, modifier) {
    return _.contains(fields, "idUser");
  }

});
