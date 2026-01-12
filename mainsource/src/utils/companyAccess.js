
export const checkCompanyAccess = () => {
  const companyId = localStorage.getItem("company_Id");
  console.log("COMPANYID..... : ",companyId);
  return companyId && companyId !== "null" && companyId !== "undefined";
};
