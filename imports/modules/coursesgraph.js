import {Meteor} from "meteor/meteor"

const GraphColors = Object.freeze({
  WHITE: 0,
  GRAY: 1,
  BLACK: 2
});

const msgCoursesGraph = Object.freeze({
  msgCycleError:      "Listas de pré-requisitos contém um ou mais ciclos. " +
                      "Corrija-os e tente novamente!",
  msgCourseNotFound:  "Estrutura contém uma ou mais disciplinas com código inválido."
});

export class CVertexAttr {
  constructor() {
    this.colorMap = new Map();
    this.piMap = new Map();
    this.discoveredMap = new Map();
    this.finishedMap = new Map();
  }

  setColorTo(vertex, color) {
    this.colorMap.set(vertex, color);
  }

  setPiTo(vertex, pi) {
    this.piMap.set(vertex, pi);
  }

  setDiscoveredTimeTo(vertex, d) {
    this.discoveredMap.set(vertex, d);
  }

  setFinishedTimeTo(vertex, f) {
    this.finishedMap.set(vertex, f);
  }

  getColorFrom(vertex) {
    return this.colorMap.get(vertex);
  }

  getPiFrom(vertex) {
    return this.piMap.get(vertex);
  }

  getDiscoveredTimeFrom(vertex) {
    return this.discoveredMap.get(vertex);
  }

  getFinishedTimeFrom(vertex) {
    return this.finishedMap.get(vertex);
  }
}

export class CoursesDAG {
  constructor(coursesArray) {
    this.gMap = new Map();
    this.topologicalOrder = null;
    this.attributes = null;
    coursesArray.forEach(item => {
      this.gMap.set(item.codigo, item.prereq);
    });
    this._validate(); // Verifica se existem códigos inválidos ou ciclos no DAG
    this.topologicalOrder = this.attributes = null;
    this.transpose();
    // Para fazer uma segunda validação do grafo transposto (não é necessário) descomente as
    // duas linhas abaixo:
    this._validate();
    this.topologicalOrder = this.attributes = null;
  }

  _validate() {
    var list = this.topologicalSort();
    // TODO remove this debug line later
    console.log(list); // Debug
    if (!list)
      throw new Meteor.Error("invalid-dag", msgCoursesGraph.msgCourseNotFound);
    if (list.length <= 0)
      throw new Meteor.Error("invalid-dag", msgCoursesGraph.msgCycleError);
  }

  transpose() {
    var revMap = new Map();
    for (var key1 of this.gMap.keys()) {
      revMap.set(key1, []);
    }
    for (var u of this.gMap.keys()) {
      var adjList = this.gMap.get(u);
      adjList.forEach(v => {
        revMap.get(v).push(u);
      });
    }
    this.gMap = revMap;
  }

  _dfs() {
    this.attributes = new CVertexAttr();
    for (var key1 of this.gMap.keys()) {
      this.attributes.setColorTo(key1, GraphColors.WHITE);
      this.attributes.setPiTo(key1, null);
      this.attributes.setDiscoveredTimeTo(key1, -1);
    }
    this.time = 0;
    for (var key2 of this.gMap.keys()) {
      if (this.attributes.getColorFrom(key2) == GraphColors.WHITE) {
        var list = [];
        this._dfsVisit(key2, list);
        this.topologicalOrder.push(list);
      }
    }
    // TODO remove this debug line later
    console.log(this.attributes);
    return this.attributes;
  }

  _dfsVisit(initialVertexCode, outputList) {
    var uKey = initialVertexCode;
    var uAdjList = this.gMap.get(uKey);
    this.attributes.setColorTo(uKey, GraphColors.GRAY);
    this.attributes.setDiscoveredTimeTo(uKey, ++this.time);
    uAdjList.forEach(vKey => {
      var vColor = this.attributes.getColorFrom(vKey);
      var vAdjList = this.gMap.get(vKey);
      if (!vAdjList) {
        throw new Meteor.Error("graph-invalid-keys", msgCoursesGraph.msgCourseNotFound);
      } else if (vColor == GraphColors.WHITE) {
        this.attributes.setPiTo(vKey, uKey);
        this._dfsVisit(vKey, outputList); // Recursão
      } else if (vColor == GraphColors.GRAY) { // Grafo contém ciclo
        throw new Meteor.Error("graph-contains-cycles", msgCoursesGraph.msgCycleError);
      }
    });
    this.attributes.setColorTo(uKey, GraphColors.BLACK);
    this.attributes.setFinishedTimeTo(uKey, ++this.time);
    if (outputList != null)
      outputList.unshift(uKey);
  }

  topologicalSort() {
    if (this.topologicalOrder == null) {
      this.topologicalOrder = [];
      try {
        this._dfs();
      } catch (e) {
        if (e.error == "graph-contains-cycles")
          this.topologicalOrder = [];
        if (e.error == "graph-invalid-keys")
          this.topologicalOrder = null;
      }
    }
    return this.topologicalOrder;
  }
}
