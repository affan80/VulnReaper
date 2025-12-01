import Sidebar from "./Sidebar";
import Header from "./Header";
import StatsCards from "./StatsCards";
import VulnerabilitiesTable from "./VulnerabilitiesTable";
import RecentActivity from "./RecentActivity";

export default function Home() {
  return (
    <>
      <Header />

      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

          <StatsCards />

          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <VulnerabilitiesTable />
            <RecentActivity />
          </div>
        </main>
      </div>
    </>
  );
}
