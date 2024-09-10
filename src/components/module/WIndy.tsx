import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { User } from '@/shared/types/account.types';
import { Item } from '@/shared/types/dashboard.types';

const Windy: React.FC = () => {
    const rides = useSelector<RootState>((state) => state.rideDetail.rides) as Item
    const user = useSelector<RootState>((state) => state.auth.user) as User

    const webViewUrl = `https://embed.windy.com/embed2.html?lat=${rides.startLat}&lon=${rides.startLng}&zoom=12&level=surface&overlay=wind&menu=&message=true&marker=true&calendar=0&pressure=true&type=map&location=coordinates&detail=&detailLat=${rides.startLat}&detailLon=${rides.startLng}&metricWind=${user?.userProfile?.unitOfMeasureID === 1 ? 'mph' : 'km/h'}&metricTemp=${user?.userProfile?.unitOfMeasureID === 1 ? '°F' : '°C'}&radarRange=-1`;

    return (
        <div className='h-[50vh] rounded-lg overflow-hidden'>
            <iframe
                title="Windy Map"
                width="100%"
                height="100%"
                src={webViewUrl}
                frameBorder="0"
            ></iframe>
        </div>
    );
};

export default Windy;
