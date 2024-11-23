# API Documentation

This documentation describes the API endpoints for a simple blog backend built using Nest.js.

---

## Table of Contents

- [API Documentation](#api-documentation)
  - [Table of Contents](#table-of-contents)
  - [Base URL](#base-url)
  - [Authentication](#authentication)
    - [Sign Up](#sign-up)
    - [Sign In](#sign-in)
  - [Blogs](#blogs)
    - [Get All Blogs](#get-all-blogs)
    - [Get Blog by ID](#get-blog-by-id)
    - [Create Blog](#create-blog)
    - [Update Blog](#update-blog)
    - [Update Blog Status](#update-blog-status)
    - [Delete Blog](#delete-blog)
  - [Error Responses](#error-responses)
    - [Development Environment](#development-environment)
    - [Production Environment](#production-environment)
  - [Project setup](#project-setup)
  - [Compile and run the project](#compile-and-run-the-project)
  - [Run tests](#run-tests)
  - [Deployment](#deployment)
  - [Resources](#resources)
  - [Support](#support)
  - [Stay in touch](#stay-in-touch)
  - [License](#license)

---

## Base URL

```
http://localhost:3000/api
```

---

## Authentication

### Sign Up

**Endpoint:**  
`POST /auth/signup`

**Description:**  
Creates a new user.

**Request Body:**

```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "token": "string"
  }
}
```

---

### Sign In

**Endpoint:**  
`POST /auth/signin`

**Description:**  
Authenticates a user and generates a token.

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Signed in successfully",
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "token": "string"
  }
}
```

---

## Blogs

### Get All Blogs

**Endpoint:**  
`GET /blogs`

**Description:**  
Fetches a list of all blogs with optional filters.

**Query Parameters:**

- `status`: Filter blogs by status (e.g., `PUBLISHED`, `PENDING`).
- `author`: Filter blogs by author ID.
- `search`: Search blogs by title or content.

**Response:**

```json
{
  "success": true,
  "message": "Blogs fetched successfully.",
  "data": [
    {
      "id": "string",
      "title": "string",
      "cover": "string",
      "content": "string",
      "status": "string",
      "createdAt": "ISO 8601 string",
      "deletedAt": "null",
      "authorId": "string",
      "author": {
        "id": "string",
        "name": "string",
        "email": "string"
      }
    }
  ]
}
```

---

### Get Blog by ID

**Endpoint:**  
`GET /blogs/:id`

**Description:**  
Fetches a single blog by its ID.

**Response:**

```json
{
  "success": true,
  "message": "Blog fetched successfully",
  "data": {
    "id": "string",
    "title": "string",
    "cover": "string",
    "content": "string",
    "status": "string",
    "createdAt": "ISO 8601 string",
    "deletedAt": "null",
    "authorId": "string",
    "author": {
      "id": "string",
      "name": "string",
      "email": "string"
    }
  }
}
```

---

### Create Blog

**Endpoint:**  
`POST /blogs`

**Description:**  
Creates a new blog. Requires authentication.

**Headers:**

```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Request Body:**

```json
{
  "title": "string",
  "cover": "string",
  "content": "string"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Blog created successfully",
  "data": {
    "id": "string",
    "title": "string",
    "cover": "string",
    "content": "string",
    "status": "PENDING",
    "createdAt": "ISO 8601 string",
    "deletedAt": "null",
    "authorId": "string"
  }
}
```

---

### Update Blog

**Endpoint:**  
`PATCH /blogs/:id`

**Description:**  
Updates a blog. Requires the blog owner or admin.

**Headers:**

```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Request Body:**

```json
{
  "title": "string",
  "content": "string",
  "cover": "string"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Blog updated successfully",
  "data": {
    "id": "string",
    "title": "string",
    "cover": "string",
    "content": "string",
    "status": "PENDING",
    "createdAt": "ISO 8601 string",
    "deletedAt": "null",
    "authorId": "string"
  }
}
```

---

### Update Blog Status

**Endpoint:**  
`PATCH /blogs/:id/status`

**Description:**  
Updates the status of a blog. Requires admin access.

**Headers:**

```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Request Body:**

```json
{
  "status": "string" // e.g., "PENDING", "PUBLISHED"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Blog status updated successfully",
  "data": {
    "id": "string",
    "title": "string",
    "cover": "string",
    "content": "string",
    "status": "PUBLISHED",
    "createdAt": "ISO 8601 string",
    "deletedAt": "null",
    "authorId": "string"
  }
}
```

---

### Delete Blog

**Endpoint:**  
`DELETE /blogs/:id`

**Description:**  
Soft deletes a blog. Requires blog owner or admin access.

**Headers:**

```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Blog deleted successfully",
  "data": null
}
```

---

## Error Responses

### Development Environment

```json
{
  "statusCode": 500,
  "message": "Internal Server Error",
  "data": null,
  "stack": "Error: Something went wrong\n    at app.js:12:5"
}
```

### Production Environment

```json
{
  "statusCode": 500,
  "message": "Internal Server Error",
  "data": null
}
```

<br><br>

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
