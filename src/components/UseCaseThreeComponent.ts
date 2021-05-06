import {RobustUI} from "../Framework/RobustUI";
import {RobustUISelectiveMachine} from "../Framework/RobustUISelectiveMachine";
import {StreamDeclaration} from "../Framework/declaration-types/StreamDeclaration";
import {Configuration} from "../Framework/configuration";
import {ActionEvent, RobustUIActions, RobustUIMachine} from "../Framework/RobustUIMachine";
import {MachineDeclaration} from "../Framework/declaration-types/MachineDeclaration";
import {RobustUICompositeMachine} from "../Framework/RobustUICompositeMachine";
import {Observable} from "rxjs";
import {StateDeclaration} from "../Framework/declaration-types/StateDeclaration";

export type useCaseThreeMachine = "toggle" | "content" | "content::FAQ" | "content::movie";
export class useCaseThree extends RobustUICompositeMachine{
    protected machines = new Map<useCaseThreeMachine, RobustUI>();
    constructor() {
        super();
        this.machines.set("toggle", new Toggle("toggle"));
        this.machines.set("content", new toggleSelective());
        this.initialize();
    }
    public outputs: StreamDeclaration[] = [];
    public inputs: StreamDeclaration[] = [];
    public events: StreamDeclaration[] = [];
    public registerElement(element: HTMLElement, machine: useCaseThreeMachine): void {
        super.registerElement(element, machine);
    }
    public unregisterElement(element: HTMLElement, machine: useCaseThreeMachine): void {
        super.unregisterElement(element, machine);
    }
    public onNewConfiguration(): Observable<Configuration[]> {
        return super.onNewConfiguration();
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
export type toggleSelectiveMachines = "FAQ" | "movie";
export class toggleSelective extends RobustUISelectiveMachine{
    protected machines = new Map<toggleSelectiveMachines, RobustUI>();
    constructor() {
        super();
        this.machines.set("FAQ", new Toggle("FAQ"));
        this.machines.set("movie", new Toggle("movie"));
        this.initialize();
        this.inputStream.subscribe(value => {
            if (value == 0) {
                this.switchMachine('FAQ')
            }
            else {
                this.switchMachine('movie')
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
    public get onMachineSwitch(): Observable<toggleSelectiveMachines> {
        return this.machineSwitchStream as Observable<toggleSelectiveMachines>
    }
    public onNewConfiguration(machine: toggleSelectiveMachines): Observable<Configuration[]> {
        return super.onNewConfiguration(machine)
    }
    public getOutputStream(name: string): Observable<any> {
        return super.getOutputStream(name);
    }
}

