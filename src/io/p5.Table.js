/**
 * @module IO
 * @submodule Table
 * @requires core
 */

'use strict';

var p5 = require('../core/core');

/**
 *  Table Options
 *  <p>Generic class for handling tabular data, typically from a
 *  CSV, TSV, or other sort of spreadsheet file.</p>
 *  <p>CSV files are
 *  <a href="http://en.wikipedia.org/wiki/Comma-separated_values">
 *  comma separated values</a>, often with the data in quotes. TSV
 *  files use tabs as separators, and usually don't bother with the
 *  quotes.</p>
 *  <p>File names should end with .csv if they're comma separated.</p>
 *  <p>A rough "spec" for CSV can be found
 *  <a href="http://tools.ietf.org/html/rfc4180">here</a>.</p>
 *  <p>To load files, use the loadTable method.</p>
 *  <p>To save tables to your computer, use the save method
 *   or the saveTable method.</p>
 *
 *  Possible options include:
 *  <ul>
 *  <li>csv - parse the table as comma-separated values
 *  <li>tsv - parse the table as tab-separated values
 *  <li>header - this table has a header (title) row
 *  </ul>
 */

/**
 *  Table objects store data with multiple rows and columns, much
 *  like in a traditional spreadsheet. Tables can be generated from
 *  scratch, dynamically, or using data from an existing file.
 *
 *  @class p5.Table
 *  @constructor
 *  @param  {p5.TableRow[]}     [rows] An array of p5.TableRow objects
 */
p5.Table = function(rows) {
  /**
   *  @property columns {String[]}
   */
  this.columns = [];

  /**
   *  @property rows {p5.TableRow[]}
   */
  this.rows = [];
  this.name = 'p5.Table'; // for friendly debugger system
};

/**
 *  Use addRow() to add a new row of data to a p5.Table object. By default,
 *  an empty row is created. Typically, you would store a reference to
 *  the new row in a TableRow object (see newRow in the example above),
 *  and then set individual values using set().
 *
 *  If a p5.TableRow object is included as a parameter, then that row is
 *  duplicated and added to the table.
 *
 *  @method  addRow
 *  @param   {p5.TableRow} [row] row to be added to the table
 *
 * @example
 * <div class="norender">
 * <code>
 * // Given the CSV file "mammals.csv"
 * // in the project's "assets" folder:
 * //
 * // id,species,name
 * // 0,Capra hircus,Goat
 * // 1,Panthera pardus,Leopard
 * // 2,Equus zebra,Zebra
 *
 * var table;
 *
 * function preload() {
 *   //my table is comma separated value "csv"
 *   //and has a header specifying the columns labels
 *   table = loadTable('assets/mammals.csv', 'csv', 'header');
 * }
 *
 * function setup() {
 *   //add a row
 *   var newRow = table.addRow();
 *   newRow.setString('id', table.getRowCount() - 1);
 *   newRow.setString('species', 'Canis Lupus');
 *   newRow.setString('name', 'Wolf');
 *
 *   //print the results
 *   for (var r = 0; r < table.getRowCount(); r++)
 *     for (var c = 0; c < table.getColumnCount(); c++)
 *       print(table.getString(r, c));
 * }
 * </code>
 * </div>
 *
 * @alt
 * no image displayed
 *
 */
p5.Table.prototype.addRow = function(row) {
  // make sure it is a valid TableRow
  var r = row || new p5.TableRow();

  if (typeof r.arr === 'undefined' || typeof r.obj === 'undefined') {
    //r = new p5.prototype.TableRow(r);
    throw 'invalid TableRow: ' + r;
  }
  r.table = this;
  this.rows.push(r);
  return r;
};

/**
 * Removes a row from the table object.
 *
 * @method  removeRow
 * @param   {Integer} id ID number of the row to remove
 *
 * @example
 * <div class="norender">
 * <code>
 * // Given the CSV file "mammals.csv"
 * // in the project's "assets" folder:
 * //
 * // id,species,name
 * // 0,Capra hircus,Goat
 * // 1,Panthera pardus,Leopard
 * // 2,Equus zebra,Zebra
 *
 * var table;
 *
 * function preload() {
 *   //my table is comma separated value "csv"
 *   //and has a header specifying the columns labels
 *   table = loadTable('assets/mammals.csv', 'csv', 'header');
 * }
 *
 * function setup() {
 *   //remove the first row
 *   table.removeRow(0);
 *
 *   //print the results
 *   for (var r = 0; r < table.getRowCount(); r++)
 *     for (var c = 0; c < table.getColumnCount(); c++)
 *       print(table.getString(r, c));
 * }
 * </code>
 * </div>
 *
 * @alt
 * no image displayed
 *
 */
