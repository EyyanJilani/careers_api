// const express = require("express");
// const nodemailer = require("nodemailer");
// const fs = require("fs");
// const path = require("path");
// require("dotenv").config();

// const app = express();
const port = 4001;
// const cors = require("cors");
// app.use(cors());

// // Nodemailer transporter setup
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: 'joeegbert3@gmail.com',
//     pass: 'agbk vpge vamm gbld',
//   },
// });

// // Middleware to parse JSON
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // API to handle contact form submission
// app.post("/api/apply", async (req, res) => {
//   const { name, email, contact, position, fileUrl } = req.body;
//   console.log(req.body,"==")
//   if (!name || !email || !contact || !position || !fileUrl) {
//     return res.status(400).json({ error: "All fields are required." });
//   }

//   try {
//     // Convert `fileUrl` to a local file path
//     const localFilePath = decodeURIComponent(fileUrl.replace("file:///", ""));
//     if (!fs.existsSync(localFilePath)) {
//       return res.status(400).json({ error: "Local file not found." });
//     }

//     const mailOptions = {
//       from: email,
//       to: ["ayyancatalyst@gmail.com"], // Multiple recipients
//       subject: "New Contact Form Submission",
//       text: `You have a new contact form submission from ${name} (${contact}):\n\nEmail: ${email}\nposition: ${position}`,
//       attachments: [
//         {
//           path: localFilePath,
//         },
//       ],
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error("Error sending email:", error);
//         return res.status(500).json({ error: "Error sending email. Please try again later." });
//       }
//       res.status(200).json({ message: "Contact form submitted successfully!" });
//     });
//   } catch (error) {
//     console.error("Error processing request:", error);
//     return res.status(500).json({ error: "Internal server error." });
//   }
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}/`);
// });



const express = require('express');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
const cors = require("cors");
// Initialize the app
const app = express();
app.use(cors());

// Set up middleware to parse incoming JSON data
app.use(express.json());

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Store files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Set unique filename
  }
});

const upload = multer({ storage: storage });

// Create the POST API to accept form data with a file
app.post('/submit', upload.single('fileUrl'), async (req, res) => {
  const { name, email, contact, position } = req.body;

  // Check if all required fields are present
  if (!name || !email || !contact || !position || !req.file) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Set up Nodemailer transport with Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'joeegbert3@gmail.com',  // Replace with your Gmail address
      pass: 'agbk vpge vamm gbld',   // Replace with your Gmail password or App Password
    },
  });
  console.log(name,'name')
  // Prepare the email content
  const mailOptions = {
    from: 'joeegbert3@gmail.com',
    to: 'ayyancatalyst@gmail.com',  // Replace with recipient email (e.g., your business email)
    subject: 'New Form Submission',
    text: `New form submission from:

      Name: ${name}
      Email: ${email}
      Contact: ${contact}
      Position: ${position}
      
      Please find the attached file.`,
    attachments: [
      {
        filename: req.file.filename,
        path: req.file.path,  // Attach the uploaded file
      },
    ],
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      message: 'Form submitted successfully, and email sent!',
      data: {
        name,
        email,
        contact,
        position,
        fileUrl: req.file.path,  // Path of the uploaded file
      },
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email', error: error.message });
  }
});

// Start the server on port 3000
app.listen({port}, () => {
  console.log(`Server is running on http://localhost${port}`);
});
