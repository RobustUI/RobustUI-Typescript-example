import {BehaviorSubject, Observable, Subject} from "rxjs";
import {filter, map} from "rxjs/operators";
import {RobustUI} from "./RobustUI";
import {StreamDeclaration} from "./declaration-types/StreamDeclaration";

export abstract class RobustUISelectiveMachine implements RobustUI {
    private $inputStream = new Subject<number>();
    private $machineSwitch = new BehaviorSubject<string>(null);
    private configurations = new BehaviorSubject<{machine: string, state: string | Map<string, string>}>(null)
    private $outputStream = new Subject<{name: string, value: any}>()
    protected activeMachine: string;
    protected machines: Map<string, RobustUI>;
    protected inputStream = this.$inputStream.asObservable()

    protected machineSwitchStream = this.$machineSwitch.asObservable().pipe(filter((e) => e != null));
    private machineElements: Map<string, HTMLElement> = new Map<string, HTMLElement>();


    public currentValue: string;
    public abstract events: StreamDeclaration[];
    public abstract inputs: StreamDeclaration[];
    public abstract outputs: StreamDeclaration[];

    protected initialize() {
        this.machines.forEach((el, key) => {
            el.onNewConfiguration().subscribe(e => {
                if (this.activeMachine === key) {
                    this.configurations.next({machine: key, state: el.currentValue})
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
        this.activateMachine(machine)
    }

    public onNewConfiguration(machine: string): Observable<string | Map<string, string>> {
      return this.configurations.asObservable().pipe(
          filter((e) => e != null && e.machine == machine),
          map(e => e.state)
      );
    }

    public sendInput(input: number): void {
        this.$inputStream.next(input)
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
        this.machines.get(machineName).registerElement(this.machineElements.get(machineName));
    }

    private deactivateMachine(machineName: string) {
        if (machineName != null) {
            this.machines.get(machineName).unregisterElement(this.machineElements.get(machineName));
        }
    }
}
