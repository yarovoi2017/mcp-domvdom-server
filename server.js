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
        'http://127.0.0.1:3000',
        'https://smithery.ai',
        'https://*.smithery.ai',
        'https://app.smithery.ai'
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

// MCP JSON-RPC обработчик
const handleMCPRequest = async (req, res) => {
    try {
        const { method, params, id } = req.body;
        
        logger.info('MCP request received', { method, id });
        
        switch (method) {
            case 'tools/list':
                res.json({
                    jsonrpc: '2.0',
                    id,
                    result: {
                        tools: [
                            {
                                name: 'list_containers',
                                description: 'List all Docker containers',
                                inputSchema: {
                                    type: 'object',
                                    properties: {
                                        all: {
                                            type: 'boolean',
                                            description: 'Include stopped containers'
                                        }
                                    }
                                }
                            },
                            {
                                name: 'container_status',
                                description: 'Get status of specific container',
                                inputSchema: {
                                    type: 'object',
                                    properties: {
                                        container_name: {
                                            type: 'string',
                                            description: 'Name of the container'
                                        }
                                    },
                                    required: ['container_name']
                                }
                            },
                            {
                                name: 'start_container',
                                description: 'Start a stopped container',
                                inputSchema: {
                                    type: 'object',
                                    properties: {
                                        container_name: {
                                            type: 'string',
                                            description: 'Name of the container'
                                        }
                                    },
                                    required: ['container_name']
                                }
                            },
                            {
                                name: 'stop_container',
                                description: 'Stop a running container',
                                inputSchema: {
                                    type: 'object',
                                    properties: {
                                        container_name: {
                                            type: 'string',
                                            description: 'Name of the container'
                                        }
                                    },
                                    required: ['container_name']
                                }
                            },
                            {
                                name: 'restart_container',
                                description: 'Restart a container',
                                inputSchema: {
                                    type: 'object',
                                    properties: {
                                        container_name: {
                                            type: 'string',
                                            description: 'Name of the container'
                                        }
                                    },
                                    required: ['container_name']
                                }
                            },
                            {
                                name: 'get_logs',
                                description: 'Get container logs',
                                inputSchema: {
                                    type: 'object',
                                    properties: {
                                        container_name: {
                                            type: 'string',
                                            description: 'Name of the container'
                                        },
                                        tail: {
                                            type: 'number',
                                            description: 'Number of lines to return'
                                        }
                                    },
                                    required: ['container_name']
                                }
                            }
                        ]
                    }
                });
                break;
                
            case 'tools/call':
                const { name, arguments: args } = params;
                
                try {
                    let result;
                    
                    switch (name) {
                        case 'list_containers':
                            const containers = await docker.listContainers({ all: args.all || false });
                            result = containers.map(c => ({
                                name: c.Names[0].replace('/', ''),
                                status: c.State,
                                image: c.Image,
                                ports: c.Ports,
                                created: c.Created
                            }));
                            break;
                            
                        case 'container_status':
                            const container = await docker.getContainer(args.container_name);
                            const info = await container.inspect();
                            result = {
                                name: info.Name.replace('/', ''),
                                status: info.State.Status,
                                image: info.Config.Image,
                                ports: info.NetworkSettings.Ports,
                                created: info.Created
                            };
                            break;
                            
                        case 'start_container':
                            const startContainer = await docker.getContainer(args.container_name);
                            await startContainer.start();
                            result = { message: `Container ${args.container_name} started successfully` };
                            break;
                            
                        case 'stop_container':
                            const stopContainer = await docker.getContainer(args.container_name);
                            await stopContainer.stop();
                            result = { message: `Container ${args.container_name} stopped successfully` };
                            break;
                            
                        case 'restart_container':
                            const restartContainer = await docker.getContainer(args.container_name);
                            await restartContainer.restart();
                            result = { message: `Container ${args.container_name} restarted successfully` };
                            break;
                            
                        case 'get_logs':
                            const logContainer = await docker.getContainer(args.container_name);
                            const logs = await logContainer.logs({
                                stdout: true,
                                stderr: true,
                                tail: args.tail || 100
                            });
                            result = { logs: logs.toString() };
                            break;
                            
                        default:
                            throw new Error(`Unknown tool: ${name}`);
                    }
                    
                    res.json({
                        jsonrpc: '2.0',
                        id,
                        result: { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
                    });
                    
                } catch (error) {
                    res.json({
                        jsonrpc: '2.0',
                        id,
                        error: {
                            code: -32603,
                            message: error.message
                        }
                    });
                }
                break;
                
            case 'resources/list':
                res.json({
                    jsonrpc: '2.0',
                    id,
                    result: {
                        resources: [
                            {
                                uri: 'docker://containers',
                                name: 'Docker Containers',
                                description: 'List of all Docker containers',
                                mimeType: 'application/json'
                            },
                            {
                                uri: 'docker://networks',
                                name: 'Docker Networks',
                                description: 'List of all Docker networks',
                                mimeType: 'application/json'
                            },
                            {
                                uri: 'docker://volumes',
                                name: 'Docker Volumes',
                                description: 'List of all Docker volumes',
                                mimeType: 'application/json'
                            }
                        ]
                    }
                });
                break;
                
            case 'resources/read':
                const { uri } = params;
                
                try {
                    let content;
                    
                    if (uri === 'docker://containers') {
                        const containers = await docker.listContainers({ all: true });
                        content = JSON.stringify(containers, null, 2);
                    } else if (uri === 'docker://networks') {
                        const networks = await docker.listNetworks();
                        content = JSON.stringify(networks, null, 2);
                    } else if (uri === 'docker://volumes') {
                        const volumes = await docker.listVolumes();
                        content = JSON.stringify(volumes, null, 2);
                    } else {
                        throw new Error(`Unknown resource: ${uri}`);
                    }
                    
                    res.json({
                        jsonrpc: '2.0',
                        id,
                        result: {
                            contents: [{
                                uri,
                                mimeType: 'application/json',
                                text: content
                            }]
                        }
                    });
                    
                } catch (error) {
                    res.json({
                        jsonrpc: '2.0',
                        id,
                        error: {
                            code: -32603,
                            message: error.message
                        }
                    });
                }
                break;
                
            default:
                res.json({
                    jsonrpc: '2.0',
                    id,
                    error: {
                        code: -32601,
                        message: `Method not found: ${method}`
                    }
                });
        }
        
    } catch (error) {
        logger.error('MCP request error', { error: error.message });
        res.json({
            jsonrpc: '2.0',
            id: req.body.id,
            error: {
                code: -32603,
                message: error.message
            }
        });
    }
};

// MCP JSON-RPC endpoint
app.post('/mcp', apiKeyAuth, handleMCPRequest);

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
            v1: '/v1',
            mcp: '/mcp'
        },
        documentation: 'MCP Server with JSON-RPC support'
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
        logger.error('Status error', { error: error.message });
        res.status(500).json({ error: error.message });
    }
});

