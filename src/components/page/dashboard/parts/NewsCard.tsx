import { getNews } from '@/redux/slices/dashboardSlice'
import { AppDispatch } from '@/redux/store/store'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { ScrollView } from "@progress/kendo-react-scrollview";
import { GoLinkExternal } from 'react-icons/go';
import Link from 'next/link';
interface NewsData{
    newsTitle:string
    newsContent:string
    newsUrl:string
}
const NewsCard = () => {
    const [news, setNews] = useState<NewsData[]>([])
    const dispatch = useDispatch<AppDispatch>()

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
        <div className='border rounded-lg   bg-white overflow-hidden'>
            <ScrollView
                style={{ width: "100%", height: "130px" , border:"none"}}
                automaticViewChange={true}
                endless={true}
                arrows={false}
            >
                {news?.map((news, index) => (
                    <div className='text-black p-3 flex items-center gap-3' key={index} >
                        <div className=' '>
                            <p className='font-bold'>{news?.newsTitle}</p>
                            <p className='w-full text-wrap'>{news.newsContent}</p>
                        </div>
                        <div className='h-10 w-1 bg-gray-300'></div>
                        <div className=' '>
                         <Link href={news?.newsUrl} className='text-xl text-primaryButton cursor-pointer' ><GoLinkExternal /></Link>
                        </div>
                    </div>
                ))}
            </ScrollView>
        </div>
    )
}

export default NewsCard