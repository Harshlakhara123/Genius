import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { getApiLimitCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const [apiLimitCount, isPro] = await Promise.all([
    getApiLimitCount(),
    checkSubscription(),
  ]);

  return (
    <div className="h-full relative bg-[#000000] text-zinc-50 selection:bg-zinc-800">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 bg-zinc-950 border-r border-zinc-900 z-20">
        <Sidebar isPro={isPro} apiLimitCount={apiLimitCount} />
      </div>
      <main className="md:pl-72 bg-[#000000] min-h-screen">
        <Navbar apiLimitCount={apiLimitCount} isPro={isPro} />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
