import * as jose from 'node-jose';
import { JWT_EXPIRATION_TIME, LINE_API_BASE_URL } from 'src/config/constants';

/**
 * Generate JWT.
 * @param privateKey
 * @param kid
 * @param iss
 * @param sub
 * @returns JWT
 */
export const generateJwt = async (
  privateKey: string,
  kid: string,
  iss: string,
  sub: string,
): Promise<string> => {
  const header = {
    alg: 'RS256',
    typ: 'JWT',
    kid: kid,
  };

  const payload = {
    iss: iss,
    sub: sub,
    aud: LINE_API_BASE_URL,
    exp: Math.floor(new Date().getTime() / 1000) + 60 * 30,
    token_exp: JWT_EXPIRATION_TIME,
  };

  try {
    return await jose.JWS.createSign(
      { format: 'compact', fields: header },
      JSON.parse(privateKey),
    )
      .update(JSON.stringify(payload))
      .final();
  } catch (err) {
    throw err;
  }
};
