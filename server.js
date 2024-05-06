var express = require('express');
var app = express();
var mysql = require('mysql');
var cors = require('cors');
var bodyParser = require('body-parser');

app.use(cors());

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var con = mysql.createConnection({
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "book_db"
})

con.connect((err) => {
    if (err) throw err;
    console.log("Connected to database");
})

// list of books
app.get("/books", function (req, res) {
    con.query("select * from books", (err, result, fields) => {
        if(err) { res.send({error:"Operation failed"}); }
        else { res.send(result); }
    })
});

// new book add
app.post("/books", jsonParser, function (req, res) {
    let book_title = req.body.book_title;
    let description = req.body.description;
    let author_name = req.body.author_name;
    let price = req.body.price;

    let qr = `insert into books(book_title,description,author_name,price)values('${book_title}','${description}','${author_name}','${price}')`;

    con.query(qr, (err, result, fields) => {
        if (err) { res.send({ error: "Operation failed" }); }
        else { res.send({ error: "Operation Success" }); }
    });

});

// get one book info by id
app.get("/books/:id", function (req, res) {
    let id = req.params.id;
    con.query("select * from books where id = " + id, (err, result, fields) => {
        if (err) { res.send({ error: "Operation failed" }); }
        else { res.send(result); }
    });
});

// update a book
app.patch("/book", jsonParser, function (req, res) {
    let book_title = req.body.book_title;
    let description = req.body.description;
    let author_name = req.body.author_name;
    let price = req.body.price;
    let id = req.body.id;

    let qr = `update books set book_title = '${book_title}' , description = '${description}' ,author_name = '${author_name}' ,price = ${price} where id = ${id}`;

    con.query(qr, (err, result, fields) => {
        if (err) { res.send({ error: "Operation failed" }); }
        else { res.send({ error: "Book updated successfully" }); }
    });

});

// delete a book
app.delete("/book/:id", function (req, res) {
    let id = req.params.id;

    let qr = `delete from books where id = ${id}`;

    con.query(qr, (err, result, fields) => {
        if (err) { res.send({ error: "Operation failed" }); }
        else { res.send({ error: "Book deleted successfully" }); }
    });
});

app.listen(9000, function () {
    console.log("Server Started...")
})