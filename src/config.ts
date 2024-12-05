import { Dialect } from "sequelize";

require('dotenv').config();

const {
  SQ_DIALECT,
  SQ_HOST,
  SQ_PORT,
  SQ_USERNAME,
  SQ_PASSWORD,
  SQ_DB,
  API_HASH_KEY,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USERNAME,
  SMTP_PASSWORD,
  PORTAL_URL,
  CDN_HOST,
  CDN_PORT,
  CDN_USERNAME,
  CDN_PASSWORD,
  JWT_SECRET,
  PORT
} = process.env;

export const sequelizeConfig = {
  dialect: SQ_DIALECT as Dialect,
  host: SQ_HOST,
  port: Number(SQ_PORT),
  username: SQ_USERNAME,
  password: SQ_PASSWORD,
  database: SQ_DB
}

export const smtpConfig = {
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE === "true",
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD
  },
  ignoreTLS: false
}

export const portalUrl = PORTAL_URL;

export const hashKey = API_HASH_KEY;

export const cdnConfig = {
  host: CDN_HOST,
  port: CDN_PORT,
  user: CDN_USERNAME,
  password: CDN_PASSWORD
}

export const jwtSecret = JWT_SECRET;

export const apiPort = PORT;