const mysql = require('mysql');
const inquirer = require('inquirer');
const fs = require('fs');
let productName = '';
let productID= '';
let productDept = '';
let productPrice = '';
let productStock = '';
var prodIdArr = [];



let con = mysql.createConnection({
  host: '127.0.0.1',
  user: "root",
  port: '8889',
  password: "root",
  database: "blamazon_db"
});

con.connect(function(err) {
  if (err) throw err;
  logIt("connected as id " + con.threadId);
  ask();
});


function ask(){ 
    inquirer.prompt([
        {
            type: 'list',
            name: 'manage',
            message: "What do you want to do?",
            choices: ['View Products', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Delete Product']
        }
    ]).then(answers => {
        let answer=answers.manage;
        switch(answer){
            case 'View Products':
            logIt(answer);
            showInventory();
            break;

            case 'View Low Inventory':
            logIt(answer);
            showLowInventory();
            break;

            case 'Add to Inventory':
            addInventory();
            break;

            case 'Add New Product':
            addNewProduct();
            break;

            case 'Delete Product':
            deleteProduct();
            break;

            default: 'View Products';
            break;
        };
        });
};

function showInventory(){
    con.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        logIt(`
        ================== MANAGER VIEW ==================
        `);
        res.forEach(function(item){
          productName = item.product_name.toUpperCase();
          productID = item.Itemid;
          productDept = item.department_name.toUpperCase();
          productPrice = item.price;
          productStock = item.stock_quantity;
          logIt(`
          ==========================================
          ID: ${productID}
          ITEM NAME: ${productName}
          DEPARTMENT: ${productDept}
          PRICE: $${productPrice}
          STOCK: ${productStock}
          ==========================================
          `);
          prodIdArr.push(productID);
      });
      con.end();
    });
};


function showLowInventory(){
        con.query("SELECT * FROM products ORDER BY stock_quantity DESC" , function (err, result) {
            if (err) throw err;
            result.forEach(function(item){
                // logIt(item.stock_quantity);
                if (item.stock_quantity < 5){
                    logIt(item);
                }
            })
            
            con.end();
        });
};

function addInventory(){
    con.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        logIt(`
        ================== MANAGER VIEW ==================
        `);
        res.forEach(function(item){
          productName = item.product_name.toUpperCase();
          productID = item.Itemid;
          productStock = item.stock_quantity;
          logIt(`
          ==========================================
          ID: ${productID}
          ITEM NAME: ${productName}
          STOCK: ${productStock}
          ==========================================
          `);
          prodIdArr.push(productID);
      });
      inquirer.prompt([
        {
            type: 'number',
            name: 'prodId',
            message: "What is the ID of the product stock you want to add to?",
            validate: function( value ) {
              var valid = prodIdArr.includes(value);
              return valid || "Please enter a valid product ID";
            },
        },
        {
            type: 'input',
            name: 'quant',
            message: "Number of products to add",
            validate: function( value ) {
              var valid = !isNaN(parseFloat(value));
              return valid || "Please enter a number";
            },
            filter: Number
          }
        ]).then(answers => {
            console.log(answers.prodId);
            console.log(answers.quant);
            console.log("Updating product quantities...\n");
            let sql = `UPDATE products
            SET stock_quantity = ${answers.quant}
            WHERE Itemid = ${answers.prodId}`
       // execute the UPDATE statement
            con.query(sql, (error, results) => {
                if (error){
                return console.error(error.message);
                }
                logIt('Rows affected:', results.affectedRows);
                inquirer.prompt([
                    {
                        type: "confirm",
                        message: "Do you want to add more?",
                        name: "confirm",
                        default: true
                    }
                  ]).then(answers => {
                    if (answers.confirm){
                      addInventory();
                    }else{
                      logIt('+======= THANK-YOU =======+')
                      con.end();
                    }
              
                  })
            });
         });
    });
};

function addNewProduct() {
    let productName;
    let productDept;
    let productPrice;
    let productStock;

    inquirer.prompt([
        {
            type: 'input',
            name: 'newProductName',
            message: "What is the name of the product you want to add?",
        },
        {
            type: 'input',
            name: 'newProductDept',
            message: "Which department does this product belong in?",
        },
        {
            type: 'input',
            name: 'newProductPrice',
            message: "What is the price? (ex: 10.00)",
            validate: function( value ) {
                var valid = !isNaN(parseFloat(value));
                return valid || "Please enter a valid price";
            },
            filter: Number
        },
        {
            type: 'input',
            name: 'newProductStock',
            message: "How many are in stock?",
            validate: function( value ) {
                var valid = !isNaN(parseFloat(value));
                return valid || "Please enter a number";
            },
            filter: Number
        }
    ]).then(answers => {
        logIt(answers);
        productName = answers.newProductName;
        productDept = answers.newProductDept;
        productPrice =  answers.newProductPrice;
        productStock = answers.newProductStock;
        logIt(productName, productDept, productPrice, productStock);
        createProduct();
    });


    function createProduct(){
        logIt("Inserting a new product...\n");
        var query = con.query(
        "INSERT INTO products SET ?",
        {
            product_name: productName,
            department_name: productDept,
            price: productPrice, 
            stock_quantity: productStock
        },
        function(err, res) {
            logIt(res.affectedRows + " product inserted!\n");
            // Call updateProduct AFTER the INSERT completes
        }
        );
        // logs the actual query being run
        logIt(query.sql);
        con.end();
    }
};


function deleteProduct() {
        inquirer
        .prompt({

            type: 'number',
            name: 'prodId',
            message: "What is the ID of the product you are looking for?",

        })
        .then(() => {
            inquirer.prompt({
                
                type: "confirm",
                message: "Are you sure you want to delete the product?",
                name: "confirm",
                default: true
            }).then(answers => {
                if (answers.confirm){
                    logIt("Deleting this item..\n");
                    con.query(
                    "DELETE FROM products WHERE ?",
                    {
                        Itemid: answers.prodId
                    },
                    function(err, res) {
                        console.log(res);
                        logIt(res.affectedRows + " products deleted!\n");
                        con.end();
                    }
                    );
                }else {
                    console.log(`\n
                    You did not confirm the delete. Try again.
                    \n`)
                    deleteProduct();
                }
            });
        });
        
        
    }


function logIt (logFile) {
    console.log(logFile);
    fs.appendFile("logManager.txt", logFile, function(err) {
        if (err) {
            return logIt("Error: " + err);
        }
    });
};