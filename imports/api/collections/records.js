// Coleção contendo o histórico acadêmico dos alunos
const Records = new Mongo.Collection('records');

// Schema utilizado para validar o csv do histórico acadêmico
Records.schema = new SimpleSchema({
  rga: {
    type: Number,
    min: 201420000000
  },
  nome: {
    type: String,
    max: 100
  },
  disciplina: {
    type: String,
    max: 100
  },
  situacao: {
    type: String,
    min: 2,
    max: 3
  },
  ano: {
    type: Number,
    min: 2014
  },
  semestre: {
    type: Number,
    min: 1,
    max: 4
  }
});

// Permissões 1
Records.allow({

  // O usuário precisa estar "logado" e deve ser o proprietário do documento

  insert(userId, doc) {
    return userId && doc.createdBy == userId;
  },

  update(userId, doc, fields, modifier) {
    return userId && doc.createdBy == userId;
  },

  remove(userId, doc) {
    return userId && doc.createdBy == userId;
  },

  fetch: ['createdBy']

});

// Permissões 2
Records.deny({

  update: function (userId, doc, fields, modifier) {
    return _.contains(fields, 'createdBy');
  }

});

export default Records;
