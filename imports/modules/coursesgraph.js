import {Meteor} from "meteor/meteor"

const GraphColors = Object.freeze({
  WHITE: 0,
  GRAY: 1,
  BLACK: 2
});

const msgCoursesGraph = Object.freeze({
  msgCycleError: "Listas de pré-requisitos contém um ou mais ciclos. " +
                  "Corrija-os e tente novamente!",
  msgCourseNotFound: "Estrutura contém uma ou mais disciplinas com código inválido."
});

export class CVertexAttr {
  constructor() {
    this.colorMap = new Map();
    this.piMap = new Map();
    this.discoveredMap = new Map();
    this.finishedMap = new Map();
    this.time = 0;
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

export class CoursesGraph {
  constructor(coursesArray) {
    this.gMap = new Map();
    coursesArray.forEach(item => {
      this.gMap.set(item.codigo, item.prereq);
    });
  }

  depthFirstSearch(list) {
    var attr = new CVertexAttr();
    for (var key1 of this.gMap.keys()) {
      attr.setColorTo(key1, GraphColors.WHITE);
      attr.setPiTo(key1, null);
      attr.setDiscoveredTimeTo(key1, -1);
    }
    for (var key2 of this.gMap.keys()) {
      if (attr.getColorFrom(key2) == GraphColors.WHITE)
        this._depthFirstSearchVisit(key2, attr, list);
    }
    // TODO remove this debug line later
    console.log(attr);
  }

  _depthFirstSearchVisit(initialVertexCode, vAttr, outputList) {
    var stack = [];
    var uKey, uAdjList, isVertexLeaf;
    this.time = 0;
    stack.push(initialVertexCode);
    while (stack.length > 0) {
      isVertexLeaf = 1;
      uKey = stack.pop();
      uAdjList = this.gMap.get(uKey);
      vAttr.setColorTo(uKey, GraphColors.GRAY);
      // TODO remove this debug line later
      console.log("Vertex " + uKey + " changed color to " + vAttr.getColorFrom(uKey));
      vAttr.setDiscoveredTimeTo(uKey, ++this.time);
      // TODO remove this debug line later
      console.log("Vertex " + uKey + " changed dtime to " + vAttr.getDiscoveredTimeFrom(uKey));
      uAdjList.forEach(vKey => {
        var vColor = vAttr.getColorFrom(vKey);
        var vAdjList = this.gMap.get(vKey);
        if (!vAdjList) {
          throw new Meteor.Error("graph-invalid-keys", msgCoursesGraph.msgCourseNotFound);
        } else if (vColor == GraphColors.WHITE) {
          vAttr.setPiTo(vKey, uKey);
          // TODO remove this debug line later
          console.log("Vertex " + vKey + " changed pi to " + vAttr.getColorFrom(vKey));
          stack.push(vKey);
          isVertexLeaf = 0;
        } else if (vColor == GraphColors.GRAY) { // Grafo contém ciclo
          throw new Meteor.Error("graph-contains-cycles", msgCoursesGraph.msgCycleError);
        }
      });
      if (isVertexLeaf) {
        vAttr.setColorTo(uKey, GraphColors.BLACK);
        // TODO remove this debug line later
        console.log("Vertex " + uKey + " changed color to " + vAttr.getColorFrom(uKey));
        vAttr.setFinishedTimeTo(uKey, ++this.time);
        // TODO remove this debug line later
        console.log("Vertex " + uKey + " changed finished time to " + vAttr.getFinishedTimeFrom(uKey));
        if (outputList != null)
          outputList.push(uKey);
      }
    }
  }

  topologicalSort() {
    var list = [];
    try {
      this.depthFirstSearch(list);
    } catch (e) {
      if (e.error == "graph-contains-cycles")
        return [];
      if (e.error == "graph-invalid-keys")
        return null;
    }
    return list;
  }
}

export function validateCoursesGraph(graph) {
  var list = graph.topologicalSort();
  // TODO remove this debug line later
  console.log(list); // Debug
  if (!list)
    throw new Meteor.Error("invalid-dag", msgCoursesGraph.msgCourseNotFound);
  if (list.length <= 0)
    throw new Meteor.Error("invalid-dag", msgCoursesGraph.msgCycleError);
}
