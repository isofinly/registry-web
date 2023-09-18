"use client";
// Util hooks
import React from "react";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { VariableSizeList } from "react-window";
import useMediaQuery from "@mui/material/useMediaQuery";
import PropTypes from "prop-types";
// UI
import {
  Link,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Divider,
  Spacer,
  Listbox,
  ListboxItem,
  ButtonGroup,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Tabs,
  Tab,
  Input,
  Skeleton,
  Checkbox,
} from "@nextui-org/react";
import { useTheme, styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import ListSubheader from "@mui/material/ListSubheader";
import Popper from "@mui/material/Popper";
import Typography from "@mui/material/Typography";
// Icons
import RemoveIcon from "@mui/icons-material/Remove";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import AddIcon from "@mui/icons-material/Add";
// Utils
import { statusOptions } from "@utils/userData";
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

export default function Page() {
  const {
    isOpen: isCardOpen,
    onOpen: onCardOpen,
    onClose: onCardClose,
  } = useDisclosure();
  const [inputUserValue, setUserInputValue] = React.useState("");
  const [selected, setSelected] = React.useState("login");
  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Spacer x={2} />

      <div className="grid justify-items-center justify-center">
        <div className="grid grid-flow-row-dense grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-2">
          <Card
            isPressable
            disableRipple={true}
            onPress={() => onCardOpen()}
            className="py-4 w-full col-span-2"
          >
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <p className="text-tiny uppercase font-bold">Статистика API</p>
              <h4 className="font-bold text-large">Объем трафика и запросов</h4>
            </CardHeader>
            <Divider className="my-4" />
            <CardBody className="overflow-visible py-2">
              <Skeleton className="rounded-lg">
                <Listbox
                  color="primary"
                  variant="flat"
                  aria-label="Actions"
                  onAction={(key) => alert(key)}
                >
                  <ListboxItem
                    key="new"
                    startContent={<AddIcon className={iconClasses} />}
                  >
                    New card
                  </ListboxItem>
                  <ListboxItem
                    key="copy"
                    startContent={<ChangeCircleIcon className={iconClasses} />}
                  >
                    Change status
                  </ListboxItem>
                  <ListboxItem
                    key="edit"
                    startContent={<EditIcon className={iconClasses} />}
                  >
                    Edit card
                  </ListboxItem>
                  <ListboxItem
                    key="ban"
                    className="text-danger"
                    color="danger"
                    startContent={
                      <RemoveCircleOutlineIcon className={iconClasses} />
                    }
                  >
                    Ban card
                  </ListboxItem>
                  <ListboxItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    startContent={<RemoveIcon className={iconClasses} />}
                  >
                    Delete card
                  </ListboxItem>
                </Listbox>
              </Skeleton>
            </CardBody>
            <Divider className="my-4" />
            <CardFooter>
              <ButtonGroup>
                <Button
                  color="primary"
                  onPress={() => (window.location.href = `/dashboard/cards`)}
                >
                  Вся статистика
                </Button>
                <Button
                  variant="flat"
                  color="primary"
                  onPress={() => onCardOpen()}
                >
                  Панель управления
                </Button>
              </ButtonGroup>
              <Modal
                isDismissable={false}
                size="5xl"
                isOpen={isCardOpen}
                onClose={onCardClose}
                backdrop="blur"
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        Cards
                      </ModalHeader>
                      <ModalBody>
                        <Tabs
                          fullWidth
                          size="md"
                          aria-label="Tabs div"
                          selectedKey={selected}
                          onSelectionChange={setSelected}
                        >
                          <Tab key="new-user" title="User register">
                            <div className="flex flex-col gap-4">
                              <Input
                                isRequired
                                label="Email"
                                placeholder="Enter your email"
                                type="email"
                              />
                              <Input
                                isRequired
                                label="Password"
                                placeholder="Enter your password"
                                type="password"
                              />

                              <div className="flex gap-2 justify-end">
                                <Button fullWidth color="primary">
                                  Login
                                </Button>
                              </div>
                            </div>
                          </Tab>
                          <Tab key="state-change" title="State change">
                            <div className="flex flex-col gap-4 h-[300px]">
                              <Input
                                isRequired
                                label="Name"
                                placeholder="Enter your name"
                                type="password"
                              />
                              <Input
                                isRequired
                                label="Email"
                                placeholder="Enter your email"
                                type="email"
                              />
                              <Input
                                isRequired
                                label="Password"
                                placeholder="Enter your password"
                                type="password"
                              />

                              <div className="flex gap-2 justify-end">
                                <Button fullWidth color="primary">
                                  Sign up
                                </Button>
                              </div>
                            </div>
                          </Tab>
                          <Tab key="edit-user" title="Edit user">
                            <div className="flex flex-col gap-4 h-[300px]">
                              <Input
                                isRequired
                                label="Name"
                                placeholder="Enter your name"
                                type="password"
                              />
                              <Input
                                isRequired
                                label="Email"
                                placeholder="Enter your email"
                                type="email"
                              />
                              <Input
                                isRequired
                                label="Password"
                                placeholder="Enter your password"
                                type="password"
                              />

                              <div className="flex gap-2 justify-end">
                                <Button fullWidth color="primary">
                                  Sign up
                                </Button>
                              </div>
                            </div>
                          </Tab>
                          <Tab key="ban-user" title="Ban user">
                            <div className="flex flex-col gap-4 h-[300px]">
                              <Input
                                isRequired
                                label="Name"
                                placeholder="Enter your name"
                                type="password"
                              />
                              <Input
                                isRequired
                                label="Email"
                                placeholder="Enter your email"
                                type="email"
                              />
                              <Input
                                isRequired
                                label="Password"
                                placeholder="Enter your password"
                                type="password"
                              />

                              <div className="flex gap-2 justify-end">
                                <Button fullWidth color="primary">
                                  Sign up
                                </Button>
                              </div>
                            </div>
                          </Tab>
                          <Tab key="delete-user" title="Delete user">
                            <div className="flex flex-col gap-4 h-[300px]">
                              <Input
                                isRequired
                                label="Name"
                                placeholder="Enter your name"
                                type="password"
                              />
                              <Input
                                isRequired
                                label="Email"
                                placeholder="Enter your email"
                                type="email"
                              />
                              <Input
                                isRequired
                                label="Password"
                                placeholder="Enter your password"
                                type="password"
                              />

                              <div className="flex gap-2 justify-end">
                                <Button fullWidth color="primary">
                                  Sign up
                                </Button>
                              </div>
                            </div>
                          </Tab>
                        </Tabs>
                      </ModalBody>
                      <ModalFooter>
                        <ButtonGroup>
                          <Button
                            color="danger"
                            variant="flat"
                            onPress={onClose}
                          >
                            Close
                          </Button>
                          <Button color="" variant="bordered" onPress={onClose}>
                            Справка
                          </Button>
                        </ButtonGroup>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </CardFooter>
          </Card>
          <Card
            isPressable
            onPress={() => console.log("item pressed")}
            className="py-4 min-w-[300px] col-span-1"
          >
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <p className="text-tiny uppercase font-bold">
                Информация о пользователях
              </p>
              <h4 className="font-bold text-large">
                Количество, последние изменения
              </h4>
            </CardHeader>
            <Divider className="my-4" />
            <CardBody className="overflow-visible py-2">
            <Skeleton className="rounded-lg">
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
              </Skeleton>
            </CardBody>
            <Divider className="my-4" />
            <CardFooter>
            <ButtonGroup>
                <Button
                  color="primary"
                  onPress={() => (window.location.href = `/dashboard/cards`)}
                >
                  Перейти
                </Button>
                <Button
                  variant="flat"
                  color="primary"
                  onPress={() => onCardOpen()}
                >
                  Панель управления
                </Button>
              </ButtonGroup>
            </CardFooter>
          </Card>
          <Card
            isPressable
            onPress={() => console.log("item pressed")}
            className="py-4 min-w-[300px] col-span-1"
          >
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <p className="text-tiny uppercase font-bold">
                Социальные пособия
              </p>
              <h4 className="font-bold text-large">Краткая сводка</h4>
            </CardHeader>
            <Divider className="my-4" />
            <CardBody className="overflow-visible py-2">
            <Skeleton className="rounded-lg">
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
              </Skeleton>
            </CardBody>
            <Divider className="my-4" />
            <CardFooter>
            <ButtonGroup>
                <Button
                  color="primary"
                  onPress={() => (window.location.href = `/dashboard/cards`)}
                >
                  Перейти
                </Button>
                <Button
                  variant="flat"
                  color="primary"
                  onPress={() => onCardOpen()}
                >
                  Панель управления
                </Button>
              </ButtonGroup>
            </CardFooter>
          </Card>
          <Card
            isPressable
            onPress={() => console.log("item pressed")}
            className="py-4 min-w-[300px] col-span-1"
          >
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <p className="text-tiny uppercase font-bold">
                Информация о картах
              </p>
              <h4 className="font-bold text-large">
                Количество, недавние изменения
              </h4>
            </CardHeader>
            <Divider className="my-4" />
            <CardBody className="overflow-visible py-2">
            <Skeleton className="rounded-lg">
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
              </Skeleton>
            </CardBody>
            <Divider className="my-4" />
            <CardFooter>
            <ButtonGroup>
                <Button
                  color="primary"
                  onPress={() => (window.location.href = `/dashboard/cards`)}
                >
                  Перейти
                </Button>
                <Button
                  variant="flat"
                  color="primary"
                  onPress={() => onCardOpen()}
                >
                  Панель управления
                </Button>
              </ButtonGroup>
            </CardFooter>
          </Card>
          <Card
            isPressable
            onPress={() => console.log("item pressed")}
            className="py-4 min-w-[300px] col-span-1"
          >
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <p className="text-tiny uppercase font-bold">
                Статистика транзакций
              </p>
              <h4 className="font-bold text-large">
                Количество, последние замороженные
              </h4>
            </CardHeader>
            <Divider className="my-4" />
            <CardBody className="overflow-visible py-2">
            <Skeleton className="rounded-lg">
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
              </Skeleton>
            </CardBody>
            <Divider className="my-4" />
            <CardFooter>
            <ButtonGroup>
                <Button
                  color="primary"
                  onPress={() => (window.location.href = `/dashboard/cards`)}
                >
                  Перейти
                </Button>
                <Button
                  variant="flat"
                  color="primary"
                  onPress={() => onCardOpen()}
                >
                  Панель управления
                </Button>
              </ButtonGroup>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
