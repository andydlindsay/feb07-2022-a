const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 54321;

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cookieParser());

app.set('view engine', 'ejs');

// helper functions
const genRandomId = () => {
  return Math.random().toString(36).substring(2, 6);
};

const getUserByEmail = (email, users) => {
  for (const userId in users) {
    const user = users[userId];
    if (user.email === email) {
      return user;
    }
  }

  return null;
};

// database
const users = {
  abcd: {
    id: 'abcd',
    email: 'alice@gmail.com',
    password: '1234'
  },
  defg: {
    id: 'defg',
    email: 'jstamos@gmail.com',
    password: '5678'
  }
};

// routes
app.get('/', (req, res) => {
  const user = users[req.cookies.userId];
  
  const templateVars = {
    user: user
  };

  res.render('home', templateVars);
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = getUserByEmail(email, users);

  if (!user) {
    return res.send('Error: User does not exist');
  }

  if (user.password !== password) {
    return res.send('Error: Passwords do not match');
  }

  res.cookie('userId', user.id);
  res.redirect('/');
});

app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const id = genRandomId();

  const currentUser = getUserByEmail(email, users);

  if (currentUser) {
    return res.send('Error: A user with that email already exists');
  }

  const newUser = {
    id: id,
    email: email,
    password: password
  };

  users[id] = newUser;

  res.cookie('userId', newUser.id);
  res.redirect('/');
});

app.post('/logout', (req, res) => {
  res.clearCookie('userId');
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});
