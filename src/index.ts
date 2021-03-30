import {OtherOnOffSimpleComponent} from "./components/other-on-off-simple-component";
import {LightLockController} from "./components/on-off-composite-component";
import {IamSelective} from "./components/selective-component";

const lightBulb = document.getElementById("lightBulb");
const bulb = document.getElementById("bulb");
const lock = document.getElementById("lock");
const inputField = document.getElementById("input") as HTMLInputElement;

//////
// COMPOSITE COMPONENT
//////

const lightLockController = new LightLockController();
lightLockController.registerElement(bulb, "LightBulb");
lightLockController.registerElement(lock, "Lock");

lightLockController.onNewConfiguration().subscribe((e: Map<string, string>) => {
        e.forEach((state, component) => {
            if (component === 'LightBulb') {
                if (state === 'on' || state == 'keep-on') {
                    lightBulb.classList.add('on');
                    lightBulb.classList.remove('off');
                } else {
                    lightBulb.classList.remove('on');
                    lightBulb.classList.add('off');
                }
            }

            if (component === 'Lock') {
                if (state === 'on' || state == 'keep-on') {
                    lock.classList.add('unlocked');
                } else {
                    lock.classList.remove('unlocked');
                }
            }
        })
})

/*
//////
// On Off Simple COMPONENT
//////

const onOffSimpleComponentState = new OnOffSimpleComponent();
onOffSimpleComponentState.registerElement(bulb);
onOffSimpleComponentState.onNewConfiguration.subscribe((state: string) => {
        if (state === 'on' || state == 'keep-on') {
            lightBulb.classList.add('on');
            lightBulb.classList.remove('off');
        } else {
            lightBulb.classList.remove('on');
            lightBulb.classList.add('off');
        }
    });

onOffSimpleComponentState.getOutputStream("newstate").subscribe(e => console.log(e))
*/

//////
// Other On Off Simple COMPONENT
//////
/*
const onOffSimpleComponentState = new OtherOnOffSimpleComponent();
onOffSimpleComponentState.registerElement(bulb);
onOffSimpleComponentState.onNewConfiguration().subscribe((state: string) => {
        if (state === 'on' || state == 'hover') {
            lightBulb.classList.add('on');
            lightBulb.classList.remove('off');
        } else {
            lightBulb.classList.remove('on');
            lightBulb.classList.add('off');
        }
    });

onOffSimpleComponentState.when("hover", "onEnter").subscribe(
    e => console.log('we entered the hover state')
)
*/

/*
const selectiveComponent = new IamSelective();
selectiveComponent.registerElement(bulb, "OverOrNine")
selectiveComponent.registerElement(lock, "UnderFortyFive")

selectiveComponent.onMachineSwitch.subscribe(machine => {
    if (machine == "OverOrNine") {
        lock.style.display = "none"
        bulb.style.display = "block"
    } else if (machine == 'UnderFortyFive') {
        lock.style.display = "block"
        bulb.style.display = "none"
    }
    console.log(machine)
});

selectiveComponent.onNewConfiguration('OverOrNine').subscribe(state => {
    if (state === 'on' || state == 'hover') {
        lightBulb.classList.add('on');
        lightBulb.classList.remove('off');
    } else {
        lightBulb.classList.remove('on');
        lightBulb.classList.add('off');
    }
})

selectiveComponent.onNewConfiguration('UnderFortyFive').subscribe(state => {
    if (state === 'on' || state == 'keep-on') {
        lock.classList.add('unlocked');
    } else {
        lock.classList.remove('unlocked');
    }
})

selectiveComponent.getOutputStream('newstateon').subscribe(_ => {
    console.log(_)
})

selectiveComponent.getOutputStream('newstateoff').subscribe(_ => {
    console.log(_)
})

inputField.onchange = (event) => {
   selectiveComponent.sendInput(+inputField.value)
}*/
