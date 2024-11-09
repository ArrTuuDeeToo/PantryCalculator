let subtotal = 0;
let discount = 1;

function addItem(itemName, itemPrice) {
  subtotal += itemPrice * discount;
  updateOrderList(itemName, itemPrice);
  updateSubtotal();
}

function updateOrderList(itemName, itemPrice) {
  const orderList = document.getElementById("orderList");
  const listItem = document.createElement("li");
  listItem.textContent = `${itemName} - $${itemPrice}`;
  orderList.appendChild(listItem);
}

function updateSubtotal() {
  document.getElementById("subtotal").textContent = subtotal.toFixed(2);
}

function applyDiscount(rate) {
  discount = 1 - rate;
  subtotal *= discount;
  updateSubtotal();
}
