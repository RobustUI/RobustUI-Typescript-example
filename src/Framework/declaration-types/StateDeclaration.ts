import {TransitionDeclaration} from "./TransitionDeclaration";

export interface StateDeclaration {
    name: string;
    transitions: TransitionDeclaration[];
}
