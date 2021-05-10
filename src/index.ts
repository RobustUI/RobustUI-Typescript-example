import {usecase} from "./components/usecase";

const inputField = document.getElementById("input") as HTMLInputElement;
const oldCol = document.getElementById("oldCol");
const newCol = document.getElementById("newCol");
const toggleSelective = new usecase();

toggleSelective.sendInput('stream', 0);
inputField.onchange = (event) => {
    toggleSelective.sendInput('stream', +inputField.value);
}

toggleSelective.onMachineSwitch.subscribe(machine => {
    if (machine === "new") {
        toggleSelective.unregisterElement(oldCol, "old");
        toggleSelective.registerElement(newCol, "new");
        newCol.style.display = "block"
        oldCol.style.display = "none"
    } else if (machine === 'old') {
        toggleSelective.unregisterElement(newCol, "new");
        toggleSelective.registerElement(oldCol, "old");
        newCol.style.display = "none"
        oldCol.style.display = "block"
    }
})
