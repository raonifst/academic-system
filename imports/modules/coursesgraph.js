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
    this._colors = new Map();
    this._pi = new Map();
    this._dtime = new Map();
    this._ftime = new Map();
  }

  setColorTo(vertex, color) {
    this._colors.set(vertex, color);
  }

  setPiTo(vertex, pi) {
    this._pi.set(vertex, pi);
  }

  setDiscoveredTimeTo(vertex, d) {
    this._dtime.set(vertex, d);
  }

  setFinishedTimeTo(vertex, f) {
    this._ftime.set(vertex, f);
  }

  getColorFrom(vertex) {
    return this._colors.get(vertex);
  }

  getPiFrom(vertex) {
    return this._pi.get(vertex);
  }

  getDiscoveredTimeFrom(vertex) {
    return this._dtime.get(vertex);
  }

  getFinishedTimeFrom(vertex) {
    return this._ftime.get(vertex);
  }
}

export class CoursesDAG {
  constructor(coursesArray) {
    this._gmap = new Map();
    coursesArray.forEach(c => this._gmap.set(c.codigo, c.prereq));
    /* A primeira validação apenas verifica se existem disciplinas inválidas e/ou ciclos no grafo.
     * A segunda validação (após transposição) gera os resultados corretos para a ordenação
     * topológica do grafo.
     */
    this._validate();
    this.transpose();
    this._validate();
  }

  _reset() {
    this._topologicalOrder = null;
    this._attributes = null;
  }

  _validate() {
    this._reset();
    this.getTopologicalOrder();
    if (!this._topologicalOrder) {
      this._topologicalOrder = [];
      throw new Meteor.Error("invalid-dag", msgCoursesGraph.msgCourseNotFound);
    }
    if (this._topologicalOrder.length <= 0)
      throw new Meteor.Error("invalid-dag", msgCoursesGraph.msgCycleError);
  }

  transpose() {
    var revMap = new Map();
    for (var key1 of this._gmap.keys()) {
      revMap.set(key1, []);
    }
    for (var u of this._gmap.keys()) {
      var adjList = this._gmap.get(u);
      adjList.forEach(v => revMap.get(v).push(u));
    }
    this._gmap = revMap;
  }

  _dfs() {
    this._attributes = new CVertexAttr();
    for (var key1 of this._gmap.keys()) {
      this._attributes.setColorTo(key1, GraphColors.WHITE);
      this._attributes.setPiTo(key1, null);
      //this._attributes.setDiscoveredTimeTo(key1, -1);
    }
    this._time = 0;
    for (var key2 of this._gmap.keys()) {
      if (this._attributes.getColorFrom(key2) == GraphColors.WHITE) {
        var list = [];
        this._dfsVisit(key2, list);
        this._topologicalOrder.push(list);
      }
    }
    return this._attributes;
  }

  _dfsVisit(uKey, outputList) {
    var uAdjList = this._gmap.get(uKey);
    this._attributes.setColorTo(uKey, GraphColors.GRAY);
    this._attributes.setDiscoveredTimeTo(uKey, ++this._time);
    uAdjList.forEach(vKey => {
      var vColor = this._attributes.getColorFrom(vKey);
      var vAdjList = this._gmap.get(vKey);
      if (!vAdjList) {
        throw new Meteor.Error("graph-invalid-keys", msgCoursesGraph.msgCourseNotFound);
      } else if (vColor == GraphColors.WHITE) {
        this._attributes.setPiTo(vKey, uKey);
        this._dfsVisit(vKey, outputList);
      } else if (vColor == GraphColors.GRAY) { // Grafo contém ciclo
        throw new Meteor.Error("graph-contains-cycles", msgCoursesGraph.msgCycleError);
      }
    });
    this._attributes.setColorTo(uKey, GraphColors.BLACK);
    this._attributes.setFinishedTimeTo(uKey, ++this._time);
    if (outputList != null) outputList.unshift(uKey);
  }

  _topologicalSort() {
    this._topologicalOrder = [];
    try {
      this._dfs();
    } catch (e) {
      if (e.error == "graph-contains-cycles")
        this._topologicalOrder = [];
      if (e.error == "graph-invalid-keys")
        this._topologicalOrder = null;
    }
  }

  getTopologicalOrder() {
    if (this._topologicalOrder == null)
      this._topologicalSort();
    return this._topologicalOrder;
  }

  getAttributes() {
    return this._attributes;
  }
}