p5.Table.prototype.removeRow = function(id) {
  this.rows[id].table = null; // remove reference to table
  var chunk = this.rows.splice(id + 1, this.rows.length);
  this.rows.pop();
  this.rows = this.rows.concat(chunk);
};

/**
 * Returns a reference to the specified p5.TableRow. The reference
 * can then be used to get and set values of the selected row.
 *
 * @method  getRow
 * @param  {Integer}   rowID ID number of the row to get
 * @return {p5.TableRow} p5.TableRow object
 *
 * @example
 * <div class="norender">
 * <code>
 * // Given the CSV file "mammals.csv"
 * // in the project's "assets" folder:
 * //
 * // id,species,name
 * // 0,Capra hircus,Goat
 * // 1,Panthera pardus,Leopard
 * // 2,Equus zebra,Zebra
 *
 * var table;
 *
 * function preload() {
 *   //my table is comma separated value "csv"
 *   //and has a header specifying the columns labels
 *   table = loadTable('assets/mammals.csv', 'csv', 'header');
 * }
 *
 * function setup() {
 *   var row = table.getRow(1);
 *   //print it column by column
 *   //note: a row is an object, not an array
 *   for (var c = 0; c < table.getColumnCount(); c++) {
 *     print(row.getString(c));
 *   }
 * }
 * </code>
 * </div>
 *
 *@alt
 * no image displayed
 *
 */
p5.Table.prototype.getRow = function(r) {
  return this.rows[r];
};

/**
 *  Gets all rows from the table. Returns an array of p5.TableRows.
 *
 *  @method  getRows
 *  @return {p5.TableRow[]}   Array of p5.TableRows
 *
 * @example
 * <div class="norender">
 * <code>
 * // Given the CSV file "mammals.csv"
 * // in the project's "assets" folder:
 * //
 * // id,species,name
 * // 0,Capra hircus,Goat
 * // 1,Panthera pardus,Leopard
 * // 2,Equus zebra,Zebra
 *
 * var table;
 *
 * function preload() {
 *   //my table is comma separated value "csv"
 *   //and has a header specifying the columns labels
 *   table = loadTable('assets/mammals.csv', 'csv', 'header');
 * }
 *
 * function setup() {
 *   var rows = table.getRows();
 *
 *   //warning: rows is an array of objects
 *   for (var r = 0; r < rows.length; r++) {
 *     rows[r].set('name', 'Unicorn');
 *   }
 *
 *   //print the results
 *   for (r = 0; r < table.getRowCount(); r++)
 *     for (var c = 0; c < table.getColumnCount(); c++)
 *       print(table.getString(r, c));
 * }
 * </code>
 * </div>
 *
 * @alt
 * no image displayed
 *
 */
p5.Table.prototype.getRows = function() {
  return this.rows;
};

/**
 *  Finds the first row in the Table that contains the value
 *  provided, and returns a reference to that row. Even if
 *  multiple rows are possible matches, only the first matching
 *  row is returned. The column to search may be specified by
 *  either its ID or title.
 *
 *  @method  findRow
 *  @param  {String} value  The value to match
 *  @param  {Integer|String} column ID number or title of the
 *                                 column to search
 *  @return {p5.TableRow}
 *
 * @example
 * <div class="norender">
 * <code>
 * // Given the CSV file "mammals.csv"
 * // in the project's "assets" folder:
 * //
 * // id,species,name
 * // 0,Capra hircus,Goat
 * // 1,Panthera pardus,Leopard
 * // 2,Equus zebra,Zebra
 *
 * var table;
 *
 * function preload() {
 *   //my table is comma separated value "csv"
 *   //and has a header specifying the columns labels
 *   table = loadTable('assets/mammals.csv', 'csv', 'header');
 * }
 *
 * function setup() {
 *   //find the animal named zebra
 *   var row = table.findRow('Zebra', 'name');
 *   //find the corresponding species
 *   print(row.getString('species'));
 * }
 * </code>
 * </div>
 *
 * @alt
 * no image displayed
 *
 */
p5.Table.prototype.findRow = function(value, column) {
  // try the Object
  if (typeof column === 'string') {
    for (var i = 0; i < this.rows.length; i++) {
      if (this.rows[i].obj[column] === value) {
        return this.rows[i];
      }
    }
  } else {
    // try the Array
    for (var j = 0; j < this.rows.length; j++) {
      if (this.rows[j].arr[column] === value) {
        return this.rows[j];
      }
    }
  }
  // otherwise...
  return null;
};

