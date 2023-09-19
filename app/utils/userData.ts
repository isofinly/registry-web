const columns = [
  { name: "ID", uid: "id",  sortable: true},
  { name: "Имя", uid: "first_name",  sortable: true},
  { name: "Email", uid: "email" },
  { name: "Город", uid: "city", sortable: true },
  { name: "Статус", uid: "account_states", sortable: true },
  { name: "Скидка", uid: "discount",  sortable: true },
  { name: "ID карты", uid: "card_id",  sortable: true},
];

const statusOptions = [
  {name: "Активен", uid: "active"},
  {name: "Заблокирован", uid: "paused"},
  {name: "Заморожен", uid: "suspended"},
];

export {columns,  statusOptions};