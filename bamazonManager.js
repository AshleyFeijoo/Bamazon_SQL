var mysql = require('mysql');
var inquirer = require('inquirer');

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
  ask();
});



function ask(){ 
    inquirer.prompt([
        {
            type: 'list',
            name: 'manage',
            message: "What do you want to do?",
            choices: ['View Products', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
        }
    ]).then(answers => {
        let answer=answers.manage;
       
        switch(answer){
            case 'View Products':
            console.log(answer);
            showInventory();
            break;
            case 'View Low Inventory':
            console.log(answer);
            showLowInventory();
            break;
            case 'Add to Inventory':
            addInventory();
            break;
            case 'Add New Product':
            newProduct();
            break;
            default: 'View Products';
            break;
        };
        });
};

function showInventory(){
    con.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log(`
        ================== MANAGER VIEW ==================
        `);
        res.forEach(function(item){
          productName = item.product_name.toUpperCase();
          productID = item.Itemid;
          productDept = item.department_name.toUpperCase();
          productPrice = item.price;
          productStock = item.stock_quantity;
          console.log(`
          =======
          ${productName}
          Product ID: ${productID}
          Department: ${productDept}
          Price: $${productPrice}
          Stock: ${productStock}
          ========
          `);
      });
      con.end();
    });
};


function showLowInventory(){
        con.query("SELECT * FROM products" , function (err, result) {
            if (err) throw err;
            result.forEach(function(item){
                // console.log(item.stock_quantity);
                if (item.stock_quantity < 5){
                    console.log(item);
                }
            })
            
            con.end();
        });
};

function addInventory(){
    con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT * FROM products" , function (err, result) {
        
        });
       
    });
}
// function afterConnection(){


//     con.end();
// }