/**
 *  Finds the rows in the Table that contain the value
 *  provided, and returns references to those rows. Returns an
 *  Array, so for must be used to iterate through all the rows,
 *  as shown in the example above. The column to search may be
 *  specified by either its ID or title.
 *
 *  @method  findRows
 *  @param  {String} value  The value to match
 *  @param  {Integer|String} column ID number or title of the
 *                                 column to search
 *  @return {p5.TableRow[]}        An Array of TableRow objects
 *
 * @example
 * <div class="norender">
 * <code>
 * // Given the CSV file "mammals.csv"
 * // in the project's "assets" folder:
 * //
 * // id,species,name
 * // 0,Capra hircus,Goat
 * // 1,Panthera pardus,Leopard
 * // 2,Equus zebra,Zebra
 *
 * var table;
 *
 * function preload() {
 *   //my table is comma separated value "csv"
 *   //and has a header specifying the columns labels
 *   table = loadTable('assets/mammals.csv', 'csv', 'header');
 * }
 *
 * function setup() {
 *   //add another goat
 *   var newRow = table.addRow();
 *   newRow.setString('id', table.getRowCount() - 1);
 *   newRow.setString('species', 'Scape Goat');
 *   newRow.setString('name', 'Goat');
 *
 *   //find the rows containing animals named Goat
 *   var rows = table.findRows('Goat', 'name');
 *   print(rows.length + ' Goats found');
 * }
 * </code>
 * </div>
 *
 *@alt
 * no image displayed
 *
 */
p5.Table.prototype.findRows = function(value, column) {
  var ret = [];
  if (typeof column === 'string') {
    for (var i = 0; i < this.rows.length; i++) {
      if (this.rows[i].obj[column] === value) {
        ret.push(this.rows[i]);
      }
    }
  } else {
    // try the Array
    for (var j = 0; j < this.rows.length; j++) {
      if (this.rows[j].arr[column] === value) {
        ret.push(this.rows[j]);
      }
    }
  }
  return ret;
};

/**
 * Finds the first row in the Table that matches the regular
 * expression provided, and returns a reference to that row.
 * Even if multiple rows are possible matches, only the first
 * matching row is returned. The column to search may be
 * specified by either its ID or title.
 *
 * @method  matchRow
 * @param  {String} regexp The regular expression to match
 * @param  {String|Integer} column The column ID (number) or
 *                                  title (string)
 * @return {p5.TableRow}        TableRow object
 *
 * @example
 * <div class="norender">
 * <code>
 * // Given the CSV file "mammals.csv"
 * // in the project's "assets" folder:
 * //
 * // id,species,name
 * // 0,Capra hircus,Goat
 * // 1,Panthera pardus,Leopard
 * // 2,Equus zebra,Zebra
 *
 * var table;
 *
 * function preload() {
 *   //my table is comma separated value "csv"
 *   //and has a header specifying the columns labels
 *   table = loadTable('assets/mammals.csv', 'csv', 'header');
 * }
 *
 * function setup() {
 *   //Search using specified regex on a given column, return TableRow object
 *   const mammal = table.matchRow(new RegExp('ant'), 1);
 *   print(mammal.getString(1));
 *   //Output "Panthera pardus"
 * }
 * </code>
 * </div>
 *
 */
p5.Table.prototype.matchRow = function(regexp, column) {
  if (typeof column === 'number') {
    for (var j = 0; j < this.rows.length; j++) {
      if (this.rows[j].arr[column].match(regexp)) {
        return this.rows[j];
      }
    }
  } else {
    for (var i = 0; i < this.rows.length; i++) {
      if (this.rows[i].obj[column].match(regexp)) {
        return this.rows[i];
      }
    }
  }
  return null;
};

/**
 * Finds the rows in the Table that match the regular expression provided,
 * and returns references to those rows. Returns an array, so for must be
 * used to iterate through all the rows, as shown in the example. The
 * column to search may be specified by either its ID or title.
 *
 * @method  matchRows
 * @param  {String} regexp The regular expression to match
 * @param  {String|Integer} [column] The column ID (number) or
 *                                  title (string)
 * @return {p5.TableRow[]}          An Array of TableRow objects
 * @example
 * <div class="norender">
 * <code>
 * var table;
 *
 * function setup() {
 *   table = new p5.Table();
 *
 *   table.addColumn('name');
 *   table.addColumn('type');
 *
 *   var newRow = table.addRow();
 *   newRow.setString('name', 'Lion');
 *   newRow.setString('type', 'Mammal');
 *
 *   newRow = table.addRow();
 *   newRow.setString('name', 'Snake');
 *   newRow.setString('type', 'Reptile');
 *
 *   newRow = table.addRow();
 *   newRow.setString('name', 'Mosquito');
 *   newRow.setString('type', 'Insect');
 *
 *   newRow = table.addRow();
 *   newRow.setString('name', 'Lizard');
 *   newRow.setString('type', 'Reptile');
 *
 *   var rows = table.matchRows('R.*', 'type');
 *   for (var i = 0; i < rows.length; i++) {
 *     print(rows[i].getString('name') + ': ' + rows[i].getString('type'));
 *   }
 * }
 * // Sketch prints:
 * // Snake: Reptile
 * // Lizard: Reptile
 * </code>
 * </div>
 */
