import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        next(error)
    }
};

export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if(!listing){
        return next(errorHandler(404, 'Listing not found'));
    }
    if(req.user.id !== listing.userRef){
        return next(errorHandler(401, 'You can only delete your own listings!'));
    }
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json('Listing has been deleted');
    } catch (error) {
        next(error);
    }
};

export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if(!listing){
        return next(errorHandler(404, 'Listing not found'));
    }
    if(req.user.id !== listing.userRef){
        return next(errorHandler(401, 'You can only update your own listings!'));
    }
    try {
        const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedListing);
    } catch (error) {
        next(error);
    }
};

export const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if(!listing){
            return next(errorHandler(404, 'Listing not found'));
        }
        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
}

export const getListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;
        let offer = req.query.offer;

        if(offer === undefined || offer === 'false'){
            offer = { $in: [false, true]};
        }

        let furnished = req.query.furnished;
        if(furnished === undefined || furnished === 'false'){
            furnished = { $in: [false, true]};
        }
        
        let parking = req.query.parking;
        if(parking === undefined || parking === 'false'){
            parking = { $in: [false, true]};
        }

        let wifi = req.query.wifi;
        if(wifi === undefined || wifi === 'false'){
            wifi = { $in: [false, true]};
        }

        let generator = req.query.generator;
        if(generator === undefined || generator === 'false'){
            generator = { $in: [false, true]};
        }

        let cctv = req.query.cctv;
        if(cctv === undefined || cctv === 'false'){
            cctv = { $in: [false, true]};
        }

        let prayingArea = req.query.prayingArea;
        if(prayingArea === undefined || prayingArea === 'false'){
            prayingArea = { $in: [false, true]};
        }

        let frontDeskService = req.query.frontDeskService;
        if(frontDeskService === undefined || frontDeskService === 'false'){
            frontDeskService = { $in: [false, true]};
        }

        let personalLocker = req.query.personalLocker;
        if(personalLocker === undefined || personalLocker === 'false'){
            personalLocker = { $in: [false, true]};
        }

        let printScan = req.query.printScan;
        if(printScan === undefined || printScan === 'false'){
            printScan = { $in: [false, true]};
        }

        let cafeteria = req.query.cafeteria;
        if(cafeteria === undefined || cafeteria === 'false'){
            cafeteria = { $in: [false, true]};
        }

        let gamingZone = req.query.gamingZone;
        if(gamingZone === undefined || gamingZone === 'false'){
            gamingZone = { $in: [false, true]};
        }

        let fullyAC = req.query.fullyAC;
        if(fullyAC === undefined || fullyAC === 'false'){
            fullyAC = { $in: [false, true]};
        }

        let conference = req.query.conference;
        if(conference === undefined || conference === 'false'){
            conference = { $in: [false, true]};
        }

        let restRoom = req.query.restRoom;
        if(restRoom === undefined || restRoom === 'false'){
            restRoom = { $in: [false, true]};
        }

        let rfidAccess = req.query.rfidAccess;
        if(rfidAccess === undefined || rfidAccess === 'false'){
            rfidAccess = { $in: [false, true]};
        }

        let gym = req.query.gym;
        if(gym === undefined || gym === 'false'){
            gym = { $in: [false, true]};
        }

        let water = req.query.water;
        if(water === undefined || water === 'false'){
            water = { $in: [false, true]};
        }

        let complimentaryTea = req.query.complimentaryTea;
        if(complimentaryTea === undefined || complimentaryTea === 'false'){
            complimentaryTea = { $in: [false, true]};
        }

        let security = req.query.security;
        if(security === undefined || security === 'false'){
            security = { $in: [false, true]};
        }
        
        let type = req.query.type;
        if(type === undefined || type === 'all'){
            type = { $in: ['desk', 'floor', 'room', 'meetingRoom', 'eventSpace']};
        }

        let area = req.query.area;
        if(area === undefined || area === 'all'){
            area = { $in: ['Tariq Road', 'Bahadurabad', 'Defence']};
        }

        const searchTerm = req.query.searchTerm || '';
        const sort = req.query.sort || 'createdAt'; 
        const order = req.query.order || 'desc';

        const listings = await Listing.find({
            name: {$regex: searchTerm, $options: 'i'},
            offer,
            furnished,
            parking,
            wifi,
            generator,
            cctv,
            prayingArea,
            frontDeskService,
            personalLocker,
            printScan,
            cafeteria,
            gamingZone,
            fullyAC,
            conference,
            restRoom,
            rfidAccess,
            gym,
            water,
            complimentaryTea,
            area,
            security,
            type,
        }).sort({[sort]: order}).limit(limit).skip(startIndex);

        return res.status(200).json(listings);

    } catch (error) {
        next(error);
    }
}