import { APIGatewayEvent } from "aws-lambda";
import qs from "querystring";
import twilio from "twilio";
import { updateItem } from "./dynamodb";

// 5. Send text to swizec

// This should come from AWS secrets storage, but I'm lazy
// will rotate these secrets after the stream
const accountSid = "***REMOVED***";
const authToken = "***REMOVED***";

export const handler = async (event: APIGatewayEvent) => {
    const { RecordingUrl, TranscriptionText, CallSid, Called } = qs.parse(
        event.body!
    );

    // Save (CallSid, Called) pair for lookup in SMS handler
    await updateItem({
        Key: { phone_number: Called as string },
        UpdateExpression: "SET callSid = :callSid, createdAt = :createdAt",
        ExpressionAttributeValues: {
            ":callSid": CallSid as string,
            ":createdAt": new Date().toISOString()
        }
    });

    const client = twilio(accountSid, authToken);
    await client.messages.create({
        body: `There's someone at the door!\n\n
        transcript: "${TranscriptionText}"\n\n
        recording: ${RecordingUrl}\n
        Reply YES to let them in!
        `,
        to: "+16505375963",
        from: Called as string
    });

    return {
        statusCode: 200,
        body: "success"
    };
};
