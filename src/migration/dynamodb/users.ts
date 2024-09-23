import {
  CreateTableCommand,
  DynamoDBClient,
  ScalarAttributeType,
  KeyType,
} from '@aws-sdk/client-dynamodb';
import * as dotenv from 'dotenv';
import { USERS_TABLE_NAME } from '../../config/constants';

// Get execution environment.
const env = process.env.NODE_ENV;

// Import environment variable file.
dotenv.config({ path: `.env.${env}` });

// Get AWS credentials from environment variables.
const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

// Create an Amazon DynamoDB service client object.
const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
  credentials: credentials,
});

// Create users table.
const createTable = async () => {
  const params = {
    AttributeDefinitions: [
      { AttributeName: 'userId', AttributeType: ScalarAttributeType.S },
      ,
    ],
    TableName: USERS_TABLE_NAME,
    KeySchema: [{ AttributeName: 'userId', KeyType: KeyType.HASH }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  };

  try {
    const data = await client.send(new CreateTableCommand(params));
    console.log('Users Table is successfully created', data);
  } catch (err) {
    console.error('Users Table is failed to create', err);
    throw err;
  }
};

// Build users table.
const setupQuakeHistoryTable = async () => {
  await createTable();
};

setupQuakeHistoryTable();
