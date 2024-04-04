import express from 'express'
import { leaveReview, getReview } from '../controllers/review.controller.js';

const router = express.Router();

router.post("/create", leaveReview);
router.get("/listing/:listingId", getReview);

export default router;