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
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Image,
  Divider,
  Spacer,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";

import {
  ChevronDown,
  Lock,
  Activity,
  Flash,
  Server,
  TagUser,
  Scale,
  AddNoteIcon,
  CopyDocumentIcon,
  EditDocumentIcon,
  DeleteDocumentIcon,
} from "../components/icons.tsx";

import { useSession } from "next-auth/react";

export default function Page() {
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

  const { data: session, status } = useSession({
    required: true,
  });

  if(status === "loading") {
    return <></>
  }

  return (
    <>
      <Spacer x={2} />

      <div class="grid justify-items-center justify-center">
        <div class="grid grid-cols-3 gap-2 w-[70vw]">
          <Card className="py-4 w-fit col-span-1">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <p className="text-tiny uppercase font-bold">Пользователи</p>
              <h4 className="font-bold text-large">
                Регистрация/изменение данных
              </h4>
            </CardHeader>
            <Divider className="my-4" />
            <CardBody className="overflow-visible py-2">
              <Listbox
                color="primary"
                variant="flat"
                aria-label="Actions"
                onAction={(key) => alert(key)}
              >
                <ListboxItem
                  key="new"
                  startContent={<AddNoteIcon className={iconClasses} />}
                >
                  New file
                </ListboxItem>
                <ListboxItem
                  key="copy"
                  startContent={<CopyDocumentIcon className={iconClasses} />}
                >
                  Copy link
                </ListboxItem>
                <ListboxItem
                  key="edit"
                  startContent={<EditDocumentIcon className={iconClasses} />}
                >
                  Edit file
                </ListboxItem>
                <ListboxItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  startContent={<DeleteDocumentIcon className={iconClasses} />}
                >
                  Delete file
                </ListboxItem>
              </Listbox>
            </CardBody>
            <Divider className="my-4" />
            <CardFooter>
              <Button isDisabled color="primary">
                Кнопка
              </Button>
            </CardFooter>
          </Card>
          <Card className="py-4 w-fit col-span-1">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <p className="text-tiny uppercase font-bold">
                Управление картами
              </p>
              <h4 className="font-bold text-large">
                Выпуск/изменение/блокировка
              </h4>
            </CardHeader>
            <Divider className="my-4" />
            <CardBody className="overflow-visible py-2">
              <Listbox
                color="primary"
                variant="flat"
                aria-label="Actions"
                onAction={(key) => alert(key)}
              >
                <ListboxItem
                  key="new"
                  startContent={<AddNoteIcon className={iconClasses} />}
                >
                  New file
                </ListboxItem>
                <ListboxItem
                  key="copy"
                  startContent={<CopyDocumentIcon className={iconClasses} />}
                >
                  Copy link
                </ListboxItem>
                <ListboxItem
                  key="edit"
                  startContent={<EditDocumentIcon className={iconClasses} />}
                >
                  Edit file
                </ListboxItem>
                <ListboxItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  startContent={<DeleteDocumentIcon className={iconClasses} />}
                >
                  Delete file
                </ListboxItem>
              </Listbox>
            </CardBody>
            <Divider className="my-4" />
            <CardFooter>
              <Button isDisabled color="primary">
                Кнопка
              </Button>
            </CardFooter>
          </Card>
          <Card className="py-4 w-fit col-span-1">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <p className="text-tiny uppercase font-bold">
                Социальные пособия
              </p>
              <h4 className="font-bold text-large">Детали/проценты/периоды</h4>
            </CardHeader>
            <Divider className="my-4" />
            <CardBody className="overflow-visible py-2">
              <Listbox
                color="primary"
                variant="flat"
                aria-label="Actions"
                onAction={(key) => alert(key)}
              >
                <ListboxItem
                  key="new"
                  startContent={<AddNoteIcon className={iconClasses} />}
                >
                  New file
                </ListboxItem>
                <ListboxItem
                  key="copy"
                  startContent={<CopyDocumentIcon className={iconClasses} />}
                >
                  Copy link
                </ListboxItem>
                <ListboxItem
                  key="edit"
                  startContent={<EditDocumentIcon className={iconClasses} />}
                >
                  Edit file
                </ListboxItem>
                <ListboxItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  startContent={<DeleteDocumentIcon className={iconClasses} />}
                >
                  Delete file
                </ListboxItem>
              </Listbox>
            </CardBody>
            <Divider className="my-4" />
            <CardFooter>
              <Button isDisabled color="primary">
                Кнопка
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
