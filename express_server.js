const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
const PORT = 8080; 
app.use(cookieParser())

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

function generateRandomString() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}

//verify if email exist in users
function getUserByEmail(account) {
  for (let userId in users) {
    if (users[userId].email === account) {
      return users[userId]; 
    }
  }
  return null; 
}

//verify if id exist in object urlDatabase
function getUrlById(urlID) {
  urls = Object.keys(urlDatabase)
  for (const item of urls) {
    if (item === urlID) {
      return urlDatabase[item];
    }
  }
  return null; 
}

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
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
  user1: {
    id: "user1",
    email: "bazakovd@gmail.com",
    password: "yy",
  },
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const {user_id} = req.cookies
  if (!users[user_id]) {
    return res.redirect("/login")
  }
  const templateVars = { urls: urlDatabase, user: users[user_id] };
  res.render("urls_index", templateVars);
});

app.get("/register", (req, res) => {
  const {user_id} = req.cookies
  if (users[user_id]) {
    return res.redirect("/urls")
  }
  const templateVars = { urls: urlDatabase, user: null };
  res.clearCookie("user_id")
  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  const {user_id} = req.cookies
  if (users[user_id]) {
    return res.redirect("/urls")
  }
  const templateVars = { urls: urlDatabase, user: null };
  res.clearCookie("user_id")
  res.render("login", templateVars);
});

app.get("/urls/new", (req, res) => {
  const {user_id} = req.cookies
  if (!users[user_id]) {
    return res.redirect("/login")
  }
  const templateVars = { urls: urlDatabase, user: users[user_id]};
  res.render("urls_new", templateVars);
});

app.post('/logout', (req, res) => {
  res.clearCookie("user_id")
  res.redirect('/login')
})

app.post('/urls/:id/delete', (req, res) => {
  const userInput = req.params.id;
  delete urlDatabase[userInput]
  res.redirect('/')
})

app.post('/urls/:id/edit', (req, res) => {
  const userInput = req.params.id;
  const newItems = req.body.main;
  urlDatabase[userInput] = newItems;
  res.redirect('/')
})

app.get("/urls/:id", (req, res) => {
  const {user_id} = req.cookies
  if (!users[user_id]) {
    return res.redirect("/login")
  }
  if (getUrlById(req.params.id) === null) {
    res.set('Content-Type', 'text/html');
    return res.send(Buffer.from('<h2>ID does not exist</h2>'));
  }
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], user: users[user_id]};
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const {user_id} = req.cookies
  if (!users[user_id]) {
    //return hmtl message
    res.set('Content-Type', 'text/html');
    return res.send(Buffer.from('<h2>User not Logged In</h2>'));
  }
  const newRandom = generateRandomString();
  urlDatabase[newRandom] = req.body.longURL;
  res.redirect(`/urls/${newRandom}`);
});

app.post('/login', (req, res) => {
  const email = req.body.email.trim()
  const password = req.body.password.trim()
  const profile = getUserByEmail(email)
  //if email or password empty
  if (email === "" || password === "") {
    res.status(400).send('Email and Password can not be empty');
    //if email does not exist
  } else if (profile === null) {
    res.status(403).send('Email cannot be found');
  } else {
    //User exist
    // check if password matches
    if (password !== profile.password) {
      res.status(403).send('Wrong Password')
    } else {
      res.cookie("user_id ", profile.id)
      res.redirect(`/urls`);
    }
  }
})

app.post("/register", (req, res) => {
  const newRandom = generateRandomString();
  const email = req.body.email.trim()
  const password = req.body.password.trim()
  //if email or password empty
  if (email === "" || password === "") {
    res.status(400).send('Email and Password can not be empty');
    //if email exist already
  } else if (getUserByEmail(email) !== null) {
    res.status(400).send('This email us currently used');
  } else {
    users[newRandom] = {
      id: newRandom,
      email: email,
      password: password
    }
    res.cookie("user_id ", newRandom)
    res.redirect(`/urls`);
  }
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});