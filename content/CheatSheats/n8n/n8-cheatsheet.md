# n8n Developer Cheatsheet

A comprehensive reference guide for building n8n workflows based on official documentation from docs.n8n.io.

## Node Architecture Fundamentals

### Data Flow Model
All data in n8n flows as **arrays of JSON objects** with this structure:
```json
[
  { "json": { "key1": "value1", "key2": "value2" } },
  { "json": { "key1": "value3", "key2": "value4" } }
]
```

**Key Requirements:**
- Data must be an array of objects
- Each object requires a `json` key wrapping actual data
- From v0.166.0+, n8n auto-adds `json` key for Function/Code nodes
- Custom nodes must ensure proper structure

### Node Types

**Trigger Nodes** (⚡ icon)
- Start workflows, provide initial data
- Only one trigger executes per workflow
- Examples: Schedule Trigger, Webhook, Manual Trigger

**Action/App Nodes**
- Process data from previous nodes
- 400+ built-in integrations available
- Categories: App integrations, data transformation, flow control

**Core Nodes**
- Fundamental functionality (HTTP Request, Code, IF, Switch)
- Can be trigger or action nodes
- Essential for logic and generic operations

## Essential JSON Workflow Structure

### Basic Workflow Template
```json
{
  "name": "Example Workflow",
  "nodes": [
    {
      "id": "node-1",
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1.1,
      "position": [250, 300],
      "parameters": {
        "triggerInterval": "weeks",
        "weeksBetweenTriggers": 1,
        "triggerAtHour": 9,
        "triggerAtMinute": 0
      }
    }
  ],
  "connections": {
    "Schedule Trigger": {
      "main": [
        [{ "node": "Next Node", "type": "main", "index": 0 }]
      ]
    }
  }
}
```

### HTTP Request Node Configuration
```json
{
  "name": "API Request",
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "method": "POST",
    "url": "https://api.service.com/v1/endpoint",
    "authentication": "predefinedCredentialType",
    "sendQuery": true,
    "queryParameters": {
      "parameters": [
        { "name": "limit", "value": "10" },
        { "name": "page", "value": "={{ $pageCount + 1 }}" }
      ]
    },
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        { "name": "Content-Type", "value": "application/json" },
        { "name": "Authorization", "value": "Bearer {{ $credentials.token }}" }
      ]
    },
    "sendBody": true,
    "bodyContentType": "json",
    "jsonBody": "={{ { data: $json, timestamp: $now } }}",
    "options": {
      "pagination": {
        "paginationMode": "updateAParameterInEachRequest",
        "maxRequests": 100
      }
    }
  }
}
```

### Webhook Node Configuration
```json
{
  "name": "Webhook",
  "type": "n8n-nodes-base.webhook",
  "parameters": {
    "httpMethod": "POST",
    "path": "my-webhook-endpoint",
    "authentication": "basicAuth",
    "responseMode": "whenLastNodeFinishes",
    "options": {
      "allowedOrigins": "*",
      "rawBody": true,
      "responseData": "={{ { success: true, receivedData: $json } }}"
    }
  }
}
```

### Code Node Template
```json
{
  "name": "Data Processor",
  "type": "n8n-nodes-base.code",
  "parameters": {
    "language": "javaScript",
    "jsCode": "// Process each item\nfor (const item of $input.all()) {\n  item.json.processedAt = new Date().toISOString();\n  item.json.score = Math.random() * 100;\n  \n  if (item.json.contacts) {\n    item.json.contactCount = item.json.contacts.length;\n  }\n}\n\nreturn $input.all();",
    "mode": "runOnceForAllItems"
  }
}
```

## Popular Integrations and Patterns

### Most Used Nodes
- **HTTP Request**: Universal API calls
- **Webhook**: Receive external data
- **Schedule Trigger**: Time-based automation
- **Slack**: Team communication
- **Google Workspace**: Gmail, Sheets, Drive
- **Database Nodes**: PostgreSQL (recommended), MySQL
- **AI Agent**: LLM integrations
- **IF/Filter/Merge**: Workflow logic

### Authentication Patterns

**OAuth2 Setup**
```json
{
  "credentials": {
    "oauth2Api": {
      "authUrl": "https://api.service.com/oauth2/authorize",
      "accessTokenUrl": "https://api.service.com/oauth2/token",
      "clientId": "your-client-id",
      "clientSecret": "your-client-secret",
      "scope": "read write"
    }
  }
}
```

**API Key Authentication**
```json
{
  "authentication": "genericCredentialType",
  "genericAuthType": "httpHeaderAuth",
  "sendHeaders": true,
  "headerParameters": {
    "parameters": [
      { "name": "X-API-Key", "value": "={{ $credentials.apiKey }}" }
    ]
  }
}
```

### Common Workflow Patterns

**Conditional Logic**
```json
{
  "name": "If",
  "type": "n8n-nodes-base.if",
  "parameters": {
    "conditions": {
      "options": {
        "leftValue": "={{ $json.status }}",
        "operation": "equal",
        "rightValue": "active"
      }
    }
  }
}
```

