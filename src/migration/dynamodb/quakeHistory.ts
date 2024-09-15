import {
  CreateTableCommand,
  DynamoDBClient,
  UpdateTimeToLiveCommand,
  ScalarAttributeType,
  KeyType,
} from '@aws-sdk/client-dynamodb';

// 環境変数からクレデンシャルを取得
const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'dummyAccessKeyId',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'dummySecretAccessKey',
};

// DynamoDBクライアントを作成する
const client = new DynamoDBClient({
  region: 'ap-northeast-1',
  endpoint: 'http://localhost:8000',
  credentials: credentials,
});

// 地震履歴テーブルを作成する
const createTable = async () => {
  const params = {
    AttributeDefinitions: [
      { AttributeName: 'quakeHistory', AttributeType: ScalarAttributeType.S },
      ,
    ],
    TableName: 'QuakeHistory',
    KeySchema: [{ AttributeName: 'quakeHistory', KeyType: KeyType.HASH }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  };

  try {
    const data = await client.send(new CreateTableCommand(params));
    console.log('QuakeHistory Table is successfully created', data);
  } catch (err) {
    console.error('QuakeHistory Table is failed to create', err);
    throw err;
  }
};

// TTLを有効化する
const enableTTL = async () => {
  const params = {
    TableName: 'QuakeHistory',
    TimeToLiveSpecification: {
      AttributeName: 'TTL',
      Enabled: true,
    },
  };

  try {
    const data = await client.send(new UpdateTimeToLiveCommand(params));
    console.log('QuakeHistory Table is successfully updated', data);
  } catch (err) {
    console.error('QuakeHistory Table is failed to update', err);
    throw err;
  }
};

// 地震履歴テーブルを構築する
const setupQuakeHistoryTable = async () => {
  await createTable();
  await enableTTL();
};

setupQuakeHistoryTable();
