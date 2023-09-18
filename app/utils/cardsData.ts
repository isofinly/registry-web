const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "Номер карты", uid: "card_number", sortable: true },
    { name: "Пользователь", uid: "user", sortable: true },
    { name: "Статус", uid: "status", sortable: true },
];

const statusOptions = [
    { name: "Активна", uid: "active" },
    { name: "Заблокирована", uid: "blocked" },
    { name: "Заморожена", uid: "suspended" },
];

export { columns, statusOptions };