**Data Transformation**
```json
{
  "name": "Edit Fields",
  "type": "n8n-nodes-base.set",
  "parameters": {
    "mode": "manual",
    "fieldsToSet": [
      {
        "name": "fullName",
        "value": "={{ $json.firstName + ' ' + $json.lastName }}"
      },
      {
        "name": "email",
        "value": "={{ $json.emailAddress.toLowerCase() }}"
      }
    ]
  }
}
```

**Loop Processing**
```json
{
  "name": "Loop Over Items",
  "type": "n8n-nodes-base.splitInBatches",
  "parameters": {
    "batchSize": 10,
    "options": {
      "reset": true
    }
  }
}
```

## Advanced Features and Best Practices

### Error Handling
- Set up **Error Workflows** in workflow settings
- Use **Error Trigger** node to catch failures
- Configure node-level retry settings
- Implement **Stop and Error** nodes for custom failures

### Performance Optimization
- Use **Queue Mode** for production scaling
- Configure **PostgreSQL** database (not SQLite)
- Set execution data pruning limits
- Implement **batch processing** for large datasets

### Security Best Practices
- Use predefined credentials when available
- Store API keys as environment variables
- Enable **2FA** and proper user permissions
- Configure webhook authentication
- Use **HTTPS** for all external communications

### Expression Syntax

**Built-in Functions**
```javascript
{{ $now }}                    // Current timestamp
{{ $today }}                  // Today's date
{{ $json.field }}            // Access JSON data
{{ $node["NodeName"].json }} // Access specific node data
{{ $workflow.name }}         // Current workflow name
```

**Date Operations**
```javascript
{{ $today.minus(7, 'days') }}
{{ $now.toFormat('yyyy-MM-dd') }}
{{ DateTime.fromISO($json.date).plus({ hours: 24 }) }}
```

**String Functions**
```javascript
{{ $json.email.extractDomain() }}
{{ $json.name.toTitleCase() }}
{{ $json.text.removeMarkdown() }}
```

**Array Operations**
```javascript
{{ $json.items.length }}
{{ $json.tags.unique().join(', ') }}
{{ $json.numbers.max() }}
```

**Conditional Logic**
```javascript
{{ $json.status === 'active' ? 'Enabled' : 'Disabled' }}
{{ $json.priority || 'normal' }}
{{ $json.items?.length > 0 ? $json.items[0].name : 'No items' }}
```

### Debugging Tips
- Use **Pin Data** to test with fixed inputs
- Check execution history in **Executions** panel
- Use **Debug Helper** node for test data
- Implement `console.log()` in Code nodes
- Test webhooks with **Test URL** before production

### Environment Configuration

**Essential Variables**
```bash
# Basic Setup
N8N_HOST=0.0.0.0
N8N_PORT=5678
N8N_PROTOCOL=https
WEBHOOK_URL=https://your-domain.com/

# Database
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=localhost
DB_POSTGRESDB_DATABASE=n8n

# Security
N8N_ENCRYPTION_KEY=your-secure-key
N8N_JWT_AUTH_ACTIVE=true

# Performance
EXECUTIONS_MODE=queue
N8N_PAYLOAD_SIZE_MAX=16MB
```

**Queue Mode (Production)**
```bash
# Main instance
EXECUTIONS_MODE=queue
QUEUE_BULL_REDIS_HOST=redis-server

# Worker instances
npm run start:worker
```

### Keyboard Shortcuts
- **Tab**: Open node menu
- **Ctrl/Cmd + S**: Save workflow
- **Ctrl/Cmd + E**: Execute workflow
- **Ctrl/Cmd + D**: Duplicate node
- **Delete**: Remove selected node

### Common Schedule Patterns
```javascript
// Daily at 9 AM weekdays
"0 9 * * 1-5"

// Weekly on Mondays at 10 AM
"0 10 * * 1"

// Monthly on 1st at midnight
"0 0 1 * *"
```

### Import/Export Commands
```bash
# Export workflows
n8n export:workflow --all --output=backup.json

# Import workflows
n8n import:workflow --input=backup.json

# Export credentials (be careful!)
n8n export:credentials --all --output=creds.json --decrypted
```

## Quick Reference

### Data Structure Requirements
- Always return arrays of objects
- Use `json` key wrapper for data
- Handle multiple items automatically
- Apply proper error handling

### Popular Use Cases
- **API Integration**: Connect services with HTTP Request
- **Data Processing**: Transform and route information
- **Notifications**: Send alerts via Slack/email
- **File Handling**: Process uploads and downloads
- **Database Operations**: CRUD operations and synchronization
- **AI Workflows**: Document processing and chat automation

### Resource Requirements
- **Development**: 250MB RAM minimum
- **Production**: 1GB+ RAM with SSD
- **Database**: Dedicated PostgreSQL instance
- **Scaling**: Add workers in queue mode

This cheatsheet provides the essential knowledge for building robust n8n workflows efficiently. Refer to docs.n8n.io for the latest updates and detailed documentation.