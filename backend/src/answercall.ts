import { APIGatewayEvent } from "aws-lambda";

export const handler = async (event: APIGatewayEvent) => {
    if (event.httpMethod.toLowerCase() === "post") {
        // Twilio sent us a phone call, assumed to be gate buzzer box
    } else {
        // Someone got here with a browser
        return {
            statusCode: 200,
            body:
                "Hello 👋, this URL is meant to be used via a buzzer box phone call. You probably don't want to be here"
        };
    }
};

// (205) 525-8990
