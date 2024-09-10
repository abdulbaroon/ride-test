import { myFriend } from '@/assets';
import { IMAGE_URl } from '@/constant/appConfig';
import { getFriendsList, setBulkActivityRoster } from '@/redux/slices/rideDetailsSlice';
import { AppDispatch, RootState } from '@/redux/store/store';
import { UserFollowingData } from '@/shared/types/rideDetail.types';
import { Avatar, Button, Checkbox, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CgSpinner } from 'react-icons/cg';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface InviteFriendModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: number;
}

const InviteFriendModal: React.FC<InviteFriendModalProps> = ({ isOpen, onClose, userId }) => {
    const { register, handleSubmit } = useForm();
    const dispatch = useDispatch<AppDispatch>()
    const friendsList = useSelector<RootState, UserFollowingData[]>((state) => state.rideDetail.friendsList);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false)
    const [inviteFriends, setInviteFriends] = useState<{ [key: number]: boolean }>({});


    useEffect(() => {
        const invitedFriends = friendsList
            .filter(friend => friend.isConfirmed)
            .reduce((acc, friend) => {
                acc[friend.userProfileModelFollowing.userID] = false;
                return acc;
            }, {} as { [key: number]: boolean });

        setInviteFriends(invitedFriends);
    }, [friendsList]);

    const onSubmit = (data: any) => {
        setSearchTerm(data.search);
    };

    const handleChecked = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
        setInviteFriends({
            ...inviteFriends,
            [id]: event.target.checked,
        });
    };
    const handleInvite = async () => {
        const invitedList = Object.keys(inviteFriends)
            .filter(id => inviteFriends[parseInt(id, 10)])
            .map(id => ({
                activityID: userId,
                responseTypeID: 2,
                createdBy: parseInt(id, 10),
                createdDate: new Date(),
                modifiedBy: parseInt(id, 10),
                modifiedDate: new Date(),
            }));
        setLoading(true)
        const response = await dispatch(setBulkActivityRoster(invitedList))
        setLoading(false)
        if (setBulkActivityRoster.fulfilled.match(response)) {
            toast.success(`Invite sent to ${invitedList?.length} friends`)
            dispatch(getFriendsList({ id:friendsList[0].userID, activityID: userId }))
        } else if (setBulkActivityRoster.rejected.match(response)) {
            toast.error('Something went wrong adding to roster!')
        }
        onClose();
    };

    const filteredFriends = friendsList.filter(friend =>
        `${friend.userProfileModelFollowing.firstName} ${friend.userProfileModelFollowing.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Invite Friends</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form className="max-w-md mx-auto" onSubmit={handleSubmit(onSubmit)}>
                        <label className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input
                                {...register("search")}
                                type="search"
                                id="default-search"
                                className="block outline-none w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Search friends"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {/* <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Search</button> */}
                        </div>
                    </form>

                    {filteredFriends.length > 0 ?
                        filteredFriends.map((data) => (
                            <div key={data.userProfileModelFollowing.userID} className='flex justify-between items-center mt-5 border-b pb-2'>
                                <div className='flex gap-4 items-center'>
                                    <Avatar name={`${data.userProfileModelFollowing.firstName} ${data.userProfileModelFollowing.lastName}`} src={`${IMAGE_URl}/useravatar/pfimg_${data.userProfileModelFollowing.userID}.png?lastmod=${data.userProfileModelFollowing.modifiedDate}`} />
                                    <div>
                                        <Link target='_blank' href={`/friend/${data.userProfileModel.userID}`}  className='text-gray-600 font-bold'>{`${data.userProfileModelFollowing.firstName} ${data.userProfileModelFollowing.lastName}`}</Link>
                                        <p className='text-xs leading-3 text-gray-500'>{data.userProfileModelFollowing.homeBaseCity},{data.userProfileModelFollowing.homeBaseCountry}</p>
                                    </div>
                                </div>
                                <div className='me-5'>
                                    <Checkbox
                                        size='lg'
                                        isChecked={inviteFriends[data.userProfileModelFollowing.userID] || false}
                                        onChange={(value) => handleChecked(value, data.userProfileModelFollowing.userID)}
                                    />
                                </div>
                            </div>
                        )) :
                        <div className='flex flex-col justify-center items-center text-lg text-primaryButton'>
                            <img className='w-52' src={myFriend.src} alt="" />
                            <p> You do not have any other friends here </p>
                            <p>or you have already invited everyone.</p>

                        </div>
                    }
                </ModalBody>
                <ModalFooter>
                    {filteredFriends.length > 0 ? <Button variant='' isDisabled={loading} className='text-white bg-primaryDarkblue' onClick={handleInvite}>
                        {loading?<CgSpinner className='mx-auto animate-spin w-6 h-6 ' />:"Invite"}
                        </Button>
                        : <Button variant='' className='text-white bg-primaryDarkblue' >Find Friends</Button>}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default InviteFriendModal;
