import {Course} from "../../modules/course";

// Coleção contendo a estrutura curricular das disciplinas
const Courses = new Mongo.Collection('courses');

// Schema utilizado para validar o csv da estrutura curricular
Courses.schema = new SimpleSchema(Course.validator());

// Permissões 1
Courses.allow({ // O usuário precisa estar "logado" e deve ser o proprietário do documento
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
Courses.deny({  // O usuário não pode alterar o campo createdBy em nenhuma hipótese
  update(userId, doc, fields, modifier) {
    return _.contains(fields, 'createdBy');
  }
});

export default Courses;
