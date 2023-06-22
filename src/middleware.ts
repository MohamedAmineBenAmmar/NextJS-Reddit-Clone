import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    // Check if the user is logged in
    const token = await getToken({req})

    if(!token){
        return NextResponse.redirect(new URL('/sign-in', req.nextUrl))
    }
}

// Protecting our paths
export const config = {
    matcher: ["/r/:path*/submit", "/r/create"] // These paths are now protected
}