const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const mysql = require('mysql');

app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/img', express.static(__dirname + 'public/img'))
app.use('/js', express.static(__dirname + 'public/js'))


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sajid',
  database: 'projects'
});

app.use(express.urlencoded({ extended: true }));

app.get('/signup', (req, res) => {
  res.render('signup.ejs');
});

app.post('/signup', (req, res) => {
  const { email, password } = req.body;

  // Generate a salt and use it to hash the password
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hashedPassword) => {
      // Insert the new user into the database
      connection.query(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [email, hashedPassword],
        (error, results) => {
          
          res.send('Successfully signed up!');
        }
      );
    });
  });
});

app.get('/login', (req, res) => {
  res.render('login.ejs');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Find the user with the matching email
  connection.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    (error, results) => {
      
        if (results.length > 0) {
            // The user exists, so now we will check their password
            const user = results[0];
            bcrypt.compare(password, user.password, (err, result) => {
              if (result) {
                // The passwords match, so the user is authenticated
                res.send('Successfully logged in!');
              } else {
                // The passwords do not match, so the user is not authenticated
                res.send('Incorrect password');
              }
            });
          } else {
            // The user does not exist
            res.send('User not found');
          }
          
    }
  );
});

app.listen(3001, () => console.log('Listening on port 3001'));
