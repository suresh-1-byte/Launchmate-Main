"use client";
import { CareerPath } from "@/lib/learning-data";

interface Props {
    paths: CareerPath[];
    onSelect: (path: CareerPath) => void;
}

export default function CareerSelector({ paths, onSelect }: Props) {
    return (
        <div>
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Choose Your Career Goal</h2>
                <p className="text-gray-500 mt-2 text-sm">Select a path to get a personalized roadmap, resources, and study plan</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paths.map((path) => (
                    <button
                        key={path.id}
                        onClick={() => onSelect(path)}
                        className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-white p-6 text-left hover:border-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                        {/* Gradient overlay on hover */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${path.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                        <div className="relative">
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${path.gradient} flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                {path.icon}
                            </div>
                            <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-indigo-700 transition-colors">{path.title}</h3>
                            <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">{path.description}</p>

                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{path.avgSalary}</span>
                                <span className="text-xs text-gray-400">{path.modules.length} modules</span>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-1">
                                {path.skills.slice(0, 3).map((skill, i) => (
                                    <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{skill}</span>
                                ))}
                                {path.skills.length > 3 && (
                                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">+{path.skills.length - 3}</span>
                                )}
                            </div>
                        </div>

                        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${path.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    </button>
                ))}
            </div>
        </div>
    );
}
