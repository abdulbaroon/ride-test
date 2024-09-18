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
const NewsCard = () => {
    const [news, setNews] = useState<NewsData[]>([]);
    const dispatch = useDispatch<AppDispatch>();

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
                        {news?.map((news, index) => (
                            <div
                                className='text-black p-3 flex flex-col'
                                key={index}>
                                <div>
                                    <p className='font-bold'>
                                        {news?.newsTitle}
                                    </p>
                                    <p className='w-full text-wrap mb-1'>
                                        {news.newsContent}
                                    </p>
                                </div>
                                <div className=''>
                                    <Link
                                        href={news?.newsUrl}
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
