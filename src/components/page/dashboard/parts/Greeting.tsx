import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

/**
 * Props for the Greeting component.
 *
 * @interface GreetingProps
 * @property {IconDefinition} icon - The FontAwesome icon to display.
 * @property {string | undefined} greeting - The greeting message.
 * @property {string} name - The name of the user to greet.
 * @property {number} rides - The number of upcoming rides in the user's area.
 */
interface GreetingProps {
    icon: IconDefinition;
    greeting: string | undefined;
    name: string;
    rides: number;
}

/**
 * Greeting component that displays a personalized greeting message 
 * along with the number of upcoming rides in the user's area.
 *
 * @component
 * @param {GreetingProps} props - The props for the Greeting component.
 * @returns {JSX.Element} The rendered Greeting component.
 */
const Greeting: React.FC<GreetingProps> = ({ icon, greeting, name, rides }) => (
    <div className='flex items-center gap-3'>
        {/* Icon displayed beside the greeting message */}
        <FontAwesomeIcon
            icon={icon}
            size='3x'
            className='fa-fw text-neutral-500'
        />
        <div>
            {/* Greeting message with the user's name */}
            <p className='text-2xl font-bold'>
                {greeting} <span className='text-primaryButton'>{name}</span>
            </p>
            {/* Message indicating the number of upcoming rides */}
            <p className='text-sm'>
                {rides
                    ? `There are ${rides} upcoming rides in your area!`
                    : "There are no upcoming rides in your area!"}
            </p>
        </div>
    </div>
);

export default Greeting;
