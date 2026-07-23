import DashboardHeader from "@/components/dashboard/DashboardHeader";
import RecentActivityTable from "@/components/dashboard/RecentActivityTable";
import StatsCards from "@/components/dashboard/StatsCard";

export default function Dashboard() {
    return (
      <div className="w-full flex justify-center items-center py-20 max-md:px-10 max-lg:py-10">
        <div className="flex flex-col items-center">
          <DashboardHeader />
  
          <div className="relative z-20 -mt-20 w-[90%] bg-white rounded-xl shadow-sm p-6 
                          max-lg:-mt-10 max-md:w-[95%] max-sm:p-4">
            <StatsCards />
            <RecentActivityTable />
          </div>
        </div>
      </div>
    );
  }
  