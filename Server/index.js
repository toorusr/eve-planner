
// Server v0.0.16
// branch : backend
// person in charge: toorusr (MAX)


const port = 3002   // Server Port :)

// import modules express, hashid and body parser
const express = require('express');
const bodyparser = require('body-parser');
const hashid = require('hashids');
const util = require('util');
const database = require('mongodb').MongoClient;
const datab = util.promisify(database.connect)
// creates constant app
const app = express();
let db
let usercollection
const start = async () => {
  // connect to database
  db = await datab.connect('mongodb://localhost:27017')
  usercollection = db.collection('user')
  // check if table exists and create one if not
  app.listen(port, function () {
      console.log(`Example app listening on port ${port}!`)
  })
}

/// DATABASE
// new databaseClient

// database query function
class DatabaseRoutings {
  static async post (name, email, username, password, profileImg) {
    const res = await databaseClient.query('')
  }
}
/// DATABASE END

// use constant bodyparser (in json) in  express app
app.use(bodyparser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// create class user and sets parameters using constructor
class User {
  constructor(data) {
    this.name = data.name;
    this.email = data.email;
    this.username = data.username;
    this.password = data.password;
    this.profileImg = data.profileImg;
    // Random Id generator

    const genedId = new hashid(new Date(), 16)
    this.id = genedId.encodeHex(1984^4 + Math.random());
  }
}
// User Array, saved in json
const users = [
  {
    id: "47dzw6d",
    name: "hallifax",
    email: "test@example.com",
    password: "FDDHCDKJADKJAHSKJHSAX",
    profileImg: "img/profilepic_hallifax.jpg"
  },
  {
    id: "ewgweg",
    name: "hallifax",
    email: "test@example.com",
    password: "FDDHCDKJADKJAHSKJHSAX",
    profileImg: "img/profilepic_hallifax.jpg"
  },
  {
    id: "47dewhewgzw6d",
    name: "testuser",
    email: "test@example.com",
    password: "FDDHCDKJADKJAHSKJHSAX",
    profileImg: "img/profilepic_hallifax.jpg"
  }
];

// gives user data back (json formaf)
app.get('/user', function (req, res) {
  // sends response in json format
  // console.log(usercollection.find({}));
  usercollection.find({}).toArray((err, docs) => {
    res.json(docs)
  });
})
// gets back specific user by id
app.get('/user/:id', (req, res) => {
  // transfers :id to constant userId
  const userId = req.params.id;
  // find user by user id in user array
  const foundUser = users.find(user => user.id === userId);
  // if a user has been found -> gives back user not psw
  if (foundUser) {
    res.json({
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      username: foundUser.username,
      profileImg: foundUser.profileImg
    });
  } else {
    // else send "Not found"
    res.send(404);
  }

});



// new user
app.post('/user', function (req, res) {
  console.log(req.body)
  // -- res.send(req.body)
  // if something in requests body
  if (req.body) {
    const tmpUsr = new User(req.body)
    usercollection.insert(req.body)
    res.json(tmpUsr)
  } else {
    res.send(400) // bad request
  }
})

app.post('/login', function (req, res) {
  console.log(req.body)
  // if something in requests body
  if (req.body.username) {
    usercollection.find({username:req.body.username}).limit(1).next((err, docs) => {
      if (docs) {
        console.log(docs);
        console.log(`1PSW: ${docs.password} === ${req.body.password}`);
        console.log(`2USR: ${docs.username} === ${req.body.username}`);
        if (docs.password === req.body.password) {
          res.sendStatus(202) // Accepted
        } else {
          res.sendStatus(401)} // Unautorized
      } else {
        res.sendStatus(400)} // bad request
    })
  }
})

app.put('/user/:id', function (req, res) {
  console.log(":: PUT User")
  // create constant for req.params.id and req.body
  const userId = req.params.id
  const userObj = req.body
  console.log(userObj);
  // check if something in body
  if (userObj) {
    // get index of user in array
    const foundIndex = users.findIndex(user => user.id === userId);
    // check if userIndex in Array
    console.log(`:: PUT : INDEX OF USER ${foundIndex}`);
    if (foundIndex > -1) {
      // creates array with properties
      const allowedProperties = ['name', 'email', 'profileImg', 'password'];
      // index through propertys of allowedProperties
      for(let property of allowedProperties) {
        // check if the property of allowedProperties in req.body
        if(req.body.hasOwnProperty(property)) {
          console.log("hasOwnProperty");
          // changes the users properties with the property in  the request body
          users[foundIndex][property] = req.body[property];
          console.log(req.body[property]);
          console.log(users[foundIndex][property]);
          res.send(`Property ${property} of user ${users[foundIndex].id} changed to ${req.body[property]}`)

        }
      }
    } else {
      res.sendStatus(404) // not found
    }
  } else {
    res.sendStatus(400) // bad request
  }
})

app.delete('/user/:id', function (req, res) {

  const userId = req.params.id;
  const foundIndex = users.findIndex(user => user.id === userId);

  if (foundIndex > -1) {
    users.splice(foundIndex, 1);
    res.send('User was deleted!');
  } else {
    res.send('User not found / could not be deleted');
  }

})
app.get('/', (req, res) => {
  res.sendStatus(200)
})

start()
