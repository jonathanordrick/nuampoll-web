"use client";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { data: session, status } = useSession();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
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
            alert("Username atau Password salah, bro!");
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
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-[#1a1a1a] border border-red-900/20 p-3.5 rounded-xl text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all duration-300 placeholder:text-gray-700"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
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
        </div>
    );
}