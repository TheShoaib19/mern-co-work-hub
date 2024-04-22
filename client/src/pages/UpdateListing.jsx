import { useEffect, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UpdateListing() {
    const {currentUser} = useSelector(state => state.user);
    const navigate = useNavigate();
    const params = useParams();
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'desk',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
        timeIntervalType: 'perWeek',
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    console.log(formData);
    
    useEffect(() => {
        const fetchListing = async () =>{
            const listingId = params.listingId;
            const res = await fetch(`/api/listing/get/${listingId}`);
            const data = await res.json();
            if(data.success === false){
                console.log(data.message);
                return;
            }
            setFormData(data);
        }
        fetchListing();
    }, []);

    const handleImageSubmit = (e) => {
        if(files.length > 0 && files.length + formData.imageUrls.length < 7){
            setUploading(true);
            setImageUploadError(false);
            const promises = [];

            for(let i = 0; i < files.length; i++){
                promises.push(storeImage(files[i]));
            } 
            Promise.all(promises).then((urls) => {
                setFormData({...formData, imageUrls: formData.imageUrls.concat(urls)});
                setImageUploadError(false);
                setUploading(false);
            }).catch((err) => {
                toast.error('Image upload failed (2 MB max per image)');
                setUploading(false);
            });
        }else{
            toast.error('You can only upload 6 images per listing');
            setUploading(false);
        }
    };
    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on("state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress}% done`);
            },
            (error)=>{
                reject(error);
            },() => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => { 
                    resolve(downloadURL);
                });
            });
        });
    };

    const handleRemoveImage = (index) => {
        setFormData({...formData, imageUrls: formData.imageUrls.filter((_, i) => i !== index), });
    };

    const handleChange = (e) =>{
        if(e.target.id === 'desk' || e.target.id === 'floor' || e.target.id === 'meetingRoom' || e.target.id === 'eventSpace' || e.target.id === 'room'){
            setFormData({...formData, type: e.target.id});
        }
        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
            setFormData({...formData, [e.target.id]: e.target.checked});
        }
        if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
            setFormData({...formData, [e.target.id]: e.target.value});
        }
        if(e.target.id === 'perDay' || e.target.id === 'perHour' || e.target.id === 'perWeek' || e.target.id === 'perMonth' || e.target.id === 'perYear'){
            setFormData({...formData, timeIntervalType: e.target.id});
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(formData.imageUrls.length < 1) return toast.error('You need to upload at least one image');
            if(+formData.regularPrice < +formData.discountPrice) return toast.error('Discounted price cannot be higher than regular price');
            setLoading(true);
            setError(false);
            const res = await fetch(`/api/listing/update/${params.listingId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                }),
            });
            const data = await res.json();
            setLoading(false);
            if(data.success === false){
                toast.error(data.message);
            }
            navigate(`/listing/${data._id}`);
        } catch (error) {
            toast.error(error.message);
            setLoading(false);
        }
    }

  return (
    <>
    <ToastContainer />
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Update Listing</h1>
        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
                <input onChange={handleChange} value={formData.name} type="text" placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength='62' minLength='10' required/>
                <textarea onChange={handleChange} value={formData.description} type="text" placeholder='Description' className='border p-3 rounded-lg' id='description' required/>
                <input onChange={handleChange} value={formData.address} type="text" placeholder='Address' className='border p-3 rounded-lg' id='address' required/>
                <p className='font-semibold'>Listing Type:</p>
                <div className='flex gap-6 flex-wrap'>
                    <div className="flex gap-2">
                        <input type="radio" name="listingType" id="desk" className='w-5 cursor-pointer' onChange={handleChange} checked={formData.type === 'desk'} />
                        <label htmlFor="desk" className="cursor-pointer">Desk</label>
                    </div>
                    <div className="flex gap-2">
                        <input type="radio" name="listingType" id="floor" className='w-5 cursor-pointer' onChange={handleChange} checked={formData.type === 'floor'}/>
                        <label htmlFor="floor" className="cursor-pointer">Floor</label>
                    </div>
                    <div className="flex gap-2">
                        <input type="radio" name="listingType" id="room" className='w-5 cursor-pointer' onChange={handleChange} checked={formData.type === 'room'}/>
                        <label htmlFor="room" className="cursor-pointer">Room</label>
                    </div>
                    <div className="flex gap-2">
                        <input type="radio" name="listingType" id="meetingRoom" className='w-5 cursor-pointer' onChange={handleChange} checked={formData.type === 'meetingRoom'}/>
                        <label htmlFor="meetingRoom" className="cursor-pointer">Meeting Room</label>
                    </div>
                    <div className="flex gap-2">
                        <input type="radio" name="listingType" id="eventSpace" className='w-5 cursor-pointer' onChange={handleChange} checked={formData.type === 'eventSpace'}/>
                        <label htmlFor="eventSpace" className="cursor-pointer">Event Space</label>
                    </div>
                </div>

                {/* Desk Section Starts */}
                {formData.type === 'desk' && (
                    <div>
                        <p className='font-semibold'>Time Interval:</p>
                        <div className='flex gap-6 flex-wrap'>
                            <div className="flex gap-2">
                                <input type="radio" name="timeIntervalType" id="perWeek" className='w-5 cursor-pointer' onChange={handleChange} checked={formData.timeIntervalType === 'perWeek'}/>
                                <label htmlFor="perWeek" className="cursor-pointer">Per Week</label>
                            </div>
                            <div className="flex gap-2">
                                <input type="radio" name="timeIntervalType" id="perMonth" className='w-5 cursor-pointer' onChange={handleChange} checked={formData.timeIntervalType === 'perMonth'}/>
                                <label htmlFor="perMonth" className="cursor-pointer">Per Month</label>
                            </div>
                            <div className="flex gap-2">
                                <input type="radio" name="timeIntervalType" id="perYear" className='w-5 cursor-pointer' onChange={handleChange} checked={formData.timeIntervalType === 'perYear'} />
                                <label htmlFor="perYear" className="cursor-pointer">Per Year</label>
                            </div>
                        </div>
                    </div>
                )}
                {formData.type === 'desk' && (formData.timeIntervalType === 'perMonth' || formData.timeIntervalType === 'perYear' || formData.timeIntervalType === 'perWeek') && (
                    <h1>DESK CHAAANN</h1>
                )}
                {/* Desk Section Ends */}

                {/* Floor Section Starts */}
                {formData.type === 'floor' && (
                    <div>
                        <p className='font-semibold'>Time Interval:</p>
                        <div className='flex gap-6 flex-wrap'>
                            <div className="flex gap-2">
                                <input type="radio" name="timeIntervalType" id="perMonth" className='w-5 cursor-pointer' onChange={handleChange} checked={formData.timeIntervalType === 'perMonth'}/>
                                <label htmlFor="perMonth" className="cursor-pointer">Per Month</label>
                            </div>
                            <div className="flex gap-2">
                                <input type="radio" name="timeIntervalType" id="perYear" className='w-5 cursor-pointer' onChange={handleChange} checked={formData.timeIntervalType === 'perYear'} />
                                <label htmlFor="perYear" className="cursor-pointer">Per Year</label>
                            </div>
                        </div>
                    </div>
                )}
                {formData.type === 'floor' && (formData.timeIntervalType === 'perMonth' || formData.timeIntervalType === 'perYear') && (
                    <h1>FLOOR SAYS OOGGAAAAAA BOOOGAAAA</h1>
                )}
                {/* Floor Section Ends */}

                {/* Room Section Starts */}
                {formData.type === 'room' && (
                    <div>
                        <p className='font-semibold'>Time Interval:</p>
                        <div className='flex gap-6 flex-wrap'>
                            <div className="flex gap-2">
                                <input type="radio" name="timeIntervalType" id="perMonth" className='w-5 cursor-pointer' onChange={handleChange} checked={formData.timeIntervalType === 'perMonth'}/>
                                <label htmlFor="perMonth" className="cursor-pointer">Per Month</label>
                            </div>
                            <div className="flex gap-2">
                                <input type="radio" name="timeIntervalType" id="perYear" className='w-5 cursor-pointer' onChange={handleChange} checked={formData.timeIntervalType === 'perYear'} />
                                <label htmlFor="perYear" className="cursor-pointer">Per Year</label>
                            </div>
                        </div>
                    </div>
                )}
                {formData.type === 'room' && (formData.timeIntervalType === 'perMonth' || formData.timeIntervalType === 'perYear') && (
                    <h1>ROOM SAYS KONICHIWA</h1>
                )}
                {/* Room Section Ends */}

                {/* Event Space Section Starts */}
                {formData.type === 'eventSpace' && (
                    <div>
                        <p className='font-semibold'>Time Interval:</p>
                        <div className='flex gap-6 flex-wrap'>
                            <div className="flex gap-2">
                                <input type="radio" name="timeIntervalType" id="perHour" className='w-5 cursor-pointer' onChange={handleChange} checked={formData.timeIntervalType === 'perHour'}/>
                                <label htmlFor="perHour" className="cursor-pointer">Per Hour</label>
                            </div>
                            <div className="flex gap-2">
                                <input type="radio" name="timeIntervalType" id="perDay" className='w-5 cursor-pointer' onChange={handleChange} checked={formData.timeIntervalType === 'perDay'} />
                                <label htmlFor="perDay" className="cursor-pointer">Per Day</label>
                            </div>
                        </div>
                    </div>
                )}
                {formData.type === 'eventSpace' && (formData.timeIntervalType === 'perHour' || formData.timeIntervalType === 'perDay') && (
                    <h1>hello</h1>
                )}
                {/* Event Space Section Ends */}

                {/* Meeting Room Section Starts*/}
                {formData.type === 'meetingRoom' && (
                    <div>
                        <p className='font-semibold'>Time Interval:</p>
                        <div className='flex gap-6 flex-wrap'>
                            <div className="flex gap-2">
                                <input type="radio" name="timeIntervalType" id="perHour" className='w-5 cursor-pointer' onChange={handleChange} checked={formData.timeIntervalType === 'perHour'}/>
                                <label htmlFor="perHour" className="cursor-pointer">Per Hour</label>
                            </div>
                            <div className="flex gap-2">
                                <input type="radio" name="timeIntervalType" id="perDay" className='w-5 cursor-pointer' onChange={handleChange} checked={formData.timeIntervalType === 'perDay'} />
                                <label htmlFor="perDay" className="cursor-pointer">Per Day</label>
                            </div>
                        </div>
                    </div>
                )}
                {formData.type === 'meetingRoom' && (formData.timeIntervalType === 'perHour' || formData.timeIntervalType === 'perDay') && (
                    <h2>meeting room says hi</h2>
                )}
                {/* Meeting Room Section Ends*/}

                <p className='font-semibold'>Amenities:</p>
                <div className="flex gap-6 flex-wrap">
                    <div className="flex gap-2">
                        <input type="checkbox" id="parking" className='w-5' onChange={handleChange} checked={formData.parking}/>
                        <span>Parking Spot</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="furnished" className='w-5' onChange={handleChange} checked={formData.furnished}/>
                        <span>Furnished</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="offer" className='w-5' onChange={handleChange} checked={formData.offer}/>
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex flex-wrap gap-6'>
                    <div className='flex items-center gap-2'>
                        <input onChange={handleChange} value={formData.bedrooms} type="number" id='bedrooms' className='p-3 border border-gray-300 rounded-lg' min='1' max='10' required/>
                        <p>Beds</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input onChange={handleChange} value={formData.bathrooms} type="number" id='bathrooms' className='p-3 border border-gray-300 rounded-lg' min='1' max='10' required/>
                        <p>Baths</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input onChange={handleChange} value={formData.regularPrice} type="number" id='regularPrice' className='p-3 border border-gray-300 rounded-lg' min='50' max='1000000' required/>
                        <div className='flex flex-col items-center'>
                            <p>Regular Price</p>
                            {formData.timeIntervalType === 'perHour' && (
                                <span className='text-xs'>(PKR/hr)</span>
                            )}
                            {formData.timeIntervalType === 'perDay' && (
                                <span className='text-xs'>(PKR/day)</span>
                            )}
                            {formData.timeIntervalType === 'perWeek' && (
                                <span className='text-xs'>(PKR/week)</span>
                            )}
                            {formData.timeIntervalType === 'perMonth' && (
                                <span className='text-xs'>(PKR/month)</span>
                            )}
                            {formData.timeIntervalType === 'perYear' && (
                                <span className='text-xs'>(PKR/year)</span>
                            )}
                        </div>
                    </div>
                    {formData.offer && (
                        <div className='flex items-center gap-2'>
                            <input onChange={handleChange} value={formData.discountPrice} type="number" id='discountPrice' className='p-3 border border-gray-300 rounded-lg' min='0' max='10000000' required/>
                            <div className='flex flex-col items-center'>
                                <p>Discounted Price</p>
                                {formData.type === 'floor' && (
                                    <span className='text-xs'>($ / month)</span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className='flex flex-col flex-1 gap-4'>
                <p className='font-semibold '>Images: <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span> </p>
                <div className='flex gap-4'>
                    <input className='p-3 border border-gray-300 rounded w-full' type="file" onChange={(e)=>setFiles(e.target.files)} id='images' accept='image/*' multiple/>
                    <button type='button' disabled={uploading} onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
            <p className="text-red-700 text-sm">{imageUploadError && imageUploadError}</p>
            {
                formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                    <div key={url} className="flex justify-between p-3 border items-center">
                        <img src={url} alt="Listing Image" className="w-20 h-20 object-contain rounded-lg"/>
                        <button type="button" onClick={ () => handleRemoveImage(index)} className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75">Delete</button>
                    </div>
                ))
            }
            <button disabled={loading || uploading} className='p-3 bg-slate-700 text-white rounded-lg hover:opacity-95 disabled:opacity-80 uppercase'>
                {loading ? 'Updating...' : 'Update Listing'}
            </button>
            { error && <p className='text-red-700 text-sm'>{error}</p> }
            </div>
        </form>
    </main>
    </>
  )
}
