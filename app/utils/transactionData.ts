const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "Время", uid: "time", sortable: true },
    { name: "Стоимость", uid: "amount", sortable: true },
    { name: "Льгота, %", uid: "benefit", sortable: true },
    { name: "Координаты", uid: "coordinates", sortable: true},
    { name: "Номер карты", uid: "card_id", sortable: true },
    { name: "Кондуктор", uid: "conductor", sortable: true },
    { name: "Город", uid: "city", sortable: true },
    { name: "Статус", uid: "state", sortable: true },
    { name: "Действия", uid: "actions" },
];

const statusOptions = [
    { name: "Совершена", uid: "completed" },
    { name: "Заблокирована", uid: "blocked" },
    { name: "Заморожена", uid: "suspended" },
];

export { columns, statusOptions };
