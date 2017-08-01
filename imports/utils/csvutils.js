const prereqDelimiter = ";";


export const CsvUtils = {

  prereqArrayToString(arr) {
    for (var i = 0; i < arr.length; i++)
      arr[i] = Disciplines.findOne({ _id: arr[i] }).codigo;
    return arr.join(prereqDelimiter);
  },

  prereqStringToArray(str) {
    if (!str)
      return [];
    var s = str.split(prereqDelimiter);
    return (s == "") ? [] : s.map(Number);
  }

};

export const exampleDisciplinesCSV = [
    {codigo: 90000001,
     nome: 'CALCULO I',
     creditos: 4,
     semestre: 1,
     prereq: ''},

    {codigo: 90000003,
     nome: 'ALGORITMOS E PROGRAMAÇÃO DE COMPUTADORES',
     creditos: 4,
     semestre: 1,
     prereq: ""},

    {codigo: 90000008,
     nome: 'CÁLCULO II',
     creditos: 4,
     semestre: 2,
     prereq: 90000001},

    {codigo: 90000010,
     nome: 'GEOMETRIA ANALÍTICA E ÁLGEBRA LINEAR',
     creditos: 6,
     semestre: 2,
     prereq: ""},

    {codigo: 90000017,
     nome: 'ESTRUTURAS DE DADOS',
     creditos: 6,
     semestre: 3,
     prereq: 90000003},

    {codigo: 90000040,
     nome: 'COMPUTAÇÃO GRÁFICA',
     creditos: 4,
     semestre: 5,
     prereq: '90000010;90000017'}
]

export const exampleRecordCSV = [
    {rga: 201522401111,
     nome: 'Luis Guilherme',
     disciplina: 'CÁLCULO I',
     situacao: 'AP',
     ano: 2016,
     semestre: 1},

    {rga: 201522401112,
     nome:'Mauro Silva' ,
     disciplina: 'CÁLCULO I',
     situacao: 'RF',
     ano: 2016,
     semestre: 1},

    {rga: 201522401113,
     nome: 'Maria Souza',
     disciplina: 'CÁLCULO I',
     situacao: 'AP',
     ano: 2016,
     semestre: 2},

    {rga: 201522401114,
     nome: 'Luiz Paulo Guimarães',
     disciplina: 'CÁLCULO I',
     situacao: 'RF',
     ano: 2016,
     semestre: 2},
]
