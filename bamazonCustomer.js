
var mysql = require('mysql');
var inquirer = require('inquirer');

let productName = '';
let productID= '';
let productDept = '';
let productPrice = '';
let productStock = '';
var newStockQuantity ='';
let ammountStock = '';
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
  console.log("connected as id " + con.threadId);
  afterConnection();
});


function afterConnection(){
  con.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    console.log(`
    ================== ITEMS AVAILABLE FOR PURCHASE ==================
    `);
    res.forEach(function(item){
      productName = item.product_name.toUpperCase();
      productID = item.Itemid;
      productDept = item.department_name.toUpperCase();
      productPrice = item.price;
      productStock = item.stock_quantity;
      console.log(`
      ========+ ${productName} +========
      Product ID: ${productID}
      Department: ${productDept}
      Price: $${productPrice}
      Stock: ${productStock}
      =====================++++++======================
      `);
      prodIdArr.push(productID);
  });

      console.log(prodIdArr);
      ask();
   function ask(){   
      inquirer.prompt([
          {
            type: 'number',
            name: 'prodId',
            message: "What is the ID of the product you are looking for?",
            validate: function( value ) {
              var valid = prodIdArr.includes(value);
              return valid || "Please enter a valid product ID";
            },
          },
          {
            type: 'input',
            name: 'quant',
            message: "How many do you need?",
            validate: function( value ) {
              var valid = !isNaN(parseFloat(value));
              return valid || "Please enter a number";
            },
            filter: Number
          },
      ]).then(answers => {
        console.log(answers);
              console.log('The product ID is: ' + answers.prodId);
              findProduct(answers.prodId, answers.quant);
        });
    };

        function findProduct(product, amtNeeded){
          con.query("SELECT * FROM products WHERE Itemid =" + product, 
          function (err, res) {
            if (err) throw err;
            console.log(res);
            ammountStock = res[0].stock_quantity;
            console.log('The ammount in stock: ' + ammountStock);
            if (amtNeeded <= ammountStock){
              console.log(`Processing your order now!`);
              newStockQuantity = ammountStock - amtNeeded;
              console.log(newStockQuantity);
              updateTables(newStockQuantity, product);
            }else{
              console.log(`Insufficient Quantity!`);
              ask();
            }
          });
        } 
  });
}


function updateTables(val1, val2){
  let sql = `UPDATE products
           SET stock_quantity = ${val1}
           WHERE Itemid = ${val2};`
  
  // execute the UPDATE statement
  con.query(sql, (error, results) => {
    if (error){
      return console.error(error.message);
    }
    console.log('Rows affected:', results.affectedRows);
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
        console.log('+======= THANK-YOU FOR SHOPPING WITH US =======+')
        con.end();
      }

    })
  });
}

