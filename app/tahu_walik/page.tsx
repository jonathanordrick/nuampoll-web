"use client";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { data: session, status } = useSession();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/tahu_walik/dashboard");
        }
    }, [status, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await signIn("credentials", {
            username,
            password,
            redirect: false,
        });

        if (res?.ok) {
            router.push("/tahu_walik/dashboard");
        } else {
            setShowErrorModal(true);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] text-white selection:bg-red-600/30">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-900/10 rounded-full blur-3xl"></div>
            </div>

            <form onSubmit={handleSubmit} className="relative bg-[#242424] p-8 md:p-10 rounded-2xl border border-red-900/30 shadow-[0_0_50px_rgba(220,38,38,0.1)] w-full max-w-md backdrop-blur-sm">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold mb-2">
                        <span className="text-red-600">Login</span> Admin
                    </h1>
                    <p className="text-gray-500 text-sm">Masuk ke Dashboard Nuampoll</p>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-400 ml-1">Username</label>
                        <input
                            type="text"
                            placeholder="Masukkan username"
                            className="w-full bg-[#1a1a1a] border border-red-900/20 p-3.5 rounded-xl text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all duration-300 placeholder:text-gray-700"
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-400 ml-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="w-full bg-[#1a1a1a] border border-red-900/20 p-3.5 pr-12 rounded-xl text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all duration-300 placeholder:text-gray-700"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500 transition-colors duration-300 focus:outline-none p-1 cursor-pointer"
                                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all duration-300 transform hover:-translate-y-1 active:scale-95 mt-4 cursor-pointer"
                    >
                        Masuk Sekarang
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-red-900/10 text-center">
                    <p className="text-xs text-gray-600">
                        &copy; {new Date().getFullYear()} Nuampoll. All rights reserved.
                    </p>
                </div>
            </form>

            {showErrorModal && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all duration-300 animate-fade-in"
                    onClick={() => setShowErrorModal(false)}
                >
                    <div 
                        className="bg-[#242424] border border-red-600/30 shadow-[0_0_50px_rgba(220,38,38,0.2)] rounded-2xl p-6 max-w-sm w-full text-center relative overflow-hidden transform scale-100 transition-all duration-300 animate-scale-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Decorative glow inside modal */}
                        <div className="absolute -top-12 -left-12 w-24 h-24 bg-red-600/10 rounded-full blur-2xl pointer-events-none"></div>
                        <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-red-600/10 rounded-full blur-2xl pointer-events-none"></div>

                        {/* Error Icon */}
                        <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-950/50 border border-red-600/40 text-red-500 mb-4 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 7.5h.008v.008H12v-.008Z" />
                            </svg>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">Akses Ditolak</h3>
                        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                            Username atau Password salah, bro! Silakan periksa kembali akun Anda.
                        </p>

                        <button
                            onClick={() => setShowErrorModal(false)}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl shadow-[0_0_15px_rgba(220,38,38,0.2)] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] transition-all duration-300 transform active:scale-95 cursor-pointer"
                        >
                            Coba Lagi
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}