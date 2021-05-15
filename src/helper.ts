import * as SES from '@aws-sdk/client-ses';
import { ILogger } from 'typescript-ilogger';
import { BaseClass } from 'typescript-helper-functions';
import { ISESHelper } from './interface';
import { Email } from './email';

/**
 * SES Helper
 */
export class SESHelper extends BaseClass implements ISESHelper {
  /**
   * AWS Repository for SES
   */
  private Repository: SES.SES;

  /**
   * Initializes new instance of SESHelper
   * @param logger {ILogger} Injected logger
   * @param repository {SES.SES} Injected Repository. A new repository will be created if not supplied
   * @param options {SES.SESClientConfig} Injected configuration if a Repository is supplied
   */
  constructor(
    logger: ILogger,
    repository?: SES.SES,
    options?: SES.SESClientConfig,
  ) {
    super(logger);
    options = this.ObjectOperations.IsNullOrEmpty(options)
      ? ({ region: 'us-east-1' } as SES.SESClientConfig)
      : options!;
    this.Repository = repository || new SES.SES(options);
  }

  /**
   * Send an email
   * @param subject {string} Subject of email
   * @param toAddresses {string[]} Array of addresses to send to
   * @param fromAddress {string} Address to send from
   * @param body {string | Buffer} HTML body of message
   */
  public async SendEmailAsync(
    subject: string,
    toAddresses: string[],
    fromAddress: string,
    body: string | Buffer,
  ): Promise<SES.SendEmailResponse> {
    const action = `${SESHelper.name}.${this.SendEmailAsync.name}`;
    this.LogHelper.LogInputs(action, {
      subject,
      toAddresses,
      fromAddress,
      body,
    });

    // guard clauses
    if (this.ObjectOperations.IsNullOrWhitespace(subject)) {
      throw new Error(`[${action}]-Must supply subject`);
    }
    if (this.ObjectOperations.IsNullOrEmpty(toAddresses)) {
      throw new Error(`[${action}]-Must supply toAddresses`);
    }
    if (this.ObjectOperations.IsNullOrWhitespace(fromAddress)) {
      throw new Error(`[${action}]-Must supply fromAddress`);
    }

    // create params object
    const params: SES.SendEmailRequest = {
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
    const response = await this.Repository.sendEmail(params);
    this.LogHelper.LogResponse(action, response);

    return response;
  }

  /**
   * Sends an email. Optionally sends with attachments
   * @param emailObject {EmailObject} Parameters to send
   */
  public async SendEmailWithAttachmentsAsync(
    emailObject: Email,
  ): Promise<SES.SendRawEmailResponse> {
    const action = `${SESHelper.name}.${this.SendEmailWithAttachmentsAsync.name}`;
    this.LogHelper.LogInputs(action, emailObject);

    const attachments = emailObject.Attachments || [];

    // guard clauses
    if (this.ObjectOperations.IsNullOrWhitespace(emailObject.FromAddress)) {
      throw new Error(`[${action}]-Must supply fromAddress`);
    }
    if (this.ObjectOperations.IsNullOrEmpty(emailObject.MessageBody)) {
      throw new Error(`[${action}]-Must supply messageBody`);
    }
    if (this.ObjectOperations.IsNullOrWhitespace(emailObject.Subject)) {
      throw new Error(`[${action}]-Must supply subject`);
    }
    if (emailObject.ToAddresses.length === 0) {
      throw new Error(`[${action}]-Must supply at least one toAddress`);
    }

    for (const attachment of attachments) {
      if (this.ObjectOperations.IsNullOrWhitespace(attachment.Name)) {
        throw new Error(`[${action}]-Must supply attachment name`);
      }
      if (this.ObjectOperations.IsNullOrWhitespace(attachment.ContentType)) {
        throw new Error(`[${action}]-Must supply attachment contentType`);
      }
      if (this.ObjectOperations.IsNullOrEmpty(attachment.Contents)) {
        throw new Error(`[${action}]-Must supply attachment contents`);
      }
    }

    let rawMessageData = '';
    rawMessageData += `Subject:${emailObject.Subject}\n`;
    rawMessageData += 'MIME-Version: 1.0\n';
    rawMessageData += 'Content-type: Multipart/Mixed; ';
    rawMessageData += 'boundary="NextPart"\n\n--NextPart\n';
    rawMessageData += 'Content-Type: text/plain\n\n';
    rawMessageData += `${emailObject.MessageBody}\n\n--NextPart`;
    if (attachments.length > 0) {
      rawMessageData += `\nContent-Type: multipart/alternative;\n\t`;
      // signifies the nested boundary name
      rawMessageData += 'boundary="sub_NextPart"\n\n--sub_NextPart';
      // loop through each attachment
      for (const attachment of attachments) {
        rawMessageData += `\nContent-Type: ${attachment.ContentType}; `;
        rawMessageData += `name="${attachment.Name}"\n`;
        rawMessageData += `Content-Description: ${attachment.Name}\n`;
        rawMessageData += `Content-Disposition: attachment;`;
        rawMessageData += `filename="${attachment.Name}";\n\n`;
        rawMessageData += `${attachment.Contents}\n`;
        rawMessageData += `\n--sub_NextPart`;
      }
      // signifies the end of the attachments part
      rawMessageData += `--\n\n--NextPart`;
    }
    // signifies the end of the email
    rawMessageData += `--`;

    const rawMessageDataBuffer =
      this.ObjectOperations.ConvertStringToArrayBuffer(rawMessageData);

    const rawMessage: SES.RawMessage = { Data: rawMessageDataBuffer };

    const request = {
      Destinations: emailObject.ToAddresses,
      Source: emailObject.FromAddress,
      RawMessage: rawMessage,
    } as SES.SendRawEmailRequest;
    this.LogHelper.LogRequest(action, request);

    const response = await this.Repository.sendRawEmail(request);
    this.LogHelper.LogRequest(action, response);

    return response;
  }
}
