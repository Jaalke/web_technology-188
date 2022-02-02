// ###############################################################################
// Web Technology at VU University Amsterdam
// Assignment 3
//
// The assignment description is available on Canvas. 
// Please read it carefully before you proceed.
//
// This is a template for you to quickly get started with Assignment 3.
// Read through the code and try to understand it.
//
// Have you read the zyBook chapter on Node.js?
// Have you looked at the documentation of sqlite?
// https://www.sqlitetutorial.net/sqlite-nodejs/
//
// Once you are familiar with Node.js and the assignment, start implementing
// an API according to your design by adding routes.


// ###############################################################################
//
// Database setup:
// First: Our code will open a sqlite database file for you, and create one if it not exists already.
// We are going to use the variable "db' to communicate to the database:
// If you want to start with a clean sheet, delete the file 'phones.db'.
// It will be automatically re-created and filled with one example item.

const sqlite = require('sqlite3').verbose();
let db = my_database('./phones.db');

// ###############################################################################
// The database should be OK by now. Let's setup the Web server so we can start
// defining routes.
//
// First, create an express application `app`:

var express = require("express");
var app = express();

// We need some middleware to parse JSON data in the body of our HTTP requests:
var bodyParser = require("body-parser");
app.use(bodyParser.json());

// We will use cors to ensure that the browser will accept resources from a local server:
var cors = require('cors');
app.use(cors({origin: 'null'}));


// ###############################################################################
// Routes
// 
// TODO: Add your routes here and remove the example routes once you know how
//       everything works.
// ###############################################################################

// This example route responds to http://localhost:3000/hello with an example JSON object.
// Please test if this works on your own device before you make any changes.

app.get("/hello", function(req, res) {
    response_body = {'Hello': 'World'} ;

    // This example returns valid JSON in the response, but does not yet set the
    // associated HTTP response header.  This you should do yourself in your
    // own routes!
    res.json(response_body) ;
});

// This route responds to http://localhost:3000/db-example by selecting some data from the
// database and return it as JSON object.
// Please test if this works on your own device before you make any changes.
app.get('/db-example', function(req, res) {
    // Example SQL statement to select the name of all products from a specific brand
    db.all(`SELECT * FROM phones WHERE brand=?`, ['Fairphone'], function(err, rows) {
	
    	// TODO: add code that checks for errors so you know what went wrong if anything went wrong
    	// TODO: set the appropriate HTTP response headers and HTTP response codes here.

    	// # Return db response as JSON
    	return res.json(rows)
    });
});

app.post('/post-example', function(req, res) {
	// This is just to check if there is any data posted in the body of the HTTP request:
	console.log(req.body);
	return res.json(req.body);
});

// OUR ROUTES ADDED BELLOW:

// This route responds to http://localhost:3000/retrieve_all_phones by retrieving all the rows in the 
// phones table.

app.get('/retrieve_all_phones', function(req, res) {
	db.all(`SELECT * FROM phones`, function(err, rows) {
		if (err) {
			res.sendStatus(404);
		}
		else {
			return res.json(rows);
		}
	});
});

// This route responds to http://localhost:3000/create_phone by inserting the provided data as 
// entries in the phones table, automatically assigning an id. 
// =======C=======

app.post('/create_phone', function(req, res) {
	let id = 1;
	let phone = req.body

	db.run(`INSERT INTO phones (brand, model, os, image, screensize) VALUES (?, ?, ?, ?, ?)`,
		   [phone.brand, phone.model, phone.os, phone.image, phone.screensize], function(err) {
			   if (err) {
				    return res.sendStatus(400);
			   } else {
			        return res.sendStatus(200);
			   }
		   })
});

// This route responds to http://localhost:3000/get_id by retrieving the row fitting the 
// id provided in the request body url. 
// =======R=======

