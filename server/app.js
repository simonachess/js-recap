const express = require('express');
const cors = require('cors');
const app = express();
const port = 3003;
const mysql = require('mysql');

app.use(cors());

app.use(express.urlencoded({
    extended: true
}))
app.use(express.json());

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "domino"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

//Route
app.get('/', (req, res) => {
    res.send('Labas  World!')
})

app.get('/labas', (req, res) => {
    res.send('Sveikutis Zuikutis!')
})

app.get('/labas/jonai', (req, res) => {
    res.send('Sveikutis, Jonai!')
})

app.get('/labas/:vardas', (req, res) => {
    res.send(`Sveikutis arba Sveikutė, ${req.params.vardas}!`)
})

app.get('/labas/sum/:a/:b', (req, res) => {
    res.send(`Atsakymas: ${parseInt(req.params.a) + req.params.b}`)
})


app.post('/calculator', (req, res) => {

    const d1 = parseFloat(req.body.d1);
    const d2 = parseFloat(req.body.d2);
    let answer;
    let errMsg;
    switch (req.body.action) {
        case '+':
            answer = d1 + d2;
            break;
        case '-':
            answer = d1 - d2;
            break;
        case 'X':
            answer = d1 * d2;
            break;
        case '/':
            if (d2 === 0) {
                errMsg = 'No way!'
            }
            else {
                answer = d1 / d2;
            }
            break;
        default: errMsg = 'WTF?'
    }

    res.json({
        answer: answer,
        errMsg: errMsg
    })
})



app.post('/dominos/add', (req, res) => {
    const sql = `
            INSERT INTO
            dices
            (left_side, right_side)
            VALUES (?,?)
            `;
    con.query(sql, [req.body.left, req.body.right], err => {
        if (err) throw err;
        console.log("1 record inserted");
    });
    res.json({
        msg: "OK",
    });
});


app.get('/dominos', (req, res) => {
    const sql = `
                SELECT * 
                FROM dices
                `;
    con.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        res.json({
            msg: "OK",
            dominos: result
        });
    });
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})