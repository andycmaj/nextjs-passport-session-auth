import next, { NextApiResponse, NextPassportApiRequest } from "next";
import withPassport, { passport } from "../../../../lib/withPassport";

const handler = async (req: NextPassportApiRequest, res: NextApiResponse) => {
  const { provider } = req.query;
  if (!provider) {
    return { statusCode: 404 };
  }
  passport.authenticate(provider, { session: false })(req, res, (...args) => {
    console.log("in passport.authenticate callback");
    const token = res.jwt.sign(req.user.id);
    res.redirect(`/auth/callback?token=${token}`);
  });
};

export default withPassport(handler);
