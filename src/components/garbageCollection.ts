import {RobustUISelectiveMachine} from "../Framework/RobustUISelectiveMachine";
import {StreamDeclaration} from "../Framework/declaration-types/StreamDeclaration";
import {ActionEvent, RobustUIActions, RobustUIMachine} from "../Framework/RobustUIMachine";
import {MachineDeclaration} from "../Framework/declaration-types/MachineDeclaration";
import {RobustUICompositeMachine} from "../Framework/RobustUICompositeMachine";
import {Observable} from "rxjs";
import {StateDeclaration} from "../Framework/declaration-types/StateDeclaration";
import {RobustUI} from "../Framework/RobustUI";

export type IamSelectiveMachines = "UnderFortyFive" | "OverOrNine" | "DeffNotValid";
export class IamSelective extends RobustUISelectiveMachine{
    protected machines = new Map<IamSelectiveMachines, RobustUI>();
    constructor() {
        super();
        this.machines.set("UnderFortyFive", new Murden());
        this.machines.set("OverOrNine", new A());
        this.machines.set("DeffNotValid", new A());
        this.initialize();
        this.inputStream.subscribe(value => {
            if (value <45) {
                this.switchMachine('UnderFortyFive')
            } else if (value >=9) {
                this.switchMachine('OverOrNine')
            } else if (value === "asddsa".length) {
                this.switchMachine('DeffNotValid')
            }
        });
    }
    public outputs: StreamDeclaration[] = [];
    public inputs: StreamDeclaration[] = [
        {
            stream: "onSelect",
        },
    ];
    public  events: StreamDeclaration[];
    public get onMachineSwitch(): Observable<IamSelectiveMachines> {
        return this.machineSwitchStream as Observable<IamSelectiveMachines>
    }
    public onNewConfiguration(machine: IamSelectiveMachines): Observable<string | Map<string, string>> {
        return super.onNewConfiguration(machine)
    }
    public getOutputStream(name: string): Observable<any> {
        return super.getOutputStream(name);
    }
    public registerElement(element: HTMLElement, machineName: IamSelectiveMachines): void {
        super.registerElement(element, machineName);
    }


}
export type MurdenMachine = "TheMikkel" | "TheA" | "sda" | "qwe" | "dfg";
export class Murden extends RobustUICompositeMachine{
    protected machines = new Map<MurdenMachine, RobustUIMachine>();
    constructor() {
        super();
        this.machines.set("TheMikkel", new Mikkel());
        this.machines.set("TheA", new A());
        this.machines.set("sda", new A());
        this.machines.set("qwe", new A());
        this.machines.set("dfg", new A());
        this.initialize();
    }
    public outputs: StreamDeclaration[] = [];
    public inputs: StreamDeclaration[] = [];
    public registerElement(element: HTMLElement, machine: MurdenMachine): void {
        this.machines.get(machine).registerElement(element);
    }

    public unregisterElement(element: HTMLElement, machine?: string): void {
    }
}
export type MikkelState = "initial_state" | "new state";
export type MikkelOutputStreams = "";
export class Mikkel extends RobustUIMachine{
    private states: StateDeclaration[] = [
        {
            name: 'initial_state',
            transitions: [
            ]
        },
        {
            name: 'new state',
            transitions: [
            ]
        },
    ];
    private initialState = 'initial_state'
    public outputs: StreamDeclaration[] = [];
    public inputs: StreamDeclaration[] = [];
    public events: StreamDeclaration[] = [];
    protected machineDeclaration: MachineDeclaration;

    constructor() {
        super();

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

    public getOutputStream(label: MikkelOutputStreams): Observable<any> {
        return super.getOutputStream(label);
    }

    public when(state: MikkelState, action: RobustUIActions): Observable<ActionEvent> {
        return super.when(state, action);
    }
}
export type AState = "A_A" | "A_B";
export type AOutputStreams = "msg";
export class A extends RobustUIMachine{
    private states: StateDeclaration[] = [
        {
            name: 'A_A',
            transitions: [
            ]
        },
        {
            name: 'A_B',
            transitions: [
                {
                    target: 'A_A',
                    label: 'msg',
                },
            ]
        },
    ];
    private initialState = 'A_A'
    public outputs: StreamDeclaration[] = [
        {
            stream: "msg",
        },
    ];
    public inputs: StreamDeclaration[] = [
        {
            stream: "awk",
        },
    ];
    public events: StreamDeclaration[] = [];
    protected machineDeclaration: MachineDeclaration;

    constructor() {
        super();

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

    public getOutputStream(label: AOutputStreams): Observable<any> {
        return super.getOutputStream(label);
    }

    public when(state: AState, action: RobustUIActions): Observable<ActionEvent> {
        return super.when(state, action);
    }
}
