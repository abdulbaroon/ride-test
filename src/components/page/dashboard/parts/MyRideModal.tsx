import { RootState } from '@/redux/store/store'
import { RideItem } from '@/shared/types/dashboard.types'
import { formatRideList } from '@/shared/util/format.util'
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import { format, parse, parseISO } from 'date-fns'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useSelector } from 'react-redux'

const MyRideModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const { push } = useRouter()
    const myRidedata = useSelector<RootState, RideItem[]>((state) => state.dashboard.myRideList)
    const formattedHotRide = myRidedata.map((data) => formatRideList(data));
    return (
        <>
            <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} size={"xl"}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>My Rides</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <div className='overflow-hidden'>
                            <p className='text-gray-500 font-bold text-sm'>Rides you have created or joined.</p>
                            <div className='space-y-6 mt-2 max-h-[400px] overflow-y-auto'>
                                {formattedHotRide.length > 0 ? formattedHotRide?.map((data, index) => (
                                    <div className='flex gap-3' key={index} >
                                        <div className=" w-32 h-32">
                                            <img src={data.mapImage} className='w-full h-full' alt="null" />
                                        </div>
                                        <div className="text-sm text-gray-600 border-b w-80">
                                            <Link href={`ride/${data.activityID}`}>
                                                <p className='uppercase font-semibold text-primaryText'>{data.rideName}</p>
                                            </Link>

                                            <p className='italic'>{data.isPrivate ? "Private Ride" : "Public Ride"}</p>
                                            <p className='font-bold'>{format(parseISO(data?.startDate as any), "EEE, MMM dd, yyyy")}</p>
                                            <p className='font-bold'>{format(parse(data?.startTime as any, 'HH:mm:ss', new Date()), 'hh:mm a')}</p>
                                            <p>{data.rideType} for <span className='font-bold ' >{data.distance} miles</span></p>
                                            <p>Roster Count: {data.rosterCount} | Views: {data.viewCount}</p>
                                        </div>
                                    </div>
                                )) :
                                    <div className='text-gray-600'>
                                        <p>Hey! Doesn&apos;t look like you&apos;ve joined any upcoming rides!</p>
                                        <Link className='text-primaryText' href={"/ride"}>Search for a ride!
                                        </Link>
                                    </div>
                                }

                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button onClick={() => push("/ride/add")} className='bg-primaryText text-white font-semibold px-4 py-[6px] rounded-md'>Add a ride</button>
                        <button onClick={onClose} className='bg-gray-100 text-black border font-semibold px-4 py-[6px] rounded-md ms-3'>Close</button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}



export default MyRideModal