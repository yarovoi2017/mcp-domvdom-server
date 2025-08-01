const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const winston = require('winston');
const Docker = require('dockerode');
require('dotenv').config();

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: '/var/log/mcp-server.log' })
    ]
});

const app = express();
const docker = new Docker();
const PORT = process.env.MCP_SERVER_PORT || 3000;

// Middleware с оптимизацией для ограниченных ресурсов
app.use(helmet());
app.use(cors({ 
    origin: [
        `https://${process.env.DOMAIN}`, 
        `https://api.${process.env.DOMAIN}`,
        'http://localhost:3000',
        'http://127.0.0.1:3000'
    ] 
}));
app.use(express.json({ limit: '1mb' }));

// API Key проверка
const apiKeyAuth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.MCP_API_KEY) {
        return res.status(401).json({ error: 'Invalid API key' });
    }
    next();
};

// Базовые маршруты
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0'
    });
});

// API Gateway маршруты
app.get('/', (req, res) => {
    res.json({
        service: 'mcp-server-domvdom',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            status: '/api/v1/status',
            manifest: '/mcp/manifest',
            v1: '/v1'
        },
        documentation: 'Local development mode'
    });
});

// V1 API маршруты
app.get('/v1', (req, res) => {
    res.json({
        version: '1.0.0',
        endpoints: {
            status: '/v1/status',
            services: '/v1/services',
            containers: '/v1/containers'
        }
    });
});

app.get('/v1/status', apiKeyAuth, async (req, res) => {
    try {
        const containers = await docker.listContainers({ all: true });
        const services = containers.map(c => ({
            name: c.Names[0].replace('/', ''),
            status: c.State,
            image: c.Image,
            ports: c.Ports
        }));

        res.json({
            service: 'mcp-server-domvdom',
            version: '1.0.0',
            status: 'running',
            services: services,
            memory: process.memoryUsage(),
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        logger.error('Error getting status:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/v1/services', apiKeyAuth, async (req, res) => {
    try {
        const containers = await docker.listContainers();
        const runningServices = containers.map(c => ({
            name: c.Names[0].replace('/', ''),
            status: c.State,
            image: c.Image,
            created: new Date(c.Created * 1000).toISOString()
        }));

        res.json({
            services: runningServices,
            count: runningServices.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        logger.error('Error getting services:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/v1/containers', apiKeyAuth, async (req, res) => {
    try {
        const containers = await docker.listContainers({ all: true });
        const allContainers = containers.map(c => ({
            id: c.Id,
            name: c.Names[0].replace('/', ''),
            status: c.State,
            image: c.Image,
            ports: c.Ports,
            created: new Date(c.Created * 1000).toISOString()
        }));

        res.json({
            containers: allContainers,
            count: allContainers.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        logger.error('Error getting containers:', error);
        res.status(500).json({ error: error.message });
    }
});

// Legacy маршруты для обратной совместимости
app.get('/api/v1/status', apiKeyAuth, async (req, res) => {
    try {
        const containers = await docker.listContainers({ all: true });
        const services = containers.map(c => ({
            name: c.Names[0].replace('/', ''),
            status: c.State,
            image: c.Image
        }));

        res.json({
            service: 'mcp-server-domvdom',
            status: 'running',
            services: services,
            memory: process.memoryUsage(),
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        logger.error('Error getting status:', error);
        res.status(500).json({ error: error.message });
    }
});

// Smithery MCP манифест
app.get('/mcp/manifest', (req, res) => {
    res.json({
        name: "mcp-server-domvdom",
        version: "1.0.0",
        description: "MCP Server for domvdom.com infrastructure management",
        mcp: {
            version: "0.1.0",
            capabilities: {
                resources: true,
                tools: true,
                logging: true
            }
        }
    });
});

app.listen(PORT, '0.0.0.0', () => {
    logger.info(`MCP Server started on port ${PORT}`);
    logger.info(`Local API available at: http://127.0.0.1:3000/`);
    logger.info(`V1 API available at: http://127.0.0.1:3000/v1/`);
});
