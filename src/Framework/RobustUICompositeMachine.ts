import {RobustUIMachine} from "./RobustUIMachine";
import {BehaviorSubject, Observable, of, Subject} from "rxjs";
import {filter, map, take} from "rxjs/operators";
import {RobustUI} from "./RobustUI";
import {StreamDeclaration} from "./declaration-types/StreamDeclaration";
import {Configuration} from "./configuration";

export abstract class RobustUICompositeMachine implements RobustUI{
    protected machines: Map<string, RobustUI>;
    private $outputStream = new Subject<{name: string, value: any}>()
    private $configurations = new BehaviorSubject<Configuration[]>(null)
    private configurations = new Map<string, any>();
    public onNewConfiguration(): Observable<Configuration[]>{
        return this.$configurations.asObservable().pipe(filter(e => e != null));
    }

    protected initialize() {
       this.machines.forEach((el, key) => {
            el.onNewConfiguration().subscribe(config => {
                config.forEach(machine => {
                    if (key == machine.machine) {
                        this.configurations.set(machine.machine, machine.state);
                    } else {
                        this.configurations.set(key, config);
                    }
                });

                const newConfig: Configuration[] = [];
                this.configurations.forEach((state, name) => {
                    newConfig.push({machine: name, state: state})
                });
                this.$configurations.next(newConfig);
            });
            el.outputs.forEach((output) => {
                el.getOutputStream(output.stream.toLowerCase()).subscribe((event) => {
                    this.$outputStream.next({name: output.stream.toLowerCase(), value: event})
                });
            })
        });
    }
    public get currentValue(): Configuration[]{
        const newConfig: Configuration[] = [];

        this.configurations.forEach((state, name) => {
            newConfig.push({machine: name, state: state})
        });

        return newConfig;
    }

    public registerElement(element: HTMLElement, machine: string): void {
        this.machines.forEach((state, name) => {
            const split = machine.split('::');

            if (split[0] === name && split.length > 1) {
                this.machines.get(name).registerElement(element, split[1]);
            } else if (split[0] === name && split.length === 1) {
                this.machines.get(name).registerElement(element);
            }
        });
    }
    public unregisterElement(element: HTMLElement, machine: string): void {
        this.machines.forEach((state, name) => {
            const split = machine.split('::');

            if (split[0] === name && split.length > 1) {
                this.machines.get(name).unregisterElement(element, split[1]);
            } else if (split[0] === name && split.length === 1) {
                this.machines.get(name).unregisterElement(element);
            }
        });
    }

    public events: StreamDeclaration[];
    public inputs: StreamDeclaration[];
    public outputs: StreamDeclaration[];

    public getOutputStream(name: string): Observable<any> {
        return this.$outputStream.asObservable().pipe(
            filter(e => e.name === name),
            map(e => e.value)
        )
    }

    public sendInput(event: string, data:any = null): void {
        console.log(event);
        this.machines.forEach(m => {
           m.sendInput(event, data);
        });
    }
}
