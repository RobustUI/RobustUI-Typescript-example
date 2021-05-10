import {RobustUISelectiveMachine} from "../Framework/RobustUISelectiveMachine";
import {RobustUI} from "../Framework/RobustUI";
import {StreamDeclaration} from "../Framework/declaration-types/StreamDeclaration";
import {Configuration} from "../Framework/configuration";
import {ActionEvent, RobustUIActions, RobustUIMachine} from "../Framework/RobustUIMachine";
import {MachineDeclaration} from "../Framework/declaration-types/MachineDeclaration";
import {RobustUICompositeMachine} from "../Framework/RobustUICompositeMachine";
import {Observable} from "rxjs";
import {StateDeclaration} from "../Framework/declaration-types/StateDeclaration";

export type usecasefourMachines = "FAQ" | "dropdown" | "dropdown::toggle" | "dropdown::history" | "dropdown::contact" | "dropdown::jobs";
export class usecasefour extends RobustUISelectiveMachine{
    protected machines = new Map<usecasefourMachines, RobustUI>();
    constructor() {
        super();
        this.machines.set("FAQ", new Toggle("FAQ"));
        this.machines.set("dropdown", new DropDownComp());
        this.initialize();
        this.inputStream.subscribe(value => {
            if (value == 1) {
                this.switchMachine('FAQ')
            }
            else {
                this.switchMachine('dropdown')
            }
        });
    }
    public outputs: StreamDeclaration[] = [];
    public inputs: StreamDeclaration[] = [
        {
            stream: "stream",
        },
    ];
    public events: StreamDeclaration[] = [];
    public get onMachineSwitch(): Observable<usecasefourMachines> {
        return this.machineSwitchStream as Observable<usecasefourMachines>
    }
    public onNewConfiguration(machine: usecasefourMachines): Observable<Configuration[]> {
        return super.onNewConfiguration(machine)
    }
    public getOutputStream(name: string): Observable<any> {
        return super.getOutputStream(name);
    }
}
export type ToggleState = "off" | "on";
export type ToggleOutputStreams = "";
export class Toggle extends RobustUIMachine{
    private states: StateDeclaration[] = [
        {
            name: 'off',
            transitions: [
                {
                    target: 'on',
                    label: 'click',
                },
            ]
        },
        {
            name: 'on',
            transitions: [
                {
                    target: 'off',
                    label: 'click',
                },
            ]
        },
    ];
    private initialState = 'off'
    public outputs: StreamDeclaration[] = [];
    public inputs: StreamDeclaration[] = [];
    public events: StreamDeclaration[] = [
        {
            stream: "click",
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

    public getOutputStream(label: ToggleOutputStreams): Observable<any> {
        return super.getOutputStream(label);
    }

    public when(state: ToggleState, action: RobustUIActions): Observable<ActionEvent> {
        return super.when(state, action);
    }
}
export type DropDownCompMachine = "toggle" | "history" | "contact" | "jobs";
export class DropDownComp extends RobustUICompositeMachine{
    protected machines = new Map<DropDownCompMachine, RobustUI>();
    constructor() {
        super();
        this.machines.set("toggle", new dropdown("toggle"));
        this.machines.set("history", new dropdownElement("history"));
        this.machines.set("contact", new dropdownElement("contact"));
        this.machines.set("jobs", new dropdownElement("jobs"));
        this.initialize();
        (this.machines.get('history') as dropdownElement).getOutputStream('close').subscribe(_ => {
            this.machines.get('toggle').sendInput('close');
        });
        (this.machines.get('contact') as dropdownElement).getOutputStream('close').subscribe(_ => {
            this.machines.get('toggle').sendInput('close');
        });
        (this.machines.get('jobs') as dropdownElement).getOutputStream('close').subscribe(_ => {
            this.machines.get('toggle').sendInput('close');
        });
    }
    public outputs: StreamDeclaration[] = [];
    public inputs: StreamDeclaration[] = [];
    public events: StreamDeclaration[] = [];
    public registerElement(element: HTMLElement, machine: DropDownCompMachine): void {
        super.registerElement(element, machine);
    }
    public unregisterElement(element: HTMLElement, machine: DropDownCompMachine): void {
        super.unregisterElement(element, machine);
    }
    public onNewConfiguration(): Observable<Configuration[]> {
        return super.onNewConfiguration();
    }
}
export type dropdownState = "notShow" | "show";
export type dropdownOutputStreams = "";
export class dropdown extends RobustUIMachine{
    private states: StateDeclaration[] = [
        {
            name: 'notShow',
            transitions: [
                {
                    target: 'show',
                    label: 'click',
                },
            ]
        },
        {
            name: 'show',
            transitions: [
                {
                    target: 'notShow',
                    label: 'click',
                },
                {
                    target: 'notShow',
                    label: 'close',
                },
            ]
        },
    ];
    private initialState = 'notShow'
    public outputs: StreamDeclaration[] = [];
    public inputs: StreamDeclaration[] = [
        {
            stream: "close",
        },
    ];
    public events: StreamDeclaration[] = [
        {
            stream: "click",
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

    public getOutputStream(label: dropdownOutputStreams): Observable<any> {
        return super.getOutputStream(label);
    }

    public when(state: dropdownState, action: RobustUIActions): Observable<ActionEvent> {
        return super.when(state, action);
    }
}
export type dropdownElementState = "notSelected" | "Hovered";
export type dropdownElementOutputStreams = "close";
export class dropdownElement extends RobustUIMachine{
    private states: StateDeclaration[] = [
        {
            name: 'notSelected',
            transitions: [
                {
                    target: 'Hovered',
                    label: 'pointerenter',
                },
            ]
        },
        {
            name: 'Hovered',
            transitions: [
                {
                    target: 'notSelected',
                    label: 'pointerenter/close!',
                },
                {
                    target: 'notSelected',
                    label: 'pointerleave',
                },
            ]
        },
    ];
    private initialState = 'notSelected'
    public outputs: StreamDeclaration[] = [
        {
            stream: "close",
        },
    ];
    public inputs: StreamDeclaration[] = [];
    public events: StreamDeclaration[] = [
        {
            stream: "pointerenter",
        },
        {
            stream: "pointerenter/close!",
        },
        {
            stream: "pointerleave",
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
        element.addEventListener("pointerenter", function() {
            this.transition("pointerenter");
        }.bind(this));
        element.addEventListener("pointerleave", function() {
            this.transition("pointerleave");
        }.bind(this));
    }

    public getOutputStream(label: dropdownElementOutputStreams): Observable<any> {
        return super.getOutputStream(label);
    }

    public when(state: dropdownElementState, action: RobustUIActions): Observable<ActionEvent> {
        return super.when(state, action);
    }
}

