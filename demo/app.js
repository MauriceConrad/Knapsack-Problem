/*

  Copyright: © Maurice Conrad, 2017

  Default use case for the backpack problem solution.
  The process to create a random backpack is seperated and has some options like max and min values. It's the class (new) 'Backpack()' of the backpacker instance.

  The packing process of the backpack is the method 'pack()' of the backpacker instance and packs lists with items.

  By default this sample use case saves the result in 'demo/backpack.csv' and prints a visually structured table in the console

*/

const fs = require('fs');
// Require the backpacker instance
const backpacker = require('../');

// Create dynamically a random backpack (just an object)
var myItems = new backpacker.Backpack({
  count: 100, // Default 100
  weight: {
    min: 1, // Min weight of an item (Default 0)
    max: 10, // Max weight of an item (Default 10)
    float: false // Wether the weight numbers are allowed to be denatural (Default true)
  },
  worth: {
    min: 0, // Min worth of an item (Default 0)
    max: 100, // Max worth of an item (Default 100)
    float: false // Wether the woght numbers are allowed to be denatural (Default true)
  }
});
// Pack the items with a 15 kg backpack
var myBackpack = backpacker.pack(myItems, 15); // Returns the packed backpack


// Backpacking process finished. Now we want to save the result as csv file and print it out as a table


// Convert a packed backpack to a csv string
var csv = backpacker.csv(myBackpack); // Returns the csv string
// Write the CSV file
fs.writeFile(__dirname + "/backback.csv", csv, function(err) {
  if (err) console.error(err);
});

// Create a backpack table object
var table = backpacker.table(myBackpack); // Returns a table instance
// Create table text output. First argument is the total width of the table (terminal window width)
var tableTextStr = table.print(process.stdout.columns - 2);
// Print the table
console.log("\n" + tableTextStr);
