var express = require('express');
var router = express.Router();
var mysql = require('mysql');
//mysql database setup
var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'blogexp'
});
connection.connect(function(err){
    if (!err) {
        console.log("Database is connected ...");
    } else {
        console.log("Error connecting database ...");
        console.log(err);
    }
});

/* GET login page. */
router.get('/login', function(req, res, next) {
    // res.render('index', { title: 'Express' });
    console.log(req.session.namaSession);
    res.render('login',{
        title: 'Login'
    });
});

/* GET logout function. */
router.get('/logout', function(req, res, next) {
    req.session = null;
    res.redirect('/login');
});

/* GET index page. */
router.get('/', function(req, res, next) {
    connection.query('SELECT * FROM posts',function(error, results, fields) {
        console.log(results);
        res.render('home', 
        {
            title: 'Home',
            row: results
        });
    });
});

//GET post page
router.get('/post', function(req, res, next) {
    res.render('post', 
        {
            title: 'Post'
        });
});

// GET test page
router.get('/sb-admin', function(req, res, next) {
    //untuk halaman blog home
    var id = '1';
    var posttitle = req.body.posttitle;
    var postcontent = req.body.postcontent;
    connection.query('SELECT * FROM posts',function(error, results, fields) {
        // posttitle == results[0].title;
        console.log(results);
        res.render('sb-admin', {row: results});
    });
    // res.render('sb-admin'); // belum pake database
});




// POST login page
router.post('/login', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    connection.query('SELECT * FROM tb_user WHERE username = ?', [email], function(error, results, fields) {
        if (error) {
            // console.log("error ocurred",error);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            })
        } else {
            console.log('The solution is: ', results);
            if (results.length > 0) {
                if (results[0].password == password) {
                    // res.send({
                    //     "code": 200,
                    //     "success": "login sucessfull"
                    // });
                    req.session.loggedIn = true;
                    req.session.namaSession = results[0].username;
                    req.session.idUser = results[0].id;
                    req.session.lvlUser = results[0].level;
                    console.log(req.session.namaSession);
                    res.redirect('/users');
                } else {
                    res.send({
                        "code": 204,
                        "success": "Email and password does not match"
                    });
                }
            } else {
                res.send({
                    "code": 204,
                    "success": "Email and password does not match"
                });
            }
        }
    });
});

module.exports = router;