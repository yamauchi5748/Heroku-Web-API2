const express = require('express')
const app = express()
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 5000
const ehime = require("./38EHIME.json");
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/db', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM test_table');
    const results = { 'results': (result) ? result.rows : null};
    res.render('pages/db', results );
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})


app.get('/', (req, res) => {
  const code = req.query.code;
  const address = ehime[code];
  if (address) {
    res.send(`kbc({ result: ${JSON.stringify(address)}, message: null })`);
  } else {
    res.send("kbc({ result: null, message: '存在しません' })");
  }
})

app.listen(port, () => {
  console.log(`Heroku simple WebAPI app listening at http://localhost:${port}`)
})