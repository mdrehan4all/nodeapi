const mysql = require("mysql");

const connection = mysql.createConnection({
    host: 'localhost',
    database: 'todo',
    user: 'root',
    password: ''
});

connection.connect((error)=>{
    if(error){ throw error; } else { console.log("MySQL connected"); }
});

module.exports = connection;