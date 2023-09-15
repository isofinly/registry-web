"use client";
import NavComponent from "./../components/navbar";
import { useSession } from "next-auth/react";
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../utils/authOptions'
import { redirect } from 'next/navigation'

const ServerProtectedPage = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  // const session = await getServerSession(authOptions)
  // if (!session) {
  //   redirect('/auth/signin?callbackUrl=/dashboard')
  // }
  
  const { data: session, status } = useSession({
    required: true,
  });
  if (status === "loading") {
    return <></>;
  }
  
  return (
    <>
      <NavComponent />
      {children}
    </>
  );
}

export default ServerProtectedPage;