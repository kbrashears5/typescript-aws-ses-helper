import * as SES from '@aws-sdk/client-ses';

/**
 * Test values
 */
export class TestingValues {
  // descriptions
  public AWSError = 'AWS Error';
  public InvalidTest = 'returns error from AWS';
  public MustSupply = 'Must supply';
  public ThrowsOnEmpty = 'throws on empty';
  public ValidTest = 'returns valid response from AWS';

  // empty values
  public EmptyArray = [];
  public EmptyString = '';

  // strings
  public Body = 'body';
  public ContentType = 'content-type';
  public EmailAddress = 'email-address';
  public MessageId = 'message-id';
  public Name = 'name';
  public Subject = 'string';

  // objects
  public SendEmailResponse: SES.SendEmailResponse = { MessageId: 'message-id' };
  public SendRawEmailResponse: SES.SendRawEmailResponse = {
    MessageId: 'message-id',
  };
}