p5.Table.prototype.matchRows = function(regexp, column) {
  var ret = [];
  if (typeof column === 'number') {
    for (var j = 0; j < this.rows.length; j++) {
      if (this.rows[j].arr[column].match(regexp)) {
        ret.push(this.rows[j]);
      }
    }
  } else {
    for (var i = 0; i < this.rows.length; i++) {
      if (this.rows[i].obj[column].match(regexp)) {
        ret.push(this.rows[i]);
      }
    }
  }
  return ret;
};

/**
 *  Retrieves all values in the specified column, and returns them
 *  as an array. The column may be specified by either its ID or title.
 *
 *  @method  getColumn
 *  @param  {String|Number} column String or Number of the column to return
 *  @return {Array}       Array of column values
 *
 * @example
 * <div class="norender">
 * <code>
 * // Given the CSV file "mammals.csv"
 * // in the project's "assets" folder:
 * //
 * // id,species,name
 * // 0,Capra hircus,Goat
 * // 1,Panthera pardus,Leopard
 * // 2,Equus zebra,Zebra
 *
 * var table;
 *
 * function preload() {
 *   //my table is comma separated value "csv"
 *   //and has a header specifying the columns labels
 *   table = loadTable('assets/mammals.csv', 'csv', 'header');
 * }
 *
 * function setup() {
 *   //getColumn returns an array that can be printed directly
 *   print(table.getColumn('species'));
 *   //outputs ["Capra hircus", "Panthera pardus", "Equus zebra"]
 * }
 * </code>
 * </div>
 *
 *@alt
 * no image displayed
 *
 */
p5.Table.prototype.getColumn = function(value) {
  var ret = [];
  if (typeof value === 'string') {
    for (var i = 0; i < this.rows.length; i++) {
      ret.push(this.rows[i].obj[value]);
    }
  } else {
    for (var j = 0; j < this.rows.length; j++) {
      ret.push(this.rows[j].arr[value]);
    }
  }
  return ret;
};

/**
 *  Removes all rows from a Table. While all rows are removed,
 *  columns and column titles are maintained.
 *
 *  @method  clearRows
 *
 * @example
 * <div class="norender">
 * <code>
 * // Given the CSV file "mammals.csv"
 * // in the project's "assets" folder:
 * //
 * // id,species,name
 * // 0,Capra hircus,Goat
 * // 1,Panthera pardus,Leopard
 * // 2,Equus zebra,Zebra
 *
 * var table;
 *
 * function preload() {
 *   //my table is comma separated value "csv"
 *   //and has a header specifying the columns labels
 *   table = loadTable('assets/mammals.csv', 'csv', 'header');
 * }
 *
 * function setup() {
 *   table.clearRows();
 *   print(table.getRowCount() + ' total rows in table');
 *   print(table.getColumnCount() + ' total columns in table');
 * }
 * </code>
 * </div>
 *
 *@alt
 * no image displayed
 *
 */
p5.Table.prototype.clearRows = function() {
  delete this.rows;
  this.rows = [];
};

/**
 *  Use addColumn() to add a new column to a Table object.
 *  Typically, you will want to specify a title, so the column
 *  may be easily referenced later by name. (If no title is
 *  specified, the new column's title will be null.)
 *
 *  @method  addColumn
 *  @param {String} [title] title of the given column
 *
 * @example
 * <div class="norender">
 * <code>
 * // Given the CSV file "mammals.csv"
 * // in the project's "assets" folder:
 * //
 * // id,species,name
 * // 0,Capra hircus,Goat
 * // 1,Panthera pardus,Leopard
 * // 2,Equus zebra,Zebra
 *
 * var table;
 *
 * function preload() {
 *   //my table is comma separated value "csv"
 *   //and has a header specifying the columns labels
 *   table = loadTable('assets/mammals.csv', 'csv', 'header');
 * }
 *
 * function setup() {
 *   table.addColumn('carnivore');
 *   table.set(0, 'carnivore', 'no');
 *   table.set(1, 'carnivore', 'yes');
 *   table.set(2, 'carnivore', 'no');
 *
 *   //print the results
 *   for (var r = 0; r < table.getRowCount(); r++)
 *     for (var c = 0; c < table.getColumnCount(); c++)
 *       print(table.getString(r, c));
 * }
 * </code>
 * </div>
 *
 *@alt
 * no image displayed
 *
 */
