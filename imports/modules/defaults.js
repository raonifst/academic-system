const Default = Object.freeze({
  gradProgramsList: [
    Object.freeze({ name: 'Engenharia de Computação' }),
    Object.freeze({ name: 'Engenharia de Controle e Automação' }),
    Object.freeze({ name: 'Engenharia de Minas' }),
    Object.freeze({ name: 'Engenharia de Transportes' }),
    Object.freeze({ name: 'Engenharia Química' })
  ],

  alertTimeList: [
    Object.freeze({ id: "1", value: 1000 }),
    Object.freeze({ id: "2", value: 2000 }),
    Object.freeze({ id: "3", value: 3000 }),
    Object.freeze({ id: "4", value: 4000 }),
    Object.freeze({ id: "5", value: 5000 }),
    Object.freeze({ id: "6", value: 6000 })
  ],

  rootUser: Object.freeze({
    name:             "Fabricio Barbosa de Carvalho",
    gradProgram:      "Engenharia de Computação",
    currentYear:      2014,
    currentSemester:  2
  })
});

export default Default;
