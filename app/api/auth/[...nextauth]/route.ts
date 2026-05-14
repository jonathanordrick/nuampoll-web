import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Admin Tahu Walik",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Cek apakah input sesuai dengan data di .env
                if (
                    credentials?.username === process.env.ADMIN_USERNAME &&
                    credentials?.password === process.env.ADMIN_PASSWORD
                ) {
                    return { id: "1", name: "Admin Tahu Walik" };
                }
                return null;
            }
        })
    ],
    pages: {
        signIn: "/tahu_walik", // Kita arahkan ke custom login page
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };