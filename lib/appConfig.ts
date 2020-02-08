const {URL} = require('url')

export interface AppConfig {
  isDevelopment: boolean
  hostingURL: string

  getCredentialsForOAuthProvider(provider: string): {
    provider: string,
    clientID: string,
    clientSecret: string
  }
  getOAuthCallbackUrl(provider: string, host?: string): string 
}
const isDevelopment = process.env.NODE_ENV !== 'production'
const hostingURL = process.env.HOSTING_URL || 'http://localhost:3000'

const getOAuthCallbackUrl = (provider:string, host?: string) => {
  host = host || hostingURL
  const callbackUrl = new URL(`/api/auth/callback/${provider}`, host)
  return callbackUrl.toString()
}

const getCredentialsForOAuthProvider = ( provider:string ) => {
  const prefix = provider.toUpperCase() + '_'
  const clientID = process.env[prefix + 'CLIENTID']
  const clientSecret = process.env[prefix + 'CLIENTSECRET']
  if(!clientID) throw new Error(`${prefix}CLIENTID was set in environment variables.`)
  if(!clientSecret) throw new Error(`${prefix}CLIENTSECRET was set in environment variables.`)
  return { provider, clientID, clientSecret }
}
const appConfig: AppConfig = {
  isDevelopment,
  hostingURL,
  getCredentialsForOAuthProvider,
  getOAuthCallbackUrl
}
 

console.log(appConfig)
export default appConfig
