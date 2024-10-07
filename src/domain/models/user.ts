/**
 * User model
 */
export class UserModel {
  id: number;
  userId: string;
  prefecture: string | null;
  thresholdSeismicIntensity: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: number,
    userId: string,
    prefecture: string | null,
    thresholdSeismicIntensity: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.prefecture = prefecture;
    this.thresholdSeismicIntensity = thresholdSeismicIntensity;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
