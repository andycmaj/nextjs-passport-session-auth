import { Strategy, ExtractJwt } from "passport-jwt";
import jwt from "jsonwebtoken";
import appConfig from "../appConfig";

const { keyOpts, secretOrKey } = appConfig.getJwtConfig();
//https://tools.ietf.org/html/rfc7519#section-4.1.3

// 4.1.3.  "aud" (Audience) Claim

//    The "aud" (audience) claim identifies the recipients that the JWT is
//    intended for.  Each principal intended to process the JWT MUST
//    identify itself with a value in the audience claim.  If the principal
//    processing the claim does not identify itself with a value in the
//    "aud" claim when this claim is present, then the JWT MUST be
//    rejected.  In the general case, the "aud" value is an array of case-
//    sensitive strings, each containing a StringOrURI value.  In the
//    special case when the JWT has one audience, the "aud" value MAY be a
//    single case-sensitive string containing a StringOrURI value.  The
//    interpretation of audience values is generally application specific.
//    Use of this claim is OPTIONAL.

// 4.1.1.  "iss" (Issuer) Claim

//    The "iss" (issuer) claim identifies the principal that issued the
//    JWT.  The processing of this claim is generally application specific.
//    The "iss" value is a case-sensitive string containing a StringOrURI
//    value.  Use of this claim is OPTIONAL.

const jwtOptions = {
  // these were explicitly referenced so the documentation could be associated
  // within the context of the jwt strategy
  issuer: keyOpts.issuer,
  audience: keyOpts.audience
};

//http://www.passportjs.org/packages/passport-jwt/

// Extracting the JWT from the request
// There are a number of ways the JWT may be included in a request. In
// order to remain as flexible as possible the JWT is parsed from the
// request by a user-supplied callback passed in as the jwtFromRequest
// parameter. This callback, from now on referred to as an extractor,
// accepts a request object as an argument and returns the encoded JWT
// string or null.
const strategy = new Strategy(
  {
    jwtFromRequest: ExtractJwt.fromExtractors([
      ExtractJwt.fromAuthHeaderAsBearerToken(),
      ExtractJwt.fromUrlQueryParameter("auth")
    ]),
    secretOrKey: secretOrKey, // from appConfig.ts
    ...jwtOptions
  },
  function(payload, next) {
    // payload is the extracted data from the JWT. next is a callback
    // that is (error, result)

    // here is where you can either search your database for a user or
    // pass along the data that was extracted. Note that if you are
    // hitting the database to find the user on each request then
    // you are probably better off just using session.

    // if you've reached this codeblock, then the JWT presented is valid
    // and not expired.

    next(null, payload);
  }
);
export default strategy;

export const sign = async (
  payload: string | object | Buffer,
  opts?: jwt.SignOptions
): Promise<string> => {
  opts = opts || {};
  const signingOpts = { ...jwtOptions, ...opts };
  return await jwt.sign(payload, secretOrKey, signingOpts);
};
