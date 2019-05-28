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
  database: "bamazon_db"
});

con.connect(function(err) {
  if (err) throw err;
//   logIt("connected as id " + con.threadId);
  credentials();
});


function credentials(){
    inquirer.prompt([
        {
            type: "input",
            message: "USERNAME: ",
            name: "username"
          },
          // Here we create a basic password-protected text prompt.
          {
            type: "password",
            message: "PASSWORD: ",
            name: "password"
          },
    ]).then(answers => {
        var username = answers.username.toUpperCase();
        if (username === "MANAGER" && answers.password === 'Password'){
            logIt(`
                \n+++=========================+++
                \n\tWelcome Manager!
                \n+++=========================+++
            `)
            ask();
        }else{
            logIt(`
            \n+++=======================================================+++
            \n\tThe Username and password is incorrect. Please try again.
            \n+++=======================================================+++
            `)
            credentials();
        }   
    });
}

function ask(){ 
    inquirer.prompt([
        {
            type: 'list',
            name: 'manage',
            message:`
  • • •  • • •  • • •  • • •
 \t + MAIN MENU +
  • • •  • • •  • • •  • • •\t
            `,
            choices: ['• View Products', '• View Low Inventory', '• Add to Inventory', '• Add New Product', '• Delete Product', '* Exit']
        }
    ]).then(answers => {
        let answer=answers.manage;
        switch(answer){
            case '• View Products':
            logIt(answer);
            showInventory();
            break;

            case '• View Low Inventory':
            showLowInventory();
            break;

            case '• Add to Inventory':
            addInventory();
            break;

            case '• Add New Product':
            addNewProduct();
            break;

            case '• Delete Product':
            deleteProduct();
            break;

            case '* Exit':
            con.end();
            break;

            default: '• View Products';
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
      logIt(`
        \n• • •  • • •  • • •  • • •  • • •  • • •  • • •  • • •\n
        MAIN MENU
        \n• • •  • • •  • • •  • • •  • • •  • • •  • • •  • • •
        `);
      ask();
    });
};


function showLowInventory(){
        con.query("SELECT * FROM products ORDER BY stock_quantity DESC" , function (err, result) {
            if (err) throw err;
            result.forEach(function(item){
                // logIt(item.stock_quantity);
                if (item.stock_quantity < 5){
                    logIt(`
                    \n==========================================
                    \nITEM NAME: ${item.product_name}
                    \nSTOCK: ${item.stock_quantity}
                    \nPRODUCT ID: ${item.Itemid}
                    \n==========================================
                    `);
                }
            })
            ask();
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
            con.query("SELECT * FROM products WHERE Itemid =" + answers.prodId, 
            function (err, res) {
                if (err) throw err;
                stockOne = res[0].stock_quantity;
                var completeNewStock = stockOne + answers.quant;
                console.log(`
                \n• • •  • • •  • • •  • • •  • • •  • • •  • • •  • • •\n
                Updating product quantities...
                \n• • •  • • •  • • •  • • •  • • •  • • •  • • •  • • •
                \n• • •  • • •  • • •  • • •  • • •  • • •  • • •  • • •\n
                New Stock Amount is: ${completeNewStock}
                \n• • •  • • •  • • •  • • •  • • •  • • •  • • •  • • •\n
                `);
               
                let sql = `UPDATE products
                SET stock_quantity = ${completeNewStock}
                WHERE Itemid = ${answers.prodId}`

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
                        logIt('\n+======= THANK-YOU =======+\n')
                        ask();
                        }
                    })
                });
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
            type: 'number',
            name: 'newProductPrice',
            message: "What is the price? (ex: 10.00)",
            validate: function( value ) {
                var valid = !isNaN(parseFloat(value));
                return valid || "Please enter a valid price";
            },
            filter: Number
        },
        {
            type: 'number',
            name: 'newProductStock',
            message: "How many are in stock?",
            validate: function( value ) {
                var valid = !isNaN(parseFloat(value));
                return valid || "Please enter a number";
            },
            filter: Number
        },
    ]).then((results => {

        productName = results.newProductName;
        productDept = results.newProductDept;
        productPrice =  results.newProductPrice;
        productStock = results.newProductStock;
     
            inquirer.prompt([{
                type: "confirm",
                message: `
                \nPLEASE CONFIRM YOU WANT TO ADD THIS PRODUCT\n
                Product Name: ${productName}
                Product Department: ${productDept}
                Product Price: ${productPrice}
                Product Stock: ${productStock}
                \n
                `,
                name: "confirm",
                default: true,
                when: function( results ) {
                    // Only run if user set a name
                    return results
                  },
                }
            ]).then(answer =>{
                if (answer.confirm){
                    createProduct(productName, productDept, productPrice, productStock)
        
                }else{
                
                }
             

            });
            function createProduct(arg1, arg2, arg3, arg4){
                logIt(`
                \n• • •  • • •  • • •  • • •  • • •  • • •  • • •  • • •\n
                    Creating New Product...
                \n• • •  • • •  • • •  • • •  • • •  • • •  • • •  • • •
                `);
                var query = con.query(
                "INSERT INTO products SET ?",
                {
                    product_name: arg1,
                    department_name: arg2,
                    price: arg3, 
                    stock_quantity: arg4
                },
                function(err, res) {
                    logIt(res.affectedRows + " product inserted!\n");
                    // Call updateProduct AFTER the INSERT completes
                }
                );
                // logs the actual query being run
                logIt(query.sql);
                logIt(`
                \n• • •  • • •  • • •  • • •  • • •  • • •  • • •  • • •\n
                MAIN MENU
                \n• • •  • • •  • • •  • • •  • • •  • • •  • • •  • • •
                `);
                ask();
            }

    }));


};


function deleteProduct() {
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
      inquirer.prompt([
            {
            type: 'number',
            name: 'prodId',
            message: "What is the ID of the product you are looking for?",
            }
    ]).then((results => {
            inquirer.prompt([
                {
                type: "confirm",
                message: `\nPLEASE CONFIRM YOU WANT TO DELETE THIS PRODUCT\n
                Product Name: ${productName}
                Product Department: ${productDept}
                Product Price: ${productPrice}
                Product Stock: ${productStock}
                \n
                `,
                name: "confirm",
                default: true,
                when: function( results ) {
                    // Only run if user set a name
                    return results
                  }
                },
            ]).then(answer => {
                if (answer.confirm){
                    logIt(`
                    \n• • •  • • •  • • •  • • •  • • •  • • •  • • •  • • •\n
                    Deleting this product...
                    \n• • •  • • •  • • •  • • •  • • •  • • •  • • •  • • •
                    `);
                    if (err) throw err;
                    var sql = "DELETE FROM products WHERE Itemid=" +  results.prodId;
                    con.query(sql, function (err, result) {
                      if (err) throw err;
                      console.log(`
                      \n• • •  • • •  • • •  • • •  • • •  • • •  • • •  • • •\n
                      Number of rows affected: ${result.affectedRows}
                      \n• • •  • • •  • • •  • • •  • • •  • • •  • • •  • • •
                      `);
                    });
                    ask();
                }else{
                    logIt(`
                    \n• • •  • • •  • • •  • • •  • • •  • • •  • • •  • • •\n
                      You did not confirm. Please try again.
                    \n• • •  • • •  • • •  • • •  • • •  • • •  • • •  • • •
                    `);
                    deleteProduct();
                }
            });
        }));
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

function logCreds (logFile) {
    console.log(logFile);
    fs.appendFile("credentials.log", logFile, function(err) {
        if (err) {
            return logIt("Error: " + err);
        }
    });
};