import Finance_Details from "../components/Finance Components/Finance_Details";
import Sidebar from "../components/Sidebar";


const Finance = () => {
  return (
    <div className="flex">
      
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>

      <Finance_Details />
    </div>
  );
};

export default Finance;
