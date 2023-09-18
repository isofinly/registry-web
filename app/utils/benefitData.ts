const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "Наименование", uid: "name", sortable: true },
    { name: "Льгота, %", uid: "amount", sortable: true },
    { name: "Номер карты", uid: "card_data", sortable: true },
    { name: "Срок действия", uid: "time", sortable: true },
    { name: "Статус", uid: "state", sortable: true },
    { name: "Действия", uid: "actions" },
];

const statusOptions = [
    { name: "Активна", uid: "active" },
    { name: "Заблокирована", uid: "blocked" },
    { name: "Заморожена", uid: "suspended" },
    { name: "Неактивна", uid: "inactive" },
];

export { columns, statusOptions };
