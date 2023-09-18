const columns = [
    { name: "ID", uid: "id",  sortable: true},
    { name: "Название", uid: "name",  sortable: true},
    { name: "Значение", uid: "value",  sortable: true},
    { name: "Пол", uid: "sex",  sortable: true },
    { name: "Возраст", uid: "age"},
    { name: "Срок годности", uid: "time_active"},
    { name: "Статус", uid: "status", sortable: true  },
    { name: "Действия", uid: "actions" },
];

const statusOptions = [
    {name: "Активна", uid: "active"},
    {name: "Удалена", uid: "delete"},
    {name: "Приостановлена", uid: "pause"},
];

export {columns,  statusOptions};