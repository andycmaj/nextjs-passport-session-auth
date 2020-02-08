import { Strategy, Profile } from 'passport-google-oauth20'
import appConfig from '../appConfig'
import passport from 'passport'

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
  (accessToken, refreshToken, googleProfile, cb) => {
    // Right now, the user's Google profile is supplied as the user
    // record. In a production-quality application, the Google profile should
    // be associated with an app-specific user record in app persistence,
    // which allows for account linking and authentication with other identity providers.

    // Upsert user here
    console.log(accessToken, refreshToken, googleProfile)

    // see https://github.com/jaredhanson/passport-google-oauth2/blob/master/lib/strategy.js
    // for an example
    cb(null, googleProfile)
  }
)

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Google profile is serialized
// and deserialized.

//TODO: move this to a centeralized point outside of google.js/github.js as this shouldn't be duplicated.

// passport.serializeUser((user: Profile, done) => {
//   const { id, displayName, username, profileUrl, photos } = user
//   done(null, { id, displayName, username, profileUrl, photos })
// })
// passport.deserializeUser(async (serializedUser, done) => {
//   if (!serializedUser) {
//     return done(new Error(`User not found: ${serializedUser}`))
//   }

//   done(null, serializedUser)
// })

export default strategy
