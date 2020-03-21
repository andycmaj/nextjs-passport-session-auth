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
    console.log("inside passport.authenticate");
    console.log(req.user);
  });
};
export default withPassport(handler);
