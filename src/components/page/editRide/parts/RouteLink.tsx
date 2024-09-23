import { RootState } from "@/redux/store/store";
import { useDisclosure } from "@chakra-ui/react";
import React from "react";
import { UseFormRegister, FieldErrors, useForm } from "react-hook-form";
import { CgSpinner } from "react-icons/cg";
import { useSelector } from "react-redux";
import RWGPSModal from "../../addRide/parts/RWGPSModal";
import StravaModal from "../../addRide/parts/StravaModal";
import { User } from "@/shared/types/account.types";

interface RouteLinkProps {
    register: UseFormRegister<any>;
    errors: FieldErrors;
    loading: boolean;
    handleClick: () => void;
}

interface ValueType {
    url?: string;
}

const RouteLink: React.FC<RouteLinkProps> = ({
    register,
    errors,
    loading,
    handleClick,
}) => {
    const user = useSelector<RootState>((state) => state.auth.user) as User;
    const { rwgpsAuth, stravaAuth } = useSelector<RootState, any>(
        (state) => state.externalServices
    );
    //const [value, setValue] = React.useState<any>(null);
    const { setValue, getValues } = useForm();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const {
        isOpen: stravaIsOpen,
        onOpen: stravaOnOpen,
        onClose: stravaOnClose,
    } = useDisclosure();

    const url = getValues("url");
    //console.log("url value: ", url);

    return (
        <div className='min-h-40 p-10 items-center gap-4'>
            <div className=''>
                <label className='text-gray-600 font-bold'>
                    Paste route link:
                </label>
                <div className='flex flex-row relative items-center'>
                    <div className='w-1/2'>
                        <input
                            type='input'
                            placeholder='https://www.strava.com/routes/your-route-id'
                            {...register("url", {
                                required: "Please enter a valid URL.",
                            })}
                            className={`w-full border px-2 py-2 ${
                                errors.url ? "input-error" : ""
                            }`}
                            value={url}
                        />
                        {errors.url && (
                            <p className='text-xs mt-1 text-red-600'>
                                {"Please enter a valid URL."}
                            </p>
                        )}
                    </div>
                    <div>
                        <button
                            onClick={handleClick}
                            type='button'
                            className='text-sm tablet:text-base bg-secondaryButton text-white h-fit px-9 py-2 ml-3 rounded-md font-semibold w-fit'>
                            {loading ? (
                                <CgSpinner className='mx-auto animate-spin w-6 h-6' />
                            ) : (
                                "Process Route"
                            )}
                        </button>
                    </div>
                </div>
            </div>
            <div className='flex gap-3 mt-6'>
                {rwgpsAuth.authToken && (
                    <div>
                        <button
                            onClick={onOpen}
                            className='bg-orange py-2 px-4 text-white font-bold rounded-lg'
                            type='button'>
                            My RWGPS Routes
                        </button>
                    </div>
                )}
                {stravaAuth.authToken && (
                    <div>
                        <button
                            onClick={stravaOnOpen}
                            className='bg-orange py-2 px-4 text-white font-bold rounded-lg'
                            type='button'>
                            My Strava Routes
                        </button>
                    </div>
                )}
            </div>
            <RWGPSModal
                onClose={onClose}
                isOpen={isOpen}
                userId={user.id}
                setValue={setValue}
            />
            <StravaModal
                onClose={stravaOnClose}
                isOpen={stravaIsOpen}
                userId={stravaAuth.stravaUserID}
                setValue={setValue}
            />
        </div>
    );
};

export default RouteLink;
