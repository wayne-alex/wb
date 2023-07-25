const express = require('express');
const app = express();
const port = 3000;
const api = require('./app.js');

// Middleware to parse the request body as JSON
app.use(express.json());

// Define an endpoint to trigger the function
app.get('/trigger-function', (req, res) => {
  const verificationCode = Math.floor(100000 + Math.random() * 900000);

  // Assuming you want to send the verification code to a specific phone number=
  const phoneNumber = req.query.phone_number;

  // Call the sendVerificationCode function with the phone number and verification code
  
  api.sendVerificationCode(phoneNumber, verificationCode);
  console.log(phoneNumber)

  res.send('Message successfully sent. Verification code is: ' + verificationCode);
});

// Start the server
app.listen(port, () => {
  console.log(`Node.js app listening at http://localhost:${port}`);
});



