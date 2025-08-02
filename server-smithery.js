const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const winston = require('winston');
require('dotenv').config();

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console()
    ]
});

const app = express();
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
    const expectedKey = process.env.MCP_API_KEY || 'test';
    if (apiKey !== expectedKey) {
        return res.status(401).json({ error: 'Invalid API key' });
    }
    next();
};

// Mock Docker данные для Smithery
const mockContainers = [
    {
        name: "mcp-server",
        status: "running",
        image: "mcp-server-mcp-server",
        ports: [{ IP: "127.0.0.1", PrivatePort: 3000, PublicPort: 3001, Type: "tcp" }],
        created: 1754126011
    },
    {
        name: "portal-backend",
        status: "running", 
        image: "backend-portal-backend",
        ports: [{ PrivatePort: 3000, Type: "tcp" }],
        created: 1754110776
    },
    {
        name: "authentik-server",
        status: "running",
        image: "ghcr.io/goauthentik/server:2024.6.3",
        ports: [{ IP: "127.0.0.1", PrivatePort: 9000, PublicPort: 9000, Type: "tcp" }],
        created: 1754113234
    },
    {
        name: "grafana",
        status: "running",
        image: "grafana/grafana:latest",
        ports: [{ IP: "127.0.0.1", PrivatePort: 3000, PublicPort: 3000, Type: "tcp" }],
        created: 1754113191
    },
    {
        name: "traefik",
        status: "running",
        image: "traefik:v3.0",
        ports: [
            { IP: "0.0.0.0", PrivatePort: 8080, PublicPort: 8080, Type: "tcp" },
            { IP: "0.0.0.0", PrivatePort: 443, PublicPort: 443, Type: "tcp" },
            { IP: "0.0.0.0", PrivatePort: 80, PublicPort: 80, Type: "tcp" }
        ],
        created: 1754089244
    }
];

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
                                description: 'List all Docker containers (mock data for Smithery)',
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
                                description: 'Get status of specific container (mock data)',
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
                                name: 'get_system_info',
                                description: 'Get system information (mock data)',
                                inputSchema: {
                                    type: 'object',
                                    properties: {}
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
                            result = mockContainers;
                            break;
                            
                        case 'container_status':
                            const container = mockContainers.find(c => c.name === args.container_name);
                            if (!container) {
                                throw new Error(`Container ${args.container_name} not found`);
                            }
                            result = container;
                            break;
                            
                        case 'get_system_info':
                            result = {
                                uptime: process.uptime(),
                                memory: process.memoryUsage(),
                                platform: process.platform,
                                node_version: process.version,
                                containers_count: mockContainers.length,
                                running_count: mockContainers.filter(c => c.status === 'running').length
                            };
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
                                name: 'Docker Containers (Mock)',
                                description: 'List of all Docker containers (mock data for Smithery)',
                                mimeType: 'application/json'
                            },
                            {
                                uri: 'system://info',
                                name: 'System Information',
                                description: 'System information and statistics',
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
                        content = JSON.stringify(mockContainers, null, 2);
                    } else if (uri === 'system://info') {
                        content = JSON.stringify({
                            uptime: process.uptime(),
                            memory: process.memoryUsage(),
                            platform: process.platform,
                            node_version: process.version,
                            containers_count: mockContainers.length,
                            running_count: mockContainers.filter(c => c.status === 'running').length
                        }, null, 2);
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
app.get('/', (req, res) => {
    res.json({
        service: 'mcp-server-domvdom-smithery',
        version: '1.0.0',
        status: 'running',
        mode: 'smithery-mock',
        endpoints: {
            health: '/health',
            mcp: '/mcp',
            manifest: '/mcp/manifest'
        }
    });
});

app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0',
        mode: 'smithery-mock',
        memory: process.memoryUsage(),
        platform: process.platform
    });
});

// MCP Manifest
app.get('/mcp/manifest', apiKeyAuth, (req, res) => {
    res.json({
        name: 'mcp-server-domvdom-smithery',
        version: '1.0.0',
        description: 'MCP Server for domvdom.com infrastructure management (Smithery Mock Mode)',
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

// Запуск сервера
app.listen(PORT, () => {
    logger.info(`MCP Server (Smithery Mock Mode) started on port ${PORT}`);
    logger.info(`Local API available at: http://127.0.0.1:${PORT}/`);
    logger.info(`MCP JSON-RPC available at: http://127.0.0.1:${PORT}/mcp`);
    console.log(`🚀 Server started successfully on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔧 MCP endpoint: http://localhost:${PORT}/mcp`);
});

// Обработка ошибок
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    logger.error('Uncaught Exception', { error: error.message });
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    logger.error('Unhandled Rejection', { reason: reason.toString() });
}); 