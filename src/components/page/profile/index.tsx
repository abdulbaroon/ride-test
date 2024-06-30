"use client"
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, type AppDispatch } from '@/redux/store/store';
import { AuthState, User } from '@/shared/types/account.types';
import { getProfile, updateProfile, uploadedFile, userprofile } from '@/redux/slices/authSlice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { FaUserEdit } from "react-icons/fa";
import MapBox from '@/components/module/MapBox';
import { serialize } from 'v8';

interface ComponentType {
    types: string[];
    long_name: string;
}
interface ProfileFormValues {
    firstName: string;
    lastName: string;
    gender: string;
    homeLocation: string;
    rideStartRadius: number;
    unitOfMeasure: boolean;
    rideType: string;
    contactName: string;
    phoneNumber: string;
    isPrivate: boolean;
}
export const ProfilePage = () => {
    const [loading, setloading] = useState(false)
    const [imageSrc, setImageSrc] = useState<string>("https://chasingwatts.com/pfImages/pfImg_35373.png");
    const [lat, setlat] = useState<number>(28.5355)
    const [lng, setlng] = useState<number>(77.3910)

    const autocompleteRef = useRef<any>(null);
    const userData = useSelector<RootState>(
        (state) => state.auth.user
    ) as User
    const imageURL = `${process.env.NEXT_PUBLIC_IMAGE_URl}/useravatar/pfimg_${userData?.id}.png`
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()
    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<ProfileFormValues>({
        mode: "onTouched"
    });
    const ride = watch("rideStartRadius");

    useEffect(() => {
        const loadGoogleMapsScript = () => {
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API}&libraries=places`;
            script.async = true;
            script.onload = () => {
                initAutocomplete();
            };
            document.body.appendChild(script);
        };
        if (!window.google) {
            loadGoogleMapsScript();
        } else {
            initAutocomplete();
        }
        return () => {
            if (autocompleteRef.current) {
                window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
            }
        };
    }, []);





    useEffect(() => {
        const profile = async () => {
            if (userData.id) {
                const response = await dispatch(getProfile(userData.id));
                if (getProfile.fulfilled.match(response)) {
                    const profileData = response.payload;
                    setValue("firstName", profileData.firstName);
                    setValue("lastName", profileData.lastName);
                    setValue("gender", profileData.userGenderModel.userGenderID.toString());
                    setValue("homeLocation", profileData.homeLocation);
                    setValue("rideStartRadius", profileData.defaultRadius);
                    setValue("unitOfMeasure", profileData.unitOfMeasureID);
                    setValue("rideType", profileData.activityTypeModel.activityTypeID.toString());
                    setValue("contactName", profileData.iceContact);
                    setValue("phoneNumber", profileData.icePhone);
                    setValue("isPrivate", profileData.private);
                    setlat(profileData.homeBaseLat);
                    setlng(profileData.homeBaseLng);
                    const formattedAddress = `${profileData.homeBaseCity}, ${profileData.homeBaseState}, ${profileData.homeBaseCountry}`;
                    setValue("homeLocation", formattedAddress);
                    const input = document.getElementById("autocomplete") as HTMLInputElement;
                    if (input) {
                        input.value = formattedAddress;
                    }
                }
            }
        };
        profile();
    }, [userData, dispatch, setValue])
    const initAutocomplete = () => {
        const input = document.getElementById("autocomplete") as HTMLInputElement;
        if (input) {
            autocompleteRef.current = new window.google.maps.places.Autocomplete(input, {
                types: ["address"]
            });
            autocompleteRef.current.addListener("place_changed", handlePlaceSelect);
        }
    };

    const handlePlaceSelect = (): void => {
        const place = autocompleteRef.current?.getPlace();
        if (place && place.geometry) {
            const address = place.formatted_address;
            const homeBaseLat = place.geometry.location.lat()
            const homeBaseLng = place.geometry.location.lng()
            setlat(Number(homeBaseLat))
            setlng(Number(homeBaseLng))
            setValue("homeLocation", address);
        }
    };



    const onSubmit = async (data: ProfileFormValues) => {
        const place = autocompleteRef.current?.getPlace();
        let homeBaseCity = '';
        let homeBaseState = '';
        let homeBaseCountry = '';
        let homeBaseLat = '';
        let homeBaseLng = ''
        if (place && place.geometry) {
            const components = place.address_components;
            homeBaseLat = place.geometry.location.lat()
            homeBaseLng = place.geometry.location.lng()
            components.forEach((component: ComponentType) => {
                if (component.types.includes('locality')) homeBaseCity = component.long_name;
                if (component.types.includes('administrative_area_level_1')) homeBaseState = component.long_name;
                if (component.types.includes('country')) homeBaseCountry = component.long_name;
            });
        }
        const payload = {
            userID: userData?.id,
            firstName: data.firstName,
            lastName: data.lastName,
            userGenderID: Number(data.gender),
            activityTypeID: Number(data.rideType),
            homeBaseLat: Number(homeBaseLat),
            homeBaseLng: Number(homeBaseLng),
            homeBaseCity: homeBaseCity,
            homeBaseState: homeBaseState,
            homeBaseCountry: homeBaseCountry,
            defaultRadius: data.rideStartRadius,
            unitOfMeasureID: data.unitOfMeasure ? 1 : 2,
            private: data.isPrivate,
            iceContact: data.contactName,
            icePhone: data.phoneNumber,
            isDeleted: false,
            createdBy: 33,
            createdDate: userData?.created
        };
        try {
            if (userData.userProfile) {
                const updatePayload = {
                    id: userData.id,
                    userdata: payload
                }
                setloading(true)
                const response = await dispatch(updateProfile(updatePayload))
                setloading(false)
                if (userprofile.fulfilled.match(response)) {
                    toast.success("sucess")
                } else if (userprofile.rejected.match(response)) {
                    toast.error("failed to Update")
                }
            } else {
                setloading(true)
                const response = await dispatch(userprofile(payload))
                setloading(false)
                if (userprofile.fulfilled.match(response)) {
                    toast.success("sucess")
                } else if (userprofile.rejected.match(response)) {
                    toast.error("failed to Update")
                }
            }
        } catch {
            toast.error("something went wrong")
        }
        console.log(payload, "sd");
    };

    const getBase64 = (file: File) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            try {
                const base64String = await getBase64(file)
                const base64file = (base64String as string).split(',')[1];
                const payload = {
                    fileUploadModelBinary: [
                        {
                            uploadedFile: base64file,
                            activityID: userData?.id,
                            fileUploadTypeID: 5
                        }
                    ]

                }
                if (base64file) {
                    const response = await dispatch(uploadedFile(payload))
                    if (uploadedFile.fulfilled.match(response)) {
                        isImageUrl(base64String as string);
                        toast.success("file upload sucessfully")
                    } else if (uploadedFile.rejected.match(response)) {
                        toast.error("failed to upload file")
                    }
                }
            } catch (error) {
                console.error("Failed to convert file to base64:", error);
                toast.error("something went wrong")

            }
        }
    };

    const isImageUrl = async (url: string) => {
        const img = new Image();
        img.onload = () => {
            setImageSrc(url);
        };
        img.onerror = () => {
            setImageSrc("https://chasingwatts.com/pfImages/pfImg_35373.png");
        };
        img.src = url;
    };

    useEffect(() => {
        isImageUrl(imageURL);
    }, [imageURL]);

    const mapMemo = useMemo(() => <MapBox center={[lng, lat]} initialZoom={11} circle={ride * 10} />, [lng, lat, ride]);
    return (
        <section className="w-full pt-10">
            <div className="w-9/12 mx-auto border bg-white rounded-lg shadow-lg py-4">
                <h1 className="p-6 w-full font-bold border-b text-4xl">Profile Settings</h1>
                <div className="w-full flex justify-center flex-col items-center">
                    <label className=' relative flex justify-center flex-row cursor-pointer' htmlFor="fileInput">
                        <div className="relative w-36 h-36 overflow-hidden bg-gray-100 rounded-full mt-3 border">
                            <img src={imageSrc} alt="img" className='h-full w-full' />
                        </div>
                    </label>
                        <label htmlFor='fileInput' className='bg-primaryButton w-fit py-1 mt-5 px-6 font-bold text-white rounded-lg ms-2'>
                            upload+
                        </label>
                        <input type="file" id="fileInput" onChange={handleFileUpload} className='hidden' />
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex gap-3 mx-10 mt-10'>
                        <div className='w-1/2'>
                            <input {...register("firstName", { required: "First name is required", minLength: { value: 3, message: "Minimum length is 3" } })} className='py-[10px] w-full px-4 border rounded-lg' placeholder='First name' type='text' />
                            {errors.firstName && <p className='text-red-500 text-xs pt-1'>{errors.firstName.message}</p>}
                        </div>
                        <div className='w-1/2'>
                            <input {...register("lastName", { required: "Last name is required", minLength: { value: 3, message: "Minimum length is 3" } })} className='py-[10px] w-full px-4 border rounded-lg' placeholder='Last name' type='text' />
                            {errors.lastName && <p className='text-red-500 text-xs pt-1'>{errors.lastName.message}</p>}
                        </div>
                        <div className='w-1/2'>
                            <select {...register("gender", { required: "Gender is required" })} className='bg-white py-[10px] w-full px-4 border rounded-lg'>
                                <option value="" disabled selected>Gender</option>
                                <option value={1}>Male</option>
                                <option value={2}>Female</option>
                                <option value={3}>Non-Binary</option>
                                <option value={4}>Prefer not to say</option>
                            </select>
                            {errors.gender && <p className='text-red-500 text-xs pt-1'>{errors.gender.message}</p>}
                        </div>
                    </div>
                    <div className='flex gap-3 mx-10 mt-5 w-full'>
                        <div className='w-5/12'>
                            <div className='w-full'>
                                <label className='text-xs text-gray-500'>Home location - search and select*</label>
                                <input {...register("homeLocation", { required: "Home location is required" })} id="autocomplete" className='py-[10px] w-full px-4 border rounded-lg' placeholder='Search location' type='text' />
                                {errors.homeLocation && <p className='text-red-500 text-xs pt-1'>{errors.homeLocation.message}</p>}
                            </div>
                            <div className='w-full'>
                                <label className='text-xs text-gray-500'>Ride start radius*</label>
                                <div className='flex gap-3 justify-center items-center py-3 border rounded-lg px-2'>
                                    <input {...register("rideStartRadius", { required: "Ride start radius is required", valueAsNumber: true })} type="range" min={0} max="500" className="range range-error w-full" />
                                    <p>{ride || 0}</p>
                                </div>
                            </div>
                            <div className='w-full'>
                                <label className='text-xs text-gray-500'>Unit of measure*</label>
                                <div className='border flex justify-center items-center rounded-md py-[7px]'>
                                    <label className="flex justify-between items-center cursor-pointer">
                                        <input {...register("unitOfMeasure", { required: "Unit of measure is required" })} type="checkbox" className="sr-only peer" />
                                        <div className='flex flex-col'>
                                            <span className="ms-3 text-xs font-medium text-[#244161]">Imperial</span>
                                            <span className="ms-3 text-xs font-medium text-[#244161]">mi | mph | ft</span>
                                        </div>
                                        <div className="relative mx-3 w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                                        <div className='flex flex-col'>
                                            <span className="ms-3 text-xs font-medium text-[#244161]">Metric</span>
                                            <span className="ms-3 text-xs font-medium text-[#244161]">km | kph | m</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className='w-1/2 mt-4'>
                            {mapMemo}
                        </div>
                    </div>
                    <div className='flex gap-3 mx-10 mt-6'>
                        <div className='w-1/2'>
                            <select {...register("rideType", { required: "Ride type is required" })} className='bg-white py-[10px] w-full px-4 border rounded-lg'>
                                <option value="" disabled selected>Activity Type</option>
                                <option value={1}>Road</option>
                                <option value={2}>MTB</option>
                                <option value={3}>Mountain</option>
                            </select>
                            {errors.rideType && <p className='text-red-500 text-xs pt-1'>{errors.rideType.message}</p>}
                        </div>
                        <div className='w-1/2'>
                            <input {...register("contactName", { required: "Phone number is required", minLength: { value: 3, message: "Contact Name must be at least 3 characters" } })} className='py-[10px] w-full px-4 border rounded-lg' placeholder='emergency contact name' type='text' />
                            {errors.contactName && <p className='text-red-500 text-xs pt-1'>{errors.contactName.message}</p>}
                        </div>
                        <div className='w-1/2'>
                            <input {...register("phoneNumber", { required: "Phone number is required", minLength: { value: 10, message: "Minimum length is 10" } })} className='py-[10px] w-full px-4 border rounded-lg' placeholder='emergency contact number' type='text' />
                            {errors.phoneNumber && <p className='text-red-500 text-xs pt-1'>{errors.phoneNumber.message}</p>}
                        </div>
                    </div>
                    <div className='mx-10 mt-6'>
                        <label className="inline-flex items-center cursor-pointer">
                            <input {...register("isPrivate")} type="checkbox" className="sr-only peer" />
                            <div className="relative me-3 w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                            <span className="font-medium">Private</span>
                        </label>
                        <p className='text-xs text-[#244161]'>Your profile will be limited only connected users.</p>
                    </div>
                    <div className='mx-10 mt-6 flex items-start'>
                        <button type="submit" className='bg-primaryText py-[9px] px-6 font-bold text-white rounded-lg'>
                            Update Profile
                        </button>
                        <button type="button" onClick={() => router.push("/account/login")} className='bg-primaryButton py-[9px] px-6 font-bold text-white rounded-lg ms-2'>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
            <div>
            </div>
        </section>
    );
};
