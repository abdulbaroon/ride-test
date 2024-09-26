"use client";
import { AppDispatch, RootState } from "@/redux/store/store";
import { ChangeEvent, KeyboardEventHandler, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useForm, SubmitHandler } from "react-hook-form";
import { IoMdArrowDropdown, IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";
import { genrateImage } from "@/redux/slices/addRideSlice";
import { toast } from "react-toastify";
import { CgSpinner } from "react-icons/cg";
import { IoCloseSharp } from "react-icons/io5";
import { User } from "@/shared/types/account.types";
import { saveRide } from "../feature/rideFeature";
import Select, { IndicatorSeparatorProps } from "react-select";
import Creatable from "react-select/creatable";
import CreatableSelect from "react-select/creatable";
import Image from "next/image";
import { IoMdAdd } from "react-icons/io";
import { GoPlusCircle } from "react-icons/go";
import { ImGlass } from "react-icons/im";
import Success from "./Success";
import { useRouter } from "next/navigation";

/**
 * Interface representing the props for the Form4 component.
 */

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
    },
};
interface Form1Props {
    /** Function to proceed to the next form */
    nextForm: (data: FormData | any) => void;  
    /** Initial form data */
    formData?: FormData | any;                  
    /** Function to reset the form */
    startOver: () => void;                      
    /** Function to go to the previous form */
    prevForm?: () => void;                      
    /** Optional function to handle success state */
    setSuccess?: (id: number) => void;         
}

/**
 * Interface representing the data structure for the form.
 */
interface FormData {
    /** Type of route for the ride */
    routeType?: string;        
    /** Indicates if the ride is a group ride */
    isGroup?: boolean;         
    /** Tags associated with the ride activity */
    activityTags?: string[];   
    /** IDs of the hubs involved in the ride */
    hubID?: number[];          
    /** Promotional link associated with the ride */
    promoLink?: string;        
}

/**
 * Interface representing the structure for a hub.
 */
interface HubList {
    /** Unique identifier for the hub */
    hubID: number;            
    /** Name of the hub */
    hubName: string;          
}

/**
 * Interface representing the structure for an option in the select dropdown.
 */
interface Option {
    /** Display label for the option */
    readonly label: string;   
    /** Value associated with the option */
    readonly value: string;   
}

const indicatorSeparatorStyle = {
    alignSelf: "stretch",
    backgroundColor: "blue",
    marginBottom: 8,
    marginTop: 8,
    width: 1,
};

const createOption = (label: string) => ({
    label,
    value: label,
});
const components = {
    DropdownIndicator: null,
};
/**
 * Form4 component for ride details including image generation and document upload.
 * 
 * @param {Form1Props} props - Props for the component.
 * @returns {JSX.Element} Rendered Form4 component.
 */
