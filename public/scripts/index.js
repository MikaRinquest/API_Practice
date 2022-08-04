// const users = [];
// fetch("https://api-prractice.herokuapp.com/users/users/verify", {
//   method: "GET",
//   headers: {
//     "Content-Type": "application/json",
//     "x-auth-token": localStorage.getItem("token"),
//   },
// })
//   .then((response) => response.json())
//   .then((user) => {
//     showItems(user);
//   });

// function showItems(users) {
//   document.querySelector("#users").innerHTML = "";
//   users.forEach((user) => {
//     console.log(user);
//     document.querySelector("#users").innerHTML += `
//             <td>${user.user_id}</td>
//             <td>${user.full_name}</td>
//             <td>${user.email}</td>
//             <td>${user.user_type}</td>
//             <td>${user.phone}</td>
//             <td>${user.country}</td>
//             <td>${user.billing_address}</td>
//             <td>${user.default_shipping_address}</td>
//           `;
//   });
// }

function displayUser() {}

// Display all products
let products = [];
fetch("http://localhost:6969/products/")
  .then((response) => response.json())
  .then((product) => {
    showItems(product);
  });

function showItems(products) {
  document.querySelector("#products").innerHTML = "";
  products.forEach((product) => {
    console.log(product);
    document.querySelector("#products").innerHTML += `
      <tr>
        <td class="item">${product.product_id}</td>
        <td class="item">${product.sku}</td>
        <td class="item">${product.name}</td>
        <td class="item">${product.price}</td>
        <td class="item">${product.weight}</td>
        <td class="item">${product.descsriptions}</td>
        <td class="item">${product.thumbnail}</td>
        <td class="item"><img src="${product.image}" alt="Image of product" class="img"></td>
        <td class="item">${product.category}</td>
        <td class="item">${product.create_date}</td>
        <td class="item">${product.stock}</td>
        </tr>
          `;
  });
}
