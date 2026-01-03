import { useState } from 'react';
import { Shield, Smartphone, Copy, CheckCircle, XCircle, AlertTriangle, Key, Download, Check } from 'lucide-react';

export default function TwoFactorSetup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [error, setError] = useState('');

  // Mock data
  const secretKey = 'JBSWY3DPEHPK3PXP';
  const qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=otpauth://totp/YourApp:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=YourApp';
  const backupCodes = ['8A3B-C7D2-E9F1', '4K5L-M6N7-P8Q9', '2R3S-T4U5-V6W7', 'X8Y9-Z1A2-B3C4', 'D5E6-F7G8-H9I0'];

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secretKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerifyCode = () => {
    setIsVerifying(true);
    setError('');
    setTimeout(() => {
      if (verificationCode.length === 6) {
        setCurrentStep(3);
        setSetupComplete(true);
      } else {
        setError('Invalid code. Please enter a 6-digit code.');
      }
      setIsVerifying(false);
    }, 1000);
  };

  const handleDownloadBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '2fa-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen overflow-hidden bg-transparent p-4 ml-16">
      <div className="h-full max-w-7xl mx-auto flex flex-col">
        {/* Header - Compact */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Enable Two-Factor Authentication</h1>
              <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
            </div>
          </div>
        </div>

        {/* Progress Steps - Compact */}
        <div className="mb-4">
          <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    currentStep >= step ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-500 border border-gray-700'
                  }`}
                >
                  {currentStep > step ? <Check className="w-4 h-4" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-0.5 mx-1 transition-all ${currentStep > step ? 'bg-blue-500' : 'bg-gray-800'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between max-w-md mx-auto mt-2 text-xs text-gray-400">
            <span>Install App</span>
            <span className="ml-4">Scan Code</span>
            <span>Verify</span>
          </div>
        </div>

        {/* Main Content - Fits in remaining space */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full bg-card/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 overflow-auto">
            {/* Step 1 */}
            {currentStep === 1 && (
              <div className="h-full flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <Smartphone className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-bold text-white">Step 1: Install Authenticator App</h2>
                </div>

                <div className="flex-1 overflow-auto">
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="p-3 bg-gray-800/60 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-colors">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-2 mx-auto">
                        <Key className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-white text-sm font-medium text-center">Google Authenticator</p>
                      <p className="text-xs text-gray-400 text-center mt-1">iOS & Android</p>
                    </div>

                    <div className="p-3 bg-gray-800/60 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-colors">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-2 mx-auto">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-white text-sm font-medium text-center">Microsoft Authenticator</p>
                      <p className="text-xs text-gray-400 text-center mt-1">iOS & Android</p>
                    </div>

                    <div className="p-3 bg-gray-800/60 rounded-lg border border-gray-700 hover:border-green-500/50 transition-colors">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-2 mx-auto">
                        <Key className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-white text-sm font-medium text-center">Authy</p>
                      <p className="text-xs text-gray-400 text-center mt-1">iOS & Android</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentStep(2)}
                  className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-blue-500/30 w-full"
                >
                  Next: Scan QR Code
                </button>
              </div>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <div className="h-full flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <Key className="w-5 h-5 text-purple-400" />
                  <h2 className="text-lg font-bold text-white">Step 2: Scan QR Code</h2>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-4">
                  {/* Left: QR Code */}
                  <div className="flex flex-col items-center justify-center bg-gray-800/60 rounded-lg border border-gray-700 p-4">
                    <div className="p-3 bg-white rounded-lg mb-3">
                      <img src={qrCodeUrl} alt="QR Code" className="w-40 h-40" />
                    </div>
                    <p className="text-gray-400 text-xs text-center mb-2">Scan with your authenticator app</p>
                    <div className="w-full">
                      <p className="text-white text-xs font-medium text-center mb-2">Or enter manually:</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-1.5 bg-gray-900 text-blue-400 rounded-lg text-xs font-mono border border-gray-700 text-center">
                          {secretKey}
                        </code>
                        <button
                          onClick={handleCopySecret}
                          className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors"
                        >
                          {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right: Verification */}
                  <div className="flex flex-col justify-center bg-gray-800/60 rounded-lg border border-gray-700 p-4">
                    <label className="block text-white font-medium mb-2 text-sm">Enter 6-digit code:</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={verificationCode}
                      onChange={(e) => {
                        setError('');
                        setVerificationCode(e.target.value.replace(/\D/g, ''));
                      }}
                      placeholder="000000"
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white text-center text-xl font-mono tracking-widest focus:outline-none focus:border-blue-500 transition-colors mb-2"
                    />
                    {error && (
                      <div className="flex items-center gap-2 text-red-400 text-xs mb-3">
                        <XCircle className="w-4 h-4" />
                        {error}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors border border-gray-700"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleVerifyCode}
                        disabled={verificationCode.length !== 6 || isVerifying}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-50"
                      >
                        {isVerifying ? 'Verifying...' : 'Verify'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {currentStep === 3 && setupComplete && (
              <div className="h-full flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <h2 className="text-lg font-bold text-white">Step 3: Save Backup Codes</h2>
                </div>

                <div className="flex-1 overflow-auto space-y-3">
                  <div className="bg-green-950/20 border border-green-500/30 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <p className="text-green-400 text-sm font-semibold">2FA Successfully Enabled!</p>
                    </div>
                  </div>

                  <div className="bg-yellow-950/20 border border-yellow-500/30 rounded-lg p-3">
                    <div className="flex items-start gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-yellow-400 text-sm font-semibold">Save Your Backup Codes</p>
                        <p className="text-yellow-300 text-xs">Use these to access your account if you lose your device.</p>
                      </div>
                    </div>

                    <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
                      <div className="grid grid-cols-2 gap-2">
                        {backupCodes.map((code, index) => (
                          <div key={index} className="flex items-center justify-center p-2 bg-gray-800 rounded-lg border border-gray-700">
                            <code className="text-white font-mono text-xs">{code}</code>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleDownloadBackupCodes}
                      className="w-full mt-3 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Download Backup Codes
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => console.log('Setup complete')}
                  className="mt-4 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-green-500/30 w-full"
                >
                  Complete Setup
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}