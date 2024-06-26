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

function getUserByEmail(account) {
  for (let userId in users) {
    if (users[userId].email === account) {
      return users[userId]; 
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
    return res.redirect("/register")
  }
  const templateVars = { urls: urlDatabase, user: users[user_id] };
  res.render("urls_index", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = { urls: urlDatabase, user: null };
  res.clearCookie("user_id")
  res.render("register", templateVars);
});

app.get("/urls/new", (req, res) => {
  const {user_id} = req.cookies
  if (!users[user_id]) {
    return res.redirect("/register")
  }
  const templateVars = { urls: urlDatabase, user: users[user_id]};
  res.render("urls_new", templateVars);
});

app.post('/login', (req, res) => {
  res.cookie("username", req.body.username)
  res.redirect('/urls')
})

app.post('/logout', (req, res) => {
  res.clearCookie("user_id")
  res.redirect('/urls')
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
  res.cookie("username", req.body.username)
  res.redirect('/')
})

app.get("/urls/:id", (req, res) => {
  const {user_id} = req.cookies
  if (!users[user_id]) {
    return res.redirect("/register")
  }
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], user: users[user_id]};
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const newRandom = generateRandomString();
  urlDatabase[newRandom] = req.body.longURL;
  res.redirect(`/urls/${newRandom}`);
});

app.post("/register", (req, res) => {
  const newRandom = generateRandomString();
  const email = req.body.email
  const password = req.body.password
  if (email === "" || password === "") {
    res.status(400).send('Email and Password can not be empty');
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