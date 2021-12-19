import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server";
import { ERROR, RoutesString } from "../constants/commons";

export async function middleware(req) {

    const token = await getToken({ req, secret: process.env.JWT_SECRET });

    const { pathname } = req.nextUrl;
    if (pathname.includes("/static")) {
        return NextResponse.next();
    }

    // if (token.error !== ERROR.REFRESH_TOKEN && pathname === RoutesString.LOGIN) {
    //     return NextResponse.redirect(RoutesString.HOME);
    // }

    if (pathname.includes("/api/auth") || token) {
        return NextResponse.next();
    }

    if (!token && pathname !== RoutesString.LOGIN) {
        return NextResponse.redirect(RoutesString.LOGIN)
    };
    return NextResponse.next();

}