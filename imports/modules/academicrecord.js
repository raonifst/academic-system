import {Meteor} from "meteor/meteor";

export class AcademicRecord {
  static validator() {
    return {
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
      },
      createdBy: {
        type: String
      }
    };
  }

  constructor(jsonObj) {
    this.rga = parseInt(jsonObj.rga);
    this.nome = jsonObj.nome;
    this.disciplina = jsonObj.disciplina;
    this.situacao = jsonObj.situacao;
    this.ano = parseInt(jsonObj.ano);
    this.semestre = parseInt(jsonObj.semestre);
    this.createdBy = Meteor.userId();
  }
}
