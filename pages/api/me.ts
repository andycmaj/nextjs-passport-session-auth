import {
  NextWithPassportApiRequest,
  NextApiResponseWithRedirectAndJwt
} from "../../lib/withPassport";

import withPassport, { passport } from "../../lib/withPassport";
import fakedb from "../../lib/fakedb";
const handler = (
  req: NextWithPassportApiRequest,
  res: NextApiResponseWithRedirectAndJwt
) => {
  console.log("me");
  console.log(req.headers);

  passport.authenticate("jwt", { session: false })(req, res, (...args) => {
    console.log("req.user:");
    console.log(req.user);
    res.send({
      user: fakedb.findUserById(req.user as string),
      token: res.jwt.sign(req.user)
    });
  });
};
export default withPassport(handler);
