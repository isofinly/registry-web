"use client";
import React from "react";
import { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Divider,
  Spacer,
} from "@nextui-org/react";

import { signOut } from "next-auth/react"

import Logo from "../components/logo.tsx";
import {
  ChevronDown,
  Lock,
  Activity,
  Flash,
  Server,
  TagUser,
  Scale,
} from "./icons.tsx";

export default function NavbarComponent() {
  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  const icons = {
    flash: <Flash className="text-primary" fill="orangered" size={30} />,
    activity: (
      <Activity className="text-secondary" fill="orangered" size={30} />
    ),
    user: <TagUser className="text-danger" fill="orangered" size={30} />,
    chevron: <ChevronDown fill="currentColor" size={16} />,
    scale: <Scale className="text-warning" fill="orangered" size={30} />,
    lock: <Lock className="text-success" fill="orangered" size={30} />,
    server: <Server className="text-success" fill="orangered" size={30} />,
  };
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar isBordered>
        <NavbarBrand className="h-full" justify="center">
          <Logo className="h-full" />
          <p className="font-bold text-[#f05c27]">ЕКЖ</p>
        </NavbarBrand>

        <Divider orientation="vertical" />

        <NavbarContent className="hidden sm:flex gap-6" justify="center">
          <NavbarItem>
            <Link href="/dashboard" aria-current="page">
              Главная
            </Link>
          </NavbarItem>

          <NavbarItem>
            <Link color="foreground" href="/dashboard/cards">
              Карты
            </Link>
          </NavbarItem>

          <NavbarItem>
            <Link color="foreground" href="/dashboard/users">
              Пользователи
            </Link>
          </NavbarItem>

          <NavbarItem>
            <Link color="foreground" href="/dashboard/discount">
              Скидки
            </Link>
          </NavbarItem>

        </NavbarContent>

        <Divider orientation="vertical" />

        <NavbarContent className="h-full" justify="center">
          <NavbarItem >{dateTime}</NavbarItem>
        </NavbarContent>

        <Divider orientation="vertical" />

        <NavbarContent justify="end">
          <NavbarItem>
            <Button variant="bordered" color="danger" radius="sm" onClick={() => signOut()}>
              Выйти
            </Button>
          </NavbarItem>
        </NavbarContent>

      </Navbar>

      <Spacer y={2} />
    </>
  );
}