p5.Table.prototype.addColumn = function(title) {
  var t = title || null;
  this.columns.push(t);
};

/**
 *  Returns the total number of columns in a Table.
 *
 *  @method  getColumnCount
 *  @return {Integer} Number of columns in this table
 * @example
 * <div>
 * <code>
 * // given the cvs file "blobs.csv" in /assets directory
 * // ID, Name, Flavor, Shape, Color
 * // Blob1, Blobby, Sweet, Blob, Pink
 * // Blob2, Saddy, Savory, Blob, Blue
 *
 * var table;
 *
 * function preload() {
 *   table = loadTable('assets/blobs.csv');
 * }
 *
 * function setup() {
 *   createCanvas(200, 100);
 *   textAlign(CENTER);
 *   background(255);
 * }
 *
 * function draw() {
 *   var numOfColumn = table.getColumnCount();
 *   text('There are ' + numOfColumn + ' columns in the table.', 100, 50);
 * }
 * </code>
 * </div>
 */
p5.Table.prototype.getColumnCount = function() {
  return this.columns.length;
};

/**
 *  Returns the total number of rows in a Table.
 *
 *  @method  getRowCount
 *  @return {Integer} Number of rows in this table
 * @example
 * <div>
 * <code>
 * // given the cvs file "blobs.csv" in /assets directory
 * //
 * // ID, Name, Flavor, Shape, Color
 * // Blob1, Blobby, Sweet, Blob, Pink
 * // Blob2, Saddy, Savory, Blob, Blue
 *
 * var table;
 *
 * function preload() {
 *   table = loadTable('assets/blobs.csv');
 * }
 *
 * function setup() {
 *   createCanvas(200, 100);
 *   textAlign(CENTER);
 *   background(255);
 * }
 *
 * function draw() {
 *   text('There are ' + table.getRowCount() + ' rows in the table.', 100, 50);
 * }
 * </code>
 * </div>
 */
p5.Table.prototype.getRowCount = function() {
  return this.rows.length;
};

/**
 *  <p>Removes any of the specified characters (or "tokens").</p>
 *
 *  <p>If no column is specified, then the values in all columns and
 *  rows are processed. A specific column may be referenced by
 *  either its ID or title.</p>
 *
 *  @method  removeTokens
 *  @param  {String} chars  String listing characters to be removed
 *  @param  {String|Integer} [column] Column ID (number)
 *                                   or name (string)
 *
 * @example
 * <div class="norender"><code>
 * function setup() {
 *   var table = new p5.Table();
 *
 *   table.addColumn('name');
 *   table.addColumn('type');
 *
 *   var newRow = table.addRow();
 *   newRow.setString('name', '   $Lion  ,');
 *   newRow.setString('type', ',,,Mammal');
 *
 *   newRow = table.addRow();
 *   newRow.setString('name', '$Snake  ');
 *   newRow.setString('type', ',,,Reptile');
 *
 *   table.removeTokens(',$ ');
 *   print(table.getArray());
 * }
 *
 * // prints:
 * //  0  "Lion"   "Mamal"
 * //  1  "Snake"  "Reptile"
 * </code></div>
 */
p5.Table.prototype.removeTokens = function(chars, column) {
  var escape = function(s) {
    return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  };
  var charArray = [];
  for (var i = 0; i < chars.length; i++) {
    charArray.push(escape(chars.charAt(i)));
  }
  var regex = new RegExp(charArray.join('|'), 'g');

  if (typeof column === 'undefined') {
    for (var c = 0; c < this.columns.length; c++) {
      for (var d = 0; d < this.rows.length; d++) {
        var s = this.rows[d].arr[c];
        s = s.replace(regex, '');
        this.rows[d].arr[c] = s;
        this.rows[d].obj[this.columns[c]] = s;
      }
    }
  } else if (typeof column === 'string') {
    for (var j = 0; j < this.rows.length; j++) {
      var val = this.rows[j].obj[column];
      val = val.replace(regex, '');
      this.rows[j].obj[column] = val;
      var pos = this.columns.indexOf(column);
      this.rows[j].arr[pos] = val;
    }
  } else {
    for (var k = 0; k < this.rows.length; k++) {
      var str = this.rows[k].arr[column];
      str = str.replace(regex, '');
      this.rows[k].arr[column] = str;
      this.rows[k].obj[this.columns[column]] = str;
    }
  }
};

