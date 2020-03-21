import { Strategy, ExtractJwt } from "passport-jwt";
import jwt from "jsonwebtoken";
import appConfig from "../appConfig";
import { NextApiRequest } from "next";
import url, { UrlWithParsedQuery } from "url";
import { ParsedUrlQuery } from "querystring";
const { keyOpts, secretOrKey } = appConfig.getJwtConfig();
//https://tools.ietf.org/html/rfc7519#section-4.1.3

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
