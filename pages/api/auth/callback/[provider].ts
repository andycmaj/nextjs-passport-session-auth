import { NextApiResponse, NextApiRequest } from "next";
import withPassport, { passport, sign } from "../../../../lib/withPassport";
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { provider } = req.query;
  if (!provider) {
    return { statusCode: 404 };
  }

  passport.authenticate(
    provider,
    {
      // failureRedirect: "/auth",
      // successRedirect: "/",
      session: false
    },
    (err, user, info) => {
      const token = sign({ sub: user.id }, { expiresIn: "2s" }).then(token => {
        res.redirect(`/callback?token=${token}`);
      });
    }
  );
};

export default withPassport(handler);
