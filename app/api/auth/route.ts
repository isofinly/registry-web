import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    const body = request || {}

    console.log("\n --------------------", "body debug: ",body , "\n --------------------");

    const { username, password } = await body.json();

    console.log("\n --------------------\n", "user: ",username, "\n", "pass: ", password, "\n --------------------");

    if (password !== "1" || username!=="12") {
        // console.log(password, username)
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    return NextResponse.json({ succsess: true,request: { username, password }})
}