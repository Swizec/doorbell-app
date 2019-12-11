import { APIGatewayEvent } from "aws-lambda";
import qs from "querystring";
import twilio from "twilio";
import { updateItem } from "./dynamodb";
import { twilioTokens } from "./utils";

// 5. Send text to swizec

// Should be configurable in DB?
const recipients = ["+16505375963", "+16506446545"];

export const handler = async (event: APIGatewayEvent) => {
    const { accountSid, authToken } = await twilioTokens();
    const { RecordingUrl, TranscriptionText, CallSid, Called } = qs.parse(
        event.body!
    );

    // Save (CallSid, Called) pair for lookup in SMS handler
    await updateItem({
        Key: { phone_number: Called as string },
        UpdateExpression:
            "SET callSid = :callSid, createdAt = :createdAt, handledAt = :handledAt",
        ExpressionAttributeValues: {
            ":callSid": CallSid as string,
            ":createdAt": new Date().toISOString(),
            ":handledAt": null
        }
    });

    const client = twilio(accountSid, authToken);
    for (let recipient of recipients) {
        await client.messages.create({
            body: `There's someone at the door!\n\n
        transcript: "${TranscriptionText}"\n\n
        recording: ${RecordingUrl}\n
        Reply YES to let them in!
        `,
            to: recipient,
            from: Called as string
        });
    }

    return {
        statusCode: 200,
        body: "success"
    };
};
