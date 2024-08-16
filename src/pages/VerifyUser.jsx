import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ImCross } from "react-icons/im";
import { ImCheckmark } from "react-icons/im";
import { Loading } from "../components";
import { apiRequest } from "../utils/apiRequest";

function VerifyUser() {
  const { id, token } = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage("");
      const response = await apiRequest({
        url: `/users/verify/${id}/${token}`,
      });
      setErrorMessage({ success: response.success, message: response.message });
    } catch (error) {
      setErrorMessage(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isSubmitting)
    <div className="bg-bgColor flex w-full h-[100vh] justify-center items-center">
      <Loading />
    </div>;

  return (
    <div className="w-full h-[100vh] flex justify-center items-center p-6 bg-bgColor">
      <div className=" w-full md:w-1/3 2xl:w-1/4 px-6 py-8 shadow-md rounded-lg flex flex-col justify-center items-center gap-5">
        <div className={`text-ascent-1 text-xl font-semibold mt-0.5`}>
          {errorMessage?.message}
        </div>

        {errorMessage?.success === "failed" ? (
          <ImCross size={24} className="text-[#f64949fe]" />
        ) : (
          <ImCheckmark size={24} className="text-[#2ba150fe]" />
        )}

        {errorMessage.success && (
          <Link
            to="/login"
            className="text-lg font-semibold ml-2 cursor-pointer text-[#065ad8]"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
}

export default VerifyUser;
