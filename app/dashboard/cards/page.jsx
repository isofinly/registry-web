"use client";
import React from "react";
import useSWR from "swr";
// icons
import {
  SearchIcon,
  ChevronDownIcon,
} from "@components/icons";
import BlockIcon from "@mui/icons-material/Block";
import EditIcon from "@mui/icons-material/Edit";
import PublishIcon from "@mui/icons-material/Publish";
import GetAppIcon from "@mui/icons-material/GetApp";
// misc
import { columns, statusOptions } from "@utils/cardsData";
import { capitalize } from "@utils/utils";
// ui
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
  User,
  Pagination,
  Selection,
  ChipProps,
  Tooltip,
  SortDescriptor,
  Spinner, 
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
// cfgs
const statusColorMap = {
  active: "success",
  blocked: "danger",
  suspended: "warning",
};
const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "card_id",
  "card_number",
  "time_active",
  "last_activity",
  "uID",
  "user",
  "status",
  "actions",
];

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function App() {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(15);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "id",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { data, isLoading } = useSWR(process.env.API_GET_URL, fetcher, {
    keepPreviousData: true,
  });

  const loadingState =
    isLoading || data?.results.length === 0 ? "Загрузка" : "Неактивен";

  const transactions = React.useMemo(() => data?.results || [], [data]);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredTransactions = [...transactions];

    if (hasSearchFilter) {
      filteredTransactions = filteredTransactions.filter((transaction) =>
        transaction.card_number.includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredTransactions = filteredTransactions.filter((transaction) =>
        Array.from(statusFilter).includes(transaction.state)
      );
    }

    return filteredTransactions;
  }, [transactions, hasSearchFilter, statusFilter, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

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

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "id":
        return cellValue;
      case "card_number":
        return cellValue;
      case "amount":
        return cellValue;
      case "time_active":
        return (
          <div className="px-1 py-2">
            <div className="text-small font-bold">
              Активна до: {new Date(cellValue.end).toLocaleDateString() + " " + new Date(cellValue.end).toLocaleTimeString()}
            </div>
            <div className="text-tiny">Активирована:{new Date(cellValue.start).toLocaleDateString() + " " + new Date(cellValue.start).toLocaleTimeString()}</div>
          </div>
        );
      case "last_activity":
        return (
          <div className="px-1 py-2">
            <div className="text-small font-bold">{new Date(cellValue).toLocaleDateString() + " " + new Date(cellValue).toLocaleTimeString()}</div>
          </div>
        );
      case "user":
        return (
          <User
            description={cellValue.id}
            name={
              cellValue.first_name +
              " " +
              cellValue.middle_name +
              " " +
              cellValue.last_name
            }
          ></User>
        );
      case "uID":
        return cellValue;
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[cellValue]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "card_id":
        return cellValue;
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Изменить статус">
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
            <Tooltip color="danger" content="Заблокировать">
              <Button
                size="sm"
                isIconOnly
                color="danger"
                aria-label="block"
                onPress={() => console.log("blocked")}
              >
                <BlockIcon />
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
            placeholder="Поиск по номеру карты..."
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
            <Button color="primary" endContent={<GetAppIcon />}>
              Импорт
            </Button>
            <Button color="primary" endContent={<PublishIcon />}>
              Экспорт
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Всего {transactions.length} карт
          </span>
          <label className="flex items-center text-default-400 text-small">
            Количество строк:
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
    transactions.length,
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
    <div className="">
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[calc(95vh-200px)]",
        }}
        // selectedKeys={selectedKeys}
        // selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
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
          emptyContent={"No transactions found"}
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
    </div>
  );
}
