import { cookies } from "next/headers";

export async function DELETE(req) {
    const cookieStore = await cookies();
    const { name } = await req.json();
    cookieStore.set(name, "", {
        expires: new Date(0),
        path: "/",
    });

    return new Response(JSON.stringify({
        success: true,
    }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
