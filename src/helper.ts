import * as AWS from 'aws-sdk';
import { ILogger } from 'typescript-ilogger';
import { BaseClass } from 'typescript-helper-functions';
import { ISESHelper } from './interface';

/**
 * SES Helper
 */
export class SESHelper extends BaseClass implements ISESHelper {

    /**
     * AWS Repository for SES
     */
    public Repository: AWS.SES;

    /**
     * Initializes new instance of SESHelper
     * @param logger {ILogger} Injected logger
     * @param repository {AWS.SES} Injected Repository. A new repository will be created if not supplied
     * @param options {AWS.SES.ClientConfiguration} Injected configuration if a Repository is supplied
     */
    constructor(logger: ILogger,
        repository?: AWS.SES,
        options?: AWS.SES.ClientConfiguration) {

        super(logger);
        this.Repository = repository || new AWS.SES(options);
    }

    /**
     * Send an email
     * @param subject {string} Subject of email
     * @param toAddresses {string[]} Array of addresses to send to
     * @param fromAddress {string} Address to send from
     * @param body {string | Buffer} HTML body of message
     */
    public async SendEmailAsync(subject: string,
        toAddresses: string[],
        fromAddress: string,
        body: string | Buffer): Promise<AWS.SES.SendEmailResponse> {

        const action = `${SESHelper.name}.${this.SendEmailAsync.name}`;
        this.LogHelper.LogInputs(action, { subject, toAddresses, fromAddress, body });

        // guard clauses
        if (this.ObjectOperations.IsNullOrWhitespace(subject)) { throw new Error(`[${action}]-Must supply subject`); }
        if (this.ObjectOperations.IsNullOrEmpty(toAddresses)) { throw new Error(`[${action}]-Must supply toAddresses`); }
        if (this.ObjectOperations.IsNullOrWhitespace(fromAddress)) { throw new Error(`[${action}]-Must supply fromAddress`); }

        // create params object
        const params: AWS.SES.SendEmailRequest = {
            Destination: {
                ToAddresses: toAddresses,
            },
            Message: {
                Body: {
                    Html: {
                        Data: body.toString(),
                    },
                },
                Subject: {
                    Data: subject,
                },
            },
            Source: fromAddress,
        };
        this.LogHelper.LogRequest(action, params);

        // make AWS call
        const response = await this.Repository.sendEmail(params).promise();
        this.LogHelper.LogResponse(action, response);

        return response;
    }
}
