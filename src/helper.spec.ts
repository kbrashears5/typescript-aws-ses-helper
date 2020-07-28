import { SESHelper } from './helper';
import { Logger, LogLevel } from 'typescript-ilogger';
import { SESMock } from './mock';
import { TestingValues } from './test-values';
import { Email, EmailAttachment } from './email';

const logger = new Logger(LogLevel.Off);
const mockerResolves = new SESMock(false);
const sesHelperMockResolves = new SESHelper(logger, mockerResolves.Mock);
const mockerRejects = new SESMock(true);
const sesHelperMockRejects = new SESHelper(logger, mockerRejects.Mock);
const TestValues = new TestingValues();

/**
 * Test the SendEmailAsync method
 */
describe(`${SESHelper.name}.${sesHelperMockResolves.SendEmailAsync.name}`, () => {
    // set action for this method
    const action = `${SESHelper.name}.${sesHelperMockResolves.SendEmailAsync.name}`;

    test(`${TestValues.ThrowsOnEmpty} subject`, () => {
        const actual = sesHelperMockResolves.SendEmailAsync(TestValues.EmptyString,
            [TestValues.EmailAddress],
            TestValues.EmailAddress,
            TestValues.Body);
        return expect(actual).rejects.toThrow(`[${action}]-${TestValues.MustSupply} subject`);
    });
    test(`${TestValues.ThrowsOnEmpty} toAddresses`, () => {
        const actual = sesHelperMockResolves.SendEmailAsync(TestValues.Subject,
            TestValues.EmptyArray,
            TestValues.EmailAddress,
            TestValues.Body);
        return expect(actual).rejects.toThrow(`[${action}]-${TestValues.MustSupply} toAddresses`);
    });
    test(`${TestValues.ThrowsOnEmpty} fromAddress`, () => {
        const actual = sesHelperMockResolves.SendEmailAsync(TestValues.Subject,
            [TestValues.EmailAddress],
            TestValues.EmptyString,
            TestValues.Body);
        return expect(actual).rejects.toThrow(`[${action}]-${TestValues.MustSupply} fromAddress`);
    });
    test(TestValues.InvalidTest, () => {
        const actual = sesHelperMockRejects.SendEmailAsync(TestValues.Subject,
            [TestValues.EmailAddress],
            TestValues.EmailAddress,
            TestValues.Body);
        return expect(actual).rejects.toThrow(TestValues.AWSError);
    });
    test(TestValues.ValidTest, () => {
        const actual = sesHelperMockResolves.SendEmailAsync(TestValues.Subject,
            [TestValues.EmailAddress],
            TestValues.EmailAddress,
            TestValues.Body);
        return expect(actual).resolves.toEqual(mockerResolves.SendEmailResponse);
    });
});

/**
 * Test the SendEmailWithAttachmentsAsync method
 */
