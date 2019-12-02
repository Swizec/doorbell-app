import { APIGatewayEvent } from "aws-lambda";
import { twiml } from "twilio";
import qs from "querystring";

import { sendTwiml } from "./utils";

// 6. Get sms reply
// 7. Send dial tone to correct phone call

export const handler = async (event: APIGatewayEvent) => {
    const { Body, To } = qs.parse(event.body!);

    if ((Body as string).toLowerCase().includes("yes")) {
        // open the door
        return openDoor(To as string);
    } else {
        // don't open the door
        return closeDoor(To as string);
    }
};

// Texts user that door is openinng
// Hooks into ongoing phone call
// Sends dial tone
async function openDoor(phoneNumber: string) {
    const response = new twiml.MessagingResponse();
    const message = response.message("Letting them in");

    return sendTwiml(message);
}

// Texts user that door is NOT opening
// Hooks into ongoing nphone call
// Tells them to go away
async function closeDoor(phoneNumber: string) {
    const response = new twiml.MessagingResponse();
    const message = response.message("Telling them to go away");

    return sendTwiml(message);
}
