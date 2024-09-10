import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { UseFormRegister, FieldErrors, Control } from "react-hook-form";
import DatePicker from "react-datepicker";
import { addDays, setHours, setMinutes } from "date-fns";
import { IoMdArrowDropdown } from "react-icons/io";
import ReactQuill from "react-quill";
import MapBox from "@/components/module/MapBox";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { ActivityType } from "@/shared/types/addRide.types";
import { formatDate, parseTime } from "@/shared/util/dateFormat.util";

interface RideDetailsProps {
  register: UseFormRegister<any>;
  setValue: (name: string, value: any) => void;
  errors: FieldErrors;
  data?: any;
  setData?: any;
}

interface ComponentType {
  types: string[];
  long_name: string;
}

const RideDetails: React.FC<RideDetailsProps> = ({
  register,
  errors,
  setValue,
  data,
  setData,
}) => {
  const [startDate, setStartDate] = useState<Date | null | any>(
    data?.activityDate || addDays(new Date(), 1)
  );
  const [startTime, setStartTime] = useState<Date | null | any>(
    data?.activityStartTime || setHours(setMinutes(new Date(), 30), 7)
  );
  const [endTime, setEndTime] = useState<Date | null | any>(
    data?.activityEndTime || setHours(setMinutes(new Date(), 30), 11)
  );
  const [lat, setLat] = useState<number>(data?.startLat||28.5355);
  const [lng, setLng] = useState<number>(data?.startLng||77.3910);
  const [code, setCode] = useState<string>(data?.activityNotes || "");
  const [city, setCity] = useState<string>(data?.startCity || "");
  const [state, setState] = useState<string>(data?.startState || "");
  const [country, setCountry] = useState<string>(data?.startCountry || "");
  const autocompleteRef = useRef<any>(null);

  const activityType = useSelector<RootState, ActivityType[]>(
    (state) => state.addRide.activityTypes
  );

  useEffect(() => {
    setStartDate(formatDate(data.activityDate));
    setStartTime(parseTime(data.activityStartTime));
    setEndTime(parseTime(data.activityEndTime));
    setLat(data.startLat);
    setLng(data.startLng);
    setCode(data.activityNotes);
    setCity(data.startCity);
    setState(data.startState);
    setCountry(data.startCountry);
  }, [data]);

  useEffect(() => {
    setData?.({
      note: code === "<p><br></p>" ? null : code,
      startCity: city,
      startState: state,
      startCountry: country,
      startLat: lat,
      startLng: lng,
      startDate,
      startTime,
      endTime,
    });
  }, [
    code,
    city,
    state,
    country,
    lat,
    lng,
    startDate,
    startTime,
    endTime,
    setData,
  ]);

  const loadGoogleMapsScript = useCallback(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API}&libraries=places,geometry`;
    script.async = true;
    script.onload = initAutocomplete;
    document.body.appendChild(script);
  }, []);

  const initAutocomplete = useCallback(() => {
    const input = document.getElementById("autocomplete") as HTMLInputElement;
    if (input) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        input,
        {
          types: ["geocode"],
        }
      );
      autocompleteRef.current.addListener("place_changed", handlePlaceSelect);
    }
  }, []);

  const handlePlaceSelect = useCallback(() => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.geometry) {
      const { formatted_address, geometry, address_components } = place;
      const homeBaseLat = geometry.location.lat();
      const homeBaseLng = geometry.location.lng();
      let homeBaseCity = "";
      let homeBaseState = "";
      let homeBaseCountry = "";
      address_components.forEach((component: ComponentType) => {
        if (component.types.includes("locality"))
          homeBaseCity = component.long_name;
        if (component.types.includes("administrative_area_level_1"))
          homeBaseState = component.long_name;
        if (component.types.includes("country"))
          homeBaseCountry = component.long_name;
      });
      setLat(homeBaseLat);
      setLng(homeBaseLng);
      setCity(homeBaseCity);
      setState(homeBaseState);
      setCountry(homeBaseCountry);
      setValue("startAddress", formatted_address);
    }
  }, [setValue]);

  useEffect(() => {
    if (!window.google) {
      loadGoogleMapsScript();
    } else {
      initAutocomplete();
    }
    return () => {
      window.google?.maps?.event.clearInstanceListeners(
        autocompleteRef.current
      );
    };
  }, [loadGoogleMapsScript, initAutocomplete]);
  const handelMarkerChnage = (cords: [number, number]) => {
    setLng(cords[0]);
    setLat(cords[1]);
  };
  const mapMemo = useMemo(
    () => (
      <MapBox
        center={[lng, lat]}
        initialZoom={11}
        circle={10 * 1}
        className={"h-[43vh] w-[90%]"}
        setMarkerPos={handelMarkerChnage}
      />
    ),
    [lng, lat]
  );

  return (
    <div className="shadow-xl rounded-xl p-5">
      <div className="mt-2 mb-14">
        <div className="w-full flex flex-col tablet:flex-row gap-5">
          <div className="tablet:w-1/2 w-full space-y-5">
            <div className="flex flex-col">
              <label className="font-medium text-gray-600">Ride name</label>
              <input
                type="text"
                defaultValue={data?.activityName}
                placeholder="Ride name"
                {...register("rideName", {
                  required: "Please enter a ride name.",
                })}
                className={`border px-2 py-[6px] w-full ${
                  errors.rideName ? "input-error" : ""
                }`}
              />
              {errors.rideName && (
                <p className="text-red-500 text-xs pt-1">
                  Please enter a ride name.
                </p>
              )}
            </div>
            <div className="flex gap-4 flex-col tablet:flex-row">
              <div className="w-full tablet:w-1/2 flex flex-col">
                <label className="font-medium text-gray-600">Start date</label>
                <DatePicker
                  selected={startDate}
                  onChange={setStartDate}
                  className="custom-datepicker-input"
                  dateFormat="eee, MMMM d, yyyy"
                />
              </div>
              <div className="flex w-full tablet:w-1/2 gap-3">
                <div className="w-1/2 flex flex-col">
                  <label className="font-medium text-gray-600">
                    Start time
                  </label>
                  <DatePicker
                    selected={startTime}
                    onChange={setStartTime}
                    className="custom-datepicker-input"
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                  />
                </div>
                <div className="w-1/2 flex flex-col">
                  <label className="font-medium text-gray-600">End time</label>
                  <DatePicker
                    selected={endTime}
                    onChange={setEndTime}
                    className="custom-datepicker-input"
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                  />
                  {/* {errors.endTime && (
                    <p className="text-red-500 text-xs pt-1">
                      {errors.endTime.message}
                    </p>
                  )} */}
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-600">
                Start Location - search
              </label>
              <input
                defaultValue={data.startAddress}
                {...register("startAddress", {
                  required: "Please select a start location.",
                })}
                id="autocomplete"
                className={`bg-white border px-2 py-[6px] ${
                  errors.startAddress ? "input-error" : ""
                }`}
                placeholder="Search location"
              />
              {errors.startAddress && (
                <p className="text-red-500 text-xs pt-1">
                  Please select a start location.
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-600">Ride Type</label>
              <div className="relative">
                <select
                  defaultValue={data?.activityTypeID}
                  {...register("rideType", {
                    required: "Please select a Ride Type",
                  })}
                  className={`bg-white border px-2 py-[6px] ${
                    errors.rideType ? "input-error" : ""
                  }`}
                >
                  <option value="" disabled>
                    Ride Type
                  </option>
                  {activityType.map((type) => (
                    <option
                      key={type.activityTypeID}
                      value={type.activityTypeID}
                    >
                      {type.activityTypeName}
                    </option>
                  ))}
                </select>
                <IoMdArrowDropdown className="w-5 h-auto absolute right-3 top-[11px]" />
                {/* {errors.rideType && (
                  <p className="text-red-500 text-xs pt-1">
                    {errors.rideType.message}
                  </p>
                )} */}
              </div>
            </div>
          </div>
          <div className="tablet:w-1/2 w-full mt-5">{mapMemo}</div>
        </div>
        <div className="my-5">
          <label className="font-medium text-gray-600">Notes</label>
          <ReactQuill theme="snow" value={code} onChange={setCode} />
        </div>
      </div>
    </div>
  );
};

export default RideDetails;
