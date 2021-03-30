import {StateDeclaration} from "./StateDeclaration";
import {StreamDeclaration} from "./StreamDeclaration";

export interface MachineDeclaration {
    initialState: string;
    states: StateDeclaration[];
    inputs: StreamDeclaration[];
    outputs: StreamDeclaration[];
}
