const columns = [
  { name: "ID", uid: "id",  sortable: true},
  { name: "Имя", uid: "first_name",  sortable: true},
  { name: "Фамилия", uid: "last_name",  sortable: true},
  { name: "Отчество", uid: "middle_name",  sortable: true},
  { name: "Пол", uid: "sex",  },
  { name: "Email", uid: "email" },
  { name: "Дата рождения", uid: "born", sortable: true },
  { name: "Город", uid: "city", sortable: true },
  { name: "Статус", uid: "account_states", sortable: true },
  { name: "Скидка", uid: "discount" },
  { name: "ID карты", uid: "card_id",  },
];

const statusOptions = [
  {name: "Активен", uid: "active"},
  {name: "Заблокирован", uid: "paused"},
  {name: "Заморожен", uid: "suspended"},
];

export {columns,  statusOptions};