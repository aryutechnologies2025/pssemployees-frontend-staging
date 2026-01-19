import login_image from "../assets/login_image.svg";
import { SlLock } from "react-icons/sl";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { LuUser } from "react-icons/lu";
import { useState } from "react";
import axiosInstance from "../utils/axiosConfig";
import { useForm } from "react-hook-form";
// import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [captchaValue, setCaptchaValue] = useState(null);

  // const handleCaptchaChange = (value) => {
  //   setCaptchaValue(value);
  //   console.log("Captcha value:", value);
  // };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setApiError("");
    setIsLoading(true);

    try {
      // Make API request to login
      const res = await axiosInstance.post("api/employee/login", data);
      console.log("Response :", res.data);

      if (res.data.status) {
        // Store token and user data in localStorage
        localStorage.setItem("pssemployee", JSON.stringify(res.data.employee));

        localStorage.setItem("psspermission", JSON.stringify(res.data.permission));

        // Navigate to dashboard
        navigate("/dashboard", { replace: true });

        window.scrollTo({ top: 0, behavior: "instant" });
      }
    } catch (err) {
      console.log(err.message);
      setApiError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <div className="flex  items-center justify-center pt-3">
          <img
            src="/pssAgenciesLogo.svg"
            alt="PSS Logo"
            className="w-40 md:w-72 h-auto mx-auto mb-2 md:mt-7"
          />
          {/* <h1 className="font-bold text-2xl md:text-4xl text-blue-500">PSS</h1> */}
        </div>

        <div className="flex items-center flex-wrap-reverse justify-center mt-20 md:mt-10 ">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-sm space-y-4"
          >
            <div className="lg:basis-[50%] flex flex-col items-center justify-center gap-3">
              <p className="text-black font-semibold text-xl md:text-2xl">
                EMPLOYEE LOGIN DEMO
              </p>

              <div className="w-full max-w-sm flex items-center gap-3 bg-[#F8F9FB] px-5 py-4 rounded-xl shadow-sm border border-gray-200">
                <LuUser className="text-2xl text-gray-500" />
                <input
                  type="text"
                  placeholder="Username"
                  {...register("email", {
                    required: "Username is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="bg-transparent w-full outline-none text-black placeholder-gray-500"
                />
              </div>
              {errors?.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}

              {/* Password Field */}
              <div className="relative w-full max-w-sm flex items-center gap-3 bg-[#F8F9FB] px-5 py-4 mt-4 rounded-xl shadow-sm border border-gray-200">
                <SlLock className="text-2xl text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="bg-transparent w-full outline-none text-black placeholder-gray-500"
                />
                <span
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 cursor-pointer text-gray-600"
                >
                  {showPassword ? (
                    <FaEye className="text-xl" />
                  ) : (
                    <FaEyeSlash className="text-xl" />
                  )}
                </span>
              </div>

              {errors?.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}

              {apiError && (
                <div className="text-red-500 text-sm mt-1">{apiError}</div>
              )}
              {/* <div className="recaptacha-login ">
              <ReCAPTCHA
                // sitekey="6Lf_dIMrAAAAAAAZI8KS0KRRyRk7NzMNRyXdgtfv" //live site keydcsddsdsddsdsd


                sitekey="6LcendQqAAAAAEjG8NDVrTcYBiFZG1M24ILVt9cn" //local site key

                onChange={handleCaptchaChange}
              />
            </div>
            {requiredError && (
              <p className="text-red-500 text-sm text-start">
                {requiredError}
              </p>
            )} */}

              <button
                type="submit"
                disabled={isLoading}
                // disabled={!captchaValue}
                className="font-bold mt-3 text-sm bg-gradient-to-r from-[#91ee7c] to-[#1ea600] px-10 py-5 rounded-2xl text-white hover:scale-105 duration-300 transition-all"
                // className={`${
                //     captchaValue
                //       ? "bg-gradient-to-r from-[#91ee7c] to-[#1ea600] text-white"
                //       : "bg-gray-300 text-gray-700"
                //   } font-semibold mt-3 text-sm  px-8 py-3 rounded-full  hover:scale-105 duration-300 `}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  "Login Now"
                )}
              </button>
            </div>
          </form>
          <div className="basis-[50%]  ">
            <img src={login_image} alt="" />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
