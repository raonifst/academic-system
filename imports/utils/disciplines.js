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

    const u = graph.get(initialVertexCode);

    graph.set(initialVertexCode, {
      color: this.colorGray,
      adjList: u.adjList
    });

    for (var i = 0; i < u.adjList.length; i++) {
      var v = graph.get(u.adjList[i]);
      if (v.color == this.colorWhite)
        this.depthFirstSearch(graph, u.adjList[i], list);
      else if (v.color == this.colorGray) {
        list[0] = -1;
        return;
      }
    }
    graph.set(initialVertexCode, {
      color: this.colorBlack,
      adjList: u.adjList
    });

    list.push(initialVertexCode);
  },

  topologicalSorting(graph) {

    var list = [];
    for (var key of graph.keys()) {
      this.depthFirstSearch(graph, key, list);
      if (list.length >= 1 && list[0] == -1)
        break;
    }
    return list;
  },

  hasCycle(disciplinesGraphArray) {
    const graph = this.parseArrayToMap(disciplinesGraphArray);
    const list = this.topologicalSorting(graph);
    return list.length >= 1 && list[0] == -1;
  }

};
