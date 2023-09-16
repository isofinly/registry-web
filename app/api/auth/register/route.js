import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(requst, response) {
  const body = await requst.json();
  const { name, email, password } = body.data;
  console.log(body.data);

  if (!name || !email || !password) {
    return NextResponse.json({ error: `Missing fields` }, { status: 400 });
  }

  const existingClient = await prisma.client.findUnique({
    where: {
      email: email,
    },
  });
  if (existingClient) {
    return NextResponse.json({ error: "Client already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const client = await prisma.client.create({
    data: {
      first_name: name,
      email,
      hashed_password: hashedPassword,
    },
  });
  return NextResponse.json(client);
}
