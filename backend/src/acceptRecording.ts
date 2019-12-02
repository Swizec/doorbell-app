import { APIGatewayEvent } from "aws-lambda";
import { twiml } from "twilio";
import { sendTwiml } from "./utils";

// 4. Pause call
// 4.1 if call still going, tell visitor to try again

export const handler = async (event: APIGatewayEvent) => {
    const response = new twiml.VoiceResponse();

    response.say("Thank you. Someone will let you in right away.");
    response.pause({
        length: 60
    });
    response.say("Looks like nobody answered, try callinng a real human.");

    return sendTwiml(response);
};
