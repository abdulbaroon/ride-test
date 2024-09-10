import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface GreetingProps {
    icon: IconDefinition;
    greeting: string | undefined;
    name: string;
    rides: number;
}

const Greeting: React.FC<GreetingProps> = ({ icon, greeting, name, rides }) => (
    <div className='flex items-center gap-3'>
        {/* <img src={icon.src} alt={`${greeting}`} className='w-16 mt-2' /> */}
        <FontAwesomeIcon
            icon={icon}
            size='3x'
            className='fa-fw text-neutral-500'
        />
        <div>
            <p className='text-2xl font-bold'>
                {greeting} <span className='text-primaryButton'>{name}</span>
            </p>
            <p className='text-sm'>
                {rides
                    ? `There are ${rides} upcoming rides in your area!`
                    : "There are no upcoming rides in your area!"}
            </p>
        </div>
    </div>
);

export default Greeting;
