import {RobustUI} from "../Framework/RobustUI";
import {RobustUISelectiveMachine} from "../Framework/RobustUISelectiveMachine";
import {StreamDeclaration} from "../Framework/declaration-types/StreamDeclaration";
import {Configuration} from "../Framework/configuration";
import {ActionEvent, RobustUIActions, RobustUIMachine} from "../Framework/RobustUIMachine";
import {MachineDeclaration} from "../Framework/declaration-types/MachineDeclaration";
import {RobustUICompositeMachine} from "../Framework/RobustUICompositeMachine";
import {Observable} from "rxjs";
import {StateDeclaration} from "../Framework/declaration-types/StateDeclaration";

export type LightLockControllerWithControlsMachine = "lightLockController" | "lightLockController::Light" | "lightLockController::Lock" | "lightLockController::adapter" | "ControlController" | "ControlController::Light" | "ControlController::Lock";
export class LightLockControllerWithControls extends RobustUICompositeMachine{
    protected machines = new Map<LightLockControllerWithControlsMachine, RobustUI>();
    constructor() {
        super();
        this.machines.set("lightLockController", new LightLockController());
        this.machines.set("ControlController", new LightLockSelective());
        this.initialize();
    }
    public outputs: StreamDeclaration[] = [];
    public inputs: StreamDeclaration[] = [];
    public events: StreamDeclaration[] = [];
    public registerElement(element: HTMLElement, machine: LightLockControllerWithControlsMachine): void {
        super.registerElement(element, machine);
    }
    public unregisterElement(element: HTMLElement, machine: LightLockControllerWithControlsMachine): void {
        super.unregisterElement(element, machine);
    }
    public onNewConfiguration(): Observable<Configuration[]> {
        return super.onNewConfiguration();
    }
}
export type LightLockControllerMachine = "Light" | "Lock" | "adapter";
export class LightLockController extends RobustUICompositeMachine{
    protected machines = new Map<LightLockControllerMachine, RobustUI>();
    constructor() {
        super();
        this.machines.set("Light", new onOffComponent("Light"));
        this.machines.set("Lock", new onOffComponent("Lock"));
        this.machines.set("adapter", new onOffAdapter("adapter"));
        this.initialize();
        (this.machines.get('Light') as onOffComponent).getOutputStream('turnedon').subscribe(_ => {
            this.machines.get('adapter').sendInput('turnedon');
        });
        (this.machines.get('Light') as onOffComponent).getOutputStream('turnedoff').subscribe(_ => {
            this.machines.get('adapter').sendInput('turnedoff');
        });
        (this.machines.get('Lock') as onOffComponent).getOutputStream('turnedon').subscribe(_ => {
            this.machines.get('adapter').sendInput('turnedon');
        });
        (this.machines.get('Lock') as onOffComponent).getOutputStream('turnedoff').subscribe(_ => {
            this.machines.get('adapter').sendInput('turnedoff');
        });
        (this.machines.get('adapter') as onOffAdapter).getOutputStream('turnon').subscribe(_ => {
            this.machines.get('Light').sendInput('turnon');
        });
        (this.machines.get('adapter') as onOffAdapter).getOutputStream('turnon').subscribe(_ => {
            this.machines.get('Lock').sendInput('turnon');
        });
        (this.machines.get('adapter') as onOffAdapter).getOutputStream('turnoff').subscribe(_ => {
            this.machines.get('Light').sendInput('turnoff');
        });
        (this.machines.get('adapter') as onOffAdapter).getOutputStream('turnoff').subscribe(_ => {
            this.machines.get('Lock').sendInput('turnoff');
        });
    }
    public outputs: StreamDeclaration[] = [];
    public inputs: StreamDeclaration[] = [];
    public events: StreamDeclaration[] = [];
    public registerElement(element: HTMLElement, machine: LightLockControllerMachine): void {
        super.registerElement(element, machine);
    }
    public unregisterElement(element: HTMLElement, machine: LightLockControllerMachine): void {
        super.unregisterElement(element, machine);
    }
    public onNewConfiguration(): Observable<Configuration[]> {
        return super.onNewConfiguration();
    }
}
export type onOffComponentState = "off" | "on";
export type onOffComponentOutputStreams = "turnedoff" | "turnedon";
export class onOffComponent extends RobustUIMachine{
    private states: StateDeclaration[] = [
        {
            name: 'off',
            transitions: [
                {
                    target: 'on',
                    label: 'click/turnedon!',
                },
                {
                    target: 'on',
                    label: 'turnon',
                },
            ]
        },
        {
            name: 'on',
            transitions: [
                {
                    target: 'off',
                    label: 'click/turnedoff!',
                },
                {
                    target: 'off',
                    label: 'turnoff',
                },
            ]
        },
    ];
    private initialState = 'off'
    public outputs: StreamDeclaration[] = [
        {
            stream: "turnedon",
        },
        {
            stream: "turnedoff",
        },
    ];
    public inputs: StreamDeclaration[] = [
        {
            stream: "turnon",
        },
        {
            stream: "turnoff",
        },
    ];
    public events: StreamDeclaration[] = [
        {
            stream: "click/turnedon!",
        },
        {
            stream: "click/turnedoff!",
        },
    ];
    protected machineDeclaration: MachineDeclaration;

