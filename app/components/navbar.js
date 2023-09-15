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
            <Link href="#" aria-current="page">
              Главная
            </Link>
          </NavbarItem>

          <NavbarItem>
            <Link color="foreground" href="#">
              Транзакции
            </Link>
          </NavbarItem>

          <Dropdown>
            <NavbarItem>
              <DropdownTrigger>
                <Button
                  disableRipple
                  className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                  endContent={icons.chevron}
                  // variant="flat"
                  // color="primary"
                  // radius="sm"
                >
                  <p className="font-bold text-inherit">Карты</p>
                </Button>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu
              aria-label="ACME features"
              className="w-[340px]"
              itemClasses={{
                base: "gap-4",
              }}
            >
              <DropdownItem
                key="autoscaling"
                description="ACME scales apps to meet user demand, automagically, based on load."
                startContent={icons.flash}
              >
                Выпуск карты
              </DropdownItem>
              <DropdownItem
                key="usage_metrics"
                description="Real-time metrics to debug issues. Slow query added? We’ll show you exactly where."
                startContent={icons.activity}
              >
                Информация о карте
              </DropdownItem>
              <DropdownItem
                key="production_ready"
                description="ACME runs on ACME, join us and others serving requests at web scale."
                startContent={icons.scale}
              >
                Production Ready
              </DropdownItem>
              <DropdownItem
                key="99_uptime"
                description="Applications stay on the grid with high availability and high uptime guarantees."
                startContent={icons.server}
              >
                +99% Uptime
              </DropdownItem>
              <DropdownItem
                key="supreme_support"
                description="Overcome any challenge with a supporting team ready to respond."
                startContent={icons.user}
              >
                Изменение данных
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Dropdown>
            <NavbarItem>
              <DropdownTrigger>
                <Button
                  disableRipple
                  className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                  endContent={icons.chevron}
                  // variant="flat"
                  // color="primary"
                  // radius="sm"
                >
                  <p className="font-bold text-inherit">Пользователи</p>
                </Button>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu
              aria-label="ACME features"
              className="w-[340px]"
              itemClasses={{
                base: "gap-4",
              }}
            >
              <DropdownItem
                key="autoscaling"
                description="ACME scales apps to meet user demand, automagically, based on load."
                startContent={icons.flash}
              >
                Регистрация
              </DropdownItem>
              <DropdownItem
                key="usage_metrics"
                description="Real-time metrics to debug issues. Slow query added? We’ll show you exactly where."
                startContent={icons.activity}
              >
                Информация
              </DropdownItem>
              {/* <DropdownItem
              key="production_ready"
              description="ACME runs on ACME, join us and others serving requests at web scale."
              startContent={icons.scale}
            >
              Production Ready
            </DropdownItem>
            <DropdownItem
              key="99_uptime"
              description="Applications stay on the grid with high availability and high uptime guarantees."
              startContent={icons.server}
            >
              +99% Uptime
            </DropdownItem> */}
              <DropdownItem
                key="supreme_support"
                description="Overcome any challenge with a supporting team ready to respond."
                startContent={icons.user}
              >
                Изменение данных
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Dropdown>
            <NavbarItem>
              <DropdownTrigger>
                <Button
                  disableRipple
                  className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                  endContent={icons.chevron}
                  // variant="flat"
                  // color="primary"
                  // radius="sm"
                >
                  <p className="font-bold text-inherit">Пособия/льготы</p>
                </Button>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu
              aria-label="ACME features"
              className="w-[340px]"
              itemClasses={{
                base: "gap-4",
              }}
            >
              <DropdownItem
                key="autoscaling"
                description="ACME scales apps to meet user demand, automagically, based on load."
                startContent={icons.flash}
              >
                Социальные льготы
              </DropdownItem>
              <DropdownItem
                key="usage_metrics"
                description="Real-time metrics to debug issues. Slow query added? We’ll show you exactly where."
                startContent={icons.activity}
              >
                Статистика использования
              </DropdownItem>
              <DropdownItem
                key="production_ready"
                description="ACME runs on ACME, join us and others serving requests at web scale."
                startContent={icons.scale}
              >
                Назначение категории
              </DropdownItem>
              {/* <DropdownItem
              key="99_uptime"
              description="Applications stay on the grid with high availability and high uptime guarantees."
              startContent={icons.server}
            >
              Abuadsuisa
            </DropdownItem> */}
              <DropdownItem
                key="supreme_support"
                description="Overcome any challenge with a supporting team ready to respond."
                startContent={icons.user}
              >
                Обработка заявок
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>

        <Divider orientation="vertical" />

        <NavbarContent justify="end">
          <NavbarItem>{dateTime}</NavbarItem>
        </NavbarContent>
      </Navbar>

      <Spacer y={2} />
    </>
  );
}
