/*

  Copyright: © Maurice Conrad, 2017

  This 'module' is also a part of the backpack problem solution and therefore also a part of the code competition.
  It's not an 'external' framework or used in any other context than in this project. It's just devloped for this case in May 2017

*/

String.prototype.repeat = function(count) {
  var str = "";
  for (var i = 0; i < count; i++) str += this;
  return str;
}

function round(float, int) {
  return Math.round(float * int) / int;
}

module.exports = function() {
  var self = this;
  this.data = [];
  this.column = function() {
    var args = arguments;
    Object.keys(args).forEach(function(key) {
      var column = args[key];
      self.data.push({
        title: column.title,
        align: column.align,
        cells: [],
        max: column.title.length
      });
    });
  }
  this.addCells = function() {
    var args = arguments;
    Object.keys(args).forEach(function(key) {
      var cell = args[key];
      self.data[parseInt(key)].cells.push(cell);
      if (cell.toString().length >= self.data[parseInt(key)].max || !("max" in self.data[parseInt(key)])) {
        self.data[parseInt(key)].max = cell.toString().length;
      }
    });
  }
  this.getRows = function() {
    var rows = [];
    self.data.forEach(function(column) {
      column.cells.forEach(function(cell, index) {
        if (!(index in rows)) rows[index] = [];
        rows[index].push(cell);
      });
    });
    return rows;
  }
  this.print = function(absWidth) {
    var columns = self.getRows();
    var minWidth = self.minTableWidth(self.data);
    var bufferTotal = absWidth - minWidth;
    function getRow(cell, index) {
      var align = self.data[index].align;
      var length = self.data[index].max;
      var bufferLength = length - cell.toString().length;
      if (absWidth) bufferLength = bufferLength + (bufferTotal / self.data.length);
      var bufferSpaceLeft = " ".repeat(align === "right" ? bufferLength : (align === "center" ? Math.floor(bufferLength / 2) : 0));
      var bufferSpaceRight = " ".repeat(align === "left" ? bufferLength : (align === "center" ? Math.ceil(bufferLength / 2) : 0));
      return bufferSpaceLeft + cell + bufferSpaceRight;
    }
    var headerData = self.data.map(function(column, index) {
      return "\033[3m" + getRow(column.title, index) + "\033[23m";
    });
    var header = headerData.join("  |  ");
    var limiter = "=".repeat(header.length - (9 * headerData.length));
    var body = columns.map(function(column) {
      return column.map(getRow).join("  |  ");
    }).join("\n");
    return header + "\n" + limiter + "\n" + body + "\033[0m";
  }
  this.minTableWidth = function(data) {
    var width = 0;
    data.forEach(function(column, index) {
      width += column.max;
      if (index < data.length - 1) width += 5; // 5 chars are used by "  |  ";
    });
    return width;
  }
}
