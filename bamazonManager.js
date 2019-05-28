//GLOBAL VARIABLES

const mysql = require('mysql');
const inquirer = require('inquirer');
const fs = require('fs');
let productName = '';
let productID= '';
let productDept = '';
let productPrice = '';
let productStock = '';
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
  if (err) throw err;
//   logIt("connected as id " + con.threadId);

//if the connection is made, run the credentials function.
  credentials();

});


function credentials(){
// prompts the user to enter the manager login credentials. 
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

        // sets username to the answer 
        var username = answers.username.toUpperCase();

        // if the answer is correct, it will run the ask function.
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

// Asks the user what they want to do.
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

// shows the inventory from the products table in the DB
    con.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        logIt(`
        ================== MANAGER VIEW ==================
        `);

        // Pulls the information from each product in the table.
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

          // pushes the product ID to an array for later validation
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

    // function that selects all from products and orders them by stock 
    // amount
        con.query("SELECT * FROM products ORDER BY stock_quantity DESC" , function (err, result) {
            if (err) throw err;

            // Pulls data from each product in the table
            result.forEach(function(item){

                // if the item stock is under 5, it will log it.
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

            // after the function is complete, it will run the managerial 
            // menu again.
            ask();
        });
};

function addInventory(){
    //selects all products from the products table
    con.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        logIt(`
        ================== MANAGER VIEW ==================
        `);

        // for each product, pulls the information for validation of ID
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

        { // PROMPTS THE USER TO GET ITEM ID OF THE PRODUCT THEY WISH TO        UPDATE STOCK OF. //
            type: 'number',
            name: 'prodId',
            message: "What is the ID of the product stock you want to add to?",
            validate: function( value ) {
              var valid = prodIdArr.includes(value);
              return valid || "Please enter a valid product ID";
            },
        },
        { // ASKS THE USER THE AMOUNT OF STOCK TO ADD.
            type: 'input',
            name: 'quant',
            message: "Number of products to add",
            validate: function( value ) {
              var valid = !isNaN(parseFloat(value));
              return valid || "Please enter a number";
            },
            filter: Number
          }

        // THEN THE DB IS QUERIED FOR THE INFORMATION ABOUT THE ITEM-ID

        ]).then(answers => {

            con.query("SELECT * FROM products WHERE Itemid =" + answers.prodId, 
            function (err, res) {
                if (err) throw err;

                // VARIABLE SET TO HOLD THE CURRENT PRODUCTS STOCK
                var stockOne = res[0].stock_quantity;

                // VARIABLE CREATED TO ADD THE NEW AMOUNT OF STOCK TO
                // THE OLD AMOUNT
                var completeNewStock = stockOne + answers.quant;
                console.log(`
                \n• • •  • • •  • • •  • • •  • • •  • • •  • • •  • • •\n
                Updating product quantities...
                \n• • •  • • •  • • •  • • •  • • •  • • •  • • •  • • •
                \n• • •  • • •  • • •  • • •  • • •  • • •  • • •  • • •\n
                New Stock Amount is: ${completeNewStock}
                \n• • •  • • •  • • •  • • •  • • •  • • •  • • •  • • •\n
                `);
               
                // VARIABLE FOR UPDATING THE TABLE.
                let sql = `UPDATE products
                SET stock_quantity = ${completeNewStock}
                WHERE Itemid = ${answers.prodId}`

                // UPDATES THE NEW PRODUCT STOCK AMOUNT TO THE DB.
                con.query(sql, (error, results) => {
                    if (error){
                    return console.error(error.message);
                    }
                    logIt('Rows affected:', results.affectedRows);

                // LOGS THE ROWS AFFECTED AND PROMPTS THE USER TO ADD MORE.
                    inquirer.prompt([

                        {
                            type: "confirm",
                            message: "Do you want to add more?",
                            name: "confirm",
                            default: true
                        }
                    ]).then(answers => {
                        if (answers.confirm){
                        // IF THE USER CONFIRMS, IT WILL RUN THE ADDINVENTORY() // FUNCTION AGAIN.
                            addInventory();

                        }else{
                        logIt('\n+======= THANK-YOU =======+\n')

                        // IF THE USER DOES NOT WANT TO ADD MORE, IT WILL 
                        // RUN THE ASK() FUNCTION TO PULL UP THE MANAGER MENU.
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