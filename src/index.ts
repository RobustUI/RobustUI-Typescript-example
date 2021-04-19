import {LightLockControllerWithControls} from "./components/fooBar";
import {Configuration} from "./Framework/configuration";

const lightBulb = document.getElementById("lightBulb");
const bulb = document.getElementById("bulb");
const lock = document.getElementById("lock");
const inputField = document.getElementById("input") as HTMLInputElement;



const controlledLightLock = new LightLockControllerWithControls();

inputField.onchange = (event) => {
    controlledLightLock.sendInput('valuestream', inputField.value);
}
controlledLightLock.onNewConfiguration().subscribe((configurations: Configuration[]) => {
    resolveConfigurations(configurations);
})

function resolveConfigurations(configurations: Configuration[]) {
    configurations.forEach(config => {
       if (config.machine === 'lightLockController') {
           (config.state as Configuration[]).forEach(internalConfig => {
               if (internalConfig.machine === 'Light') {
                   if (internalConfig.state === 'on') {
                       lightBulb.classList.add('on');
                       lightBulb.classList.remove('off');
                   } else {
                       lightBulb.classList.remove('on');
                       lightBulb.classList.add('off');
                   }
               }

               if (internalConfig.machine === 'Lock') {
                   if (internalConfig.state === 'on') {
                       lock.classList.add('unlocked');
                   } else {
                       lock.classList.remove('unlocked');
                   }
               }
           });
       }

       if (config.machine === 'ControlController') {
           let internal = (config.state as Configuration[])[0]
           if (internal.machine === 'Light') {
               controlledLightLock.registerElement(lightBulb, "lightLockController::Light");
               controlledLightLock.unregisterElement(lock, "lightLockController::Lock");
           }
           if (internal.machine === 'Lock') {
               controlledLightLock.unregisterElement(lightBulb, "lightLockController::Light");
               controlledLightLock.registerElement(lock, "lightLockController::Lock");
           }
       }
    });
}
