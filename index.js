import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import africastalking from "africastalking";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const at = africastalking({
  apiKey: process.env.AFRICASTALKING_API_KEY,
  username: process.env.AFRICASTALKING_USERNAME,
});
const sms = at.SMS;

// Send SMS endpoint
app.post("/send-sms", async (req, res) => {
  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).json({
      success: false,
      message: "Phone number and message are required",
    });
  }

  try {
    const result = await sms.send({
      to,
      message,
      from: "",
    });

    res.json({ success: true, result });
  } catch (error) {
    console.error("SMS error:", error);
    res.status(500).json({ success: false, message: "Failed to send SMS" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`✅ SMS server running on port ${process.env.PORT}`);
});
