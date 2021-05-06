import {DropDownComp} from "./components/DropDownComp";

const dropdown = document.getElementById("dropdown");
const dropdownEl1 = document.getElementById("dropdownEl1");
const dropdownEl2 = document.getElementById("dropdownEl2");
const dropdownEl3 = document.getElementById("dropdownEl3");
const modelCheckersDropDown = new DropDownComp();

modelCheckersDropDown.registerElement(dropdown, "toggle");
modelCheckersDropDown.registerElement(dropdownEl1, "history");
modelCheckersDropDown.registerElement(dropdownEl2, "contact");
modelCheckersDropDown.registerElement(dropdownEl3, "jobs");

modelCheckersDropDown.onNewConfiguration().subscribe(configurations => {
    configurations.forEach(config => {
        if (config.machine === "history") {
            handleDropDownMenuElement(dropdownEl1, config.state as string);
        } else if (config.machine === "contact") {
            handleDropDownMenuElement(dropdownEl2, config.state as string);
        } else if (config.machine === "jobs") {
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
