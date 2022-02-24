const express = require('express');
const morgan = require('morgan');
// const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session');

const app = express();
const port = process.env.PORT || 54321;

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
// app.use(cookieParser());
app.use(cookieSession({
  name: 'potato',
  keys: ['my', 'secret', 'keys']
}));

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
    password: '$2a$10$Dv7Eoqc9O4UT7kDgCkjeYeVj5uJ2GkN2kFPLHfhf6bZg.AJQVKewe'
  },
  defg: {
    id: 'defg',
    email: 'jstamos@gmail.com',
    password: '$2a$10$Dv7Eoqc9O4UT7kDgCkjeYeVj5uJ2GkN2kFPLHfhf6bZg.AJQVKewe'
  }
};

// routes
app.get('/', (req, res) => {
  // const userId = req.cookies.userId;
  const userId = req.session.userId;

  const user = users[userId];
  
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

  const result = bcrypt.compareSync(password, user.password);

  if (!result) {
    return res.send('Error: Passwords do not match');
  }

  // res.cookie('userId', user.id);
  req.session.userId = user.id;

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

  const salt = bcrypt.genSaltSync();
  const hashedPassword = bcrypt.hashSync(password, salt);

  const newUser = {
    id: id,
    email: email,
    password: hashedPassword
  };

  users[id] = newUser;
  console.log(users);

  // res.cookie('userId', newUser.id);
  req.session.userId = newUser.id;

  res.redirect('/');
});

app.post('/logout', (req, res) => {
  // res.clearCookie('userId');
  req.session = null;

  res.redirect('/');
});

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});
