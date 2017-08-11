const prereqDelimiter = ";";

export const CsvUtils = {
  prereqArrayToString(arr) {
    for (var i = 0; i < arr.length; i++)
      arr[i] = Disciplines.findOne({ _id: arr[i] }).codigo;
    return arr.join(prereqDelimiter);
  },

  prereqStringToArray(str) {
    if (!str)
      return [];
    var s = str.split(prereqDelimiter);
    return (s == "") ? [] : s.map(Number);
  },
};
