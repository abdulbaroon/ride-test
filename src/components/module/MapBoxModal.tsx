import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import mapboxgl, { Map as MapboxMap, LngLatBounds } from 'mapbox-gl';
import { RootState } from '@/redux/store/store';
import { FormattedRide, RideItem } from '@/shared/types/dashboard.types';
import { formatRideList } from '@/shared/util/format.util';
import 'mapbox-gl/dist/mapbox-gl.css';
import { formatDate, parseISO } from 'date-fns';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

interface MapBoxModalProps {
    profile: { homeBaseLng: number, homeBaseLat: number }|any;
}

interface HoverInfo {
    rideName: string;
    longitude: number;
    latitude: number;
}

interface PopupInfo {
    rideName: string;
    longitude: number;
    latitude: number;
}

const MapBoxModal: React.FC<MapBoxModalProps> = ({ profile }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<MapboxMap | null>(null);
    const [mapInitialized, setMapInitialized] = useState(false);
    const [currentStyle, setCurrentStyle] = useState('mapbox://styles/mapbox/satellite-streets-v12'); // Default style
    const ridedata = useSelector((state: RootState) => state.dashboard.rideList);

    const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
    const [popupInfo, setPopupInfo] = useState<FormattedRide|null>(null);

    const rideItems = ridedata.map(formatRideList);

    useEffect(() => {
        if (!mapInitialized && mapContainerRef.current && profile) {
            const map = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: currentStyle,
                center: [profile.homeBaseLng, profile.homeBaseLat],
                zoom: 14,
                projection: 'globe',
            });

            map.on('load', () => {
                console.log("Map loaded");
                setMapInitialized(true);

                const bounds = new LngLatBounds();

                rideItems.forEach((data) => {
                    const marker = new mapboxgl.Marker()
                        .setLngLat([data.startLng || 0, data.startLat || 0])
                        .addTo(map);

                    bounds.extend([data.startLng || 0, data.startLat || 0]);

                    marker.getElement().addEventListener('mouseenter', () => handleMouseEnter(marker.getElement(), data.rideName));
                    marker.getElement().addEventListener('mouseleave', handleMouseLeave);
                    marker.getElement().addEventListener('click', () => handleMarkerClick(data));
                });

                map.fitBounds(bounds, { padding: 50 });

                const fullscreenControl = new mapboxgl.FullscreenControl();
                const navigationControl = new mapboxgl.NavigationControl();
                map.addControl(fullscreenControl, 'top-left');
                map.addControl(navigationControl, 'top-left');

                map.addControl(new MapStyleSwitcher(map), 'top-right');
            });

            mapRef.current = map;
        }
    }, [profile, rideItems, mapInitialized, currentStyle]);

    const handleMouseEnter = (element: HTMLElement, rideName: string) => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip text-nowrap text-white';
        tooltip.style.position = 'absolute';
        tooltip.style.background = 'black';
        tooltip.style.padding = '5px';
        tooltip.style.borderRadius = '3px';
        tooltip.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        tooltip.innerHTML = rideName;
        element.appendChild(tooltip);
    };

    const handleMouseLeave = (event: MouseEvent) => {
        const element = event.currentTarget as HTMLElement;
        const tooltip = element.querySelector('.tooltip');
        if (tooltip) {
            element.removeChild(tooltip);
        }
    };

    const handleMarkerClick = (data:FormattedRide) => {
        setPopupInfo(data);
    };

    useEffect(() => {
        if (popupInfo && mapRef.current) {
            console.log("Popup Info:", popupInfo);
            const html = {

            }
            const popup = new mapboxgl.Popup({ closeOnClick: false })
                .setLngLat([popupInfo.startLng||0, popupInfo.startLat||0])
                .setHTML(`
                         <div style="background-color: white; padding: 0.5rem; color: black; width: 13rem; margin-top: 0.75rem;">
                           <div class="flex items-start space-y-1 flex-col">
                             <img class="w-full rounded" src=${popupInfo.mapImage} alt="img" />
                               <h4 class="text-sm font-semibold text-gray-700">${popupInfo.rideName}</h4>
                               <p class="my-1 text-sm">${formatDate(parseISO(popupInfo.startDate as any), "EEE, MMM dd, yyyy")}</p>
                            </div>
                        <div class="w-full flex justify-center mt-2">
                         <a class="px-6 py-[5px] bg-blue-500 font-bold text-white rounded-sm" href="/ride/getRide/${popupInfo.activityID}" >View Ride</a>
                        </div>
                    </div> `)
                .addTo(mapRef.current);

            return () => {
                popup.remove();
            };
        }
    }, [popupInfo]);

    class MapStyleSwitcher {
        map: MapboxMap;
        constructor(map: MapboxMap) {
            this.map = map;
        }

        onAdd(map: MapboxMap) {
            this.map = map;
            const container = document.createElement('div');
            container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
            container.innerHTML = `
                <button class="mapboxgl-ctrl-icon" aria-label="Switch to Satellite View" title="Switch to Satellite View">
                    <span class="mapboxgl-ctrl-icon" style="
                    background-size: 59%;
                    background-image : url('https://img.freepik.com/premium-vector/from-space-earth-satellite-icon-logo_706143-4018.jpg');"></span>
                </button>
                <button class="mapboxgl-ctrl-icon" aria-label="Switch to Simple View" title="Switch to Simple View">
                    <span class="mapboxgl-ctrl-icon" style="
                     background-size: 59%;
                    background-image: url('https://img.freepik.com/premium-vector/black-pin-location_1305565-84.jpg');"></span>
                </button>
            `;

            container.querySelectorAll('button').forEach(button => {
                button.addEventListener('click', () => {
                    const newStyle = button.title.includes('Satellite')
                        ? 'mapbox://styles/mapbox/satellite-streets-v12'
                        : 'mapbox://styles/mapbox/streets-v12';
                    this.map.setStyle(newStyle);
                    setCurrentStyle(newStyle);
                });
            });

            return container;
        }

        onRemove() {
            this.map = null!;
        }
    }

    return (
        <div className='' ref={mapContainerRef} style={{ width: '100%', height: '100%', position: 'relative' }} />
    );
};

export default MapBoxModal;
