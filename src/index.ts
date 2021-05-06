/// USE CASE 1 - TOGGLE
/*
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
 */


/// USE CASE 2 - DROPDOWN MENU
/*
const dropdown = document.getElementById("dropdown");
const dropdownEl1 = document.getElementById("dropdownEl1");
const dropdownEl2 = document.getElementById("dropdownEl2");
const dropdownEl3 = document.getElementById("dropdownEl3");
const modelCheckersDropDown = new DropDownComp();

modelCheckersDropDown.registerElement(dropdown, "toggle");
modelCheckersDropDown.registerElement(dropdownEl1, "Spin");
modelCheckersDropDown.registerElement(dropdownEl2, "UPPAAL");
modelCheckersDropDown.registerElement(dropdownEl3, "PRISM");

modelCheckersDropDown.onNewConfiguration().subscribe(configurations => {
    configurations.forEach(config => {
        if (config.machine === "Spin") {
            handleDropDownMenuElement(dropdownEl1, config.state as string);
        } else if (config.machine === "UPPAAL") {
            handleDropDownMenuElement(dropdownEl2, config.state as string);
        } else if (config.machine === "PRISM") {
            handleDropDownMenuElement(dropdownEl3, config.state as string);
        } else if (config.machine === "toggle") {
            if (config.state === "show") {
                document.getElementById("myDropdown").classList.add("show")
            } else if (config.state === "notShow") {
                document.getElementById("myDropdown").classList.remove("show")
            }
        }
    })
})

document.addEventListener("click", (event) => {
    let isInside = dropdown.contains(event.target as Node);
    if (!isInside) {
        modelCheckersDropDown.sendInput("close");
    }
})

function handleDropDownMenuElement(element: HTMLElement, state: string) {
    if (state === "notSelected") {
        element.classList.remove("hovered")
    } else if (state === "Hovered") {
        element.classList.add("hovered")
    }
}
*/

// USE CASE 3 - MOVIE PAGE
/*
const inputField = document.getElementById("input") as HTMLInputElement;
const lock = document.getElementById("lock");
const faq = document.getElementById("FAQ-DIV");
const movie = document.getElementById("MOVIE-DIV");
const toggleSelective = new useCaseThree();

toggleSelective.sendInput('stream');
inputField.onchange = (event) => {
    toggleSelective.sendInput('stream', +inputField.value);
}

toggleSelective.onNewConfiguration().subscribe(configurations => {
    console.log(configurations);
    configurations.forEach(config => {
        if (config.machine === "toggle") {
            if (config.state === "on") {
                lock.classList.add('unlocked');
            } else {
                lock.classList.remove('unlocked');
            }
        }
        if (config.machine === "content") {
            let internal = (config.state as Configuration[])[0]
            if (internal.machine === 'movie') {
                toggleSelective.unregisterElement(faq, "content::FAQ");
                toggleSelective.registerElement(movie, "content::movie");
                movie.style.display = "block"
                faq.style.display = "none"
            } else if (internal.machine === 'FAQ') {
                toggleSelective.unregisterElement(movie, "content::movie");
                toggleSelective.registerElement(faq, "content::FAQ");
                movie.style.display = "none"
                faq.style.display = "block"
            }
        }

    })
})
 */

import {ToggleSelective} from "./components/testSoem";
import {Toggle} from "./components/Toggle";

const lock = document.getElementById("lock");
const faq = document.getElementById("FAQ-DIV");
const movie = document.getElementById("MOVIE-DIV");
const q1 = document.getElementById("Q1");
const q2 = document.getElementById("Q2");
const q3 = document.getElementById("Q3");

const toggle = new Toggle("lock");

toggle.registerElement(lock);
toggle.onNewConfiguration().subscribe(configurations => {
    configurations.forEach(config => {
        if (config.state === "on") {
            lock.classList.add('unlocked');
            toggleSelective.sendInput('stream', 0);
        } else {
            lock.classList.remove('unlocked');
            toggleSelective.sendInput('stream', 1);
        }
    })
})

const toggleSelective = new ToggleSelective();

toggleSelective.onMachineSwitch.subscribe(machine => {
    if (machine === 'movie') {
        toggleSelective.unregisterElement(faq, "FAQ");
        toggleSelective.registerElement(movie, "movie");
        movie.style.display = "block"
        faq.style.display = "none"
    } else if (machine === 'FAQ') {
        toggleSelective.unregisterElement(movie, "movie");
        toggleSelective.registerElement(faq, "FAQ");
        movie.style.display = "none"
        faq.style.display = "block"
    }
})
