import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/tahu_walik",
    },
});

export const config = {
    matcher: ["/tahu_walik/dashboard/:path*"]
};