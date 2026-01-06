import { useState } from 'react';
import { LogOut, ShieldAlert, AlertTriangle, Loader2, Monitor,AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useAuth } from '@/auth/useAuth';
import { logout } from '@/utils/logout';
import { terminateAllOtherSessionsApi } from '@/api/authApi';

export default function LogoutSessionsComponent() {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showTerminateDialog, setShowTerminateDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isTerminating, setIsTerminating] = useState(false);

const {activeSessionCount,currentSession,resetAuth} = useAuth()
   
   
  const otherSessionsCount = activeSessionCount - 1;  

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
     await logout(resetAuth)
     setIsLoggingOut(false)
  };

  const handleTerminateOtherSessions = async () => {
    setIsTerminating(true);
    
    await terminateAllOtherSessionsApi();

    setIsTerminating(false)
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Logout Card */}
        <div className="bg-card/40 backdrop-blur-sm border rounded-xl p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <LogOut className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                Logout
              </h3>
              <p className="text-sm text-gray-200 mb-4">
                Sign out from this device only. You'll remain logged in on other devices.
              </p>
              <Button
                onClick={() => setShowLogoutDialog(true)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout This Device
              </Button>
            </div>
          </div>
        </div>

        {/* Terminate Other Sessions Card */}
        
        {activeSessionCount > 1 ? (
          <div className="z-10 bg-transparent border border-red-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <ShieldAlert className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                Terminate Other Sessions
              </h3>
              <p className="text-sm text-gray-200 mb-4">
                Sign out from all other devices. You'll stay logged in on this device.
              </p>
              <Button
                onClick={() => setShowTerminateDialog(true)}
                variant="outline"
                 
                className="w-full border-red-300 text-red-600 hover:bg-red-800"
              >
                <ShieldAlert className="w-4 h-4 mr-2" />
                Terminate Other Sessions
              </Button>
            </div>
          </div>
        </div>
        ):(
          <Alert className='bg-card/40 backdrop-blur-sm items-center flex justify-center'>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription >No other active sessions found.</AlertDescription>
      </Alert>
        )}

      </div>

      {/* Info Card */}
      <div className="bg-card/40 backdrop-blur-2xl border  rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Monitor className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-900 font-medium mb-1">
              Active Sessions: {activeSessionCount}
            </p>
            <p className="text-xs text-blue-700">
              You are currently logged in on {activeSessionCount} device(s). If you notice any suspicious activity, terminate other sessions immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Logout Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogOut className="w-5 h-5 text-blue-600" />
              Logout from This Device
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to logout from this device?
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Alert className="border-blue-200 bg-blue-50">
              <Monitor className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                You will remain logged in on your other {otherSessionsCount} device(s). To logout from all other devices, use "Terminate Other Sessions" instead.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter className="gap-4 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
              disabled={isLoggingOut}
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Terminate Other Sessions Dialog */}
      <Dialog open={showTerminateDialog} onOpenChange={setShowTerminateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Terminate Other Sessions
            </DialogTitle>
            <DialogDescription>
              This will sign you out from all other devices. You'll stay logged in on this device.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <p className="font-semibold mb-1">This action will:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Sign you out from {otherSessionsCount} other device(s)</li>
                  <li>Keep you logged in on this device</li>
                  <li>Invalidate all other active sessions</li>
                  <li>Require re-login on those devices</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              

              <div className="mt-3 pt-3 border-t border-gray-300">
                <div className="flex items-center gap-2 text-green-700">
                  <Monitor className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Will remain active:</span>
                </div>
                <div className="text-sm text-green-700 ml-6 mt-1">
                  <p>✓ Current device ({currentSession?.browser } on {currentSession?.os})</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-4 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setShowTerminateDialog(false)}
              disabled={isTerminating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleTerminateOtherSessions}
              disabled={isTerminating}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isTerminating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Terminating...
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 mr-2" />
                  Terminate Other Sessions
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}