import {RobustUIMachine} from "./RobustUIMachine";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {filter, map} from "rxjs/operators";
import {RobustUI} from "./RobustUI";
import {StreamDeclaration} from "./declaration-types/StreamDeclaration";

export abstract class RobustUICompositeMachine implements RobustUI{
    protected machines: Map<string, RobustUI>;
    private $outputStream = new Subject<{name: string, value: any}>()
    private configurations = new BehaviorSubject<Map<string, string>>(null)

    public onNewConfiguration(): Observable<Map<string, string>>{
        return this.configurations.asObservable().pipe(filter(e => e != null));
    }

    protected initialize() {
       this.machines.forEach((el, key) => {
            el.onNewConfiguration().subscribe(e => {
                this.currentValue;
            });
            el.outputs.forEach((output) => {
                el.getOutputStream(output.stream.toLowerCase()).subscribe((event) => {
                    this.$outputStream.next({name: output.stream.toLowerCase(), value: event})
                });
            })
        });
    }
    public get currentValue(): Map<string, string> {
        const ret = new Map<string, string>();

        this.machines.forEach((value, key)=> {
            ret.set(key, value.currentValue as string)
        });

        this.configurations.next(ret);
        return ret;
    }

    public abstract registerElement(element: HTMLElement, machine: string): void;
    public abstract unregisterElement(element: HTMLElement, machine: string): void;

    public events: StreamDeclaration[];
    public inputs: StreamDeclaration[];
    public outputs: StreamDeclaration[];

    public getOutputStream(name: string): Observable<any> {
        return this.$outputStream.asObservable().pipe(
            filter(e => e.name === name),
            map(e => e.value)
        )
    }

    public sendInput(event: string): void {
    }
}
