require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

const User = require("./models/user.model");
const Note = require("./models/note.model");

const express = require("express");
const cors = require("cors");

const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.use(express.json());
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName) {
    return res
      .status(400)
      .send({ error: true, message: "Full Name is required" });
  }
  if (!email) {
    return res.status(400).send({ error: true, message: "Email is required" });
  }
  if (!password) {
    return res
      .status(400)
      .send({ error: true, message: "Password is required" });
  }

  const isUserExists = await User.findOne({ email: email });
  if (isUserExists) {
    return res.json({ error: true, message: "User already exists" });
  }

  const user = new User({ fullName, email, password });
  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "36000m",
  });

  return res.json({
    error: false,
    user,
    accessToken,
    message: "User created successfully",
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).send({ error: true, message: "Email is required" });
  }
  if (!password) {
    return res
      .status(400)
      .send({ error: true, message: "Password is required" });
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).send({ error: true, message: "User not found" });
  }
  if (user.password === password && user.email === email) {
    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "36000m",
    });
    return res.json({
      error: false,
      email: user.email,
      accessToken,
      message: "Login in successfully",
    });
  } else {
    return res
      .status(400)
      .send({ error: true, message: "Invalid Credentials" });
  }
});

app.get("/get-user", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const userData = await User.findOne({ _id: user._id });
  if (!userData) {
    return res.sendStatus(401);
  }
  return res.json({
    user: {
      fullName: userData?.fullName,
      email: userData?.email,
      _id: userData?._id,
      createdAt: userData?.createdAt,
    },
    message: "",
  });
});

app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const { user } = req.user;
  if (!title) {
    return res.status(400).send({ error: true, message: "Title is required" });
  }
  if (!content) {
    return res
      .status(400)
      .send({ error: true, message: "Content is required" });
  }
  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: user._id,
    });
    await note.save();
    return res.json({ error: false, note, message: "Note added successfully" });
  } catch (err) {
    return res
      .status(500)
      .send({ error: true, message: "Internal Server Error" });
  }
});

app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const { title, content, tags, isPinned = false } = req.body;
  const { user } = req.user;
  const { noteId } = req.params;
  if (!title && !content && !tags) {
    return res
      .status(400)
      .send({ error: true, message: "No Changes Provided" });
  }

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(404).send({ error: true, message: "Note not found" });
    }
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned) note.isPinned = isPinned;
    await note.save();
    return res.json({
      error: false,
      note,
      message: "Note Updated Successfully",
    });
  } catch (err) {
    return res
      .status(500)
      .send({ error: true, message: "Internal Server Error" });
  }
});

app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const { noteId } = req.params;
  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(404).send({ error: true, message: "Note not found" });
    }
    await Note.deleteOne({ _id: noteId });
    return res.json({ error: false, message: "Note Deleted Successfully" });
  } catch (err) {
    return res
      .status(500)
      .send({ error: true, message: "Internal Server Error" });
  }
});

app.get("/get-all-notes", authenticateToken, async (req, res) => {
  const { user } = req.user;
  try {
    const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
    return res.json({
      error: false,
      notes,
      message: "Notes Fetched Successfully",
    });
  } catch (err) {
    return res
      .status(500)
      .send({ error: true, message: "Internal Server Error" });
  }
});

app.put("/pin-note/:noteId", authenticateToken, async (req, res) => {
  const { isPinned = false } = req.body;
  const { user } = req.user;
  const { noteId } = req.params;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(404).send({ error: true, message: "Note not found" });
    }
    note.isPinned = isPinned;
    await note.save();
    return res.json({
      error: false,
      note,
      message: "Note Pinned Successfully",
    });
  } catch (err) {
    return res
      .status(500)
      .send({ error: true, message: "Internal Server Error" });
  }
});

app.get("/search-notes", authenticateToken, async (req, res) => {
  const { query } = req.query;
  const { user } = req.user;
  if (!query) {
    return res
      .status(400)
      .send({ error: true, message: "Search Query is required" });
  }
  try {
    const notes = await Note.find({
      userId: user._id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });
    return res.json({
      error: false,
      notes,
      message: "Notes matching the query fetched successfully",
    });
  } catch (err) {
    return res
      .status(500)
      .send({ error: true, message: "Internal Server Error" });
  }
});

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server Running on Port ${process.env.PORT}`)
);

module.exports = app;
