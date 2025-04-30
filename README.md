# HPP

This is a nextjs app that uses the bvnk api to generate a uuid and then uses that uuid to create a payment.

## Getting Started

First, install dependencies:

```bash
yarn
```

packages:

- nextjs
- tailwindcss
- react
- react-hook-form
- zod
- jotai
- shadcn ui
- axios
- jotai-tanstack-query
- react-qr-code
- cypress
- jest
- react-testing-library

## Running the app

Run the development server:

```bash
yarn dev
```

Run the postman POST request to generate a uuid: https://api.sandbox.bvnk.com/api/v1/pay/summary

Navigate to [http://localhost:3000/{uuid}](http://localhost:3000/{uuid}) with your browser to see the result.

## Testing

### Cypress

To run the cypress tests, first, install the dependencies:

Copy the uuid generated from the postman request and paste it in the cypress.config.ts file.

Then, run the tests:

```bash
yarn cypress:open
```

### End-to-end smoke test

To run the end-to-end smoke test, first, install the dependencies:

Copy the uuid generated from the postman request and paste it in the cypress.config.ts file.

### Jest

To run the jest tests, first, install the dependencies:

Then, run the tests:

```bash
yarn test
```

### Linting

# Notes

- Things I would like to add:
  - Component testing
  - Deeper End-to-end testing
  - Server actions for put requests
  - Put more effort into thinking about file structure using app router

.env is checked in to make it easier to run the app locally specifically for this test.
