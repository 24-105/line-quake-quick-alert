import * as jose from 'node-jose';
import { JWT_EXPIRATION_TIME } from 'src/config/constants';

/**
 * Generate JWT.
 * @returns JWT
 */
export const generateJwt = async (): Promise<string> => {
  const privateKey = process.env.LINE_QUALE_QUICK_ALERT_SECRET_KEY;

  const header = {
    alg: 'RS256',
    typ: 'JWT',
    kid: process.env.LINE_QUALE_QUICK_ALERT_KID,
  };

  const payload = {
    iss: process.env.LINE_QUALE_QUICK_ALERT_ISS,
    sub: process.env.LINE_QUALE_QUICK_ALERT_SUB,
    aud: 'https://api.line.me/',
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
