import { User } from '../entities/user';
import { UserModel } from '../models/user';
import { convertPrefectureToString } from '../useCase/prefecture';
import { convertSeismicIntensityToString } from '../useCase/seismicIntensity';

/**
 * Convert user entity to user model.
 * @param user user entity
 * @returns user model
 */
export const userConverter = (user: User): UserModel => {
  return new UserModel(
    user.id,
    user.user_id,
    convertPrefectureToString(user.prefecture),
    convertSeismicIntensityToString(user.threshold_seismic_intensity),
    user.created_at,
    user.updated_at,
  );
};
