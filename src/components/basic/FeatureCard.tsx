import React, { createElement } from "react";
import { IconType } from "react-icons";

type Props = {
    tittle: string;
    desc: string;
    color: string;
    icon: IconType;
};

const FeatureCard = (props: Props) => {
    return (
        <div className='min-h-60 border relative mt-10 rounded-md'>
            <div className='p-6 flex justify-center items-center flex-col text-center'>
                <div
                    className={`w-fit text-5xl p-4 rounded-full border border-neutral-200`}
                    style={{ color: props.color, backgroundColor: "white" }}>
                    {createElement(props.icon)}
                </div>
                <h1 className='text-xl font-bold mt-10'>{props.tittle}</h1>
                <p className='text-gray-600 mt-2'>{props.desc}</p>
            </div>
        </div>
    );
};

export default FeatureCard;
