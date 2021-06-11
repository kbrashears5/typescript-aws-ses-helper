/**
 * Email attachment
 */
export interface EmailAttachment {
  Name: string;
  Contents: any | string;
  ContentType: string;
}

/**
 * Email object
 */
export interface Email {
  Attachments?: EmailAttachment[];
  FromAddress: string;
  MessageBody: string;
  Subject: string;
  ToAddresses: string[];
}
