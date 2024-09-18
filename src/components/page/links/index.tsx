"use client";
import { getLink } from "@/redux/slices/linksSlice";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
    faAppleWhole,
    faBicycle,
    faBrowser,
    faCircleQuestion,
    faShirt,
    faStar,
    faMobileAndroid,
    faEnvelope,
    IconDefinition,
} from "@fortawesome/pro-light-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons/faInstagram";
import { faTwitter } from "@fortawesome/free-brands-svg-icons/faTwitter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { logo } from "@/assets";
import { AppDispatch } from "@/redux/store/store";
import { toast } from "react-toastify";

/* 
// const quickLinks = [
//     {
//         quickLinksID: 1,
//         quickLinksName: "Website232",
//         quickLinksUrl: "https://chasingwatts.com",
//         quickLinksDesc: "The official website of Chasing Watts",
//         isActive: true,
//     },
//     {
//         quickLinksID: 2,
//         quickLinksName: "Chasing Watts Kit",
//         quickLinksUrl: "https://jakroo.com/store-front?storeId=BycOhCSm9",
//         quickLinksDesc: "Official cycling kit store",
//         isActive: true,
//     },
//     {
//         quickLinksID: 3,
//         quickLinksName: "Chasing Watts Merch",
//         quickLinksUrl: "https://www.bonfire.com/store/chasingwatts/",
//         quickLinksDesc: "Official merchandise store",
//         isActive: true,
//     },
//     {
//         quickLinksID: 4,
//         quickLinksName: "iPhone App",
//         quickLinksUrl:
//             "https://itunes.apple.com/us/app/chasing-watts/id1436437976",
//         quickLinksDesc: "Apple App Store",
//         isActive: true,
//     },
//     {
//         quickLinksID: 5,
//         quickLinksName: "Android App",
//         quickLinksUrl:
//             "https://play.google.com/store/apps/details?id=com.ChasingWatts",
//         quickLinksDesc: "Google Play Store",
//         isActive: true,
//     },
//     {
//         quickLinksID: 6,
//         quickLinksName: "Leave Review",
//         quickLinksUrl:
//             "https://apps.apple.com/us/app/chasing-watts/id1436437976?action=write-review",
//         quickLinksDesc: "Leave a review on the App Store",
//         isActive: true,
//     },
//     {
//         quickLinksID: 7,
//         quickLinksName: "Help Center / FAQ",
//         quickLinksUrl: "https://help.chasingwatts.com/",
//         quickLinksDesc: "Frequently asked questions and help center",
//         isActive: true,
//     },
//     {
//         quickLinksID: 8,
//         quickLinksName: "Instagram",
//         quickLinksUrl: "https://instagram.com/chasing_watts",
//         quickLinksDesc: "Follow on Instagram",
//         isActive: true,
//     },
//     {
//         quickLinksID: 9,
//         quickLinksName: "Twitter",
//         quickLinksUrl: "https://twitter.com/chasing_watts",
//         quickLinksDesc: "Follow on Twitter",
//         isActive: true,
//     },
//     {
//         quickLinksID: 10,
//         quickLinksName: "Email Us",
//         quickLinksUrl: "mailto:hello@chasingwatts.com",
//         quickLinksDesc: "Contact via email",
//         isActive: true,
//     },
// ];

// const quickLinksIcons: Record<number, IconDefinition> = {
//     1: faBrowser,
//     2: faBicycle,
//     3: faShirt,
//     4: faAppleWhole,
//     5: faMobileAndroid,
//     6: faStar,
//     7: faCircleQuestion,
//     8: faInstagram,
//     9: faTwitter,
//     10: faEnvelope,
// };
*/

type QuickLink = {
    quickLinksID: number;
    quickLinksName: string;
    quickLinksUrl: string;
    quickLinksDesc?: string;
    isActive: boolean;
};

export const Links = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);

    useEffect(() => {
        const fetchLinks = async () => {
            const resultAction = await dispatch(getLink());
            if (getLink.fulfilled.match(resultAction)) {
                setQuickLinks(resultAction.payload);
            } else {
                console.error("Failed to fetch links");
                toast.error("Failed to fetch links!");
            }
        };

        fetchLinks();
    }, [dispatch]);

    return (
        <div className='flex flex-wrap justify-center'>
            <div className='lg:w-1/5 w-full mx-4 text-center space-y-3'>
                <img
                    src={logo.src}
                    alt='Chasing Watts'
                    className='w-44 mx-auto'
                />
                {quickLinks?.map((data) => {
                    return (
                        <div key={data.quickLinksID}>
                            <Link
                                rel='noopener noreferrer'
                                target='_blank'
                                href={data.quickLinksUrl}>
                                <div
                                    className='p-3 rounded-md
                  transform transition ease-in-out delay-200 w-full
                  bg-LinkButton hover:bg-secondaryButton text-white'>
                                    {/* <FontAwesomeIcon
                                      icon={
                                          quickLinksIcons[
                                              data.quickLinksID
                                          ]
                                      }
                                      className='me-2'
                                  /> */}
                                    {data.quickLinksName}
                                </div>
                            </Link>
                        </div>
                    );
                })}
                <div>
                    <p className='text-center text-lg text-gray-600 font-bold'>
                        #LETSRIDE
                    </p>
                </div>
            </div>
        </div>
    );
};
