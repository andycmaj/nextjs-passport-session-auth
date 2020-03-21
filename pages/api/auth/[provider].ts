import {
  NextWithPassportApiRequest,
  NextApiResponseWithRedirectAndJwt
} from "../../../lib/withPassport";

import withPassport, { passport } from "../../../lib/withPassport";

const handler = (
  req: NextWithPassportApiRequest,
  res: NextApiResponseWithRedirectAndJwt
) => {
  const { provider } = req.query;
  if (!provider) {
    return { statusCode: 404 };
  }

  passport.authenticate(provider, { session: false })(req, res, (...args) => {
    console.log("api/auth/[provider]");
    return req.user;
  });
};

export default withPassport(handler);
