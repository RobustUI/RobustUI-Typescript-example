import {usecasefour} from "./components/usecasefour";

const inputField = document.getElementById("input") as HTMLInputElement;

const dropdown = document.getElementById("dropdown");
const dropdownEl1 = document.getElementById("dropdownEl1");
const dropdownEl2 = document.getElementById("dropdownEl2");
const dropdownEl3 = document.getElementById("dropdownEl3");

const lock = document.getElementById("lock");
const toggleSelective = new usecasefour();

toggleSelective.sendInput('stream', 0);
inputField.onchange = (event) => {
    toggleSelective.sendInput('stream', +inputField.value);
}

toggleSelective.onNewConfiguration("dropdown").subscribe(configurations => {
    console.log(configurations);
    configurations.forEach(config => {
        if (config.state === "show") {
            document.getElementById("myDropdown").classList.add("show")
        } else if (config.state === "notShow") {
            document.getElementById("myDropdown").classList.remove("show")
        }
    })
})

toggleSelective.onNewConfiguration("dropdown::toggle").subscribe(configurations => {
    console.log(configurations);
    configurations.forEach(config => {
        if (config.state === "show") {
            document.getElementById("myDropdown").classList.add("show")
        } else if (config.state === "notShow") {
            document.getElementById("myDropdown").classList.remove("show")
        }
        /*if (config.machine === "history") {
            handleDropDownMenuElement(dropdownEl1, config.state as string);
        } else if (config.machine === "contact") {
            handleDropDownMenuElement(dropdownEl2, config.state as string);
        } else if (config.machine === "jobs") {
            handleDropDownMenuElement(dropdownEl3, config.state as string);
        } */
    })
})
toggleSelective.onNewConfiguration("dropdown::contact").subscribe(configurations => {
    console.log(configurations);

    configurations.forEach(config => {
        if (config.state === "show") {
            document.getElementById("myDropdown").classList.add("show")
        } else if (config.state === "notShow") {
            document.getElementById("myDropdown").classList.remove("show")
        }
    })
})
toggleSelective.onNewConfiguration("dropdown::history").subscribe(configurations => {
    console.log(configurations);

    configurations.forEach(config => {
        if (config.state === "show") {
            document.getElementById("myDropdown").classList.add("show")
        } else if (config.state === "notShow") {
            document.getElementById("myDropdown").classList.remove("show")
        }
    })
})
toggleSelective.onNewConfiguration("dropdown::jobs").subscribe(configurations => {
    console.log(configurations);

    configurations.forEach(config => {
        if (config.state === "show") {
            document.getElementById("myDropdown").classList.add("show")
        } else if (config.state === "notShow") {
            document.getElementById("myDropdown").classList.remove("show")
        }
    })
})

toggleSelective.onNewConfiguration("FAQ").subscribe(configurations => {
    console.log(configurations);
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

toggleSelective.onMachineSwitch.subscribe(machine => {
    if (machine === "dropdown") {
        toggleSelective.registerElement(dropdown, "dropdown::toggle");
        toggleSelective.registerElement(dropdownEl1, "dropdown::history");
        toggleSelective.registerElement(dropdownEl2, "dropdown::contact");
        toggleSelective.registerElement(dropdownEl3, "dropdown::jobs");
        toggleSelective.unregisterElement(lock, "FAQ");
        dropdown.style.display = "block"
        lock.style.display = "none"
    } else if (machine === "FAQ") {
        toggleSelective.unregisterElement(dropdown, "dropdown::toggle");
        toggleSelective.unregisterElement(dropdownEl1, "dropdown::history");
        toggleSelective.unregisterElement(dropdownEl2, "dropdown::contact");
        toggleSelective.unregisterElement(dropdownEl3, "dropdown::jobs");
        toggleSelective.registerElement(lock, "FAQ");
        dropdown.style.display = "none"
        lock.style.display = "block"
    }
})
