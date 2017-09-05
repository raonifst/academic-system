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
  }

  setColorTo(vertex, color) {
    this._colors.set(vertex, color);
  }

  setPiTo(vertex, pi) {
    this._pi.set(vertex, pi);
  }

  getColorFrom(vertex) {
    return this._colors.get(vertex);
  }

  getPiFrom(vertex) {
    return this._pi.get(vertex);
  }
}

export class CVertexAttrDFS extends CVertexAttr {
  constructor() {
    super();
    this._dtime = new Map();
    this._ftime = new Map();
  }

  setDiscoveredTimeTo(vertex, d) {
    this._dtime.set(vertex, d);
  }

  setFinishedTimeTo(vertex, f) {
    this._ftime.set(vertex, f);
  }

  getDiscoveredTimeFrom(vertex) {
    return this._dtime.get(vertex);
  }

  getFinishedTimeFrom(vertex) {
    return this._ftime.get(vertex);
  }
}

export class CVertexAttrBFS extends CVertexAttr {
  constructor() {
    super();
    this._level = new Map();
  }

  setLevelTo(vertex, l) {
    this._level.set(vertex, l);
  }

  getLevelFrom(vertex) {
    return this._level.get(vertex);
  }
}

export class CoursesDAG {
  constructor(coursesArray, hardValidate = true) {
    this._gMap = new Map();
    this._adjMap = new Map();
    this._topologicalOrder = null;
    this._levelGrouping = null;
    this._bfsData = null;
    this._dfsData = null;
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
    this._levelGrouping = null;
    this._bfsData = null;
    this._dfsData = null;
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
    this._dfsData = new CVertexAttrDFS();
    this._topologicalOrder = [];
    for (var key1 of this._adjMap.keys()) {
      this._dfsData.setColorTo(key1, GraphColors.WHITE);
      this._dfsData.setPiTo(key1, null);
    }
    this._time = 0;
    for (var key2 of this._adjMap.keys()) {
      if (this._dfsData.getColorFrom(key2) == GraphColors.WHITE) {
        var list = [];
        this._dfsVisit(key2, list);
        this._topologicalOrder.push(list);
      }
    }
    return this._dfsData;
  }

  _dfsVisit(uKey, outputList) {
    var uAdjList = this._adjMap.get(uKey);
    this._dfsData.setColorTo(uKey, GraphColors.GRAY);
    this._dfsData.setDiscoveredTimeTo(uKey, ++this._time);
    uAdjList.forEach(vKey => {
      var vColor = this._dfsData.getColorFrom(vKey);
      if (vColor == GraphColors.WHITE) {
        this._dfsData.setPiTo(vKey, uKey);
        this._dfsVisit(vKey, outputList);
      } else if (vColor == GraphColors.GRAY) { // Grafo contém ciclo
        throw new Meteor.Error("invalid-dag", msgCoursesGraph.msgCycleError);
      }
    });
    this._dfsData.setColorTo(uKey, GraphColors.BLACK);
    this._dfsData.setFinishedTimeTo(uKey, ++this._time);
    if (outputList != null) outputList.unshift(uKey);
  }

  _bfs() {
    this._bfsData = new CVertexAttrBFS();
    this._levelGrouping = [];
    for (var key1 of this._adjMap.keys()) {
      this._bfsData.setColorTo(key1, GraphColors.WHITE);
      this._bfsData.setPiTo(key1, null);
    }
    var maxLevel = 1;
    const queue = [];
    const topOrd = this.getTopologicalOrder();
    topOrd.forEach(e => {
      queue.push(e[0]);
      this._bfsData.setLevelTo(e[0], maxLevel);
    });
    while (queue.length > 0) {
      const uKey = queue.shift();
      const uAdkList = this._adjMap.get(uKey);
      const uLevel = this._bfsData.getLevelFrom(uKey);
      this._bfsData.setColorTo(uKey, GraphColors.GRAY);
      uAdkList.forEach(vKey => {
        const vColor = this._bfsData.getColorFrom(vKey);
        const vLevel = uLevel + 1;
        if (vColor == GraphColors.WHITE || vLevel > this._bfsData.getLevelFrom(vKey)) {
          this._bfsData.setColorTo(vKey, GraphColors.GRAY);
          this._bfsData.setPiTo(vKey, uKey);
          this._bfsData.setLevelTo(vKey, vLevel);
          if (vLevel > maxLevel)
            maxLevel = vLevel;
          queue.push(vKey);
        }
      });
      this._bfsData.setColorTo(uKey, GraphColors.BLACK);
    }
    for (var i = 0; i < maxLevel; i++) {
      this._levelGrouping[i] = [];
    }
    for (var key2 of this._bfsData._level.keys()) {
      this._levelGrouping[this._bfsData.getLevelFrom(key2) - 1].push(key2);
    }
    return this._bfsData;
  }

  _topologicalSort() {
    this._dfs();
  }

  getTopologicalOrder() {
    if (!this._topologicalOrder || this._topologicalOrder.length == 0)
      this._topologicalSort();
    return this._topologicalOrder;
  }

  getAttributes() {
    return this._dfsData;
  }

  size() {
    return this._size;
  }

