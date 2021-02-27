import { SESHelper } from './helper';
import { Logger, LogLevel } from 'typescript-ilogger';
import { TestingValues } from './test-values';
import { Email, EmailAttachment } from './email';
import * as SES from '@aws-sdk/client-ses';

const sendEmailResponseResponse: SES.SendEmailResponse = {
  MessageId: 'message-id',
};
const sendRawEmailResponseResponse: SES.SendRawEmailResponse = {
  MessageId: 'message-id',
};

const sendEmail = jest.fn().mockImplementation(() => {
  return Promise.resolve<SES.SendEmailResponse>(sendEmailResponseResponse);
});
const sendRawEmail = jest.fn().mockImplementation(() => {
  return Promise.resolve<SES.SendEmailResponse>(sendRawEmailResponseResponse);
});

// mock the functions
jest.mock('@aws-sdk/client-ses', () => {
  return {
    SES: jest.fn().mockImplementation(() => {
      return {
        sendEmail,
        sendRawEmail,
      };
    }),
  };
});

const logger = new Logger(LogLevel.Off);
const sesHelperMock = new SESHelper(logger);
const TestValues = new TestingValues();

/**
 * Test the SendEmailAsync method
 */
describe(`${SESHelper.name}.${sesHelperMock.SendEmailAsync.name}`, () => {
  // set action for this method
  const action = `${SESHelper.name}.${sesHelperMock.SendEmailAsync.name}`;

  test(`${TestValues.ThrowsOnEmpty} subject`, () => {
    const actual = sesHelperMock.SendEmailAsync(
      TestValues.EmptyString,
      [TestValues.EmailAddress],
      TestValues.EmailAddress,
      TestValues.Body,
    );
    return expect(actual).rejects.toThrow(
      `[${action}]-${TestValues.MustSupply} subject`,
    );
  });
  test(`${TestValues.ThrowsOnEmpty} toAddresses`, () => {
    const actual = sesHelperMock.SendEmailAsync(
      TestValues.Subject,
      TestValues.EmptyArray,
      TestValues.EmailAddress,
      TestValues.Body,
    );
    return expect(actual).rejects.toThrow(
      `[${action}]-${TestValues.MustSupply} toAddresses`,
    );
  });
  test(`${TestValues.ThrowsOnEmpty} fromAddress`, () => {
    const actual = sesHelperMock.SendEmailAsync(
      TestValues.Subject,
      [TestValues.EmailAddress],
      TestValues.EmptyString,
      TestValues.Body,
    );
    return expect(actual).rejects.toThrow(
      `[${action}]-${TestValues.MustSupply} fromAddress`,
    );
  });
  test(TestValues.ValidTest, () => {
    const actual = sesHelperMock.SendEmailAsync(
      TestValues.Subject,
      [TestValues.EmailAddress],
      TestValues.EmailAddress,
      TestValues.Body,
    );
    return expect(actual).resolves.toEqual(sendEmailResponseResponse);
  });
});

/**
 * Test the SendEmailWithAttachmentsAsync method
 */
