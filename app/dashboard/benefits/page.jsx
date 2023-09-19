"use client";
import React from "react";

import { PlusIcon } from "@components/icons";
import { ChevronDownIcon } from "@components/icons";
import { SearchIcon } from "@components/icons";
import { columns, statusOptions } from "@utils/benefitData";
import { capitalize } from "@utils/utils";

import useSWR from "swr";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  benefit,
  Pagination,
  Selection,
  ChipProps,
  Tooltip,
  SortDescriptor,
  Spinner,
  getKeyValue,
  ButtonGroup,
} from "@nextui-org/react";

import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";

const statusColorMap = {
  active: "success",
  blocked: "danger",
  suspended: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "amount",
  "card_data",
  "time",
  "state",
  "actions",
];

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function App() {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [cardsList, setCardsList] = React.useState(new Set([]));
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(15);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "id",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);
  let globalVariable;
  const [cardPage, setCardPage] = React.useState(1);
  const rowsPerCardPage = 20;

  // async fetching block start
  const { data, isLoading } = useSWR(process.env.API_GET_URL, fetcher, {
    keepPreviousData: true,
  });

  const loadingState =
    isLoading || data?.results.length === 0 ? "Загрузка" : "Неактивен";

  const benefits = React.useMemo(() => data?.results || [], [data]);
  // async fetching end

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredbenefits = [...benefits];

    if (hasSearchFilter) {
      filteredbenefits = filteredbenefits.filter((benefit) =>
        benefit.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredbenefits = filteredbenefits.filter((benefit) =>
        Array.from(statusFilter).includes(benefit.state)
      );
    }

    return filteredbenefits;
  }, [benefits, hasSearchFilter, statusFilter, filterValue]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  // cards table
  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const cards = React.useMemo(() => {
    let cardPages = cardsList
      ? Math.ceil(cardsList.length / rowsPerCardPage)
      : 1;
    const start = (cardPage - 1) * rowsPerCardPage;
    const end = start + rowsPerCardPage;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    globalVariable = cardPages;
    if (cardsList && cardsList.length > 0) {
      return cardsList.slice(start, end);
    } else {
      return [];
    }
  }, [cardsList, cardPage]);

  const renderCardCell = React.useCallback((benefit, columnKey) => {
    return benefit[columnKey];
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const renderCell = React.useCallback((benefit, columnKey) => {
    const cellValue = benefit[columnKey];

    switch (columnKey) {
      case "id":
      case "amount":
      case "name":
        return cellValue;
      case "card_data":
        return (
          <>
            <Button color="primary" onPress={() => setCardsList(cellValue)}>
              Список карт
            </Button>
          </>
        );
      case "time":
        return (
          <div className="px-1 py-2">
            <div className="text-small font-bold">
              Активна до:{" "}
              {new Date(cellValue.active_until).toLocaleDateString()}
            </div>
            <div className="text-tiny">
              Активна с: {new Date(cellValue.active_since).toLocaleDateString()}
            </div>
          </div>
        );
      case "state":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[benefit.state]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip
              content={
                <div className="px-1 py-2">
                  <div className="text-small font-bold">
                    Дополнительная информация:
                  </div>
                  <div className="text-tiny">{benefit.info}</div>
                </div>
              }
            >
              <Button
                size="sm"
                isIconOnly
                variant="faded"
                aria-label="edit"
                onPress={() => console.log("info'ed")}
              >
                <InfoIcon />
              </Button>
            </Tooltip>
            <Tooltip content="Изменить">
              <Button
                size="sm"
                isIconOnly
                color="primary"
                aria-label="edit"
                onPress={() => console.log("edited")}
              >
                <EditIcon />
              </Button>
            </Tooltip>
            <Tooltip color="danger" content="Удалить">
              <Button
                size="sm"
                isIconOnly
                color="danger"
                aria-label="block"
                onPress={() => console.log("deleted")}
              >
                <RemoveCircleOutlineIcon />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Поиск по названию ..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Статус
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Поля
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="primary" endContent={<PlusIcon />}>
              Добавить
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Всего {benefits.length} льгот
          </span>
          <label className="flex items-center text-default-400 text-small">
            Количество строк льгот:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="15">15</option>
              <option value="30">30</option>
              <option value="50">50</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    onSearchChange,
    statusFilter,
    visibleColumns,
    benefits.length,
    onRowsPerPageChange,
    onClear,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          isCompact
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <ButtonGroup>
            <Button
              isDisabled={pages === 1}
              size="sm"
              variant="flat"
              onPress={onPreviousPage}
            >
              Назад
            </Button>
            <Button
              isDisabled={pages === 1}
              size="sm"
              variant="flat"
              onPress={onNextPage}
            >
              Вперед
            </Button>
          </ButtonGroup>
        </div>
      </div>
    );
  }, [
    selectedKeys,
    filteredItems.length,
    page,
    pages,
    onPreviousPage,
    onNextPage,
  ]);

  return (
    <div className="grid gap-2 ">
      {topContent}
    <div className="flex justify-center grid-flow-row-dense grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 ">
      <Table
        className="col-span-1"
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[calc(95vh-200px)]",
        }}
        sortDescriptor={sortDescriptor}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={"No benefits found"}
          items={sortedItems}
          loadingContent={<Spinner />}
          loadingState={loadingState}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Table
        className="col-span-1"
        aria-label="cards data table"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showShadow
              color="primary"
              page={cardPage}
              total={globalVariable}
              onChange={(page) => setCardPage(page)}
            />
          </div>
        }
        classNames={{
          wrapper: `min-h-[222px]`,
        }}
      >
        <TableHeader>
          <TableColumn key="card_number">Номер карты</TableColumn>
          <TableColumn key="card_id">ID карты</TableColumn>
        </TableHeader>
        <TableBody items={cards}>
          {(item) => (
            <TableRow key={item.card_id}>
              {(columnKey) => (
                <TableCell>{renderCardCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    </div>
  );
}