describe(`${SESHelper.name}.${sesHelperMockResolves.SendEmailWithAttachmentsAsync.name}`, () => {
    // set action for this method
    const action = `${SESHelper.name}.${sesHelperMockResolves.SendEmailWithAttachmentsAsync.name}`;

    test(`${TestValues.ThrowsOnEmpty} fromAddress`, () => {
        const emailObject: Email = {
            FromAddress: TestValues.EmptyString,
            MessageBody: TestValues.Body,
            Subject: TestValues.Subject,
            ToAddresses: [TestValues.EmailAddress],
        };
        const actual = sesHelperMockResolves.SendEmailWithAttachmentsAsync(emailObject);
        return expect(actual).rejects.toThrow(`[${action}]-${TestValues.MustSupply} fromAddress`);
    });
    test(`${TestValues.ThrowsOnEmpty} messageBody`, () => {
        const emailObject: Email = {
            FromAddress: TestValues.EmailAddress,
            MessageBody: TestValues.EmptyString,
            Subject: TestValues.Subject,
            ToAddresses: [TestValues.EmailAddress],
        };
        const actual = sesHelperMockResolves.SendEmailWithAttachmentsAsync(emailObject);
        return expect(actual).rejects.toThrow(`[${action}]-${TestValues.MustSupply} messageBody`);
    });
    test(`${TestValues.ThrowsOnEmpty} subject`, () => {
        const emailObject: Email = {
            FromAddress: TestValues.EmailAddress,
            MessageBody: TestValues.Body,
            Subject: TestValues.EmptyString,
            ToAddresses: [TestValues.EmailAddress],
        };
        const actual = sesHelperMockResolves.SendEmailWithAttachmentsAsync(emailObject);
        return expect(actual).rejects.toThrow(`[${action}]-${TestValues.MustSupply} subject`);
    });
    test(`${TestValues.ThrowsOnEmpty} toAddresses`, () => {
        const emailObject: Email = {
            FromAddress: TestValues.EmailAddress,
            MessageBody: TestValues.Body,
            Subject: TestValues.Subject,
            ToAddresses: [],
        };
        const actual = sesHelperMockResolves.SendEmailWithAttachmentsAsync(emailObject);
        return expect(actual).rejects.toThrow(`[${action}]-${TestValues.MustSupply} at least one toAddress`);
    });
    test(`${TestValues.ThrowsOnEmpty} attachmentContents`, () => {
        const attachments: EmailAttachment[] = [{
            Contents: TestValues.EmptyString,
            ContentType: TestValues.ContentType,
            Name: TestValues.Name,
        }];
        const emailObject: Email = {
            ToAddresses: [TestValues.EmailAddress],
            FromAddress: TestValues.EmailAddress,
            MessageBody: TestValues.Body,
            Subject: TestValues.Subject,
            Attachments: attachments,
        };
        const actual = sesHelperMockResolves.SendEmailWithAttachmentsAsync(emailObject);
        return expect(actual).rejects.toThrow(`[${action}]-${TestValues.MustSupply} attachment contents`);
    });
    test(`${TestValues.ThrowsOnEmpty} attachmentContentType`, () => {
        const attachments: EmailAttachment[] = [{
            Contents: TestValues.Body,
            ContentType: TestValues.EmptyString,
            Name: TestValues.Name,
        }];
        const emailObject: Email = {
            ToAddresses: [TestValues.EmailAddress],
            FromAddress: TestValues.EmailAddress,
            MessageBody: TestValues.Body,
            Subject: TestValues.Subject,
            Attachments: attachments,
        };
        const actual = sesHelperMockResolves.SendEmailWithAttachmentsAsync(emailObject);
        return expect(actual).rejects.toThrow(`[${action}]-${TestValues.MustSupply} attachment contentType`);
    });
    test(`${TestValues.ThrowsOnEmpty} attachmentName`, () => {
        const attachments: EmailAttachment[] = [{
            Contents: TestValues.ContentType,
            ContentType: TestValues.ContentType,
            Name: TestValues.EmptyString,
        }];
        const emailObject: Email = {
            ToAddresses: [TestValues.EmailAddress],
            FromAddress: TestValues.EmailAddress,
            MessageBody: TestValues.Body,
            Subject: TestValues.Subject,
            Attachments: attachments,
        };
        const actual = sesHelperMockResolves.SendEmailWithAttachmentsAsync(emailObject);
        return expect(actual).rejects.toThrow(`[${action}]-${TestValues.MustSupply} attachment name`);
    });
    test(TestValues.InvalidTest, () => {
        const emailObject: Email = {
            FromAddress: TestValues.EmailAddress,
            MessageBody: TestValues.Body,
            Subject: TestValues.Subject,
            ToAddresses: [TestValues.EmailAddress],
        };
        const actual = sesHelperMockRejects.SendEmailWithAttachmentsAsync(emailObject);
        return expect(actual).rejects.toThrow(TestValues.AWSError);
    });
    test(TestValues.ValidTest, () => {
        const emailObject: Email = {
            FromAddress: TestValues.EmailAddress,
            MessageBody: TestValues.Body,
            Subject: TestValues.Subject,
            ToAddresses: [TestValues.EmailAddress],
        };
        const actual = sesHelperMockResolves.SendEmailWithAttachmentsAsync(emailObject);
        return expect(actual).resolves.toEqual(TestValues.SendRawEmailResponse);
    });
    test(`${TestValues.ValidTest} with attachments`, () => {
        const attachments: EmailAttachment[] = [{
            Contents: TestValues.Body,
            ContentType: TestValues.ContentType,
            Name: TestValues.Name,
        }];
        const emailObject: Email = {
            ToAddresses: [TestValues.EmailAddress],
            FromAddress: TestValues.EmailAddress,
            MessageBody: TestValues.Body,
            Subject: TestValues.Subject,
            Attachments: attachments,
        };
        const actual = sesHelperMockResolves.SendEmailWithAttachmentsAsync(emailObject);
        return expect(actual).resolves.toEqual(TestValues.SendRawEmailResponse);
    });
});
