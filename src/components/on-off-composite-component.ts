import {Observable} from "rxjs";
import {RobustUI} from "../Framework/RobustUI";
import {StreamDeclaration} from "../Framework/declaration-types/StreamDeclaration";
import {ActionEvent, RobustUIActions, RobustUIMachine} from "../Framework/RobustUIMachine";
import {MachineDeclaration} from "../Framework/declaration-types/MachineDeclaration";
import {RobustUICompositeMachine} from "../Framework/RobustUICompositeMachine";
import {StateDeclaration} from "../Framework/declaration-types/StateDeclaration";

export type LightLockControllerMachine = "LightBulb" | "Lock" | "MessageBroker";
export class LightLockController extends RobustUICompositeMachine{
    protected machines = new Map<LightLockControllerMachine, RobustUI>();
    constructor() {
        super();
        this.machines.set("LightBulb", new OnOffSimpleComponent());
        this.machines.set("Lock", new OnOffSimpleComponent());
        this.machines.set("MessageBroker", new OnOffAdapterComponent());
        this.initialize();
        (this.machines.get('LightBulb') as OnOffSimpleComponent).getOutputStream('newstateoff').subscribe(_ => {
            this.machines.get('MessageBroker').sendInput('newstateoff');
        });
        (this.machines.get('LightBulb') as OnOffSimpleComponent).getOutputStream('newstateon').subscribe(_ => {
            this.machines.get('MessageBroker').sendInput('newstateon');
        });
        (this.machines.get('Lock') as OnOffSimpleComponent).getOutputStream('newstateoff').subscribe(_ => {
            this.machines.get('MessageBroker').sendInput('newstateoff');
        });
        (this.machines.get('Lock') as OnOffSimpleComponent).getOutputStream('newstateon').subscribe(_ => {
            this.machines.get('MessageBroker').sendInput('newstateon');
        });
        (this.machines.get('MessageBroker') as OnOffAdapterComponent).getOutputStream('setstateoff').subscribe(_ => {
            this.machines.get('LightBulb').sendInput('setstateoff');
        });
        (this.machines.get('MessageBroker') as OnOffAdapterComponent).getOutputStream('setstateoff').subscribe(_ => {
            this.machines.get('Lock').sendInput('setstateoff');
        });
        (this.machines.get('MessageBroker') as OnOffAdapterComponent).getOutputStream('setstateon').subscribe(_ => {
            this.machines.get('LightBulb').sendInput('setstateon');
        });
        (this.machines.get('MessageBroker') as OnOffAdapterComponent).getOutputStream('setstateon').subscribe(_ => {
            this.machines.get('Lock').sendInput('setstateon');
        });
    }
    public outputs: StreamDeclaration[] = [];
    public inputs: StreamDeclaration[] = [];
    public events: StreamDeclaration[] = [];
    public registerElement(element: HTMLElement, machine: LightLockControllerMachine): void {
        this.machines.get(machine).registerElement(element);
    }
    public unregisterElement(element: HTMLElement, machine: LightLockControllerMachine): void {
        this.machines.get(machine).unregisterElement(element);
    }
}
export type OnOffSimpleComponentState = "off" | "on" | "keep-off" | "keep-on";
export type OnOffSimpleComponentOutputStreams = "newstateon" | "newstateoff";
export class OnOffSimpleComponent extends RobustUIMachine{
    private states: StateDeclaration[] = [
        {
            name: 'off',
            transitions: [
                {
                    target: 'on',
                    label: 'pointerenter',
                },
                {
                    target: 'keep-off',
                    label: 'click/newstateoff',
                },
                {
                    target: 'keep-on',
                    label: 'setstateon',
                },
            ]
        },
        {
            name: 'on',
            transitions: [
                {
                    target: 'off',
                    label: 'pointerleave',
                },
                {
                    target: 'keep-on',
                    label: 'click/newstateon',
                },
                {
                    target: 'keep-off',
                    label: 'setstateoff',
                },
            ]
        },
        {
            name: 'keep-off',
            transitions: [
                {
                    target: 'on',
                    label: 'click/newstateon',
                },
                {
                    target: 'on',
                    label: 'setstateon',
                },
            ]
        },
        {
            name: 'keep-on',
            transitions: [
                {
                    target: 'off',
                    label: 'click/newstateoff',
                },
                {
                    target: 'off',
                    label: 'setstateoff',
                },
            ]
        },
    ];
    private initialState = 'off'
    public outputs: StreamDeclaration[] = [
        {
            stream: "newstateoff",
        },
        {
            stream: "newstateon",
        },
    ];
    public inputs: StreamDeclaration[] = [
        {
            stream: "setstateon",
        },
        {
            stream: "setstateoff",
        },
    ];
    public events: StreamDeclaration[] = [
        {
            stream: "click/newstateoff",
        },
        {
            stream: "click/newstateon",
        },
        {
            stream: "pointerleave",
        },
        {
            stream: "pointerenter",
        },
    ];
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
        element.addEventListener("click", function() {
            this.transition("click");
        }.bind(this));
        element.addEventListener("pointerenter", function() {
            this.transition("pointerenter");
        }.bind(this));
        element.addEventListener("pointerleave", function() {
            this.transition("pointerleave");
        }.bind(this));
    }

    public getOutputStream(label: OnOffSimpleComponentOutputStreams): Observable<any> {
        return super.getOutputStream(label);
    }

    public when(state: OnOffSimpleComponentState, action: RobustUIActions): Observable<ActionEvent> {
        return super.when(state, action);
    }
}
export type OnOffAdapterComponentState = "receive" | "deliveron" | "deliveroff";
export type OnOffAdapterComponentOutputStreams = "setstateon" | "setstateoff";
export class OnOffAdapterComponent extends RobustUIMachine{
    private states: StateDeclaration[] = [
        {
            name: 'receive',
            transitions: [
                {
                    target: 'deliveroff',
                    label: 'newstateoff',
                },
                {
                    target: 'deliveron',
                    label: 'newstateon',
                },
            ]
        },
        {
            name: 'deliveron',
            transitions: [
                {
                    target: 'receive',
                    label: 'setstateon',
                },
            ]
        },
        {
            name: 'deliveroff',
            transitions: [
                {
                    target: 'receive',
                    label: 'setstateoff',
                },
            ]
        },
    ];
    private initialState = 'receive'
    public outputs: StreamDeclaration[] = [
        {
            stream: "setstateoff",
        },
        {
            stream: "setstateon",
        },
    ];
    public inputs: StreamDeclaration[] = [
        {
            stream: "newstateoff",
        },
        {
            stream: "newstateon",
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

    public getOutputStream(label: OnOffAdapterComponentOutputStreams): Observable<any> {
        return super.getOutputStream(label);
    }

    public when(state: OnOffAdapterComponentState, action: RobustUIActions): Observable<ActionEvent> {
        return super.when(state, action);
    }
}
