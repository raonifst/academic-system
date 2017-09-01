import {AcademicRecord} from "../../../lib/classes/academicrecord";

// Coleção contendo o histórico acadêmico dos alunos
const Records = new Mongo.Collection('records');

// Schema utilizado para validar o csv do histórico acadêmico
Records.schema = new SimpleSchema(AcademicRecord.validator());

// Validador de registros
Records.validateRegistry = function(jsonObj) {
  const currentUserId = Meteor.userId();
  Records.schema.validate({
    rga:        parseInt(jsonObj.rga),
    nome:       jsonObj.nome,
    disciplina: jsonObj.disciplina,
    situacao:   jsonObj.situacao,
    ano:        parseInt(jsonObj.ano),
    semestre:   parseInt(jsonObj.semestre),
    createdBy:  currentUserId
  });
};

// Permissões 1
Records.allow({ // O usuário precisa estar "logado" e deve ser o proprietário do documento
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
Records.deny({ // O usuário não pode alterar o campo createdBy em nenhuma hipótese
  update(userId, doc, fields, modifier) {
    return _.contains(fields, 'createdBy');
  }
});

export default Records;
