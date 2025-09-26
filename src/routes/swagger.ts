import express from 'express';
import { swaggerSpec } from '../config/swagger';

const router = express.Router();

// Swagger UI with CSP-friendly approach
router.get('/', (req, res) => {
  // Set CSP headers to allow Swagger UI resources
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://unpkg.com; " +
    "style-src 'self' 'unsafe-inline' https://unpkg.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://unpkg.com"
  );

  const html = `
<!DOCTYPE html>
<html>
<head>
    <title>LemoTech API Documentation</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
    <style>
        html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
        *, *:before, *:after { box-sizing: inherit; }
        body { margin:0; background: #fafafa; }
        .swagger-ui .topbar { background-color: #007dff; }
        .swagger-ui .topbar .download-url-wrapper { display: none; }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
    <script>
        window.onload = function() {
            const ui = SwaggerUIBundle({
                url: '/api-docs/swagger.json',
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout",
                defaultModelsExpandDepth: 1,
                defaultModelExpandDepth: 1,
                docExpansion: "list",
                operationsSorter: "alpha",
                tagsSorter: "alpha"
            });
        };
    </script>
</body>
</html>`;
  res.send(html);
});

// Serve the OpenAPI spec as JSON
router.get('/swagger.json', (req, res) => {
  res.json(swaggerSpec);
});

export default router;
