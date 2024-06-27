"use client"
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Autocomplete } from 'google.maps';

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
    const autocompleteRef = useRef<Autocomplete | null>(null);
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
            console.log(`City: ${homeBaseCity}, State: ${homeBaseState}, Country: ${homeBaseCountry}`);
            console.log(`Latitude: ${homeBaseLat}, Longitude: ${homeBaseLng}`);
        }
        
        console.log(data, "sd");
    };
    return (
        <section className="w-full pt-10">
            <div className="w-9/12 mx-auto border bg-white rounded-lg shadow-lg py-4">
                <h1 className="p-6 w-full font-bold border-b text-4xl">Profile Settings</h1>
                <div className="w-full flex justify-center flex-row">
                    <div className="relative w-36 h-36 overflow-hidden bg-gray-100 rounded-full mt-3">
                        <svg className="absolute w-40 h-40 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                    </div>
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
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="non-binary">Non-Binary</option>
                                <option value="prefer-not-to-say">Prefer not to say</option>
                            </select>
                            {errors.gender && <p className='text-red-500 text-xs pt-1'>{errors.gender.message}</p>}
                        </div>
                    </div>
                    <div className='flex gap-3 mx-10 mt-5'>
                        <div className='w-1/2'>
                            <label className='text-xs text-gray-500'>Home location - search and select*</label>
                            <input {...register("homeLocation", { required: "Home location is required" })} id="autocomplete" className='py-[10px] w-full px-4 border rounded-lg' placeholder='Search location' type='text' />
                            {errors.homeLocation && <p className='text-red-500 text-xs pt-1'>{errors.homeLocation.message}</p>}
                        </div>
                        <div className='w-1/2'>
                            <label className='text-xs text-gray-500'>Ride start radius*</label>
                            <div className='flex gap-3 justify-center items-center py-3 border rounded-lg px-2'>
                                <input {...register("rideStartRadius", { required: "Ride start radius is required", valueAsNumber: true })} type="range" min={0} max="500" className="range range-error w-full" />
                                <p>{ride || 0}</p>
                            </div>
                        </div>
                        <div className='w-1/2'>
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
                    <div className='flex gap-3 mx-10 mt-6'>
                        <div className='w-1/2'>
                            <select {...register("rideType", { required: "Ride type is required" })} className='bg-white py-[10px] w-full px-4 border rounded-lg'>
                                <option value="" disabled selected>Ride Type</option>
                                <option value="road">Road</option>
                                <option value="hill">Hill</option>
                                <option value="mountain">Mountain</option>
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
                        <button type="button" className='bg-primaryButton py-[9px] px-6 font-bold text-white rounded-lg ms-2'>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};
