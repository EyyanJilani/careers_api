// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const nodemailer = require('nodemailer');
// const cors = require("cors");
// const port = 4002;
// // Initialize the app
// const app = express();
// app.use(cors());

// // Set up middleware to parse incoming JSON data
// app.use(express.json());

// // Set up multer storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');  // Store files in the 'uploads' directory
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));  // Set unique filename
//   }
// });

// const upload = multer({ storage: storage });

// // Create the POST API to accept form data with a file
// app.post('/submit', upload.single('fileUrl'), async (req, res) => {
//   const { name, email, contact, position } = req.body;

//   // Check if all required fields are present
//   if (!name || !email || !contact || !position || !req.file) {
//     return res.status(400).json({ message: 'All fields are required' });
//   }

//   // Set up Nodemailer transport with Gmail SMTP
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'joeegbert3@gmail.com',  // Replace with your Gmail address
//       pass: 'agbk vpge vamm gbld',   // Replace with your Gmail password or App Password
//     },
//   });
//   console.log(name,'name')
//   // Prepare the email content
//   const mailOptions = {
//     from: 'joeegbert3@gmail.com',
//     to: 'ayyancatalyst@gmail.com',  // Replace with recipient email (e.g., your business email)
//     subject: 'New Form Submission',
//     text: `New form submission from:

//       Name: ${name}
//       Email: ${email}
//       Contact: ${contact}
//       Position: ${position}

//       Please find the attached file.`,
//     attachments: [
//       {
//         filename: req.file.filename,
//         path: req.file.path,  // Attach the uploaded file
//       },
//     ],
//   };

//   // Send the email
//   try {
//     await transporter.sendMail(mailOptions);
//     res.status(200).json({
//       message: 'Form submitted successfully, and email sent!',
//       data: {
//         name,
//         email,
//         contact,
//         position,
//         fileUrl: req.file.path,  // Path of the uploaded file
//       },
//     });
//   } catch (error) {
//     console.error('Error sending email:', error);
//     res.status(500).json({ message: 'Error sending email', error: error.message });
//   }
// });

// // Start the server on port 3000
// app.listen({port}, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

const express = require("express");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const nodemailer = require("nodemailer");
const cors = require("cors");
const port = 4002;

// Initialize the app
const app = express();
app.use(cors());
app.use(express.json());

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dsyvaf6ix", // Replace with your Cloudinary cloud name
  api_key: "762535634137472", // Replace with your Cloudinary API key
  api_secret: "7Qu7hJEio4FiPav5n3O1oI0XE4A", // Replace with your Cloudinary API secret
});

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Cloudinary folder to store files
    allowed_formats: ["jpg", "png", "pdf", "doc", "docx"], // Specify allowed file formats
  },
});

const upload = multer({ storage });

// Create the POST API to accept form data with a file
app.post("/submit", upload.single("fileUrl"), async (req, res) => {
  const { name, email, contact, position } = req.body;

  // Check if all required fields are present
  if (!name || !email || !contact || !position || !req.file) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Set up Nodemailer transport with Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "joeegbert3@gmail.com", // Replace with your Gmail address
      pass: "agbk vpge vamm gbld", // Replace with your Gmail App Password
    },
  });

  // Prepare the email content
  const mailOptions = {
    from: "joeegbert3@gmail.com",
    to: "ayyancatalyst@gmail.com", // Replace with recipient email
    subject: "New Form Submission",
    text: `New form submission from:

      Name: ${name}
      Email: ${email}
      Contact: ${contact}
      Position: ${position}
      
      File URL: ${req.file.path}`,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      message: "Form submitted successfully, and email sent!",
      data: {
        name,
        email,
        contact,
        position,
        fileUrl: req.file.path, // URL of the uploaded file on Cloudinary
      },
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({ message: "Error sending email", error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
