import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import { set } from "mongoose";

export default function Search() {
    const navigate = useNavigate();
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        wifi: false,
        generator: false,
        cctv: false,
        prayingArea: false,
        frontDeskService: false,
        personalLocker: false,
        printScan: false,
        cafeteria: false,
        gamingZone: false,
        fullyAC: false,
        conference: false,
        restRoom: false,
        rfidAccess: false,
        gym: false,
        water: false,
        complimentaryTea: false,
        security: false,
        furnished: false,
        offer: false,
        area: 'all',
        sort: 'created_at',
        order: 'desc'
    });
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const wifiFromUrl = urlParams.get('wifi');
        const generatorFromUrl = urlParams.get('generator');
        const cctvFromUrl = urlParams.get('cctv');
        const prayingAreaFromUrl = urlParams.get('prayingArea');
        const frontDeskServiceFromUrl = urlParams.get('frontDeskService');
        const personalLockerFromUrl = urlParams.get('personalLocker');
        const printScanFromUrl = urlParams.get('printScan');
        const cafeteriaFromUrl = urlParams.get('cafeteria');
        const gamingZoneFromUrl = urlParams.get('gamingZone');
        const fullyACFromUrl = urlParams.get('fullyAC');
        const conferenceFromUrl = urlParams.get('conference');
        const restRoomFromUrl = urlParams.get('restRoom');
        const rfidAccessFromUrl = urlParams.get('rfidAccess');
        const gymFromUrl = urlParams.get('gym');
        const waterFromUrl = urlParams.get('water');
        const complimentaryTeaFromUrl = urlParams.get('complimentaryTea');
        const securityFromUrl = urlParams.get('security');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const areaFromUrl = urlParams.get('area');
        const orderFromUrl = urlParams.get('order');

        if(searchTermFromUrl || typeFromUrl || parkingFromUrl || wifiFromUrl || generatorFromUrl || cctvFromUrl || prayingAreaFromUrl || frontDeskServiceFromUrl || personalLockerFromUrl || printScanFromUrl || cafeteriaFromUrl || gamingZoneFromUrl || fullyACFromUrl || conferenceFromUrl || restRoomFromUrl || rfidAccessFromUrl || gymFromUrl || waterFromUrl || complimentaryTeaFromUrl || securityFromUrl ||  furnishedFromUrl || offerFromUrl || sortFromUrl || areaFromUrl || orderFromUrl){
            setSidebarData({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true' ? true : false,
                wifi: wifiFromUrl === 'true' ? true : false,
                generator: generatorFromUrl === 'true' ? true : false,
                cctv: cctvFromUrl === 'true' ? true : false,
                prayingArea: prayingAreaFromUrl === 'true' ? true : false,
                frontDeskService: frontDeskServiceFromUrl === 'true' ? true : false,
                personalLocker: personalLockerFromUrl === 'true' ? true : false,
                printScan: printScanFromUrl === 'true' ? true : false,
                cafeteria: cafeteriaFromUrl === 'true' ? true : false,
                gamingZone: gamingZoneFromUrl === 'true' ? true : false,
                fullyAC: fullyACFromUrl === 'true' ? true : false,
                conference: conferenceFromUrl === 'true' ? true : false,
                restRoom: restRoomFromUrl === 'true' ? true : false,
                rfidAccess: rfidAccessFromUrl === 'true' ? true : false,
                gym: gymFromUrl === 'true' ? true : false,
                water: waterFromUrl === 'true' ? true : false,
                complimentaryTea: complimentaryTeaFromUrl === 'true' ? true : false,
                security: securityFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === 'true' ? true : false,
                offer: offerFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'created_at',
                area: areaFromUrl || 'all',
                order: orderFromUrl || 'desc'
            });
        }

        const fetchListings = async () => { 
            setLoading(true);
            setShowMore(false);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();
            if(data.length > 8){
                setShowMore(true);
            }else{
                setShowMore(false);
            }
            setListings(data);
            setLoading(false);
        }
        fetchListings();
    }, [location.search]);

    const handleChange = (e) => {
        if(e.target.id === 'all' || e.target.id === 'floor' || e.target.id === 'desk' || e.target.id === 'room' || e.target.id === 'meetingRoom' || e.target.id === 'eventSpace'){
            setSidebarData({
                ...sidebarData,
                type: e.target.id
            });
        }
        if(e.target.id === 'searchTerm'){
            setSidebarData({...sidebarData, searchTerm: e.target.value});
        }
        if(e.target.id === 'area'){
            setSidebarData({...sidebarData, area: e.target.value});
        }
        if(e.target.id === 'parking' || e.target.id === 'wifi' || e.target.id === 'generator' || e.target.id === 'cctv' || e.target.id === 'prayingArea' || e.target.id === 'frontDeskService' || e.target.id === 'personalLocker' || e.target.id === 'printScan' || e.target.id === 'cafeteria' || e.target.id === 'gamingZone' || e.target.id === 'fullyAC' || e.target.id === 'conference' || e.target.id === 'restRoom' || e.target.id === 'rfidAccess' || e.target.id === 'gym' || e.target.id === 'water' || e.target.id === 'complimentaryTea' || e.target.id === 'security' || e.target.id === 'furnished' || e.target.id === 'offer'){
            setSidebarData({
                ...sidebarData,
                [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false
            });
        }
        if(e.target.id === 'sort_order'){
            const sort = e.target.value.split('_')[0] || 'created_at';
            const order = e.target.value.split('_')[1] || 'desc';
            setSidebarData({
                ...sidebarData,
                sort,
                order
            });
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('type', sidebarData.type);
        urlParams.set('parking', sidebarData.parking);
        urlParams.set('wifi', sidebarData.wifi);
        urlParams.set('generator', sidebarData.generator);
        urlParams.set('cctv', sidebarData.cctv);
        urlParams.set('prayingArea', sidebarData.prayingArea);
        urlParams.set('frontDeskService', sidebarData.frontDeskService);
        urlParams.set('personalLocker', sidebarData.personalLocker);
        urlParams.set('printScan', sidebarData.printScan);
        urlParams.set('cafeteria', sidebarData.cafeteria);
        urlParams.set('gamingZone', sidebarData.gamingZone);
        urlParams.set('fullyAC', sidebarData.fullyAC);
        urlParams.set('conference', sidebarData.conference);
        urlParams.set('restRoom', sidebarData.restRoom);
        urlParams.set('rfidAccess', sidebarData.rfidAccess);
        urlParams.set('gym', sidebarData.gym);
        urlParams.set('water', sidebarData.water);
        urlParams.set('complimentaryTea', sidebarData.complimentaryTea);
        urlParams.set('security', sidebarData.security);
        urlParams.set('furnished', sidebarData.furnished);
        urlParams.set('offer', sidebarData.offer);
        urlParams.set('sort', sidebarData.sort);
        urlParams.set('area', sidebarData.area);
        urlParams.set('order', sidebarData.order);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }
    const onShowMoreClick = async () => {
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if(data.length < 9){
            setShowMore(false);
        }
        setListings([...listings, ...data]);
    }
  return (
    <div className="flex flex-col md:flex-row">
        <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen max-w-[350px]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div className="flex items-center gap-2">
                    <label className="whitespace-nowrap font-semibold">Search Term</label>
                    <input value={sidebarData.searchTerm} onChange={handleChange} type="text" name="" id="searchTerm" placeholder="Search..." className="border rounded-lg p-3 w-full"/>
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                    <label className="font-semibold">Type: </label>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={sidebarData.type === 'all'} type="radio" name="listingType" id="all" className="w-5"/>
                        <label htmlFor="all" className="cursor-pointer">All</label>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={sidebarData.type === 'floor'} type="radio" name="listingType" id="floor" className="w-5"/>
                        <label htmlFor="floor" className="cursor-pointer">Floor</label>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={sidebarData.type === 'desk'} type="radio" name="listingType" id="desk" className="w-5"/>
                        <label htmlFor="desk" className="cursor-pointer">Desk</label>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={sidebarData.type === 'room'} type="radio" name="listingType" id="room" className="w-5"/>
                        <label htmlFor="room" className="cursor-pointer">Room</label>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={sidebarData.type === 'meetingRoom'} type="radio" name="listingType" id="meetingRoom" className="w-5"/>
                        <label htmlFor="meetingRoom" className="cursor-pointer">Meeting Room</label>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={sidebarData.type === 'eventSpace'} type="radio" name="listingType" id="eventSpace" className="w-5"/>
                        <label htmlFor="eventSpace" className="cursor-pointer">Event Space</label>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2 items-center">
                        <label className="font-semibold">Sort:</label>
                        <select onChange={handleChange} defaultValue={'created_at_desc'} id="sort_order" className="border rounded-lg p-3">
                            <option value='regularPrice_desc'>Price high to low</option>
                            <option value='regularPrice_asc'>Price low to high</option>
                            <option value='createdAt_desc'>Latest</option>
                            <option value='createdAt_asc'>Oldest</option>
                        </select>
                    </div>
                    <div className="flex gap-2 items-center">    
                        <label className="font-semibold">Area:</label>
                        <select onChange={handleChange} defaultValue={''} id="area" className="border rounded-lg p-3">
                            <option value="all">All</option>
                            <option value='Tariq Road'>Tariq Road</option>
                            <option value='Bahadurabad'>Bahadurabad</option>
                            <option value='Defence'>Defence</option>
                        </select>
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                    <label className="font-semibold">Amenities: </label>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={sidebarData.parking} type="checkbox" id="parking" className="w-5"/>
                        <span>Parking</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={sidebarData.furnished} type="checkbox" id="furnished" className="w-5"/>
                        <span>Furnished</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={sidebarData.wifi} type="checkbox" id="wifi" className="w-5"/>
                        <span>Wi-Fi</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={sidebarData.generator} type="checkbox" id="generator" className="w-5"/>
                        <span>Generator</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={sidebarData.cctv} type="checkbox" id="cctv" className="w-5"/>
                        <span>CCTV</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={sidebarData.prayingArea} type="checkbox" id="prayingArea" className="w-5"/>
                        <span>Praying Area</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={sidebarData.frontDeskService} type="checkbox" id="frontDeskService" className="w-5"/>
                        <span>Front Desk</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={sidebarData.personalLocker} type="checkbox" id="personalLocker" className="w-5"/>
                        <span>Personal Locker</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={sidebarData.printScan} type="checkbox" id="printScan" className="w-5"/>
                        <span>Print & Scan</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={sidebarData.cafeteria} type="checkbox" id="cafeteria" className="w-5"/>
                        <span>Cafeteria</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={sidebarData.gamingZone} type="checkbox" id="gamingZone" className="w-5"/>
                        <span>Gaming Zone</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={sidebarData.fullyAC} type="checkbox" id="fullyAC" className="w-5"/>
                        <span>Air Conditioned</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={sidebarData.conference} type="checkbox" id="conference" className="w-5"/>
                        <span>Conference Room</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={sidebarData.restRoom} type="checkbox" id="restRoom" className="w-5"/>
                        <span>Rest Room</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={sidebarData.rfidAccess} type="checkbox" id="rfidAccess" className="w-5"/>
                        <span>RFID Access</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={sidebarData.gym} type="checkbox" id="gym" className="w-5"/>
                        <span>Gym</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={sidebarData.water} type="checkbox" id="water" className="w-5"/>
                        <span>Mineral Water</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={sidebarData.complimentaryTea} type="checkbox" id="complimentaryTea" className="w-5"/>
                        <span>Complimentary Tea</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={sidebarData.security} type="checkbox" id="security" className="w-5"/>
                        <span>Security</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={sidebarData.offer} type="checkbox" id="offer" className="w-5"/>
                        <span>Offer</span>
                    </div>
                </div>
                <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
                    Search
                </button>
            </form>
        </div>
        <div className="flex-1">
            <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">Listing Results:</h1>
            <div className="p-7 flex flex-wrap gap-4">
                {!loading && listings.length === 0 && (
                    <p className="text-xl text-slate-700">No listing found</p>
                )}
                {loading && (
                    <p className="text-xl text-slate-700 text-center w-full">Loading...</p>
                )}

                {!loading && listings && listings.map((listing) => (
                    <ListingItem key={listing._id} listing={listing}/>
                ))}
            </div>
                {showMore && (
                    <button onClick={onShowMoreClick} className="text-center w-full text-green-700 hover:underline p-7">
                        Show More
                    </button>
                )}
        </div>
    </div>
  )
}
