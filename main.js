/*

  Copyright: © Maurice Conrad, 2017

  Main file of the module 'backpacker'
  You'll find a working demo at 'demo/app.js'

*/

(function() {
  // Require a self-made fill-defaults function for managing the options
  require('./frameworks/fill-defaults');
  // Require the Table method for creating the table structure
  const Table = require('./frameworks/table');
  // Backpack class instance for random backpacks and some operating methods for a backpack
  class Backpack {
    constructor(options) {
      var opts = options.fillDefaults({
        count: 100,
        weight: {
          min: 0,
          max: 10,
          float: true
        },
        worth: {
          min: 0,
          max: 100,
          float: true
        }
      });
      var items = [];
      // Repeat Generator
      for (var n = 0; n < opts.count; n++) {
        // Creat a random item
        var item = Backpack.createRandomItem(opts, n);
        // Push the generated item to the item list
        items.push(item);
      }
      return items;
    }
    static createRandomItem(opts, i) {
      // Creating random weight float between min and max
      var weight = randomFloat(opts.weight.min, opts.weight.max);
      // Creating random weight float between min and max
      var worth = randomFloat(opts.worth.min, opts.worth.max);
      return {
        name: "Random Item " + i, // Item name is just 'Random Item n'
        weight: opts.weight.float ? weight : Math.round(weight), // If float values are disallowed, round the float value
        worth: opts.worth.float ? worth : Math.round(worth)
      }
    }
    // Static method in class 'Backpack' instance to calculate total weight of an item list
    static getTotalWeight(list) {
      var total = 0;
      list.forEach(function(item) {
        total += item.weight;
      });
      return total;
    }
    // Static method in class 'Backpack' instance to calculate total worth of an item list
    static getTotalWorth(list) {
      var total = 0;
      list.forEach(function(item) {
        total += item.worth;
      });
      return total;
    }
    // Static method in class 'Backpack' instance to return the next quotient item of an quotient sorted item list by a start index and a max weight (Mostly start index is 0)
    static bestQuotientItem(list, start, maxWeight) {
      // Loop trough item list
      for (var i = start; i < list.length; i++) {
        // If item exists (if not, its already used) and the weight is okay
        if (i in list && list[i].weight <= maxWeight) return i;
      }
      return -1;
    }
  }
  // Some mathematic methods
  function randomFloat(min, max) {
    return min + Math.random() * (max - min);
  }
  function round(float, int) {
    return Math.round(float * int) / int;
  }

  module.exports = {
    pack(items, maxWeight = 15) {
      // Sort items by quotient
      var quotientList = this.sortByQuotient(items);
      var backpack = [];
      var i = 0;
      // While there exists an item in the sorted list that's weight is not too big
      while (Backpack.bestQuotientItem(quotientList, 0, maxWeight - Backpack.getTotalWeight(backpack)) > -1) {
        // Get the index of the best item in the sorted list
        var index = Backpack.bestQuotientItem(quotientList, 0, maxWeight - Backpack.getTotalWeight(backpack)); // Starts always at 0 because already used items are deleted and therefore 'undefined'
        // Set the item by it's index
        var currItem = quotientList[index];
        // Delete the item within the list to avoid doubled using
        delete quotientList[index];
        // Push the item to the backpack
        backpack.push(currItem);
      }
      // Returns the whole backpack
      return {
        items: backpack,
        weight: Backpack.getTotalWeight(backpack),
        worth: Backpack.getTotalWorth(backpack)
      };
    },
    // Return the Backpack class
    Backpack: Backpack,
    // Merthod to sort a list by the best quotients of worth and weight
    sortByQuotient(list) {
      return list.sort(function(item1, item2) {
        var quotient1 = item1.worth / item1.weight;
        var quotient2 = item2.worth / item2.weight;
        return quotient1 > quotient2 ? -1 : (quotient2 > quotient1 ? 1 : 0);
      });
    },
    // Static method to export a csv string of a packed backpack
    csv(backpack) {
      var csvStr = "Item,Gewicht,Wert\n";
      backpack.items.forEach(function(item) {
        csvStr += item.name + ',' + round(item.weight, 100) + ',' + round(item.worth, 100) + "\n";
      });
      csvStr += 'Gesamt,' + round(backpack.weight, 100) + "," + round(backpack.worth, 100);
      return csvStr;
    },
    // Static method to export a table structure of a packed backpack
    table(backpack, weightType = "kg", worthType = "€") {
      // Using the Table module for table structure (This 'module' is just developed for this case)
      var table = new Table();
      table.column({
        title: "Item",
        align: "left"
      }, {
        title: "Gewicht",
        align: "right"
      }, {
        title: "Wert",
        align: "right"
      });
      backpack.items.forEach(function(item) {
        table.addCells(item.name, round(item.weight, 100) + " " + weightType, round(item.worth, 100) + " " + worthType);
      });
      table.addCells("", "", "");
      table.addCells("Gesamt", round(backpack.weight, 100) + " " + weightType, round(backpack.worth, 100) + " " + worthType);
      return table;
    }
  }

})();
