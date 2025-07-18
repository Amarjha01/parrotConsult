import express from "express";
import cors from "cors";
import cookieparser from "cookie-parser";

const app = express();

app.use(
  express.json({
    limit: "20mb",
  })
);

app.use(cookieparser());

app.use(
  cors({
    credentials: true,
    origin: [process.env.CORS_ORIGIN || 'http://localhost:5173' , 'https://parrotconsult.com'],
  })
);

// console.log("CORS_ORIGIN:", process.env.CORS_ORIGIN);

// app.use(express.static('public'));

app.use(
  express.urlencoded({
    extended: true,
    limit: "20mb",
  })
);

/// importing routes

import ConsultantRouter from "./routes/consultant.Routes.js";
import AdminRouter from "./routes/Admin.Routes.js";
import GlobalRouter from "./routes/Global.Routes.js";
import userRouter from "./routes/User.Routes.js";
import { PaymentRouter } from "./routes/Payment.Routes.js";
import bookingRouter from "./routes/Booking.Routes.js";
import webhookrouter from "./routes/Webhook.Routes.js";
import openaiRoute from "./routes/OpenAi.routes.js";
import assistantRoute from "./routes/assistant.Routes.js";
// import authOtpRouter from "./routes/AuthOtp.routes.js";
import otpRoutes from "./routes/AuthOtp.routes.js";


// using routes
app.use("/api/v1/consultant", ConsultantRouter);
app.use("/api/v1/admin", AdminRouter);
app.use("/api/v1/global", GlobalRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/payment", PaymentRouter);
app.use("/api/v1/booking", bookingRouter);
app.use("/api/v1/webhook", webhookrouter);
app.use("/api/v1/openai", openaiRoute);
app.use("/api/v1/assistant", assistantRoute);
app.use("/api/v1/auth", otpRoutes);
// console.log("✅ Assistant route mounted at /api/v1/assistant");

export default app;
