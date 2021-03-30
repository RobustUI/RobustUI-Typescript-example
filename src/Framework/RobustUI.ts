import {Observable} from "rxjs";
import {StreamDeclaration} from "./declaration-types/StreamDeclaration";

export interface RobustUI {
    onNewConfiguration(machines?: string): Observable<string | Map<string, string>>;
    currentValue: string | Map<string, string>;
    outputs: StreamDeclaration[];
    inputs: StreamDeclaration[];
    events: StreamDeclaration[];
    sendInput(event: any): void;
    getOutputStream(label: string): Observable<any>
    registerElement(element: HTMLElement, machineName?: string): void;
    unregisterElement(element: HTMLElement, machineName?: string): void;
}
