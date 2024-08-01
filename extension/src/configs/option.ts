const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3000
  },
  server: {
    host: process.env.DEV_BE_HOST || "localhost",
    port: process.env.DEV_BE_PORT || 8000,
    name: process.env.DEV_BE_NAME || "DEV_XLOCK"
  }
}

const pro = {
  app: {
    port: process.env.PRO_APP_PORT || 3000
  },
  server: {
    host: process.env.PRO_SERVER_HOST || "34.126.139.41",
    port: process.env.PRO_SERVER_PORT || 8000,
    name: process.env.PRO_SERVER_NAME || "PRO_XLOCK"
  }
}

const config = { dev, pro }

const env = process.env.NODE_ENV || "dev"

module.exports = config[env]
