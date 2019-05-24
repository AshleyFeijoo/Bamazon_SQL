//'Importing mysql.js, inquirer.js and fs.js'

const mysql = require('mysql');
const inquirer = require('inquirer');
const fs = require('fs');

//Global Variables
let productName = '';
let productID= '';
let productDept = '';
let productPrice = '';
let productStock = '';
var newStockQuantity ='';
let amountStock = '';
var prodIdArr = [];

//Creating initial connection with SQL database, bamazon_db
let con = mysql.createConnection({
  host: '127.0.0.1',
  user: "root",
  port: '8889',
  password: "root",
  database: "bamazon_db"
});
con.connect(function(err) {
  //If the connection is not made, throw the error
  if (err) throw err;
  // If the connection is made, log the connection and
  // Call the afterConnection function
  logIt("connected as id " + con.threadId);
  afterConnection();
});


var afterConnection = function (){

  // First thing that happens is a query from the DB, bamazon and selects 
  // everything in the "products" table.

  con.query("SELECT * FROM products ORDER BY department_name ASC", function (err, res) {
    if (err) throw err; //if there's an error, throw the error


    logIt(`
    ================== ITEMS AVAILABLE FOR PURCHASE ==================
    `);
    // The result of the select is console logged here
    
    res.forEach(function(item){ 
      //this function calls upon each result and applies a variable to them.

      productName = item.product_name.toUpperCase();
      productID = item.Itemid;
      productDept = item.department_name.toUpperCase();
      productPrice = item.price;
      productStock = item.stock_quantity;

      logIt(`
      ========+ ${productName} +========
      ID: ${productID}
      Department: ${productDept}
      Price: $${productPrice}
      Stock: ${productStock}
      =====================++++++======================
      `);
      //this Product ID Array contains all the product ID's which are pushed for verification purposes later //
      prodIdArr.push(productID);
  });

ask(); //the ask function is called upon which prompts the user to enter the 
// ID of the item they wish to purchase.  //

   function ask(){   
      inquirer.prompt([
          {
            type: 'number',
            name: 'prodId',
            message: "What is the ID of the product you are looking for?",
      //if the ID is not in the product ID array, this will stop the prompt
       // function and make the user enter a proper ID //
            validate: function( value ) {
              var valid = prodIdArr.includes(value);
              return valid || "Please enter a valid product ID";
            },
          },
          {
            type: 'input',
            name: 'quant',
            message: "How many do you need?",
      // if the number entered by the user is not an integer, the prompt function will stop and validate. 
            validate: function( value ) {
              var valid = !isNaN(parseFloat(value));
              return valid || "Please enter a number";
            },
            filter: Number
          },
      ]).then(answers => {
        // after the prompt is finished, it will call upon the findProduct function with the answers provided
        findProduct(answers.prodId, answers.quant);
        });
    };

        function findProduct(product, amtNeeded){
          // the findProduct function selects all products where the ID
          // matches the ID provided in the function above.

          // in this function, product refers to answers.prodID, aka the given // product number from the inquirer function above. 

          // amtNeeded refers to the quantity of the product given by the user // in the inquirer function above.

          con.query("SELECT * FROM products WHERE Itemid =" + product, 
          function (err, res) {
            // this function will then search the results of the query for
            // the stock quantity of the given product ID.
            if (err) throw err;
            amountStock = res[0].stock_quantity;

            // if the product stock is greater than or equal to the amount
            // that the user is requesting to buy, the function
            // will log the process and subtract the requested amount from the stock.
            if (amtNeeded <= amountStock){
              logIt(`
              • • •  • • •  • • •  • • • 
              Processing your order now!
              • • •  • • •  • • •  • • • 
              `);
              newStockQuantity = amountStock - amtNeeded;
              logIt(`
              • • •  • • •  • • •  • • • 
                COMPLETE!
              • • •  • • •  • • •  • • • 
              `);

              // finally, the updateTables function is called, utilizing the new amount of stock
              updateTables(newStockQuantity, product);
            }else{
              // if the stock needed is greater than what it is in stock
              // the function will tell the user, and prompt them again.
              logIt(`Insufficient Quantity!`);
              ask();
            }
          });
        } 
  });
}


function updateTables(val1, val2){
  // sql is the parameters of the query to the DB
  // val1 is eqaul to the new stock amount and val2 is equal to the products ID
  let sql = `UPDATE products
           SET stock_quantity = ${val1}
           WHERE Itemid = ${val2}`

  // execute the UPDATE statement
  con.query(sql, (error, results) => {
    if (error){
      return console.error(error.message);
    }
    inquirer.prompt([
      {
          type: "confirm",
          message: "Do you want to buy more?",
          name: "confirm",
          default: true
      }
    ]).then(answers => {
      if (answers.confirm){
        afterConnection();
      }else{
        logIt('\n+======= THANK-YOU FOR SHOPPING WITH US =======+\n')
        con.end();
      }

    })
  });
}

// this function logs all the user input to a file called "logCustomer.txt"
function logIt (logFile) {
  console.log(logFile);
  fs.appendFile("logCustomer.txt", logFile, function(err) {
      if (err) {
          return logIt("Error: " + err);
      }
  });
};
