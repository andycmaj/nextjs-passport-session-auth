import { Strategy, Profile } from 'passport-google-oauth20'
import appConfig from '../appConfig'

// STATICALLY configure the Google strategy for use by Passport.
//
// https://github.com/jaredhanson/passport-google-oauth2
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Google API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be exposed in the request as `req.user`
// in api handlers after authentication.
console.log(appConfig.getCredentialsForOAuthProvider('google'))
const strategy = new Strategy({
    ...appConfig.getCredentialsForOAuthProvider('google'),
    callbackURL: appConfig.getOAuthCallbackUrl('google'),
    scope: ['profile'],
    passReqToCallback: false
  }, 
  (accessToken, refreshToken, googleProfile:Profile, cb) => {
    // Right now, the user's Google profile is supplied as the user
    // record. In a production-quality application, the Google profile should
    // be associated with an app-specific user record in app persistence,
    // which allows for account linking and authentication with other identity providers.

    // Upsert user here
    // see https://github.com/jaredhanson/passport-google-oauth2/blob/master/lib/strategy.js
    // for an example
    cb(null, googleProfile)
  }
)


export default strategy
