import {ActionEvent, RobustUIActions, RobustUIMachine} from "../Framework/RobustUIMachine";
import {StreamDeclaration} from "../Framework/declaration-types/StreamDeclaration";
import {MachineDeclaration} from "../Framework/declaration-types/MachineDeclaration";
import {Observable} from "rxjs";
import {StateDeclaration} from "../Framework/declaration-types/StateDeclaration";

export type OtherOnOffSimpleComponentState = "off" | "on" | "hover";
export type OtherOnOffSimpleComponentOutputStreams = "";
export class OtherOnOffSimpleComponent extends RobustUIMachine{
    private states: StateDeclaration[] = [
        {
            name: 'off',
            transitions: [
                {
                    target: 'hover',
                    label: 'pointerenter',
                },
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
        {
            name: 'hover',
            transitions: [
                {
                    target: 'off',
                    label: 'pointerleave',
                },
                {
                    target: 'on',
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
            stream: "pointerenter",
        },
        {
            stream: "pointerleave",
        },
        {
            stream: "click",
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
        element.addEventListener("pointerenter", function() {
            this.transition("pointerenter");
        }.bind(this));
        element.addEventListener("pointerleave", function() {
            this.transition("pointerleave");
        }.bind(this));
        element.addEventListener("click", function() {
            this.transition("click");
        }.bind(this));
    }

    public getOutputStream(label: OtherOnOffSimpleComponentOutputStreams): Observable<any> {
        return super.getOutputStream(label);
    }

    public when(state: OtherOnOffSimpleComponentState, action: RobustUIActions): Observable<ActionEvent> {
        return super.when(state, action);
    }
}
