import { NextApiResponse, NextApiRequest, NextPassportApiRequest } from "next";
import withPassport, { passport } from "../../lib/withPassport";
import fakedb from "../../lib/fakedb";

const handler = async (req: NextPassportApiRequest, res: NextApiResponse) => {
  passport.authenticate("jwt", { session: false }, (err, userId, info) => {
    console.log(req.user);
    return fakedb.findUserById(req.user.id);
  });
};
export default withPassport(handler);
