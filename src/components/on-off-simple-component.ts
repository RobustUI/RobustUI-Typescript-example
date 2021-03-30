/*import {ActionEvent, RobustUIActions, RobustUIMachine} from "../Framework/RobustUIMachine";
import {StateDeclaration} from "../Framework/declaration-types/StateDeclaration";
import {StreamDeclaration} from "../Framework/declaration-types/StreamDeclaration";
import {MachineDeclaration} from "../Framework/declaration-types/MachineDeclaration";
import {Observable} from "rxjs";


export type OnOffSimpleComponentState = "off" | "on" | "keep-off" | "keep-on";
export type OnOffSimpleComponentOutputStreams = "newstate";
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
                    label: 'click/newstate',
                },
                {
                    target: 'keep-on',
                    label: 'setstate',
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
                    label: 'click/newstate',
                },
                {
                    target: 'keep-off',
                    label: 'setstate',
                },
            ]
        },
        {
            name: 'keep-off',
            transitions: [
                {
                    target: 'on',
                    label: 'click/newstate',
                },
                {
                    target: 'on',
                    label: 'setstate',
                },
            ]
        },
        {
            name: 'keep-on',
            transitions: [
                {
                    target: 'off',
                    label: 'click/newstate',
                },
                {
                    target: 'off',
                    label: 'setstate',
                },
            ]
        },
    ];
    private initialState = 'off'
    public outputs: StreamDeclaration[] = [
        {
            stream: "newstate",
        }
    ];
    public inputs: StreamDeclaration[] = [
        {
            stream: "setstate",
        }
    ];
    public events: string[] = ["pointerenter", "pointerleave", "click"]
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

    public getOutputStream(label: OnOffSimpleComponentOutputStreams): Observable<any> {
        return super.getOutputStream(label);
    }

    public when(state: OnOffSimpleComponentState, action: RobustUIActions): Observable<ActionEvent> {
        return super.when(state, action);
    }
}*/

