"use client";
import { checkUserRating, setActivityrating } from "@/redux/slices/ratingSlice";
import { getActivityroute } from "@/redux/slices/rideDetailsSlice";
import { AppDispatch, RootState } from "@/redux/store/store";
import { User } from "@/shared/types/account.types";
import { Item } from "@/shared/types/dashboard.types";
import { ActivityRoute } from "@/shared/types/rideDetail.types";
import { formatDates } from "@/shared/util/dateFormat.util";
import { Box, CheckboxProps, useCheckbox } from "@chakra-ui/react";
import dayjs from "dayjs";
import { FC, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CgSpinner } from "react-icons/cg";
import { FaCheck, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import { ratingLatt } from "@/assets";
import { useRouter } from "next/navigation";

interface RatingPageProps {
  id: number;
}

interface QuestionProps {
  text: string;
  isChecked: boolean;
  onToggle: () => void;
}

const StarIcon: FC<{ filled: boolean; half?: boolean }> = ({
  filled,
  half,
}) => {
  if (half) {
    return <FaStarHalfAlt className="h-12 w-12 text-blue-900" />;
  }
  return (
    <FaStar
      className={`h-12 w-12 ${filled ? "text-blue-900" : "text-gray-300"}`}
    />
  );
};

const CircleCheckbox: FC<CheckboxProps> = (props) => {
  const { getInputProps, getCheckboxProps } = useCheckbox(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="20px"
        height="20px"
        borderRadius="50%"
        borderWidth="2px"
        borderColor="blue.900"
        backgroundColor={props.isChecked ? "blue.900" : "transparent"}
        _hover={{
          backgroundColor: props.isChecked ? "blue.900" : "blue.100",
        }}
        _checked={{
          backgroundColor: "blue.900",
          color: "white",
        }}
      >
        {props.isChecked && <FaCheck color="white" size="12px" />}
      </Box>
    </Box>
  );
};

const Question: FC<QuestionProps> = ({ text, isChecked, onToggle }) => (
  <button
    className="w-full px-3 py-2 text-left border rounded-md flex justify-between items-center"
    onClick={onToggle}
    type="button"
  >
    {text}
    <CircleCheckbox isChecked={isChecked} />
  </button>
);

const StarRating: FC<{
  rating: number;
  setRating: (rating: number) => void;
}> = ({ rating, setRating }) => {
  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    star: number
  ) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - left) / width;
    setRating(star - 1 + (percent > 0.5 ? 1 : 0.5));
  };

  return (
    <div className="flex space-x-1 justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <div
          key={star}
          className="relative cursor-pointer"
          onClick={(e) => handleMouseMove(e, star)}
          onMouseMove={(e) => handleMouseMove(e, star)}
          onMouseLeave={() => setRating(Math.round(rating * 2) / 2)}
        >
          <StarIcon filled={rating >= star} />
          {rating > star - 1 && rating < star && (
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: "50%" }}
            >
              <StarIcon filled={true} half={true} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export const RatingPage: FC<RatingPageProps> = ({ id }) => {
  const [rating, setRating] = useState<number>(0);
  const [hasRated, setHasRated] = useState<boolean>(false);
  const [loading, setloading] = useState<boolean>(false);
  const [questions, setQuestions] = useState([
    { text: "Route as planned?", checked: false },
    { text: "Felt safe on this ride?", checked: false },
    { text: "Weather forecast accurate?", checked: false },
    { text: "Average speed accurate?", checked: false },
  ]);
  const [comment, setComment] = useState<string>("");
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>();
  const userData = useSelector<RootState>((state) => state.auth.user) as User;
  const rides = useSelector<RootState>(
    (state) => state.rideDetail.rides
  ) as Item;
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<any>();

  const getUserRating = async (id: number, userId: number) => {
    dispatch(getActivityroute(id));
    const response = await dispatch(
      checkUserRating({ activityID: id, userID: userId })
    );
    if (checkUserRating.fulfilled.match(response)) {
      setHasRated(response.payload);
    } else {
      toast.error("something went wrong");
    }
  };

  useEffect(() => {
    if (id && userData.id) {
      getUserRating(id, userData.id);
    }
  }, [id, userData.id]);

  const onSubmit: SubmitHandler<any> = async (data) => {
    if (rating === 0) {
      toast.error("Please rate the ride before submitting.");
    } else {
      const payload = {
        createdDate: dayjs().toISOString(),
        ratingDate: dayjs().toISOString(),
        activityID: Number(id),
        userID: userData.id,
        userRating: rating,
        routeGood: questions?.[0].checked,
        saftetyGood: questions?.[1].checked,
        weatherGood: questions?.[2].checked,
        speedGood: questions?.[3].checked,
        userComments: comment,
        isDeleted: false,
        createdBy: userData.id,
        modifiedBy: userData.id,
        modifiedDate: dayjs().toISOString(),
      };
      setloading(true);
      const response = await dispatch(setActivityrating(payload));
      setloading(false);
      if (setActivityrating.fulfilled.match(response)) {
        router.push(`/ride/${id}`)
        toast.success("Your rating has been submitted.");
      } else {
        toast.error("something went wrong");
      }
    }
  };

  const toggleQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions[index].checked = !newQuestions[index].checked;
    setQuestions(newQuestions);
  };

  return (
    <div className="w-11/12 mx-auto !max-w-[1320px] mt-28">
      <div className={` bg-white  rounded-lg mb-6 mt-3 p-6 mx-auto ${hasRated&& "w-1/2"}`}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-8  ">
            <div className={` flex flex-col space-y-5 ${hasRated?"w-full":"w-1/2"}`}>
              <div className="bg-blue-900 text-white p-4 rounded-md">
                <h3 className="font-bold">{rides?.activityName}</h3>
                <p className="text-sm">
                  {rides?.activityDate &&
                    formatDates(rides?.activityDate, "EEEE, MMMM dd, yyyy")}
                </p>
              </div>

              {!hasRated ? (
                <>
                  <p className="text-center font-bold w-2/3 items-center mx-auto">
                    How was your ride? Your feedback will help ride leaders
                    create better rides.
                  </p>

                  <StarRating rating={rating} setRating={setRating} />

                  <div className="space-y-2">
                    {questions.map((q, index) => (
                      <Question
                        key={index}
                        text={q.text}
                        isChecked={q.checked}
                        onToggle={() => toggleQuestion(index)}
                      />
                    ))}
                  </div>

                  <textarea
                    className="w-full p-2 border rounded-md"
                    rows={4}
                    placeholder="Comments"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />

                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-md"
                    disabled={loading}
                  >
                    {loading ? (
                      <CgSpinner className="animate-spin w-6 h-6 mx-auto" />
                    ) : (
                      "Submit Rating"
                    )}
                  </button>
                </>
              ) : (
                <>
                  <div className="flex justify-center flex-col items-center">
                    <div >
                      <Lottie
                        className="w-1/2 mx-auto"
                        aria-activedescendant=""
                        animationData={ratingLatt}
                        loop={true}
                      ></Lottie>
                    </div>
                    <p className="mt-4 mb-10 font-medium text-center"> You have already rated this ride.</p>
                    <button
                     onClick={()=>router.back()}
                      type="button"
                      className="  bg-blue-500 text-white py-2 px-6 rounded-md"
                    >
                      Go Back
                    </button>
                  </div>
                </>
              )}
            </div>
            {!hasRated && (
              <div className="w-1/2 overflow-hidden">
                <img
                  className=" w-full h-full rounded-lg  "
                  src="https://dev.chasingwatts.com/ogmaps/ogmap_743.png"
                  alt="he"
                />
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
