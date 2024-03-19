module.exports = {
  'ticketerie': {
    output: {
      mode: 'single',
      target: './src/api/ticketerie.ts',
      schemas: './src/api/model',
      client: 'react-query',
    },
    input: {
      target: './docs/openapi.yaml',
    },
  },
};