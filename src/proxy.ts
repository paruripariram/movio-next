import { auth } from "@/auth"
import { NextResponse } from "next/server";

export default auth((req)=> {
    const isLoggedIn = !!req.auth
    const isOnProtectedPage = req.nextUrl.pathname.startsWith("/collection") || req.nextUrl.pathname.startsWith("/profile")

    if (!isLoggedIn && isOnProtectedPage) {
        return NextResponse.redirect(new URL("/auth/signin", req.url))
    }

    return NextResponse.next();
})

export const config = {
  matcher: ["/collection/:path*", "/profile/:path*"],
};