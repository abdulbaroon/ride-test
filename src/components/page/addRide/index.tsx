"use client";
import React, { useEffect, useState } from "react";
import Form1 from "./parts/Form1";
import Form2 from "./parts/Form2";
import Form3 from "./parts/Form3";
import { useDispatch, useSelector } from "react-redux";
import {
    getActivityTag,
    getActivityType,
    getDifficultyLevel,
    getHubList,
} from "@/redux/slices/addRideSlice";
import { AppDispatch, RootState } from "@/redux/store/store";
import Form4 from "./parts/Form4";
import Success from "./parts/Success";
import { User } from "@/shared/types/account.types";

/**
 * Names of each step in the form process.
 */
const stepName = [
    "Have a Route?",
    "Route Details",
    "Ride Details",
    "Ride Options",
];

/**
 * Interface for form data, with optional keys to accommodate different forms.
 */
interface FormData {
    [key: string]: any;
    routeType?: string;
}

/**
 * Props passed to each form component.
 * @property nextForm - A function to move to the next form.
 * @property formData - Data gathered from previous forms.
 * @property startOver - A function to reset the entire form process.
 * @property prevForm - A function to move to the previous form.
 * @property form - The current form step number.
 */
interface FormProps {
    nextForm: (data: FormData) => void;
    formData: FormData;
    startOver: () => void;
    prevForm: () => void;
    form: number;
}

/**
 * Main component for adding a ride.
 * Manages multiple form steps and user inputs across steps.
 *
 * @returns JSX.Element - The add ride page UI.
 */
export const AddRidePage: React.FC = () => {
    const [currentForm, setCurrentForm] = useState<number>(1);
    const [formData, setFormData] = useState<FormData>({});
    const [success, setSuccess] = useState<number>();
    const userData = useSelector<RootState>((state) => state.auth.user) as User;
    const dispatch = useDispatch<AppDispatch>();

    /**
     * Fetch necessary data on initial render and when user data changes.
     */
    useEffect(() => {
        dispatch(getDifficultyLevel());
        dispatch(getActivityType());
        dispatch(getActivityTag());
        if (userData.id) {
            dispatch(getHubList(userData.id));
        }
    }, [userData]);

    /**
     * Moves to the next form, while merging new form data with existing data.
     * @param data - New form data to merge with existing state.
     */
    const nextForm = (data: FormData) => {
        setFormData({ ...formData, ...data });
        if (currentForm < stepName.length) {
            setCurrentForm(currentForm + 1);
        }
    };

    /**
     * Moves to the previous form and clears data if going back to the first step.
     */
    const prevForm = () => {
        if (currentForm > 1) {
            setCurrentForm(currentForm - 1);
        }
        if (currentForm === 2) {
            setFormData({});
        }
    };

    /**
     * Resets the form process to the first step and clears all data.
     */
    const startOver = () => {
        setCurrentForm(1);
        setFormData({});
    };

    /**
     * Mapping of form step numbers to corresponding form components.
     */
    const resultBox: { [key: number]: JSX.Element } = {
        1: (
            <Form1
                nextForm={nextForm}
                formData={formData}
                startOver={startOver}
            />
        ),
        2: (
            <Form2
                nextForm={nextForm}
                formData={formData}
                startOver={startOver}
                prevForm={prevForm}
            />
        ),
        3: (
            <Form3
                nextForm={nextForm}
                formData={formData}
                startOver={startOver}
                prevForm={prevForm}
            />
        ),
        4: (
            <Form4
                nextForm={nextForm}
                formData={formData}
                startOver={startOver}
                prevForm={prevForm}
                setSuccess={(id: number) => setSuccess(id)}
            />
        ),
    };

    return (
        <section className=''>
            {success ? (
                <Success id={success} />
            ) : (
                <div className='bg-white w-[95%] !max-w-[1320px] mx-auto my-10 py-2 rounded-md mt-28 border border-neutral-300'>
                    <div className='border-b'>
                        <h1 className='text-xl tablet:text-3xl font-bold m-5 '>
                            Add a Ride
                        </h1>
                    </div>
                    <div className='px-2 tablet:px-5 '>
                        <h5 className='text-20 sm:text-32 font-semibold'>
                            {/* {stepName[currentForm - 1]} */}
                        </h5>
                        <div className='grid place-items-center mt-5 px-2 rounded-md border border-neutral-100 bg-slate-100'>
                            <div className='flex justify-between my-8 w-[90%] items-center relative gap-2'>
                                {stepName.map((_, i) => (
                                    <React.Fragment key={i}>
                                        <div className='flex gap-1 items-center relative'>
                                            <div
                                                className={`relative text-white z-0 h-5 w-5 sm:h-7 sm:w-7 text-[12px] sm:text-base font-semibold rounded-full grid place-items-center cursor-pointer ${
                                                    i < currentForm
                                                        ? "bg-primaryText text-primaryWhite"
                                                        : "bg-gray-500 border border-primaryBlack"
                                                }`}>
                                                {i + 1}
                                            </div>
                                            <p
                                                className={`text-gray-500 font-semibold truncate absolute desktop:static text-[9px] tablet:text-sm desktop:text-base top-5 sm:top-7 -left-4 tablet:-left-8
                ${i < currentForm ? " text-primaryText" : ""}`}>
                                                {stepName[i]}
                                            </p>
                                        </div>
                                        {i < stepName.length - 1 && (
                                            <div
                                                className={`h-[1px] sm:h-[2px] flex-1 ${
                                                    i < currentForm - 1
                                                        ? "bg-primaryButton"
                                                        : "bg-gray-200"
                                                }`}
                                            />
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                        <div className='mt-10'>{resultBox[currentForm]}</div>
                    </div>
                </div>
            )}
        </section>
    );
};
