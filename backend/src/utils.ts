import AWS from "aws-sdk";

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

// this type should be more generic
type Secret = {
    accountSid: string;
    authToken: string;
};

// this memoizes secrets so we can save on API requests
// assumes lambda is still warm, useful in the general case
// I probably don't have enough visitors for it to matter :)
const secrets: { [key: string]: Secret } = {};

// access secrets manager to get twilio tokens
// returns an object like:
// { accountSid: "", authToken: "" }
// because that's how they were saved in SSM
export const twilioTokens = async () => {
    const SecretId = "twilioAPIAuth";
    const ssm = new AWS.SecretsManager();
    const data = await ssm
        .getSecretValue({
            SecretId
        })
        .promise();

    if (!("SecretString" in data)) {
        throw new Error(`Error getting secret twilioAPIAuth`);
    }

    if (data.SecretString) {
        // real production should expire this cache
        secrets[SecretId] = JSON.parse(data.SecretString);
    } else {
        throw new Error(`Error getting secret twilioAPIAuth`);
    }

    return secrets[SecretId];
};
