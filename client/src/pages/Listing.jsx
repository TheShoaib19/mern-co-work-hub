import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import { useSelector } from 'react-redux';
import 'swiper/css/bundle';
import { FaWifi, FaChair, FaMapMarkerAlt, FaParking, FaShare, FaCarBattery, FaCamera, FaPray, FaPhone, FaArchive, FaPrint, FaDrumstickBite, FaGamepad, FaWind, FaChartPie, FaRestroom, FaIdCard, FaDumbbell, FaWineBottle, FaMugHot, FaUserShield, FaCouch } from 'react-icons/fa';
import Contact from '../components/Contact';
import Reviews from '../components/Reviews';
import ReviewForm from '../components/ReviewForm';


export default function Listing() {
    SwiperCore.use([Navigation]);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    const params = useParams();
    const {currentUser} = useSelector((state) => state.user);

    useEffect(()=>{
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`)
                const data = await res.json();
                if(data.success === false){
                    setError(true);
                    setLoading(false);
                    return;
                }
                setListing(data);
                setLoading(false);
                setError(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        }
        fetchListing();
    }, [params.listingId]);
  return (
    <main>
        {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
        {error && <p className='text-center my-7 text-2xl'>Something went wrong!</p>}
        { listing && !loading && !error && (
            <div>
                <Swiper navigation>
                    {listing.imageUrls.map((url) => (
                        <SwiperSlide key={url}>
                            <div className='h-[550px]' style={{ background: `url(${url}) center no-repeat`, backgroundSize: 'cover'}}></div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
                    <FaShare className='text-slate-500' onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        setCopied(true);
                        setTimeout(() => {
                        setCopied(false);
                        }, 2000);
                    }}
                    />
                </div>
                {copied && (
                    <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
                        Link copied!
                    </p>
                )}
                <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
                    <p className='text-2xl font-semibold'>
                        {listing.name} - PKR{' '}
                        {listing.offer
                            ? listing.discountPrice.toLocaleString('en-US')
                            : listing.regularPrice.toLocaleString('en-US')}
                        {listing.timeIntervalType === 'perHour' && '/hr'}
                        {listing.timeIntervalType === 'perDay' && '/day'}
                        {listing.timeIntervalType === 'perWeek' && '/week'}
                        {listing.timeIntervalType === 'perMonth' && '/month'}
                        {listing.timeIntervalType === 'perYear' && '/year'}
                    </p>
                    <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
                        <FaMapMarkerAlt className='text-green-700' />
                        {listing.address}
                    </p>
                    <p className='flex items-center gap-2 text-slate-600  text-sm'>
                        Area: {listing.area}
                    </p>
                    <div className='flex gap-4'>
                        <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                            {listing.type === 'floor' ? 'Floor' : listing.type === 'desk' ? 'Desk' : listing.type === 'room' ? 'Room' : listing.type === 'meetingRoom' ? 'Meeting Room' : listing.type === 'eventSpace' ? 'Event Space' : ''}
                        </p>
                        {listing.offer && (
                            <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                            {+listing.regularPrice - +listing.discountPrice} OFF
                            </p>
                        )}
                    </div>
                    <p className='text-slate-800'>
                        <span className='font-semibold text-black'>Description - </span>
                        {listing.description}
                    </p>
                    <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
                        {listing.parking && (
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <span className='flex gap-1'>
                                    <FaParking className='text-lg' />Parking
                                </span>
                            </li>
                        )}
                        {listing.furnished && (
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <span className='flex gap-1'>
                                    <FaChair className='text-lg'/>Furnished
                                </span>
                            </li>
                        )}
                        {listing.wifi && (
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <span className='flex gap-1'>
                                    <FaWifi className='text-lg'/>Wi-fi
                                </span>
                            </li>
                        )}
                        {listing.generator && (
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <span className='flex gap-1'>
                                    <FaCarBattery className='text-lg'/>Generator
                                </span>
                            </li>
                        )}
                        {listing.cctv && (
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <span className='flex gap-1'>
                                    <FaCamera className='text-lg'/>CCTV surveillance
                                </span>
                            </li>
                        )}
                        {listing.prayingArea && (
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <span className='flex gap-1'>
                                    <FaPray className='text-lg'/>Praying Area
                                </span>
                            </li>
                        )}
                        {listing.frontDeskService && (
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <span className='flex gap-1'>
                                    <FaPhone className='text-lg'/>Front Desk
                                </span>
                            </li>
                        )}
                        {listing.personalLocker && (
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <span className='flex gap-1'>
                                    <FaArchive className='text-lg'/>Personal Locker
                                </span>
                            </li>
                        )}
                        {listing.printScan && (
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <span className='flex gap-1'>
                                    <FaPrint className='text-lg'/>Print & Scan
                                </span>
                            </li>
                        )}
                        {listing.cafeteria && (
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <span className='flex gap-1'>
                                    <FaDrumstickBite className='text-lg'/>Cafeteria
                                </span>
                            </li>
                        )}
                        {listing.gamingZone && (
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <span className='flex gap-1'>
                                    <FaGamepad className='text-lg'/>Gaming Zone
                                </span>
                            </li>
                        )}
                        {listing.fullyAC && (
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <span className='flex gap-1'>
                                    <FaWind className='text-lg'/>Air Conditioned
                                </span>
                            </li>
                        )}
                        {listing.conference && (
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <span className='flex gap-1'>
                                    <FaChartPie className='text-lg'/>Conference Room
                                </span>
                            </li>
                        )}
                        {listing.restRoom && (
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <span className='flex gap-1'>
                                    <FaRestroom className='text-lg'/>Rest Room
                                </span>
                            </li>
                        )}
                        {listing.rfidAccess && (
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <span className='flex gap-1'>
                                    <FaIdCard className='text-lg'/>RFID Access
                                </span>
                            </li>
                        )}
                        {listing.gym && (
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <span className='flex gap-1'>
                                    <FaDumbbell className='text-lg'/>Gym
                                </span>
                            </li>
                        )}
                        {listing.water && (
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <span className='flex gap-1'>
                                    <FaWineBottle className='text-lg'/>Mineral Water
                                </span>
                            </li>
                        )}
                        {listing.complimentaryTea && (
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <span className='flex gap-1'>
                                    <FaMugHot className='text-lg'/>Complimentary Tea
                                </span>
                            </li>
                        )}
                        {listing.security && (
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <span className='flex gap-1'>
                                    <FaUserShield className='text-lg'/>Security
                                </span>
                            </li>
                        )}
                        <li className='flex items-center gap-1 whitespace-nowrap'>
                            {listing.numberOfChairs ? 
                            <span className='flex gap-1'>
                                <FaCouch className='text-lg'/>{listing.numberOfChairs} Person Space
                            </span> : ''}
                        </li>
                    </ul>
                    { currentUser && listing.userRef !== currentUser._id && !contact && (
                        <button onClick={() => setContact(true)} className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'>
                            Contact Owner
                        </button>
                    )}
                    {contact && <Contact listing={listing}/>}
                    {currentUser && listing.userRef !== currentUser._id &&(
                        <ReviewForm user={currentUser} listing={listing} />
                    )}
                    <Reviews listing={listing} />
                    {!currentUser && (
                        <div>
                            <span className='font-bold'>Please Sign-in to contact the owner or leave a review</span>
                        </div>
                    )}
                </div>
            </div>
        )}
    </main>
  )
}
