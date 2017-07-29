export const DGraph = {

  colorWhite: 0,
  colorGray: 1,
  colorBlack: 2,

  parseArrayToMap(arr) {

    const graph = new Map();

    arr.forEach(item => {
      graph.set(item.codigo, {
        color: this.colorWhite,
        adjList: item.prereq
      })
    });

    return graph;
  },

  depthFirstSearch(graph, initialVertexCode, list) {

    var stack = [];
    var uKey, u, vKey, v, isVertexLeaf;
    stack.push(initialVertexCode);

    while (stack.length > 0) {
      isVertexLeaf = 1;
      uKey = stack.pop();
      u = graph.get(uKey);
      graph.set(uKey, {
        color: this.colorGray,
        adjList: u.adjList
      });
      for (var i = 0; i < u.adjList.length; i++) {
        vKey = u.adjList[i];
        v = graph.get(vKey);
        if (!v)
          throw "Estrutura contém um ou mais códigos de disciplinas inválidos.";
        if (v.color == this.colorWhite) {
          stack.push(vKey);
          isVertexLeaf = 0;
        } else if (v.color == this.colorGray) { // Grafo contém ciclo
          throw "Listas de pré-requisitos contém um ou mais ciclos. Corrija-os e tente novamente!";
        }
      }
      if (isVertexLeaf) {
        graph.set(uKey, {
          color: this.colorBlack,
          adjList: u.adjList
        });
        list.push(uKey);
      }
    }
  },

  topologicalSorting(disciplinesGraphArray) {

    var list = [];
    const graph = this.parseArrayToMap(disciplinesGraphArray);
    for (var key of graph.keys()) {
      this.depthFirstSearch(graph, key, list);
    }
    return list;
  }

};
