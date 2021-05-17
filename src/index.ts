import {usecasefour} from "./components/usecasefour";

const inputField = document.getElementById("input") as HTMLInputElement;

const dropdown = document.getElementById("dropdown");
const historyEl = document.getElementById("dropdownEl1");
const contactEl = document.getElementById("dropdownEl2");
const jobsEl = document.getElementById("dropdownEl3");

const lock = document.getElementById("lock");

const toggleSelective = new usecasefour();

inputField.onchange = (event) => {
    toggleSelective.sendInput('stream', +inputField.value);
}

toggleSelective.onMachineSwitch.subscribe(machine => {
    if (machine === "dropdown") {
        toggleSelective.registerElement(dropdown, "dropdown::toggle");
        toggleSelective.registerElement(historyEl, "dropdown::history");
        toggleSelective.registerElement(contactEl, "dropdown::contact");
        toggleSelective.registerElement(jobsEl, "dropdown::jobs");
        toggleSelective.unregisterElement(lock, "FAQ");
        dropdown.style.display = "block"
        lock.style.display = "none"
    } else if (machine === "FAQ") {
        toggleSelective.unregisterElement(dropdown, "dropdown::toggle");
        toggleSelective.unregisterElement(historyEl, "dropdown::history");
        toggleSelective.unregisterElement(contactEl, "dropdown::contact");
        toggleSelective.unregisterElement(jobsEl, "dropdown::jobs");
        toggleSelective.registerElement(lock, "FAQ");
        dropdown.style.display = "none"
        lock.style.display = "block"
    }
})


toggleSelective.onNewConfiguration("toggle").subscribe(configurations => {
    configurations.forEach(config => {
        if (config.machine === "toggle") {
            if (config.state === "show") {
                document.getElementById("myDropdown").classList.add("show")
            } else if (config.state === "notShow") {
                document.getElementById("myDropdown").classList.remove("show")
            }
        } else if (config.machine === "history") {
            handleDropDownMenuElement(historyEl, config.state as string);
        } else if (config.machine === "contact") {
            handleDropDownMenuElement(contactEl, config.state as string);
        } else if (config.machine === "jobs") {
            handleDropDownMenuElement(jobsEl, config.state as string);
        }
    })
})

toggleSelective.sendInput('stream', 0);

toggleSelective.onNewConfiguration("FAQ").subscribe(configurations => {
    configurations.forEach(config => {
        if (config.state === "on") {
            lock.classList.add('unlocked');
        } else {
            lock.classList.remove('unlocked');
        }
    })
})

function handleDropDownMenuElement(element: HTMLElement, state: string) {
    if (state === "notSelected") {
        element.classList.remove("hovered")
    } else if (state === "Hovered") {
        element.classList.add("hovered")
    }
}

document.addEventListener("click", (event) => {
    let isInside = dropdown.contains(event.target as Node);
    if (!isInside) {
        toggleSelective.sendInput("close", 0);
    }
})