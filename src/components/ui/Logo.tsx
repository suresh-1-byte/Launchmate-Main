"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
    return (
        <Link href="/dashboard" className={`flex items-center gap-2.5 group ${className}`}>
            <div className="relative w-10 h-10 flex items-center justify-center">
                {/* Background Glow Effect */}
                <motion.div
                    className="absolute inset-0 bg-[#057642]/20 rounded-xl blur-lg group-hover:bg-[#057642]/40 transition-all duration-500"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                    }}
                />

                {/* Main Logo Container */}
                <motion.div
                    className="relative w-9 h-9 bg-gradient-to-br from-[#057642] to-[#046237] rounded-xl flex items-center justify-center text-white shadow-lg overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {/* Animated Streak Background */}
                    <motion.div
                        className="absolute inset-0 opacity-20"
                        animate={{
                            backgroundPosition: ["0% 0%", "100% 100%"],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        style={{
                            backgroundImage: "linear-gradient(45deg, transparent 25%, white 25%, white 50%, transparent 50%, transparent 75%, white 75%, white 100%)",
                            backgroundSize: "4px 4px",
                        }}
                    />

                    {/* Rocket Icon */}
                    <motion.div
                        initial={{ y: 0 }}
                        whileHover={{
                            y: -4,
                            transition: {
                                repeat: Infinity,
                                repeatType: "reverse",
                                duration: 0.3
                            }
                        }}
                    >
                        <svg
                            className="w-5 h-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                            <path d="M9 12H4s.5-1 1-4c1.5 0 3 .5 3 .5L4 12Z" />
                            <path d="M12 15v5s1-.5 4-1c0-1.5-.5-3-.5-3L12 15Z" />
                        </svg>
                    </motion.div>

                    {/* Launch Sparkles */}
                    <motion.div
                        className="absolute bottom-1 w-2 h-1 bg-yellow-400 rounded-full blur-[1px]"
                        initial={{ opacity: 0, scale: 0 }}
                        whileHover={{
                            opacity: [0, 1, 0],
                            scale: [0, 1.5, 0],
                            y: [0, 5, 10],
                        }}
                        transition={{
                            duration: 0.5,
                            repeat: Infinity,
                        }}
                    />
                </motion.div>
            </div>

            {/* Logo Text with Animated Gradient */}
            <div className="flex flex-col leading-tight">
                <span className="text-xl font-black tracking-tighter text-gray-900 group-hover:text-[#057642] transition-colors duration-300 flex items-center">
                    Launch
                    <span className="text-[#057642]">Mate</span>
                    <motion.span
                        className="ml-1 w-1 h-1 bg-orange-500 rounded-full"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] -mt-1 group-hover:text-gray-600 transition-colors">
                    Empower Success
                </span>
            </div>
        </Link>
    );
}
