import { Email } from './email';

/**
 * SES Helper
 */
export interface ISESHelper {

    /**
     * AWS Repository for SES
     */
    Repository: AWS.SES;

    /**
     * Send an email
     * @param subject {string} Subject of email
     * @param toAddresses {string[]} Array of addresses to send to
     * @param fromAddress {string} Address to send from
     * @param body {string | Buffer} HTML body of message
     */
    SendEmailAsync(subject: string,
        toAddresses: string[],
        fromAddress: string,
        body: string | Buffer): Promise<AWS.SES.SendEmailResponse>;

    /**
     * Sends an email. Optionally sends with attachments
     * @param emailObject {Email} Parameters to send
     */
    SendEmailWithAttachmentsAsync(emailObject: Email): Promise<AWS.SES.SendRawEmailResponse>;
}
