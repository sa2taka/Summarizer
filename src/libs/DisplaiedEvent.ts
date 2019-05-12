export class DisplaiedEvent {
  public type!: EventType;
  public display!: string;

  public constructor(display: string, type: EventType = EventType.Success) {
    this.display = display;
    this.type = type;
  }
}

export enum EventType {
  Success = 'success',
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
}
