// app/providers.tsx
"use client";


import React from "react";
import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";

interface Props {
  children?: React.ReactNode;
}

// export function Providers({children}: { children: React.ReactNode }) {
//   return (
//     <NextUIProvider>
//       {children}
//     </NextUIProvider>
//   )
// }

export default function NextAuthSessionProvider({ children }: Props) {
  return (
    <SessionProvider>
      <NextUIProvider>
        {children}
      </NextUIProvider>
    </SessionProvider>
  );
}
