"use client";
import { AppDispatch, RootState } from "@/redux/store/store";
import { ChangeEvent, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useForm, SubmitHandler } from "react-hook-form";
import { IoMdArrowDropdown, IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import Modal from 'react-modal';
import { genrateImage } from "@/redux/slices/addRideSlice";
import { toast } from "react-toastify";
import { CgSpinner } from "react-icons/cg";
import { IoCloseSharp } from "react-icons/io5";
import { User } from "@/shared/types/account.types";
import { saveRide } from "../feature/rideFeature";
import Select, { IndicatorSeparatorProps } from 'react-select'
import Creatable from 'react-select/creatable';
import Image from "next/image";
import { components } from 'react-select';
import { IoMdAdd } from "react-icons/io";
import { GoPlusCircle } from "react-icons/go";
import { ImGlass } from "react-icons/im";
import Success from "./Success";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

interface Form1Props {
    nextForm: (data: FormData) => void;
    formData?: FormData;
    startOver: () => void;
    prevForm?: () => void;
    setSuccess?: (id:number) => void;
}

interface FormData {
    routeType?: string;
    isGroup?: boolean;
    activityTags?: string[];
    hubList?: number[];
    promoLink?: string;
}

interface HubList {
    hubID: number;
    hubName: string;
}
const indicatorSeparatorStyle = {
    alignSelf: 'stretch',
    backgroundColor: "blue",
    marginBottom: 8,
    marginTop: 8,
    width: 1,
};

const IndicatorSeparator = ({
    innerProps,
}: IndicatorSeparatorProps<any, true>) => {
    return <span style={indicatorSeparatorStyle} {...innerProps} />;
};


const CustomOption = (props: any) => {
    return (
        <components.Option {...props}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {props.data.__isNew__ && <GoPlusCircle style={{ marginRight: 4 }} />}
                {props.children}
            </div>
        </components.Option>
    );
};
const Form4: React.FC<Form1Props> = ({ nextForm, formData, startOver, prevForm, setSuccess }) => {
    const [modalIsOpen, setIsOpen] = useState<boolean>(false);
    const [dallEInput, setDallEInput] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [finalLoading, setFinalLoading] = useState<boolean>()
    const [aiImage, setAiImage] = useState<string | null>(null);
    const [image, setImage] = useState<File | null>()
    const [waiver, setWaiver] = useState<File | null>()
    const [select, setSelect] = useState<string[]>([])
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const dispatch = useDispatch<AppDispatch>();
    const activityTags = useSelector<RootState, string[]>((state) => state.addRide.activityTags);
    const hubList = useSelector<RootState, HubList[]>((state) => state.addRide.hubList);
    const formattedActivityTags = activityTags.map(tag => ({ label: tag, value: tag }));
    const userData = useSelector<RootState>((state) => state.auth.user) as User
    const handleSubmits: SubmitHandler<FormData> = async (data) => {
        const payload = {
            routeData: {
                ...formData,
                ...data,
                document: waiver,
                image: image,
                dalleUrl: aiImage,
                tags: select
            },
            user: userData
        }
        const onSuccess = (response: any) => {
            console.log(response.payload.activityID,"sucess")
            toast.success('Ride saved successfully');
            setSuccess?.(response.payload.activityID)
        };

        const onError = (error: any) => {
            toast.error('Error while saving ride');
        };
        setFinalLoading(true)
        await saveRide(dispatch, onSuccess, onError, payload);
        setFinalLoading(false)
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDallEInput(e.target.value);
    };

    const handleGenerate = async () => {
        const payload = {
            prompt: dallEInput,
            distance: 121
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

    const handleOpenModal = () => {
        setIsOpen(true);
    };

    const handleCloseModal = () => {
        setIsOpen(false);
    };
    const handleWaiver = (file: File) => {
        setWaiver(file)
    }
    const handleImage = (file: File) => {
        setImage(file)
    }
    const handleSelect = (selectedOptions: any) => {
        const tags = selectedOptions?.map((item: any) => item.label)
        setSelect(tags)
    };
    const renderCheckbox = (label: string, description: string, field: string) => (
        <div className="border-b w-full tablet:w-1/2 pb-2">
            <label className="inline-flex items-center cursor-pointer">
                <input {...register(field as keyof FormData)} type="checkbox" className="sr-only peer" />
                <div className="relative me-3 w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primaryButton"></div>
                <div className="flex flex-col leading-5 w-[85%]">
                    <span className="font-medium">{label}</span>
                    <span className="text-sm text-gray-500">{description}</span>
                </div>
            </label>
        </div>
    );

    return (
        <div className="mt-2 mb-5">
            {<form onSubmit={handleSubmit(handleSubmits)} className="">
                <div>
                    <div className="flex gap-7 mt-5 flex-col tablet:flex-row">
                        {renderCheckbox("Community", "Can’t lead the ride, select this option set as a community ride.", "isCommunity")}
                        {renderCheckbox("Private", "Private ride. You must invite your friends.", "isPrivate")}
                    </div>
                    <div className="flex gap-7 mt-5 flex-col tablet:flex-row">
                        {renderCheckbox("Drop", "Want to wait for anyone that may drop off?", "isDrop")}
                        {renderCheckbox("Lights Required", "Need to ensure all has lights for safety?", "isLights")}
                    </div>
                    <div className="flex gap-7 mt-5 flex-col tablet:flex-row">
                        <div className="flex flex-col w-full tablet:w-1/2">

                            <label className="font-medium text-gray-600">Activity Tags</label>
                            <div className="flex flex-col relative mt-1">
                                <Creatable
                                    closeMenuOnSelect={false}
                                    components={{ IndicatorSeparator, Option: CustomOption }}
                                    isMulti
                                    options={formattedActivityTags}
                                    onChange={handleSelect}
                                />
                            </div>
                            {errors.activityTags && (
                                <p className="text-red-500 text-xs pt-1">{errors.activityTags.message}</p>
                            )}
                        </div>
                        <div className="flex flex-col w-full tablet:w-1/2">
                            <label className="font-medium text-gray-600">Hub List</label>
                            <div className="flex flex-col relative mt-1">
                                <select
                                    {...register("hubList")}
                                    className="bg-white border px-2 py-[6px]"
                                >
                                    <option value="" disabled selected>
                                        Select Hub
                                    </option>
                                    {hubList.map((data) => (
                                        <option value={data.hubID} key={data.hubID}>
                                            {data.hubName}
                                        </option>
                                    ))}
                                </select>
                                <IoMdArrowDropdown className="w-5 h-auto absolute right-3 top-[11px]" />
                            </div>
                            {errors.hubList && (
                                <p className="text-red-500 text-xs pt-1">{errors.hubList.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="mt-5 gap-7 flex flex-col tablet:flex-row">
                        <div className="flex flex-col w-full tablet:w-1/2">
                            <label className="font-medium text-gray-600">Event Promoter Link</label>
                            <input
                                className="border px-2 py-[6px] mt-1"
                                placeholder="Event promoter link"
                                type="text"
                                {...register("promoLink")}
                            />
                            {errors.promoLink && (
                                <p className="text-red-500 text-xs pt-1">{errors.promoLink.message}</p>
                            )}
                        </div>
                        <div className="w-full tablet:w-1/2">
                            <div className="flex flex-col">
                                <label className="font-medium text-gray-600">Need an image? Let us generate one!</label>
                                <button type="button" className="bg-primaryText text-white px-9 py-2 rounded-md font-semibold mt-1" onClick={handleOpenModal}>
                                    {aiImage ? "Preview Image" : "Generate AI Image"}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 flex w-full justify-between gap-7 flex-col tablet:flex-row">
                        <div className="w-full tablet:w-1/2">
                            <FileUploader name="file" handleChange={handleWaiver} types={["pdf"]} ha classes="pdfuploader" multiple={false} label="Select or drag & drop your Waiver PDF file here!" />
                        </div>
                        <div className="w-full tablet:w-1/2">
                            <FileUploader name="file" handleChange={handleImage} types={["JPG", "PNG", "GIF"]} classes="pdfuploader" multiple={false} label="Select or drag & drop your Ride Image file here!" />
                        </div>
                    </div>
                </div>
                <div className="flex gap-6">
                    {waiver && (
                        <div className="mt-3">
                            <label className="font-medium text-gray-600 ">Selected Waiver PDF:</label>
                            <div className="mt-1 relative">
                                <embed src={URL.createObjectURL(waiver)} type="application/pdf" width="400px" height="225px" />
                                <IoMdClose className="text-black rounded-full bg-[#ffffff30] text-xl top-3 right-6 absolute cursor-pointer" onClick={() => setWaiver(null)} />
                            </div>
                        </div>
                    )}
                    {image && (
                        <div className="mt-3  overflow-hidden ">
                            <label className="font-medium text-gray-600">Selected Ride Image:</label>
                            <div className="mt-1 relative w-[400px] h-[250px]">
                                <img src={URL.createObjectURL(image)} alt="Selected Ride Image" className=" " />
                                <IoMdClose className="text-black rounded-full bg-[#ffffff30] backdrop-blur-sm  text-xl top-3 right-3 absolute cursor-pointer" onClick={() => setImage(null)} />
                            </div>
                        </div>
                    )}
                    {aiImage && (
                        <div className="mt-3  overflow-hidden ">
                            <label className="font-medium text-gray-600">Selected AI Image:</label>
                            <div className="mt-1 relative w-[400px] h-[250px]">
                                <img src={aiImage} alt="Selected Ride Image" className=" " />
                                <IoMdClose className="text-black rounded-full bg-[#ffffff30] backdrop-blur-sm  text-xl top-3 right-3 absolute cursor-pointer" onClick={() => setAiImage(null)} />
                            </div>
                        </div>
                    )}

                </div>
                <div className="flex justify-between mt-6 ">
                    <button type="button" onClick={startOver} className="text-sm tablet:text-base bg-gray-100 shadow-md text-gray-600 px-3 py-2 rounded-md font-semibold h-fit">START OVER</button>
                    <div className="flex gap-3 flex-col-reverse tablet:flex-row">
                        <button type="button" onClick={prevForm} className="text-sm tablet:text-base bg-gray-100 shadow-md text-gray-600 px-3 py-2 rounded-md font-semibold">PREVIOUS</button>
                        <button type="submit" className="text-sm tablet:text-base bg-primaryText text-white px-9 py-2 rounded-md font-semibold w-32">
                            {finalLoading ? <CgSpinner className='mx-auto animate-spin w-6 h-6' /> : "FINISH"}
                        </button>
                    </div>
                </div>
            </form>
            }
            <Modal
                isOpen={modalIsOpen}
                style={customStyles}
                contentLabel="Generate AI Image"
            >
                <div className="w-[300px] tablet:w-[500px]  relative">
                    <div className="flex flex-col">
                        <label className="font-medium text-gray-600 text-xs tablet:text-base">Need an image? Let us generate one!</label>
                        <div className="flex gap-3 mt-2">
                            <input
                                className="border px-2 py-[6px] w-full"
                                placeholder="Enter your keyword"
                                type="text"
                                value={dallEInput}
                                onChange={handleChange}
                            />
                            <button type="submit" disabled={loading} className="bg-primaryText text-white px-3 tablet:px-9  py-1 rounded-md font-semibold text-xs tablet:text-base" onClick={handleGenerate}>
                                {loading ? <CgSpinner className='mx-auto animate-spin w-6 h-6' /> : "Generate"}
                            </button>
                        </div>
                    </div>
                    <div className="h-40 tablet:h-[250px] mx-2 my-6 border rounded-md overflow-hidden ">
                        {aiImage && (
                            <div className="w-full ">
                                <Image src={aiImage} alt="Generated AI" width={500} height={350} />
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" disabled={loading} className="bg-primaryText text-white  px-3 tablet:px-9 py-2 tablet:py-2 text-xs tablet:text-base rounded-md font-semibold" onClick={handleCloseModal}>
                            Add Image
                        </button>
                    </div>
                    <IoCloseSharp className="absolute -top-3 -right-3 text-xl cursor-pointer" onClick={handleCloseModal} />
                </div>
            </Modal>
        </div>
    );
};

export default Form4;
