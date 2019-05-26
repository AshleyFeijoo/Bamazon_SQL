inquirer.prompt([{
    type: "confirm",
    message: "Are you sure you want to create this product" + productName +
    name: "confirm",
    default: true,
    when: function( results ) {
        // Only run if user set a name
        return results
      },
        }
]);
