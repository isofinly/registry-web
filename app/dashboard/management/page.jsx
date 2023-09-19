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
  Select,
  SelectItem,
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
import InfoIcon from "@mui/icons-material/Info";
import PublishIcon from "@mui/icons-material/Publish";
import RestoreIcon from "@mui/icons-material/Restore";
// Utils
import { statusOptions as userStatus } from "@utils/userData";
import { statusOptions as cardStatus } from "@utils/cardsData";
import { statusOptions as transactionStatus } from "@utils/transactionData";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const LISTBOX_PADDING = 8; // px

function renderRow(props) {
  const { data, index, style } = props;
  const dataSet = data[index];
  const inlineStyle = {
    ...style,
    top: style.top + LISTBOX_PADDING,
  };

  if (dataSet.hasOwnProperty("group")) {
    return (
      <ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
        {dataSet.group}
      </ListSubheader>
    );
  }

  return (
    <Typography component="li" {...dataSet[0]} noWrap style={inlineStyle}>
      {/* {`#${dataSet[2] + 1} - ${dataSet[1]}`} */}
      {`${dataSet[1]}`}
    </Typography>
  );
}

const OuterElementContext = React.createContext({});

// eslint-disable-next-line react/display-name
const OuterElementType = React.forwardRef((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

// Adapter for react-window
const ListboxComponent = React.forwardRef(function ListboxComponent(
  props,
  ref
) {
  const { children, ...other } = props;
  const itemData = [];
  children.forEach((item) => {
    itemData.push(item);
    itemData.push(...(item.children || []));
  });

  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up("sm"), {
    noSsr: true,
  });
  const itemCount = itemData.length;
  const itemSize = smUp ? 36 : 48;

  const getChildSize = (child) => {
    if (child.hasOwnProperty("group")) {
      return 48;
    }

    return itemSize;
  };

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize;
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

ListboxComponent.propTypes = {
  children: PropTypes.node,
};

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
});

export default function Page() {
  const {
    isOpen: isUsersOpen,
    onOpen: onUsersOpen,
    onClose: onUsersClose,
  } = useDisclosure();
  const {
    isOpen: isCardOpen,
    onOpen: onCardOpen,
    onClose: onCardClose,
  } = useDisclosure();
  const {
    isOpen: isBenefitsOpen,
    onOpen: onBenefitsOpen,
    onClose: onBenefitsClose,
  } = useDisclosure();
  const {
    isOpen: isServicesOpen,
    onOpen: onServicesOpen,
    onClose: onServicesClose,
  } = useDisclosure();
  const {
    isOpen: isTransactionOpen,
    onOpen: onTransactionOpen,
    onClose: onTransactionClose,
  } = useDisclosure();
  const {
    isOpen: isRegistryOpen,
    onOpen: onRegistryOpen,
    onClose: onRegistryClose,
  } = useDisclosure();
  const {
    isOpen: isStatisticsOpen,
    onOpen: onStatisticsOpen,
    onClose: onStatisticsClose,
  } = useDisclosure();

  const [selected, setSelected] = React.useState("login");
  const [gender, setGender] = React.useState("");
  const [dateTime, setDateTime] = useState("");
  const [inputUserValue, setUserInputValue] = React.useState("");
  const [inputCardValue, setCardInputValue] = React.useState("");
  const [inputStatusValue, setStatusInputValue] = React.useState("");
  const [isStatusChangeAllowed, setStatusChangeAllowed] = React.useState(false);
  /* const [data_, setData] = React.useState([]); */

  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  const { data: userData } = useSWR(`/users.json`, fetcher, {
    keepPreviousData: true,
  });
  const { data: cardData } = useSWR(`/cards.json`, fetcher, {
    keepPreviousData: true,
  });
  const { data: transactionData } = useSWR(`/transactionData.json`, fetcher, {
    keepPreviousData: true,
  });

  const users = React.useMemo(
    () => userData?.results || [],
    [userData?.results]
  );
  const cards = React.useMemo(
    () => cardData?.results || [],
    [cardData?.results]
  );
  const transactions = React.useMemo(
    () => transactionData?.results || [],
    [transactionData?.results]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
    /*
    const loaddata = async () => {
      // ...
      // setData()
    }

    loaddata().catch(console.error);
    */
  }, []);

  return (
    <>
      <Spacer x={2} />

      <div className="grid justify-items-center justify-center">
        <div className="grid grid-flow-row-dense xl:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-2">
          <Card
            isPressable
            disableRipple={true}
            onPress={() => onCardOpen()}
            className="py-4 min-w-[300px] col-span-1"
          >
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <p className="text-tiny uppercase font-bold">
                Управление картами
              </p>
              <h4 className="font-bold text-large">Блокировка/разблокировка</h4>
            </CardHeader>
            <Divider className="my-4" />
            <CardBody className="overflow-visible py-2">
              <p className="text-tiny uppercase font-bold">Возможности</p>
              <Listbox color="primary" variant="flat" aria-label="Actions">
                <ListboxItem
                  key="new"
                  startContent={<AddIcon className={iconClasses} />}
                >
                  Добавление
                </ListboxItem>
                <ListboxItem
                  key="copy"
                  startContent={<ChangeCircleIcon className={iconClasses} />}
                >
                  Изменение статус
                </ListboxItem>
                <ListboxItem
                  key="edit"
                  startContent={<EditIcon className={iconClasses} />}
                >
                  Изменение данные
                </ListboxItem>
                <ListboxItem
                  key="info"
                  startContent={<RestoreIcon className={iconClasses} />}
                >
                  История изменений
                </ListboxItem>
                <ListboxItem
                  key="ban"
                  className="text-danger"
                  color="danger"
                  startContent={
                    <RemoveCircleOutlineIcon className={iconClasses} />
                  }
                >
                  Блокировка
                </ListboxItem>
                <ListboxItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  startContent={<RemoveIcon className={iconClasses} />}
                >
                  Удаление
                </ListboxItem>
              </Listbox>
            </CardBody>
            <Divider className="my-4" />
            <CardFooter>
              <ButtonGroup>
                <Button
                  color="primary"
                  onPress={() => (window.location.href = `/dashboard/cards`)}
                >
                  Все карты
                </Button>
                <Button
                  variant="flat"
                  color="primary"
                  onPress={() => onCardOpen()}
                >
                  Меню
                </Button>
              </ButtonGroup>
              <Modal
                isDismissable={false}
                size="5xl"
                isOpen={isCardOpen}
                onClose={onCardClose}
                backdrop="blur"
                scrollBehavior="inside"
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        Карты
                      </ModalHeader>
                      <ModalBody>
                        <Tabs
                          fullWidth
                          size="md"
                          aria-label="Tabs div"
                          selectedKey={selected}
                          onSelectionChange={setSelected}
                        >
                          <Tab key="state-change" title="Изменение статуса">
                            <div className="flex flex-col gap-4 h-[300px]">
                              <Autocomplete
                                id="card-input"
                                sx={{ width: 300 }}
                                disableListWrap
                                inputValue={inputCardValue}
                                onInputChange={(event, newInputValue) => {
                                  setCardInputValue(newInputValue);
                                }}
                                PopperComponent={StyledPopper}
                                ListboxComponent={ListboxComponent}
                                options={cards.map(
                                  (card) =>
                                    "Номер: " +
                                    card.card_number +
                                    " | " +
                                    card.status
                                )}
                                // groupBy={(option) => option[0].toUpperCase()}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Карта ..."
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: "50px",

                                        legend: {
                                          marginLeft: "30px",
                                        },
                                      },
                                      "& .MuiAutocomplete-inputRoot": {
                                        paddingLeft: "20px !important",
                                        borderRadius: "12px",
                                      },
                                      "& .MuiInputLabel-outlined": {
                                        paddingLeft: "20px",
                                      },
                                      "& .MuiInputLabel-shrink": {
                                        marginLeft: "20px",
                                        paddingLeft: "10px",
                                        paddingRight: 0,
                                        background: "white",
                                      },
                                    }}
                                  />
                                )}
                                renderOption={(props, option, state) => [
                                  props,
                                  option,
                                  state.index,
                                ]}
                                // TODO: Post React 18 update - validate this conversion, look like a hidden bug
                                renderGroup={(params) => params}
                              />
                              <Autocomplete
                                id="status-input"
                                sx={{ width: 300 }}
                                disableListWrap
                                inputValue={inputStatusValue}
                                onInputChange={(event, newInputValue) => {
                                  setStatusInputValue(newInputValue);
                                }}
                                PopperComponent={StyledPopper}
                                ListboxComponent={ListboxComponent}
                                options={cardStatus.map(
                                  (status) => "Статус: " + status.name
                                )}
                                // groupBy={(option) => option[0].toUpperCase()}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Статус ..."
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: "50px",

                                        legend: {
                                          marginLeft: "30px",
                                        },
                                      },
                                      "& .MuiAutocomplete-inputRoot": {
                                        paddingLeft: "20px !important",
                                        borderRadius: "12px",
                                      },
                                      "& .MuiInputLabel-outlined": {
                                        paddingLeft: "20px",
                                      },
                                      "& .MuiInputLabel-shrink": {
                                        marginLeft: "20px",
                                        paddingLeft: "10px",
                                        paddingRight: 0,
                                        background: "white",
                                      },
                                    }}
                                  />
                                )}
                                renderOption={(props, option, state) => [
                                  props,
                                  option,
                                  state.index,
                                ]}
                                // TODO: Post React 18 update - validate this conversion, look like a hidden bug
                                renderGroup={(params) => params}
                              />
                              <div className="flex gap-2 justify-end">
                                <Button fullWidth color="primary">
                                  Изменить статус
                                </Button>
                                <Checkbox
                                  isSelected={isStatusChangeAllowed}
                                  onValueChange={setStatusChangeAllowed}
                                  color="danger"
                                >
                                  Подтвердить
                                </Checkbox>
                              </div>
                            </div>
                          </Tab>
                          <Tab key="new-card" title="Регистрация">
                            <div className="flex flex-col gap-4">
                              <Input
                                isRequired
                                label="Номер карты"
                                placeholder="Введите номер карты"
                                type="text"
                              />
                              <Input
                                isRequired
                                label="Пользователь"
                                placeholder="Введите id пользователя"
                                type="number"
                              />
                              <Autocomplete
                                id="card-status-input"
                                sx={{ width: 300 }}
                                disableListWrap
                                inputValue={inputStatusValue}
                                onInputChange={(event, newInputValue) => {
                                  setStatusInputValue(newInputValue);
                                }}
                                PopperComponent={StyledPopper}
                                ListboxComponent={ListboxComponent}
                                options={cardStatus.map(
                                  (status) => "Статус: " + status.name
                                )}
                                // groupBy={(option) => option[0].toUpperCase()}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Статус ..."
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: "50px",

                                        legend: {
                                          marginLeft: "30px",
                                        },
                                      },
                                      "& .MuiAutocomplete-inputRoot": {
                                        paddingLeft: "20px !important",
                                        borderRadius: "12px",
                                      },
                                      "& .MuiInputLabel-outlined": {
                                        paddingLeft: "20px",
                                      },
                                      "& .MuiInputLabel-shrink": {
                                        marginLeft: "20px",
                                        paddingLeft: "10px",
                                        paddingRight: 0,
                                        background: "white",
                                      },
                                    }}
                                  />
                                )}
                                renderOption={(props, option, state) => [
                                  props,
                                  option,
                                  state.index,
                                ]}
                                // TODO: Post React 18 update - validate this conversion, look like a hidden bug
                                renderGroup={(params) => params}
                              />
                              <Input
                                isRequired
                                label="ID карты"
                                placeholder="ID карты"
                                type="number"
                              />
                              <div className="flex gap-2 justify-end">
                                <Button fullWidth color="primary">
                                  Зарегистрировать
                                </Button>
                                <Checkbox
                                  isSelected={isStatusChangeAllowed}
                                  onValueChange={setStatusChangeAllowed}
                                  color="danger"
                                >
                                  Подтвердить
                                </Checkbox>
                              </div>
                            </div>
                          </Tab>
                          <Tab key="changes-history" title="История изменений">
                            <div className="flex flex-col gap-4 h-[300px]">
                              <Autocomplete
                                id="card-input"
                                sx={{ width: 300 }}
                                disableListWrap
                                inputValue={inputUserValue}
                                onInputChange={(event, newInputValue) => {
                                  setUserInputValue(newInputValue);
                                }}
                                PopperComponent={StyledPopper}
                                ListboxComponent={ListboxComponent}
                                options={cards.map(
                                  (card) =>
                                    "ID: " + card.id + " | " + card.card_number
                                )}
                                // groupBy={(option) => option[0].toUpperCase()}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Карта ..."
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: "50px",

                                        legend: {
                                          marginLeft: "30px",
                                        },
                                      },
                                      "& .MuiAutocomplete-inputRoot": {
                                        paddingLeft: "20px !important",
                                        borderRadius: "12px",
                                      },
                                      "& .MuiInputLabel-outlined": {
                                        paddingLeft: "20px",
                                      },
                                      "& .MuiInputLabel-shrink": {
                                        marginLeft: "20px",
                                        paddingLeft: "10px",
                                        paddingRight: 0,
                                        background: "white",
                                      },
                                    }}
                                  />
                                )}
                                renderOption={(props, option, state) => [
                                  props,
                                  option,
                                  state.index,
                                ]}
                                // TODO: Post React 18 update - validate this conversion, look like a hidden bug
                                renderGroup={(params) => params}
                              />
                            </div>
                          </Tab>
                          <Tab key="edit-user" title="Изменение данных">
                            <div className="flex flex-col gap-4 h-[300px]">
                              <Autocomplete
                                id="card-input"
                                sx={{ width: 300 }}
                                disableListWrap
                                inputValue={inputUserValue}
                                onInputChange={(event, newInputValue) => {
                                  setUserInputValue(newInputValue);
                                }}
                                PopperComponent={StyledPopper}
                                ListboxComponent={ListboxComponent}
                                options={cards.map(
                                  (card) =>
                                    "ID: " + card.id + " | " + card.card_number
                                )}
                                // groupBy={(option) => option[0].toUpperCase()}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Карта ..."
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: "50px",

                                        legend: {
                                          marginLeft: "30px",
                                        },
                                      },
                                      "& .MuiAutocomplete-inputRoot": {
                                        paddingLeft: "20px !important",
                                        borderRadius: "12px",
                                      },
                                      "& .MuiInputLabel-outlined": {
                                        paddingLeft: "20px",
                                      },
                                      "& .MuiInputLabel-shrink": {
                                        marginLeft: "20px",
                                        paddingLeft: "10px",
                                        paddingRight: 0,
                                        background: "white",
                                      },
                                    }}
                                  />
                                )}
                                renderOption={(props, option, state) => [
                                  props,
                                  option,
                                  state.index,
                                ]}
                                // TODO: Post React 18 update - validate this conversion, look like a hidden bug
                                renderGroup={(params) => params}
                              />
                              <Input
                                isRequired
                                label="Номер карты"
                                placeholder="Введите номер карты"
                                type="text"
                              />
                              <Input
                                isRequired
                                label="Пользователь"
                                placeholder="Введите id пользователя"
                                type="number"
                              />
                              <Autocomplete
                                id="card-status-input"
                                sx={{ width: 300 }}
                                disableListWrap
                                inputValue={inputStatusValue}
                                onInputChange={(event, newInputValue) => {
                                  setStatusInputValue(newInputValue);
                                }}
                                PopperComponent={StyledPopper}
                                ListboxComponent={ListboxComponent}
                                options={cardStatus.map(
                                  (status) => "Статус: " + status.name
                                )}
                                // groupBy={(option) => option[0].toUpperCase()}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Статус ..."
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: "50px",

                                        legend: {
                                          marginLeft: "30px",
                                        },
                                      },
                                      "& .MuiAutocomplete-inputRoot": {
                                        paddingLeft: "20px !important",
                                        borderRadius: "12px",
                                      },
                                      "& .MuiInputLabel-outlined": {
                                        paddingLeft: "20px",
                                      },
                                      "& .MuiInputLabel-shrink": {
                                        marginLeft: "20px",
                                        paddingLeft: "10px",
                                        paddingRight: 0,
                                        background: "white",
                                      },
                                    }}
                                  />
                                )}
                                renderOption={(props, option, state) => [
                                  props,
                                  option,
                                  state.index,
                                ]}
                                // TODO: Post React 18 update - validate this conversion, look like a hidden bug
                                renderGroup={(params) => params}
                              />
                              <Input
                                isRequired
                                label="ID карты"
                                placeholder="ID карты"
                                type="number"
                              />

                              <div className="flex gap-2 justify-end">
                                <Button fullWidth color="warning">
                                  Изменить
                                </Button>
                                <Checkbox
                                  isSelected={isStatusChangeAllowed}
                                  onValueChange={setStatusChangeAllowed}
                                  color="danger"
                                >
                                  Подтвердить
                                </Checkbox>
                              </div>
                            </div>
                          </Tab>
                          <Tab key="ban-card" title="Блокировка">
                            <div className="flex flex-col gap-4 h-[300px]">
                              <Autocomplete
                                id="card-input"
                                sx={{ width: 300 }}
                                disableListWrap
                                inputValue={inputUserValue}
                                onInputChange={(event, newInputValue) => {
                                  setUserInputValue(newInputValue);
                                }}
                                PopperComponent={StyledPopper}
                                ListboxComponent={ListboxComponent}
                                options={cards.map(
                                  (card) =>
                                    "ID: " + card.id + " | " + card.card_number
                                )}
                                // groupBy={(option) => option[0].toUpperCase()}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Карта ..."
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: "50px",

                                        legend: {
                                          marginLeft: "30px",
                                        },
                                      },
                                      "& .MuiAutocomplete-inputRoot": {
                                        paddingLeft: "20px !important",
                                        borderRadius: "12px",
                                      },
                                      "& .MuiInputLabel-outlined": {
                                        paddingLeft: "20px",
                                      },
                                      "& .MuiInputLabel-shrink": {
                                        marginLeft: "20px",
                                        paddingLeft: "10px",
                                        paddingRight: 0,
                                        background: "white",
                                      },
                                    }}
                                  />
                                )}
                                renderOption={(props, option, state) => [
                                  props,
                                  option,
                                  state.index,
                                ]}
                                // TODO: Post React 18 update - validate this conversion, look like a hidden bug
                                renderGroup={(params) => params}
                              />
                              <div className="flex gap-2 justify-end">
                                <Button fullWidth color="danger">
                                  Забанить
                                </Button>
                                <Checkbox
                                  isSelected={isStatusChangeAllowed}
                                  onValueChange={setStatusChangeAllowed}
                                  color="danger"
                                >
                                  Подтвердить
                                </Checkbox>
                              </div>
                            </div>
                          </Tab>
                          <Tab key="delete-user" title="Удаление">
                            <div className="flex flex-col gap-4 h-[300px]">
                              <Autocomplete
                                id="card-input"
                                sx={{ width: 300 }}
                                disableListWrap
                                inputValue={inputUserValue}
                                onInputChange={(event, newInputValue) => {
                                  setUserInputValue(newInputValue);
                                }}
                                PopperComponent={StyledPopper}
                                ListboxComponent={ListboxComponent}
                                options={cards.map(
                                  (card) =>
                                    "ID: " + card.id + " | " + card.card_number
                                )}
                                // groupBy={(option) => option[0].toUpperCase()}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Карта ..."
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: "50px",

                                        legend: {
                                          marginLeft: "30px",
                                        },
                                      },
                                      "& .MuiAutocomplete-inputRoot": {
                                        paddingLeft: "20px !important",
                                        borderRadius: "12px",
                                      },
                                      "& .MuiInputLabel-outlined": {
                                        paddingLeft: "20px",
                                      },
                                      "& .MuiInputLabel-shrink": {
                                        marginLeft: "20px",
                                        paddingLeft: "10px",
                                        paddingRight: 0,
                                        background: "white",
                                      },
                                    }}
                                  />
                                )}
                                renderOption={(props, option, state) => [
                                  props,
                                  option,
                                  state.index,
                                ]}
                                // TODO: Post React 18 update - validate this conversion, look like a hidden bug
                                renderGroup={(params) => params}
                              />
                              <div className="flex gap-2 justify-end">
                                <Button fullWidth color="danger">
                                  Удалить
                                </Button>
                                <Checkbox
                                  isSelected={isStatusChangeAllowed}
                                  onValueChange={setStatusChangeAllowed}
                                  color="danger"
                                >
                                  Подтвердить
                                </Checkbox>
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
            disableRipple={true}
            onPress={() => onUsersOpen()}
            className="py-4 min-w-[300px] col-span-1"
          >
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <p className="text-tiny uppercase font-bold">Пользователи</p>
              <h4 className="font-bold text-large">Блокировка/разблокировка</h4>
            </CardHeader>
            <Divider className="my-4" />
            <CardBody className="overflow-visible py-2">
              <p className="text-tiny uppercase font-bold">Возможности</p>
              <Listbox
                color="primary"
                variant="flat"
                aria-label="Actions"
                disableAnimation={true}
              >
                <ListboxItem
                  key="new"
                  startContent={<AddIcon className={iconClasses} />}
                >
                  Добавление
                </ListboxItem>
                <ListboxItem
                  key="copy"
                  startContent={<ChangeCircleIcon className={iconClasses} />}
                >
                  Изменение статуса
                </ListboxItem>
                <ListboxItem
                  key="edit"
                  startContent={<EditIcon className={iconClasses} />}
                >
                  Изменение полей
                </ListboxItem>
                <ListboxItem
                  key="ban"
                  className="text-danger"
                  color="danger"
                  startContent={
                    <RemoveCircleOutlineIcon className={iconClasses} />
                  }
                >
                  Блокировка
                </ListboxItem>
                <ListboxItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  startContent={<RemoveIcon className={iconClasses} />}
                >
                  Удаление
                </ListboxItem>
              </Listbox>
            </CardBody>
            <Divider className="my-4" />
            <CardFooter>
              <ButtonGroup>
                <Button
                  color="primary"
                  onPress={() => (window.location.href = `/dashboard/users`)}
                >
                  Все пользователи
                </Button>
                <Button
                  variant="flat"
                  color="primary"
                  onPress={() => onUsersOpen()}
                >
                  Меню
                </Button>
              </ButtonGroup>
              <Modal
                isDismissable={false}
                size="5xl"
                isOpen={isUsersOpen}
                onClose={onUsersClose}
                backdrop="blur"
                scrollBehavior="inside"
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        Пользователи
                      </ModalHeader>
                      <ModalBody>
                        <Tabs
                          fullWidth
                          size="md"
                          aria-label="Tabs div"
                          selectedKey={selected}
                          onSelectionChange={setSelected}
                        >
                          <Tab key="state-change" title="Изменеие статуса">
                            <div className="flex flex-col gap-4 h-[300px]">
                              <Autocomplete
                                id="user-input"
                                sx={{ width: 300 }}
                                disableListWrap
                                inputValue={inputUserValue}
                                onInputChange={(event, newInputValue) => {
                                  setUserInputValue(newInputValue);
                                }}
                                PopperComponent={StyledPopper}
                                ListboxComponent={ListboxComponent}
                                options={users.map(
                                  (user) =>
                                    "ID: " +
                                    user.id +
                                    " | " +
                                    user.first_name +
                                    " " +
                                    user.middle_name +
                                    " " +
                                    user.last_name
                                )}
                                // groupBy={(option) => option[0].toUpperCase()}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Пользователь ..."
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: "50px",

                                        legend: {
                                          marginLeft: "30px",
                                        },
                                      },
                                      "& .MuiAutocomplete-inputRoot": {
                                        paddingLeft: "20px !important",
                                        borderRadius: "12px",
                                      },
                                      "& .MuiInputLabel-outlined": {
                                        paddingLeft: "20px",
                                      },
                                      "& .MuiInputLabel-shrink": {
                                        marginLeft: "20px",
                                        paddingLeft: "10px",
                                        paddingRight: 0,
                                        background: "white",
                                      },
                                    }}
                                  />
                                )}
                                renderOption={(props, option, state) => [
                                  props,
                                  option,
                                  state.index,
                                ]}
                                // TODO: Post React 18 update - validate this conversion, look like a hidden bug
                                renderGroup={(params) => params}
                              />
                              <Autocomplete
                                id="status-input"
                                sx={{ width: 300 }}
                                disableListWrap
                                inputValue={inputStatusValue}
                                onInputChange={(event, newInputValue) => {
                                  setStatusInputValue(newInputValue);
                                }}
                                PopperComponent={StyledPopper}
                                ListboxComponent={ListboxComponent}
                                options={userStatus.map(
                                  (status) => "Статус: " + status.name
                                )}
                                // groupBy={(option) => option[0].toUpperCase()}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Статус ..."
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: "50px",

                                        legend: {
                                          marginLeft: "30px",
                                        },
                                      },
                                      "& .MuiAutocomplete-inputRoot": {
                                        paddingLeft: "20px !important",
                                        borderRadius: "12px",
                                      },
                                      "& .MuiInputLabel-outlined": {
                                        paddingLeft: "20px",
                                      },
                                      "& .MuiInputLabel-shrink": {
                                        marginLeft: "20px",
                                        paddingLeft: "10px",
                                        paddingRight: 0,
                                        background: "white",
                                      },
                                    }}
                                  />
                                )}
                                renderOption={(props, option, state) => [
                                  props,
                                  option,
                                  state.index,
                                ]}
                                // TODO: Post React 18 update - validate this conversion, look like a hidden bug
                                renderGroup={(params) => params}
                              />
                              <div className="flex gap-2 justify-end">
                                <Button fullWidth color="primary">
                                  Изменить статус
                                </Button>
                                <Checkbox
                                  isSelected={isStatusChangeAllowed}
                                  onValueChange={setStatusChangeAllowed}
                                  color="danger"
                                >
                                  Подтвердить
                                </Checkbox>
                              </div>
                            </div>
                          </Tab>
                          <Tab key="new-user" title="Регистрация">
                            <div className="flex flex-col gap-4">
                              <Input
                                isRequired
                                label="Имя"
                                placeholder="Введите имя"
                                type="text"
                              />
                              <Input
                                isRequired
                                label="Фамилия"
                                placeholder="Введите фамилию"
                                type="text"
                              />
                              <Input
                                isRequired
                                label="Отчество"
                                placeholder="Введите отчество"
                                type="text"
                              />
                              <Select
                                label="Пол"
                                variant="bordered"
                                placeholder="Выберите пол"
                                selectedKeys={gender}
                                className="max-w-xs"
                                onSelectionChange={setGender}
                              >
                                <SelectItem key="m" value="male">
                                  Мужской
                                </SelectItem>
                                <SelectItem key="f" value="female">
                                  Женский
                                </SelectItem>
                              </Select>
                              <Input
                                isRequired
                                label="Email"
                                placeholder="Email"
                                type="email"
                              />
                              <Input
                                isRequired
                                label="Дата рождения"
                                placeholder="Email"
                                type="date"
                              />
                              <Input
                                isRequired
                                label="СНИЛС"
                                placeholder="СНИЛС"
                                type="text"
                              />
                              <Input
                                isRequired
                                label="Город"
                                placeholder="город"
                                type="text"
                              />
                              <Autocomplete
                                id="status-input"
                                sx={{ width: 300 }}
                                disableListWrap
                                inputValue={inputStatusValue}
                                onInputChange={(event, newInputValue) => {
                                  setStatusInputValue(newInputValue);
                                }}
                                PopperComponent={StyledPopper}
                                ListboxComponent={ListboxComponent}
                                options={userStatus.map(
                                  (status) => "Статус: " + status.name
                                )}
                                // groupBy={(option) => option[0].toUpperCase()}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Статус ..."
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: "50px",

                                        legend: {
                                          marginLeft: "30px",
                                        },
                                      },
                                      "& .MuiAutocomplete-inputRoot": {
                                        paddingLeft: "20px !important",
                                        borderRadius: "12px",
                                      },
                                      "& .MuiInputLabel-outlined": {
                                        paddingLeft: "20px",
                                      },
                                      "& .MuiInputLabel-shrink": {
                                        marginLeft: "20px",
                                        paddingLeft: "10px",
                                        paddingRight: 0,
                                        background: "white",
                                      },
                                    }}
                                  />
                                )}
                                renderOption={(props, option, state) => [
                                  props,
                                  option,
                                  state.index,
                                ]}
                                // TODO: Post React 18 update - validate this conversion, look like a hidden bug
                                renderGroup={(params) => params}
                              />
                              <Input
                                isRequired
                                label="ID карты"
                                placeholder="ID карты"
                                type="number"
                              />
                              <div className="flex gap-2 justify-end">
                                <Button fullWidth color="primary">
                                  Зарегистрировать
                                </Button>
                                <Checkbox
                                  isSelected={isStatusChangeAllowed}
                                  onValueChange={setStatusChangeAllowed}
                                  color="danger"
                                >
                                  Подтвердить
                                </Checkbox>
                              </div>
                            </div>
                          </Tab>

                          <Tab key="edit-user" title="Изменение данных">
                            <div className="flex flex-col gap-4 h-[300px]">
                              <Autocomplete
                                id="user-input"
                                sx={{ width: 300 }}
                                disableListWrap
                                inputValue={inputUserValue}
                                onInputChange={(event, newInputValue) => {
                                  setUserInputValue(newInputValue);
                                }}
                                PopperComponent={StyledPopper}
                                ListboxComponent={ListboxComponent}
                                options={users.map(
                                  (user) =>
                                    "ID: " +
                                    user.id +
                                    " | " +
                                    user.first_name +
                                    " " +
                                    user.middle_name +
                                    " " +
                                    user.last_name
                                )}
                                // groupBy={(option) => option[0].toUpperCase()}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Пользователь ..."
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: "50px",

                                        legend: {
                                          marginLeft: "30px",
                                        },
                                      },
                                      "& .MuiAutocomplete-inputRoot": {
                                        paddingLeft: "20px !important",
                                        borderRadius: "12px",
                                      },
                                      "& .MuiInputLabel-outlined": {
                                        paddingLeft: "20px",
                                      },
                                      "& .MuiInputLabel-shrink": {
                                        marginLeft: "20px",
                                        paddingLeft: "10px",
                                        paddingRight: 0,
                                        background: "white",
                                      },
                                    }}
                                  />
                                )}
                                renderOption={(props, option, state) => [
                                  props,
                                  option,
                                  state.index,
                                ]}
                                // TODO: Post React 18 update - validate this conversion, look like a hidden bug
                                renderGroup={(params) => params}
                              />
                              <Input
                                isRequired
                                label="Имя"
                                placeholder="Введите имя"
                                type="text"
                              />
                              <Input
                                isRequired
                                label="Фамилия"
                                placeholder="Введите фамилию"
                                type="text"
                              />
                              <Input
                                isRequired
                                label="Отчество"
                                placeholder="Введите отчество"
                                type="text"
                              />
                              <Select
                                label="Пол"
                                variant="bordered"
                                placeholder="Выберите пол"
                                selectedKeys={gender}
                                className="max-w-xs"
                                onSelectionChange={setGender}
                              >
                                <SelectItem key="m" value="male">
                                  Мужской
                                </SelectItem>
                                <SelectItem key="f" value="female">
                                  Женский
                                </SelectItem>
                              </Select>
                              <Input
                                isRequired
                                label="Email"
                                placeholder="Email"
                                type="email"
                              />
                              <Input
                                isRequired
                                label="Дата рождения"
                                placeholder="Email"
                                type="date"
                              />
                              <Input
                                isRequired
                                label="СНИЛС"
                                placeholder="СНИЛС"
                                type="text"
                              />
                              <Input
                                isRequired
                                label="Город"
                                placeholder="город"
                                type="text"
                              />
                              <Autocomplete
                                id="status-input"
                                sx={{ width: 300 }}
                                disableListWrap
                                inputValue={inputStatusValue}
                                onInputChange={(event, newInputValue) => {
                                  setStatusInputValue(newInputValue);
                                }}
                                PopperComponent={StyledPopper}
                                ListboxComponent={ListboxComponent}
                                options={userStatus.map(
                                  (status) => "Статус: " + status.name
                                )}
                                // groupBy={(option) => option[0].toUpperCase()}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Статус ..."
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: "50px",

                                        legend: {
                                          marginLeft: "30px",
                                        },
                                      },
                                      "& .MuiAutocomplete-inputRoot": {
                                        paddingLeft: "20px !important",
                                        borderRadius: "12px",
                                      },
                                      "& .MuiInputLabel-outlined": {
                                        paddingLeft: "20px",
                                      },
                                      "& .MuiInputLabel-shrink": {
                                        marginLeft: "20px",
                                        paddingLeft: "10px",
                                        paddingRight: 0,
                                        background: "white",
                                      },
                                    }}
                                  />
                                )}
                                renderOption={(props, option, state) => [
                                  props,
                                  option,
                                  state.index,
                                ]}
                                // TODO: Post React 18 update - validate this conversion, look like a hidden bug
                                renderGroup={(params) => params}
                              />
                              <Input
                                isRequired
                                label="ID карты"
                                placeholder="ID карты"
                                type="number"
                              />

                              <div className="flex gap-2 justify-end">
                                <Button fullWidth color="warning">
                                  Изменить
                                </Button>
                                <Checkbox
                                  isSelected={isStatusChangeAllowed}
                                  onValueChange={setStatusChangeAllowed}
                                  color="danger"
                                >
                                  Подтвердить
                                </Checkbox>
                              </div>
                            </div>
                          </Tab>
                          <Tab key="ban-user" title="Блокировка">
                            <div className="flex flex-col gap-4 h-[300px]">
                              <Autocomplete
                                id="user-input"
                                sx={{ width: 300 }}
                                disableListWrap
                                inputValue={inputUserValue}
                                onInputChange={(event, newInputValue) => {
                                  setUserInputValue(newInputValue);
                                }}
                                PopperComponent={StyledPopper}
                                ListboxComponent={ListboxComponent}
                                options={users.map(
                                  (user) =>
                                    "ID: " +
                                    user.id +
                                    " | " +
                                    user.first_name +
                                    " " +
                                    user.middle_name +
                                    " " +
                                    user.last_name
                                )}
                                // groupBy={(option) => option[0].toUpperCase()}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Пользователь ..."
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: "50px",

                                        legend: {
                                          marginLeft: "30px",
                                        },
                                      },
                                      "& .MuiAutocomplete-inputRoot": {
                                        paddingLeft: "20px !important",
                                        borderRadius: "12px",
                                      },
                                      "& .MuiInputLabel-outlined": {
                                        paddingLeft: "20px",
                                      },
                                      "& .MuiInputLabel-shrink": {
                                        marginLeft: "20px",
                                        paddingLeft: "10px",
                                        paddingRight: 0,
                                        background: "white",
                                      },
                                    }}
                                  />
                                )}
                                renderOption={(props, option, state) => [
                                  props,
                                  option,
                                  state.index,
                                ]}
                                // TODO: Post React 18 update - validate this conversion, look like a hidden bug
                                renderGroup={(params) => params}
                              />
                              <div className="flex gap-2 justify-end">
                                <Button fullWidth color="danger">
                                  Забанить
                                </Button>
                                <Checkbox
                                  isSelected={isStatusChangeAllowed}
                                  onValueChange={setStatusChangeAllowed}
                                  color="danger"
                                >
                                  Подтвердить
                                </Checkbox>
                              </div>
                            </div>
                          </Tab>
                          <Tab key="delete-user" title="Удаление">
                            <div className="flex flex-col gap-4 h-[300px]">
                              <Autocomplete
                                id="user-input"
                                sx={{ width: 300 }}
                                disableListWrap
                                inputValue={inputUserValue}
                                onInputChange={(event, newInputValue) => {
                                  setUserInputValue(newInputValue);
                                }}
                                PopperComponent={StyledPopper}
                                ListboxComponent={ListboxComponent}
                                options={users.map(
                                  (user) =>
                                    "ID: " +
                                    user.id +
                                    " | " +
                                    user.first_name +
                                    " " +
                                    user.middle_name +
                                    " " +
                                    user.last_name
                                )}
                                // groupBy={(option) => option[0].toUpperCase()}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Пользователь ..."
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: "50px",

                                        legend: {
                                          marginLeft: "30px",
                                        },
                                      },
                                      "& .MuiAutocomplete-inputRoot": {
                                        paddingLeft: "20px !important",
                                        borderRadius: "12px",
                                      },
                                      "& .MuiInputLabel-outlined": {
                                        paddingLeft: "20px",
                                      },
                                      "& .MuiInputLabel-shrink": {
                                        marginLeft: "20px",
                                        paddingLeft: "10px",
                                        paddingRight: 0,
                                        background: "white",
                                      },
                                    }}
                                  />
                                )}
                                renderOption={(props, option, state) => [
                                  props,
                                  option,
                                  state.index,
                                ]}
                                // TODO: Post React 18 update - validate this conversion, look like a hidden bug
                                renderGroup={(params) => params}
                              />
                              <div className="flex gap-2 justify-end">
                                <Button fullWidth color="danger">
                                  Удалить
                                </Button>
                                <Checkbox
                                  isSelected={isStatusChangeAllowed}
                                  onValueChange={setStatusChangeAllowed}
                                  color="danger"
                                >
                                  Подтвердить
                                </Checkbox>
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
            disableRipple={true}
            onPress={() => onTransactionOpen()}
            className="py-4 min-w-[300px] col-span-1"
          >
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <p className="text-tiny uppercase font-bold">
                Управление транзакциями
              </p>
              <h4 className="font-bold text-large">Разморозка/заморозка</h4>
            </CardHeader>
            <Divider className="my-4" />
            <CardBody className="overflow-visible py-2">
              <p className="text-tiny uppercase font-bold">Возможности</p>
              <Listbox color="primary" variant="flat" aria-label="Actions">
                <ListboxItem
                  key="copy"
                  startContent={<ChangeCircleIcon className={iconClasses} />}
                >
                  Изменить статус
                </ListboxItem>
                <ListboxItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  startContent={
                    <RemoveCircleOutlineIcon className={iconClasses} />
                  }
                >
                  Блокировка
                </ListboxItem>
              </Listbox>
            </CardBody>
            <Divider className="my-4" />
            <CardFooter>
              <ButtonGroup>
                <Button
                  color="primary"
                  onPress={() =>
                    (window.location.href = `/dashboard/transactions`)
                  }
                >
                  Все транзакции
                </Button>
                <Button
                  variant="flat"
                  color="primary"
                  onPress={() => onTransactionOpen()}
                >
                  Меню
                </Button>
              </ButtonGroup>
              <Modal
                isDismissable={false}
                size="5xl"
                isOpen={isTransactionOpen}
                onClose={onTransactionClose}
                backdrop="blur"
                scrollBehavior="inside"
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        Транзакция
                      </ModalHeader>
                      <ModalBody>
                        <Tabs
                          fullWidth
                          size="md"
                          aria-label="Tabs div"
                          selectedKey={selected}
                          onSelectionChange={setSelected}
                        >
                          <Tab
                            key="transaction-state-change"
                            title="Изменение статуса"
                          >
                            <div className="flex flex-col gap-4 h-[300px]">
                              <Autocomplete
                                id="transaction-input"
                                sx={{ width: 300 }}
                                disableListWrap
                                inputValue={inputCardValue}
                                onInputChange={(event, newInputValue) => {
                                  setCardInputValue(newInputValue);
                                }}
                                PopperComponent={StyledPopper}
                                ListboxComponent={ListboxComponent}
                                options={transactions.map(
                                  (transaction) =>
                                    "Номер: " +
                                    transaction.id +
                                    " | " +
                                    transaction.time
                                )}
                                // groupBy={(option) => option[0].toUpperCase()}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Транзакция ..."
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: "50px",

                                        legend: {
                                          marginLeft: "30px",
                                        },
                                      },
                                      "& .MuiAutocomplete-inputRoot": {
                                        paddingLeft: "20px !important",
                                        borderRadius: "12px",
                                      },
                                      "& .MuiInputLabel-outlined": {
                                        paddingLeft: "20px",
                                      },
                                      "& .MuiInputLabel-shrink": {
                                        marginLeft: "20px",
                                        paddingLeft: "10px",
                                        paddingRight: 0,
                                        background: "white",
                                      },
                                    }}
                                  />
                                )}
                                renderOption={(props, option, state) => [
                                  props,
                                  option,
                                  state.index,
                                ]}
                                // TODO: Post React 18 update - validate this conversion, look like a hidden bug
                                renderGroup={(params) => params}
                              />
                              <Autocomplete
                                id="transaction-status-input"
                                sx={{ width: 300 }}
                                disableListWrap
                                inputValue={inputStatusValue}
                                onInputChange={(event, newInputValue) => {
                                  setStatusInputValue(newInputValue);
                                }}
                                PopperComponent={StyledPopper}
                                ListboxComponent={ListboxComponent}
                                options={transactionStatus.map(
                                  (status) => "Статус: " + status.name
                                )}
                                // groupBy={(option) => option[0].toUpperCase()}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Статус ..."
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: "50px",

                                        legend: {
                                          marginLeft: "30px",
                                        },
                                      },
                                      "& .MuiAutocomplete-inputRoot": {
                                        paddingLeft: "20px !important",
                                        borderRadius: "12px",
                                      },
                                      "& .MuiInputLabel-outlined": {
                                        paddingLeft: "20px",
                                      },
                                      "& .MuiInputLabel-shrink": {
                                        marginLeft: "20px",
                                        paddingLeft: "10px",
                                        paddingRight: 0,
                                        background: "white",
                                      },
                                    }}
                                  />
                                )}
                                renderOption={(props, option, state) => [
                                  props,
                                  option,
                                  state.index,
                                ]}
                                // TODO: Post React 18 update - validate this conversion, look like a hidden bug
                                renderGroup={(params) => params}
                              />
                              <div className="flex gap-2 justify-end">
                                <Button fullWidth color="primary">
                                  Изменить статус
                                </Button>
                                <Checkbox
                                  isSelected={isStatusChangeAllowed}
                                  onValueChange={setStatusChangeAllowed}
                                  color="danger"
                                >
                                  Подтвердить
                                </Checkbox>
                              </div>
                            </div>
                          </Tab>
                          <Tab key="transaction-user" title="Блокировка">
                            <div className="flex flex-col gap-4 h-[300px]">
                              <Autocomplete
                                id="transaction-input"
                                sx={{ width: 300 }}
                                disableListWrap
                                inputValue={inputUserValue}
                                onInputChange={(event, newInputValue) => {
                                  setUserInputValue(newInputValue);
                                }}
                                PopperComponent={StyledPopper}
                                ListboxComponent={ListboxComponent}
                                options={transactions.map(
                                  (transaction) =>
                                    "ID: " +
                                    transaction.id +
                                    " | " +
                                    transaction.time
                                )}
                                // groupBy={(option) => option[0].toUpperCase()}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Транзакция ..."
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: "50px",

                                        legend: {
                                          marginLeft: "30px",
                                        },
                                      },
                                      "& .MuiAutocomplete-inputRoot": {
                                        paddingLeft: "20px !important",
                                        borderRadius: "12px",
                                      },
                                      "& .MuiInputLabel-outlined": {
                                        paddingLeft: "20px",
                                      },
                                      "& .MuiInputLabel-shrink": {
                                        marginLeft: "20px",
                                        paddingLeft: "10px",
                                        paddingRight: 0,
                                        background: "white",
                                      },
                                    }}
                                  />
                                )}
                                renderOption={(props, option, state) => [
                                  props,
                                  option,
                                  state.index,
                                ]}
                                // TODO: Post React 18 update - validate this conversion, look like a hidden bug
                                renderGroup={(params) => params}
                              />
                              <div className="flex gap-2 justify-end">
                                <Button fullWidth color="danger">
                                  Удалить
                                </Button>
                                <Checkbox
                                  isSelected={isStatusChangeAllowed}
                                  onValueChange={setStatusChangeAllowed}
                                  color="danger"
                                >
                                  Подтвердить
                                </Checkbox>
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
            disableRipple={true}
            onPress={() => onBenefitsOpen()}
            className="py-4 min-w-[300px] col-span-1"
          >
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <p className="text-tiny uppercase font-bold">
                Социальные пособия
              </p>
              <h4 className="font-bold text-large">Назначение категорий</h4>
            </CardHeader>
            <Divider className="my-4" />
            <CardBody className="overflow-visible py-2">
              <p className="text-tiny uppercase font-bold">Возможности</p>
              <Listbox color="primary" variant="flat" aria-label="Actions">
                <ListboxItem
                  key="new"
                  startContent={<AddIcon className={iconClasses} />}
                >
                  Добавление
                </ListboxItem>
                <ListboxItem
                  key="edit"
                  startContent={<EditIcon className={iconClasses} />}
                >
                  Изменение данных
                </ListboxItem>
                <ListboxItem
                  key="edit"
                  startContent={<ChangeCircleIcon className={iconClasses} />}
                >
                  Изменение статуса
                </ListboxItem>
                <ListboxItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  startContent={<RemoveIcon className={iconClasses} />}
                >
                  Удаление
                </ListboxItem>
              </Listbox>
            </CardBody>
            <Divider className="my-4" />
            <CardFooter>
              <ButtonGroup>
                <Button
                  color="primary"
                  onPress={() => (window.location.href = `/dashboard/benefits`)}
                >
                  Все льготы
                </Button>
                <Button
                  variant="flat"
                  color="primary"
                  onPress={() => onBenefitsOpen()}
                >
                  Меню
                </Button>
              </ButtonGroup>
              <Modal
                isDismissable={false}
                size="5xl"
                isOpen={isBenefitsOpen}
                onClose={onBenefitsClose}
                backdrop="blur"
                scrollBehavior="inside"
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        Льготы
                      </ModalHeader>
                      <ModalBody>
                        <Tabs
                          fullWidth
                          size="md"
                          aria-label="Tabs div"
                          selectedKey={selected}
                          onSelectionChange={setSelected}
                        >
                          <Tab key="new-benefit" title="Добавление">
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
                          <Tab
                            key="benefit-state-change"
                            title="Изменение статуса"
                          >
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
                          <Tab key="edit-benefit" title="Изменение данных">
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
                          <Tab key="delete-benefit" title="Удаление">
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
            disableRipple={true}
            onPress={() => onRegistryOpen()}
            className="py-4 min-w-[300px] col-span-1"
          >
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <p className="text-tiny uppercase font-bold">Контроль реестров</p>
              <h4 className="font-bold text-large">Обновление/информация</h4>
            </CardHeader>
            <Divider className="my-4" />
            <CardBody className="overflow-visible py-2">
              <p className="text-tiny uppercase font-bold">Возможности</p>
              <Listbox color="primary" variant="flat" aria-label="Actions">
                <ListboxItem
                  key="copy"
                  startContent={<ChangeCircleIcon className={iconClasses} />}
                >
                  Обновление
                </ListboxItem>
                <ListboxItem
                  key="edit"
                  startContent={<InfoIcon className={iconClasses} />}
                >
                  Детализация
                </ListboxItem>
                <ListboxItem
                  key="history"
                  startContent={<RestoreIcon className={iconClasses} />}
                >
                  История
                </ListboxItem>
                <ListboxItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  startContent={<RemoveIcon className={iconClasses} />}
                >
                  Удаление
                </ListboxItem>
              </Listbox>
            </CardBody>
            <Divider className="my-4" />
            <CardFooter>
              <ButtonGroup>
                <Button
                  variant="flat"
                  color="primary"
                  onPress={() => onRegistryOpen()}
                >
                  Меню
                </Button>
              </ButtonGroup>
              <Modal
                isDismissable={false}
                size="5xl"
                isOpen={isRegistryOpen}
                onClose={onRegistryClose}
                backdrop="blur"
                scrollBehavior="inside"
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        Реестры
                      </ModalHeader>
                      <ModalBody>
                        <Tabs
                          fullWidth
                          size="md"
                          aria-label="Tabs div"
                          selectedKey={selected}
                          onSelectionChange={setSelected}
                        >
                          <Tab key="registry-update" title="Обновление">
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
                          <Tab key="registry-history" title="История">
                            <div className="flex flex-col gap-4">
                              <Input
                                isRequired
                                label="Email"
                                placeholder="Enter your email"
                                type="email"
                              />

                              <div className="flex gap-2 justify-end">
                                <Button fullWidth color="primary">
                                  Login
                                </Button>
                              </div>
                            </div>
                          </Tab>
                          <Tab key="registry-info" title="Информация">
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
                          <Tab key="edit-user" title="Удаление">
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
            disableRipple={true}
            onPress={() => onServicesOpen()}
            className="py-4 min-w-[300px] col-span-1"
          >
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <p className="text-tiny uppercase font-bold">
                Приложения и сервисы
              </p>
              <h4 className="font-bold text-large">Отзыв прав и доступа</h4>
            </CardHeader>
            <Divider className="my-4" />
            <CardBody className="overflow-visible py-2">
              <p className="text-tiny uppercase font-bold">Возможности</p>
              <Listbox color="primary" variant="flat" aria-label="Actions">
                <ListboxItem
                  key="new"
                  startContent={<AddIcon className={iconClasses} />}
                >
                  Добавление
                </ListboxItem>
                <ListboxItem
                  key="copy"
                  startContent={<ChangeCircleIcon className={iconClasses} />}
                >
                  Изменение статуса
                </ListboxItem>
                <ListboxItem
                  key="edit"
                  startContent={<EditIcon className={iconClasses} />}
                >
                  Изменение данных
                </ListboxItem>
                <ListboxItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  startContent={<RemoveIcon className={iconClasses} />}
                >
                  Удаление
                </ListboxItem>
              </Listbox>
            </CardBody>
            <Divider className="my-4" />
            <CardFooter>
              <ButtonGroup>
                <Button
                  variant="flat"
                  color="primary"
                  onPress={() => onServicesOpen()}
                >
                  Меню
                </Button>
              </ButtonGroup>
              <Modal
                isDismissable={false}
                size="5xl"
                isOpen={isServicesOpen}
                onClose={onServicesClose}
                backdrop="blur"
                scrollBehavior="inside"
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        Сервисы
                      </ModalHeader>
                      <ModalBody>
                        <Tabs
                          fullWidth
                          size="md"
                          aria-label="Tabs div"
                          selectedKey={selected}
                          onSelectionChange={setSelected}
                        >
                          <Tab key="new-service" title="Добавление">
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
                          <Tab
                            key="service-state-change"
                            title="Изменение статуса"
                          >
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
                          <Tab key="delete-service" title="Удаление">
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
            disableRipple={true}
            onPress={() => onStatisticsOpen()}
            className="py-4 min-w-[300px] col-span-1"
          >
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <p className="text-tiny uppercase font-bold">API и запросы</p>
              <h4 className="font-bold text-large">Статистика и информация</h4>
            </CardHeader>
            <Divider className="my-4" />
            <CardBody className="overflow-visible py-2">
              <p className="text-tiny uppercase font-bold">Возможности</p>
              <Listbox color="primary" variant="flat" aria-label="Actions">
                <ListboxItem
                  key="new"
                  startContent={<InfoIcon className={iconClasses} />}
                >
                  Просмотр
                </ListboxItem>
                <ListboxItem
                  key="copy"
                  startContent={<PublishIcon className={iconClasses} />}
                >
                  Экспорт
                </ListboxItem>
              </Listbox>
            </CardBody>
            <Divider className="my-4" />
            <CardFooter>
              <ButtonGroup>
                <Button
                  variant="flat"
                  color="primary"
                  onPress={() => onStatisticsOpen()}
                >
                  Меню
                </Button>
              </ButtonGroup>
              <Modal
                isDismissable={false}
                size="5xl"
                isOpen={isStatisticsOpen}
                onClose={onStatisticsClose}
                backdrop="blur"
                scrollBehavior="inside"
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        Использование API
                      </ModalHeader>
                      <ModalBody>
                        <Tabs
                          fullWidth
                          size="md"
                          aria-label="Tabs div"
                          selectedKey={selected}
                          onSelectionChange={setSelected}
                        >
                          <Tab key="info" title="Просмотр">
                            <div className="flex flex-col gap-4">
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
                          <Tab key="service-state-change" title="Экспорт">
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
        </div>
      </div>
    </>
  );
}
