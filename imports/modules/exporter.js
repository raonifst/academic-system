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

  download(csv, nome) {
    // TODO refatorar forma de fazer essa exportacao
    const blob = new Blob([csv]);
    const a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(blob, {type: "text/plain"});
    a.download = nome+'.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};

export default Exporter;
