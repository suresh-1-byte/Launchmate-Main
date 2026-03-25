"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Logo from "@/components/ui/Logo";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar (LinkedIn Style) */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#f0f0f0] px-6 py-4 shadow-sm backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-black text-gray-500 hover:text-[#057642] transition-colors uppercase tracking-widest">
              Sign In
            </Link>
            <Link href="/signup" className="px-8 py-2.5 bg-[#057642] text-white font-black rounded-full hover:bg-[#046237] transition-all text-xs shadow-lg shadow-[#057642]/20 active:scale-95 uppercase tracking-widest">
              Join Now
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-40 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in space-y-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#057642]/10 text-[#057642] text-[10px] font-black tracking-widest uppercase ring-1 ring-[#057642]/20">
                <span className="w-1.5 h-1.5 bg-[#057642] rounded-full animate-pulse"></span>
                New Professional Era
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.1] tracking-tighter">
                Accelerate your <br />
                <span className="text-[#057642] inline-block mt-2 relative">
                  career growth.
                  <div className="absolute -bottom-2 left-0 w-full h-2 bg-[#057642]/10 rounded-full"></div>
                </span>
              </h1>
              <p className="text-lg text-gray-500 font-medium max-w-lg leading-relaxed pt-2">
                The ultimate AI-powered ecosystem for developers and professionals to build portfolios, Upskill, and land high-impact jobs.
              </p>
            </div>

            <div className="space-y-4 max-w-md pt-4">
              {[
                { label: "Search specialized job openings", icon: "M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.5L20.5 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" },
                { label: "Master industry-standard stack", icon: "M12 3L1 9L12 15L21 10.09V17H23V9L12 3ZM12 17L3 12.09V14.09L12 19L21 14.09V12.09L12 17Z" },
                { label: "Consult your AI Career Strategist", icon: "M15 2H9C7.9 2 7 2.9 7 4V6H17V4C17 2.9 16.1 2 15 2ZM20 8H4C2.9 8 2 8.9 2 10V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V10C22 8.9 21.1 8 20 8ZM19 18H5V10H19V18ZM8 12H10V14H8V12ZM14 12H16V14H14V12ZM8 15H16V16H8V15Z" }
              ].map((item, i) => (
                <Link key={i} href="/signup" className="group flex justify-between items-center px-6 py-5 border-2 border-gray-100 rounded-2xl hover:shadow-2xl hover:border-[#057642]/20 transition-all bg-white relative active:scale-[0.99]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#057642]/5 text-[#057642] flex items-center justify-center group-hover:bg-[#057642] group-hover:text-white transition-all duration-300">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d={item.icon} />
                      </svg>
                    </div>
                    <span className="text-base font-bold text-gray-700 group-hover:text-gray-900">{item.label}</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-300 group-hover:text-[#057642] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden lg:block relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#057642]/20 to-[#046237]/5 blur-[120px] rounded-full scale-150 -translate-y-20"></div>
            <div className="relative card border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] p-0 overflow-hidden bg-white/80 backdrop-blur-xl rounded-[40px] border border-white/40 ring-1 ring-black/5">
              <div className="h-24 bg-[#057642] flex items-center justify-between px-10">
                <span className="text-white font-black tracking-[0.2em] text-[10px] uppercase opacity-80">Platform V2 Performance</span>
                <div className="flex gap-1.5 font-bold">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                </div>
              </div>
              <div className="p-10 space-y-10">
                <div className="flex gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                  </div>
                  <div className="flex-1 space-y-3 pt-1">
                    <div className="h-5 bg-gray-100 rounded-lg w-3/4" />
                    <div className="h-4 bg-gray-50 rounded-lg w-1/2" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-3.5 bg-gray-50 rounded-full w-full" />
                  <div className="h-3.5 bg-gray-50 rounded-full w-[90%]" />
                  <div className="h-3.5 bg-gray-50 rounded-full w-[70%]" />
                </div>
                <div className="pt-8 border-t border-gray-100 flex gap-3">
                  <div className="h-10 bg-[#057642]/5 rounded-xl w-32 border border-[#057642]/10" />
                  <div className="h-10 bg-blue-50/50 rounded-xl w-28 border border-blue-100" />
                  <div className="h-10 bg-purple-50/50 rounded-xl w-36 border border-purple-100 ml-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Info */}
        <div className="max-w-7xl mx-auto mt-48 grid grid-cols-1 md:grid-cols-3 gap-16">
          {[
            { title: "Portfolio Engineering", desc: "Showcase verified technical projects. Link your repositories and let our AI provide qualitative code scores to impress recruiters.", icon: "M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6V18H4V6H20ZM6 10H18V12H6V10ZM6 14H14V16H6V14Z" },
            { title: "Proprietary Networking", desc: "Connect with high-performing peers and mentors. Our graph-based networking helps you find the right people for your current skill level.", icon: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" },
            { title: "Advanced AI Strategies", desc: "Gain an unfair advantage with real-time AI mentoring. From dynamic learning roadmaps to mock technical interviews, we cover it all.", icon: "M15 2H9C7.9 2 7 2.9 7 4V6H17V4C17 2.9 16.1 2 15 2ZM20 8H4C2.9 8 2 8.9 2 10V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V10C22 8.9 21.1 8 20 8ZM19 18H5V10H19V18ZM8 12H10V14H8V12ZM14 12H16V14H14V12ZM8 15H16V16H8V15Z" }
          ].map((feat, i) => (
            <div key={i} className="space-y-6 group">
              <div className="w-14 h-14 bg-[#057642]/10 text-[#057642] rounded-2xl flex items-center justify-center group-hover:bg-[#057642] group-hover:text-white transition-all shadow-sm">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d={feat.icon} />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">{feat.title}</h2>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">{feat.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-[#f0f0f0] py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16">
          <div className="space-y-6">
            <Logo />
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Bridging the gap between potential and performance.</p>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">© 2026 LaunchMate Corporation Global</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-24">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Platform</h4>
              <div className="flex flex-col gap-3 text-xs font-bold text-gray-400">
                <Link href="/login" className="hover:text-[#057642] transition-colors">Sign In</Link>
                <Link href="/signup" className="hover:text-[#057642] transition-colors">Join LaunchMate</Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Legal</h4>
              <div className="flex flex-col gap-3 text-xs font-bold text-gray-400">
                <a href="#" className="hover:text-[#057642]">Privacy Policy</a>
                <a href="#" className="hover:text-[#057642]">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
