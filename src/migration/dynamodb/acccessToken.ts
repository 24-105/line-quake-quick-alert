import {
  CreateTableCommand,
  DynamoDBClient,
  UpdateTimeToLiveCommand,
  ScalarAttributeType,
  KeyType,
} from '@aws-sdk/client-dynamodb';
import * as dotenv from 'dotenv';

// 実行環境を取得
const env = process.env.NODE_ENV || 'local';

// 環境変数ファイルをロード
dotenv.config({ path: `.env.${env}` });

// 環境変数からクレデンシャルを取得
const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

// DynamoDBクライアントを作成する
const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
  credentials: credentials,
});

// チャンネルアクセストークンテーブルを作成する
const createTable = async () => {
  const params = {
    AttributeDefinitions: [
      { AttributeName: 'channelID', AttributeType: ScalarAttributeType.S },
      ,
    ],
    TableName: 'AccessToken',
    KeySchema: [{ AttributeName: 'channelID', KeyType: KeyType.HASH }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  };

  try {
    const data = await client.send(new CreateTableCommand(params));
    console.log('AccessToken Table is successfully created', data);
  } catch (err) {
    console.error('AccessToken Table is failed to create', err);
    throw err;
  }
};

// TTLを有効化する
const enableTTL = async () => {
  const params = {
    TableName: 'AccessToken',
    TimeToLiveSpecification: {
      AttributeName: 'TTL',
      Enabled: true,
    },
  };

  try {
    const data = await client.send(new UpdateTimeToLiveCommand(params));
    console.log('AccessToken Table is successfully updated', data);
  } catch (err) {
    console.error('AccessToken Table is failed to update', err);
    throw err;
  }
};

// チャンネルアクセストークンテーブルを構築する
const setupAccessTokenTable = async () => {
  await createTable();
  await enableTTL();
};

setupAccessTokenTable();
