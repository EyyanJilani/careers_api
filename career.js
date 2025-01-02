const express = require("express");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
const port = 4001;
const cors = require("cors");
app.use(cors());

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'joeegbert3@gmail.com',
    pass: 'agbk vpge vamm gbld',
  },
});

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API to handle contact form submission
app.post("/api/apply", async (req, res) => {
  const { name, email, contact, position, fileUrl } = req.body;
  console.log(req.body,"==")
  if (!name || !email || !contact || !position || !fileUrl) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Convert `fileUrl` to a local file path
    const localFilePath = decodeURIComponent(fileUrl.replace("file:///", ""));
    if (!fs.existsSync(localFilePath)) {
      return res.status(400).json({ error: "Local file not found." });
    }

    const mailOptions = {
      from: email,
      to: ["ayyancatalyst@gmail.com"], // Multiple recipients
      subject: "New Contact Form Submission",
      text: `You have a new contact form submission from ${name} (${contact}):\n\nEmail: ${email}\nposition: ${position}`,
      attachments: [
        {
          path: localFilePath,
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: "Error sending email. Please try again later." });
      }
      res.status(200).json({ message: "Contact form submitted successfully!" });
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
