require("dotenv").config();
const express = require("express");
const app = express();
const hostname = "127.0.0.1";
require("./db/conn");
const port = process.env.PORT;
const path = require("path");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const auth = require("./middleware/auth");
const Register = require("./models/register");
const Contact = require("./models/message");
const blogs = require("./models/blogs");
const uploadImage = require("./models/uploadImage");
const route = require("./router/route");

// For serving static files
app.use("/static", express.static("./static"));

// set the template engine as pug
app.set("view engine", "pug");

// set the views directory
app.set("views", path.join(__dirname, "views"));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const imageData = uploadImage.find({});

const Storage = multer.diskStorage({
  destination: "./static/uploads",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: Storage,
}).single("image");

app.get("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((currElement) => {
      return currElement.token !== req.token;
    });
    req.user.tokens = [];
    res.clearCookie("jwt");
    await req.user.save();
    res.render("login");
    console.log("logout sussessfully");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/userData/:username", auth, (req, res) => {
  const title = "userData";
  const username = req.params.username;
  const del = Register.findOne({ username });
  del.exec((err, data) => {
    if (err) throw err;
    console.log(data);
    res.status(200).render("userData", { data, title });
  });

  // res.status(200).render("userData", { success: "", title });
});

app.get("/", async (req, res) => {
  const title = "username" ;
  const username = req.body.username;
  const userData = await Register.findOne({ username: username })
  res.status(200).render("home", { success: "",title });
});

app.get("/login",(req, res) => {
  const title = "Login";
  res.status(200).render("login", { success: "", title });
});

app.get("/signUp", (req, res) => {
  const success = { success: "" };
  const title = "Signup";
  res.status(200).render("signUp", { success: "", title });
});

app.get("/contact",  auth,(req, res) => {
  const success = { success: "" };
  res.status(200).render("contact", success);
});

app.get("/blogpost",  auth,(req, res) => {
  res.status(200).render("blogpost");
});

app.post("/login", async (req, res) => {
  const err = { error: "user not login" };
  try {
    const username = req.body.username;
    const password = req.body.password;
    const title = username;
    const userData = await Register.findOne({ username: username });
    const isMatch = await bcrypt.compare(password, userData.password);
    const token = await userData.generateAuthToken();
    console.log(userData);
    const imageData = userData.image;
    res.cookie("jwt", token, {
      // expires: new Date(date.now() + 90000),
      httpOnly: true, // secure: true
    });
    if (isMatch) {
      res
        .status(200)
        .render("home", { success: "user login", imageData, username, title });
    } else {
      res.status(200).render("login", err);
    }
  } catch (error) {
    res.status(200).render("login", err);
    console.log(error);
  }
});

app.post("/signUp", upload, async (req, res) => {
  const success = { success: ` user Successfully Registered` };
  const err = { error: "User Not Registered" };
  const passerr = { passerr: "password not match" };
  try {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const comfirm = req.body.comfirm;
    const imageFile = req.file.filename;
    if (password === comfirm) {
      const registerUser = new Register({
        email: email,
        username: username,
        password: password,
        comfirm: comfirm,
        image: imageFile,
      });
      const token = await registerUser.generateAuthToken();
      res.cookie("jwt", token, { httpOnly: true });
      await registerUser.save();
      res.status(200).render("signUp", success);
      console.log("user Successfully Registered");
    } else {
      res.status(400).render("signUp", passerr);
      console.log(passerr);
    }
  } catch (error) {
    res.status(400).render("signUp", err);
    console.log(error);
  }
});

app.post("/contact",auth,(req, res) => {
  const success = { success: "Message successfully send" };
  const err = { error: "Bad Request message not send" };
  const myData = new Contact(req.body);
  myData
    .save()
    .then(() => {
      res.render("contact", success);
    })
    .catch((error) => {
      res.status(400).render("contact", err);
      console.log(error);
    });
});

const blogdata = blogs.find({});
app.get("/blog", (req, res) => {
  blogdata.exec((err, data) => {
    if (err) throw err;
    res.status(200).render("blog", { blogdata: data });
  });
});

app.post("/blogpost", auth, (req, res) => {
  const success = { success: "Message successfully send" };
  const err = { error: "Bad Request message not send" };
  const myData = new blogs(req.body);
  myData
    .save()
    .then(() => {
      res.render("blogpost", success);
    })
    .catch((error) => {
      res.status(400).render("blogpost", err);
      console.log(error);
    });
});

app.get("/blogPage/:slug",auth,  (req, res) => {
  // const blogdata = blogs.findOne({content:content});
  // myBlog = blogs.filter((e) => {
  //   return e.slug == req.params.slug
  // })
  // res.status(200).render("blogPage", { title: data[0].title, content: data[0].content });
  const slug = req.params.slug;
  const del = blogs.findOne({ slug });
  del.exec((err, data) => {
    if (err) throw err;
    const cont = data.content;
    console.log(data);
    console.log(cont);
    res.status(200).render("blogPage", { data });
  });
});

app.get("/userImage", auth, (req, res) => {
  const success = "";
  imageData.exec((error, data) => {
    if (error) throw error;
    res.status(200).render("userImage", { Data: data, success });
  });
});

app.post("/userImage", upload,auth, async (req, res) => {
  const success = `${req.file.filename} uploaded Successfully `;
  const imageFile = req.file.filename;
  try {
    const registerimg = new uploadImage({
      image: imageFile,
    });
    await registerimg.save();
    imageData.exec((error, data) => {
      if (error) throw error;
      const Data = data;
      res.status(200).render("userImage", { Data, success });
    });
  } catch (error) {
    res.status(400).render("userImage", err);
    console.log(error, err);
  }
});

app.get("*", auth, (req, res) => {
  res.status(404).render("notFound");
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
