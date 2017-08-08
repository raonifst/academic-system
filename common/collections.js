Courses = new Mongo.Collection('courses');
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
  }
});

Courses.parser = function(jsonObj) {

  return {
    codigo: parseInt(jsonObj.codigo),
    nome: jsonObj.nome,
    creditos: parseInt(jsonObj.creditos),
    semestre: parseInt(jsonObj.semestre),
    prereq: jsonObj.prereq
  };

};
