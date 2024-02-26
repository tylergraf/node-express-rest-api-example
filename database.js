var sqlite3 = require('sqlite3').verbose()
const { subMinutes } = require("date-fns");
const sgMail = require('@sendgrid/mail')

const DBSOURCE = "db.sqlite"


let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message)
    throw err
  } else {
    console.log('Connected to the SQlite database.')
    db.run(`CREATE TABLE sumpEvent (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            value INTEGER, 
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )`, (err) => {
      if (err) {
        console.log('table alredy exists')
      }
    })
  }
})

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendAlert = (error) => {
  const data = {
    from: `tylergraf@gmail.com`,
    to: "tylergraf+1@gmail.com",
    subject: error ? "ERROR READING DB" : "SUMP PUMP ALERT",
    text: "Go check it out"
  };

  sgMail
    .send(data)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.log(JSON.stringify(error))
    })
}

let overTime = 0
setInterval(() => {
  var sql = "SELECT * FROM sumpEvent ORDER BY createdAt DESC LIMIT 1"
  db.get(sql, [], (err, row) => {
    if (err) {
      console.log(err)
      sendAlert(true)
    } else {
      const last = new Date(row.createdAt)
      const minutesAgo = subMinutes(new Date(), Number(process.env.MINUTES_AGO))
      if (last < minutesAgo && overTime < 3) {
        sendAlert()
        overTime++
      }
    }
  });
}, Number(process.env.MINUTES_AGO) * 1000 * 60 + 1);



module.exports = db

