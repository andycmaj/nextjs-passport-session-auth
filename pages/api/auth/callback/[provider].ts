import {
  NextWithPassportApiRequest,
  NextApiResponseWithRedirectAndJwt
} from "../../../../lib/withPassport";

import withPassport, { passport } from "../../../../lib/withPassport";
import fakedb from "../../../../lib/fakedb";

const handler = async (
  req: NextWithPassportApiRequest,
  res: NextApiResponseWithRedirectAndJwt
) => {
  const { provider } = req.query;
  if (!provider) {
    return { statusCode: 404 };
  }
  passport.authenticate(provider, { session: false })(req, res, (...args) => {
    // this check isn't needed. req.user will be the passport.Profile from the provder
    // the typing needs work.
    const user =
      typeof req.user === "string" ? fakedb.findUserById(req.user) : req.user;

    const token = res.jwt.sign(user.id);
    console.log(token);
    res.redirect(`/auth/callback?token=${token}`);
  });
};

export default withPassport(handler);
