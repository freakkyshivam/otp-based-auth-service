import { useState } from 'react';
import { Lock, Eye, EyeOff, Key, AlertCircle, CheckCircle2, Shield, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { updatePasswordApi } from '@/api/userApi';

// Change Password Component
export function ChangePasswordComponent() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: '',
    color: '',
  });

  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const colors = ['', 'text-red-600 bg-red-100', 'text-orange-600 bg-orange-100', 'text-yellow-600 bg-yellow-100', 'text-green-600 bg-green-100', 'text-emerald-600 bg-emerald-100'];

    setPasswordStrength({
      score,
      label: labels[score],
      color: colors[score],
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
    setSuccess('');

    if (field === 'newPassword') {
      calculatePasswordStrength(value);
    }
  };

  const handleChangePassword = async () => {
    setError('');
    setSuccess('');

    // Validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('New password must be different from current password');
      return;
    }

    setIsChanging(true);

    const res = await updatePasswordApi(formData.currentPassword, formData.newPassword);

    if(!res.success){
        setError(res.msg)
        setIsChanging(false)
        return;
    }
    setSuccess(res.msg);
      setIsChanging(false);
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordStrength({ score: 0, label: '', color: '' });
    
  };

  return (
    <Card className="bg-transparent border-gray-700">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Lock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-white">Change Password</CardTitle>
            <CardDescription>Update your password to keep your account secure</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Password */}
        <div className="space-y-2">
          <Label htmlFor="current-password" className="text-white">Current Password</Label>
          <div className="relative">
            <Input
              id="current-password"
              type={showCurrentPassword ? "text" : "password"}
              placeholder="Enter current password"
              value={formData.currentPassword}
              onChange={(e) => handleInputChange('currentPassword', e.target.value)}
              className="pr-10 bg-gray-800/60 border-gray-700 text-white"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <Label htmlFor="new-password" className="text-white">New Password</Label>
          <div className="relative">
            <Input
              id="new-password"
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              className="pr-10 bg-gray-800/60 border-gray-700 text-white"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {formData.newPassword && (
            <div className="space-y-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      level <= passwordStrength.score
                        ? passwordStrength.score === 1
                          ? 'bg-red-500'
                          : passwordStrength.score === 2
                          ? 'bg-orange-500'
                          : passwordStrength.score === 3
                          ? 'bg-yellow-500'
                          : passwordStrength.score === 4
                          ? 'bg-green-500'
                          : 'bg-emerald-500'
                        : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>
              {passwordStrength.label && (
                <span className={`text-xs font-medium px-2 py-1 rounded ${passwordStrength.color}`}>
                  {passwordStrength.label}
                </span>
              )}
            </div>
          )}

          <p className="text-xs text-gray-400">
            Must be at least 8 characters with uppercase, lowercase, numbers, and symbols
          </p>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirm-password" className="text-white">Confirm New Password</Label>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="pr-10 bg-gray-800/60 border-gray-700 text-white"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <Alert variant="destructive" className="border-red-500 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-500 text-green-600 bg-green-50">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleChangePassword}
          disabled={isChanging}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isChanging ? (
            <>
              <span className="inline-block animate-spin mr-2">⏳</span>
              Changing Password...
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

// Reset Password Component (Forgot Password Flow)
export function ResetPasswordComponent() {
  const [step, setStep] = useState<'email' | 'otp' | 'newPassword'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [newPasswordData, setNewPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const handleSendOTP = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsProcessing(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      console.log('Sending OTP to:', email);
      setSuccess('OTP sent to your email!');
      setIsProcessing(false);
      setStep('otp');
    }, 1500);
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsProcessing(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      console.log('Verifying OTP:', otp);
      setSuccess('OTP verified!');
      setIsProcessing(false);
      setStep('newPassword');
    }, 1500);
  };

  const handleResetPassword = async () => {
    if (!newPasswordData.newPassword || !newPasswordData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPasswordData.newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (newPasswordData.newPassword !== newPasswordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsProcessing(true);
    setError('');

 

    // if(!res.success){
    //     setError(res.msg)
    // }
    // setSuccess(res.msg);
    //   setIsProcessing(false);

    
  };

  return (
    <Card className="bg-transparent border-gray-700">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <RefreshCw className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-white">Reset Password</CardTitle>
            <CardDescription>
              {step === 'email' && 'Enter your email to receive a reset code'}
              {step === 'otp' && 'Enter the OTP sent to your email'}
              {step === 'newPassword' && 'Create your new password'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Step 1: Email */}
        {step === 'email' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="reset-email" className="text-white">Email Address</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="bg-gray-800/60 border-gray-700 text-white"
              />
            </div>

            {error && (
              <Alert variant="destructive" className="border-red-500 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleSendOTP}
              disabled={isProcessing}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isProcessing ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  Sending OTP...
                </>
              ) : (
                <>
                  <Key className="w-4 h-4 mr-2" />
                  Send Reset Code
                </>
              )}
            </Button>
          </>
        )}

        {/* Step 2: OTP Verification */}
        {step === 'otp' && (
          <>
            <Alert className="border-blue-200 bg-blue-50">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                We've sent a 6-digit code to <strong>{email}</strong>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="reset-otp" className="text-white">Enter OTP</Label>
              <Input
                id="reset-otp"
                type="text"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, ''));
                  setError('');
                }}
                className="text-center text-2xl font-mono tracking-widest bg-gray-800/60 border-gray-700 text-white"
              />
            </div>

            {error && (
              <Alert variant="destructive" className="border-red-500 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button
                onClick={() => setStep('email')}
                variant="outline"
                className="flex-1 border-gray-600 text-white hover:bg-gray-800"
              >
                Back
              </Button>
              <Button
                onClick={handleVerifyOTP}
                disabled={isProcessing}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {isProcessing ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </div>

            <button
              onClick={handleSendOTP}
              className="text-sm text-blue-400 hover:text-blue-300 w-full text-center"
            >
              Didn't receive code? Resend
            </button>
          </>
        )}

        {/* Step 3: New Password */}
        {step === 'newPassword' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="reset-new-password" className="text-white">New Password</Label>
              <div className="relative">
                <Input
                  id="reset-new-password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPasswordData.newPassword}
                  onChange={(e) => {
                    setNewPasswordData(prev => ({ ...prev, newPassword: e.target.value }));
                    setError('');
                  }}
                  className="pr-10 bg-gray-800/60 border-gray-700 text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reset-confirm-password" className="text-white">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="reset-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={newPasswordData.confirmPassword}
                  onChange={(e) => {
                    setNewPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }));
                    setError('');
                  }}
                  className="pr-10 bg-gray-800/60 border-gray-700 text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="border-red-500 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-500 text-green-600 bg-green-50">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleResetPassword}
              disabled={isProcessing}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isProcessing ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  Resetting Password...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Reset Password
                </>
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}