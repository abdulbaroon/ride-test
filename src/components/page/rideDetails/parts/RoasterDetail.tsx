import { IMAGE_URl, } from '@/constant/appConfig';
import { RootState } from '@/redux/store/store';
import { Item } from '@/shared/types/dashboard.types';
import { RosterDetail } from '@/shared/types/rideDetail.types';
import { Avatar } from '@chakra-ui/react';
import { isArray } from 'lodash';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';


interface TabStatus {
  [key: number]: string;
}
const RoasterDetail = () => {
  const [roster, setRoster] = useState<RosterDetail[]>([]);
  const [selectedTab, setSelectedTab] = useState<number>(1);

  const rosterDetail = useSelector<RootState, RosterDetail[]>((state) => state.rideDetail.rosterDetails);
  const rides = useSelector<RootState>((state) => state.rideDetail.rides) as Item;
 
  console.log(rosterDetail,"sdf")
  const tabStatuses:TabStatus = {
    1: 'Yes',
    2: 'Interested',
    3: 'No'
  };
  const filterRosters = (typeID: number) => {
    return isArray(rosterDetail) && rosterDetail?.filter((data) => data?.responseTypeModel.responseTypeName === tabStatuses[typeID]) || [];
  };

  useEffect(() => {
    
    const filteredRoster = isArray(rosterDetail) && rosterDetail?.filter((data) => data?.responseTypeModel.responseTypeName === tabStatuses[selectedTab]) || [];
    setRoster(filteredRoster);
  }, [selectedTab, rosterDetail]);

  const getBackgroundColor = (tabNumber: number) => {
    switch (tabNumber) {
      case 1:
        return '#e6f9f3';
      case 2:
        return '#fff5e0';
      case 3:
        return '#feebec';
      default:
        return '#ffffff';
    }
  };

  return (
    <section id='roster'>
      <div className={`bg-white min-h-40 border rounded-lg sticky top-28 p-5`} >
        <div className="flex gap-2">
          {['Joined', 'Maybe', 'Nope'].map((tabName, tabIndex) => (
            <button
              key={tabIndex}
              onClick={() => setSelectedTab(tabIndex + 1)}
              className={`w-full py-[10px] rounded-lg uppercase shadow-sm hover:shadow-lg ${tabIndex + 1 === selectedTab && "shadow-lg border text-primaryText"}`}
              style={{ backgroundColor: getBackgroundColor(tabIndex + 1), borderColor: getBackgroundColor(tabIndex + 1) }}
            >
              {tabName} ({filterRosters(tabIndex + 1).length})
            </button>
          ))}
        </div>
        <div>
          {rides.isGroup ? (
            <>
              {["A", "B", "C"].map((group) => (
                <div key={group} className='mt-3'>
                  {roster?.filter(r => r.groupLevel === group)?.length > 0 && <div className='w-full bg-teal-200 mt-3 px-4  py-[6px] rounded-lg' style={{ backgroundColor: getBackgroundColor(selectedTab) }}>
                    {`${['Yes', 'Interested ', 'No'][selectedTab - 1]} ${group} (${roster?.filter(r => r.groupLevel === group).length}) `}
                  </div>}
                  {roster?.filter(r => r.groupLevel === group)?.map((data, index) => (
                    <div key={index} className='flex items-center mt-2 gap-5'>
                      <Avatar
                        boxSize="40px"
                        borderWidth="2px"
                        borderColor={getBackgroundColor(selectedTab)}
                        name={`${data.userProfileModel.firstName} ${data.userProfileModel.lastName}`} size='sm'
                        src={`${IMAGE_URl}/useravatar/pfimg_${data.userProfileModel.userID}.png?lastmod=${data.modifiedDate}`} />
                      <Link href={`/friend/${data.userProfileModel.userID}`}  className='text-primaryText'>
                        <p>{data.userProfileModel.firstName} {data.userProfileModel.lastName}</p>
                      </Link>
                    </div>
                  ))}
                </div>
              ))}
              {roster.length === 0 && (selectedTab === 3 ?
                <div className='text-gray-500'>
                  <p>Not ready to commit?</p>
                  <p>Join as interested and stay in the know.</p>
                </div> :
                <div className='text-gray-500'>
                  <p>Be a leader!</p>
                  <p>Join the ride and start the cool trend.</p>
                </div>)
              }
            </>
          ) : (
            <>
              <div className='w-full bg-teal-200 mt-3 p-1 rounded-lg' style={{ backgroundColor: getBackgroundColor(selectedTab) }}>
                {`${['Yes', 'Interested ', 'No'][selectedTab - 1]} (${roster.length}) `}
              </div>
              {roster.map((data, index) => (
                <div key={index} className='flex items-center mt-2 gap-5'>
                  <Avatar
                    boxSize="40px"
                    borderWidth="2px"
                    borderColor={getBackgroundColor(selectedTab)}
                    name={`${data.userProfileModel.firstName} ${data.userProfileModel.lastName}`} size='sm'
                    src={`${IMAGE_URl}/useravatar/pfimg_${data.userProfileModel.userID}.png?lastmod=${data.modifiedDate}`} />
                  <Link href={`/friend/${data.userProfileModel.userID}`} className='text-primaryText'>
                    <p>{data.userProfileModel.firstName} {data.userProfileModel.lastName}</p>
                  </Link>
                </div>
              ))}
              {roster.length === 0 && (selectedTab === 3 ?
                <div className='text-gray-500'>
                  <p>Not ready to commit?</p>
                  <p>Join as interested and stay in the know.</p>
                </div> :
                <div className='text-gray-500'>
                  <p>Be a leader!</p>
                  <p>Join the ride and start the cool trend.</p>
                </div>)
              }
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default RoasterDetail;