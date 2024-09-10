import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import mapboxgl, { Map as MapboxMap, LngLatBounds } from 'mapbox-gl';
import { RootState } from '@/redux/store/store';
import { Explore, FormattedRide, RideItem } from '@/shared/types/dashboard.types';
import { formatRideList } from '@/shared/util/format.util';
import 'mapbox-gl/dist/mapbox-gl.css';
import { formatDate, parseISO } from 'date-fns';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

interface MapBoxModalProps {
    profile: { homeBaseLng: number, homeBaseLat: number } | any;
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
    const [currentStyle, setCurrentStyle] = useState('mapbox://styles/mapbox/streets-v12');
    const ridedata = useSelector((state: RootState) => state.dashboard.rideList);
    const exploreData = useSelector<RootState, Explore[]>((state) => state.dashboard.expoloreData);
    const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
    const [popupInfo, setPopupInfo] = useState<Explore | null>(null);

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
                setMapInitialized(true);

                const bounds = new LngLatBounds();

                exploreData.forEach((data) => {
                    const markerElement = document.createElement('div');
                    markerElement.style.width = '20px';
                    markerElement.style.height = '20px';
                    markerElement.style.border = `2px solid white`
                    markerElement.style.borderRadius = data.exploreType === 'Ride' ?  '50%':'4px';
                    markerElement.style.backgroundColor = "#e43d30";

                    const marker = new mapboxgl.Marker({ element: markerElement })
                        .setLngLat([data.entityLng || 0, data.entityLat || 0])
                        .addTo(map);

                    bounds.extend([data.entityLng || 0, data.entityLat || 0]);

                    marker.getElement().addEventListener('mouseenter', () => handleMouseEnter(marker.getElement(), data.entityName));
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
        tooltip.style.zIndex = '9999';
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

    const handleMarkerClick = (data: Explore) => {
        setPopupInfo(data);
    };

    useEffect(() => {
        if (popupInfo && mapRef.current) {
            const popup = new mapboxgl.Popup({ closeOnClick: false })
                .setLngLat([popupInfo.entityLng || 0, popupInfo.entityLat || 0])
                .setHTML(`
                    <div style="background-color: white; padding: 0.5rem; color: black; width: 13rem; margin-top: 0.75rem;">
                        <div class="flex items-start  flex-col">
                        <img class="w-full rounded mb-2 h-36" 
                        src=${popupInfo.exploreType === "Ride"
                        ? `https://dev.chasingwatts.com/ogmaps/ogmap_${popupInfo.entityID}.png`
                        : `https://dev.chasingwatts.com/useravatar/pfimg_${popupInfo.entityID}.png`} 
                        onerror="this.onerror=null; this.src='https://dev.chasingwatts.com/useravatar/blank-avatar.png';" alt="img" />
                            <h4 class="text-base font-semibold text-gray-700 ms-2">${popupInfo.entityName}</h4>
                            <p class=" text-gray-500 text-sm ms-2">${formatDate(parseISO(popupInfo.entityDate as any), "EEE, MMM dd, yyyy")}</p>
                        </div>
                        <div class="w-full flex justify-center mt-5">
                            <a class="px-6 py-[5px] bg-blue-500 font-bold text-white rounded-sm" href=${popupInfo.exploreType === "Ride" ? `/ride/${popupInfo.entityID}` : "#"} >${popupInfo.exploreType === "Ride" ? "View Ride" : "View Friend"}</a>
                        </div>
                    </div>`)
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
