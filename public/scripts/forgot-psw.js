function forgotPsw() {
  const email = document.querySelector("#email").value;
  // const token =
  fetch("http://localhost:6969/users/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    });
}
