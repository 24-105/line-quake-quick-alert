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
      { AttributeName: 'channelId', AttributeType: ScalarAttributeType.S },
      ,
    ],
    TableName: process.env.CHANNEL_ACCESS_TOKEN_TABLE_NAME,
    KeySchema: [{ AttributeName: 'channelId', KeyType: KeyType.HASH }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  };

  try {
    const data = await client.send(new CreateTableCommand(params));
    console.log('ChannelAccessToken Table is successfully created', data);
  } catch (err) {
    console.error('ChannelAccessToken Table is failed to create', err);
    throw err;
  }
};

// TTLを有効化する
const enableTTL = async () => {
  const params = {
    TableName: process.env.CHANNEL_ACCESS_TOKEN_TABLE_NAME,
    TimeToLiveSpecification: {
      AttributeName: 'TTL',
      Enabled: true,
    },
  };

  try {
    const data = await client.send(new UpdateTimeToLiveCommand(params));
    console.log('ChannelAccessToken Table is successfully updated', data);
  } catch (err) {
    console.error('ChannelAccessToken Table is failed to update', err);
    throw err;
  }
};

// チャンネルアクセストークンテーブルを構築する
const setupChannelAccessTokenTable = async () => {
  await createTable();
  await enableTTL();
};

setupChannelAccessTokenTable();
