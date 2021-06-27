import { P9Comp } from "./components/P9Comp";

const loginFormBtn = document.getElementById("loginForm") as HTMLButtonElement;
const registerFormBtn = document.getElementById(
  "registerForm"
) as HTMLButtonElement;
const loginBtn = document.getElementById("loginBtn") as HTMLButtonElement;
const registerBtn = document.getElementById("registerBtn") as HTMLButtonElement;

const register = document.getElementById("register");
const login = document.getElementById("login");

const email = document.getElementById("email") as HTMLInputElement;

const student = document.getElementById("student");
const employee = document.getElementById("employee");

const comp = new P9Comp();
comp.registerElement(student, "student")
comp.sendInput("stream", 1);

email.onchange = (event) => {
  if (email.value === "0") {
    console.log("STUDENT");
    //comp.sendInput("email", 0)
  } else if (email.value === "1") {
    console.log("EMPLOYEE");
    //comp.sendInput("email", 1)

  }
};

loginFormBtn.onclick = (event) => {
  comp.sendInput("stream", 0);
};

registerFormBtn.onclick = (event) => {
  comp.sendInput("stream", 1);
};

loginBtn.onclick = (event) => {
  event.preventDefault();
  alert("Login button pressed");
};

registerBtn.onclick = (event) => {
  event.preventDefault();
  alert("Register button pressed");
};

comp.onMachineSwitch.subscribe((machine) => {
  if (machine === "Login") {
    comp.unregisterElement(register, "Register");
    register.style.display = "none";
    comp.registerElement(login, "Login");
    login.style.display = "block";
  } else if (machine === "Register") {
    comp.registerElement(register, "Register");
    register.style.display = "block";
    comp.unregisterElement(login, "Login");
    login.style.display = "none";
  }
});

comp.onNewConfiguration("Register").subscribe((value) => {
  console.log(value);
});
