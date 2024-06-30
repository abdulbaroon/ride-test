"use client";
import { defaultProfile } from "@/assets";
import { useForm } from "react-hook-form";
import {
  customerFn,
  updateCustomerDetailFn,
  updateCustomerProfileFn,
} from "@/utils/api";
import { useSession } from "next-auth/react";
// import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import {
  EditOutlined,
  PlusOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { SharedLabel, SharedModal } from "../SharedComponents";
import { AccessDenied, Loading, RedButton } from "..";
import { Upload, Image, Button } from "antd";
import { ContextAuth } from "@/context/AuthContext";

export const UserDetails = () =>
  //   {
  //   loading,
  //   setLoading,
  //   user,
  //   setUser,
  //   refetchUser,
  // }
  {
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm();

    const { user, loading, setUser, setLoading, refetchUser, error } =
      useContext(ContextAuth);

    const [imageSrc, setImageSrc] = useState(null);

    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [fileList, setFileList] = useState([]);
    const [imagePayload, setImagePayload] = useState(null);

    const getBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    const handlePreview = async (file) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setPreviewImage(file.url || file.preview);
      setPreviewOpen(true);
    };
    
    const handleChange = async ({ fileList: newFileList }) => {
      setFileList(newFileList);
    };

    const handleUpdateProfileImage = async () => {
      setLoading(true);
      const base64String = await getBase64(fileList[0].originFileObj);
      let payload = {
        profile_image: base64String,
      };

      try {
        const updateImageResponse = await updateCustomerProfileFn(payload);
        if (updateImageResponse.data.status === 1) {
          let userData = await customerFn();
          setUser(userData.data.data);
          setLoading(false);
          setIsImageModalOpen(false);
        } else {
          setLoading(false);
          setIsImageModalOpen(false);
        }
      } catch (error) {
        console.error(error.message);
        setLoading(false);
      }
    };

    const handleUpdateProfileDetails = async (data) => {
      setLoading(true);
      try {
        const response = await updateCustomerDetailFn({
          ...data,
          phone: parseInt(data.phone),
        });
        console.log("response", response);
        if (response?.data?.status === 1) {
          setIsProfileModalOpen(false);
          setUser(response);
          reset();
          setLoading(false);
          refetchUser();
        }
      } catch (error) {
        setLoading(false);
      }
    };

    const handlePhoneInput = (e) => {
      if (e.target.value.length > 20) {
        e.target.value = e.target.value.slice(0, 20);
      }
    };

    const uploadButton = (
      <button
        style={{
          border: 0,
          background: "none",
        }}
        type="button"
      >
        <PlusOutlined />
        <div
          style={{
            marginTop: 8,
          }}
        >
          Upload
        </div>
      </button>
    );

    useEffect(() => {
      const fetchData = async () => {
        // setLoading(true);
        await refetchUser();
        // setLoading(false);
      };
      fetchData();
    }, []);

    return (
      <>
        {loading ? (
          <Loading />
        ) : user ? (
          <>
            <section className="w-10/12 mx-auto p-7 flex gap-9 flex-col lg:flex-row">
              <div className="w-fit border-primaryBlack border-8 rounded-full p-2 relative flex items-center justify-center">
                <img
                  src={user?.profile_image ?? defaultProfile.src}
                  width={200}
                  height={200}
                  layout="fixed"
                  alt={user.name}
                  className=" rounded-full p-2"
                />

                <div className="absolute m-2 -right-1 -bottom-2 border-8 border-white rounded-full p-2 bg-black">
                  <EditOutlined
                    style={{
                      fontSize: "2rem",
                      color: "#fff",
                      borderRadius: "50% 50%",
                    }}
                    onClick={() => setIsImageModalOpen(true)}
                  />
                </div>
              </div>
              <div className="flex flex-col justify-center gap-6 flex-1 ">
                <h1 className="text-lg font-extrabold  flex gap-2 items-center lg:text-3xl">
                  {" "}
                  <UserOutlined />{" "}
                  <p className="text-primaryDarkRed">{user.full_name}</p>
                </h1>
                <h2 className="text-md font-bold italic flex gap-2 items-center lg:text-xl">
                  <MailOutlined className="text-md lg:text-3xl" />
                  <p>{user.email}</p>
                </h2>
                <h2 className="text-md font-bold flex gap-2 items-center lg:text-xl">
                  <PhoneOutlined className="text-md lg:text-3xl" />
                  <p>{user.phone || "N/A"}</p>
                </h2>
                <div className="flex justify-end">
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => setIsProfileModalOpen(true)}
                    className="float-right bg-primaryDarkRed hover:bg-primaryRed"
                  >
                    Edit Profile
                  </Button>
                </div>
              </div>
            </section>
            <SharedModal
              isModalOpen={isImageModalOpen}
              setIsModalOpen={setIsImageModalOpen}
              containerClass="w-[90%] md:w-[70%] lg:w-[50%]"
            >
              <div className="px-5 py-5 w-full">
                <h1 className="text-lg font-semibold">
                  {" "}
                  Update Profile Image{" "}
                </h1>
                <div className="mt-2">
                  <Upload
                    listType="picture-circle"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    maxCount={1}
                  >
                    {fileList.length >= 1 ? null : uploadButton}
                  </Upload>
                  {previewImage && (
                    <Image
                      wrapperStyle={{
                        display: "none",
                      }}
                      preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) =>
                          !visible && setPreviewImage(""),
                      }}
                      src={previewImage}
                      alt={user.name}
                    />
                  )}
                </div>
                <div className="space-x-5 mt-2 ms-2">
                  <RedButton
                    text="Update Profile Picture"
                    className="w-fit py-1.5 px-4 mt-4 bg-green-500"
                    onClick={handleUpdateProfileImage}
                  />
                  <RedButton
                    text="Cancel"
                    onClick={() => setIsImageModalOpen(false)}
                    className="w-fit py-1.5 px-4 mt-4"
                  />
                </div>
              </div>
            </SharedModal>
            <SharedModal
              isModalOpen={isProfileModalOpen}
              setIsModalOpen={setIsProfileModalOpen}
              containerClass="w-[90%] md:w-[70%] lg:w-[50%]"
            >
              <div className="px-5 py-5 w-full">
                <form
                  onSubmit={handleSubmit(handleUpdateProfileDetails)}
                  className="mt-5"
                >
                  <h1 className="text-lg font-semibold ms-2 mb-4">
                    Update Profile Details
                  </h1>
                  <div className="flex flex-wrap md:flex-nowrap">
                    <div className="w-full sm:w-1/2 px-2">
                      <SharedLabel text="Full Name" />
                      <input
                        className={`border-2 border-primaryBlack bg-primaryWhite rounded-md w-full py-2 px-2 sm:py-2 sm:px-2 text-15 font-light mt-1 text-gray-900 outline-none focus:border-ticketBlue`}
                        type="text"
                        defaultValue={user?.full_name}
                        placeholder={"Full Name"}
                        {...register("name", {
                          required: "Full name is required",
                        })}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm font-semibold">
                          {errors?.name?.message}
                        </p>
                      )}
                    </div>

                    <div className="w-full sm:w-1/2 px-2 mt-4 md:mt-0">
                      <SharedLabel text="Contact Person" />
                      <input
                        className={`border-2 border-primaryBlack bg-primaryWhite rounded-md w-full py-2 px-2 sm:py-2 sm:px-2 text-15 font-light mt-1 text-gray-900 outline-none focus:border-ticketBlue`}
                        type="text"
                        defaultValue={user?.contact_person}
                        placeholder={"Contact Person"}
                        {...register("contact_person", {
                          required: "Contact is required",
                        })}
                      />
                      {errors.contact_person && (
                        <p className="text-red-500 text-sm font-semibold">
                          {errors?.contact_person?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap md:flex-nowrap mt-4">
                    <div className="w-full sm:w-1/2 px-2">
                      <SharedLabel text="Phone" />
                      <input
                        className={`border-2 border-primaryBlack bg-primaryWhite rounded-md w-full py-2 px-2 sm:py-2 sm:px-2 text-15 font-light mt-1 text-gray-900 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:border-ticketBlue`}
                        type="number"
                        name="Phone"
                        placeholder={"Phone"}
                        maxLength={20}
                        onInput={handlePhoneInput}
                        defaultValue={user?.phone}
                        {...register("phone", {
                          required: "Phone number is required",
                          maxLength: {
                            value: 20,
                            message: "Phone number exceeds 20 digits",
                          },
                          minLength: {
                            value: 4,
                            message:
                              "Phone number must contain at least 4 digits",
                          },
                        })}
                        onKeyDown={(e) => {
                          if (
                            e.key === "-" ||
                            e.key === "e" ||
                            e.key === "+" ||
                            e.key === "."
                          ) {
                            e.preventDefault();
                          }
                        }}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm font-semibold">
                          {errors?.phone?.message}
                        </p>
                      )}
                    </div>

                    <div className="w-full sm:w-1/2 px-2 mt-4 md:mt-0">
                      <SharedLabel text="Company Name" />
                      <input
                        className={`border-2 border-primaryBlack bg-primaryWhite rounded-md w-full py-2 px-2 sm:py-2 sm:px-2 text-15 font-light mt-1 text-gray-900 outline-none focus:border-ticketBlue`}
                        type="text"
                        defaultValue={user?.company_name}
                        placeholder={"Company Name"}
                        {...register("company_name", {
                          required: "Company name is required",
                        })}
                      />
                      {errors.company_name && (
                        <p className="text-red-500 text-sm font-semibold">
                          {errors?.company_name?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="w-full px-2 mt-4">
                    <SharedLabel text="Address" />
                    <textarea
                      className={`border-2 border-primaryBlack bg-primaryWhite rounded-md w-full py-2 px-2 sm:py-2 sm:px-2 text-15 font-light mt-1 text-gray-900 outline-none focus:border-ticketBlue`}
                      placeholder={"Address"}
                      rows={2}
                      defaultValue={user?.address}
                      {...register("address", {
                        required: "Address is required",
                      })}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm font-semibold">
                        {errors?.address?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-x-5 mt-2 ms-2">
                    <RedButton
                      text="Update Profile Details"
                      className="w-fit py-1.5 px-4 mt-4 bg-green-500"
                    />
                    <RedButton
                      text="Cancel"
                      onClick={() => setIsProfileModalOpen(false)}
                      className="w-fit py-1.5 px-4 mt-4"
                    />
                  </div>
                </form>
              </div>
            </SharedModal>
          </>
        ) : (
          <AccessDenied />
        )}
      </>
    );
  };
