import { APIGatewayEvent } from "aws-lambda";
import { twiml } from "twilio";
import twilio from "twilio";
import qs from "querystring";

import { sendTwiml } from "./utils";
import { getItem } from "./dynamodb";

// 6. Get sms reply
// 7. Send dial tone to correct phone call

export const handler = async (event: APIGatewayEvent) => {
    const { Body, To } = qs.parse(event.body!);
    const { Item } = await getItem({ Key: { phone_number: To as string } });

    console.log(Item);

    if (Item) {
        if ((Body as string).toLowerCase().includes("yes")) {
            // open the door
            return openDoor(Item.callSid);
        } else {
            // don't open the door
            return closeDoor(Item.callSid);
        }
    } else {
        const response = new twiml.MessagingResponse();
        const message = response.message(
            "No ongoing call. Only text this number in response to a message ✌️"
        );

        return sendTwiml(message);
    }
};

// Texts user that door is openinng
// Hooks into ongoing phone call
// Sends dial tone
async function openDoor(callSid: string) {
    const success = await continueCall(callSid, true);

    const response = new twiml.MessagingResponse();
    let message;

    if (success) {
        response.message("Opened the door");
    } else {
        message = response.message("Something went wrong");
    }

    return sendTwiml(message);
}

// Texts user that door is NOT opening
// Hooks into ongoing nphone call
// Tells them to go away
async function closeDoor(callSid: string) {
    const success = await continueCall(callSid, true);

    const response = new twiml.MessagingResponse();
    let message;

    if (success) {
        message = response.message("Told them to go away");
    } else {
        message = response.message("Something went wrong");
    }

    return sendTwiml(message);
}

// This should come from AWS secrets storage, but I'm lazy
// will rotate these secrets after the stream
const accountSid = "***REMOVED***";
const authToken = "***REMOVED***";

async function continueCall(callSid: string, openDoor: boolean) {
    const client = twilio(accountSid, authToken);
    try {
        const response = new twiml.VoiceResponse();
        if (openDoor) {
            response.say("Buzzing you in");
            response.play({ digits: "w9" });
        } else {
            response.say("Sorry, residents said you can't come in");
        }

        await client.calls(callSid).update({ twiml: response.toString() });
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}
