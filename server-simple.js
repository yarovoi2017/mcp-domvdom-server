const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.MCP_SERVER_PORT || 3000;

// Простое middleware
app.use(cors());
app.use(express.json());

// Простая проверка API key
const apiKeyAuth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const expectedKey = process.env.MCP_API_KEY || 'test';
    if (apiKey !== expectedKey) {
        return res.status(401).json({ error: 'Invalid API key' });
    }
    next();
};

// Mock данные
const mockContainers = [
    { name: "mcp-server", status: "running", image: "mcp-server" },
    { name: "portal-backend", status: "running", image: "backend" },
    { name: "grafana", status: "running", image: "grafana" }
];

// MCP обработчик
const handleMCPRequest = async (req, res) => {
    try {
        const { method, params, id } = req.body;
        
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
                                inputSchema: { type: 'object', properties: {} }
                            }
                        ]
                    }
                });
                break;
                
            case 'tools/call':
                const { name } = params;
                if (name === 'list_containers') {
                    res.json({
                        jsonrpc: '2.0',
                        id,
                        result: { content: [{ type: 'text', text: JSON.stringify(mockContainers, null, 2) }] }
                    });
                } else {
                    res.json({
                        jsonrpc: '2.0',
                        id,
                        error: { code: -32603, message: `Unknown tool: ${name}` }
                    });
                }
                break;
                
            default:
                res.json({
                    jsonrpc: '2.0',
                    id,
                    error: { code: -32601, message: `Method not found: ${method}` }
                });
        }
        
    } catch (error) {
        res.json({
            jsonrpc: '2.0',
            id: req.body.id,
            error: { code: -32603, message: error.message }
        });
    }
};

// Endpoints
app.get('/', (req, res) => {
    res.json({ service: 'mcp-server-simple', version: '1.0.0', status: 'running' });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/mcp', apiKeyAuth, handleMCPRequest);

app.get('/mcp/manifest', apiKeyAuth, (req, res) => {
    res.json({
        name: 'mcp-server-simple',
        version: '1.0.0',
        description: 'Simple MCP Server for Smithery',
        mcp: { version: '0.1.0', capabilities: { tools: true, resources: true } }
    });
});

// Запуск
app.listen(PORT, () => {
    console.log(`🚀 Simple MCP Server started on port ${PORT}`);
    console.log(`📊 Health: http://localhost:${PORT}/health`);
    console.log(`🔧 MCP: http://localhost:${PORT}/mcp`);
}); 