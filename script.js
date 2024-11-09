let order = {};
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let orderName = '';
let discount = 1;

// Add names to existing favorites if they don't have them
favorites = favorites.map((fav, i) => ({
   ...fav,
    name: fav.name || `Favorite ${i + 1}`
}));

updateFavorites();

function addItem(name, price, quantity) {
    if (order[name]) {
        order[name].quantity += quantity;
        order[name].totalPrice += price * quantity * discount;
    } else {
        order[name] = { quantity: quantity, totalPrice: price * quantity * discount, price: price };
    }
    updateOrderSummary();
}

function updateOrderSummary() {
    const orderList = document.getElementById("order-list");
    const subtotalDisplay = document.getElementById("subtotal");
    const discount50 = document.getElementById("discount50").checked;
    const discount5 = document.getElementById("discount5").checked;
    const orderNameInput = document.getElementById("order-name");

    orderName = orderNameInput.value;

    orderList.innerHTML = "";
    let subtotal = 0;
    let orderSummaryText = "";

    for (let itemName in order) {
        let item = order[itemName];
        subtotal += item.totalPrice;
        orderSummaryText += `<li>${itemName} x ${item.quantity} = $${item.totalPrice.toFixed(2)} 📊</li>`;
    }

    if (discount50) {
        discount = 0.5;
    } else if (discount5) {
        discount = 0.95;
    } else {
        discount = 1;
    }

    subtotal *= discount;

    orderList.innerHTML = Object.keys(order).length? `<ul>${orderSummaryText}</ul>` : "No items added";
    subtotalDisplay.textContent = subtotal.toFixed(2);
}

function clearOrder() {
    order = {};
    updateOrderSummary();
}

function saveAsFavorite() {
    if (Object.keys(order).length) {
        const newFavorite = {
            name: orderName,
            items: order
        };
        favorites.push(newFavorite);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavorites();
    }
}

function updateFavorites() {
    const favoritesList = document.getElementById("favorites-list");
    if (!favorites.length) {
        favoritesList.innerHTML = "No favorite orders saved";
    } else {
        favoritesList.innerHTML = favorites
           .map((fav, i) => `
                <div class="favorite-item">
                    <div class="favorite-name">
                        <span onclick="startRename(${i})">${fav.name}</span>
                    </div>
                    <div class="favorite-actions">
                        <button onclick="loadFavorite(${i})">Load</button>
                        <button onclick="renameFavorite(${i})" class="rename-button">Rename</button>
                        <button onclick="deleteFavorite(${i})" class="delete-button">Delete</button>
                    </div>
                </div>
            `)
           .join("");
    }
}

function startRename(index) {
    const favoriteNameElement = document.querySelector(`#favorites-list.favorite-item:nth-child(${index + 1}).favorite-name`);
    const currentName = favorites[index].name;
    favoriteNameElement.innerHTML = `
        <input type="text" value="${currentName}" onblur="finishRename(${index}, this.value)" onkeypress="handleRenameKeyPress(event, ${index}, this)">
    `;
    favoriteNameElement.querySelector('input').focus();
}

function handleRenameKeyPress(event, index, input) {
    if (event.key === 'Enter') {
        finishRename(index, input.value);
    }
}

function renameFavorite(index) {
    startRename(index);
}

function finishRename(index, newName) {
    if (newName.trim()) {
        favorites[index].name = newName.trim();
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavorites();
    }
}

function deleteFavorite(index) {
    favorites.splice(index, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavorites();
}

function loadFavorite(index) {
    orderName = favorites[index].name;
    document.getElementById("order-name").value = orderName;
    order = favorites[index].items;
    discount = 1;
    updateOrderSummary();
}

function applyDiscount(rate) {
    discount = 1 - rate;
    for (let itemName in order) {
        order[itemName].totalPrice *= discount;
    }
    updateOrderSummary();
   function saveAsFavorite() {
  if (Object.keys(order).length) {
    const newFavorite = {
      name: orderName,
      items: order
    };
    favorites.push(newFavorite);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavorites();
    postOrderToDiscord(order);
  }
}

