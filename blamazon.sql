-- Drops the animals_db if it exists currently --
DROP DATABASE IF EXISTS blamazon_db;
-- Creates the "animals_dbx" database --
CREATE DATABASE blamazon_db;

-- Makes it so all of the following code will affect animals_db --
USE blamazon_db;

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
 "40 Inch 4k TV", "Electronics", 367.99, 18
),
( -- second row: values for the columns in the list above
  "Dyson Vacuum", "Housewares", 185.89, 7
),
( -- second row: values for the columns in the list above
  "Blender", "Housewares", 24.99, 10
),
( -- second row: values for the columns in the list above
  "DVR", "Electronics", 67.56, 6
),
( -- second row: values for the columns in the list above
  "Men's Plain V-Neck", "Apparel", 8.99, 4
),
( -- second row: values for the columns in the list above
  "Women's Sun-Dress", "Apparel", 32.97, 5
),
( -- second row: values for the columns in the list above
  "Baby Onesie\'s Set of 4", "Apparel", 25.99, 9
),
( -- second row: values for the columns in the list above
  "16inch Diameter Planter Pot", "Home\/Gardening", 46.79, 5
),
( -- second row: values for the columns in the list above
  "Set of Gardening Tools", "Home\/Gardening", 77.65, 3
),
( -- second row: values for the columns in the list above
  "Floral-scented Candle", "Housewares", 7.88, 15
),


SELECT * FROM blamazon_db.products;


