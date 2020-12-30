import { Email } from './email';
import * as SES from '@aws-sdk/client-ses';

/**
 * SES Helper
 */
export interface ISESHelper {
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
        body: string | Buffer): Promise<SES.SendEmailResponse>;

    /**
     * Sends an email. Optionally sends with attachments
     * @param emailObject {Email} Parameters to send
     */
    SendEmailWithAttachmentsAsync(emailObject: Email): Promise<SES.SendRawEmailResponse>;
}
