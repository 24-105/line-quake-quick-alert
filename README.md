# 注意書き

- 本アプリは、日本気象庁のコンテンツ利用規約に基づき、同庁から提供される情報を利用しています。出典：気象庁ホームページ（https://www.jma.go.jp/jma/kishou/info/coment.html）
- 日本気象庁のコンテンツ利用規約に従い、情報の編集や加工を行っています。出典：気象庁ホームページ（同上）
- 本アプリでは、P2P地震情報の提供される情報を利用しています。出典：P2P地震情報（https://www.p2pquake.net/develop/json_api_v2/#/）
- 本アプリの利用に起因する損害について、当方は一切の責任を負いません。また、提供する情報の正確性も保証いたしません。

---

# アプリ名：地震アラート

## サイト概要

### サイトテーマ

「地震アラート」は、日本国内の地震情報を迅速に通知するためのリアルタイム警告LINE公式アカウントです。LINEを通じてユーザーが登録した地域に地震が発生した場合、迅速に情報を受け取ることができます。

---

# App Name: Earthquake Alert

## Site Overview

### Site Theme

"Earthquake Alert" is a real-time warning LINE official account designed to quickly notify users about earthquake information in Japan. When an earthquake occurs in a region registered by the user, they will receive timely information via LINE.

---

### テーマを選んだ理由

背景: 日本は地震が頻発する国であり、即時性のある情報を受け取ることは非常に重要です。既存の防災システムはありますが、個々のユーザーに特化した通知やアラート機能を持つアプリケーションはまだ不十分です。

**困りごとと課題:**

- 地震発生後の迅速な対応が難しい。
- 個人に合わせた地震情報の配信が不足している。
- スマートフォンで手軽に地震情報を取得したいが、プッシュ通知が煩雑で管理しづらい。
- 上記の課題を解決するために、LINEを利用したシンプルでカスタマイズ可能な地震アラートシステムを開発しました。

## ターゲットユーザー

- 日本国内で地震情報をリアルタイムに取得したい人。
- 特定の地域に住んでおり、その地域の地震情報をいち早く知りたい人。
- 緊急時に迅速な対応が求められる家庭や職場の防災担当者。

## 主な利用シーン

- 地震発生直後にユーザーがLINEを通じて即座に通知を受け取り、迅速な対応ができる。
- 家族や同僚にLINEを通じて地震の発生を共有し、二次災害を防止する。
- 地震が発生した地域に関する情報を確認し、避難や対応に役立てる。

## 機能一覧

- 地震情報のリアルタイム取得（P2P地震情報を経由した日本気象庁提供のデータを使用）
- LINEアカウントと連携して、特定の地域の地震情報を配信
- ユーザーの希望する地域（都道府県）ごとのアラートを設定

## 技術スタック

- フロントエンド: LINE Messaging API
- バックエンド:
  - 言語： TypeScript
  - 実行環境： Node.js v20.x
  - フレームワーク： NestJS v10.x
  - OS： macOS v14.x
  - 外部API：
    - P2P地震情報
    - LINE Messaging API
- インフラ：
  - AWS：
    - EC2
    - DynamoDB
- 開発
  - IDE： Visual Studio Code v1.93.x
  - テスト： Jest v29.x
  - コミットメッセージ検証：
    - husly v9.x
    - @commitlint v19.x
  - コード整形： eslint v9.x
  - GitHub Copilot

## インフラ構成

![alt text](public/image/line-quake-quick-alert-infra.jpg)

## Project setup

### Project clone to local

```bash
$ git clone https://github.com/24-105/line-quake-quick-alert.git
```

### Install Node.js

```bash
## using homebrew
$ brew install node@20

## using volta
$ volta install node@20
```

### Check version

```bash
$ node -v
$ npm -v
```

### Install the package

```bash
$ npm install
```

### Compile

```bash
$ npx tsc
```

## Docker setup

### Make directory

```bash
$ mkdir -p ./docker/dynamodb
```

### Creating and starting multiple containers

```bash
$ docker-compose up -d
```

### Check docker container

```bash
$ docker-compose ps
$ docker-compose logs dynamodb-local
$ docker-compose logs dynamodb-admin
```

### Creat dynamodb tablel

```bash
$ NODE_ENV=local npx ts-node src/migration/dynamodb/acccessToken.ts
$ NODE_ENV=local npx ts-node src/migration/dynamodb/quakeHistory.ts
```

### Check if table was created

```bash
$ brew install awscli
$ aws dynamodb list-tables --endpoint-url http://localhost:8000
```

### Delete dynamodb tablel

```bash
$ aws dynamodb delete-table --table-name AccessToken --endpoint-url http://localhost:8000
$ aws dynamodb delete-table --table-name QuakeHistory --endpoint-url http://localhost:8000
```

### Stopping and removing containers

```bash
$ docker-compose down
```

## Compile and run the project

```bash
# local mode
$ npm run start:local

# development mode
$ npm run start:dev

# production mode
$ npm run start:prd

# watch mode
$ npm run start:debug
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Recommended commit message

```bash
- build: ビルドシステムまたは外部依存関係に影響する変更
- ci: CI構成ファイルとスクリプトへの変更
- docs: ドキュメントのみの変更
- feat: 新機能
- fix: バグ修正
- perf: パフォーマンスの向上
- refactor: リファクタリング
- style: コードの意味に影響しない変更
- test: 不足しているテストの追加または既存のテストの修正
```

## Powered by NestJS

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

### Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

### Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

### Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

### Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

### License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
