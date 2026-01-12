import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/saga-blue/theme.css"; // PrimeReact theme
import "primereact/resources/primereact.min.css"; // PrimeReact core CSS
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import Mobile_Sidebar from "../Mobile_Sidebar";
import Footer from "../Footer";

const Leaves_Mainbar = () => {
  const [globalFilter, setGlobalFilter] = useState("");

  const data = [
    {
      leavetype: "Sick Leave",
      period: "Nov 1, 2024 - Nov 5, 2024",
      reason: "Flu",
      status: "APPROVED",
    },
    {
      leavetype: "Sick Leave",
      period: "Nov 1, 2024 - Nov 5, 2024",
      reason: "Flu",
      status: "DENIED",
    },
    {
      leavetype: "Sick Leave",
      period: "Nov 1, 2024 - Nov 5, 2024",
      reason: "Flu",
      status: "NEW LEAVE",
    },
    {
      leavetype: "Sick Leave",
      period: "Nov 1, 2024 - Nov 5, 2024",
      reason: "Flu",
      status: "PENDING",
    },
  ];

  const columns = [
    { field: "leavetype", header: "Leave Type" },
    { field: "period", header: "Period" },
    { field: "reason", header: "Reason" },
    {
      field: "status",
      header: "Status",
      body: (rowData) => {
        const textAndBorderColor = rowData.status
          .toLowerCase()
          .includes("new leave")
          ? "blue"
          : rowData.status.toLowerCase().includes("approved")
          ? "#0EB01D"
          : rowData.status.toLowerCase().includes("pending")
          ? "#4E1BD9"
          : rowData.status.toLowerCase().includes("new leave")
          ? "#1F74EC"
          : "#BE6F00";
        return (
          <div
            style={{
              display: "inline-block",
              padding: "4px 8px",
              color: textAndBorderColor,
              border: `1px solid ${textAndBorderColor}`,
              borderRadius: "50px",
              textAlign: "center",
              width: "100px",
              fontSize: "10px",
              fontWeight: 700,
            }}
          >
            {rowData.status}
          </div>
        );
      },
    },
  ];
  return (
    <div className="min-h-screen w-screen flex flex-col justify-between overflow-hidden bg-gray-100 ">
      <div className="px-3 py-3 md:px-7 lg:px-10 xl:px-16 md:py-10">
        <Mobile_Sidebar />

        <div className="flex gap-2 items-center">
          <p className="text-sm text-blue-500">Leaves</p>
          <p>{">"}</p>
        </div>
        <div className="flex flex-col xl:flex-row gap-5 mt-8 justify-between">
          <div className="basis-[65%]">
            <div className="flex items-center  gap-20">
              <p className="text-2xl md:text-3xl font-semibold">Leaves</p>

              <select name="" id="" className="rounded-xl px-5 py-1">
                <option value="">Leave</option>
                <option value="">WFH</option>
              </select>
            </div>

            <div className="flex xl:ms-8  flex-col gap-5 mt-14">
              <div className="flex flex-col md:flex-row gap-1 justify-between">
                <div className="flex flex-col w-full sm:w-auto">
                  <label
                    htmlFor="PROJECT TITLE"
                    className="font-medium text-sm"
                  >
                    LEAVE TYPE
                  </label>
                  <p className="text-sm">Select leave type</p>
                </div>

                <select
                  name=""
                  id=""
                  className="w-full md:w-80 lg:w-[520px] xl:w-96 border-2 rounded-xl ps-4  border-gray-200 h-10"
                >
                  <option value="">Leave</option>
                  <option value="">WFH</option>
                </select>
              </div>

              <div className="flex flex-col md:flex-row gap-1 justify-between">
                <div className="flex flex-col w-full sm:w-auto">
                  <label className="font-medium text-sm">PERIOD OF LEAVE</label>
                  <p className="text-sm">Select Period</p>
                </div>

                <div className="flex gap-5 w-full md:w-80 lg:w-[520px] xl:w-96">
                  <input
                    type="text"
                    placeholder="Jan 9 2025"
                    className="border-2  rounded-xl ps-4 py-2 border-gray-200 outline-none h-10 w-1/2 "
                  />

                  <input
                    type="text"
                    placeholder="Jan 9 2026"
                    className="border-2 rounded-xl ps-4 py-2 border-gray-200 outline-none h-10 w-1/2"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-1 justify-between">
                <div className="flex flex-col w-full sm:w-auto">
                  <label
                    htmlFor="NUMBER OF LEAVES"
                    className="font-medium text-sm"
                  >
                    NUMBER OF LEAVES
                  </label>
                  <p className="text-sm">Only numbers</p>
                </div>

                <input
                  type="number"
                  name="NUMBER OF LEAVES"
                  id="NUMBER OF LEAVES"
                  className="border-2 rounded-xl ps-4 py-2 border-gray-200 outline-none h-10 w-full md:w-80 lg:w-[520px] xl:w-96"
                />
              </div>

              <div className="flex flex-col md:flex-row gap-1 justify-between">
                <div className="flex flex-col w-full sm:w-auto">
                  <label
                    htmlFor="RESPONSIBILITIES"
                    className="font-medium text-sm"
                  >
                    LEAVE REASON
                  </label>
                  <p className="text-sm">Short description</p>
                </div>

                {/* <div className=" border-2 border-gray-200 rounded-xl  w-full md:w-96"> */}
                <textarea
                  rows={3}
                  placeholder="The concise explanation for leave, providing context for their absence"
                  className="border-2  border-gray-200 rounded-xl  w-full  md:w-80 lg:w-[520px] xl:w-96 px-3  "
                />

                {/* </div> */}
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button className="bg-blue-500  text-white px-5 md:px-10 py-1 md:py-2.5  rounded-full">
                Submit
              </button>
            </div>
          </div>

          <div className="bg-white bg-[url('././assets/zigzaglines_small.svg')] h-fit rounded-xl px-3 py-3 md:px-5 md:py-8 mt-10">
            <p className="font-medium text-lg">Leave Activities</p>

            <select
              name=""
              id=""
              className="border mt-2 px-3 w-4/5 py-2 rounded-xl border-gray-200"
            >
              <option value="">This Year</option>
            </select>

            <div className="flex mx-8 flex-col mt-5 gap-3">
              <div className="flex gap-3 items-start">
                <div className="h-4 w-4 rounded-full bg-fuchsia-500"></div>

                <div className="flex flex-col">
                  <p className="text-gray-500 font-medium">
                    Bereavement / Marriage leave
                  </p>
                  <p className="font-bold  text-fuchsia-500">
                    |{" "}
                    <span className="font-normal text-gray-500">5/5 days</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="h-4 w-4 rounded-full bg-sky-500"></div>

                <div className="flex flex-col">
                  <p className="text-gray-500 font-medium">Casual Leave</p>
                  <p className="font-bold  text-sky-500">
                    |{" "}
                    <span className="font-normal text-gray-500">4/6 days</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="h-4 w-4 rounded-full bg-yellow-500"></div>

                <div className="flex flex-col">
                  <p className="text-gray-500 font-medium">Paid Time Off</p>
                  <p className="font-bold  text-yellow-500">
                    |{" "}
                    <span className="font-normal text-gray-500">
                      19/25 days
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="h-4 w-4 rounded-full bg-violet-600"></div>

                <div className="flex flex-col">
                  <p className="text-gray-500 font-medium">
                    Sick / Career leave
                  </p>
                  <p className="font-bold  text-violet-500">
                    |{" "}
                    <span className="font-normal text-gray-500">
                      12/12 days
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ width: "auto", margin: "0 auto" }}>
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
            globalFilter={globalFilter} // This makes the search work
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
                  wordWrap: "break-word", // Allow text to wrap
                  overflow: "hidden", // Prevent text overflow
                  whiteSpace: "normal", // Ensure that text wraps within the available space }}
                }}
              />
            ))}
          </DataTable>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Leaves_Mainbar;
