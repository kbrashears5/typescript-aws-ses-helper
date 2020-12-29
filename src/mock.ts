import { BaseMock } from 'typescript-helper-functions';
import * as SES from '@aws-sdk/client-ses';

/**
 * SES Mock class
 */
export class SESMock extends BaseMock {

    /**
     * Mocks an SES.SendEmailResponse response
     */
    public SendEmailResponse: SES.SendEmailResponse = { MessageId: 'message-id' };

    /**
     * Mocks an SES.SendRawEmailResponse response
     */
    public SendRawEmailResponse: SES.SendRawEmailResponse = { MessageId: 'message-id' };

    /**
     * Create the SES mock
     */
    protected CreateMock(returnError: boolean) {
        const rejectResponse = new Error(`AWS Error`);

        // implement the AWS responses
        const awsResponses = {
            // send email response
            sendEmail: {
                promise: jest.fn().mockImplementation(() => {
                    return returnError ?
                        Promise.reject(rejectResponse) :
                        Promise.resolve<SES.SendEmailResponse>(this.SendEmailResponse);
                }),
            },
            // send raw email response
            sendRawEmail: {
                promise: jest.fn().mockImplementation(() => {
                    return returnError ?
                        Promise.reject(rejectResponse) :
                        Promise.resolve<SES.SendRawEmailResponse>(this.SendRawEmailResponse);
                }),
            },
        };

        const options = {} as SES.SESClientConfig;

        // create the functions
        let functions = new SES.SES(options);
        functions = {
            sendEmail: () => awsResponses.sendEmail,
            sendRawEmail: () => awsResponses.sendRawEmail,
        };

        return functions;
    }
}