const Form4: React.FC<Form1Props> = ({
    nextForm,
    formData,
    startOver,
    prevForm,
    setSuccess,
}) => {
    const [modalIsOpen, setIsOpen] = useState<boolean>(false);
    const [dallEInput, setDallEInput] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [finalLoading, setFinalLoading] = useState<boolean>();
    const [aiImage, setAiImage] = useState<string | null>(
        formData?.dalleUrl || null
    );
    const [image, setImage] = useState<File | null>(formData?.image);
    const [waiver, setWaiver] = useState<File | null>(formData?.document);
    const [inputValue, setInputValue] = useState("");
    const [select, setSelect] = useState<string[]>([]);
    const [value, setValue] = useState<readonly Option[]>(formData.tags || []);
    
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormData>();

    const dispatch = useDispatch<AppDispatch>();
    const { push } = useRouter();

    const activityTags = useSelector<RootState, string[]>(
        (state) => state.addRide.activityTags
    );

    const hubList = useSelector<RootState, HubList[]>(
        (state) => state.addRide.hubList
    );

    const formattedActivityTags = activityTags.map((tag) => ({
        label: tag,
        value: tag,
    }));

    const userData = useSelector<RootState>((state) => state.auth.user) as User;

    /**
     * Handles form submission.
     * 
     * @param {FormData} data - The form data submitted by the user.
     */
    const handleSubmits: SubmitHandler<FormData> = async (data) => {
        const payload = {
            routeData: {
                ...formData,
                ...data,
                document: waiver,
                image: image,
                dalleUrl: aiImage,
                tags: value?.map((item: any) => item.label),
            },
            user: userData,
        };

        const onSuccess = (response: any) => {
            toast.success("Ride saved successfully");
            push(`/ride/${response.payload.activityID}`);
            // setSuccess?.(response.payload.activityID);
        };

        const onError = (error: any) => {
            toast.error("Error while saving ride");
        };

        setFinalLoading(true);
        await saveRide(dispatch, onSuccess, onError, payload);
        setFinalLoading(false);
    };

    /**
     * Handles changes in the DALL-E input field.
     * 
     * @param {ChangeEvent<HTMLInputElement>} e - The change event from the input field.
     */
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDallEInput(e.target.value);
    };

    /**
     * Generates an image based on the DALL-E input.
     */
    const handleGenerate = async () => {
        const payload = {
            prompt: dallEInput,
            distance: 121,
        };
        setLoading(true);
        const response = await dispatch(genrateImage(payload));
        setLoading(false);
        if (genrateImage.fulfilled.match(response)) {
            setAiImage(response.payload.data[0].url);
        } else {
            toast.error("Failed to generate image");
        }
    };

    /**
     * Opens the modal for image generation.
     */
    const handleOpenModal = () => {
        setIsOpen(true);
    };

    /**
     * Closes the modal for image generation.
     */
    const handleCloseModal = () => {
        setIsOpen(false);
    };

    /**
     * Handles the uploaded waiver document.
     * 
     * @param {File} file - The uploaded file.
     */
    const handleWaiver = (file: File) => {
        setWaiver(file);
    };

    /**
     * Handles the uploaded image.
     * 
     * @param {File} file - The uploaded file.
     */
    const handleImage = (file: File) => {
        setImage(file);
    };

    /**
     * Renders a checkbox for the form.
     * 
     * @param {string} label - The label for the checkbox.
     * @param {string} description - The description for the checkbox.
     * @param {string} field - The field name for form registration.
     * @param {boolean} [defaultValue] - Optional default value for the checkbox.
     * @returns {JSX.Element} The rendered checkbox component.
     */
    const renderCheckbox = (
        label: string,
        description: string,
        field: string,
        defaultValue?: boolean | any
    ): JSX.Element => (
        <div className='border-b w-full tablet:w-1/2 pb-2'>
            <label className='inline-flex items-center cursor-pointer'>
                <input
                    {...register(field as keyof FormData)}
                    defaultChecked={defaultValue}
                    type='checkbox'
                    className='sr-only peer'
                />
                <div className="relative me-3 w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primaryButton"></div>
                <div className='flex flex-col leading-5 w-[90%]'>
                    <span className='font-medium'>{label}</span>
                    <span className='text-sm text-gray-500'>{description}</span>
                </div>
            </label>
        </div>
    );

    /**
     * Handles the action when going to the previous form.
     */
    const handelPrevious = () => {
        const correntFromData = watch();
        const data = {
            ...formData,
            ...correntFromData,
            document: waiver,
            image: image,
            dalleUrl: aiImage,
            tags: value,
        };
        prevForm?.();
        nextForm(data);
    };
    const handleKeyDown: KeyboardEventHandler = (event) => {
        if (!inputValue) return;
        switch (event.key) {
            case "Enter":
            case "Tab":
                setValue((prev) => [...prev, createOption(inputValue)]);
                setInputValue("");
                event.preventDefault();
        }
    };

    return (
        <div className='mt-2 mb-5'>
            {
                <form onSubmit={handleSubmit(handleSubmits)} className=''>
                    <div>
                        <div className='flex gap-7 mt-5 flex-col tablet:flex-row'>
                            {renderCheckbox(
                                "Community",
                                "Can’t lead the ride, select this option to set as a community ride.",
                                "isCommunity",
                                formData.isCommunity
                            )}
                            {renderCheckbox(
                                "Private",
                                "This will not show publicly in feeds. You must invite your friends.",
                                "isPrivate",
                                formData.isPrivate
                            )}
                        </div>
                        <div className='flex gap-7 mt-5 flex-col tablet:flex-row'>
                            {renderCheckbox(
                                "No Drop",
                                "Want to wait for anyone that may drop off?",
                                "isDrop",
                                formData.isDrop
                            )}
                            {renderCheckbox(
                                "Lights Required",
                                "Need to ensure all has lights for safety?",
                                "isLights",
                                formData.isLights
                            )}
                        </div>
                        <div className='flex gap-7 mt-5 flex-col tablet:flex-row'>
                            <div className='flex flex-col w-full tablet:w-1/2'>
                                <label className='font-medium text-sm text-gray-400'>
                                    Activity Tags
                                </label>
                                <div className='flex flex-col relative mt-1'>
                                    <CreatableSelect
                                        components={components}
                                        inputValue={inputValue}
                                        isClearable
                                        isMulti
                                        menuIsOpen={false}
                                        onChange={(newValue) =>
                                            setValue(newValue)
                                        }
                                        onInputChange={(newValue) =>
                                            setInputValue(newValue)
                                        }
                                        onKeyDown={handleKeyDown}
                                        placeholder='Type tag and press enter...'
                                        className='!rounded-md'
                                        value={value}
                                    />
                                </div>
                                {errors.activityTags && (
                                    <p className='text-red-500 text-xs pt-1'>
                                        {errors.activityTags.message}
                                    </p>
                                )}
                            </div>
                            <div className='flex flex-col w-full tablet:w-1/2'>
                                <label className='font-medium text-sm text-gray-400'>
                                    Hub List
                                </label>
                                <div className='flex flex-col relative mt-1'>
                                    <select
                                        {...register("hubID")}
                                        defaultValue={formData?.hubID}
                                        className={`bg-white border rounded-md px-2 py-[6px] ${
                                            watch("hubID")
                                                ? "text-black"
                                                : "text-gray-500"
                                        }`}>
                                        <option value='' disabled selected>
                                            Select Hub
                                        </option>
                                        {hubList?.map((data) => (
                                            <option
                                                value={data.hubID}
                                                key={data.hubID}>
                                                {data.hubName}
                                            </option>
                                        ))}
                                    </select>
                                    <IoMdArrowDropdown className='w-5 h-auto absolute right-3 top-[11px]' />
                                </div>
                                {errors.hubID && (
                                    <p className='text-red-500 text-xs pt-1'>
                                        {errors.hubID.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className='mt-5 gap-7 flex flex-col tablet:flex-row'>
                            <div className='flex flex-col w-full tablet:w-1/2'>
                                <label className='font-medium text-sm text-gray-400 '>
                                    Event Promoter Link
                                </label>
                                <input
                                    className='border rounded-md px-2 py-[6px] mt-1'
                                    placeholder='Event promoter link'
                                    type='text'
                                    {...register("promoLink")}
                                />
                                {errors.promoLink && (
                                    <p className='text-red-500 text-xs pt-1'>
                                        {errors.promoLink.message}
                                    </p>
                                )}
                            </div>
                            <div className='w-full tablet:w-1/2'>
                                <div className='flex flex-col'>
                                    <label className='font-medium text-sm text-gray-400'>
                                        Need an image? Let us generate one!
                                    </label>
                                    <button
                                        type='button'
                                        className='bg-primaryText text-white px-9 py-2 rounded-md font-semibold mt-1'
                                        onClick={handleOpenModal}>
                                        {aiImage
                                            ? "Preview Image"
                                            : "Generate AI Image"}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='mt-5 flex w-full justify-between gap-7 flex-col tablet:flex-row'>
                            <div className='w-full tablet:w-1/2'>
                                <FileUploader
                                    name='file'
                                    handleChange={handleWaiver}
                                    types={["pdf"]}
                                    ha
                                    classes='pdfuploader'
                                    multiple={false}
                                    label='Select or drag & drop your Waiver PDF file here!'
                                />
                            </div>
                            <div className='w-full tablet:w-1/2'>
                                <FileUploader
                                    name='file'
                                    handleChange={handleImage}
                                    types={["JPG", "PNG", "GIF"]}
                                    classes='pdfuploader'
                                    multiple={false}
                                    label='Select or drag & drop your Ride Image file here!'
                                />
                            </div>
                        </div>
                    </div>
                    <div className='flex gap-6'>
                        {waiver && (
                            <div className='mt-3'>
                                <label className='font-medium text-gray-600 '>
                                    Selected Waiver PDF:
                                </label>
                                <div className='mt-1 relative'>
                                    <embed
                                        src={URL.createObjectURL(waiver)}
                                        type='application/pdf'
                                        width='400px'
                                        height='225px'
                                    />
                                    <IoMdClose
                                        className='text-black rounded-full bg-[#ffffff30] text-xl top-3 right-6 absolute cursor-pointer'
                                        onClick={() => setWaiver(null)}
                                    />
                                </div>
                            </div>
                        )}
                        {image && (
                            <div className='mt-3  overflow-hidden '>
                                <label className='font-medium text-gray-600'>
                                    Selected Ride Image:
                                </label>
                                <div className='mt-1 relative w-[400px] h-[250px]'>
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt='Selected Ride Image'
                                        className=''
                                    />
                                    <IoMdClose
                                        className='text-black rounded-full bg-[#ffffff30] backdrop-blur-sm  text-xl top-3 right-3 absolute cursor-pointer'
                                        onClick={() => setImage(null)}
                                    />
                                </div>
                            </div>
                        )}
                        {aiImage && (
                            <div className='mt-3  overflow-hidden '>
                                <label className='font-medium text-gray-600'>
                                    Selected AI Image:
                                </label>
                                <div className='mt-1 relative w-[400px] h-[250px]'>
                                    <img
                                        src={aiImage}
                                        alt='Selected Ride Image'
                                        className=' '
                                    />
                                    <IoMdClose
                                        className='text-black rounded-full bg-[#ffffff30] backdrop-blur-sm  text-xl top-3 right-3 absolute cursor-pointer'
                                        onClick={() => setAiImage(null)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='flex justify-between mt-6 '>
                        <button
                            type='button'
                            onClick={startOver}
                            className='text-sm tablet:text-base bg-gray-100 shadow-md text-gray-600 px-3 py-2 rounded-md font-semibold h-fit'>
                            START OVER
                        </button>
                        <div className='flex gap-3 flex-col-reverse tablet:flex-row'>
                            <button
                                type='button'
                                onClick={handelPrevious}
                                className='text-sm tablet:text-base bg-gray-100 shadow-md text-gray-600 px-3 py-2 rounded-md font-semibold'>
                                PREVIOUS
                            </button>
                            <button
                                type='submit'
                                className='text-sm tablet:text-base bg-primaryText text-white px-9 py-2 rounded-md font-semibold w-32'>
                                {finalLoading ? (
                                    <CgSpinner className='mx-auto animate-spin w-6 h-6' />
                                ) : (
                                    "FINISH"
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            }
            <Modal
                isOpen={modalIsOpen}
                style={customStyles}
                contentLabel='Generate AI Image'>
                <div className='w-[300px] tablet:w-[500px]  relative'>
                    <div className='flex flex-col'>
                        <label className='font-medium text-gray-600 text-xs tablet:text-base'>
                            Need an image? Let us generate one!
                        </label>
                        <div className='flex gap-3 mt-2'>
                            <input
                                className='border px-2 py-[6px] w-full'
                                placeholder='Enter your keyword'
                                type='text'
                                value={dallEInput}
                                onChange={handleChange}
                            />
                            <button
                                type='submit'
                                disabled={loading}
                                className='bg-primaryText text-white px-3 tablet:px-9  py-1 rounded-md font-semibold text-xs tablet:text-base'
                                onClick={handleGenerate}>
                                {loading ? (
                                    <CgSpinner className='mx-auto animate-spin w-6 h-6' />
                                ) : (
                                    "Generate"
                                )}
                            </button>
                        </div>
                    </div>
                    <div className='h-40 tablet:h-[250px] mx-2 my-6 border rounded-md overflow-hidden '>
                        {aiImage && (
                            <div className='w-full '>
                                <Image
                                    src={aiImage}
                                    alt='Generated AI'
                                    width={500}
                                    height={350}
                                />
                            </div>
                        )}
                    </div>
                    <div className='flex justify-end'>
                        <button
                            type='submit'
                            disabled={loading}
                            className='bg-primaryText text-white  px-3 tablet:px-9 py-2 tablet:py-2 text-xs tablet:text-base rounded-md font-semibold'
                            onClick={handleCloseModal}>
                            Add Image
                        </button>
                    </div>
                    <IoCloseSharp
                        className='absolute -top-3 -right-3 text-xl cursor-pointer'
                        onClick={handleCloseModal}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default Form4;
