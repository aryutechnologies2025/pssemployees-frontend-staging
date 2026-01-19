import { useState, useEffect } from "react";
import { TfiPencilAlt } from "react-icons/tfi";
import { IoIosArrowForward } from "react-icons/io";
import Footer from "../Footer";
import Mobile_Sidebar from "../Mobile_Sidebar";
import { DataTable } from "primereact/datatable";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FiSearch } from "react-icons/fi";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "../../utils/axiosConfig";
import { FaEye } from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
import { IoIosCloseCircle } from "react-icons/io";
import Loader from "../Loader";





const ContractCandidates_Mainbar = () => {

  const user = JSON.parse(localStorage.getItem("pssemployee") || "{}");
const companyID = user.company_id;

  const hasCompanyAccess =
  Array.isArray(companyID) && companyID.length > 0;

  

  if (!hasCompanyAccess) {
    return (
     <div className="flex items-center justify-center min-h-[60vh] mx-auto">
      <div className="bg-white shadow-lg rounded-xl p-8 text-center max-w-md">
        <h2 className="text-xl font-semibold text-red-600 mb-3">
          Access Restricted
        </h2>
        <p className="text-gray-600">
          This page is restricted, and access is not permitted at this time.
        </p>
      </div>
    </div>
    );
  }

  //navigation
  const navigate = useNavigate();
  const [editData, setEditData] = useState(null);
  const [columnData, setColumnData] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  const [backendValidationError, setBackendValidationError] = useState(null);

  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState(true);

  // Filter states - FIXED: Corrected variable names
  // const [filterStartDate, setFilterStartDate] = useState(() => {
  //   return new Date().toISOString().split("T")[0];
  // });
  // const [filterEndDate, setFilterEndDate] = useState(() => {
  //   return new Date().toISOString().split("T")[0];
  // });
  const [filterInterviewStatus, setFilterInterviewStatus] = useState("");
  const [filterCandidateStatus, setFilterCandidateStatus] = useState("");
  const [selectedReference, setSelectedReference] = useState("");

  // Table states
  const [rows, setRows] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");

  const [ModalOpen, setIsModalOpen] = useState(false);

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewRow, setViewRow] = useState(null);

  const {
    id: userId,
    role_id: roleId,
    company_id: companyId,
  } = JSON.parse(localStorage.getItem("pssemployee"));

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0]; // "2025-11-27"
  };

  const candidateContractSchema = z
    .object({
      name: z.string().min(1, "Name is required"),
      phone: z.string().regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
      aadhar: z.string().regex(/^\d{12}$/, "Aadhar must be exactly 12 digits"),
      company: z.string().min(1, "Company is required"),
      interviewDate: z.string().min(1, "Interview date is required"),
      interviewStatus: z.string().min(1, "Interview status is required"),
      candidateStatus: z.string().optional(),
      reference: z.string().optional(),
      education: z.string().optional(),

      // Make these optional in base schema, they'll be conditionally required
      rejectReason: z.string().optional(),
      holdReason: z.string().optional(),
      waitReason: z.string().optional(),
      selectedJoiningDate: z.string().optional(),
      notJoinedReason: z.string().optional(),
      joinedDate: z.string().optional(),
      otherReference: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      // Interview status specific validations
      if (
        data.interviewStatus === "selected" &&
        !data.selectedJoiningDate?.trim()
      ) {
        ctx.addIssue({
          path: ["selectedJoiningDate"],
          message: "Joining date is required when interview is selected",
          code: z.ZodIssueCode.custom,
        });
      }

      if (data.interviewStatus === "rejected" && !data.rejectReason?.trim()) {
        ctx.addIssue({
          path: ["rejectReason"],
          message: "Reject reason is required when interview is rejected",
          code: z.ZodIssueCode.custom,
        });
      }

      if (data.interviewStatus === "hold" && !data.holdReason?.trim()) {
        ctx.addIssue({
          path: ["holdReason"],
          message: "Hold reason is required when interview is on hold",
          code: z.ZodIssueCode.custom,
        });
      }

      if (data.interviewStatus === "waiting" && !data.waitReason?.trim()) {
        ctx.addIssue({
          path: ["waitReason"],
          message: "Wait reason is required when interview is waiting",
          code: z.ZodIssueCode.custom,
        });
      }

      // Candidate status specific validations
      if (data.candidateStatus === "joined" && !data.joinedDate?.trim()) {
        ctx.addIssue({
          path: ["joinedDate"],
          message: "Joined date is required when candidate joins",
          code: z.ZodIssueCode.custom,
        });
      }

      if (
        data.candidateStatus === "not_joined" &&
        !data.notJoinedReason?.trim()
      ) {
        ctx.addIssue({
          path: ["notJoinedReason"],
          message: "Reason is required when candidate does not join",
          code: z.ZodIssueCode.custom,
        });
      }

      // Reference validation
      if (data.reference === "other" && !data.otherReference?.trim()) {
        ctx.addIssue({
          path: ["otherReference"],
          message: "Other reference is required when reference is 'other'",
          code: z.ZodIssueCode.custom,
        });
      }
    });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(candidateContractSchema),
    defaultValues: {
      name: "",
      phone: "",
      aadhar: "",
      company: "",
      interviewDate: getTodayDate(),
      interviewStatus: "",
      rejectReason: "",
      holdReason: "",
      waitReason: "",
      selectedJoiningDate: "",
      candidateStatus: "",
      notJoinedReason: "",
      joinedDate: getTodayDate(),
      reference: "",
      otherReference: "",
      education: "",
    },
  });

  // Filter options
  const interviewStatusOptions = [
    { label: "All Status", value: "" },
    { label: "Selected", value: "selected" },
    { label: "Rejected", value: "rejected" },
    { label: "Hold", value: "hold" },
    { label: "Waiting", value: "waiting" },
  ];

  const candidateStatusOptions = [
    { label: "All Status", value: "" },
    { label: "Joined", value: "joined" },
    { label: "Not Joined", value: "not_joined" },
  ];

  const interviewStatus = watch("interviewStatus");
  const candidateStatus = watch("candidateStatus");
  const reference = watch("reference");

  useEffect(() => {
    if (interviewStatus !== "rejected") {
      setValue("rejectReason", "");
    }

    if (interviewStatus !== "hold") {
      setValue("holdReason", "");
    }

    if (interviewStatus !== "waiting") {
      setValue("waitReason", "");
    }

    if (candidateStatus !== "not_joined") {
      setValue("notJoinedReason", "");
    }
  }, [interviewStatus, candidateStatus, setValue]);

  const handleApplyFilter = () => {
    // Get all the data
    const allData = columnData; // Assuming columnData contains all the candidates

    // Start with all data
    let filteredData = [...allData];

    // Filter by Reference
    if (selectedReference) {
      filteredData = filteredData.filter(
        (candidate) => candidate.reference === selectedReference
      );
    }

    // Filter by Interview Status
    if (filterInterviewStatus) {
      filteredData = filteredData.filter(
        (candidate) => candidate.interview_status === filterInterviewStatus
      );
    }

    // Filter by Candidate Status (Joining Status)
    if (filterCandidateStatus) {
      filteredData = filteredData.filter(
        (candidate) => candidate.joining_status === filterCandidateStatus
      );
    }

    // Update the displayed data
    setColumnData(filteredData);

    // Log for debugging
    console.log({
      selectedReference,
      filterInterviewStatus,
      filterCandidateStatus,
      filteredCount: filteredData.length,
      totalCount: allData.length,
    });
  };

  // Reset filters
  const handleResetFilter = () => {
    // setFilterStartDate(null);
    // setFilterEndDate(null);
    setSelectedReference("");
    setFilterInterviewStatus("");
    setFilterCandidateStatus("");
    fetchContractCandidates();
  };

  const formatDateToYMD = (date) => {
    if (!date) return null;

    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Open and close modals
  const openAddModal = () => {
    setIsModalOpen(true);
    setEditData(null);
    reset({
      defaultValues: true,
    });
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeAddModal = () => {
    setIsAnimating(false);
    setEditData(null); // Clear edit data
    setSelectedCompany(null); // Clear selected company
    setTimeout(() => {
      setIsModalOpen(false);
      setBackendValidationError(null);
    }, 250);
  };

  const handleView = (row) => {
    setViewRow(row);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewRow(null);
  };

  useEffect(() => {
    if (ModalOpen) {
      fetchCompanyList();
    }
  }, [ModalOpen]);

  


  const fetchCompanyList = async () => {
    try {
      const response = await axiosInstance.get("/api/company");

      if (response.data.success) {
        const companies = response.data.data
        console.log("companies......... : ",response)
          .filter(
          (company) =>
            String(company.status) === "1" &&
            String(company.is_deleted) === "0"
        )
        .map((company) => ({
          label: company.company_name,
          value: company.id,
        }));
console.log("Active Companies......... : ",companies)
        setCompanyOptions(companies);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const openEditModal = (row) => {
    const mappedData = {
      id: row.id || null,
      name: row.name || "",
      phone: row.phone_number || "",
      aadhar: row.aadhar_number || "",
      company: String(row.company_id) || null,
      interviewDate: row.interview_date || "",
      interviewStatus: row.interview_status || "",
      candidateStatus: row.joining_status || "",
      joinedDate: row.joined_date || "",
      selectedJoiningDate: row.joining_date || "",
      reference: row.reference || "",
      otherReference: row.other_reference || "",
      education: row.education || "",
      notJoinedReason:

        row.notes
          ?.filter((n) => n.note_status === "not_joined")
          .map((n) => (n.note_status === "not_joined" ? n.notes : "")) || "",
      rejectReason:
        row.notes
          ?.filter((n) => n.note_status === "reject")
          .map((n) => (n.note_status === "reject" ? n.notes : "")) || "",
      holdReason:
        row.notes
          ?.filter((n) => n.note_status === "hold")
          .map((n) => (n.note_status === "hold" ? n.notes : "")) || "",
      waitReason:
        row.notes
          ?.filter((n) => n.note_status === "waiting")
          .map((n) => (n.note_status === "waiting" ? n.notes : "")) || "",
    };

    setEditData(mappedData);
    reset(mappedData);
    setSelectedCompany(row.company_id || null);
    setIsModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const fetchContractCandidates = async () => {
    try {
      const response = await axiosInstance.get(`/api/employee/contract-emp`, {
        // params: { company_id: String(companyId) },
        params: {
  company_id: companyId.join(","),
}
      });
      console.log("CONTRACT CANDIDATES Response .... : ",response);

const employees = response?.data?.data?.employees || [];
    const pssemployees = response?.data?.data?.pssemployees || [];
    const companies = response?.data?.data?.companies || [];

    // Map companies
    const mappedCompanies = companies.map((company) => ({
      label: company.company_name,
      value: company.id,
    }));
      // const data = response?.data?.data;
      setColumnData(employees || []);
      setEmployeesList(pssemployees || []);
      setCompanyOptions(mappedCompanies || []);



    } catch (error) {
      console.error("Error fetching contract candidates:", error);
    }
  };

  useEffect(() => {
    fetchContractCandidates();
    fetchCompanyList();
  }, []);

  const columns = [
    {
      header: "S.No",
      body: (_, options) => options.rowIndex + 1,
      style: { textAlign: "center", width: "80px" },
    },
    {
      header: "Name",
      field: "name",
      body: (row) => row.name || "-",
    },
    {
      header: "Phone",
      field: "phone_number",
      body: (row) => row.phone_number || "-",
    },
    {
      header: "Interview Status",
      field: "interview_Status",
      body: (row) => {
        const data = row.interview_status;

        console.log("row.interview_status", data);

        let color =
          data === "selected"
            ? "text-[#16A34A]  bg-green-100"
            : data === "rejected"
            ? "text-[#DC2626] bg-[#FFF0F0]"
            : data === "hold"
            ? "text-[#FD8700] bg-[#FFCB90]"
            : "text-blue-600 bg-blue-100";

        return (
          <div
            className={`border rounded-[50px] ${color}`}
            style={{
              display: "inline-block",
              width: "100px",
              textAlign: "center",
              fontSize: "12px",
              fontWeight: 400,

              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {data || "-"}
          </div>
        );
      },
      style: { textAlign: "center" },
    },
    {
      header: "Candidate Status",
      field: "joining_status",
      body: (row) => {
        const data = row.joining_status;
        if (!data) return "-";

        const color =
          data === "Joined"
            ? "text-[#16A34A]  bg-green-100"
            : "text-[#DC2626] bg-[#FFF0F0]";

        return (
          <div
            className={`border rounded-[50px] ${color}`}
            style={{
              display: "inline-block",
              width: "100px",
              textAlign: "center",
              fontSize: "12px",
              fontWeight: 400,
            }}
          >
            {data}
          </div>
        );
      },
      style: { textAlign: "center" },
    },
    {
      header: "Reference",
      field: "reference",
      body: (row) => row.reference || "-",
    },
    {
      header: "Action",
      body: (row) => (
        <div className="flex gap-4 justify-center items-center">
          <button
            onClick={() => handleView(row)}
            className="p-2 bg-blue-50 text-[#005AEF] rounded-[10px]  hover:bg-[#DFEBFF]"
          >
            <FaEye />
          </button>

          <button
            className="p-2 bg-blue-50 text-[#005AEF] rounded-[10px]  hover:bg-[#DFEBFF]"
            onClick={() => openEditModal(row)}
          >
            <TfiPencilAlt />
          </button>
        </div>
      ),
      style: { textAlign: "center", width: "120px" },
    },
  ];

  // create
  const onSubmit = async (data) => {
    try {
      const createCandidate = {
        name: data.name,
        address: data.address || "test",
        phone_number: data.phone,
        aadhar_number: data.aadhar,
        company_id: Number(data.company),
        interview_date: formatDateToYMD(data.interviewDate),
        interview_status: data.interviewStatus,
        reference: data.reference,
        joining_status: data.candidateStatus,
        education: data.education,
        joined_date:
          data.candidateStatus === "joined"
            ? formatDateToYMD(data.joinedDate)
            : null,
        joining_date:
          data.interviewStatus === "selected"
            ? formatDateToYMD(data.selectedJoiningDate)
            : null,
        other_reference:
          data.reference === "other" ? data.otherReference : null,
        notes_details: (() => {
          const notes = [];

          if (data.candidateStatus === "not_joined") {
            notes.push({
              notes: data.notJoinedReason,
              note_status: "not_joined",
            });
          }
          console.log("HBHBjhu", data);

          switch (data.interviewStatus) {
            case "waiting":
              notes.push({
                notes: data.waitReason || "-",
                note_status: "wait",
              });
              break;
            case "hold":
              notes.push({
                notes: data.holdReason,
                note_status: "hold",
              });
              break;
            case "rejected":
              notes.push({
                notes: data.rejectReason,
                note_status: "reject",
              });
              break;
            default:
              break;
          }

          return notes;
        })(),
        status: 1,
        created_by: userId,
        role_id: roleId,
      };
      setLoading(true);
      if (editData) {
        const response = await axiosInstance.post(
          `/api/contract-emp/update/${editData.id}`,
          createCandidate
        );
        closeAddModal();
        if (response.data.success) {
          toast.success("Candidate Updated successfully", {
            onClose: () => {
              fetchContractCandidates();
            },
          });
        }
      } else {
        const response = await axiosInstance.post(
          "/api/contract-emp/create",
          createCandidate
        );

        if (response.data.success) {
          closeAddModal();
          toast.success("Candidate added successfully", {
            onClose: () => {
              fetchContractCandidates();
            },
          });
        }
      }
    } catch (error) {
      if (error.response) {
        console.log("Backend error:", error.response.data);
        setBackendValidationError(error.response.data.message);
      } else if (error.request) {
        console.log("No response received:", error.request);
      } else {
        console.log("Axios config error:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const companyDropdown = companyOptions.map((c) => ({
    label: c.label,
    value: c.value,
  }));
  console.log("COMPANY DROPDOWN : ",companyDropdown)
  
  

  return (
    <div className="bg-gray-100 flex flex-col justify-between w-screen min-h-screen px-5 pt-2 md:pt-10">
     
    
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            <ToastContainer position="top-right" autoClose={3000} />
<Mobile_Sidebar/>
           
            {/* Breadcrumbs */}
            <div className="flex gap-2 items-center cursor-pointer">
              <p
                className="text-xs md:text-sm text-gray-500  cursor-pointer"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </p>
              <p>{">"}</p>
              <p className="text-xs  md:text-sm  text-[#1ea600]">
                Contract Candidates
              </p>
            </div>

            {/* Filter Section */}
            <div className="flex flex-col w-full mt-1 md:mt-5 h-auto rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] px-2 py-2 md:px-6 md:py-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end w-full">
                  {/* Start Date */}
                  {/* <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#6B7280]">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={filterStartDate || ""}
                      onChange={(e) => setFilterStartDate(e.target.value)}
                      className="px-2 py-2 rounded-md border border-[#D9D9D9] text-sm text-[#7C7C7C] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                  </div> */}

                  {/* End Date */}
                  {/* <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#6B7280]">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={filterEndDate || ""}
                      onChange={(e) => setFilterEndDate(e.target.value)}
                      className="px-2 py-2 rounded-md border border-[#D9D9D9] text-sm text-[#7C7C7C] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                  </div> */}

                  {/* Reference */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#6B7280]">
                      Reference
                    </label>

                    <select
                      value={selectedReference}
                      onChange={(e) => setSelectedReference(e.target.value)}
                      className="px-2 py-2 rounded-md border border-[#D9D9D9] text-sm text-[#7C7C7C]
               focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    >
                      <option value="">All References</option>

                      {[...new Set(columnData.map((item) => item.reference))]
                        .filter(Boolean)
                        .map((ref, index) => (
                          <option key={index} value={ref}>
                            {ref}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Interview Status */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#6B7280]">
                      Interview Status
                    </label>
                    <Dropdown
                      value={filterInterviewStatus}
                      options={interviewStatusOptions}
                      onChange={(e) => setFilterInterviewStatus(e.value)}
                      placeholder="Select Status "
                      className="w-full border border-gray-300 text-sm  text-[#7C7C7C] rounded-md"
                    />
                  </div>

                  {/* Candidate Status */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#6B7280]">
                      Candidate Status
                    </label>
                    <Dropdown
                      value={filterCandidateStatus}
                      options={candidateStatusOptions}
                      onChange={(e) => setFilterCandidateStatus(e.value)}
                      placeholder="Select Status "
                      className="w-full border border-gray-300 text-sm text-[#7C7C7C] rounded-md placeholder:text-gray-400"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="col-span-1 md:col-span-2 lg:col-span-5 flex justify-end gap-4">
                    <button
                      onClick={handleApplyFilter}
                      className="h-10 rounded-lg px-2 md:px-2 py-2  bg-[#1ea600] text-white font-medium w-20 hover:bg-[#33cd10] transition "
                    >
                      Apply
                    </button>
                    <button
                      onClick={handleResetFilter}
                      className="h-10 rounded-lg bg-gray-100 px-2 md:px-2 py-2  text-[#7C7C7C] font-medium w-20 hover:bg-gray-200 transition "
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Table Section */}
            <div className="flex flex-col w-full mt-1 md:mt-5 h-auto rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] px-2 py-2 md:px-6 md:py-6">
              <div className="datatable-container mt-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                  {/* Entries per page */}
                  <div className="flex items-center gap-2">
                    {/* <span className="font-semibold text-base text-[#6B7280]">
                  Show
                </span> */}
                    <Dropdown
                      value={rows}
                      options={[10, 25, 50, 100].map((v) => ({
                        label: v,
                        value: v,
                      }))}
                      onChange={(e) => setRows(e.value)}
                      className="w-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                    />
                    <span className=" text-sm text-[#6B7280]">
                      Entries per page
                    </span>
                  </div>

                  <div className="flex items-center gap-11">
                    {/* Search box */}
                    <div className="relative w-64">
                      <FiSearch
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <InputText
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search......"
                        className="w-full pl-10 pr-3 py-2 rounded-md text-sm border border-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                      />
                    </div>
                    <button
                      onClick={openAddModal}
                      className="px-2 md:px-3 py-2  text-white bg-[#1ea600] hover:bg-[#4BB452] font-medium  w-fit rounded-lg transition-all duration-200"
                    >
                      + Add Candidate
                    </button>
                  </div>
                </div>

                <div className="table-scroll-container" id="datatable">
                  <DataTable
                    className="mt-8"
                    value={columnData}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    globalFilter={globalFilter}
                    showGridlines
                    resizableColumns
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                    paginatorClassName="custom-paginator"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    loading={loading}
                  >
                    {columns.map((col, index) => (
                      <Column
                        key={index}
                        field={col.field}
                        header={col.header}
                        body={col.body}
                        style={col.style}
                      />
                    ))}
                  </DataTable>
                </div>
              </div>
            </div>

            {/* Add Modal */}
            {ModalOpen && (
              <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
                {/* Overlay */}
                <div
                  className="absolute inset-0 "
                  onClick={closeAddModal}
                ></div>

                <div
                  className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[45vw] bg-white shadow-lg  transform transition-transform duration-500 ease-in-out
                     ${isAnimating ? "translate-x-0" : "translate-x-full"}`}
                >
                  <div
                    className="w-6 h-6 rounded-full  mt-2 ms-2  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                    title="Toggle Sidebar"
                    onClick={closeAddModal}
                  >
                    <IoIosArrowForward className="w-3 h-3" />
                  </div>

                  <div className="p-2 md:p-5">
                    <p className="text-xl md:text-2xl font-medium">
                      {" "}
                      {!editData ? "ADD" : "Edit"} Candidates
                    </p>
                    {backendValidationError && (
                      <span className=" text-red-600 text-sm">
                        {backendValidationError}
                      </span>
                    )}

                                        {/* Company */}
                    <div className="mt-5 flex justify-between items-center">
                      <label className="block text-md font-medium">
                        Company Name <span className="text-red-500">*</span>
                      </label>

                      <div className="w-[50%] md:w-[60%]">
                        <Dropdown
                          value={selectedCompany}
                          options={companyDropdown}
                          optionLabel="label"
                          onChange={(e) => {
                            setSelectedCompany(e.value); // UI object
                           setValue(
      "company",
      e.value ? String(e.value.value) : "",
      { shouldValidate: true }
    );
                          }}
                          placeholder="Select Company"
                          className="w-full border border-gray-300 rounded-lg"
                        />

                        

                        {errors.company && (
                          <p className="text-red-500 text-sm">
                            {errors.company.message}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* NAME */}
                    <div className="mt-5 flex justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Name <span className="text-red-600">*</span>
                      </label>
                      <div className="w-[50%] md:w-[60%] rounded-lg">
                        <input
                          type="text"
                          name="name"
                          className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                          placeholder="Enter Name"
                          {...register("name")}
                        />
                        <span className="text-red-500 text-sm">
                          {errors.name?.message}
                        </span>
                      </div>
                    </div>

                    {/* PHONE */}
                    <div className="mt-5 flex justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[50%] md:w-[60%] rounded-lg">
                        <input
                          type="tel"
                          name="phone"
                          {...register("phone")}
                          inputMode="numeric"
                          maxLength={10}
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(/\D/g, "");
                          }}
                          className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                          placeholder="Enter Phone Number"
                        />
                        <span className="text-red-500 text-sm">
                          {errors.phone?.message}
                        </span>
                      </div>
                    </div>

                    {/* Aadhaar */}
                    <div className="mt-5 flex justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Aadhaar Number <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[50%] md:w-[60%] rounded-lg">
                        <input
                          type="number"
                          name="aadhar"
                          className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                          {...register("aadhar")}
                          inputMode="numeric"
                          maxLength={12}
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(/\D/g, "");
                          }}
                          placeholder="Enter AadharNumber"
                        />
                        <span className="text-red-500 text-sm">
                          {errors.aadhar?.message}
                        </span>
                      </div>
                    </div>


                      <div className="mt-5 flex justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Education <span className="text-red-600">*</span>
                      </label>
                      <div className="w-[50%] md:w-[60%] rounded-lg">
                        <input
                          type="text"
                          name="education"
                          className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                          placeholder="Enter Education"
                          {...register("education")}
                        />
                        <span className="text-red-500 text-sm">
                          {errors.education?.message}
                        </span>
                      </div>
                    </div>



                    {/* interview date */}
                    <div className="mt-5 flex justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Interview Date <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[50%] md:w-[60%] rounded-lg">
                        <input
                          type="date"
                          name="interviewDate"
                          className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                          {...register("interviewDate")}
                          placeholder="Enter interview Date"
                        />
                        <span className="text-red-500 text-sm">
                          {errors.interviewDate?.message}
                        </span>
                        {/* {errors?.interviewDate && <p className="text-red-500 text-sm mt-1">{errors?.interviewDate}</p>} */}
                      </div>
                    </div>

                    {/* Interview Status */}
                    <div className="mt-5 flex justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Interview Status <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[50%] md:w-[60%] rounded-lg">
                        <select
                          {...register("interviewStatus")}
                          className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                          name="interviewStatus"
                        >
                          <option value="">Select Status</option>
                          <option value="selected">Selected</option>
                          <option value="rejected">Rejected</option>
                          <option value="hold">Hold</option>
                          <option value="waiting">Waiting</option>
                        </select>
                        <span className="text-red-500 text-sm">
                          {errors.interviewStatus?.message}
                        </span>
                        {/* {errors.interviewStatus && <p className="text-red-500 text-sm mt-1">{errors.interviewStatus}</p>} */}
                      </div>
                    </div>

                    {/* Conditional fields */}

                    {interviewStatus === "rejected" && (
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium mb-2">
                          Reason for Rejection
                          <span className="text-red-500">*</span>
                        </label>

                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          <textarea
                            className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            name="rejectReason"
                            {...register("rejectReason")}
                          ></textarea>
                          <span className="text-red-500 text-sm">
                            {errors.rejectReason?.message}
                          </span>
                          {/* {errors.rejectReason && <p className="text-red-500 text-sm mt-1">{errors.rejectReason}</p>} */}
                        </div>
                      </div>
                    )}

                    {interviewStatus === "hold" && (
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium mb-2">
                          Reason for Hold
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          <textarea
                            className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            name="holdReason"
                            {...register("holdReason")}
                          ></textarea>
                          <span className="text-red-500 text-sm">
                            {errors.holdReason?.message}
                          </span>
                        </div>
                      </div>
                    )}

                    {interviewStatus === "waiting" && (
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium mb-2">
                          Reason for Waiting
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          <textarea
                            className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                            name="waitReason"
                            {...register("waitReason")}
                          />
                          <span className="text-red-500 text-sm">
                            {errors.waitReason?.message}
                          </span>
                          {/* {errors.waitReason && <p className="text-red-500 text-sm mt-1">{errors.waitReason}</p>} */}
                        </div>
                      </div>
                    )}

                    {interviewStatus === "selected" && (
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium mb-2">
                          Joining Date
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          <input
                            type="date"
                            {...register("selectedJoiningDate")}
                            className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                          />
                          <span className="text-red-500 text-sm">
                            {errors.selectedJoiningDate?.message}
                          </span>
                          {/* {errors.selectedJoiningDate && <p className="text-red-500 text-sm mt-1">{errors.selectedJoiningDate}</p>} */}
                        </div>
                      </div>
                    )}

                    {/* candidate Status */}
                    <div className="mt-5 flex justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Candidate Status
                        {/* <span className="text-red-500">*</span> */}
                      </label>
                      <div className="w-[50%] md:w-[60%] rounded-lg">
                        <select
                          {...register("candidateStatus")}
                          className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                        >
                          <option value="">Select Status</option>
                          <option value="joined">Joined</option>
                          <option value="not_joined">Not Joined</option>
                        </select>

                        {errors.candidateStatus && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.candidateStatus.message}
                          </p>
                        )}

                        {/* {errors.candidateStatus && <p className="text-red-500 text-sm mt-1">{errors.candidateStatus}</p>} */}
                      </div>
                    </div>

                    {/* Conditional fields based on Candidate Status */}
                    {candidateStatus === "joined" && (
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium mb-2 mt-3">
                          Joined Date
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          {/* <input type="date"
                        name="joinedDate"
                        className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"

                      /> */}
                          <input
                            type="date"
                            {...register("joinedDate")}
                            className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                          />
                          <span className="text-red-500 text-sm">
                            {errors.joinedDate?.message}
                          </span>
                          {/* {errors.joinedDate && <p className="text-red-500 text-sm mt-1">{errors.joinedDate}</p>} */}
                        </div>
                      </div>
                    )}

                    {candidateStatus === "not_joined" && (
                      <div className="mt-5 flex justify-between items-center">
                        <label className="block text-md font-medium mb-2 mt-3">
                          Reason for Not Joining
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          {/* <textarea

                        className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"

                        name="notJoinedReason"
                      ></textarea> */}
                          <textarea
                            {...register("notJoinedReason")}
                            className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                          />
                          <span className="text-red-500 text-sm">
                            {errors.notJoinedReason?.message}
                          </span>
                          {/* {errors.notJoinedReason && <p className="text-red-500 text-sm mt-1">{errors.notJoinedReason}</p>} */}
                        </div>
                      </div>
                    )}

                    {/* Reference */}
                    <div className="mt-5 flex justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Reference 
                      </label>
                      <div className="w-[50%] md:w-[60%] rounded-lg">
                        <select
                          {...register("reference")}
                          className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                        >
                          <option value="">Select Reference</option>
                          {employeesList.map((emp) => (
                            <option key={emp.id} value={emp.full_name}>
                              {emp.full_name}
                            </option>
                          ))}
                          <option value="other">Other</option>
                        </select>
                        <span className="text-red-500 text-sm">
                          {errors.reference?.message}
                        </span>
                        {/* {errors.reference && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.reference.message}
                      </p>
                    )} */}
                      </div>
                    </div>

                    {reference === "other" && (
                      <div className="mt-5 flex justify-end items-center">
                        <div className="w-[50%] md:w-[60%] rounded-lg">
                          <input
                            type="text"
                            {...register("otherReference")}
                            placeholder="Specify reference"
                            className="w-full px-2 py-2 border border-gray-300 placeholder:text-[#4A4A4A] placeholder:text-sm placeholder:font-normal rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1ea600]"
                          />
                          {errors.otherReference && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.otherReference.message}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Button */}
                    <div className="flex  justify-end gap-2 mt-6 md:mt-14">
                      <button
                        onClick={closeAddModal}
                        className=" hover:bg-[#FEE2E2] hover:border-[#FEE2E2] text-sm md:text-base border border-[#7C7C7C]  text-[#7C7C7C] hover:text-[#DC2626] px-5 md:px-5 py-1 md:py-2 font-semibold rounded-[10px] transition-all duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="bg-[#005AEF] hover:bg-[#2879FF] text-white px-4 md:px-5 py-2 font-semibold rounded-[10px] disabled:opacity-50 transition-all duration-200"
                        onClick={handleSubmit(onSubmit, (errors) =>
                          console.log(errors)
                        )}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isViewModalOpen && viewRow && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-6 relative animate-fadeIn">
                  {/* Close Button */}
                  <button
                    onClick={closeViewModal}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                  >
                    <IoIosCloseCircle size={28} />
                  </button>

                  {/* Title */}
                  <h2 className="text-xl font-semibold mb-4 text-[#1ea600] hover:text-[#4BB452]">
                    Contract Candidate Details
                  </h2>

                  {/* Candidate Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p>
                      <b>Name:</b> {viewRow.name}
                    </p>
                    <p>
                      <b>Phone:</b> {viewRow.phone_number}
                    </p>

                    <p>
                      <b>Aadhar:</b> {viewRow.aadhar_number}
                    </p>
                    <p>
                      <b>Company:</b> {viewRow.company || "-"}
                    </p>

                    <p>
                      <b>Interview Date:</b> {viewRow.interview_date || "-"}
                    </p>
                    <p>
                      <b>Interview Status:</b>{" "}
                      <span className="font-medium">
                        {viewRow.interview_status || "-"}
                      </span>
                    </p>

                    <p>
                      <b>Candidate Status:</b> {viewRow.joining_status || "-"}
                    </p>
                    <p>
                      <b>Joining Date:</b> {viewRow.joining_date || "-"}
                    </p>

                    <p>
                      <b>Reference:</b> {viewRow.reference || "-"}
                    </p>
                    <p>
                      <b>Other Reference:</b> {viewRow.other_reference || "-"}
                    </p>

                    <p className="col-span-2">
                      <b>Notes:</b>{" "}
                      {viewRow.notes_details?.[0]?.notes ||
                        "No notes available"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      <Footer />
      
    </div>
  );
};

export default ContractCandidates_Mainbar;
