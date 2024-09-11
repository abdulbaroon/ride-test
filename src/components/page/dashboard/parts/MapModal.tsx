"use client"
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import {
    Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
} from '@chakra-ui/react';
// import MapBoxModal from '@/components/module/MapBoxModal';
import { Explore } from '@/shared/types/dashboard.types';

interface MapModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const MapModal: React.FC<MapModalProps> = ({ isOpen, onClose }) => {
    const finalRef = useRef<HTMLDivElement>(null);
    const profile = useSelector((state: RootState) => state.auth.profileData);
    const exploreData=useSelector<RootState,Explore[]>((state)=>state.dashboard.expoloreData)
    return (
        <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent maxW="1000px">
                <ModalHeader>Explore Ride and Friends</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box bg="darkBlack" h="70vh" w="full" rounded="xl" overflow="hidden" position="relative">
                        {/* <MapBoxModal profile={profile} /> */}
                    </Box>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onClose}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default MapModal;
