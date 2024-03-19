module.exports = {
  'ticketerie': {
    output: {
      mode: 'single',
      target: './api/ticketerie.ts',
      schemas: './api/model',
      client: 'react-query',
    },
    input: {
      target: './docs/openapi.yaml',
    },
  },
};