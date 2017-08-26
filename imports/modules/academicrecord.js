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

  constructor(rga, nome, disciplina, situacao, ano, semestre) {
    this.rga = rga;
    this.nome = nome;
    this.disciplina = disciplina;
    this.situacao = situacao;
    this.ano = ano;
    this.semestre = semestre;
    this.createdBy = Meteor.userId();
  }
}
