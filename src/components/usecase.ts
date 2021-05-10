import {MachineDeclaration} from "../Framework/declaration-types/MachineDeclaration";
import {RobustUISelectiveMachine} from "../Framework/RobustUISelectiveMachine";
import {RobustUI} from "../Framework/RobustUI";
import {StreamDeclaration} from "../Framework/declaration-types/StreamDeclaration";
import {Configuration} from "../Framework/configuration";
import {ActionEvent, RobustUIActions, RobustUIMachine} from "../Framework/RobustUIMachine";
import {Observable} from "rxjs";
import {StateDeclaration} from "../Framework/declaration-types/StateDeclaration";

export type usecaseMachines = "new" | "old";
export class usecase extends RobustUISelectiveMachine{
    protected machines = new Map<usecaseMachines, RobustUI>();
    constructor() {
        super();
        this.machines.set("new", new newcol("new"));
        this.machines.set("old", new oldcol("old"));
        this.initialize();
        this.inputStream.subscribe(value => {
            if (value == 1) {
                this.switchMachine('new')
            }
            else {
                this.switchMachine('old')
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
    public get onMachineSwitch(): Observable<usecaseMachines> {
        return this.machineSwitchStream as Observable<usecaseMachines>
    }
    public onNewConfiguration(machine: usecaseMachines): Observable<Configuration[]> {
        return super.onNewConfiguration(machine)
    }
    public getOutputStream(name: string): Observable<any> {
        return super.getOutputStream(name);
    }
}
export type newcolState = "initial_state";
export type newcolOutputStreams = "";
export class newcol extends RobustUIMachine{
    private states: StateDeclaration[] = [
        {
            name: 'initial_state',
            transitions: [
            ]
        },
    ];
    private initialState = 'initial_state'
    public outputs: StreamDeclaration[] = [];
    public inputs: StreamDeclaration[] = [];
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

    public getOutputStream(label: newcolOutputStreams): Observable<any> {
        return super.getOutputStream(label);
    }

    public when(state: newcolState, action: RobustUIActions): Observable<ActionEvent> {
        return super.when(state, action);
    }
}
export type oldcolState = "initial_state";
export type oldcolOutputStreams = "";
export class oldcol extends RobustUIMachine{
    private states: StateDeclaration[] = [
        {
            name: 'initial_state',
            transitions: [
            ]
        },
    ];
    private initialState = 'initial_state'
    public outputs: StreamDeclaration[] = [];
    public inputs: StreamDeclaration[] = [];
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

    public getOutputStream(label: oldcolOutputStreams): Observable<any> {
        return super.getOutputStream(label);
    }

    public when(state: oldcolState, action: RobustUIActions): Observable<ActionEvent> {
        return super.when(state, action);
    }
}