app.get('/retrieve_phone/:id', function(req, res) {
	let id = req.params.id;

	db.all(`SELECT * FROM phones WHERE id=?`, [id], function(err, row) {
		if (err) {
			res.sendStatus(500);
		} else if (!row) {
			res.status(404);
		} else {
			return res.json(row);
		}
	});
});

// This route responds to http://localhost:3000/update_phone/id by editing the phone 
// fitting the id provided in the request url with all the fields provided in the body
// JSON. If a field is not provided, it will be omitted and retain its value.
// =======U=======

app.put('/update_phone/:id', function(req, res) {
	let id = req.params.id;
	db.run(`SELECT * FROM phones WHERE id=?`, [id], function(err) {
		if (err) {
			res.sendStatus(404);s
		}
	});

	// I realise this sequence of IFs is wholly unlovely and quite frankly sloppy
	// I just couldn't figure out a better way to di this. 

	if (req.body.brand) {
		db.run(`UPDATE phones
		        SET brand=?
				WHERE id=?`, [req.body.brand, id]);
	}
	if (req.body.model) {
		db.run(`UPDATE phones
		        SET model=?
				WHERE id=?`, [req.body.model, id]);
	}
	if (req.body.os) {
		db.run(`UPDATE phones
		        SET os=?
				WHERE id=?`, [req.body.os, id]);
	}
	if (req.body.screensize) {
		db.run(`UPDATE phones
		        SET screensize=?
				WHERE id=?`, [req.body.screensize, id]);
	}
	if (req.body.image) {
		db.run(`UPDATE phones
		        SET image=?
				WHERE id=?`, [req.body.image, id]);
	}

	return res.sendStatus(200);
})

// This route responds to http://localhost:3000/delete_phone/id by removing the row 
// fitting the id provided in the request url. 
// =======D=======

app.delete('/delete_phone/:id', function(req, res) {
	let id = req.params.id;

	db.all(`DELETE FROM phones WHERE id=?`, [id], function(err) {
		if (err) {
			res.sendStatus(404);
		} else {
			res.sendStatus(202);
		}
	});
});

// This route responds to http://localhost:3000/wipe_table by deleting all the phone entries from 
// the table, leaving in place an empty table.

app.delete('/wipe_table', function(req, res) {
	response_body = {'All Phones': 'Removed'} ;

	db.run(`DELETE FROM phones`, function(err) {
		if (err) {
			res.sendStatus(404);
		} else {
			res.sendStatus(202);
		}
	});
});

// ###############################################################################
// This should start the server, after the routes have been defined, at port 3000:

app.listen(3000);
console.log("Your Web server should be up and running, waiting for requests to come in. Try http://localhost:3000/hello");

// ###############################################################################
// Some helper functions called above
function my_database(filename) {
	// Connect to db by opening filename, create filename if it does not exist:
	var db = new sqlite.Database(filename, (err) => {
  		if (err) {
			console.error(err.message);
  		}
  		console.log('Connected to the phones database.');
	});
	// Create our phones table if it does not exist already:
	db.serialize(() => {
		db.run(`
        	CREATE TABLE IF NOT EXISTS phones
        	(id 	INTEGER PRIMARY KEY,
        	brand	CHAR(100) NOT NULL,
        	model 	CHAR(100) NOT NULL,
        	os 	CHAR(10) NOT NULL,
        	image 	CHAR(254) NOT NULL,
        	screensize INTEGER NOT NULL
        	)`);
		db.all(`select count(*) as count from phones`, function(err, result) {
			if (result[0].count == 0) {
				db.run(`INSERT INTO phones (brand, model, os, image, screensize) VALUES (?, ?, ?, ?, ?)`,
				["Fairphone", "FP3", "Android", "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Fairphone_3_modules_on_display.jpg/320px-Fairphone_3_modules_on_display.jpg", "5.65"]);
				console.log('Inserted dummy phone entry into empty database');
			} else {
				console.log("Database already contains", result[0].count, " item(s) at startup.");
			}
		});
	});
	return db;
}
