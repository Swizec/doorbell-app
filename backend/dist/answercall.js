"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const twilio_1 = require("twilio");
const utils_1 = require("./utils");
exports.handler = async (event) => {
    if (event.httpMethod.toLowerCase() === "post") {
        // Twilio sent us a phone call, assumed to be gate buzzer box
        return handleBuzzerCall();
    }
    else {
        // Someone got here with a browser
        return {
            statusCode: 200,
            body: "Hello 👋, this URL is meant to be used via a buzzer box phone call. You probably don't want to be here"
        };
    }
};
async function handleBuzzerCall() {
    const response = new twilio_1.twiml.VoiceResponse();
    response.say("Welcome to our place. What do you want? Answer after the beep, then press any key");
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
    return utils_1.sendTwiml(response);
}
// (205) 525-8990
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5zd2VyY2FsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9hbnN3ZXJjYWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsbUNBQStCO0FBQy9CLG1DQUFvQztBQUV2QixRQUFBLE9BQU8sR0FBRyxLQUFLLEVBQUUsS0FBc0IsRUFBRSxFQUFFO0lBQ3BELElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsS0FBSyxNQUFNLEVBQUU7UUFDM0MsNkRBQTZEO1FBQzdELE9BQU8sZ0JBQWdCLEVBQUUsQ0FBQztLQUM3QjtTQUFNO1FBQ0gsa0NBQWtDO1FBQ2xDLE9BQU87WUFDSCxVQUFVLEVBQUUsR0FBRztZQUNmLElBQUksRUFDQSx3R0FBd0c7U0FDL0csQ0FBQztLQUNMO0FBQ0wsQ0FBQyxDQUFDO0FBRUYsS0FBSyxVQUFVLGdCQUFnQjtJQUMzQixNQUFNLFFBQVEsR0FBRyxJQUFJLGNBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUMzQyxRQUFRLENBQUMsR0FBRyxDQUNSLG1GQUFtRixDQUN0RixDQUFDO0lBQ0YsUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUNaLE1BQU0sRUFBRSxpQkFBaUI7UUFDekIsT0FBTyxFQUFFLEVBQUU7UUFDWCxVQUFVLEVBQUUsSUFBSTtRQUNoQixrQkFBa0IsRUFBRSxrQkFBa0I7S0FDekMsQ0FBQyxDQUFDO0lBRUgsbUJBQW1CO0lBQ25CLDBDQUEwQztJQUMxQyxxQkFBcUI7SUFDckIseUJBQXlCO0lBRXpCLE9BQU8saUJBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixDQUFDO0FBRUQsaUJBQWlCIn0=