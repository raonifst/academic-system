import {Meteor} from "meteor/meteor";

function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

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

  groupBy(maxCreditsPerSemester = 28, option = 1) {
    const self = this;
    const result = [];
    const to = deepCopy(this.getTopologicalOrder());
    var index = 0;
    var counter = this.size();
    var creditsCounter = 0;
    var k;

    result[index] = [];
    while (counter > 0) {

      // TODO Aqui, implementar algoritmo que quebra grupo baseado nos tempos

      to.sort(function (a, b) {
        if (a.length > 0 && b.length > 0) {
          const cA = self._gMap.get(a[0]);
          const cB = self._gMap.get(b[0]);
          // TODO adicionar critério de seleção para disciplinas com maior qtd. de créditos
          if (cA.perc_ap - cB.perc_ap != 0)
            return cB.perc_ap - cA.perc_ap; // Disciplinas com maior aprovação
          else
            return cA.semestre - cB.semestre; // Disciplinas no menor semestre
        }
        return 0;
      }); // Ordena os grupos de disciplina

      for (k = 0; k < to.length; k++) {
        const courseCode = to[k][0]; // Recebe a primeira disciplina do grupo k
        if (!courseCode) { // Grupo é vazio
          to.splice(k--, 1);
          continue;
        }
        creditsCounter += this._gMap.get(courseCode).creditos;
        if (creditsCounter >= maxCreditsPerSemester) {
          result[++index] = [];
          creditsCounter = this._gMap.get(courseCode).creditos;
        }
        result[index].push(this._gMap.get(to[k].shift()).nome);
        counter--;
      }
    }
    return result;
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
