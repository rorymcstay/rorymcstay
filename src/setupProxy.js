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
    '/sampler',
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
    '/runningmanager',
    createProxyMiddleware({
      target: 'http://localhost:5003',
      changeOrigin: true,
    })
  );
  app.use(
    '/samplepages',
    createProxyMiddleware({
      target: 'http://localhost:5004',
      changeOrigin: true,
    })
  );
  app.use(
    '/actionsmanager',
    createProxyMiddleware({
      target: 'http://localhost:5003',
      changeOrigin: true,
    })
  );
};
