var sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "db.sqlite" 


let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQlite database.')
        db.run(`CREATE TABLE sumpEvent (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            value INTEGER, 
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,(err) => {
        if(err){
            console.log('table alredy exists')
        }
    })  
    }
})


module.exports = db

