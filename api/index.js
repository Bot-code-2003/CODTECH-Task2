import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import User from "./models/User.js";
import Post from "./models/Post.js";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import cookieParser from "cookie-parser";

//Initializations
const app = express();
const salt = bcrypt.genSaltSync(10);
const secret = "secret";

//Middlewares
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());

//Db connect
mongoose.connect(REACT_APP_MONGO_URL);

////////////////////////
///// Get requests///////
///////////////////////

app.get("/test", (req, res) => {
  res.json("Test ok");
});

/*
The data from here is used in nav bar first, there the info is set to userinfo that further gets assigned 
to userContext and them be able to access all arround the project
*/
app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jsonwebtoken.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.get("/post", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (e) {
    console.log("error fetching posts");
  }
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id);
  res.json(postDoc);
});
////////////////////////
/////Post requests///////
///////////////////////

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    // console.log("userDoc: " + userDoc);
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
    // res.status(400).json(e.errorResponse.errmsg);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.findOne({ username });
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      //Logged in
      jsonwebtoken.sign(
        { username, id: userDoc._id },
        secret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json({
            id: userDoc._id,
            username,
          });
        }
      );
    } else {
      res.status(400).json("Wrong creds");
    }
  } catch (error) {
    res.status(400).json("Error");
  }
});

app.post("/post", async (req, res) => {
  try {
    const { title, content, username, likes } = req.body;
    const postDoc = await Post.create({
      title,
      content,
      username,
      likes,
    });
    res.json(postDoc);
  } catch (e) {
    console.log("Error serevr side");
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("Logged out");
});

////////////////////////
/////Patch requests///////
///////////////////////
app.patch("/post/:id", async (req, res) => {
  const { id } = req.params; // id is post id
  const { title, content } = req.body;
  try {
    // Find the post by ID
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    post.title = title;
    post.content = content;

    await post.save();
    res.json(post);
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.patch("/post/:id/like", async (req, res) => {
  const { id } = req.params;
  const { increment } = req.body;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    post.likes += increment ? 1 : -1;

    await post.save();
    res.json({ likes: post.likes });
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

////////////////////////
/////Delete requests///////
///////////////////////
app.delete("/post/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res
      .status(500)
      .json({ error: "Server side error", message: error.message });
  }
});

app.listen(4000);
