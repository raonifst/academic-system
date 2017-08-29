import {Meteor} from "meteor/meteor";

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
  constructor(coursesArray, hardValidate = true) {
    this._gMap = new Map();
    this._adjMap = new Map();
    this._topologicalOrder = null;
    this._attributes = null;
    this._size = 0;
    this._hardValidate = hardValidate;
    coursesArray.forEach(c => {
      this._gMap.set(c.codigo, c);
      this._adjMap.set(c.codigo, c.prereq);
      this._size++;
    });
    this._transpose();
    this._validate();
  }

  _reset() {
    this._topologicalOrder = null;
    this._attributes = null;
  }

  _validate() {
    this._reset();
    try {
      this.getTopologicalOrder();
    } catch (e) {
      this._topologicalOrder = null;
      throw e;
    }
  }

  _transpose() {
    var revAdjMap = new Map();
    for (var key1 of this._adjMap.keys()) {
      revAdjMap.set(key1, []);
    }
    for (var u of this._adjMap.keys()) {
      var adjList = this._adjMap.get(u);
      adjList.forEach(v => {
        const vAdjList = revAdjMap.get(v);
        if (!vAdjList) {
          if (this._hardValidate)
            throw new Meteor.Error("invalid-dag", msgCoursesGraph.msgCourseNotFound);
        } else {
          revAdjMap.get(v).push(u);
        }
      });
    }
    this._adjMap = revAdjMap;
  }

  _dfs() {
    this._attributes = new CVertexAttr();
    for (var key1 of this._adjMap.keys()) {
      this._attributes.setColorTo(key1, GraphColors.WHITE);
      this._attributes.setPiTo(key1, null);
    }
    this._time = 0;
    for (var key2 of this._adjMap.keys()) {
      if (this._attributes.getColorFrom(key2) == GraphColors.WHITE) {
        var list = [];
        this._dfsVisit(key2, list);
        this._topologicalOrder.push(list);
      }
    }
    return this._attributes;
  }

  _dfsVisit(uKey, outputList) {
    var uAdjList = this._adjMap.get(uKey);
    this._attributes.setColorTo(uKey, GraphColors.GRAY);
    this._attributes.setDiscoveredTimeTo(uKey, ++this._time);
    uAdjList.forEach(vKey => {
      var vColor = this._attributes.getColorFrom(vKey);
      if (vColor == GraphColors.WHITE) {
        this._attributes.setPiTo(vKey, uKey);
        this._dfsVisit(vKey, outputList);
      } else if (vColor == GraphColors.GRAY) { // Grafo contém ciclo
        throw new Meteor.Error("invalid-dag", msgCoursesGraph.msgCycleError);
      }
    });
    this._attributes.setColorTo(uKey, GraphColors.BLACK);
    this._attributes.setFinishedTimeTo(uKey, ++this._time);
    if (outputList != null) outputList.unshift(uKey);
  }

  _topologicalSort() {
    this._topologicalOrder = [];
    this._dfs();
  }

  getTopologicalOrder() {
    if (!this._topologicalOrder || this._topologicalOrder.length == 0)
      this._topologicalSort();
    return this._topologicalOrder;
  }

  getAttributes() {
    return this._attributes;
  }

  size() {
    return this._size;
  }

  groupBy(maxCreditsPerSemester = 28) {
    const groups = new Map();
    var topologicalOrder = JSON.parse(JSON.stringify(this.getTopologicalOrder())); // Deep copy
    var index = 1;
    var creditsCounter = 0;
    groups.set(index, []);
    for (var i = 1; i <= this.size(); i++) {

      for (var k = 0; k < topologicalOrder.length; k++) {
        // TODO adicionar atributos de cores nos grupos / modificar laço de repetição
        // Ordena os k agrupamentos pela "dificuldade" da disciplina do topo do grupo
        topologicalOrder.sort(function (a, b) {
          return (a.length > 0 && b.length > 0) ? (-1)*(a[0].perc_ap - b[0].perc_ap) : 0;
        });
        const courseCode = topologicalOrder[k][0]; // Recebe a primeira disciplina do grupo k
        if (!courseCode) {
          topologicalOrder.splice(k--, 1);
          continue;
        }
        creditsCounter += this._gMap.get(courseCode).creditos;
        if (creditsCounter >= maxCreditsPerSemester) {
          groups.set(++index, []);
          creditsCounter = 0;
          continue;
        }
        groups.get(index).push(this._gMap.get(topologicalOrder[k].shift()).nome);
        // TODO a partir daqui, implementar algoritmo que quebra grupo baseado nos tempos

        // *** Início de bloco de testes ***

        if (topologicalOrder[k].length > 0) {
          const top = topologicalOrder[k][0];
          for (var l = 0; l < topologicalOrder[k].length; l++) {

          }
        }

        // *** Fim de bloco de testes ***
      }
    }
    return groups;
  }

  evalTimeDelta(courseCode1, courseCode2) {
    const dtime1 = this._attributes.getDiscoveredTimeFrom(courseCode1);
    const ftime1 = this._attributes.getFinishedTimeFrom(courseCode1);
    const dtime2 = this._attributes.getDiscoveredTimeFrom(courseCode2);
    const ftime2 = this._attributes.getFinishedTimeFrom(courseCode2);
    if (dtime1 >= dtime2 && ftime1 >= ftime2)
      return 1;     // Intervalo de courseCode1 está mais deslocado à DIREITA
    else if (dtime1 <= dtime2 && ftime1 <= ftime2)
      return -1;    // Intervalo de courseCode1 está mais deslocado à ESQUERDA
    else
      return 0;     // Intervalos estão completamente sobrepostos
  }


}
