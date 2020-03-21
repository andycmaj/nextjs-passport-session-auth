import {
  NextWithPassportApiRequest,
  NextApiResponseWithRedirectAndJwt
} from "../../../../lib/withPassport";

import withPassport, { passport } from "../../../../lib/withPassport";

const handler = async (
  req: NextWithPassportApiRequest,
  res: NextApiResponseWithRedirectAndJwt
) => {
  const { provider } = req.query;
  if (!provider) {
    return { statusCode: 404 };
  }
  passport.authenticate(provider, { session: false })(req, res, (...args) => {
    console.log("in passport.authenticate callback");
    const token = res.jwt.sign(req.user.id);
    console.log(token);
    res.redirect(`/auth/callback?token=${token}`);
  });
};

export default withPassport(handler);
