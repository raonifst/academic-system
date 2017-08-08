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

export default Records;
