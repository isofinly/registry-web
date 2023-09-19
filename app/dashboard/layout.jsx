"use client";
import NavComponent from "../components/navbar";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const ServerProtectedPage = ({ children }) => {
  const { data: session, status } = useSession({
    required: true,
  });
  if (status === "loading") {
    return <></>;
  };
  // JWT for api calls
  const fetchPost = async () => {
    const res = await fetch("http://localhost:5000/api/v1/posts", {
      method: "GET",
      headers: {
        authorization: `Bearer ${session?.user.accessToken}`,
      },
    });
    const json = await res.json();
    console.log(json);
  }

  return (
    <>
      <NavComponent />
      <div className="grid justify-center">{children}</div>
    </>
  );
};

export default ServerProtectedPage;
