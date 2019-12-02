import { APIGatewayEvent } from "aws-lambda";
import qs from "querystring";
import twilio from "twilio";

// 5. Send text to swizec

// This should come from AWS secrets storage, but I'm lazy
// will rotate these secrets after the stream
const accountSid = "***REMOVED***";
const authToken = "***REMOVED***";

export const handler = async (event: APIGatewayEvent) => {
    const { RecordingUrl, TranscriptionText, CallSid } = qs.parse(event.body!);

    console.log(process.env.PHONE_NUMBER);

    const client = twilio(accountSid, authToken);
    await client.messages.create({
        body: `There's someone at the door!\n\n
        "${TranscriptionText}"\n\n
        recording: ${RecordingUrl}\n
        Reply YES to let them in!
        `,
        to: "+16505375963",
        from: process.env.PHONE_NUMBER
    });

    return {
        statusCode: 200,
        body: "success"
    };
};
