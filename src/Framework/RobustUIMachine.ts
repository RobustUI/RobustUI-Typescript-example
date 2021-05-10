import {MachineDeclaration} from "./declaration-types/MachineDeclaration";
import {StateDeclaration} from "./declaration-types/StateDeclaration";
import {BehaviorSubject, fromEvent, Observable, of, Subject, Subscription} from "rxjs";
import {filter, map, tap} from "rxjs/operators";
import {TransitionDeclaration} from "./declaration-types/TransitionDeclaration";
import {StreamDeclaration} from "./declaration-types/StreamDeclaration";
import {RobustUI} from "./RobustUI";
import {Configuration} from "./configuration";

export type RobustUIActions = 'onExit' | 'onEnter' | 'onTransition';

export abstract class RobustUIMachine implements RobustUI {
    protected abstract machineDeclaration: MachineDeclaration;
    protected actionSubject = new Subject<ActionEvent>();
    private currentState: StateDeclaration;
    private outputStream: Map<string, Subject<TransitionDeclaration>> = new Map<string, Subject<TransitionDeclaration>>();
    public abstract outputs: StreamDeclaration[];
    public abstract inputs: StreamDeclaration[];
    public abstract events: StreamDeclaration[];

    protected constructor(private name: string) {
    }

    public get currentValue(): Configuration[] {
        return [
            {
                machine: this.name,
                state: this.currentState.name
            }
        ];
    }

    private eventSubscriptions: Subscription[] = [];
    private configuration = new BehaviorSubject<Configuration[]>(null);

    public onNewConfiguration(): Observable<Configuration[]> {
        return this.configuration.asObservable().pipe(filter(e => e != null));
    }

    protected initialize() {
        this.currentState = this.machineDeclaration.states.find(e => e.name == this.machineDeclaration.initialState);
        if (!this.currentState) {
            throw Error('Could not find a state definition for initial state (\'' + this.machineDeclaration.initialState + '\')');
        }

        this.machineDeclaration.outputs.forEach(e => {
            this.outputStream.set(e.stream.toLowerCase(), new Subject());
        });

        return this.currentState;
    }

    public sendInput(label: string, data: any = null): void {
        this.transition(label);
    }

    public getOutputStream(label: string): Observable<any> {
        return this.outputStream.get(label.toLowerCase()).asObservable().pipe(
            tap((transition: TransitionDeclaration) => {
                this.finishTransition(transition);
            }),
            map((transition: TransitionDeclaration) => {
                return of(transition != null);
            })
        );
    }

    protected transition(event: string): string {
        const subjects = this.currentState.transitions.filter(e => e.label.startsWith(event));
        const transition = subjects[0];

        if (!transition) {
            return;
        }

        if (transition.label.indexOf('/') >= 0) {
            const startPos = transition.label.indexOf('/') + 1;
            const outputStream = transition.label.substr(startPos).replace('!', '')
            this.outputStream.get(outputStream).next(transition);
        } else if (this.outputs.find(o => o.stream === transition.label) != null) {
            this.outputStream.get(transition.label).next(transition);
        } else {
            this.finishTransition(transition);
        }
    }

    protected when(state: string, action: RobustUIActions): Observable<ActionEvent> {
        return this.actionSubject.asObservable().pipe(
            filter((event: ActionEvent) => {
                return event.state === state && event.action === action;
            }),
        );
    };

    private finishTransition(transition: TransitionDeclaration) {
        const destination = this.machineDeclaration.states.find(e => e.name === transition.target);
        if (!destination) {
            return;
        }

        this.actionSubject.next({
            action: 'onTransition',
            state: this.currentState.name,
            target: transition.target,
            label: transition.label
        });

        this.actionSubject.next({
            action: 'onExit',
            state: this.currentState.name
        });

        this.actionSubject.next({
            action: 'onEnter',
            state: destination.name
        })

        this.currentState = destination;
        this.configuration.next([
            {
                machine: this.name,
                state: this.currentState.name
            }
        ]);

        let instantTransition = destination.transitions.find(e => this.outputs.find(o => o.stream === e.label) != null);
        if (instantTransition != null) {
            this.transition(instantTransition.label)
        }

        return destination;
    }


    public registerElement(element: HTMLElement): void {
        this.events.forEach(event => {
            this.eventSubscriptions.push(fromEvent(element, event.stream).subscribe(_ => {
                this.transition(event.stream);
            }));
        })
    };

    public unregisterElement(element: HTMLElement): void {
        this.eventSubscriptions.forEach(e => e.unsubscribe());
        this.eventSubscriptions = [];
    }
}

export interface ActionEvent {
    state: string;
    label?: string;
    target?: string;
    action: RobustUIActions;
}
