import {Meteor} from "meteor/meteor";

export class Course {
  static validator() {
    return {
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
    };
  }

  static prereqDelimiter() {
    return ";";
  }

  constructor(codigo, nome, creditos, semestre, prereq) {
    this.codigo = parseInt(codigo);
    this.nome = nome;
    this.creditos = parseInt(creditos);
    this.semestre = parseInt(semestre);
    this.prereq = prereq;
    this.aprovacoes = 0;
    this.reprovacoes = 0;
    this.reincidencia = 0;
    this.aprov2 = 0;
    this.perc_ap = 0;
    this.perc_reic = 0;
    this.perc_aprov2 = 0;
    this.alunos = 0;
    this.createdBy = Meteor.userId();
  }

  convertPrereqToArray() {
    if (!this.prereq)
      this.prereq = [];
    else {
      var s = this.prereq.split(Course.prereqDelimiter());
      this.prereq = (s == "") ? [] : s.map(Number);
    }
  }

  getPrereqAsString() {
    var arr = this.prereq;
    return arr.join(Course.prereqDelimiter());
  }
}
