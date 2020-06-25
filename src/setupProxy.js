const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    '/api/tablemanager',
    createProxyMiddleware({
      target: 'http://localhost:5004',
      changeOrigin: true,
    })
  );
  app.use(
    '/api/feedmanager',
    createProxyMiddleware({
      target: 'http://localhost:5004',
      changeOrigin: true,
    })
  );
  app.use(
    '/api/sampler',
    createProxyMiddleware({
      target: 'http://localhost:5004',
      changeOrigin: true,
    })
  );
  app.use(
    '/api/schedulemanager',
    createProxyMiddleware({
      target: 'http://localhost:5004',
      changeOrigin: true,
    })
  );
  app.use(
    '/api/actionsstaticdata',
    createProxyMiddleware({
      target: 'http://localhost:5004',
      changeOrigin: true,
    })
  );
  app.use(
    '/api/samplepages',
    createProxyMiddleware({
      target: 'http://localhost:5004',
      changeOrigin: true,
    })
  );
  app.use(
    '/accounts',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
    }), 
  );
  app.use(
    '/session',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
    })
  );
};
