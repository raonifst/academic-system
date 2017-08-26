const prereqDelimiter = ";";

export const csvUtils = {
  prereqArrayToString(arr) {
    for (var i = 0; i < arr.length; i++)
      arr[i] = Disciplines.findOne({ _id: arr[i] }).codigo;
    return arr.join(prereqDelimiter);
  },

};
