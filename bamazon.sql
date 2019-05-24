-- Drops the animals_db if it exists currently --
DROP DATABASE IF EXISTS bamazon_db;
-- Creates the "animals_dbx" database --
CREATE DATABASE bamazon_db;

-- Makes it so all of the following code will affect animals_db --
USE bamazon_db;

-- Creates the table "people" within animals_db --
CREATE TABLE products (
  Itemid INTEGER(220) NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(500) NOT NULL,
  department_name VARCHAR(220)   NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER(120) NOT NULL,
  PRIMARY KEY(Itemid)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES
( -- first row: values for the columns in the list above
 "TCL 43 Inch 4K TV", "Electronics", 239.99, 18
),
( -- second row: values for the columns in the list above
  "Dyson Cyclone V10", "Home & Kitchen", 399.99, 7
),
( -- second row: values for the columns in the list above
  "Hamilton Beach Wave Crusher Blender", "Home & Kitchen", 29.99, 10
),
( -- second row: values for the columns in the list above
  "Samsung Chromebook 3", "Electronics", 139.81, 6
),
( -- second row: values for the columns in the list above
  "Fruit of the Loom Men's Tucked V-Neck T-Shirt", "Apparel", 12.89, 4
),
( -- second row: values for the columns in the list above
  "STYLEWORD Women's V Neck Floral Sun Dress", "Apparel", 16.98, 5
),
( -- second row: values for the columns in the list above
  "Carter's Baby Girls' 8-Pack Short-Sleeve Bodysuits", "Apparel", 23.99, 9
),
( -- second row: values for the columns in the list above
  'Rivet Rustic Textured Stoneware Planter, 6.25"H, Bronze', "Outdoor & Garden", 22.99, 5
),
( -- second row: values for the columns in the list above
  "Comfort Plus 8-Piece Gardening Tool Set", "Outdoor & Garden", 52.99, 3
),
( -- second row: values for the columns in the list above
  "BamazonBasics 18-Piece Dinnerware Set", "Home & Kitchen", 39.99, 15
);


SELECT * FROM bamazon_db.products;


