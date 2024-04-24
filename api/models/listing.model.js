import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    regularPrice:{
        type: Number,
        required: true,
    },
    discountPrice:{
        type: Number,
        required: true,
    },
    numberOfChairs:{
        type: Number,
        required: true,
    },
    furnished:{
        type: Boolean,
        required: true,
    },
    parking:{
        type: Boolean,
        required: true,
    },
    wifi:{
        type: Boolean,
        required: true,
    },
    generator:{
        type: Boolean,
        required: true,
    },
    cctv:{
        type: Boolean,
        required: true,
    },
    prayingArea:{
        type: Boolean,
        required: true,
    },
    frontDeskService:{
        type: Boolean,
        required: true,
    },
    personalLocker:{
        type: Boolean,
        required: true,
    },
    printScan:{
        type: Boolean,
        required: true,
    },
    cafeteria:{
        type: Boolean,
        required: true,
    },
    gamingZone:{
        type: Boolean,
        required: true,
    },
    fullyAC:{
        type: Boolean,
        required: true,
    },
    conference:{
        type: Boolean,
        required: true,
    },
    restRoom:{
        type: Boolean,
        required: true,
    },
    rfidAccess:{
        type: Boolean,
        required: true,
    },
    gym:{
        type: Boolean,
        required: true,
    },
    water:{
        type: Boolean,
        required: true,
    },
    complimentaryTea:{
        type: Boolean,
        required: true,
    },
    security:{
        type: Boolean,
        required: true,
    },
    type:{
        type: String,
        required: true,
    },
    area:{
        type: String,
        required: true,
    },
    offer:{
        type: Boolean,
        required: true,
    },
    imageUrls:{
        type: Array,
        required: true,
    },
    timeIntervalType:{
        type: String,
        required: true,
    },
    userRef:{
        type: String,
        required: true,
    },
    // reviews should be here but it's not working at the moment
    reviews: [{ 
        type: mongoose.Types.ObjectId, 
        ref: "Review" }],
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
}, {timestamps: true});

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;