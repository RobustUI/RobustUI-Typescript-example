import { Observable } from "rxjs";
import { Configuration } from "../Framework/configuration";
import { MachineDeclaration } from "../Framework/declaration-types/MachineDeclaration";
import { StateDeclaration } from "../Framework/declaration-types/StateDeclaration";
import { StreamDeclaration } from "../Framework/declaration-types/StreamDeclaration";
import { RobustUI } from "../Framework/RobustUI";
import { RobustUICompositeMachine } from "../Framework/RobustUICompositeMachine";
import {
  RobustUIMachine,
  RobustUIActions,
  ActionEvent,
} from "../Framework/RobustUIMachine";
import { RobustUISelectiveMachine } from "../Framework/RobustUISelectiveMachine";

export type P9CompMachines =
  | "Login"
  | "Register"
  | "Register::email"
  | "email"
  | "Register::email::student"
  | "Register::email::employee"
  | "Register::email::unknown";
export class P9Comp extends RobustUISelectiveMachine {
  protected machines = new Map<P9CompMachines, RobustUI>();
  constructor() {
    super();
    this.machines.set("Login", new LoginForm());
    this.machines.set("Register", new RegisterForm());
    this.initialize();
    this.inputStream.subscribe((value) => {
      if (value == 1) {
        this.switchMachine("Register");
      } else {
        this.switchMachine("Login");
      }
    });
  }
  public outputs: StreamDeclaration[] = [];
  public inputs: StreamDeclaration[] = [
    {
      stream: "stream",
    },
  ];
  public events: StreamDeclaration[] = [];
  public get onMachineSwitch(): Observable<P9CompMachines> {
    return this.machineSwitchStream as Observable<P9CompMachines>;
  }
  public onNewConfiguration(
    machine: P9CompMachines
  ): Observable<Configuration[]> {
    return super.onNewConfiguration(machine);
  }
  public getOutputStream(name: string): Observable<any> {
    return super.getOutputStream(name);
  }
}
export type LoginFormMachine = "";
export class LoginForm extends RobustUICompositeMachine {
  protected machines = new Map<LoginFormMachine, RobustUI>();
  constructor() {
    super();
    this.initialize();
  }
  public outputs: StreamDeclaration[] = [];
  public inputs: StreamDeclaration[] = [];
  public events: StreamDeclaration[] = [];
  public registerElement(
    element: HTMLElement,
    machine: LoginFormMachine
  ): void {
    super.registerElement(element, machine);
  }
  public unregisterElement(
    element: HTMLElement,
    machine: LoginFormMachine
  ): void {
    super.unregisterElement(element, machine);
  }
  public onNewConfiguration(): Observable<Configuration[]> {
    return super.onNewConfiguration();
  }
}
export type RegisterFormMachine =
  | "email"
  | "email::student"
  | "email::employee"
  | "email::unknown";
export class RegisterForm extends RobustUICompositeMachine {
  protected machines = new Map<RegisterFormMachine, RobustUI>();
  constructor() {
    super();
    this.machines.set("email", new emailResult());
    this.initialize();
  }
  public outputs: StreamDeclaration[] = [];
  public inputs: StreamDeclaration[] = [];
  public events: StreamDeclaration[] = [];
  public registerElement(
    element: HTMLElement,
    machine: RegisterFormMachine
  ): void {
    super.registerElement(element, machine);
  }
  public unregisterElement(
    element: HTMLElement,
    machine: RegisterFormMachine
  ): void {
    super.unregisterElement(element, machine);
  }
  public onNewConfiguration(): Observable<Configuration[]> {
    return super.onNewConfiguration();
  }
}
export type emailResultMachines = "student" | "employee" | "unknown";
export class emailResult extends RobustUISelectiveMachine {
  protected machines = new Map<emailResultMachines, RobustUI>();
  constructor() {
    super();
    this.machines.set("student", new TextInput("student"));
    this.machines.set("employee", new TextInput("employee"));
    this.machines.set("unknown", new TextInput("unknown"));
    this.initialize();
    this.inputStream.subscribe((value) => {
      if (value == 0) {
        this.switchMachine("student");
      } else if (value == 1) {
        this.switchMachine("employee");
      } else {
        this.switchMachine("unknown");
      }
    });
  }
  public outputs: StreamDeclaration[] = [];
  public inputs: StreamDeclaration[] = [
    {
      stream: "email",
    },
  ];
  public events: StreamDeclaration[] = [];
  public get onMachineSwitch(): Observable<emailResultMachines> {
    return this.machineSwitchStream as Observable<emailResultMachines>;
  }
  public onNewConfiguration(
    machine: emailResultMachines
  ): Observable<Configuration[]> {
    return super.onNewConfiguration(machine);
  }
  public getOutputStream(name: string): Observable<any> {
    return super.getOutputStream(name);
  }
}
export type TextInputState = "not_focus";
export type TextInputOutputStreams = "";
export class TextInput extends RobustUIMachine {
  private states: StateDeclaration[] = [
    {
      name: "not_focus",
      transitions: [],
    },
  ];
  private initialState = "not_focus";
  public outputs: StreamDeclaration[] = [];
  public inputs: StreamDeclaration[] = [];
  public events: StreamDeclaration[] = [];
  protected machineDeclaration: MachineDeclaration;

  constructor(name: string) {
    super(name);

    this.machineDeclaration = {
      initialState: this.initialState,
      states: this.states,
      inputs: this.inputs,
      outputs: this.outputs,
    };

    this.initialize();
  }

  public getOutputStream(label: TextInputOutputStreams): Observable<any> {
    return super.getOutputStream(label);
  }

  public when(
    state: TextInputState,
    action: RobustUIActions
  ): Observable<ActionEvent> {
    return super.when(state, action);
  }
}
