import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'

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

app.listen(3000, () => {
    console.log("Server is running to port 3000!");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);