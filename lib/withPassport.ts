import passport from "passport";
// import cookieSession from "cookie-session";
// import url from "url";
import redirect from "micro-redirect";
import { github, google, jwt } from "./passport";
import { UserIdentity } from "./withIdentity";
import { NextApiRequest } from "next";
import { sign } from "./passport/jwt";
export { default as passport } from "passport";

declare module "next" {
  export interface NextApiResponse {
    redirect: (location: string) => void;
    jwt: {
      sign: (payload: object | string) => string;
    };
  }
  export type NextPassportApiRequest = NextApiRequest & {
    user: passport.Profile;
  };
}

passport.use(github);
passport.use(google);
passport.use(jwt);

// Configure Passport authenticated session persistence.

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(async function(userId, done) {
  if (!userId) {
    return done(new Error(`User not found: ${userId}`));
  }
  done(null);
});

export interface PassportSession {
  passport: { user: UserIdentity };
}

// export middleware to wrap api/auth handlers
export default fn => (req, res) => {
  if (!res.redirect) {
    // passport.js needs res.redirect:
    // https://github.com/jaredhanson/passport/blob/1c8ede/lib/middleware/authenticate.js#L261
    // Monkey-patch res.redirect to emulate express.js's res.redirect,
    // since it doesn't exist in micro. default redirect status is 302
    // as it is in express. https://expressjs.com/en/api.html#res.redirect
    res.redirect = (location: string) => redirect(res, 302, location);
  }

  if (!res.jwt || !res.jwt.sign) {
    res.jwt = { sign };
  }
  passport.initialize()(req, res, () => fn(req, res));

  // Initialize Passport and restore authentication state, if any, from the
  // session. This nesting of middleware handlers basically does what app.use(passport.initialize())
  // does in express.
  //

  // since we are using JWT, cookieSession isn't needed.

  // cookieSession({
  //   name: "passportSession",
  //   signed: false,
  //   domain: url.parse(req.url).host,
  //   maxAge: 24 * 60 * 60 * 1000 // 24 hours
  // })(req, res, () =>
  //   passport.initialize()(req, res, () =>
  //     passport.session()(req, res, () =>
  //       // call wrapped api route as innermost handler
  //       fn(req, res)
  //     )
  //   )
  // );
};
