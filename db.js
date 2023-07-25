var mysql = require('mysql');

var con = mysql.createConnection({
    host: 'db4free.net', // Changed to lowercase 'localhost'
    user: 'waynealex',
    password: 'wayne9914' // Replace 'your_password' with your actual MySQL root password
});

con.connect(function(err){
    if (err) throw err;
    console.log("Database connected!");
});


function queryDatabase(sqlQuery, callback) {
    con.query(sqlQuery, function(err, result) {
        if (err) throw err;
        callback(result);
    });
}

module.exports = {
    queryDatabase: queryDatabase
};
