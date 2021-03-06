# SQL BAMAZON DB

## Overview :fire: :fire: :fire:

* Bamazon is a storefront CLI application utilizing SQL that is based on Amazon©.

* Bamazon comes with three views, Customer, Manager and Supervisor.

* The customer view allows customers to view products that are available, select a product, the quantity they want and allow the user to "purchase" it.

* The Manager view gives a unqiue set of commands to store managers for viewing and updating inventory.

* ***NOT YET IMPLEMENTED*** The supervisor view The supervisor View will allow supervisors to view product sales and profits.

* When a product is purchased, the order will "process" and remove the quantity bought form the storefront database.

* All customer and manager input is logged in log files.

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

1. `node bamazonCustomer`

    * This command will display the **Customer View**. The customer view prompts the user for inventory and quantity.

        ![customer-Demo](./images/CUSTOMER_WELCOME_SCREEN.gif)

    * The customer will then enter an ID and the amount to purchase.

        ![customer-Welcome](./images/Customer_Purchase_Demo.gif)

    * The customer is prompted to continue purchasing, or end their purchase.

        ![customer-end](./images/Customer_end_demo.gif)

    * If the product stock is insufficient, the purchase will not go through.

        ![customer-Error](./images/Customer_Error.gif)

***
***

2. `node bamazonManager`

    * This command will display the **Manager View**. The manager view allows managers of the store to select managerial commands.

    * When first prompted, `node bamazonManager` will show the manager the following log-in screen. If the credentials are correct, it will present the managerial options:

        ![Manager-Welcome](./images/Manager_Credentials.gif)

         * if the credentials are incorrect, the manager will be prompted to try again.

            ![Manager-Error](./images/Manager_Cred_Fail.gif)

    * View Products

        * View products will allow the manager to see all the inventory for the store.

            ![manager-View](./images/Manager_View_Products.gif)

    * View Low Inventory

        * View Low Inventory will allow the manager to see all the products in the store that have less than 5 items in stock.

            ![manager-View](./images/Manager_Low_Inv_Demo.gif)

    * Add To Inventory

        * Add to inventory allows the manager to add more stock to a product that is already available.

            ![manager-View](./images/Manager_Add_Inv.gif)

    * Add New Product

        * Add New Product allows the manager to create a new product and add it to the inventory.

            ![manager-View](./images/Manager_Add_New_Inv.gif)

        * You can see here that the table in the DB is updated with the new inventory for ID 10 and the new product, *Hp Smart Home Computer*

            ![manager-View](./images/tableupdate.png)

    * Delete Product

        * Delete Product allows the manager to delete a product from inventory.

            ![manager-View](./images/Manager_Delete_Inv.gif)
