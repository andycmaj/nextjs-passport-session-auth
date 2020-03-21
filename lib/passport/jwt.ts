import { Strategy, ExtractJwt } from "passport-jwt";
import jwt from "jsonwebtoken";
import appConfig from "../appConfig";
import { NextApiRequest } from "next";
import url, { UrlWithParsedQuery } from "url";
import { ParsedUrlQuery } from "querystring";
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

// for some reason jwt was throwing an error when I supplied these. It may
// be the domain of 'example.com' isn't valid or they can't match. not sure
// i'll look into it later, I guess

const jwtOptions = {
  // these were explicitly referenced so the documentation could be associated
  // within the context of the jwt strategy
  issuer: keyOpts.issuer,
  audience: keyOpts.audience
};

export const extractBearerFromHeader = (req: NextApiRequest): string | null => {
  let authHeader = req.headers["authorization"]
    ? req.headers["authorization"]
    : req.headers["Authorization"];
  if (typeof authHeader !== "string") {
    authHeader = authHeader[0];
  }
  const parsed = (authHeader || "").match(/(\S+)\s+(\S+)/);
  return parsed && parsed.length === 3 ? parsed[2] : null;
};

export const extractTokenFromUrlQueryParam = (queryParam: string) => (
  req: NextApiRequest
): string | null => {
  const parsedUrl = url.parse(req.url, true);
  return parsedUrl.query &&
    Object.keys(parsedUrl.query).includes(queryParam) &&
    parsedUrl.query[queryParam] &&
    parsedUrl.query[queryParam].length
    ? parsedUrl.query[queryParam].toString()
    : null;
};

//http://www.passportjs.org/packages/passport-jwt/

const strategy = new Strategy(
  {
    jwtFromRequest: [
      extractBearerFromHeader,
      extractTokenFromUrlQueryParam("auth")
    ],
    secretOrKey: secretOrKey // from appConfig.ts
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

export const sign = (
  payload: string | object | Buffer,
  opts?: jwt.SignOptions
): string => {
  opts = opts || {};
  return jwt.sign(payload, secretOrKey);
};
