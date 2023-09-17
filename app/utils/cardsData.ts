const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "Номер карты", uid: "card_number", sortable: true },
    { name: "Срок годности", uid: "time_active", sortable: true },
    { name: "Последняя активность", uid: "last_activity", sortable: true },
    { name: "ID валидатора", uid: "uID", sortable: true },
    { name: "Пользователь", uid: "user", sortable: true },
    { name: "Статус", uid: "status", sortable: true },
    { name: "Действия", uid: "actions" },
];

const statusOptions = [
    { name: "Активна", uid: "active" },
    { name: "Заблокирована", uid: "blocked" },
    { name: "Заморожена", uid: "suspended" },
];

export { columns, statusOptions };
