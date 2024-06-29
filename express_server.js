const { getUserByEmail, getUrlById, urlsForUser } = require("./helpers");
const express = require("express");
const bcrypt = require("bcryptjs");
const cookieSession = require('cookie-session')

const app = express();
const PORT = 8080; 

app.set("view engine", "ejs");

//Cookie Session
app.use(cookieSession({
  name: 'session',
  keys: ["peoidnks", "afeafsasf", "asdfasdasds"],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

//Middleware
app.use(express.urlencoded({ extended: true }));

//DATA
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "byee11",
  },
  efas: {
    longURL: "https://www.no.ca",
    userID: "byee11",
  },
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

//FUNCTIONS
function generateRandomString() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}

//Login
app.get("/login", (req, res) => {
  const {user_id} = req.session
  if (users[user_id]) {
    return res.redirect("/urls")
  }
  const templateVars = { urls: urlDatabase, user: null };
  req.session.user_id = null
  res.render("login", templateVars);
});

app.post('/login', (req, res) => {
  const email = req.body.email.trim()
  const password = req.body.password.trim()
  const profile = getUserByEmail(email, users)
  //if email or password empty
  if (email === "" || password === "") {
    res.status(400).send('Email and Password can not be empty');
    //if email does not exist
  } else if (profile === null) {
    res.status(403).send('Email cannot be found');
  } else {
    //User exist
    // check if password matches
    if (!bcrypt.compareSync(password, profile.password)) {
      res.status(403).send('Wrong Password')
    } else {
      req.session.user_id = profile.id;
      res.redirect(`/urls`);
    }
  }
})

//Register
app.get("/register", (req, res) => {
  const {user_id} = req.session
  if (users[user_id]) {
    return res.redirect("/urls")
  }
  const templateVars = { urls: urlDatabase, user: null };
  req.session.user_id = null
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  const newRandom = generateRandomString();
  const email = req.body.email.trim()
  const password = req.body.password.trim()
  const hashedPassword = bcrypt.hashSync(password, 10);
  //if email or password empty
  if (email === "" || password === "") {
    res.status(400).send('Email and Password can not be empty');
    //if email exist already
  } else if (getUserByEmail(email, users) !== null) {
    res.status(400).send('This email us currently used');
  } else {
    users[newRandom] = {
      id: newRandom,
      email: email,
      password: hashedPassword
    }
    req.session.user_id = newRandom;
    res.redirect(`/urls`);
  }
});

///URLS
app.get("/urls", (req, res) => {
  const {user_id} = req.session
  if (!users[user_id]) {
    return res.send('Please Login In');
  }
  const templateVars = { urls: urlsForUser(user_id, urlDatabase), user: users[user_id] };
  res.render("urls_index", templateVars);
});

//NEW
app.get("/urls/new", (req, res) => {
  const {user_id} = req.session
  if (!users[user_id]) {
    return res.send('Please Login In');
  }
  const templateVars = { user: users[user_id]};
  res.render("urls_new", templateVars);
});

//URLS/ID
app.get("/urls/:id", (req, res) => {
  const {user_id} = req.session
  if (!users[user_id]) {
    return res.send("Please log in");
  }
  const url = getUrlById(req.params.id, urlDatabase)
  //url for this id does not exist
  if (!url) {
    return res.send('ID does not exist');
  }
  //user does not own this url
  if (url.userID !== user_id) {
    return res.send('You do not own this URL');
  }
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id]["longURL"], user: users[user_id]};
  res.render("urls_show", templateVars);
});

//EDIT
app.post('/urls/:id/edit', (req, res) => {
  const userInput = req.params.id;
  const newItems = req.body.main;
  const {user_id} = req.session
  if (!users[user_id]) {
    return res.send("Please log in");
  }
  const url = getUrlById(req.params.id, urlDatabase)
  //url for this id does not exist
  if (!url) {
    return res.send('ID does not exist');
  }
  //user does not own this url
  if (url.userID !== user_id) {
    return res.send('You do not own this URL');
  }
  urlDatabase[userInput]["longURL"] = newItems;
  res.redirect('/urls')
})

app.post("/urls", (req, res) => {
  const {user_id} = req.session
  if (!users[user_id]) {
    return res.send('User not Logged In');
  }
  const newRandom = generateRandomString();
  urlDatabase[newRandom] = {
    longURL: req.body.longURL,
    userID: user_id
  };
  res.redirect(`/urls/${newRandom}`);
});

//DELETE
app.post('/urls/:id/delete', (req, res) => {
  const userInput = req.params.id;
  const {user_id} = req.session
  if (!users[user_id]) {
    return res.send("Please log in");
  }
  const url = getUrlById(req.params.id, urlDatabase)
  //url for this id does not exist
  if (!url) {
    return res.send('ID does not exist');
  }
  //user does not own this url
  if (url.userID !== user_id) {
    return res.send('You do not own this URL');
  }
  delete urlDatabase[userInput]
  res.redirect('/urls')
})

//LOGOUT
app.post('/logout', (req, res) => {
  req.session.user_id = null
  res.redirect('/login')
})

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL;
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});