  groupBy(maxCreditsPerSemester = 28, option = 1) {
    const self = this;
    const result = [];
    const to = deepCopy(this.getTopologicalOrder());

    var index = -1;
    var counter = this.size();
    var creditsCounter;
    var k;
    const sortCoursesOptions = [
      // Critérios de ordenação:
      // 1. Disciplinas com maior aprovação;
      // 2. Disciplinas no menor semestre;
      // 3. Disciplinas com menor quantidade de créditos.
      function (a, b) {
        if (a.length > 0 && b.length > 0) {
          const cA = self._gMap.get(a[0]);
          const cB = self._gMap.get(b[0]);
          if (cA.perc_ap - cB.perc_ap != 0)
            return cB.perc_ap - cA.perc_ap;   // Maior aprovação primeiro
          else if (cA.semestre - cB.semestre != 0)
            return cA.semestre - cB.semestre; // Menor semestre primeiro
          else
            return cA.creditos - cB.creditos; // Menor qtd. créditos primeiro
        }
        return 0;
      },
      // Critérios de ordenação:
      // 1. Disciplinas no menor semestre;
      // 2. Disciplinas com maior aprovação;
      // 3. Disciplinas com menor quantidade de créditos.
      function (a, b) {
        if (a.length > 0 && b.length > 0) {
          const cA = self._gMap.get(a[0]);
          const cB = self._gMap.get(b[0]);
          if (cA.semestre - cB.semestre != 0)
            return cA.semestre - cB.semestre; // Menor semestre primeiro
          else if (cA.perc_ap - cB.perc_ap != 0)
            return cB.perc_ap - cA.perc_ap;   // Maior aprovação primeiro
          else
            return cA.creditos - cB.creditos; // Menor qtd. créditos primeiro
        }
        return 0;
      },
      // Critérios de ordenação:
      // 1. Disciplinas com menor quantidade de créditos.
      // 2. Disciplinas no menor semestre;
      // 3. Disciplinas com maior aprovação;
      function (a, b) {
        if (a.length > 0 && b.length > 0) {
          const cA = self._gMap.get(a[0]);
          const cB = self._gMap.get(b[0]);
          if (cA.creditos - cB.creditos != 0)
            return cA.creditos - cB.creditos; // Menor qtd. créditos primeiro
          else if (cA.semestre - cB.semestre != 0)
            return cA.semestre - cB.semestre; // Menor semestre primeiro
          else
            return cB.perc_ap - cA.perc_ap;   // Maior aprovação primeiro
        }
        return 0;
      }
    ];
    const splitGroup = function (to, k) {
      const group = to[k];
      const topCourse = group[0];
      for (var l = 1; l < group.length; l++) {
        // Analisar os time deltas
        const evaluatedDelta = self._evalTimeDelta(topCourse, group[l]);
        if (evaluatedDelta != 0) { // Necessita quebrar o grupo na disciplina group[l]
          // Parte o grupo de l até (to[k].length - )
          const newGroup = group.splice(l, (group.length - l));
          // Pega o pedaço cortado e concatena em group
          to.splice(k + 1, 0, newGroup);
          // Chamada recursiva para particionar o novo grupo criada
          splitGroup(to, k + 1);
          return;
        }
      }
    };
    var newTerm = false;
    // TODO refazer a forma de quebrar as disciplinas
    result[index] = [];
    while (counter > 0) {
      result[++index] = [];
      creditsCounter = 0;
      for (k = 0; k < to.length; k++) // Verificar se há grupos particionáveis
        splitGroup(to, k);
      to.sort(sortCoursesOptions[option - 1]); // Ordena os grupos de disciplina
      console.log(to);
      for (k = 0; k < to.length; k++) {
        const topCourse = to[k][0]; // Recebe a primeira disciplina do grupo k
        if (!topCourse) { // Grupo é vazio
          to.splice(k--, 1);
          continue;
        }
        creditsCounter += this._gMap.get(topCourse).creditos;
        if (creditsCounter >= maxCreditsPerSemester) {
          newTerm = true;
          result[++index] = [];
          creditsCounter = this._gMap.get(topCourse).creditos;
        }
        result[index].push(this._gMap.get(to[k].shift())); // Remove do grupo k e adiciona no resultado
        counter--;
        if(newTerm) k = 0;
      }
    }
    return result;
  }

  _evalTimeDelta(courseCode1, courseCode2) {
    const dtime1 = this._dfsData.getDiscoveredTimeFrom(courseCode1);
    const ftime1 = this._dfsData.getFinishedTimeFrom(courseCode1);
    const dtime2 = this._dfsData.getDiscoveredTimeFrom(courseCode2);
    const ftime2 = this._dfsData.getFinishedTimeFrom(courseCode2);
    if (dtime1 >= dtime2 && ftime1 >= ftime2)
      return 1;     // Intervalo de courseCode1 está mais deslocado à DIREITA
    else if (dtime1 <= dtime2 && ftime1 <= ftime2)
      return -1;    // Intervalo de courseCode1 está mais deslocado à ESQUERDA
    else
      return 0;     // Intervalos estão completamente sobrepostos
  }
}
