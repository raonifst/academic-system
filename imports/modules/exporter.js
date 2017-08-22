export const Exporter = {
  courses(collection, nome) {
    var fields = [
      "codigo",
      "nome",
      "creditos",
      "semestre",
      "prereq"
    ];

    var data = [];
    _.each(collection, function(c) {
      data.push([
        c.codigo,
        c.nome,
        c.creditos,
        c.semestre,
        c.prereq
      ]);
    });

    this.download(Papa.unparse({ fields: fields, data: data }), nome);
  },

  records(collection, nome) {
    var fields = [
      "rga",
      "nome",
      "disciplina",
      "situacao",
      "ano",
      "semestre"
    ];

    var data = [];
    _.each(collection, function(r) {
      data.push([
        r.rga,
        r.nome,
        r.disciplina,
        r.situacao,
        r.ano,
        r.semestre
      ]);
    });

    this.download(Papa.unparse({ fields: fields, data: data }), nome);
  },
  Qstudents(collection, nome) {
    var fields = [
      "codigo",
      "nome",
    ];

    var data = [];
    _.each(collection, function(s) {
      data.push([
        s.codigo,
        s.nome
      ]);
    });

    this.download(Papa.unparse({ fields: fields, data: data }), nome);
  },

  Qcourses(collection, nome) {
    var fields = [
      "rga",
      "nome",
    ];

    var data = [];
    _.each(collection, function(c1) {
      data.push([
        c1.rga,
        c1.nome
      ]);
    });

    this.download(Papa.unparse({ fields: fields, data: data }), nome);
  },

  download(csv, nome) {
    // TODO refatorar forma de fazer essa exportacao
    const blob = new Blob([csv]);
    const a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(blob, {type: "text/plain"});
    a.download = nome+'.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  },

  csvexample(tipo) {
    if (tipo == 'courses') this.courses(exampleCourses, 'examplecourses');
    else if (tipo == 'records') this.records(exampleRecords, 'examplerecords');
  }
};

const exampleCourses = [
  { codigo:   90000001,
    nome:     'CALCULO I',
    creditos: 4,
    semestre: 1,
    prereq:   '' },

  { codigo:   90000003,
    nome:     'ALGORITMOS E PROGRAMAÇÃO DE COMPUTADORES',
    creditos: 4,
    semestre: 1,
    prereq:   '' },

  { codigo:   90000008,
    nome:     'CÁLCULO II',
    creditos: 4,
    semestre: 2,
    prereq:   '90000001' },

  { codigo:   90000010,
    nome:     'GEOMETRIA ANALÍTICA E ÁLGEBRA LINEAR',
    creditos: 6,
    semestre: 2,
    prereq:   '' },

  { codigo:   90000017,
    nome:     'ESTRUTURAS DE DADOS',
    creditos: 6,
    semestre: 3,
    prereq:   '90000003' },

  { codigo:   90000040,
    nome:     'COMPUTAÇÃO GRÁFICA',
    creditos: 4,
    semestre: 5,
    prereq:   '90000010;90000017' },
];

const exampleRecords = [
  { rga: 201522401111,
    nome: 'Luis Guilherme',
    disciplina: 'CÁLCULO I',
    situacao: 'AP',
    ano: 2016,
    semestre: 1 },

  { rga: 201522401112,
    nome:'Mauro Silva' ,
    disciplina: 'CÁLCULO I',
    situacao: 'RF',
    ano: 2016,
    semestre: 1 },

  { rga: 201522401113,
    nome: 'Maria Souza',
    disciplina: 'CÁLCULO I',
    situacao: 'AP',
    ano: 2016,
    semestre: 2 },

  { rga: 201522401114,
    nome: 'Luiz Paulo Guimarães',
    disciplina: 'CÁLCULO I',
    situacao: 'RF',
    ano: 2016,
    semestre: 2 },
];

export default Exporter;
