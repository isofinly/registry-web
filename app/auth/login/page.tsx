"use client";
import axios from "axios";
import { useState } from "react";
import {
  Card,
  CardBody,
  Image,
  Button,
  Progress,
  ButtonGroup,
  Spacer,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Skeleton,
} from "@nextui-org/react";

import { Input } from "@nextui-org/react";

import { signIn } from "next-auth/react";
import React, { useRef } from "react";

import { useRouter } from "next/navigation";
import { EyeSlashFilledIcon } from "@/app/components/EyeSlashFilledIcon";
import { EyeFilledIcon } from "@/app/components/EyeFilledIcon";

const LoginPage = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const router = useRouter();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const loginUser = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    signIn("credentials", {
      ...data,
      redirect: false,
    }).then(()=>
      router.push("/dashboard")
      );
    
  };

  return (
    <>
      <div className="grid justify-items-center">
        <Card
          isBlurred
          className="border-none bg-background/60 dark:bg-default-100/50 max-w-[900px] w-[700px] h-fill"
          shadow="sm"
        >
          <CardBody>
            <form className="space-y-6" onSubmit={loginUser}>
              <div className="grid grid-cols-3 gap-6 md:gap-4 items-center justify-center">
                <div className="relative col-span-1 md:col-span-1 grid justify-center">
                  <Skeleton className="rounded-lg">
                  <Image
                    alt="QR"
                    className="object-cover justify-center"
                    height={100}
                    shadow="md"
                    src="/QRdeWP.png"
                    width="100%"
                  />
                  </Skeleton>
                  <Spacer y={2} />
                  <Button color="primary" isLoading className="">
                    Сгенерировать новый QR
                  </Button>
                </div>
                <div className="flex flex-col col-span-2 md:col-span-2">
                  <div className="flex justify-between">
                    <div className="flex flex-col gap-0">
                      <Input
                        variant="bordered"
                        placeholder="Введите ваш ID"
                        label="email"
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={data.email}
                        onChange={(e) => {
                          setData({ ...data, email: e.target.value });
                        }}
                        className="max-w-xs"
                      />
                      <Input
                        label="Пароль"
                        variant="bordered"
                        placeholder="Введите ваш пароль"
                        endContent={
                          <button
                            className="focus:outline-none"
                            type="button"
                            onClick={toggleVisibility}
                          >
                            {isVisible ? (
                              <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            ) : (
                              <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            )}
                          </button>
                        }
                        type={isVisible ? "text" : "password"}
                        value={data.password}
                        onChange={(e) => {
                          setData({ ...data, password: e.target.value });
                        }}
                        className="max-w-xs"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col mt-3 gap-1">
                    <div className="flex justify-between">
                      <ButtonGroup>
                        <Button color="primary" variant="solid" type="submit">
                          Войти
                        </Button>
                      </ButtonGroup>
                      <ButtonGroup>
                        <Button color="danger" variant="solid" onPress={onOpen}>
                          Помощь
                        </Button>
                        <Button
                          color="danger"
                          variant="bordered"
                          onPress={() =>
                            (window.location.href = `/auth/register`)
                          }
                        >
                          Регистрация
                        </Button>
                      </ButtonGroup>
                    </div>
                  </div>
                  <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                      {(onClose) => (
                        <>
                          <ModalHeader className="flex flex-col gap-1">
                            Modal Title
                          </ModalHeader>
                          <ModalBody>
                            <p>
                              Lorem ipsum dolor sit amet, consectetur adipiscing
                              elit. Nullam pulvinar risus non risus hendrerit
                              venenatis. Pellentesque sit amet hendrerit risus,
                              sed porttitor quam.
                            </p>
                            <p>
                              Lorem ipsum dolor sit amet, consectetur adipiscing
                              elit. Nullam pulvinar risus non risus hendrerit
                              venenatis. Pellentesque sit amet hendrerit risus,
                              sed porttitor quam.
                            </p>
                            <p>
                              Magna exercitation reprehenderit magna aute tempor
                              cupidatat consequat elit dolor adipisicing. Mollit
                              dolor eiusmod sunt ex incididunt cillum quis.
                              Velit duis sit officia eiusmod Lorem aliqua enim
                              laboris do dolor eiusmod. Et mollit incididunt
                              nisi consectetur esse laborum eiusmod pariatur
                              proident Lorem eiusmod et. Culpa deserunt nostrud
                              ad veniam.
                            </p>
                          </ModalBody>
                          <ModalFooter>
                            <Button
                              color="danger"
                              variant="light"
                              onPress={onClose}
                            >
                              Close
                            </Button>
                            <Button color="primary" onPress={onClose}>
                              Action
                            </Button>
                          </ModalFooter>
                        </>
                      )}
                    </ModalContent>
                  </Modal>
                </div>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default LoginPage;