/**
 *  Trims leading and trailing whitespace, such as spaces and tabs,
 *  from String table values. If no column is specified, then the
 *  values in all columns and rows are trimmed. A specific column
 *  may be referenced by either its ID or title.
 *
 *  @method  trim
 *  @param  {String|Integer} [column] Column ID (number)
 *                                   or name (string)
 * @example
 * <div class="norender"><code>
 * function setup() {
 *   var table = new p5.Table();
 *
 *   table.addColumn('name');
 *   table.addColumn('type');
 *
 *   var newRow = table.addRow();
 *   newRow.setString('name', '   Lion  ,');
 *   newRow.setString('type', ' Mammal  ');
 *
 *   newRow = table.addRow();
 *   newRow.setString('name', '  Snake  ');
 *   newRow.setString('type', '  Reptile  ');
 *
 *   table.trim();
 *   print(table.getArray());
 * }
 *
 * // prints:
 * //  0  "Lion"   "Mamal"
 * //  1  "Snake"  "Reptile"
 * </code></div>
 */
p5.Table.prototype.trim = function(column) {
  var regex = new RegExp(' ', 'g');

  if (typeof column === 'undefined') {
    for (var c = 0; c < this.columns.length; c++) {
      for (var d = 0; d < this.rows.length; d++) {
        var s = this.rows[d].arr[c];
        s = s.replace(regex, '');
        this.rows[d].arr[c] = s;
        this.rows[d].obj[this.columns[c]] = s;
      }
    }
  } else if (typeof column === 'string') {
    for (var j = 0; j < this.rows.length; j++) {
      var val = this.rows[j].obj[column];
      val = val.replace(regex, '');
      this.rows[j].obj[column] = val;
      var pos = this.columns.indexOf(column);
      this.rows[j].arr[pos] = val;
    }
  } else {
    for (var k = 0; k < this.rows.length; k++) {
      var str = this.rows[k].arr[column];
      str = str.replace(regex, '');
      this.rows[k].arr[column] = str;
      this.rows[k].obj[this.columns[column]] = str;
    }
  }
};

/**
 *  Use removeColumn() to remove an existing column from a Table
 *  object. The column to be removed may be identified by either
 *  its title (a String) or its index value (an int).
 *  removeColumn(0) would remove the first column, removeColumn(1)
 *  would remove the second column, and so on.
 *
 *  @method  removeColumn
 *  @param  {String|Integer} column columnName (string) or ID (number)
 *
 * @example
 * <div class="norender">
 * <code>
 * // Given the CSV file "mammals.csv"
 * // in the project's "assets" folder:
 * //
 * // id,species,name
 * // 0,Capra hircus,Goat
 * // 1,Panthera pardus,Leopard
 * // 2,Equus zebra,Zebra
 *
 * var table;
 *
 * function preload() {
 *   //my table is comma separated value "csv"
 *   //and has a header specifying the columns labels
 *   table = loadTable('assets/mammals.csv', 'csv', 'header');
 * }
 *
 * function setup() {
 *   table.removeColumn('id');
 *   print(table.getColumnCount());
 * }
 * </code>
 * </div>
 *
 *@alt
 * no image displayed
 *
 */
p5.Table.prototype.removeColumn = function(c) {
  var cString;
  var cNumber;
  if (typeof c === 'string') {
    // find the position of c in the columns
    cString = c;
    cNumber = this.columns.indexOf(c);
    console.log('string');
  } else {
    cNumber = c;
    cString = this.columns[c];
  }

  var chunk = this.columns.splice(cNumber + 1, this.columns.length);
  this.columns.pop();
  this.columns = this.columns.concat(chunk);

  for (var i = 0; i < this.rows.length; i++) {
    var tempR = this.rows[i].arr;
    var chip = tempR.splice(cNumber + 1, tempR.length);
    tempR.pop();
    this.rows[i].arr = tempR.concat(chip);
    delete this.rows[i].obj[cString];
  }
};

/**
 * Stores a value in the Table's specified row and column.
 * The row is specified by its ID, while the column may be specified
 * by either its ID or title.
 *
 * @method  set
 * @param {String|Integer} column column ID (Number)
 *                               or title (String)
 * @param {String|Number} value  value to assign
 *
 * @example
 * <div class="norender">
 * <code>
 * // Given the CSV file "mammals.csv"
 * // in the project's "assets" folder:
 * //
 * // id,species,name
 * // 0,Capra hircus,Goat
 * // 1,Panthera pardus,Leopard
 * // 2,Equus zebra,Zebra
 *
 * var table;
 *
 * function preload() {
 *   //my table is comma separated value "csv"
 *   //and has a header specifying the columns labels
 *   table = loadTable('assets/mammals.csv', 'csv', 'header');
 * }
 *
 * function setup() {
 *   table.set(0, 'species', 'Canis Lupus');
 *   table.set(0, 'name', 'Wolf');
 *
 *   //print the results
 *   for (var r = 0; r < table.getRowCount(); r++)
 *     for (var c = 0; c < table.getColumnCount(); c++)
 *       print(table.getString(r, c));
 * }
 * </code>
 * </div>
 *
 *@alt
 * no image displayed
 *
 */
