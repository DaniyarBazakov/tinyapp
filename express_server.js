const express = require("express");
const app = express();
const PORT = 8080; 

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

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
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
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post('/login', (req, res) => {
  res.cookie("username", req.body.username)
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
  res.redirect('/')
})

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const newRandom = generateRandomString();
  urlDatabase[newRandom] = req.body.longURL;
  res.redirect(`/urls/${newRandom}`);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});