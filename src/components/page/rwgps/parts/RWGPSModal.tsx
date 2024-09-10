import { useForm } from 'react-hook-form';
import { RWGPSLogo } from '@/assets';
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import Link from 'next/link';
import { useDispatch } from 'react-redux'; // Removed unused imports
import { AppDispatch } from '@/redux/store/store'; // Adjusted based on usage
// Removed unused imports
import { toast } from 'react-toastify';
import { authRWGPSUser } from '@/redux/slices/externalServicesSlice';
import { useState } from 'react';
import { CgSpinner } from 'react-icons/cg';

type FormData = {
  email: string;
  password: string;
};

const RWGPSModal = ({ isOpen, onClose, id, setAuth }: { isOpen: boolean; onClose: () => void; id: number | any; setAuth: any}) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = async (data: any) => {
    setLoading(true);
    const response = await dispatch(authRWGPSUser({
      id: id,
      email: data.email,
      password: data.password
    }));
    setLoading(false);
    if (authRWGPSUser.fulfilled.match(response)) {
      setAuth(!!response.payload?.authToken); 
      toast.success("Success");
      onClose();
    } else if (authRWGPSUser.rejected.match(response)) {
      toast.error("There was an error authenticating with Ride with GPS.");
    }
  };

  return (
    <>
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} size={"lg"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader sx={{ fontWeight: "700", fontSize: "22px" }}>Log In</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className='border-y py-4 '>
              <div className='flex justify-center mt-3 '>
                <img src={RWGPSLogo.src} alt="logo" />
              </div>
              <div className='mt-3'>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className='space-y-3'>
                    <div className='flex flex-col'>
                      <label className='text-lg text-gray-500'>Email Address</label>
                      <input {...register("email", { required: true })} className={`border rounded-md w-full py-2 px-3 mt-1 ${errors.email ? 'border-red-500' : ''}`} type="text" placeholder='Enter your Email' />
                      {errors.email && <span className='text-red-500'>Please enter your email!</span>}
                    </div>
                    <div className='flex flex-col'>
                      <label className='text-lg text-gray-500'>Password</label>
                      <input {...register("password", { required: true })} className={`border rounded-md w-full py-2 px-3 mt-1 ${errors.password ? 'border-red-500' : ''}`} type="password" placeholder='Enter your Password' />
                      {errors.password && <span className='text-red-500'>Please enter your password!</span>}
                    </div>
                    <div>
                      <button type='submit' className='w-full py-2 mt-1 rounded-lg bg-orange font-bold text-lg text-white '>
                        {loading ? <CgSpinner className='mx-auto animate-spin w-6 h-6' /> : "Log In"}
                      </button>
                    </div>
                    <div>
                      <Link href={"https://ridewithgps.com/users/forgot"} className='text-primaryText' target='_blank'>Forgot password?</Link>
                      <p className='text-gray-700'>Need a Ride with GPS account? 
                        <Link href={"https://ridewithgps.com/signup"} className='text-primaryText' target='_blank'>Create an account</Link>
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button onClick={onClose} className='bg-gray-100 text-black border font-semibold px-4 py-[6px] rounded-md ms-3'>Close</button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default RWGPSModal;