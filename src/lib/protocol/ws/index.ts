import _ from "lodash";
import ws from "ws";
import actionController from "../../action";
import env from "../../env";

class WebSocket {
  private readonly ws: ws.WebSocket = new ws.WebSocket(
    `ws://${env.SQS_SERVER_END_POINT}`,
  );

  connect = (): void => {
    if (!_.isEmpty(this.ws)) {
      this.ws.onopen = (event: ws.Event): void => {
        this.sendMessage("{SubScribe Server Name} Completely Connection");

        // * connection하면 listener 등록.
        this.onMessage();
        this.onError();
      };
    }
  };

  onMessage = (): void => {
    if (!_.isEmpty(this.ws)) {
      this.ws.onmessage = (messageEvent: ws.MessageEvent): void => {
        // type ws.Data to string
        const message: string = String(messageEvent.data);
        console.log(`SubScribe Message ${message}`);
        this.sendMessage("{SubScribe Server Name} Completely Get Message");

        actionController({
          action: message,
        });
      };
    }
  };

  onError = (): void => {
    if (!_.isEmpty(this.ws)) {
      this.ws.onerror = (errorEvent: ws.ErrorEvent): void => {
        console.log(`ErrorEvent ${errorEvent.error}`);
        console.log(`ErrorEvent Message ${errorEvent.message}`);
        this.sendMessage(`{SubScribe Server Name} Error ${errorEvent.message}`);
      };
    }
  };

  sendMessage = (message: string): void => {
    if (!_.isEmpty(this.ws)) {
      this.ws.send(message);
    }
  };
}

export default new WebSocket();
