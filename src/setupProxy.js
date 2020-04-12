const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    '/tablemanager',
    createProxyMiddleware({
      target: 'http://localhost:5004',
      changeOrigin: true,
    })
  );
  app.use(
    '/feedmanager',
    createProxyMiddleware({
      target: 'http://localhost:5004',
      changeOrigin: true,
    })
  );

  app.use(
    '/schedulemanager',
    createProxyMiddleware({
      target: 'http://localhost:5004',
      changeOrigin: true,
    })
  );
  app.use(
    '/commandmanager',
    createProxyMiddleware({
      target: 'http://localhost:5001',
      changeOrigin: true,
    })
  );
  app.use(
    '/feedjobmanager',
    createProxyMiddleware({
      target: 'http://localhost:5001',
      changeOrigin: true,
    })
  );
};
