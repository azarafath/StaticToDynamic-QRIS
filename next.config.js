// next.config.js
module.exports = {
    async rewrites() {
      return [
        {
          source: '/qr-display',
          destination: '/qr-display.tsx',
        },
      ];
    },
  };
  