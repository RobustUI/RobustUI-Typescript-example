import {Observable} from "rxjs";
import {StreamDeclaration} from "./declaration-types/StreamDeclaration";
import {Configuration} from "./configuration";

export interface RobustUI {
    onNewConfiguration(machines?: string): Observable<Configuration[]>;
    currentValue: Configuration[];
    outputs: StreamDeclaration[];
    inputs: StreamDeclaration[];
    events: StreamDeclaration[];
    sendInput(inputEvent: string, data?: any): void;
    getOutputStream(label: string): Observable<any>
    registerElement(element: HTMLElement, machineName?: string): void;
    unregisterElement(element: HTMLElement, machineName?: string): void;
}
