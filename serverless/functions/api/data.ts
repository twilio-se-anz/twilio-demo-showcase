import Airtable from "airtable";
import "@twilio-labs/serverless-runtime-types";
import {
  Context,
  ServerlessCallback,
  ServerlessFunctionSignature,
} from "@twilio-labs/serverless-runtime-types/types";

export type PluginListing = {
  name: string;
  category: string;
  description: string;
  image: string;
  repo: string;
  tags: string[];
  owner: string;
  products: string[];
  flags: string[];
  last_modified: string;
};

export type MyFunctionContext = {
  AIRTABLE_TOKEN: string;
  AIRTABLE_BASE_ID: string;
  AIRTABLE_TABLE_NAME: string;
};

// ***********************************************************
//
// SERVERLESS HANDLER ENTRY POINT
//
// ***********************************************************
export const handler: ServerlessFunctionSignature<MyFunctionContext> =
  async function (
    context: Context<MyFunctionContext>,
    event: {},
    callback: ServerlessCallback
  ) {
    const response = new Twilio.Response();
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
    response.appendHeader("Content-Type", "application/json");

    // Authenticate
    Airtable.configure({
      apiKey: context.AIRTABLE_TOKEN,
    });

    // Initialize a base
    const base = Airtable.base(context.AIRTABLE_BASE_ID);

    // Reference a table
    const table = base(context.AIRTABLE_TABLE_NAME);

    try {
      let entries: Array<PluginListing> = new Array<PluginListing>();

      await table
        .select({
          view: "Grid view",
        })
        .eachPage(function page(records, fetchNextPage) {
          // This function (`page`) will get called for each page of records.
          records.forEach((record) => {
            // console.log("Record", record);
            entries.push({
              name: record.get("Plugin") as string,
              category: record.get("Category") as string,
              description: record.get("Description") as string,
              image: record.get("Image") as string,
              repo: record.get("Repo") as string,
              tags: record.get("Tags") as string[],
              owner: record.get("Owner") as string,
              products: record.get("Products") as string[],
              flags: record.get("Flags") as string[],
              last_modified: record.get("Last Modified") as string,
            });
          });

          // To fetch the next page of records, call `fetchNextPage`.
          // If there are more records, `page` will get called again.
          // If there are no more records, `done` will get called.
          fetchNextPage();
        });

      response.setBody(entries);
      return callback(null, response);
    } catch (err) {
      console.error(err);
      response.setStatusCode(500);
      response.setBody(err ? (err as string) : "Unknown error, check logs");
      return callback(null, response);
    }
  };
