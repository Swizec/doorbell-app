import { APIGatewayEvent } from "aws-lambda";
import { twiml } from "twilio";
import { sendTwiml } from "./utils";

export const handler = async (event: APIGatewayEvent) => {
    if (event.httpMethod.toLowerCase() === "post") {
        // Twilio sent us a phone call, assumed to be gate buzzer box
        return handleBuzzerCall();
    } else {
        // Someone got here with a browser
        return {
            statusCode: 200,
            body:
                "Hello 👋, this URL is meant to be used via a buzzer box phone call. You probably don't want to be here"
        };
    }
};

async function handleBuzzerCall() {
    const response = new twiml.VoiceResponse();
    response.say(
        "Welcome to our place. What do you want? Answer after the beep, then press any key"
    );
    response.record({
        action: "acceptRecording",
        timeout: 60,
        transcribe: true,
        transcribeCallback: "acceptTranscript"
    });

    // Steps to handle:
    // 1. Say hello, prompt for a name/purpose
    // 2. Record response
    // 3. Transcribe response

    return sendTwiml(response);
}

// (205) 525-8990
