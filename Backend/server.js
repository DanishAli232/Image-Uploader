import express from "express";
import router from "./route.js";
import cors from "cors";
const app = express();
// const db = require('./config/db');

// Connect to MongoDB
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => console.log('Connected to MongoDB'));

// Middleware
app.use(express.json());
app.use(cors());
app.use("/createimage", router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