    constructor(name: string) {
        super(name);

        this.machineDeclaration = {
            initialState: this.initialState,
            states: this.states,
            inputs: this.inputs,
            outputs: this.outputs
        };

        this.initialize();
    }

    public registerElement(element: HTMLElement): void {
        element.addEventListener("click", function() {
            this.transition("click");
        }.bind(this));
    }

    public getOutputStream(label: onOffComponentOutputStreams): Observable<any> {
        return super.getOutputStream(label);
    }

    public when(state: onOffComponentState, action: RobustUIActions): Observable<ActionEvent> {
        return super.when(state, action);
    }
}
export type onOffAdapterState = "rec" | "sendTurnOn" | "sendTurnOff";
export type onOffAdapterOutputStreams = "turnon" | "turnoff";
export class onOffAdapter extends RobustUIMachine{
    private states: StateDeclaration[] = [
        {
            name: 'rec',
            transitions: [
                {
                    target: 'sendTurnOn',
                    label: 'turnedon',
                },
                {
                    target: 'sendTurnOff',
                    label: 'turnedoff',
                },
            ]
        },
        {
            name: 'sendTurnOn',
            transitions: [
                {
                    target: 'rec',
                    label: 'turnon',
                },
            ]
        },
        {
            name: 'sendTurnOff',
            transitions: [
                {
                    target: 'rec',
                    label: 'turnoff',
                },
            ]
        },
    ];
    private initialState = 'rec'
    public outputs: StreamDeclaration[] = [
        {
            stream: "turnon",
        },
        {
            stream: "turnoff",
        },
    ];
    public inputs: StreamDeclaration[] = [
        {
            stream: "turnedon",
        },
        {
            stream: "turnedoff",
        },
    ];
    public events: StreamDeclaration[] = [];
    protected machineDeclaration: MachineDeclaration;

    constructor(name: string) {
        super(name);

        this.machineDeclaration = {
            initialState: this.initialState,
            states: this.states,
            inputs: this.inputs,
            outputs: this.outputs
        };

        this.initialize();
    }

    public registerElement(element: HTMLElement): void {
    }

    public getOutputStream(label: onOffAdapterOutputStreams): Observable<any> {
        return super.getOutputStream(label);
    }

    public when(state: onOffAdapterState, action: RobustUIActions): Observable<ActionEvent> {
        return super.when(state, action);
    }
}
export type LightLockSelectiveMachines = "Light" | "Lock";
export class LightLockSelective extends RobustUISelectiveMachine{
    protected machines = new Map<LightLockSelectiveMachines, RobustUI>();
    constructor() {
        super();
        this.machines.set("Light", new onOffComponent("Light"));
        this.machines.set("Lock", new onOffComponent("Lock"));
        this.initialize();
        this.inputStream.subscribe(value => {
            if (value >=10) {
                this.switchMachine('Light')
            } else if (value <= 9) {
                this.switchMachine('Lock')
            }
        });
    }
    public outputs: StreamDeclaration[] = [];
    public inputs: StreamDeclaration[] = [
        {
            stream: "valuestream",
        },
    ];
    public events: StreamDeclaration[] = [];
    public get onMachineSwitch(): Observable<LightLockSelectiveMachines> {
        return this.machineSwitchStream as Observable<LightLockSelectiveMachines>
    }
    public onNewConfiguration(machine: LightLockSelectiveMachines): Observable<Configuration[]> {
        return super.onNewConfiguration(machine)
    }
    public getOutputStream(name: string): Observable<any> {
        return super.getOutputStream(name);
    }
}
