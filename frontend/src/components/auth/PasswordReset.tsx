import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';
import { Eye, EyeOff, AlertCircle, CheckCircle2, Mail, Key, RefreshCw, ArrowLeft, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetOtpApi, verifyResetOtpApi, resetPasswordApi } from '@/api/authApi';

// Validation Schemas
const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be exactly 6 digits").regex(/^\d+$/, "Must contain only numbers"),
});

const passwordSchema = z.object({
  newPassword: z.string().min(8, 'Minimum 8 characters'),
  confirmPassword: z.string().min(8, 'Minimum 8 characters')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type EmailFormData = z.infer<typeof emailSchema>;
type OtpFormData = z.infer<typeof otpSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function PasswordResetPage() {
  const [step, setStep] = useState<'EMAIL' | 'OTP' | 'PASSWORD'>('EMAIL');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [resendTimer, setResendTimer] = useState<number>(0);
  const [verifiedOtp, setVerifiedOtp] = useState<string>("");

  const navigate = useNavigate();

  const emailForm = useForm<EmailFormData>({ resolver: zodResolver(emailSchema) });
  const otpForm = useForm<OtpFormData>({ resolver: zodResolver(otpSchema) });
  const passwordForm = useForm<PasswordFormData>({ resolver: zodResolver(passwordSchema) });

  // Timer effect for resend OTP
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const onEmailSubmit = async (d: EmailFormData) => {
    setError('');
    setSuccess('');
    try {
      const response = await sendPasswordResetOtpApi(d.email);

      if (response.success) {
        setEmail(d.email);
        setSuccess(response.msg);
        setResendTimer(30); // Start 30 second timer
        setStep('OTP');
      } else {
        setError(response.msg || "Failed to send OTP. Try again.");
      }
    } catch (error) {
      setError("Failed to send OTP. Try again.");
      console.error(error);
    }
  };

  const onOtpSubmit = async (d: OtpFormData) => {
    setError('');
    setSuccess('');
    try {
      const response = await verifyResetOtpApi(email, d.otp);

      if (response.success) {
        setVerifiedOtp(d.otp); // Store the verified OTP
        setSuccess('OTP verified successfully!');
        setStep('PASSWORD');
      } else {
        setError(response.msg || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      setError("Failed to verify OTP. Try again.");
      console.error(error);
    }
  };

  const onPasswordSubmit = async (d: PasswordFormData) => {
    setError('');
    setSuccess('');
    try {
      const response = await resetPasswordApi(email, verifiedOtp, d.newPassword);

      if (response.success) {
        setSuccess('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.msg || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      setError("Failed to reset password. Try again.");
      console.error(error);
    }
  };

  const handleBackToEmail = () => {
    setStep('EMAIL');
    otpForm.reset();
    setError('');
    setSuccess('');
    setVerifiedOtp('');  
  };

  const handleBackToOtp = () => {
    setStep('OTP');
    passwordForm.reset();
    setError('');
    setSuccess('');
     
  };

  const handleResendOTP = async () => {
    setError('');
    setSuccess('');
    try {
      const response = await sendPasswordResetOtpApi(email);

      if (response.success) {
        setSuccess('OTP resent successfully!');
        setResendTimer(30);  
        setVerifiedOtp(''); 
      } else {
        setError(response.msg || "Failed to resend OTP. Try again.");
      }
    } catch (error) {
      setError("Failed to resend OTP. Try again.");
      console.error(error);
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-4" id="reset-password">
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-lighten filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-pink-600 rounded-full mix-blend-lighten filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-blue-600 rounded-full mix-blend-lighten filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 bg-card/40 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              {step === 'EMAIL' && <Mail className="h-5 w-5 text-purple-600" />}
              {step === 'OTP' && <Key className="h-5 w-5 text-purple-600" />}
              {step === 'PASSWORD' && <Lock className="h-5 w-5 text-purple-600" />}
            </div>
            <CardTitle className="text-2xl">
              {step === 'EMAIL' && 'Reset Password'}
              {step === 'OTP' && 'Verify OTP'}
              {step === 'PASSWORD' && 'Create New Password'}
            </CardTitle>
          </div>
          <CardDescription>
            {step === 'EMAIL' && 'Enter your email to receive a reset code'}
            {step === 'OTP' && 'Enter the 6-digit code sent to your email'}
            {step === 'PASSWORD' && 'Choose a strong password for your account'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Step 1: Email */}
            {step === 'EMAIL' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email Address</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="you@example.com"
                    {...emailForm.register("email")}
                    className={emailForm.formState.errors.email ? "border-red-500" : ""}
                  />
                  {emailForm.formState.errors.email && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {emailForm.formState.errors.email.message}
                    </p>
                  )}
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
                  onClick={emailForm.handleSubmit(onEmailSubmit)}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={emailForm.formState.isSubmitting}
                >
                  {emailForm.formState.isSubmitting ? (
                    "Sending OTP..."
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Reset Code
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Step 2: OTP */}
            {step === 'OTP' && (
              <div className="space-y-4">
                {/* Back Button */}
                <button
                  onClick={handleBackToEmail}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to email
                </button>

                <Alert className="border-blue-200 bg-blue-50">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    We've sent a 6-digit code to <strong>{email}</strong>
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="reset-otp">Enter 6-Digit Code</Label>
                  <Input
                    id="reset-otp"
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    {...otpForm.register("otp")}
                    className={`text-center text-2xl font-mono tracking-widest ${
                      otpForm.formState.errors.otp ? "border-red-500" : ""
                    }`}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      otpForm.setValue('otp', value);
                      setError('');
                    }}
                  />
                  {otpForm.formState.errors.otp && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {otpForm.formState.errors.otp.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 text-center">
                    Check your email inbox and spam folder
                  </p>
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
                  onClick={otpForm.handleSubmit(onOtpSubmit)}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={otpForm.formState.isSubmitting}
                >
                  {otpForm.formState.isSubmitting ? (
                    "Verifying..."
                  ) : (
                    <>
                      <Key className="w-4 h-4 mr-2" />
                      Verify Code
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <button
                    onClick={handleResendOTP}
                    disabled={resendTimer > 0}
                    className={`text-sm font-medium ${
                      resendTimer > 0 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-purple-600 hover:text-purple-700'
                    }`}
                  >
                    <RefreshCw className={`w-3 h-3 inline mr-1 ${resendTimer > 0 ? '' : ''}`} />
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: New Password */}
            {step === 'PASSWORD' && (
              <div className="space-y-4">
                {/* Back Button */}
                <button
                  onClick={handleBackToOtp}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to verification
                </button>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...passwordForm.register("newPassword")}
                      className={passwordForm.formState.errors.newPassword ? "border-red-500 pr-10" : "pr-10"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(prev => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...passwordForm.register("confirmPassword")}
                      className={passwordForm.formState.errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(prev => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
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
                  onClick={passwordForm.handleSubmit(onPasswordSubmit)}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={passwordForm.formState.isSubmitting}
                >
                  {passwordForm.formState.isSubmitting ? (
                    "Resetting Password..."
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Reset Password
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <button onClick={() => navigate('/login')} className="text-purple-600 hover:underline font-medium">
              Back to Login
            </button>
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}