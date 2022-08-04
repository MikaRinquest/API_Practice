function register() {
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  const fullname = document.querySelector("#fullname").value;
  const billing_address = document.querySelector("#billing_address").value;
  const shipping_address = document.querySelector("#shipping_address").value;
  //   const country = document.querySelector("#country").value;

  const phone = document.querySelector("#phone").value;
  //   const user_type = document.querySelector("#user_type").value;
  fetch("https://api-prractice.herokuapp.com/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      //   "x-auth-token":
      //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfaWQiOjgsImZ1bGxfbmFtZSI6Ik1pa2EgUmlucXVlc3QiLCJlbWFpbCI6Im1pa2FyQGdtYWlsLmNvbSIsInVzZXJfdHlwZSI6ImFkbWluIiwicGhvbmUiOiIwODE3MDc5OTkyIiwiY291bnRyeSI6IlNvdXRoIEFmcmljYSIsImJpbGxpbmdfYWRkcmVzcyI6Im1vdGhlcmxhbmQiLCJkZWZhdWx0X3NoaXBwaW5nX2FkZHJlc3MiOiJmYXRoZXJsYW5kIn0sImlhdCI6MTY1OTQ0MjE2NSwiZXhwIjoxNjkwOTc4MTY1fQ.huDtT_bXBiNESaLO18jvJ2xT5pj7lYQXoWt5Qdmszfs",
    },
    body: JSON.stringify({
      email: email,
      password: password,
      full_name: fullname,
      billing_address: billing_address,
      default_shipping_address: shipping_address,
      country: "South Africa",
      phone: phone,
      user_type: "user",
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    });
}
