import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Zap, Lock, ChevronRight, Github, Twitter, Linkedin, ShieldCheck, FileKey, Users, MonitorSmartphone, ArrowRight, Sparkles, CheckCircle, Key, Clock, Smartphone, QrCode, RotateCw } from 'lucide-react';
import { FaDiscord } from "react-icons/fa";
import { useAuth } from '@/auth/useAuth';
import { type User } from "@/types/types";
import { getLocalUser } from '@/utils/getLocalUser';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const UserInfo: User | null = user ?? getLocalUser();

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 7);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Shield,
      title: "OTP Verification",
      description: "Secure time-based OTP with Redis expiry, resend limits, and brute-force protection.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Lock,
      title: "JWT Authentication",
      description: "Access & refresh token authentication with secure rotation and automatic renewal.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Zap,
      title: "Fast & Scalable Architecture",
      description: "High-performance architecture using Redis caching and optimized database queries.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: ShieldCheck,
      title: "Account Verification & Recovery",
      description: "OTP-based account verification and secure password reset with expiry and attempt limits.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Users,
      title: "Session Management",
      description: "View active sessions and terminate all other sessions instantly for security.",
      color: "from-indigo-500 to-violet-500",
    },
    {
      icon: MonitorSmartphone,
      title: "Device Tracking",
      description: "Tracks device, browser, and IP metadata for every login session.",
      color: "from-teal-500 to-sky-500",
    },
    {
      icon: Smartphone,
      title: "TOTP-Based 2FA",
      description: "TOTP-based two-factor authentication using Google Authenticator, Microsoft Authenticator, or Authy.",
      color: "from-rose-500 to-orange-500",
    },

    {
      icon: FileKey,
      title: "Backup Codes",
      description: "Single-use backup codes for account recovery when authenticator access is unavailable.",
      color: "from-yellow-500 to-amber-500",
    }, {
      icon: RotateCw,
      title: "Token Rotation",
      description: "Refresh token rotation to prevent token reuse and session hijacking.",
      color: "from-fuchsia-500 to-purple-500",
    }


  ];

  const stats = [
    { label: "Security Features", value: "7+", icon: Shield },
    { label: "Response Time", value: "<100ms", icon: Zap },
    { label: "Uptime", value: "99.9%", icon: CheckCircle },
    { label: "Active Sessions", value: "∞", icon: Users },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const pattern = useMemo(
    () =>
      Array.from({ length: 64 }, () =>
        Math.random() > 0.5 ? 'bg-gray-900' : 'bg-white'
      ),
    []
  );
  

  const [demoCode] = useState(() =>
    Math.floor(100000 + Math.random() * 900000).toString()
  );

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-950 via-gray-900 to-black text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative">
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-pink-600 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-lighten filter blur-3xl opacity-15 animate-blob animation-delay-3000"></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

        <div className="relative max-w-7xl mx-auto flex flex-col items-center justify-center text-center py-24 md:py-40 px-6">
          <div className={`inline-block mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
            <span className="px-4 py-2 bg-linear-to-r from-blue-600/20 to-purple-600/20 text-blue-300 rounded-full text-sm font-semibold border border-blue-500/30 inline-flex items-center gap-2 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 animate-pulse" />
              Next-gen Authentication Platform
            </span>
          </div>

          <h1 className={`text-5xl md:text-8xl font-black mb-8 transition-all duration-1000 delay-150 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
            <span className="bg-linear-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
              Secure Authentication
            </span>
            <br />
            <span className="bg-linear-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent animate-gradient">
              Made Simple
            </span>
          </h1>

          <p className={`text-xl md:text-2xl text-gray-300 max-w-4xl mb-12 leading-relaxed transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
            Enterprise-grade OTP authentication with <span className="text-blue-400 font-semibold">Redis</span>, <span className="text-purple-400 font-semibold">JWT</span>, and <span className="text-green-400 font-semibold">Authenticator App 2FA</span>.
            Build trust with your users through military-grade security.
          </p>

          <div className={`flex flex-wrap gap-4 justify-center mb-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
            {UserInfo ? (
              <Button
                size="lg"
                onClick={() => handleNavigation('/dashboard')}
                className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300 text-lg px-10 py-6 group border border-blue-400/20"
              >
                Open Dashboard
                <ChevronRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => handleNavigation('/register')}
                className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300 text-lg px-10 py-6 group border border-blue-400/20"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </Button>
            )}
            <Button
              onClick={() => window.location.href = 'https://documenter.getpostman.com/view/47278131/2sBXVbGDPJ'}
              size="lg"
              className="bg-white/5 backdrop-blur-sm border-2 border-white/10 text-white hover:bg-white/10 hover:border-white/20 hover:scale-110 transition-all duration-300 text-lg px-10 py-6 shadow-xl"
            >
              View Documentation
            </Button>
          </div>

          {/* Stats Section */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 w-full max-w-5xl transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-linear-to--br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 group">
                  <Icon className="h-8 w-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <span className="px-4 py-2 bg-linear-to-r from-purple-600/20 to-pink-600/20 text-purple-300 rounded-full text-sm font-semibold border border-purple-500/30 inline-flex items-center gap-2 backdrop-blur-sm mb-6">
            <Shield className="h-4 w-4" />
            Complete Security Suite
          </span>
          <h2 className="text-5xl md:text-6xl font-black mb-6 bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Everything you need for
            <br />
            secure authentication
          </h2>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto">
            Built with modern technologies and industry best practices to ensure your application's security
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isActive = activeFeature === index;

            return (
              <div
                key={index}
                className={`group relative border-2 rounded-3xl p-8 bg-linear-to-br from-white/5 to-white/0 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 cursor-pointer ${isActive
                    ? 'border-blue-500 shadow-2xl shadow-blue-500/30 scale-105 bg-linear-to-br from-blue-600/10 to-purple-600/10'
                    : 'border-white/10 hover:border-blue-500/50 hover:scale-105'
                  }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className={`absolute inset-0 bg-linear-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}></div>

                <div className="relative">
                  <div className={`inline-block p-5 bg-linear-to-br ${feature.color} rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                    <Icon className="h-10 w-10 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed text-base">
                    {feature.description}
                  </p>

                  {isActive && (
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-75"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-150"></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Authenticator App 2FA Section */}
      <div className="relative max-w-7xl mx-auto px-6 py-32 h-fit">
        <div className="bg-linear-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 backdrop-blur-xl border-2 border-white/10 rounded-3xl p-12 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

          <div className="relative grid md:grid-cols-2 gap-12 items-center ">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-green-600/20 to-emerald-600/20 text-green-300 rounded-full text-sm font-semibold border border-green-500/30 mb-6">
                <Smartphone className="h-4 w-4" />
                New Feature
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Authenticator App
                <br />
                Two-Factor Authentication
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Add an extra layer of security with TOTP-based 2FA. Works seamlessly with Google Authenticator, Microsoft Authenticator, and Authy.
              </p>

              <div className="space-y-4 mb-8 ">
                <div className="flex items-start gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                  <QrCode className="h-6 w-6 text-blue-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Easy Setup</h4>
                    <p className="text-sm text-gray-400">Scan QR code with your authenticator app</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                  <Clock className="h-6 w-6 text-purple-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Time-Based Codes</h4>
                    <p className="text-sm text-gray-400">30-second rotating verification codes</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                  <Key className="h-6 w-6 text-green-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Backup Codes</h4>
                    <p className="text-sm text-gray-400">Emergency access with one-time backup codes</p>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl shadow-green-500/30 hover:scale-105 transition-all duration-300 text-lg px-8"
              >
                Learn More
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="relative">
              <div className="bg-linear-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
                  <div className="bg-white rounded-xl p-4 mb-4">
                    <div className="grid grid-cols-8 gap-2">
                      {pattern.map((color, i) => (
                        <div
                          key={i}
                          className={`aspect-square rounded ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-center text-xs text-gray-400 font-mono">
                    Scan with authenticator app
                  </p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                    <div className="text-3xl font-mono font-bold tracking-wider text-white">
                      {demoCode}
                    </div>
                    <Clock className="h-5 w-5 text-blue-400 animate-pulse" />
                  </div>
                  <p className="text-xs text-gray-400 mt-3">Code refreshes every 30 seconds</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-white/10 bg-linear-to-b from-transparent to-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <span className="font-black text-2xl bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">SecureAuth</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Enterprise-grade authentication made simple for developers worldwide.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-white text-lg">Resources</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="https://freakkyshivam.netlify.app/" className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                  Portfolio <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a></li>
                <li><a href="https://documenter.getpostman.com/view/47278131/2sBXVbGDPJ" className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                  Documentation <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a></li>
                <li><a href="https://blog-app-chi-sage.vercel.app/" className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                  Blog <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a></li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-2">
              <h4 className="font-bold mb-4 text-white text-lg">Connect With Us</h4>
              <div className="flex gap-4 mb-6">
                <a href="https://github.com/freakkyshivam" target="_blank" className="p-4 bg-linear-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-xl hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/20 text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-110 group">
                  <Github className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                </a>
                <a href="https://x.com/freakkyshivam" target="_blank" className="p-4 bg-linear-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-xl hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/20 text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-110 group">
                  <Twitter className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                </a>
                <a href="https://discord.com/users/freakkyshivam" target="_blank" className="p-4 bg-linear-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-xl hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/20 text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-110 group">
                  <FaDiscord className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                </a>
                <a href="https://www.linkedin.com/in/freakkyshivam" target="_blank" className="p-4 bg-linear-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-xl hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/20 text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-110 group">
                  <Linkedin className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                </a>
              </div>
              <p className="text-sm text-gray-500">
                Built with ❤️ for developers who care about security
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© 2025 SecureAuth. All rights reserved.</p>

          </div>
        </div>
      </footer>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default HomePage;