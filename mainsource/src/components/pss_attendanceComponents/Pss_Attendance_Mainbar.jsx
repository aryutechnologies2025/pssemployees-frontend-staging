import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { InputText } from "primereact/inputtext";
import { useState, useEffect } from "react";
import Mobile_Sidebar from "../Mobile_Sidebar";
import Footer from "../Footer";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { formatIndianDateTime12Hr, formatToDDMMYYYY, formatToYYYYMMDD } from "../../utils/dateformat";
import axiosInstance from "../../utils/axiosConfig";
import { Capitalise } from "../../utils/useCapitalise";

// Define Zod schema for form validation
const attendanceSchema = z.object({
  shift: z.string().optional(),
  reason: z.string().min(1, "Please select a reason"),
});

const Pss_Attendance_Mainbar = () => {


  const user = JSON.parse(localStorage.getItem("pssemployee") || "{}");
  const companyID = user.company_id;
  const EmpId = user.id;

  const [globalFilter, setGlobalFilter] = useState("");
const [currentTime, setCurrentTime] = useState(new Date());

useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(new Date()); // Updates the Date object every minute
  }, 60000); 

  return () => clearInterval(timer);
}, []);



  const [data, setData] = useState([]);
  console.log("data", data);
  const [shifts, setShifts] = useState([]);
  console.log("shifts", shifts);
  const [error, setError] = useState(null);
  // console.log("data :", data);

  const { id: userId } = JSON.parse(localStorage.getItem("pssemployee"));

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      shift: "",
      reason: "",
    },
  });

  const [reason, setReason] = useState(null);
  console.log("reason", reason);

  const fetchData = async () => {
    try {
      const res = await axiosInstance.get(`api/employee/emp-attendance`, {
        params: {
          attendance_date: formatToYYYYMMDD(new Date()),
          employee_id: EmpId,
        },
      });
      if (res.data.success) {
        setData(res.data.data);
        setReason(res.data.data?.[0]?.reason);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchShipt = async () => {
    try {
      const res = await axiosInstance.get(`api/shifts/activeshift`);
      if (res.data.success) {
        setShifts(res.data.data);

        // console.log("shifts", shifts);

      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchShipt();
  }, []);

 
  function extractTimeFromDateTime(dateTimeStr) {
    if (!dateTimeStr) return "";
    const parts = dateTimeStr.split(" ");
    if (parts.length >= 2) {
      return parts[1]; // Returns "06:01:21"
    }
    return "";
  }

  // Submit handler
  const onSubmit = async (data) => {
    try {
      const newData = {
        attendance_date: formatToYYYYMMDD(new Date()),
        attendance_time: extractTimeFromDateTime(currentTime),
        employee_id: userId,
        reason: data.reason,
        // shift: data.shift,
      };

      const res = await axiosInstance.post(
        `api/employee/emp-attendance/create`,
        newData
      );
      if (res.data.success) {
        toast.success("Attendance submitted!");
        fetchData();
        reset();
      } else {
        setError(res.data.message);
        toast.error(res.data.message);
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.response?.data?.message || "Server Error");
    }
  };

  const columns = [
    { field: "attendance_date", header: "Date",
      body: (row) => formatToDDMMYYYY(row.attendance_date),
     },
{
  header: "Time",
  field: "attendance_time",
  body: (row) => formatTime(row.attendance_time),
},
    {
      field: "reason", header: "Reason",
      body: (row) => Capitalise(row.reason || "-")

    },
    // {
    //   field: "shift",
    //   header: "Shift",
    //   body: (row) => row.shift?.shift_name || "-"
    // }
  ];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

      const date = formatToDDMMYYYY(now);

      setCurrentTime(`${date} ${time}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="w-screen min-h-screen overflow-x-hidden flex flex-col justify-between bg-gray-100">
      <div className="px-3 py-3 md:px-7 lg:px-10 xl:px-16 md:py-10">
        <Mobile_Sidebar />

        <div className="flex gap-2 items-center">
          <p className="text-xs md:text-sm text-[#1ea600]">Attendance</p>
          <p>{">"}</p>
        </div>

        <div className="bg-[url('././assets/zigzaglines_large.svg')] bg-no-repeat bg-cover bg-center rounded-3xl bg-opacity-25 mt-8 px-5 py-3">
          <p className="text-2xl md:text-3xl font-semibold">Attendance</p>

          {/* Wrap form with handleSubmit */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex w-full mt-5 justify-center items-center">
              <div className="flex flex-col gap-5 ">
                <div className="flex flex-col lg:flex-row gap-x-8 justify-between">
                  <p>Current Date & Time</p>
                  <input
                    type="text"
                    readOnly
                    value={formatIndianDateTime12Hr(currentTime)}
                    className="border w-full md:w-96 rounded-md py-1 px-2 outline-none"
                  />
                </div>

                {/* <div className="flex flex-col sm:flex-row gap-x-8 justify-between">
                  <p>Shift</p>
                  <div className="flex gap-8 w-full md:w-96">
                    <div className="flex gap-1">
                      {shifts.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-center items-center gap-2"
                        >
                          <input
                            type="radio"
                            value={item.id}
                            {...register("shift")}
                            id="dayShift"
                            defaultChecked
                          />

                          <div className="flex flex-col justify-center items-center">
                            <label htmlFor="Ashift">{item.shift_name}</label>
                            <span>
                              {formatTime(item.start_time)} -{" "}
                              {formatTime(item.end_time)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div> */}

                {/* <div className="flex flex-col lg:flex-row gap-x-8 justify-between">
                  <p className="text-sm font-medium text-gray-700">Shift</p>

                  <div className="flex gap-3 w-full md:w-96 flex-wrap">
                    {shifts.map((item) => (
                      <label
                        key={item.id}
                        className="inline-flex items-center gap-2 
        border rounded-md
        px-2 py-1.5 cursor-pointer w-fit"
                      >
                        <input
                          type="radio"

                          value={item.id}
                          {...register("shift")}
                          className="accent-green-600 scale-90"
                        />

                        <div className="flex flex-col leading-tight">
                          <span className="text-xs font-medium text-gray-800">
                            {item.shift_name}
                          </span>
                          <span className="text-[11px] text-gray-500">
                            {formatTime(item.start_time)} - {formatTime(item.end_time)}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                {errors.shift && (
                  <p className="text-red-500 text-sm mt-1 ml-40">
                    {errors.shift.message}
                  </p>
                )} */}

                <div className="flex flex-col lg:flex-row gap-x-8 justify-between">
                  <p>Reason</p>
                  <select
                    {...register("reason")}
                    className="border w-full py-1 px-2 md:w-96 rounded-md outline-none"
                    defaultValue="login"
                  >
                    <option value="" disabled hidden>
                      Select Reason
                    </option>
                    {/* <option value="login">Login</option>
                    <option value="breakout">Break Out</option>
                    <option value="breakin">Break In</option>
                    <option value="logout">Logout</option> */}

                    {reason === "login" ? (
                      <>
                        <option value="breakout" className="cursor-pointer">Break Out</option>
                        <option value="logout" className="cursor-pointer">Logout</option>
                      </>
                    ) : reason === "breakout" ? (
                      <>
                        <option value="breakin" className="cursor-pointer">Break In</option>
                        {/* <option value="Logout">Logout</option> */}
                      </>
                    ) : reason === "breakin" ? (
                      <>
                        <option value="breakout" className="cursor-pointer">Break Out</option>
                        <option value="logout" className="cursor-pointer">Logout</option>
                      </>
                    ) : (
                      <option value="login" className="cursor-pointer">Login</option>
                    )}
                  </select>
                </div>
                {/* Display reason error if exists */}
                {errors.reason && (
                  <p className="text-red-500 text-sm mt-1 ml-40">
                    {errors.reason.message}
                  </p>
                )}
                {error && (
                  <p className="text-red-500 text-sm mt-1 ml-40">{error}</p>
                )}
                <div className="flex flex-col lg:flex-row gap-x-8 justify-center">
                  <button
                    type="submit"
                    className="bg-[#1ea600] text-white py-2 px-4 rounded-md hover:bg-[#188800] transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div style={{ width: "auto", margin: "0 auto" }}>
          {/* Global Search Input */}
          <div className="mt-8 flex justify-end">
            <InputText
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search"
              className="px-2 py-2 rounded-md"
            />
          </div>

          <DataTable
            className="mt-8"
            value={data}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 20]}
            globalFilter={globalFilter}
            showGridlines
            resizableColumns
          >
            {columns.map((col, index) => (
              <Column
                key={index}
                field={col.field}
                header={col.header}
                body={col.body}
                style={{
                  minWidth: "150px",
                  wordWrap: "break-word",
                  overflow: "hidden",
                  whiteSpace: "normal",
                }}
              />
            ))}
          </DataTable>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Pss_Attendance_Mainbar;
