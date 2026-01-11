import  {  useState } from 'react';
import {   Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarContent } from '@/components/dashboard/SidebarContent';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import AllSessions from '@/components/dashboard/AllSessions';
import Profile from '@/components/dashboard/Profile';
import SecurityOverview from '@/components/dashboard/Overview';
import TwoFactorSetup from '@/components/dashboard/TwoFactorSetup';
import LogoutSessionsComponent from '@/components/dashboard/LogoutSessionsComponent';
import {ChangePasswordComponent} from '@/components/dashboard/ChangePasswordComponents';
import { useAuth } from '@/auth/useAuth';
import { getLocalUser } from '@/utils/getLocalUser';
 import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [activeItem, setActiveItem] = useState<string>('Overview');
  const user = useAuth() || getLocalUser();
  const navigate = useNavigate();
  if(!user){
     navigate('/login')
  }

  return (
    <div className="min-h-screen ">
       {/* Background Effects */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 h-48 sm:w-72 md:w-96 sm:h-72 md:h-96 bg-blue-600 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob"></div>
    <div className="absolute top-20 sm:top-40 right-5 sm:right-20 w-48 h-48 sm:w-72 md:w-96 sm:h-72 md:h-96 bg-purple-600 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
    <div className="absolute bottom-10 sm:bottom-20 left-1/4 sm:left-1/3 w-48 h-48 sm:w-72 md:w-96 sm:h-72 md:h-96 bg-pink-600 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
    <div className="absolute top-1/2 right-1/4 w-40 h-40 sm:w-56 md:w-72 sm:h-56 md:h-72 bg-cyan-500 rounded-full mix-blend-lighten filter blur-3xl opacity-15 animate-blob animation-delay-3000"></div>
  </div>

  {/* Grid Pattern Overlay */}
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[2rem_2rem] sm:bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

      {/* Navbar - Always present */}
      <header className="fixed  z-50 w-full ">
        <div className="container flex  items-center px-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden m-5 border">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <SidebarContent activeItem={activeItem} setActiveItem={setActiveItem }/>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="flex relative">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 border-r bg-background/50 backdrop-blur-sm sticky top-16 h-[calc(100vh-4rem)]">
          <SidebarContent activeItem={activeItem} setActiveItem={setActiveItem}/>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:relative mt-10">
          <div className="container max-w-6xl  mx-auto p-2">
      
             {activeItem === "Profile" && (
              <Profile/>
             )}
             {activeItem === "Sessions & Devices" && (
              <AllSessions/>
             )}
             {activeItem === 'Overview' && (
              <SecurityOverview setActiveItem={setActiveItem} />
             )}

             {activeItem === "Two-Factor Authentication" && (
              <TwoFactorSetup/>
             )}

             {activeItem === "Logout" && (
              <LogoutSessionsComponent/>
             )}

             {activeItem === 'Change Password' && (
              <ChangePasswordComponent/>
             )}
          </div>
        </main>

    
         
      </div>
    </div>
  );
};

export default UserDashboard;