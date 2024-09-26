import { getNews } from "@/redux/slices/dashboardSlice";
import { AppDispatch } from "@/redux/store/store";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ScrollView } from "@progress/kendo-react-scrollview";
import { GoLinkExternal } from "react-icons/go";
import Link from "next/link";

interface NewsData {
    newsTitle: string;
    newsContent: string;
    newsUrl: string;
}

/**
 * NewsCard component that fetches and displays news items in a scrollable view.
 *
 * @component
 * @returns {JSX.Element} The rendered NewsCard component.
 */
const NewsCard = () => {
    const [news, setNews] = useState<NewsData[]>([]);
    const dispatch = useDispatch<AppDispatch>();

    /**
     * Fetches news data from the Redux store.
     * Dispatches the getNews action and updates the local state with the retrieved news.
     */
    const fetchNews = async () => {
        const response = await dispatch(getNews());

        if (getNews.fulfilled.match(response)) {
            setNews(response.payload);
        }
    };

    useEffect(() => {
        fetchNews();
    }, [dispatch]);

    return (
        <>
            {news.length > 0 && (
                <div className='border border-neutral-300 rounded-md bg-white'>
                    <ScrollView
                        style={{
                            width: "100%",
                            height: "180px",
                            border: "none",
                            borderRadius: "6px",
                        }}
                        automaticViewChange={true}
                        endless={true}
                        arrows={false}>
                        {news.map((newsItem, index) => (
                            <div
                                className='text-black p-3 flex flex-col'
                                key={index}>
                                <div>
                                    <p className='font-bold'>
                                        {newsItem.newsTitle}
                                    </p>
                                    <p className='w-full text-wrap mb-1'>
                                        {newsItem.newsContent}
                                    </p>
                                </div>
                                <div>
                                    <Link
                                        href={newsItem.newsUrl}
                                        className='text-xs text-primaryButton cursor-pointer font-bold'>
                                        Check it out!
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </ScrollView>
                </div>
            )}
        </>
    );
};

export default NewsCard;
