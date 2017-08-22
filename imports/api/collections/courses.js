// Coleção contendo a estrutura curricular das disciplinas
const Courses = new Mongo.Collection('courses');

// Schema utilizado para validar o csv da estrutura curricular
Courses.schema = new SimpleSchema({
  codigo: {
    type: Number,
    min: 90000001,
    max: 99999999
  },
  nome: {
    type: String,
    max: 100
  },
  creditos: {
    type: Number,
    min: 2,
    max: 6
  },
  semestre: {
    type: Number,
    min: 1,
    max: 10
  },
  prereq: {
    type: String
  },
  aprovacoes: {
    type: Number,
    min: 0
  },
  reprovacoes: {
    type: Number,
    min: 0
  },
  reincidencia: {
    type: Number,
    min: 0
  },
  aprov2: {
    type: Number,
    min: 0
  },
  perc_ap: {
    type: Number,
    min: 0,
    max: 100
  },
  perc_reic: {
    type: Number,
    min: 0,
    max: 100
  },
  perc_aprov2: {
    type: Number,
    min: 0,
    max: 100
  },
  alunos: {
    type: Number,
    min: 0
  },
  createdBy: {
    type: String
  }
});

// Função utilizada para conversão de valores recebidos do csv para o formato correto definido
// na validação
Courses.parser = function(jsonObj) {
  const currentUserId = Meteor.userId();
  return {
    codigo:       parseInt(jsonObj.codigo),
    nome:         jsonObj.nome,
    creditos:     parseInt(jsonObj.creditos),
    semestre:     parseInt(jsonObj.semestre),
    prereq:       jsonObj.prereq,
    aprovacoes:   0,
    reprovacoes:  0,
    reincidencia: 0,
    aprov2:       0,
    perc_ap:      0,
    perc_reic:    0,
    perc_aprov2:  0,
    alunos:       0,
    createdBy:    currentUserId
  };
};

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
