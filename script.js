const crudAPI =
  "https://crudcrud.com/api/679c9e4408624270844db7d7e8fac978/itemData";

const myForm = document.querySelector("#my-form");
const msg = document.querySelector("#msg");
const itemName = document.querySelector("#name");
const itemCategory = document.querySelector("#category");
const itemPrice = document.querySelector("#price");
const itemQuantity = document.querySelector("#quantity");
const btn = document.querySelector("#btn");
const itemList = document.querySelector("#item-list");

function renderItem(item) {
  const li = document.createElement("li");
  li.className =
    "bg-white p-4 rounded shadow flex justify-between items-center";

  const leftText = document.createElement("div");
  leftText.innerText = `${item.name} (${item.category}) - ₹${item.price} - Qty: ${item.quantity}`;
  li.appendChild(leftText);

  const buttonGroup = document.createElement("div");
  [1, 2, 3].forEach((count) => {
    const btn = document.createElement("button");
    btn.innerText = `Buy${count}`;
    btn.className = "bg-green-500 text-white px-2 py-1 mx-1 rounded text-sm";
    btn.addEventListener("click", () => handleBuy(item, count));
    buttonGroup.appendChild(btn);
  });

  li.appendChild(buttonGroup);
  itemList.appendChild(li);
}

function handleBuy(item, quantityToBuy) {
  if (item.quantity < quantityToBuy) {
    alert("Not enough quantity available!");
    return;
  }

  const updatedItem = {
    name: item.name,
    category: item.category,
    price: item.price,
    quantity: item.quantity - quantityToBuy,
  };

  axios
    .put(`${crudAPI}/${item._id}`, updatedItem)
    .then(() => {
      location.reload(); // reload to show updated list
    })
    .catch((err) => {
      console.error(err);
      alert("Failed to update item");
    });
}

// Load existing items
window.addEventListener("DOMContentLoaded", () => {
  axios
    .get(crudAPI)
    .then((response) => {
      response.data.forEach(renderItem);
    })
    .catch((error) => console.error(error));
});

// Add new item
btn.addEventListener("click", (e) => {
  e.preventDefault();

  if (
    itemName.value === "" ||
    itemCategory.value === "" ||
    itemPrice.value === "" ||
    itemQuantity.value === ""
  ) {
    msg.innerText = "* Please enter all fields";
    return;
  }

  const newItem = {
    name: itemName.value,
    category: itemCategory.value,
    price: Number(itemPrice.value),
    quantity: Number(itemQuantity.value),
  };

  axios
    .post(crudAPI, newItem)
    .then((res) => {
      renderItem(res.data);
      msg.innerText = "";
      itemName.value = "";
      itemCategory.value = "";
      itemPrice.value = "";
      itemQuantity.value = "";
    })
    .catch((err) => {
      console.error(err);
      msg.innerText = "* Something went wrong while saving";
    });
});