p5.Table.prototype.set = function(row, column, value) {
  this.rows[row].set(column, value);
};

/**
 * Stores a Float value in the Table's specified row and column.
 * The row is specified by its ID, while the column may be specified
 * by either its ID or title.
 *
 * @method setNum
 * @param {Integer} row row ID
 * @param {String|Integer} column column ID (Number)
 *                               or title (String)
 * @param {Number} value  value to assign
 *
 * @example
 * <div class="norender">
 * <code>
 * // Given the CSV file "mammals.csv"
 * // in the project's "assets" folder:
 * //
 * // id,species,name
 * // 0,Capra hircus,Goat
 * // 1,Panthera pardus,Leopard
 * // 2,Equus zebra,Zebra
 *
 * var table;
 *
 * function preload() {
 *   //my table is comma separated value "csv"
 *   //and has a header specifying the columns labels
 *   table = loadTable('assets/mammals.csv', 'csv', 'header');
 * }
 *
 * function setup() {
 *   table.setNum(1, 'id', 1);
 *
 *   print(table.getColumn(0));
 *   //["0", 1, "2"]
 * }
 * </code>
 * </div>
 *
 *@alt
 * no image displayed
 */
p5.Table.prototype.setNum = function(row, column, value) {
  this.rows[row].setNum(column, value);
};

/**
 * Stores a String value in the Table's specified row and column.
 * The row is specified by its ID, while the column may be specified
 * by either its ID or title.
 *
 * @method  setString
 * @param {Integer} row row ID
 * @param {String|Integer} column column ID (Number)
 *                               or title (String)
 * @param {String} value  value to assign
 * @example
 * <div class="norender"><code>
 * // Given the CSV file "mammals.csv" in the project's "assets" folder:
 * //
 * // id,species,name
 * // 0,Capra hircus,Goat
 * // 1,Panthera pardus,Leopard
 * // 2,Equus zebra,Zebra
 *
 * var table;
 *
 * function preload() {
 *   //my table is comma separated value "csv"
 *   //and has a header specifying the columns labels
 *   table = loadTable('assets/mammals.csv', 'csv', 'header');
 * }
 *
 * function setup() {
 *   //add a row
 *   var newRow = table.addRow();
 *   newRow.setString('id', table.getRowCount() - 1);
 *   newRow.setString('species', 'Canis Lupus');
 *   newRow.setString('name', 'Wolf');
 *
 *   print(table.getArray());
 * }
 * </code></div>
 *
 * @alt
 * no image displayed
 */
p5.Table.prototype.setString = function(row, column, value) {
  this.rows[row].setString(column, value);
};

/**
 * Retrieves a value from the Table's specified row and column.
 * The row is specified by its ID, while the column may be specified by
 * either its ID or title.
 *
 * @method  get
 * @param {Integer} row row ID
 * @param  {String|Integer} column columnName (string) or
 *                                   ID (number)
 * @return {String|Number}
 *
 * @example
 * <div class="norender">
 * <code>
 * // Given the CSV file "mammals.csv"
 * // in the project's "assets" folder:
 * //
 * // id,species,name
 * // 0,Capra hircus,Goat
 * // 1,Panthera pardus,Leopard
 * // 2,Equus zebra,Zebra
 *
 * var table;
 *
 * function preload() {
 *   //my table is comma separated value "csv"
 *   //and has a header specifying the columns labels
 *   table = loadTable('assets/mammals.csv', 'csv', 'header');
 * }
 *
 * function setup() {
 *   print(table.get(0, 1));
 *   //Capra hircus
 *   print(table.get(0, 'species'));
 *   //Capra hircus
 * }
 * </code>
 * </div>
 *
 *@alt
 * no image displayed
 *
 */
p5.Table.prototype.get = function(row, column) {
  return this.rows[row].get(column);
};

/**
 * Retrieves a Float value from the Table's specified row and column.
 * The row is specified by its ID, while the column may be specified by
 * either its ID or title.
 *
 * @method  getNum
 * @param {Integer} row row ID
 * @param  {String|Integer} column columnName (string) or
 *                                   ID (number)
 * @return {Number}
 *
 * @example
 * <div class="norender">
 * <code>
 * // Given the CSV file "mammals.csv"
 * // in the project's "assets" folder:
 * //
 * // id,species,name
 * // 0,Capra hircus,Goat
 * // 1,Panthera pardus,Leopard
 * // 2,Equus zebra,Zebra
 *
 * var table;
 *
 * function preload() {
 *   //my table is comma separated value "csv"
 *   //and has a header specifying the columns labels
 *   table = loadTable('assets/mammals.csv', 'csv', 'header');
 * }
 *
 * function setup() {
 *   print(table.getNum(1, 0) + 100);
 *   //id 1 + 100 = 101
 * }
 * </code>
 * </div>
 *
 *@alt
 * no image displayed
 *
 */
