import React, { KeyboardEventHandler, useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { CgSpinner } from "react-icons/cg";
import { IoMdArrowDropdown, IoMdClose } from "react-icons/io";
import Modal from "react-modal";
import Image from "next/image";
import { IoCloseSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { User } from "@/shared/types/account.types";
import { genrateImage } from "@/redux/slices/addRideSlice";
import { toast } from "react-toastify";
import CreatableSelect from "react-select/creatable";
import Creatable from "react-select/creatable";
import { IndicatorSeparatorProps } from "react-select";
import { IMAGE_URl } from "@/constant/appConfig";

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

const indicatorSeparatorStyle = {
    alignSelf: "stretch",
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

interface HubList {
    hubID: number;
    hubName: string;
}

interface AdditionalOptionsProps {
    register: any;
    errors: any;
    data: any;
    setData: any;
}
interface Option {
    readonly label: string;
    readonly value: string;
}

const createOption = (label: string) => ({
    label,
    value: label,
});
const components = {
    DropdownIndicator: null,
};
const AdditionalOptions: React.FC<AdditionalOptionsProps> = ({
    register,
    errors,
    data,
    setData,
}) => {
    const [modalIsOpen, setIsOpen] = useState<boolean>(false);
    const [dallEInput, setDallEInput] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [finalLoading, setFinalLoading] = useState<boolean>(false);
    const [aiImage, setAiImage] = useState<string | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [waiver, setWaiver] = useState<File | null | string>(null);
    const [select, setSelect] = useState<string[]>([]);
    const [selectTag, setSelectTag] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [value, setValue] = useState<readonly Option[]>([]);

    const dispatch = useDispatch<AppDispatch>();

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

    useEffect(() => {
        if (data) {
            const tags = data?.activityTagModel?.map((tag: any) => ({
                label: tag.activityTagName,
                value: tag.activityTagName,
            }));
            setValue(tags);
            setImage(
                data?.activityPictureModel
                    ?.filter((item: any) => !item?.isMap)
                    ?.map((item: any) => IMAGE_URl + item?.picturePath)?.[0]
            );
            const pdf = data?.hasWaiver
                ? IMAGE_URl + `/ridewaivers/ridewaiver_${data.activityID}.pdf`
                : null;
            setWaiver(pdf);
            setAiImage(data?.dalleUrl);
        }
        setData({
            document: waiver,
            image: image,
            dalleUrl: aiImage,
            tags: select?.map((item: any) => item.label),
        });
    }, [data]);

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
    useEffect(() => {
        setData({
            document: waiver,
            image: image,
            dalleUrl: aiImage,
            tags: value?.map((item: any) => item.label),
        });
    }, [waiver, image, aiImage, value]);

    const handleOpenModal = () => {
        setIsOpen(true);
    };

    const handleCloseModal = () => {
        setIsOpen(false);
    };

    const handleWaiver = (file: File) => {
        setWaiver(file);
    };

    const handleImage = (file: File) => {
        setImage(file);
    };

    const renderCheckbox = (
        label: string,
        description: string,
        field: string
    ) => (
        <div className='border-b w-full tablet:w-1/2 pb-2'>
            <label className='inline-flex items-center cursor-pointer'>
                <input
                    {...register(field as keyof FormData)}
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
        <div className='mt-2 mb-5 p-5 '>
            <div>
                <div className='flex gap-7 mt-5 flex-col tablet:flex-row'>
                    {renderCheckbox(
                        "Community",
                        "Can’t lead the ride, select this option to set as a community ride.",
                        "isCommunity"
                    )}
                    {renderCheckbox(
                        "Private",
                        "This will not show publicly in feeds. You must invite your friends.",
                        "isPrivate"
                    )}
                </div>
                <div className='flex gap-7 mt-5 flex-col tablet:flex-row'>
                    {renderCheckbox(
                        "No Drop",
                        "Want to wait for anyone that may drop off?",
                        "isDrop"
                    )}
                    {renderCheckbox(
                        "Lights Required",
                        "Need to ensure all has lights for safety?",
                        "isLights"
                    )}
                </div>
                <div className='flex gap-7 mt-5 flex-col tablet:flex-row'>
                    <div className='flex flex-col w-full tablet:w-1/2'>
                        <label className='font-medium text-gray-600'>
                            Activity Tags
                        </label>
                        <div className='flex flex-col relative mt-1'>
                            <CreatableSelect
                                components={components}
                                inputValue={inputValue}
                                isClearable
                                isMulti
                                menuIsOpen={false}
                                onChange={(newValue) => setValue(newValue)}
                                onInputChange={(newValue) =>
                                    setInputValue(newValue)
                                }
                                onKeyDown={handleKeyDown}
                                placeholder='Type tag and press enter...'
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
                        <label className='font-medium text-gray-600'>
                            Hub List
                        </label>
                        <div className='flex flex-col relative mt-1'>
                            <select
                                {...register("hubID")}
                                className='bg-white border rounded-md px-2 py-[6px]'>
                                <option value='' disabled selected>
                                    Select Hub
                                </option>
                                {hubList.map((data) => (
                                    <option value={data.hubID} key={data.hubID}>
                                        {data.hubName}
                                    </option>
                                ))}
                            </select>
                            <IoMdArrowDropdown className='w-5 h-auto absolute right-3 top-[11px]' />
                        </div>
                        {errors.hubList && (
                            <p className='text-red-500 text-xs pt-1'>
                                {errors.hubList.message}
                            </p>
                        )}
                    </div>
                </div>
                <div className='mt-5 gap-7 flex flex-col tablet:flex-row'>
                    <div className='flex flex-col w-full tablet:w-1/2'>
                        <label className='font-medium text-gray-600'>
                            Event Promoter Link
                        </label>
                        <input
                            className='border px-2 rounded-md py-[6px] mt-1'
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
                            <label className='font-medium text-gray-600'>
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
                            {typeof waiver === "object" && image !== null ? (
                                <embed
                                    src={URL.createObjectURL(waiver)}
                                    type='application/pdf'
                                    width='400px'
                                    height='225px'
                                />
                            ) : (
                                <embed
                                    src={waiver as string}
                                    type='application/pdf'
                                    width='400px'
                                    height='225px'
                                />
                            )}

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
                            {typeof image === "object" && image !== null ? (
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt='Selected Ride Image'
                                    className=' '
                                />
                            ) : (
                                <img
                                    src={image}
                                    alt='Selected Ride Image'
                                    className=' '
                                />
                            )}
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
                                onChange={(e) => setDallEInput(e.target.value)}
                            />
                            <button
                                type='button'
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
                            type='button'
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

export default AdditionalOptions;
