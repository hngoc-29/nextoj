// File: src/middleware.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Chỉ định route + method cần auth
const authConfig = [
    // === ADMIN ONLY ===
    { pathPattern: '/api/contests', methods: ['POST'], admin: true },
    { pathPattern: '/api/contests/:id', methods: ['PUT', 'DELETE'], admin: true },
    { pathPattern: '/api/problems', methods: ['POST'], admin: true },
    { pathPattern: '/api/problems/:id', methods: ['PUT', 'DELETE'], admin: true },
    { pathPattern: '/api/problems/:id/testcase', methods: ['POST', 'PUT', 'DELETE'], admin: true },
    { pathPattern: '/api/users', methods: ['POST'], admin: true },

    // === REGISTERED USERS ===
    { pathPattern: '/api/cookie', methods: ['DELETE'], admin: false },
    { pathPattern: '/api/submissions', methods: ['POST'], admin: false },
    { pathPattern: '/api/submissions/:id/run', methods: ['POST'], admin: false },
    { pathPattern: '/api/users', methods: ['GET'], admin: false },
    { pathPattern: '/api/users/leave', methods: ['POST'], admin: false },
    { pathPattern: '/api/users/cpass', methods: ['POST'], admin: false },
];

// helper: chuyển '/api/x/:id/foo' → regex
function pathToRegex(pattern) {
    return new RegExp(
        '^' +
        pattern
            .replace(/\/:[^/]+/g, '/[^/]+')  // :param → [^/]+
            .replace(/\//g, '\\/') +
        '$'
    );
}

export async function middleware(request) {
    const { pathname } = request.nextUrl;
    const method = request.method.toUpperCase();

    // tìm rule matching cả path + method
    const rule = authConfig.find(r => {
        return pathToRegex(r.pathPattern).test(pathname)
            && r.methods.includes(method);
    });

    // nếu không có rule → next
    if (!rule) return NextResponse.next();

    // phải có token
    const token = request.cookies.get('token')?.value;
    if (!token) {
        return NextResponse.json({ success: false, message: 'Chưa đăng nhập' }, { status: 200 });
    }

    try {
        const secret = new TextEncoder().encode(process.env.SECRET_USER);
        const { payload } = await jwtVerify(token, secret);
        // nếu cần admin và user không phải admin → reject
        console.log(payload)
        if (rule.admin && !payload.isAdmin) {
            return NextResponse.json({ success: false, message: 'Không có quyền truy cập' }, { status: 200 });
        }

        // OK
        return NextResponse.next();

    } catch (err) {
        console.log(err)
        return NextResponse.json({ success: false, message: 'Token không hợp lệ hoặc hết hạn' }, { status: 200 });
    }
}

export const config = {
    matcher: ['/api/:path*']  // chỉ apply cho API routes
};
