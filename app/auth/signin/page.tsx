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
} from "@nextui-org/react";

import { Input } from "@nextui-org/react";
import { EyeFilledIcon } from "./EyeFilledIcon";
import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon";
import { Spacer } from "@nextui-org/react";

import { signIn } from "next-auth/react";
import React, { useRef } from "react";

const LoginPage = () => {
  const onSubmit = async () => {
    const result = await signIn("credentials", {
      username: userName,
      password: pass,
      redirect: true,
      callbackUrl: "/dashboard",
    });
  };

  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const userName = useRef("");
  const pass = useRef("");

  return (
    <div className="grid justify-items-center">
    <Card
      isBlurred
      className="border-none bg-background/60 dark:bg-default-100/50 max-w-[900px] w-[700px] h-fill"
      shadow="sm"
    >
      <CardBody>
        {/* <form onSubmit={onSubmit} method="POST"> */}
        <div className="grid grid-cols-3 gap-6 md:gap-4 items-center justify-center">
          <div className="relative col-span-1 md:col-span-1 grid justify-center">
            <Image
              alt="QR"
              className="object-cover justify-center"
              height={100}
              shadow="md"
              src="/QRdeWP.png"
              width="100%"
            />
            <Spacer y={2} />
            <Button color="primary" isLoading className="">
              Сгенерировать новый QR
            </Button>
          </div>
          <div className="flex flex-col col-span-2 md:col-span-2">
            <div className="flex justify-between">
              <div className="flex flex-col gap-0">
                <Input
                  isClearable
                  type="text"
                  label="ID"
                  variant="bordered"
                  placeholder="Введите ваш ID"
                  // value={username}
                  // onChange={(e) => setId(e.target.value)}
                  onChange={(e) => (userName.current = e.target.value)}
                  onClear={() => (userName.current = "")}
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
                  // value={password}
                  // onChange={(e) => setPassword(e.target.value)}
                  onChange={(e) => (pass.current = e.target.value)}
                  className="max-w-xs"
                />
              </div>
            </div>
            <div className="flex flex-col mt-3 gap-1">
              <div className="flex justify-between">
                <ButtonGroup>
                  <Button color="primary" variant="solid" onClick={onSubmit}>
                    Войти
                  </Button>
                </ButtonGroup>
                <Button color="danger" variant="solid">
                  Помощь
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* </form> */}
      </CardBody>
    </Card>
    </div>
  );
};

export default LoginPage;
