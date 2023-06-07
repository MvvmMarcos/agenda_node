const express = require('express');
const exphbs = require('express-handlebars');
// const mysql = require('mysql');
const pool = require('./db/conn');
const app = express();
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.use(express.static('public'));
//pegar o body
app.use(
    express.urlencoded({
        extended:true
    })
)
app.use(express.json());
//home do cadastro
app.get('/', (req, res)=>{
    res.render('home');
})
//home dados do post do cadastro
app.post('/books/insertbook', (req, res)=>{
    const title = req.body.title;
    const pageqty = req.body.pageqty;

    // const sql = `INSERT INTO books (title, pageqty) VALUES ('${title}','${pageqty}')`; sem o array de dados
    const sql = `INSERT INTO books (??, ??) VALUES (?,?)`;
    const data = ['title', 'pageqty', title, pageqty];

    pool.query(sql, data, function(err){
        if(err){
            console.log(err)
        }
        res.redirect('/books')
    });
    // console.log(`title:${title} e page:${pageqty}`);
})
//resgatando os dados do banco
app.get('/books', (req, res)=>{
    const sql = `SELECT * FROM books`;
    pool.query(sql, function(err, data){
        if(err){
            console.log(err)
            return
        }
        const books = data;
        // console.log(books);
        res.render('books', {books})
    }) 
})
//ler por id
app.get('/book/:id', (req, res)=>{
    const id = req.params.id;
    // const sql = `SELECT * FROM books WHERE id = ${id}`;sem o array data para o impedir inject
    const sql = `SELECT * FROM books WHERE ?? = ?`;
    const data = ['id', id];

    pool.query(sql, data, function(err, data){
        if(err){
            console.log(err)
            return
        }
        const book = data[0]
        console.log(book);
        res.render('book', {book});
    })
})
//editar o livro com get e post
app.get('/books/edit/:id', (req, res)=>{
    const id = req.params.id;
    // const sql = `SELECT * FROM books WHERE id = ${id}`
    const sql = `SELECT * FROM books WHERE ?? = ?`;
    const data = ['id', id];
    pool.query(sql, data, function(err, data){
        if(err){
            console.log(err)
            return
        }
        const book = data[0];
        res.render('editbook', {book})
    })
})
app.post('/books/update', (req, res)=>{
    const id = req.body.id;
    const title = req.body.title;
    const pageqty = req.body.pageqty;
    // const sql = `UPDATE books SET title = '${title}', pageqty = '${pageqty}' WHERE id = ${id}`;
    const sql = `UPDATE books SET ?? = ?, ?? = ? WHERE ?? = ?`;
    const data =['title', title, 'pageqty', pageqty, 'id', id ]
    pool.query(sql, data, function(err){
        if(err){
            console.log(err)
            return
        }
        res.redirect('/books');
    })
})
//remover o post
app.post('/books/remove/:id', (req, res)=>{
    const id = req.params.id;
    const sql = `DELETE FROM books WHERE id=${id}`;
    pool.query(sql, function(err){
        if(err){
            console.log(err)
            return
        }
        res.redirect('/books');
    })
})

app.listen(3000);
//conexão com o banco de dados
// const conn = mysql.createConnection({
//     host:'localhost',
//     user:'root',
//     password:'',
//     database:'nodemysql'
// });
// conn.connect(function(err){
//     if(err){
//         console.log(err)
//     }
//     console.log('Conectou ao msql');
    
// })

