import HandsonTable from 'handsontable';

export function displayRegion(sheetNames, obj) {
  if (obj && obj.start && obj.end) {
    var sname = (sheetNames && sheetNames.length > obj.sheetIndex) ? sheetNames[obj.sheetIndex] : "Sheet " + obj.sheetIndex;
    if (obj.start.row === obj.end.row && obj.start.col === obj.end.col) {
      return (
        "'" + sname + "'" +
        "!" +
        displayCoordinate(obj.start)
      );
    } else {
      return (
        "'" + sname + "'" +
        "!" +
        displayCoordinate(obj.start) +
        ":" +
        displayCoordinate(obj.end)
      );
    }
  } else {
    return "";
  }
}

export function displayCoordinate(obj) {
  return (
    HandsonTable.helper.spreadsheetColumnLabel(obj.col) + (obj.row + 1)
  );
}
