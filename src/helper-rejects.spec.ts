import { SESHelper } from './helper';
import { Logger, LogLevel } from 'typescript-ilogger';
import { TestingValues } from './test-values';
import { Email } from './email';

const error = new Error(`AWS Error`);

const sendEmail = jest.fn().mockImplementation(() => {
    return Promise.reject(error);
});
const sendRawEmail = jest.fn().mockImplementation(() => {
    return Promise.reject(error);
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
    test(TestValues.InvalidTest, () => {
        const actual = sesHelperMock.SendEmailAsync(TestValues.Subject,
            [TestValues.EmailAddress],
            TestValues.EmailAddress,
            TestValues.Body);
        return expect(actual).rejects.toThrow(TestValues.AWSError);
    });
});

/**
 * Test the SendEmailWithAttachmentsAsync method
 */
describe(`${SESHelper.name}.${sesHelperMock.SendEmailWithAttachmentsAsync.name}`, () => {
    test(TestValues.InvalidTest, () => {
        const emailObject: Email = {
            FromAddress: TestValues.EmailAddress,
            MessageBody: TestValues.Body,
            Subject: TestValues.Subject,
            ToAddresses: [TestValues.EmailAddress],
        };
        const actual = sesHelperMock.SendEmailWithAttachmentsAsync(emailObject);
        return expect(actual).rejects.toThrow(TestValues.AWSError);
    });
});
