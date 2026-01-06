import { useState } from 'react';
import { Shield, CheckCircle, AlertTriangle, Key, Download, RefreshCw, Power } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { User } from '@/types/types';
import { disable2Fa,generateNewBackupCodeApi } from '@/api/authApi';
import { useAuth } from '@/auth/useAuth';
import { fetchUser } from '@/utils/fetchAndSaveUserInLocal';

export default function Manage2FAEnabled({ UserInfo }: { UserInfo: User }) {

  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [showBackupCodesDialog, setShowBackupCodesDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [isDisabling, setIsDisabling] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  
 
  const [newBackupCodes, setNewBackupCodes] = useState<string[]>([]);

  const {setUser,setActiveSessionCount,setCurrentSession} = useAuth()

  const handleDisable2FA = async () => {
    if (!password) {
      setError('Please enter your password');
      return;
    }
    
    setIsDisabling(true);
    setError('');
    try {
       const res = await disable2Fa(password)

       if(!res.success){
        setError(res.msg)
       }
       if(res.success){
         setIsDisabling(false);
      setShowDisableDialog(false);
      setPassword('');
     await fetchUser(setUser,setCurrentSession,setActiveSessionCount)
       }
    } catch (error) {
        console.error(error)
    }finally{
        setIsDisabling(false);
    }
   
  };

  const handleGenerateBackupCodes = async () => {
    setIsGenerating(true);
    setError('');

    try {
      const res = await generateNewBackupCodeApi(password);
      console.log(res);
      
      if(!res.success || !res.data){
        setError(res.msg)
        return;
      }
       setNewBackupCodes(res?.data)
       setPassword('')
    } catch (error) {
        console.error(error)
    }finally{
         setIsGenerating(false);
    }
    
  };

  const handleDownloadBackupCodes = () => {
    const codesText = newBackupCodes.join('\n');
    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '2fa-backup-codes-new.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (UserInfo?.isTwoFactorEnabled) {
    return (
      <div className="space-y-4">
        {/* Status Card */}
        <div className="bg-transparent border border-green-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-green-900">
                  Two-Factor Authentication Enabled
                </h3>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm text-green-700 mb-4">
                Your account is protected with two-factor authentication. You'll need both your password and a verification code to sign in.
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => setShowBackupCodesDialog(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate New Backup Codes
                </Button>
                
                <Button
                  onClick={() => setShowDisableDialog(true)}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-900"
                >
                  <Power className="w-4 h-4 mr-2" />
                  Disable Two-Factor Authentication
                </Button>
              </div>
            </div>
          </div>
        </div>

       

        {/* Disable 2FA Dialog */}
        <Dialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Disable Two-Factor Authentication
              </DialogTitle>
              <DialogDescription>
                This will make your account less secure. You'll only need your password to sign in.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Alert className="border-yellow-500 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  Warning: Disabling 2FA will reduce your account security. Make sure you understand the risks.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Enter your password to confirm</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className={error ? 'border-red-500' : ''}
                />
                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDisableDialog(false);
                  setPassword('');
                  setError('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDisable2FA}
                disabled={isDisabling}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDisabling ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⏳</span>
                    Disabling...
                  </>
                ) : (
                  'Disable 2FA'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Generate Backup Codes Dialog */}
        <Dialog open={showBackupCodesDialog} onOpenChange={setShowBackupCodesDialog}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-600" />
                Generate New Backup Codes
              </DialogTitle>
              <DialogDescription>
                Create new backup codes to replace your existing ones.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {newBackupCodes.length === 0 ? (
                <div className="space-y-4">
                  <Alert className="border-yellow-500 bg-yellow-50">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      Generating new codes will invalidate your old backup codes. Make sure to save the new ones.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                <Label htmlFor="confirm-password">Enter your password to confirm</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className={error ? 'border-red-500' : ''}
                />
                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}
              </div>

                  <Button
                    onClick={handleGenerateBackupCodes}
                    disabled={isGenerating}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isGenerating ? (
                      <>
                        <span className="inline-block animate-spin mr-2">⏳</span>
                        Generating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Generate New Backup Codes
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert className="border-green-500 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      New backup codes generated successfully! Save these codes in a secure location.
                    </AlertDescription>
                  </Alert>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 gap-2">
                      {newBackupCodes.map((code, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-center p-3 bg-white rounded-lg border border-gray-200"
                        >
                          <code className="text-gray-900 font-mono font-semibold">
                            {code}
                          </code>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleDownloadBackupCodes}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Backup Codes
                  </Button>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowBackupCodesDialog(false);
                  setNewBackupCodes([]);
                }}
              >
                {newBackupCodes.length > 0 ? 'Done' : 'Cancel'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return null;
}