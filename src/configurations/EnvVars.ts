/* eslint-disable node/no-process-env */

export default {
  nodeEnv: process.env.NODE_ENV ?? "",
  port: process.env.PORT ?? 0,
  reckonBaseUrl: process.env.RECKON_BASEURL ?? "",
  maxRetries: process.env.MAX_RETRIES ?? 5,
} as const;
