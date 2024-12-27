const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Like and Subscribe");
});

app.post("/", async (req, res) => {
  const { template, phoneNumbers } = req.body;

  if (!template || !phoneNumbers || !Array.isArray(phoneNumbers)) {
    return res
      .status(400)
      .json({ error: "Template and phone numbers are required" });
  }

  try {
    // Send message to each phone number
    const responses = await Promise.all(
      phoneNumbers.map((number) => sendMessage(template, number))
    );
    res.status(200).json({
      message: "Messages sent successfully to all recipients",
      data: responses.map((response) => response.data),
    });
  } catch (error) {
    console.error("Error sending messages:", error);
    res.status(500).json({ error: "Failed to send messages" });
  }
});

async function sendMessage(template, to) {
  try {
    const response = await axios({
      url: `https://graph.facebook.com/${process.env.API_VERSION}/${process.env.BUSINESS_PHONE_NUMBER_ID}/messages`,
      method: "POST",
      headers: {
        Authorization: "Bearer " + process.env.WHATSAPP_TOKEN,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        messaging_product: "whatsapp",
        to: to,
        type: "template",
        template: {
          name: template.name,
          language: {
            code: template.language || "en_US",
          },
        },
      }),
    });
    return response;
  } catch (error) {
    console.error(
      "Error sending message:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
