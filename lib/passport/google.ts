import { Strategy, Profile } from 'passport-google-oauth20'
import appConfig from '../appConfig'
import passport from 'passport'

// STATICALLY configure the Github strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Github API on the user's
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
  (accessToken, refreshToken, githubProfile, cb) => {
    // Right now, the user's Github profile is supplied as the user
    // record. In a production-quality application, the Github profile should
    // be associated with an app-specific user record in app persistence,
    // which allows for account linking and authentication with other identity providers.

    // Upsert user here
    console.log(accessToken, refreshToken, githubProfile)

    // see https://github.com/jaredhanson/passport-github/blob/master/lib/strategy.js#L40
    // see https://gitlab.com/andycunn/canvass/blob/f3f03859b3de66f30d7703a4c5d2f44f7c724f67/api/app.js#L118
    // for an example
    cb(null, githubProfile)
  }
)

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Github profile is serialized
// and deserialized.
passport.serializeUser((user: Profile, done) => {
  const { id, displayName, username, profileUrl, photos } = user
  done(null, { id, displayName, username, profileUrl, photos })
})
passport.deserializeUser(async (serializedUser, done) => {
  if (!serializedUser) {
    return done(new Error(`User not found: ${serializedUser}`))
  }

  done(null, serializedUser)
})

export default strategy
