import { APIGatewayEvent } from "aws-lambda";
import { twiml } from "twilio";
import twilio from "twilio";
import qs from "querystring";

import { sendTwiml, twilioTokens } from "./utils";
import { getItem, updateItem } from "./dynamodb";

// 6. Get sms reply
// 7. Send dial tone to correct phone call

export const handler = async (event: APIGatewayEvent) => {
    const { Body, To } = qs.parse(event.body!);
    const { Item } = await getItem({ Key: { phone_number: To as string } });

    if (Item && !Item.handledAt && !outdated(Item)) {
        if ((Body as string).toLowerCase().includes("yes")) {
            // open the door
            return openDoor(Item.callSid, To as string);
        } else {
            // don't open the door
            return closeDoor(Item.callSid, To as string);
        }
    } else {
        const response = new twiml.MessagingResponse();
        let text =
            "No ongoing call. Only text this number in response to a message ✌️";

        if (Item) {
            // call was found
            if (Item.handledAt) {
                text = "Someone else already answered the door";
            } else if (outdated(Item)) {
                text = "You missed the 60second timeout";
            }
        }

        return sendTwiml(response.message(text));
    }
};

function outdated(Item: any) {
    return Number(new Date(Item.createdAt)) < Number(new Date()) - 60 * 1000;
}

// Texts user that door is openinng
// Hooks into ongoing phone call
// Sends dial tone
async function openDoor(callSid: string, phone_number: string) {
    const success = await continueCall(callSid, true);

    const response = new twiml.MessagingResponse();
    let message;

    if (success) {
        message = response.message("Opened the door");

        // flag call as handled
        await updateItem({
            Key: { phone_number },
            UpdateExpression: "SET handledAt = :handledAt",
            ExpressionAttributeValues: {
                ":handledAt": new Date().toISOString()
            }
        });
    } else {
        message = response.message("Something went wrong");
    }

    return sendTwiml(message);
}

// Texts user that door is NOT opening
// Hooks into ongoing nphone call
// Tells them to go away
async function closeDoor(callSid: string, phone_number: string) {
    const success = await continueCall(callSid, true);

    const response = new twiml.MessagingResponse();
    let message;

    if (success) {
        message = response.message("Told them to go away");

        // flag call as handled
        await updateItem({
            Key: { phone_number },
            UpdateExpression: "SET handledAt = :handledAt",
            ExpressionAttributeValues: {
                ":handledAt": new Date().toISOString()
            }
        });
    } else {
        message = response.message("Something went wrong");
    }

    return sendTwiml(message);
}

async function continueCall(callSid: string, openDoor: boolean) {
    const { accountSid, authToken } = await twilioTokens();
    const client = twilio(accountSid, authToken);
    try {
        const response = new twiml.VoiceResponse();
        if (openDoor) {
            response.say("Buzzing you in");
            response.play({ digits: "ww9wwww" });
        } else {
            response.say("Sorry, residents said you can't come in");
        }

        await client.calls(callSid).update({ twiml: response.toString() });
        return true;
    } catch (e) {
        console.log("Error continuing call");
        console.log(e);
        return false;
    }
}
