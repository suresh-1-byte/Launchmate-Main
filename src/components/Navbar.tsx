"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/ui/Logo";

export default function Navbar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const navLinks = [
        {
            href: "/dashboard",
            label: "Dashboard",
            icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21.5 9.5H22V21H2V9.5H2.5V20H10V14.5H14V20H21.5V9.5ZM12 4L3 11V9L12 2L21 9V11L12 4Z" />
                </svg>
            )
        },
        {
            href: "/learning",
            label: "Learning",
            icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 13H5V21H3V13ZM19 13H21V21H19V13ZM7 10H17V21H15V12H9V21H7V10ZM12 2L2 9V11H22V9L12 2Z" />
                </svg>
            )
        },
        {
            href: "/notes",
            label: "Notes",
            icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM7 7H17V9H7V7ZM7 11H17V13H7V11ZM7 15H13V17H7V15Z" />
                </svg>
            )
        },
        {
            href: "/projects",
            label: "Projects",
            icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6V18H4V6H20ZM6 10H18V12H6V10ZM6 14H14V16H6V14Z" />
                </svg>
            )
        },
        {
            href: "/jobs",
            label: "Jobs",
            icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 2H14V4H10V2ZM21 6V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V6C3 4.9 3.9 4 5 4H7V2C7 0.9 7.9 0 9 0H15C16.1 0 17 0.9 17 2V4H19C20.1 4 21 4.9 21 6ZM17 4V2H7V4H17ZM19 6H5V11H19V6ZM19 13H5V19H19V13Z" />
                </svg>
            )
        },
        {
            href: "/network",
            label: "Network",
            icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12C14.2 12 16 10.2 16 8C16 5.8 14.2 4 12 4C9.8 4 8 5.8 8 8C8 10.2 9.8 12 12 12ZM12 14C9.3 14 4 15.3 4 18V20H20V18C20 15.3 14.7 14 12 14Z" />
                </svg>
            )
        },
        {
            href: "/messaging",
            label: "Messaging",
            icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16ZM7 9H17V11H7V9ZM7 12H14V14H7V12ZM7 6H17V8H7V6Z" />
                </svg>
            )
        },
        {
            href: "/resume-roaster",
            label: "Roaster",
            icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" />
                </svg>
            )
        },
        {
            href: "/mentor",
            label: "AI Mentor",
            icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15 2H9C7.9 2 7 2.9 7 4V6H17V4C17 2.9 16.1 2 15 2ZM20 8H4C2.9 8 2 8.9 2 10V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V10C22 8.9 21.1 8 20 8ZM19 18H5V10H19V18ZM8 12H10V14H8V12ZM14 12H16V14H14V12ZM8 15H16V16H8V15Z" />
                </svg>
            )
        },
    ];

    if (!user) return null;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#e0e0e0] shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-14">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Logo />
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1 h-full">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`h-full px-4 flex flex-col items-center justify-center text-xs font-medium transition-all duration-200 border-b-2 hover:text-[#057642] ${pathname === link.href
                                    ? "border-[#057642] text-[#057642]"
                                    : "border-transparent text-gray-500 hover:text-gray-900"
                                    }`}
                            >
                                <div className="mb-0.5">{link.icon}</div>
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* User Menu */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            href="/profile"
                            className={`flex flex-col items-center px-4 h-full border-b-2 transition-all ${pathname === "/profile"
                                ? "border-[#057642] text-[#057642]"
                                : "border-transparent text-gray-500 hover:text-gray-900"
                                }`}
                        >
                            <div className="w-6 h-6 rounded-full bg-[#057642] flex items-center justify-center text-white text-[10px] font-bold">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-[10px] mt-0.5 font-medium">Me ▼</span>
                        </Link>
                        <button
                            onClick={logout}
                            className="text-xs text-gray-500 hover:text-red-600 font-medium px-2 py-1"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden text-gray-600 hover:text-gray-900 p-2"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden bg-white border-t border-[#e0e0e0]">
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${pathname === link.href
                                    ? "bg-green-50 text-[#057642]"
                                    : "text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                <div className="text-[#057642]/70">{link.icon}</div>
                                {link.label}
                            </Link>
                        ))}
                        <button
                            onClick={() => { logout(); setMobileOpen(false); }}
                            className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 3H5C3.9 3 3 3.9 3 5V9H5V5H19V19H5V15H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM10.08 15.58L11.5 17L16.5 12L11.5 7L10.08 8.42L12.67 11H3V13H12.67L10.08 15.58Z" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
