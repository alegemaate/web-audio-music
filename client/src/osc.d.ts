declare module "osc" {
  import EventEmitter from "events";

  export interface PortSendParams {
    address: string;
    args: (number | string)[];
  }

  export interface UDPParams {
    localPort?: string;
    localAddress?: string;
    remoteAddress?: string;
    broadcast?: boolean;
    multicastTTL?: number;
    multicastMembership?: string[];
    socket?: any;
    metadata?: boolean;
  }

  export interface WebSocketPortParams {
    url?: string;
    metadata?: boolean;
  }

  export interface RelayParams {
    port1?: number;
    port2?: number;
    options?: any;
  }

  export class WebSocketPort extends EventEmitter {
    constructor(params: WebSocketPortParams);
    send: (packet: PortSendParams) => void;
    open: () => void;
  }

  export class UDP extends EventEmitter {
    constructor(params: UDPParams);
  }

  export class Relay extends EventEmitter {
    constructor(params: RelayParms);
  }
}
