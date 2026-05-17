const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= MONGODB CONNECTION =================
// Compass local DB
const MONGO_URI =  "mongodb://127.0.0.1:27017/outpro";

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("Mongo Error ❌", err));

// ================= SCHEMA =================
const UserSchema = new mongoose.Schema({
  email: String,
  password: String
});

const ContactSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  company: String,
  service: String,
  message: String,
  budget: String
});

const User = mongoose.model("User", UserSchema);
const Contact = mongoose.model("Contact", ContactSchema);

// ================= ROUTES =================

// test route
app.get("/", (req, res) => {
  res.send("API working with MongoDB 🚀");
});

// login (check + save if not exists)
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email, password });
      await user.save();
      return res.json({ message: "User created & login success ✅" });
    }

    if (user.password === password) {
      return res.json({ message: "Login success ✅" });
    } else {
      return res.status(401).json({ message: "Wrong password ❌" });
    }

  } catch (err) {
    res.status(500).json({ message: "Server error ❌" });
  }
});

// contact form (SAVE TO DB)
app.post("/contact", async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();

    res.json({ message: "Data saved to MongoDB ✅" });
  } catch (err) {
    res.status(500).json({ message: "Error saving data ❌" });
  }
});

// ================= SERVER =================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
