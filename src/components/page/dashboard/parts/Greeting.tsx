import React from 'react';

interface GreetingProps {
  icon: {
    src: string;
  };
  greeting: string|undefined;
  name: string;
  rides:number
}

const Greeting: React.FC<GreetingProps> = ({ icon, greeting, name , rides }) => (
  <div className="flex items-center gap-3">
    <img src={icon.src} alt={`${greeting}`} className="w-20" />
  <div>
      <p className="text-3xl font-bold">{greeting} <span className="text-primaryButton">{name}</span></p>
      <p>{rides?`There are ${rides} upcoming rides in your area!`:"There are no upcoming rides in your area!"}
        </p>
    </div>
  </div>
);

export default Greeting;