describe(`${SESHelper.name}.${sesHelperMock.SendEmailWithAttachmentsAsync.name}`, () => {
  // set action for this method
  const action = `${SESHelper.name}.${sesHelperMock.SendEmailWithAttachmentsAsync.name}`;

  test(`${TestValues.ThrowsOnEmpty} fromAddress`, () => {
    const emailObject: Email = {
      FromAddress: TestValues.EmptyString,
      MessageBody: TestValues.Body,
      Subject: TestValues.Subject,
      ToAddresses: [TestValues.EmailAddress],
    };
    const actual = sesHelperMock.SendEmailWithAttachmentsAsync(emailObject);
    return expect(actual).rejects.toThrow(
      `[${action}]-${TestValues.MustSupply} fromAddress`,
    );
  });
  test(`${TestValues.ThrowsOnEmpty} messageBody`, () => {
    const emailObject: Email = {
      FromAddress: TestValues.EmailAddress,
      MessageBody: TestValues.EmptyString,
      Subject: TestValues.Subject,
      ToAddresses: [TestValues.EmailAddress],
    };
    const actual = sesHelperMock.SendEmailWithAttachmentsAsync(emailObject);
    return expect(actual).rejects.toThrow(
      `[${action}]-${TestValues.MustSupply} messageBody`,
    );
  });
  test(`${TestValues.ThrowsOnEmpty} subject`, () => {
    const emailObject: Email = {
      FromAddress: TestValues.EmailAddress,
      MessageBody: TestValues.Body,
      Subject: TestValues.EmptyString,
      ToAddresses: [TestValues.EmailAddress],
    };
    const actual = sesHelperMock.SendEmailWithAttachmentsAsync(emailObject);
    return expect(actual).rejects.toThrow(
      `[${action}]-${TestValues.MustSupply} subject`,
    );
  });
  test(`${TestValues.ThrowsOnEmpty} toAddresses`, () => {
    const emailObject: Email = {
      FromAddress: TestValues.EmailAddress,
      MessageBody: TestValues.Body,
      Subject: TestValues.Subject,
      ToAddresses: [],
    };
    const actual = sesHelperMock.SendEmailWithAttachmentsAsync(emailObject);
    return expect(actual).rejects.toThrow(
      `[${action}]-${TestValues.MustSupply} at least one toAddress`,
    );
  });
  test(`${TestValues.ThrowsOnEmpty} attachmentContents`, () => {
    const attachments: EmailAttachment[] = [
      {
        Contents: TestValues.EmptyString,
        ContentType: TestValues.ContentType,
        Name: TestValues.Name,
      },
    ];
    const emailObject: Email = {
      ToAddresses: [TestValues.EmailAddress],
      FromAddress: TestValues.EmailAddress,
      MessageBody: TestValues.Body,
      Subject: TestValues.Subject,
      Attachments: attachments,
    };
    const actual = sesHelperMock.SendEmailWithAttachmentsAsync(emailObject);
    return expect(actual).rejects.toThrow(
      `[${action}]-${TestValues.MustSupply} attachment contents`,
    );
  });
  test(`${TestValues.ThrowsOnEmpty} attachmentContentType`, () => {
    const attachments: EmailAttachment[] = [
      {
        Contents: TestValues.Body,
        ContentType: TestValues.EmptyString,
        Name: TestValues.Name,
      },
    ];
    const emailObject: Email = {
      ToAddresses: [TestValues.EmailAddress],
      FromAddress: TestValues.EmailAddress,
      MessageBody: TestValues.Body,
      Subject: TestValues.Subject,
      Attachments: attachments,
    };
    const actual = sesHelperMock.SendEmailWithAttachmentsAsync(emailObject);
    return expect(actual).rejects.toThrow(
      `[${action}]-${TestValues.MustSupply} attachment contentType`,
    );
  });
  test(`${TestValues.ThrowsOnEmpty} attachmentName`, () => {
    const attachments: EmailAttachment[] = [
      {
        Contents: TestValues.ContentType,
        ContentType: TestValues.ContentType,
        Name: TestValues.EmptyString,
      },
    ];
    const emailObject: Email = {
      ToAddresses: [TestValues.EmailAddress],
      FromAddress: TestValues.EmailAddress,
      MessageBody: TestValues.Body,
      Subject: TestValues.Subject,
      Attachments: attachments,
    };
    const actual = sesHelperMock.SendEmailWithAttachmentsAsync(emailObject);
    return expect(actual).rejects.toThrow(
      `[${action}]-${TestValues.MustSupply} attachment name`,
    );
  });
  test(TestValues.ValidTest, () => {
    const emailObject: Email = {
      FromAddress: TestValues.EmailAddress,
      MessageBody: TestValues.Body,
      Subject: TestValues.Subject,
      ToAddresses: [TestValues.EmailAddress],
    };
    const actual = sesHelperMock.SendEmailWithAttachmentsAsync(emailObject);
    return expect(actual).resolves.toEqual(TestValues.SendRawEmailResponse);
  });
  test(`${TestValues.ValidTest} with attachments`, () => {
    const attachments: EmailAttachment[] = [
      {
        Contents: TestValues.Body,
        ContentType: TestValues.ContentType,
        Name: TestValues.Name,
      },
    ];
    const emailObject: Email = {
      ToAddresses: [TestValues.EmailAddress],
      FromAddress: TestValues.EmailAddress,
      MessageBody: TestValues.Body,
      Subject: TestValues.Subject,
      Attachments: attachments,
    };
    const actual = sesHelperMock.SendEmailWithAttachmentsAsync(emailObject);
    return expect(actual).resolves.toEqual(TestValues.SendRawEmailResponse);
  });
});
