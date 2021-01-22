import * as SES from '@aws-sdk/client-ses';

/**
 * Test values
 */
export class TestingValues {
    // descriptions
    public AWSError: string = 'AWS Error';
    public InvalidTest: string = 'returns error from AWS';
    public MustSupply: string = 'Must supply';
    public ThrowsOnEmpty: string = 'throws on empty';
    public ValidTest: string = 'returns valid response from AWS';

    // empty values
    public EmptyArray = [];
    public EmptyString: string = '';

    // strings
    public Body: string = 'body';
    public ContentType: string = 'content-type';
    public EmailAddress: string = 'email-address';
    public MessageId: string = 'message-id';
    public Name: string = 'name';
    public Subject: string = 'string';

    // objects
    public SendEmailResponse: SES.SendEmailResponse = { MessageId: 'message-id' };
    public SendRawEmailResponse: SES.SendRawEmailResponse = { MessageId: 'message-id' }
}
