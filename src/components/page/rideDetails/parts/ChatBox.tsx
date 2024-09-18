import { IMAGE_URl } from "@/constant/appConfig";
import {
    deleteChatActivity,
    getChatActivity,
    setChatActivity,
} from "@/redux/slices/rideDetailsSlice";
import { AppDispatch, RootState } from "@/redux/store/store";
import { User } from "@/shared/types/account.types";
import { Item } from "@/shared/types/dashboard.types";
import { ActivityChat } from "@/shared/types/rideDetail.types";
import { Avatar, Tooltip } from "@chakra-ui/react";
import { format, parseISO } from "date-fns";
import React, { useState } from "react";
import { FaRegPaperPlane } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import Linkify from "linkify-react";

const ChatBox = () => {
    const activityChat = useSelector<RootState, ActivityChat[]>(
        (state) => state.rideDetail.activityChat
    );
    const rides = useSelector<RootState>(
        (state) => state.rideDetail.rides
    ) as Item;
    const user = useSelector<RootState>((state) => state.auth.user) as User;
    const dispatch = useDispatch<AppDispatch>();
    const [message, setMessage] = useState("");
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const payload = {
            activityID: rides?.activityID,
            userID: user.id,
            createdBy: user.id,
            createdDate: new Date().toISOString(),
            modifiedBy: user.id,
            modifiedDate: new Date().toISOString(),
            chatMessage: message,
        };
        await dispatch(setChatActivity(payload));
        const chatparams = {
            activityID: rides?.activityID,
            userID: user.id,
        };
        dispatch(getChatActivity(chatparams));
        setMessage("");
    };

    const handleDelete = async (id: number) => {
        if (id) {
            const response = await dispatch(deleteChatActivity(id));
            if (deleteChatActivity.fulfilled.match(response)) {
                const chatparams = {
                    activityID: rides?.activityID,
                    userID: user.id,
                };
                dispatch(getChatActivity(chatparams));
            }
        }
    };

    const optionsLinkify = {
        className: "font-bold", // Add a class to all links
        target: "_blank", // Open links in a new tab
        //format: (value: any) => `<strong>${value}</strong>`, // Make link text bold
    };

    return (
        <section id='chat'>
            <div className='bg-white min-h-40 border p-5 rounded-lg'>
                <form
                    onSubmit={handleSubmit}
                    className='relative rounded-lg overflow-hidden'>
                    <input
                        className='border w-full py-2 px-3 rounded-lg outline-none'
                        type='text'
                        placeholder="What's up?"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button
                        type='submit'
                        className='absolute top-0 right-0 rounded-e-lg text-lg bg-primaryText border text-white z-10 h-full w-10 text-center flex justify-center items-center'>
                        <FaRegPaperPlane className=' ' />
                    </button>
                </form>
                {activityChat.length > 0 ? (
                    activityChat?.map((data, index) => (
                        <div
                            className={`mt-3 flex w-full gap-3 ${
                                data?.isUser && "flex-row-reverse"
                            }`}
                            key={index}>
                            <Avatar
                                boxSize='40px'
                                borderWidth='1px'
                                borderColor='gray.600'
                                name={data?.userFullName}
                                size='sm'
                                src={`${IMAGE_URl}/useravatar/pfimg_${
                                    data.userID
                                }.png?lastmod=${Date.now()}`}
                            />
                            <div
                                className={` relative ${
                                    data?.isUser
                                        ? "bg-[#003057] text-white"
                                        : "bg-[#f5f4f8] text-gray-900"
                                }  rounded-md w-[80%]`}>
                                <div className='p-2 text-sm'>
                                    <Linkify as='p' options={optionsLinkify}>
                                        {data.chatMessage}
                                    </Linkify>
                                </div>

                                <p
                                    className={`${
                                        data?.isUser
                                            ? "text-gray-200"
                                            : " text-gray-500"
                                    } text-xs text-end px-2  flex justify-end items-center gap-1 pb-2`}>
                                    {data.userFirstName} on{" "}
                                    {format(
                                        parseISO(data.modifiedDate),
                                        "M/d/yyyy h:mm:ss aa"
                                    )}
                                    <Tooltip
                                        hasArrow
                                        label='delete'
                                        placement='top'
                                        bg='black'>
                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    data.activityChatID
                                                )
                                            }>
                                            {data?.isUser && (
                                                <RiDeleteBin6Line className='text-red-500 cursor-pointer' />
                                            )}
                                        </button>
                                    </Tooltip>
                                </p>
                                {data?.isUser ? (
                                    <div
                                        className='w-0 h-0  absolute top-2 -right-2
                 border-t-[6px] border-t-transparent
                 border-l-[8px] border-l-[#003057]
                 border-b-[6px] border-b-transparent'></div>
                                ) : (
                                    <div
                                        className='w-0 h-0  absolute top-2 -left-2
                 border-t-[6px] border-t-transparent
                 border-r-[8px] border-r-[#f5f4f8]
                 border-b-[6px] border-b-transparent'></div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div
                        className={`mt-3 flex w-full gap-3 
          `}>
                        <Avatar
                            boxSize='40px'
                            borderWidth='1px'
                            borderColor='gray.600'
                            name={"c"}
                            size='sm'
                            src={
                                "https://chasingwatts.com/images/CW-Icon-256-01.jpg"
                            }
                        />
                        <div
                            className={` relative 
                 bg-[#f5f4f8] text-gray-900
            rounded-lg w-[80%]`}>
                            <p className='p-2'>{"Why so quiet, let's chat!"}</p>
                            <p
                                className={` "text-gray-200" text-xs text-end px-2  flex justify-end items-center gap-1 pb-2`}>
                                {" "}
                            </p>

                            <div
                                className='w-0 h-0  absolute top-2 -left-2
                 border-t-[6px] border-t-transparent
                 border-r-[8px] border-r-[#f5f4f8]
                 border-b-[6px] border-b-transparent'></div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ChatBox;
