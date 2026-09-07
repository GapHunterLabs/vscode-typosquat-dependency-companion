/**
 * A curated, hardcoded list of well-known npm packages to compare
 * dependency names against. v0.1 scope, honestly noted: this list is
 * static and will go stale -- it isn't fetched from the live npm
 * registry (this extension makes zero network calls, by design, same
 * as the rest of this workstream). Good enough to catch the classic
 * typosquat shape (a name one or two characters off from something
 * extremely popular); it will never catch every real package.
 */
export const POPULAR_PACKAGES: readonly string[] = [
  'react', 'react-dom', 'react-native', 'vue', 'angular', 'svelte', 'next', 'nuxt',
  'lodash', 'underscore', 'ramda', 'moment', 'dayjs', 'date-fns', 'luxon',
  'express', 'koa', 'fastify', 'hapi', 'nestjs',
  'axios', 'node-fetch', 'got', 'superagent', 'request',
  'chalk', 'kleur', 'picocolors', 'colors', 'ora', 'boxen', 'figlet',
  'commander', 'yargs', 'minimist', 'meow', 'inquirer', 'prompts',
  'eslint', 'prettier', 'typescript', 'babel', 'webpack', 'rollup', 'vite', 'esbuild', 'parcel',
  'jest', 'mocha', 'chai', 'sinon', 'vitest', 'ava', 'tape', 'jasmine',
  'uuid', 'nanoid', 'shortid', 'semver', 'tslib', 'core-js', 'rxjs',
  'redux', 'mobx', 'zustand', 'recoil', 'jotai',
  'prisma', 'sequelize', 'typeorm', 'mongoose', 'knex',
  'pg', 'mysql', 'mysql2', 'sqlite3', 'redis', 'ioredis',
  'socket.io', 'ws', 'cors', 'helmet', 'morgan', 'body-parser', 'multer', 'compression',
  'passport', 'jsonwebtoken', 'bcrypt', 'bcryptjs', 'nodemailer',
  'aws-sdk', 'firebase', 'stripe', 'twilio', '@sentry/node', '@sentry/browser',
  'husky', 'lint-staged', 'nodemon', 'concurrently', 'cross-env', 'dotenv', 'ts-node', 'tsx',
  'postcss', 'tailwindcss', 'sass', 'less', 'styled-components', 'emotion',
  'formik', 'react-hook-form', 'yup', 'zod', 'joi', 'ajv',
  'form-data', 'qs', 'query-string',
  'table', 'cli-table3', 'glob', 'minimatch', 'rimraf', 'mkdirp', 'fs-extra',
  'async', 'debug', 'winston', 'pino', 'bunyan',
  'graphql', 'apollo-server', 'apollo-client', 'graphql-tag',
  'webpack-cli', 'webpack-dev-server', 'html-webpack-plugin',
  'react-router', 'react-router-dom', 'vue-router', '@reduxjs/toolkit',
  'classnames', 'clsx', 'immer', 'lru-cache', 'p-limit', 'p-queue', 'bottleneck',
  'axios-retry', 'retry', 'p-retry',
  'jsonwebtoken', 'jose', 'crypto-js', 'node-forge',
  'sharp', 'jimp', 'canvas',
  'puppeteer', 'playwright', 'cypress', 'selenium-webdriver',
  'dotenv-expand', 'yaml', 'js-yaml', 'toml',
  'commander', 'execa', 'cross-spawn', 'which',
];
