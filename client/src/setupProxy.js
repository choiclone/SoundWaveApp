const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // 도커 서버 api docker 빌드 시 사용하면 될듯 ex) http://내_PC_IP:3000 으로 알아서 바꿔라
  app.use(
    createProxyMiddleware('/api', { 
      target: `http://localhost:3000`,
      changeOrigin: true
    })
  );
  app.use(
    createProxyMiddleware('/statics', {
      target: `http://localhost:3000/`
    })
  );
};
