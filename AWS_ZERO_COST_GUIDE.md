# Migrating from DigitalOcean Functions to AWS Lambda: Achieving Zero-Cost Serverless

## Overview
This document outlines how to achieve a completely free serverless setup using AWS Lambda, matching or exceeding DigitalOcean Functions' free tier benefits while maintaining zero cost even after the AWS 12-month trial period expires.

## Free Tier Comparison

### DigitalOcean Functions
- 50,000 requests per month free
- 90,000 GB-seconds compute time
- Simple deployment with `docts`
- No hidden costs

### AWS Lambda (Always Free)
- 1,000,000 requests per month free
- 400,000 GB-seconds compute time
- More generous free tier
- Requires careful service selection to maintain zero cost

## Architecture Components

### 1. AWS Lambda
- **Free Tier**: 1M requests/month (forever)
- **Compute**: 400,000 GB-seconds/month
- **Cost**: $0 if within limits
- **Note**: Free tier never expires

### 2. Lambda Function URLs
- **Purpose**: Direct HTTPS endpoints for Lambda functions
- **Cost**: $0 (completely free)
- **Features**:
  - HTTPS endpoints
  - CORS support
  - Custom domains
  - Authentication options
  - Direct Lambda integration

### 3. MongoDB Atlas (External)
- Maintain existing MongoDB connection
- No changes needed to database layer

## Implementation Guide

### 1. Project Structure
```
project/
├── src/
│   ├── functions/           # Lambda function handlers
│   ├── services/           # Business logic
│   ├── types/             # TypeScript types
│   └── utils/             # Shared utilities
├── lib/                   # CDK infrastructure code
├── bin/                   # CDK app entry
├── package.json
├── tsconfig.json
└── cdk.json
```

### 2. Development Dependencies
```json
{
  "devDependencies": {
    "aws-cdk-lib": "^2.0.0",
    "esbuild": "^0.20.0",
    "@types/aws-lambda": "^8.10.133",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

### 3. CDK Stack Configuration
```typescript
// lib/my-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';

export class MyStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda function with no CloudWatch logs
    const fn = new nodejs.NodejsFunction(this, 'MyFunction', {
      entry: 'src/functions/handler.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      bundling: {
        minify: true,
        sourceMap: true,
      },
      // Important: Skip CloudWatch Logs role
      role: new iam.Role(this, 'MyFunctionRole', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        // Do not attach CloudWatch logs policy
      })
    });

    // Add Function URL (free HTTPS endpoint)
    fn.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ['*'],
        allowedMethods: [lambda.HttpMethod.ALL],
        allowedHeaders: ['*']
      }
    });
  }
}
```

### 4. Lambda Function Handler
```typescript
// src/functions/handler.ts
import { Context, APIGatewayProxyEventV2 } from 'aws-lambda';
import { MongoClient } from 'mongodb';

let dbConnection: MongoClient | null = null;

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context
) => {
  try {
    // Reuse MongoDB connection
    if (!dbConnection) {
      dbConnection = await MongoClient.connect(process.env.MONGO_URI!);
    }

    // Your business logic here

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
      },
      body: JSON.stringify({ result })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

### 5. Build and Deploy Scripts
```json
{
  "scripts": {
    "build": "tsc",
    "watch": "tsc -w",
    "cdk": "cdk",
    "deploy": "cdk deploy",
    "destroy": "cdk destroy"
  }
}
```

## Key Points for Zero Cost

1. **Avoid CloudWatch Logs**
   - Don't attach CloudWatch logs permissions to Lambda roles
   - Implement alternative logging if needed (e.g., to MongoDB)

2. **Use Function URLs**
   - Instead of API Gateway
   - Provides free HTTPS endpoints
   - Supports CORS and authentication

3. **Connection Pooling**
   - Reuse MongoDB connections
   - Store connection in function scope
   - Reduces cold starts and connection overhead

4. **Bundle Optimization**
   - Use esbuild for smaller packages
   - Minimize dependencies
   - Enable minification

## Monitoring Without CloudWatch

Since we're skipping CloudWatch to maintain zero cost, consider these alternatives:

1. **Application-Level Logging**
   - Log important events to MongoDB
   - Create simple dashboard in your application

2. **Error Handling**
   - Implement error reporting in your application
   - Store errors in MongoDB for analysis

3. **Performance Monitoring**
   - Track execution times in your application
   - Store metrics in MongoDB

## Migration from DigitalOcean

1. **Code Changes**
   - Update handler signatures for AWS Lambda
   - Adjust CORS headers if needed
   - Update environment variable references

2. **Deployment Changes**
   - Replace `docts` with CDK deployment
   - Update CI/CD pipelines
   - Update environment variable management

3. **Testing**
   - Test cold starts
   - Verify CORS functionality
   - Check MongoDB connection pooling
   - Validate error handling

## Free Tier Limits to Monitor

1. **Lambda Limits**
   - 1M requests per month
   - 400,000 GB-seconds compute
   - Monitor usage through AWS Console

2. **Data Transfer**
   - Keep responses minimal
   - Monitor total data transfer
   - First 1GB out is free

## Advantages Over DigitalOcean

1. **More Free Requests**
   - 1M vs 50K requests per month
   - Higher compute allocation

2. **Better Cold Starts**
   - More consistent performance
   - Better connection pooling

3. **More Features**
   - Custom domains
   - Better authentication options
   - More runtime options

## Conclusion

By carefully selecting AWS services and avoiding unnecessary features like CloudWatch Logs, we can achieve a completely free serverless setup that's actually more generous than DigitalOcean's free tier. This setup provides:

- More monthly requests (1M vs 50K)
- More compute time
- Better features
- Zero cost, even after the 12-month AWS trial
- Proper TypeScript support
- Professional-grade infrastructure

The key is to use only what's needed (Lambda + Function URLs) and skip optional services that could incur costs (CloudWatch Logs, API Gateway). 