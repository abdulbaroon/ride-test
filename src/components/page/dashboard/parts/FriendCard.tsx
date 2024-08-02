import { RootState } from '@/redux/store/store';
import React from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';
import { useSelector } from 'react-redux';
import Select from 'react-select';

const FriendCard: React.FC = () => {
  const friendsCount = useSelector<RootState, number>((state) => state.dashboard.friendsCount);

  const options = [
    { value: 'search', label: 'Friend Search' },
    { value: 'request', label: 'Friend Request' },
    { value: 'map', label: 'Friend Map' },
    { value: 'groups', label: 'Friend Groups' },
  ];

  return (
    <div className='border rounded-lg shadow-lg bg-white sticky top-28 text-base'>
      <div className='px-4 py-4 border-b'>
        <p className='font-bold'>Make a Friend?</p>
        <p className='text-xs text-gray-500'>New folks in your area...</p>
      </div>
      <div className='px-4 py-4 border-b'>
        <p className='text-gray-500 text-base me-5'>
          There are {friendsCount} new cyclists in your area! You should connect, create a ride, and head out!
        </p>
        <div className='relative w-fit mt-4'>
          <Select
            options={options}
            classNamePrefix="react-select"
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor:"#f5f4f8",
                minWidth: 150,
                fontSize: '0.875rem',
                fontWeight: 'bold',
                padding: '0.0rem',
                borderRadius: '0.375rem',
              }),
              dropdownIndicator: (base) => ({
                ...base,
                padding: '0',
              }),
              indicatorsContainer: (base) => ({
                ...base,
                padding: '0',
              }),
            }}
            components={{
              DropdownIndicator: () => <IoMdArrowDropdown className="w-5 h-auto" />,
              IndicatorSeparator: null,
            }}
            placeholder="Select an option"
          />
        </div>
      </div>
      <div className='px-4 py-4 border-b'>
        <button className='text-sm rounded-md bg-primaryText py-[6px] px-2 text-white font-medium'>
          Invite a friend
        </button>
      </div>
    </div>
  );
};

export default FriendCard;
