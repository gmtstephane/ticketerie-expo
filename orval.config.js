module.exports = {
  'ticketerie': {
    output: {
      mode: 'single',
      target: './src/api/ticketerie.ts',
      schemas: './src/api/model',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/api/mutator.ts',
          name: 'customInstance',
        },
      },
    },
    input: {
      target: './docs/openapi.yaml',
    },
  },
};