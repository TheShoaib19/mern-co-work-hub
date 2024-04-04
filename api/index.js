import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
import listingRouter from './routes/listing.route.js'
import contactRouter from './routes/contact.route.js'
import cookieParser from "cookie-parser";

dotenv.config();

mongoose.connect(process.env.MONGO)
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch(() => {
            console.log(err);
        });

const app = express();

app.use(express.json()); //Allow the json as the input of the server

app.use(cookieParser());

app.listen(3000, () => {
    console.log("Server is running to port 3000!");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
app.use("/api/contact", contactRouter);


// err is the error we have set, req is the request from the client, res is the response from server 
// and next is to go to the next middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});