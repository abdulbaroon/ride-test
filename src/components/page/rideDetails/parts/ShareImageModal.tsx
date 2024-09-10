import { getShareImage } from "@/redux/slices/rideDetailsSlice";
import { AppDispatch } from "@/redux/store/store";
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { useDispatch } from "react-redux";

interface ShareImageModalProps {
  isOpen: boolean;
  id: number;
  onClose: () => void;
}

const ShareImageModal: FC<ShareImageModalProps> = ({ isOpen, onClose, id }) => {
  const [selectedColor, setSelectedColor] = useState('black');
  const [selectedShape, setSelectedShape] = useState('square');
  const [imageSource, setImageSource] = useState<string | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  useEffect(() => {
    const fetchImage = async () => {
      setLoading(true);
      const params = {
        activityID: id,
        imageStyle: selectedColor,
        imageType: selectedShape,
      };
      try {
        const response = await dispatch(getShareImage(params));
        if (getShareImage.fulfilled.match(response)) {
          const imageBlob = response.payload;
          if (imageBlob instanceof Blob) {
            const base64Image = await blobToBase64(imageBlob);
            setImageSource(base64Image);
            setImageBlob(imageBlob); 
          } else {
            console.error("Response is not a Blob:", imageBlob);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch share image:", error);
        setLoading(false);
      }
    };

    fetchImage();
  }, [selectedColor, selectedShape, dispatch, id]);

  const handleDownload = () => {
    if (imageBlob) {
      const url = URL.createObjectURL(imageBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'shared_image.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent minW={selectedShape==="story"?"600px":"800px"}>
          <ModalHeader>Share Image</ModalHeader>
          <ModalCloseButton />
          <ModalBody flexDirection={"row"}>
            <div className="flex  p-2">
              <div className="w-[20%]">
                <Stack spacing={"3px"}>
                  <Text fontSize='lg' fontWeight={600}>Image Style </Text>
                  <RadioGroup defaultValue='black' onChange={(value) => setSelectedColor(value)} isDisabled={loading}>
                    <Stack spacing={5} flexDirection={"column"} gap={1}>
                      <Radio colorScheme='gray' value='black'>
                        Black
                      </Radio>
                      <Radio colorScheme='blue' value='blue'>
                        Blue
                      </Radio>
                      <Radio colorScheme='red' value='sat'>
                        Satellite
                      </Radio>
                      <Radio colorScheme='green' value='plain'>
                        Plain
                      </Radio>
                      <Radio colorScheme='yellow' value='golden'>
                        Golden
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </Stack>
                <Stack spacing={"3px"} marginTop={6}>
                  <Text fontSize='lg' fontWeight={600}>Image Type </Text>
                  <RadioGroup defaultValue='square' onChange={(value) => setSelectedShape(value)} isDisabled={loading}>
                    <Stack spacing={5} flexDirection={"column"} gap={1}>
                      <Radio colorScheme='red' value='square'>
                        Square
                      </Radio>
                      <Radio colorScheme='blue' value='story'>
                        Story
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </Stack>
              </div>
              <div className="w-[80%] flex justify-center items-center min-h-96">
                {loading ? (
                  <CgSpinner className='mx-auto animate-spin text-5xl ' />
                ) : (
                  <img className={selectedShape==="story"?"w-[300px]":"w-[500px]"} src={imageSource || ""} alt="Shared Image" />
                )}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='' className="bg-primaryText hover:bg-primaryButton text-white" onClick={handleDownload} isDisabled={loading} disabled={loading}>Download Image</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ShareImageModal;
