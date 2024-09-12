import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import mapboxgl, { Map as MapboxMap, LngLatBounds } from 'mapbox-gl';
import { RootState } from '@/redux/store/store';
import { Explore } from '@/shared/types/dashboard.types';
import { formatDate, parseISO } from 'date-fns';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

interface MapBoxModalProps {
    profile: { homeBaseLng: number, homeBaseLat: number } | any;
}

const MapBoxModal: React.FC<MapBoxModalProps> = ({ profile }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<MapboxMap | null>(null);
    const [mapInitialized, setMapInitialized] = useState(false);
    const [currentStyle, setCurrentStyle] = useState('mapbox://styles/mapbox/streets-v12');
    const exploreData = useSelector<RootState, Explore[]>((state) => state.dashboard.expoloreData);
    const [popupInfo, setPopupInfo] = useState<Explore | null |any>(null);

    // Memoized GeoJSON data for clustering
    const geoJsonData:any = useMemo(() => ({
        type: 'FeatureCollection',
        features: exploreData.map((data) => ({
            type: 'Feature',
            properties: {
                entityName: data.entityName,
                entityID: data.entityID,
                exploreType: data.exploreType,
                entityDate: data.entityDate,
            },
            geometry: {
                type: 'Point',
                coordinates: [data.entityLng || 0, data.entityLat || 0],
            },
        })),
    }), [exploreData]);

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

                // Add a clustered GeoJSON source
                map.addSource('exploreData', {
                    type: 'geojson',
                    data: geoJsonData,
                    cluster: true,
                    clusterMaxZoom: 14, // Max zoom to cluster points
                    clusterRadius: 50,  // Radius of each cluster in pixels
                });

                // Add cluster circles
                map.addLayer({
                    id: 'clusters',
                    type: 'circle',
                    source: 'exploreData',
                    filter: ['has', 'point_count'],
                    paint: {
                        'circle-color': [
                            'step',
                            ['get', 'point_count'],
                            '#ff0000',
                            100,
                            '#ff0000',
                            750,
                            '#ff0000',
                        ],
                        'circle-radius': [
                            'step',
                            ['get', 'point_count'],
                            20,
                            100,
                            30,
                            750,
                            40,
                        ],
                        'circle-stroke-width': 6,
                        'circle-stroke-color': '#ff8080'
                    },
                });

                // Add cluster count labels
                map.addLayer({
                    id: 'cluster-count',
                    type: 'symbol',
                    source: 'exploreData',
                    filter: ['has', 'point_count'],
                    layout: {
                        'text-field': '{point_count_abbreviated}',
                        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                        'text-size': 12,
                    },
                });

                // Add unclustered points (individual markers)
                map.addLayer({
                    id: 'unclustered-point',
                    type: 'circle',
                    source: 'exploreData',
                    filter: ['!', ['has', 'point_count']],
                    paint: {
                        'circle-color': '#ff0000',
                        'circle-radius': [
                            'case',
                            ['==', ['get', 'exploreType'], 'Ride'], 12,
                            11
                        ],
                        'circle-stroke-width': 3,
                        'circle-stroke-color': '#fff',
                    },
                });

                // Click event for clusters
                map.on('click', 'clusters', (e) => {
                    const features = map.queryRenderedFeatures(e.point, {
                        layers: ['clusters'],
                    }) as any;
                    const clusterId = features[0].properties?.cluster_id;

                    (map.getSource('exploreData') as any).getClusterExpansionZoom(
                        clusterId,
                        (err: any, zoom: number) => {
                            if (err) return;

                            map.easeTo({
                                center: features[0]?.geometry?.coordinates,
                                zoom,
                            });
                        }
                    );
                });

                // Click event for unclustered points
                map.on('click', 'unclustered-point', (e) => {
                    const feature = e.features?.[0] as any;
                    console.log(feature)
                    const coordinates = feature?.geometry.coordinates.slice();
                    const properties = feature?.properties;

                    setPopupInfo({
                        entityName: properties.entityName,
                        entityID: properties.entityID,
                        exploreType: properties.exploreType,
                        entityDate: properties.entityDate,
                        entityLng: coordinates[0],
                        entityLat: coordinates[1],
                    });
                });

                // Add popup for individual points
                if (popupInfo) {
                    const popup = new mapboxgl.Popup({ closeOnClick: false })
                        .setLngLat([popupInfo.entityLng || 0, popupInfo.entityLat || 0])
                        .setHTML(`
                            <div style="background-color: white; padding: 0.5rem; color: black; width: 13rem; margin-top: 0.75rem;">
                                <div class="flex items-start flex-col">
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
                        .addTo(map);
                    return () => {
                        popup.remove();
                    };
                }

                map.addControl(new mapboxgl.FullscreenControl(), 'top-left');
                map.addControl(new mapboxgl.NavigationControl(), 'top-left');
            });

            mapRef.current = map;
        }
    }, [profile, mapInitialized, geoJsonData, popupInfo]);

    return (
        <div className='' ref={mapContainerRef} style={{ width: '100%', height: '100%', position: 'relative' }} />
    );
};

export default MapBoxModal;
