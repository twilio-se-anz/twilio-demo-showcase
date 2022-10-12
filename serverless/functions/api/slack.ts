import axios from "axios";
import "@twilio-labs/serverless-runtime-types";
import {
  Context,
  ServerlessCallback,
  ServerlessFunctionSignature,
} from "@twilio-labs/serverless-runtime-types/types";

export type MyFunctionContext = {
  SLACK_HOOK_URL: string;
};

type EventProperties = {
  name: string;
  owner: string;
  repo: string;
};

type EventContext = {
  ip: string;
  userAgent: string;
};

type MyEvent = {
  type: string;
  properties: EventProperties;
  context: EventContext;
};

// ***********************************************************
//
// SERVERLESS HANDLER ENTRY POINT
//
// ***********************************************************
export const handler: ServerlessFunctionSignature<MyFunctionContext, MyEvent> =
  async function (
    context: Context<MyFunctionContext>,
    event: MyEvent,
    callback: ServerlessCallback
  ) {
    const response = new Twilio.Response();
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
    response.appendHeader("Content-Type", "application/json");

    try {
      console.log("Incoming event", event);
      const payload = {
        type: event.type,
        listing: event.properties.name,
        owner: event.properties.owner,
        repo: event.properties.repo,
        ip: event.context.ip,
        userAgent: event.context.userAgent,
      };

      const options = {
        method: "post",
        baseURL: context.SLACK_HOOK_URL,
        data: payload,
      };

      await axios.request(options);

      return callback(null, response);
    } catch (err) {
      console.error(err);
      response.setStatusCode(500);
      response.setBody(err ? (err as string) : "Unknown error, check logs");
      return callback(null, response);
    }
  };
