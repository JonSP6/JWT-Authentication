require("dotenv").config();

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

const posts = [
  {
    username: "Kyle",
    title: "Post 1",
  },
  {
    username: "Jim",
    title: "Post 2",
  },
];

app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name));
});

//*Authenticate requests using JWT
app.post("/login", (req, res) => {
  //1. Authenticate User (Enter bcrypt authentication here)
  //For right now we'll skip the Authentication and focus on JWT functionality
  //2. Create JWT -> Once User has passed the authentication we then want to authenticate and serialize this User with JSON Web Tokens (JWT)
  const username = req.body.username;
  const user = { name: username };

  //.sign() takes our payload (what we want to serialize) in this case a user Object.
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

  // next we want the Server to return back to the Client the accessToken that was just created. Note: Remember the accessToken contains the User information saved inside of it.
  res.json({ accessToken: accessToken });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(3000, () => console.log("App listening at PORT 3000"));
