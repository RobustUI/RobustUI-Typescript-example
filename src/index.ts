import {Toggle} from "./components/Toggle";

const lock = document.getElementById("lock");
const toggle = new Toggle("lock");

toggle.registerElement(lock);
toggle.onNewConfiguration().subscribe(configurations => {
    configurations.forEach(config => {
        if (config.state === "on") {
            lock.classList.add('unlocked');
        } else {
            lock.classList.remove('unlocked');
        }
    })
})
