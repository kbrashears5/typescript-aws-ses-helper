<h1 align="center">typescript-aws-ses-helper</h1>

<div align="center">
    
<b>Typescript helper functions for AWS SES service</b>
    
[![Build Status](https://dev.azure.com/kbrashears5/github/_apis/build/status/kbrashears5.typescript-aws-ses-helper?branchName=master)](https://dev.azure.com/kbrashears5/github/_build/latest?definitionId=23&branchName=master)
[![Tests](https://img.shields.io/azure-devops/tests/kbrashears5/github/23)](https://img.shields.io/azure-devops/tests/kbrashears5/github/23)
[![Code Coverage](https://img.shields.io/azure-devops/coverage/kbrashears5/github/23)](https://img.shields.io/azure-devops/coverage/kbrashears5/github/23)

[![NPM Version](https://img.shields.io/npm/v/typescript-aws-ses-helper)](https://img.shields.io/npm/v/typescript-aws-ses-helper)
[![Downloads](https://img.shields.io/npm/dt/typescript-aws-ses-helper)](https://img.shields.io/npm/dt/typescript-aws-ses-helper)
</div>

## Install
```
npm install typescript-aws-ses-helper@latest
```

## Usage
### Default - running in Lambda in your own account
```typescript
const logger = new Logger(LogLevel.Trace);

const helper = new SESHelper(logger);

const response = await helper.SendEmailAsync('subject',
    ['toAddresses'],
    'fromAddress',
    'body');
```

### Running in separate account or not in Lambda
```typescript
const logger = new Logger(LogLevel.Trace);

const options: AWS.SES.ClientConfiguration = {
    accessKeyId: '{access_key}',
    secretAccessKey: '{secret_key}',
    region: 'us-east-1',
};

const repository = new AWS.SES(options);

const helper = new SESHelper(logger,
    repository);

const response = await helper.SendEmailAsync('subject',
    ['toAddresses'],
    'fromAddress',
    'body');
```

## Notes
If no options are supplied, will default to `us-east-1` as the region