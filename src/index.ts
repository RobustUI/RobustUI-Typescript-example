import { P9Comp } from "./components/P9Comp";
import { Configuration } from "./Framework/configuration";

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
comp.sendInput("stream", 0);

email.onchange = (_) => {
  if (email.value.endsWith("@student.aau.dk")) {
    comp.sendInput("email", 0);
  } else if (email.value.endsWith("@cs.aau.dk")) {
    comp.sendInput("email", 1);
  } else {
    comp.sendInput("email", 2);
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

    loginFormBtn.classList.remove('inactive_tab');
    loginFormBtn.classList.add('active_tab');
    registerFormBtn.classList.remove('active_tab');
    registerFormBtn.classList.add('inactive_tab');
  } else if (machine === "Register") {
    comp.registerElement(register, "Register");
    register.style.display = "block";
    comp.unregisterElement(login, "Login");
    login.style.display = "none";

    loginFormBtn.classList.remove('active_tab');
    loginFormBtn.classList.add('inactive_tab');
    registerFormBtn.classList.remove('inactive_tab');
    registerFormBtn.classList.add('active_tab');
  }
});

comp.onNewConfiguration("email").subscribe((machine) => {
  const config = machine[0].state[0] as Configuration;
  if (config.machine === "student") {
    comp.registerElement(student, "student");
    student.style.display = "flex";
    employee.style.display = "none";
  } else if (config.machine === "employee") {
    comp.registerElement(employee, "employee");
    employee.style.display = "flex";
    student.style.display = "none";
  } else if (config.machine === "unknown") {
    student.style.display = "none";
    employee.style.display = "none";
  }
});
