import Link from 'next/link';
import React from 'react';

const Page = () => {
  return (
    <div className="flex flex-col items-center mt-32 justify-center min-h-screen bg-gray-800 py-2">
      <div className="bg-white p-2 rounded-lg shadow-md text-black w-52 mt-3">
        <div className="flex items-start space-y-1 flex-col ">
          <img className='w-full rounded' src="https://dev.chasingwatts.com/ogmaps/ogmap_687.png" alt="img" />
          <h4 className="text-sm font-semibold text-gray-700">dsfsdajkf wqrfqwfqwer qwerqwerq qwetrqwe </h4>
          <p className="my-1 text-sm">Fri, Aug 2, 2024</p>
        </div>
        <div className='w-full  flex justify-center mt-5'>
          <Link className='px-6  py-[5px] bg-primaryText font-bold text-white rounded-sm' href={"#"}>View Ride</Link>
        </div>
      </div>
    </div>
  );
};

export default Page;