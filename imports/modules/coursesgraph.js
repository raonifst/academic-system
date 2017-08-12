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

export class CoursesGraph {
  constructor(coursesArray) {
    this.gMap = new Map();
    coursesArray.forEach(item => {
      this.gMap.set(item.codigo, item.prereq);
    });
  }

  _depthFirstSearch(initialVertexCode, visitedMap, outputList) {
    var stack = [];
    var uKey, uAdjList, isVertexLeaf;
    stack.push(initialVertexCode);

    while (stack.length > 0) {
      isVertexLeaf = 1;
      uKey = stack.pop();
      uAdjList = this.gMap.get(uKey);
      visitedMap.set(uKey, GraphColors.GRAY);

      uAdjList.forEach(vKey => {
        var vColor = visitedMap.get(vKey);
        var vAdjList = this.gMap.get(vKey);
        if (!vAdjList) {
          throw new Meteor.Error("graph-contains-cycles", msgCoursesGraph.msgCourseNotFound);
        } else if (vColor == GraphColors.WHITE) {
          stack.push(vKey);
          isVertexLeaf = 0;
        } else if (vColor == GraphColors.GRAY) { // Grafo contém ciclo
          throw new Meteor.Error("graph-invalid-keys", msgCoursesGraph.msgCycleError);
        }
      });

      if (isVertexLeaf) {
        visitedMap.set(uKey, GraphColors.BLACK);
        outputList.push(uKey);
      }
    }
  }

  topologicalSort() {
    var list = [];
    var visitedMap = new Map();

    for (var key2 of this.gMap.keys()) {
      visitedMap.set(key2, GraphColors.WHITE);
    }

    for (var key of this.gMap.keys()) {
      try {
        this._depthFirstSearch(key, visitedMap, list);
      } catch (e) {
        if (e.error == "graph-contains-cycles")
          return [];
        if (e.error == "graph-invalid-keys")
          return null;
      }
    }
    return list;
  }
}

export function validateCoursesGraph(graph) {
  var list = graph.topologicalSort();
  if (!list)
    throw new Meteor.Error("invalid-dag", msgCoursesGraph.msgCycleError);
  if (list.length <= 0)
    throw new Meteor.Error("invalid-dag", msgCoursesGraph.msgCourseNotFound);
}
