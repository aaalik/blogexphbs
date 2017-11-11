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

/* GET home page. */
router.get('/', function(req, res, next) {
    // res.render('index', { title: 'Express' });
    res.render('admin/dashboard', 
        {
            title: 'Dashboard',
            name: req.session.namaSession
        });
});

// GET posts page
router.get('/posts', function(req, res, next) {
    connection.query('SELECT * FROM posts',function(error, results, fields) {
    	console.log(req.baseUrl);
        console.log(results);
        res.render('admin/posts', 
        {
            title: 'All Posts',
            row: results
        });
    });
});

//GET edit page
router.get('/edit', function(req, res, next) {
    res.render('admin/edit', 
        {
            title: 'Add/Edit Post'
        });
});

//POST edit page
router.post('/edit', function(req, res, next) {
	var curdate = new Date().toLocaleString();
	var title = req.body.title;
    var content = req.body.content;
    var post = {title: title, content: content, date: curdate};
    console.log(curdate);
    console.log(req.body);
    connection.query('INSERT INTO posts SET ?', post, function(error, results, fields) {
        if (error) {
            console.log(error);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            })
        }else{
        	console.log(results);
        	console.log(req.params.id);
        	res.redirect('/users/edit');
        }
    });
});

module.exports = router;
