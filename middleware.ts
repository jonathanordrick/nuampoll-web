import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/tahu_walik",
    },
});

export const config = {
    matcher: [
        "/tahu_walik/dashboard/:path*",
        "/tahu_walik/analitycs/:path*",
        "/tahu_walik/analitycs",
        "/tahu_walik/growth/:path*",
        "/tahu_walik/growth"
    ]
};