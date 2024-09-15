/**
 * AWS DynamoDBリポジトリインターフェース
 */
export interface IDynamodbRepository {
  checkIfQuakeIDExists(quakeId: string): Promise<boolean>;
}