app.get('/v1/services', apiKeyAuth, async (req, res) => {
    try {
        const containers = await docker.listContainers();
        const services = containers.map(c => ({
            name: c.Names[0].replace('/', ''),
            status: c.State,
            image: c.Image
        }));
        
        res.json({ services });
    } catch (error) {
        logger.error('Services error', { error: error.message });
        res.status(500).json({ error: error.message });
    }
});

app.get('/v1/containers', apiKeyAuth, async (req, res) => {
    try {
        const containers = await docker.listContainers({ all: true });
        res.json({ containers });
    } catch (error) {
        logger.error('Containers error', { error: error.message });
        res.status(500).json({ error: error.message });
    }
});

// MCP Manifest
app.get('/mcp/manifest', apiKeyAuth, (req, res) => {
    res.json({
        name: 'mcp-server-domvdom',
        version: '1.0.0',
        description: 'MCP Server for domvdom.com infrastructure management',
        mcp: {
            version: '0.1.0',
            capabilities: {
                resources: true,
                tools: true,
                logging: true
            }
        }
    });
});

// Smithery-specific endpoints
app.get('/smithery/manifest', apiKeyAuth, (req, res) => {
    res.json({
        name: 'domvdom-mcp-server',
        version: '1.0.0',
        description: 'MCP Server for domvdom.com services management',
        author: 'yarovoi2017',
        repository: 'https://github.com/yarovoi2017/mcp-domvdom-server',
        endpoints: {
            status: '/v1/status',
            services: '/v1/services',
            containers: '/v1/containers',
            health: '/health',
            mcp: '/mcp'
        },
        capabilities: {
            docker: true,
            monitoring: true,
            api_gateway: true,
            mcp_jsonrpc: true
        }
    });
});

app.get('/smithery/health', apiKeyAuth, async (req, res) => {
    try {
        const containers = await docker.listContainers();
        const runningCount = containers.filter(c => c.State === 'running').length;
        
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            containers: {
                total: containers.length,
                running: runningCount,
                stopped: containers.length - runningCount
            },
            memory: process.memoryUsage(),
            uptime: process.uptime()
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'unhealthy',
            error: error.message 
        });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    logger.info(`MCP Server started on port ${PORT}`);
    logger.info(`Local API available at: http://127.0.0.1:${PORT}/`);
    logger.info(`V1 API available at: http://127.0.0.1:${PORT}/v1/`);
    logger.info(`MCP JSON-RPC available at: http://127.0.0.1:${PORT}/mcp`);
});