p5.Table.prototype.getNum = function(row, column) {
  return this.rows[row].getNum(column);
};

/**
 * Retrieves a String value from the Table's specified row and column.
 * The row is specified by its ID, while the column may be specified by
 * either its ID or title.
 *
 * @method  getString
 * @param {Integer} row row ID
 * @param  {String|Integer} column columnName (string) or
 *                                   ID (number)
 * @return {String}
 *
 * @example
 * <div class="norender">
 * <code>
 * // Given the CSV file "mammals.csv"
 * // in the project's "assets" folder:
 * //
 * // id,species,name
 * // 0,Capra hircus,Goat
 * // 1,Panthera pardus,Leopard
 * // 2,Equus zebra,Zebra
 *
 * var table;
 *
 * function preload() {
 *   // table is comma separated value "CSV"
 *   // and has specifiying header for column labels
 *   table = loadTable('assets/mammals.csv', 'csv', 'header');
 * }
 *
 * function setup() {
 *   print(table.getString(0, 0)); // 0
 *   print(table.getString(0, 1)); // Capra hircus
 *   print(table.getString(0, 2)); // Goat
 *   print(table.getString(1, 0)); // 1
 *   print(table.getString(1, 1)); // Panthera pardus
 *   print(table.getString(1, 2)); // Leopard
 *   print(table.getString(2, 0)); // 2
 *   print(table.getString(2, 1)); // Equus zebra
 *   print(table.getString(2, 2)); // Zebra
 * }
 * </code>
 * </div>
 *
 *@alt
 * no image displayed
 *
 */

p5.Table.prototype.getString = function(row, column) {
  return this.rows[row].getString(column);
};

/**
 * Retrieves all table data and returns as an object. If a column name is
 * passed in, each row object will be stored with that attribute as its
 * title.
 *
 * @method  getObject
 * @param {String} [headerColumn] Name of the column which should be used to
 *                              title each row object (optional)
 * @return {Object}
 *
 * @example
 * <div class="norender">
 * <code>
 * // Given the CSV file "mammals.csv"
 * // in the project's "assets" folder:
 * //
 * // id,species,name
 * // 0,Capra hircus,Goat
 * // 1,Panthera pardus,Leopard
 * // 2,Equus zebra,Zebra
 *
 * var table;
 *
 * function preload() {
 *   //my table is comma separated value "csv"
 *   //and has a header specifying the columns labels
 *   table = loadTable('assets/mammals.csv', 'csv', 'header');
 * }
 *
 * function setup() {
 *   var tableObject = table.getObject();
 *
 *   print(tableObject);
 *   //outputs an object
 * }
 * </code>
 * </div>
 *
 *@alt
 * no image displayed
 *
 */
p5.Table.prototype.getObject = function(headerColumn) {
  var tableObject = {};
  var obj, cPos, index;

  for (var i = 0; i < this.rows.length; i++) {
    obj = this.rows[i].obj;

    if (typeof headerColumn === 'string') {
      cPos = this.columns.indexOf(headerColumn); // index of columnID
      if (cPos >= 0) {
        index = obj[headerColumn];
        tableObject[index] = obj;
      } else {
        throw 'This table has no column named "' + headerColumn + '"';
      }
    } else {
      tableObject[i] = this.rows[i].obj;
    }
  }
  return tableObject;
};

/**
 * Retrieves all table data and returns it as a multidimensional array.
 *
 * @method  getArray
 * @return {Array}
 *
 * @example
 * <div class="norender">
 * <code>
 * // Given the CSV file "mammals.csv"
 * // in the project's "assets" folder
 * //
 * // id,species,name
 * // 0,Capra hircus,Goat
 * // 1,Panthera pardus,Leoperd
 * // 2,Equus zebra,Zebra
 *
 * var table;
 *
 * function preload() {
 *   // table is comma separated value "CSV"
 *   // and has specifiying header for column labels
 *   table = loadTable('assets/mammals.csv', 'csv', 'header');
 * }
 *
 * function setup() {
 *   var tableArray = table.getArray();
 *   for (var i = 0; i < tableArray.length; i++) {
 *     print(tableArray[i]);
 *   }
 * }
 * </code>
 * </div>
 *
 *@alt
 * no image displayed
 *
 */
p5.Table.prototype.getArray = function() {
  var tableArray = [];
  for (var i = 0; i < this.rows.length; i++) {
    tableArray.push(this.rows[i].arr);
  }
  return tableArray;
};

module.exports = p5;
