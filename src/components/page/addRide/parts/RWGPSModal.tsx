import React, { useState, useEffect } from "react";
import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { CgSpinner } from "react-icons/cg";
import { isArray } from "lodash";
import { AppDispatch, RootState } from "@/redux/store/store";
import { getRwgpsUserRoute } from "@/redux/slices/externalServicesSlice";
import Link from "next/link";

interface RWGPSModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId?: any;
    setValue: any;
}

const RWGPSModal: React.FC<RWGPSModalProps> = ({
    isOpen,
    onClose,
    userId,
    setValue,
}) => {
    const { register, handleSubmit } = useForm();
    const dispatch = useDispatch<AppDispatch>();
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const RwgpsUserRoute = useSelector<RootState, any>(
        (state) => state.externalServices.RwgpsUserRoute
    );

    useEffect(() => {
        if (userId) {
            dispatch(getRwgpsUserRoute(userId));
        }
    }, [userId, dispatch]);

    const userRoute =
        isArray(RwgpsUserRoute) &&
        RwgpsUserRoute.filter((route: any) =>
            route.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const handleSelectRoute = (id: number) => {
        setValue("url", `https://www.ridewithgps.com/routes/${id}`);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Select Route</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form
                        className='max-w-md mx-auto'
                        onSubmit={handleSubmit(() => {})}>
                        <div className='relative'>
                            <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
                                <svg
                                    className='w-4 h-4 text-gray-500'
                                    aria-hidden='true'
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 20 20'>
                                    <path
                                        stroke='currentColor'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2'
                                        d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
                                    />
                                </svg>
                            </div>
                            <input
                                {...register("search")}
                                type='search'
                                id='default-search'
                                className='block w-full p-4 ps-10 text-sm border rounded-lg'
                                placeholder='Search your RWGPS routes'
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </form>
                    <div className='mt-5 space-y-3 max-h-[450px] overflow-y-auto'>
                        {isArray(userRoute) && userRoute.length > 0 ? (
                            userRoute.map((data: any) => (
                                <div
                                    key={data.id}
                                    className='flex border border-neutral-300 rounded-md overflow-hidden gap-3 p-3'>
                                    <div className='w-28 rounded-lg overflow-hidden'>
                                        <img
                                            className='w-full'
                                            src={`https://ridewithgps.com/routes/${data.id}/thumb.png`}
                                            alt={data.name}
                                        />
                                    </div>
                                    <div>
                                        <p className='text-lg font-bold'>
                                            {data.name}
                                        </p>
                                        <p className='text-base'>
                                            {(data.distance / 1600).toFixed(2)}{" "}
                                            miles
                                        </p>
                                        <div className='flex gap-2 mt-3'>
                                            <Link
                                                className='bg-orange text-white px-2 py-1 text-xs rounded-md'
                                                href={`https://www.ridewithgps.com/routes/${data.id}`}
                                                target='_blank'>
                                                View on RWGPS
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleSelectRoute(data.id)
                                                }
                                                className='bg-primaryButton text-white px-2 py-1 text-xs rounded-md'>
                                                Select Route
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='flex justify-center items-center text-lg'>
                                <p>No Routes Found</p>
                            </div>
                        )}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant=''
                        className='text-white bg-primaryDarkblue'
                        onClick={onClose}
                        isDisabled={loading}>
                        {loading ? (
                            <CgSpinner className='animate-spin w-6 h-6' />
                        ) : (
                            "Close"
                        )}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default RWGPSModal;
