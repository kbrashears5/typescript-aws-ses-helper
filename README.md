<h1 align="center">typescript-aws-ses-helper</h1>

<div align="center">
    
<b>Typescript helper functions for AWS SES service</b>
    
[![CI/CD](https://github.com/kbrashears5/typescript-aws-ses-helper/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/kbrashears5/typescript-aws-ses-helper/actions/workflows/ci-cd.yml)
[![codecov](https://codecov.io/gh/kbrashears5/typescript-aws-ses-helper/branch/master/graph/badge.svg?token=QOSDQA1FDU)](https://codecov.io/gh/kbrashears5/typescript-aws-ses-helper)
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

const response = await helper.SendEmailAsync(
  'subject',
  ['toAddresses'],
  'fromAddress',
  'body',
);
```

### Running in separate account or not in Lambda

```typescript
import * as SES from '@aws-sdk/client-ses';

const logger = new Logger(LogLevel.Trace);

const options: SES.SESClientConfig = {
  accessKeyId: '{access_key}',
  secretAccessKey: '{secret_key}',
  region: 'us-east-1',
};

const repository = new SES.SES(options);

const helper = new SESHelper(logger, repository);

const response = await helper.SendEmailAsync(
  'subject',
  ['toAddresses'],
  'fromAddress',
  'body',
);
```

## Notes

If no options are supplied, will default to `us-east-1` as the region

## Development

Clone the latest and run

```npm
npm run prep
```

to install packages and prep the git hooks
