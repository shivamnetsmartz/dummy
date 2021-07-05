const bodyParser = require("body-parser");
const express = require("express");
const cookieSession = require("cookie-session");
const user = require('./users.json')


const authenticateUser = require("./middleware/authenticateUser");

const fs = require("fs");
const path = require('path');

// / create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const app = express();

//this line is required to parse the request body
app.use(express.json());
// set the view engine to ejs
app.set('view engine', 'ejs');

// middlewares
app.use(express.urlencoded({ extened: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// cookie session
app.use(
  cookieSession({
    keys: ["randomStringASyoulikehjudfsajk"],
  })
);


 /* GET Signup */ 
 app.get('/signup', function(req, res) { 
    res.render('signup', { title: 'Signup Page',message: 'Hello there!' 
    }); 
}); 
// * GET Signup */ 
 app.get('/signin', function(req, res) { 
    res.render('signin', { title: 'Signin Page',message: 'Hello there!' 
    }); 
}); 





/* Create - POST method */
app.post("/user/add", urlencodedParser, (req, res) => {
  //get the existing user data
  const existUsers = getUserData();

  //get the new user data from post request
  const userData = req.body;

  if (
    userData.fullname == null ||
    userData.age == null ||
    userData.useremail == null ||
    userData.password == null
  ) {
    return res.status(401).send({ success: false, msg: "User data missing" });
  }

  //useremail exist already
  const findExist = existUsers.find(
    (user) => user.useremail === userData.useremail
  );
  if (findExist) {
    return res
      .status(409)
      .send({ success: false, msg: "useremail already exist" });
  }

  //append the user data
  existUsers.push(userData);

  //save the new user data
  saveUserData(existUsers);
  res.send({ success: true, msg: "User data added successfully" });
});

/* Read - GET method */
app.get("/user/list", (req, res) => {
  const users = getUserData();
  res.send(users);
});

                            /* Update - API*/


app.put("/user/update/:useremail", (req, res) => {
  //get the useremail from url
  const useremail = req.params.useremail;

  //get the update data
  const userData = req.body;

  //get the existing user data
  const existUsers = getUserData();

  //check if the useremail exist or not
  const findExist = existUsers.find((user) => user.useremail === useremail);
  if (!findExist) {
    return res.status(409).send({ error: true, msg: "useremail not exist" });
  }

  //filter the userdata
  const updateUser = existUsers.filter((user) => user.useremail !== useremail);

  //push the updated data
  updateUser.push(userData);

  //finally save it
  saveUserData(updateUser);

  res.send({ success: true, msg: "User data updated successfully" });

});

                                  /* Delete API */


app.delete("/user/delete/:useremail", (req, res) => {
  const useremail = req.params.useremail;

  //get the existing userdata
  const existUsers = getUserData();

  //filter the userdata to remove it
  const filterUser = existUsers.filter((user) => user.useremail !== useremail);

  if (existUsers.length === filterUser.length) {
    return res
      .status(409)
      .send({ error: true, msg: "useremail does not exist" });
  }

  //save the filtered data
  saveUserData(filterUser);

  res.send({ success: true, msg: "User removed successfully" });
});



 // login api
  app.post("/login", (req,res) =>{
    const useremail = req.body.useremail;
    const password = req.body.password;

    let = user.find({useremail: useremail}, (err, foundResults) =>{
      if(err) {
        console.log(err);
      }
      else{
        if(foundResults.password === password){
          res.send("You Logged In!")
        }
        else{
          res.send("Incorrect Email or Password.")
        }
      }
    })
  })

//read the user data from json file
const saveUserData = (data) => {
  const stringifyData = JSON.stringify(data);
  fs.writeFileSync("users.json", stringifyData);
};

//get the user data from json file
const getUserData = () => {
  const jsonData = fs.readFileSync("users.json");
  return JSON.parse(jsonData);
};

/* util functions ends */

//configure the server port
app.listen(9000, () => {
  console.log("Server runs on port 9000");
});
