# SQL BAMAZON DB

## Overview :fire: :fire: :fire:

* Bamazon is a storefront CLI application utilizing SQL that is based on Amazon©.

* Bamazon comes with three views, Customer, Manager and Supervisor.

* The customer view allows customers to view products that are available, select a product, the quantity they want and allow the user to "purchase" it.

* The Manager view gives a unqiue set of commands to store managers for viewing and updating inventory.

* The supervisor view ***NOT YET IMPLIMENTED*** The supervisor View will allow supervisors to view product sales and profits.

* When a product is purchased, the order will "process" and remove the quantity bought form the storefront database.

***

### INSTALLATIONS

Bamazon is built with the following extensions/programs:

* [Node.js](https://nodejs.org/en/)
* [Mysql.js](https://www.npmjs.com/package/mysql)
* [Inquirer](https://www.npmjs.com/package/inquirer)
* [MAMP](https://MAMP.info/en/downloads/)
* [MySQLWorkbench](https://dev.mysql.com/downloads/workbench/)
* [Node-Native-FS](https://nodejs.org/api/fs.html)

***

### Bamazon Command Demos

***

1. `node bamazonCustomer.js`

    * This command will display the "Customer View". The customer view prompts the user for inventory and quantity.

        ![customer-Demo](./images/CUSTOMER_WELCOME_SCREEN.gif);

    * The customer will then enter an ID and the amount to purchase.

        ![customer-Welcome](./images/Customer_Purchase_Demo.gif);