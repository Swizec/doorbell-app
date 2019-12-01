// any is bad but this is a hack project anyway
export const sendTwiml = (twiml: any) => {
    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/xml"
        },
        body: twiml.toString()
    };
};
