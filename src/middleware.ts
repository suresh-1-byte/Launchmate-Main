export { default } from "next-auth/middleware";

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/profile/:path*",
        "/network/:path*",
        "/mentor/:path*",
        "/learning/:path*",
        "/projects/:path*",
    ],
};
