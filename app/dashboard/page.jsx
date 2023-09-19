"use client";
// Util hooks
import React from "react";
import useSWR from "swr";
import { useEffect, useState } from "react";
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
  Select,
  SelectItem
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
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, isLoading } = useSWR(`/discount.json`, fetcher, {
    keepPreviousData: true,
  });


  const users = React.useMemo(() => data?.results || [], [data]);



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
                    Новая скидка
                  </ListboxItem>
                  <ListboxItem
                    key="copy"
                    startContent={<ChangeCircleIcon className={iconClasses} />}
                  >
                    Change discount
                  </ListboxItem>
                  <ListboxItem
                    key="edit"
                    startContent={<EditIcon className={iconClasses} />}
                  >
                    Edit discount
                  </ListboxItem>
                  <ListboxItem
                    key="ban"
                    className="text-danger"
                    color="danger"
                    startContent={
                      <RemoveCircleOutlineIcon className={iconClasses} />
                    }
                  >
                    Cancel discount
                  </ListboxItem>
                  <ListboxItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    startContent={<RemoveIcon className={iconClasses} />}
                  >
                    Delete discount
                  </ListboxItem>
                </Listbox>
              </Skeleton>
            </CardBody>
            <Divider className="my-4" />
            <CardFooter>
              <ButtonGroup>
                <Button
                  color="primary"
                  onPress={() => (window.location.href = `/dashboard/discount`)}
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
                        Скидки
                      </ModalHeader>
                      <ModalBody>
                        <Tabs
                          fullWidth
                          size="md"
                          aria-label="Tabs div"
                          selectedKey={selected}
                          onSelectionChange={setSelected}
                        >
                          <Tab key="new-discount" title="Создать скидку">
                            <div className="flex flex-col gap-4">
                              <Input
                                isRequired
                                label="Название"
                                placeholder="Введите название скидки"
                                type="text"
                              />
                              <Input
                                isRequired
                                label="Скидка"
                                placeholder="Введите значение без %"
                                type="text"
                              />
                              <Input
                                  isRequired
                                  label="Пол"
                                  placeholder="Введите пол"
                                  type="text"
                              />
                              <Input
                                  isRequired
                                  label="Возраст"
                                  placeholder="Введите возраст"
                                  type="text"
                              />
                              <Input
                                  isRequired
                                  label="Дата активации"
                                  placeholder="Введите дату активации"
                                  type="date"
                              />
                              <Input
                                  isRequired
                                  label="ЕКЖ"
                                  placeholder="Enter "
                                  type="checkbox"
                              />
                              <div className="flex gap-2 justify-end">
                                <Button fullWidth color="primary">
                                  Создать
                                </Button>
                              </div>
                            </div>
                          </Tab>

                          <Tab key="Add-discount" title="Добваить скидку человеку">
                            <div className="flex flex-col gap-4 h-[300px]">
                              <Input
                                isRequired
                                label="Индефикатор человека"
                                placeholder="Введите индефикатор"
                                type="text"
                              />
                              <Input
                                isRequired
                                label="Индефикатор карты"
                                placeholder="Введите индефикатор карты"
                                type="text"
                              />
                              <Select
                                  label="Скидка"
                                  placeholder="Выбрать "
                              >
                                {users.map((user) => (
                                    <SelectItem key={user.name} value={user.name}>
                                      {user.name}
                                    </SelectItem>
                                ))}
                              </Select>


                              <Input
                                isRequired
                                label="Активация скидки"
                                placeholder="Enter "
                                type="date"
                              />

                              <div className="flex gap-2 justify-end">
                                <Button fullWidth color="primary">
                                  Добавить
                                </Button>
                              </div>
                            </div>
                          </Tab>

                          <Tab key="individual-discount" title="Создать индивидуальную скидку">
                            <div className="flex flex-col gap-4 ">
                              <Input
                                  isRequired
                                  label="Индефикатор человека"
                                  placeholder="Введите индефикатор человека"
                                  type="text"
                              />
                              <Input
                                  isRequired
                                  label="Индефикатор карты"
                                  placeholder="Введите индефикатор карты"
                                  type="text"
                              />
                              <Input
                                  isRequired
                                  label="Название"
                                  placeholder="Введите название скидки"
                                  type="text"
                              />
                              <Input
                                  isRequired
                                  label="Скидка"
                                  placeholder="Введите скидку без %"
                                  type="text"
                              />



                              <Input
                                  isRequired
                                  label="Активировать с"
                                  placeholder="Enter "
                                  type="date"
                              />

                              <div className="flex gap-2 justify-end">
                                <Button fullWidth color="primary">
                                  Добавить
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
                            Закрыть
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
                Информация о скидках
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
                Пользователи
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
                Статистика карт
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
