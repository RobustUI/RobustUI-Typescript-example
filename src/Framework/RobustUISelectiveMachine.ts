import {BehaviorSubject, Observable, Subject} from "rxjs";
import {filter, map} from "rxjs/operators";
import {RobustUI} from "./RobustUI";
import {StreamDeclaration} from "./declaration-types/StreamDeclaration";
import {Configuration} from "./configuration";

export abstract class RobustUISelectiveMachine implements RobustUI {
    private $inputStream = new Subject<number>();
    private $machineSwitch = new BehaviorSubject<string>(null);
    private configurations = new BehaviorSubject<Configuration[]>(null)
    private $outputStream = new Subject<{ name: string, value: any }>()
    protected activeMachine: string;
    protected machines: Map<string, RobustUI>;
    protected inputStream = this.$inputStream.asObservable()

    protected machineSwitchStream = this.$machineSwitch.asObservable().pipe(filter((e) => e != null));
    private machineElements: Map<string, HTMLElement> = new Map<string, HTMLElement>();

    public currentValue: Configuration[];
    public abstract events: StreamDeclaration[];
    public abstract inputs: StreamDeclaration[];
    public abstract outputs: StreamDeclaration[];

    protected initialize() {
        this.machines.forEach((el, key) => {
            el.onNewConfiguration().subscribe(e => {
                if (this.activeMachine === key) {
                    this.configurations.next(el.currentValue)
                }
            });
            el.outputs.forEach((output) => {
                el.getOutputStream(output.stream.toLowerCase()).subscribe((event) => {
                    this.$outputStream.next({name: output.stream.toLowerCase(), value: event})
                });
            })
        });
    }

    protected switchMachine(machine: string) {
        this.deactivateMachine(this.activeMachine)
        this.activeMachine = machine;
        this.$machineSwitch.next(machine);
        this.configurations.next(this.machines.get(machine).currentValue)
        this.activateMachine(machine)
    }

    public onNewConfiguration(machine?: string): Observable<Configuration[]> {
        if (machine == null) {
            return this.configurations.asObservable().pipe(filter(e => e != null && e.length > 0));
        } else {
            return this.configurations.asObservable().pipe(
                filter((e) => e != null && e.length > 0 && e[0].machine == machine)
            );
        }
    }

    public sendInput(event: string, data: number): void {
        if (this.inputs.find(input => input.stream === event) != null) {
            this.$inputStream.next(data)
        }
    }

    public getOutputStream(name: string): Observable<any> {
        return this.$outputStream.asObservable().pipe(
            filter(e => e.name === name),
            map(e => e.value)
        )
    }

    public registerElement(element: HTMLElement, machineName: string): void {
        this.machineElements.set(machineName, element)
    }

    public unregisterElement(element: HTMLElement, machineName: string):void {
        this.deactivateMachine(machineName);
        this.machineElements.delete(machineName);
    }

    private activateMachine(machineName: string) {
        this.machineElements.forEach((el, key) => {
           const split = key.split('::');

           if (split[0] === machineName && split.length > 1) {
               this.machines.get(machineName).registerElement(el, split[1]);
           } else if (split[0] === machineName && split.length === 1) {
               this.machines.get(machineName).registerElement(el);
           }
        });
    }

    private deactivateMachine(machineName: string) {
        this.machineElements.forEach((el, key) => {
            const split = key.split('::');

            if (split[0] === machineName && split.length > 1) {
                this.machines.get(machineName).unregisterElement(el, split[1]);
            } else if (split[0] === machineName && split.length === 1) {
                this.machines.get(machineName).unregisterElement(el);
            }
        });
    }
}
