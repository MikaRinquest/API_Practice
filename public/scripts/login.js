function login() {
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  // const token =
  fetch("https://api-prractice.herokuapp.com/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      //   "x-auth-token": token,
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      localStorage.setItem("token", JSON.stringify(data));
    });
}
