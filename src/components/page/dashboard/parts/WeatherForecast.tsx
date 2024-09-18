import { RootState } from "@/redux/store/store";
import { DashboardWeatherForecast } from "@/shared/types/dashboard.types";
import { formatDates } from "@/shared/util/dateFormat.util";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const WeatherForecast = () => {
    const weather = useSelector<RootState, DashboardWeatherForecast[]>(
        (state) => state.dashboard.weather
    );
    return (
        <div className='mt-6 sticky top-28'>
            {weather?.map((data, index) => (
                <div
                    className='border border-neutral-300 rounded-md bg-white mt-2 flex px-2 py-4 gap-2 text-sm text-gray-600'
                    key={index}>
                    <div>
                        <img src={data.conditionIcon} alt='' />
                    </div>
                    <div>
                        <p className='font-bold '>
                            {formatDates(
                                data.forecastDate,
                                "EEE, MMM dd, yyyy"
                            )}
                        </p>
                        <p className='text-secondaryButton'>
                            {data.conditionSummary}
                        </p>
                        <div className='flex '>
                            <p>Low {data.lowTemp}</p>
                            <p> / High {data.highTemp}</p>
                        </div>
                        <p>Winds {data.windDirection}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default WeatherForecast;
