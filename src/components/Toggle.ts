import {StreamDeclaration} from "../Framework/declaration-types/StreamDeclaration";
import {ActionEvent, RobustUIActions, RobustUIMachine} from "../Framework/RobustUIMachine";
import {MachineDeclaration} from "../Framework/declaration-types/MachineDeclaration";
import {Observable} from "rxjs";
import {StateDeclaration} from "../Framework/declaration-types/StateDeclaration";

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

