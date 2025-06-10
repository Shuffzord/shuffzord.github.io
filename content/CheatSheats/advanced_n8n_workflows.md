---
title: N8N Advanced n8n Workflow Examples - Database & API Integration
date: 2025-06-09
tags: ["n8n"]
---

# Advanced n8n Workflow Examples - Database & API Integration

Complex workflows with error handling, data validation, and multi-step processing. These examples demonstrate enterprise-level automation patterns.

## 1. CRM Data Synchronization with Error Handling

**Purpose**: Sync external CRM data to local database with comprehensive error handling
**Use Case**: Customer data synchronization, inventory management, data warehousing

```json
{
  "name": "CRM to Database Sync with Error Handling",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "cronExpression",
              "expression": "0 */4 * * *"
            }
          ]
        }
      },
      "id": "schedule-sync",
      "name": "Every 4 Hours",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1.2,
      "position": [240, 400]
    },
    {
      "parameters": {
        "method": "GET",
        "url": "https://api.crm-system.com/v2/contacts",
        "authentication": "predefinedCredentialType",
        "nodeCredentialType": "httpHeaderAuth",
        "sendQuery": true,
        "queryParameters": {
          "parameters": [
            {
              "name": "limit",
              "value": "100"
            },
            {
              "name": "updated_since",
              "value": "={{ $workflow.lastSuccessTime || DateTime.now().minus({days: 1}).toISO() }}"
            },
            {
              "name": "include_deleted",
              "value": "true"
            }
          ]
        },
        "options": {
          "pagination": {
            "paginationMode": "updateAParameterInEachRequest",
            "paginationCompleteExpression": "={{ !$response.body.has_more }}",
            "limitPagesFetched": true,
            "maxRequests": 20,
            "pageSize": 100
          },
          "retry": {
            "enabled": true,
            "maxTries": 3,
            "waitBetweenTries": 2000
          },
          "timeout": 15000
        }
      },
      "id": "fetch-crm-data",
      "name": "Fetch CRM Contacts",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [460, 400],
      "credentials": {
        "httpHeaderAuth": {
          "id": "crm-api-credentials",
          "name": "CRM API Key"
        }
      }
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "leftValue": "={{ $json.contacts && Array.isArray($json.contacts) && $json.contacts.length > 0 }}",
            "operation": "equal",
            "rightValue": true
          }
        }
      },
      "id": "check-data-exists",
      "name": "Has Contact Data?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [680, 400]
    },
    {
      "parameters": {
        "fieldToSplitOut": "contacts",
        "options": {}
      },
      "id": "split-contacts",
      "name": "Split Contact Array",
      "type": "n8n-nodes-base.itemLists",
      "typeVersion": 3.3,
      "position": [900, 320]
    },
    {
      "parameters": {
        "language": "javaScript",
        "jsCode": "// Validate and transform contact data\nconst validContacts = [];\nconst invalidContacts = [];\n\nfor (const item of $input.all()) {\n  const contact = item.json;\n  const errors = [];\n  \n  // Validation rules\n  if (!contact.email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(contact.email)) {\n    errors.push('Invalid or missing email');\n  }\n  \n  if (!contact.id || contact.id.toString().length < 1) {\n    errors.push('Missing contact ID');\n  }\n  \n  if (!contact.first_name || contact.first_name.trim().length < 1) {\n    errors.push('Missing first name');\n  }\n  \n  if (contact.phone && !/^[\\+]?[1-9][\\d\\s\\-\\(\\)]{7,15}$/.test(contact.phone.replace(/\\s/g, ''))) {\n    errors.push('Invalid phone number format');\n  }\n  \n  if (errors.length === 0) {\n    // Transform valid contact\n    const transformedContact = {\n      external_id: contact.id.toString(),\n      first_name: contact.first_name.trim(),\n      last_name: (contact.last_name || '').trim(),\n      email: contact.email.toLowerCase().trim(),\n      phone: contact.phone ? contact.phone.replace(/[^\\d\\+]/g, '') : null,\n      company: (contact.company || '').trim() || null,\n      status: contact.status || 'active',\n      tags: Array.isArray(contact.tags) ? contact.tags.join(',') : null,\n      created_at: contact.created_date || contact.created_at,\n      updated_at: contact.updated_date || contact.updated_at,\n      is_deleted: contact.is_deleted || false,\n      sync_timestamp: new Date().toISOString(),\n      source: 'crm_sync'\n    };\n    \n    validContacts.push({ json: transformedContact });\n  } else {\n    // Log invalid contact\n    invalidContacts.push({ \n      json: { \n        original_contact: contact, \n        validation_errors: errors,\n        rejected_at: new Date().toISOString()\n      } \n    });\n    \n    console.log(`Invalid contact ${contact.id}: ${errors.join(', ')}`);\n  }\n}\n\nconsole.log(`Processed ${$input.all().length} contacts: ${validContacts.length} valid, ${invalidContacts.length} invalid`);\n\n// Store invalid contacts for later review\nif (invalidContacts.length > 0) {\n  $workflow.staticData.invalidContacts = invalidContacts;\n}\n\nreturn validContacts;"
      },
      "id": "validate-transform",
      "name": "Validate & Transform Data",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [1120, 320]
    },
    {
      "parameters": {
        "operation": "select",
        "schema": {
          "__rl": true,
          "value": "public",
          "mode": "list",
          "cachedResultName": "public"
        },
        "table": {
          "__rl": true,
          "value": "contacts",
          "mode": "list",
          "cachedResultName": "contacts"
        },
        "where": {
          "values": [
            {
              "column": "external_id",
              "condition": "equal",
              "value": "={{ $json.external_id }}"
            }
          ]
        },
        "options": {}
      },
      "id": "check-contact-exists",
      "name": "Check if Contact Exists",
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.4,
      "position": [1340, 320],
      "credentials": {
        "postgres": {
          "id": "postgres-db-connection",
          "name": "PostgreSQL Database"
        }
      }
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "leftValue": "={{ $('Check if Contact Exists').itemMatching($itemIndex).json }}",
            "operation": "isNotEmpty"
          }
        }
      },
      "id": "contact-exists-check",
      "name": "Contact Exists?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [1560, 320]
    },
    {
      "parameters": {
        "operation": "update",
        "schema": {
          "__rl": true,
          "value": "public",
          "mode": "list"
        },
        "table": {
          "__rl": true,
          "value": "contacts",
          "mode": "list"
        },
        "updateKey": "external_id",
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "first_name": "={{ $json.first_name }}",
            "last_name": "={{ $json.last_name }}",
            "email": "={{ $json.email }}",
            "phone": "={{ $json.phone }}",
            "company": "={{ $json.company }}",
            "status": "={{ $json.status }}",
            "tags": "={{ $json.tags }}",
            "updated_at": "={{ $json.updated_at }}",
            "sync_timestamp": "={{ $json.sync_timestamp }}",
            "is_deleted": "={{ $json.is_deleted }}"
          }
        },
        "options": {}
      },
      "id": "update-contact",
      "name": "Update Existing Contact",
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.4,
      "position": [1780, 220],
      "credentials": {
        "postgres": {
          "id": "postgres-db-connection",
          "name": "PostgreSQL Database"
        }
      }
    },
    {
      "parameters": {
        "operation": "insert",
        "schema": {
          "__rl": true,
          "value": "public",
          "mode": "list"
        },
        "table": {
          "__rl": true,
          "value": "contacts",
          "mode": "list"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "external_id": "={{ $json.external_id }}",
            "first_name": "={{ $json.first_name }}",
            "last_name": "={{ $json.last_name }}",
            "email": "={{ $json.email }}",
            "phone": "={{ $json.phone }}",
            "company": "={{ $json.company }}",
            "status": "={{ $json.status }}",
            "tags": "={{ $json.tags }}",
            "created_at": "={{ $json.created_at }}",
            "updated_at": "={{ $json.updated_at }}",
            "sync_timestamp": "={{ $json.sync_timestamp }}",
            "is_deleted": "={{ $json.is_deleted }}",
            "source": "={{ $json.source }}"
          }
        },
        "options": {
          "ignoreDuplicates": true
        }
      },
      "id": "insert-contact",
      "name": "Insert New Contact",
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.4,
      "position": [1780, 420],
      "credentials": {
        "postgres": {
          "id": "postgres-db-connection",
          "name": "PostgreSQL Database"
        }
      }
    },
    {
      "parameters": {
        "mode": "combine",
        "combinationMode": "multiplex",
        "options": {}
      },
      "id": "merge-results",
      "name": "Merge Update/Insert Results",
      "type": "n8n-nodes-base.merge",
      "typeVersion": 2.1,
      "position": [2000, 320]
    },
    {
      "parameters": {
        "language": "javaScript",
        "jsCode": "// Generate sync summary report\nconst allResults = $input.all();\nconst totalProcessed = allResults.length;\n\nconst summary = {\n  sync_completed_at: new Date().toISOString(),\n  total_contacts_processed: totalProcessed,\n  successful_operations: totalProcessed,\n  failed_operations: 0,\n  invalid_contacts: $workflow.staticData.invalidContacts?.length || 0,\n  sync_duration_seconds: Math.round((Date.now() - new Date($('Every 4 Hours').first().json.timestamp || Date.now()).getTime()) / 1000),\n  next_sync_scheduled: DateTime.now().plus({ hours: 4 }).toISO()\n};\n\n// Log invalid contacts if any\nif ($workflow.staticData.invalidContacts?.length > 0) {\n  console.log('Invalid contacts found:', JSON.stringify($workflow.staticData.invalidContacts, null, 2));\n}\n\nreturn [{ json: summary }];"
      },
      "id": "generate-summary",
      "name": "Generate Sync Summary",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [2220, 320]
    },
    {
      "parameters": {
        "resource": "message",
        "operation": "post",
        "channel": "#data-sync",
        "text": "✅ CRM Sync Completed Successfully\n\n📊 *Sync Summary:*\n• Total Contacts: {{ $json.total_contacts_processed }}\n• Successful: {{ $json.successful_operations }}\n• Failed: {{ $json.failed_operations }}\n• Invalid: {{ $json.invalid_contacts }}\n• Duration: {{ $json.sync_duration_seconds }}s\n• Next Sync: {{ DateTime.fromISO($json.next_sync_scheduled).toLocaleString() }}\n\n🕐 Completed: {{ DateTime.fromISO($json.sync_completed_at).toLocaleString() }}",
        "otherOptions": {
          "username": "CRM Sync Bot",
          "icon_emoji": ":arrows_counterclockwise:"
        }
      },
      "id": "success-notification",
      "name": "Send Success Notification",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 2.1,
      "position": [2440, 320],
      "credentials": {
        "slackApi": {
          "id": "slack-api-credentials",
          "name": "Slack API Token"
        }
      }
    },
    {
      "parameters": {
        "resource": "message",
        "operation": "post",
        "channel": "#alerts",
        "text": "❌ CRM Sync Failed\n\n*Error Details:*\n• Workflow: {{ $workflow.name }}\n• Error: {{ $json.error?.message || 'Unknown error' }}\n• Time: {{ new Date().toISOString() }}\n• Node: {{ $json.error?.node || 'Unknown' }}\n\n*Stack Trace:*\n```{{ $json.error?.stack || 'No stack trace available' }}```",
        "otherOptions": {
          "username": "Error Bot",
          "icon_emoji": ":x:"
        }
      },
      "id": "error-notification",
      "name": "Send Error Alert",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 2.1,
      "position": [900, 580],
      "credentials": {
        "slackApi": {
          "id": "slack-api-credentials",
          "name": "Slack API Token"
        }
      }
    }
  ],
  "connections": {
    "Every 4 Hours": {
      "main": [
        []
      ]
    },
    "Split Contact Array": {
      "main": [
        [
          {
            "node": "Validate & Transform Data",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Validate & Transform Data": {
      "main": [
        [
          {
            "node": "Check if Contact Exists",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Check if Contact Exists": {
      "main": [
        [
          {
            "node": "Contact Exists?",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Contact Exists?": {
      "main": [
        [
          {
            "node": "Update Existing Contact",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Insert New Contact",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Update Existing Contact": {
      "main": [
        [
          {
            "node": "Merge Update/Insert Results",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Insert New Contact": {
      "main": [
        [
          {
            "node": "Merge Update/Insert Results",
            "type": "main",
            "index": 1
          }
        ]
      ]
    },
    "Merge Update/Insert Results": {
      "main": [
        [
          {
            "node": "Generate Sync Summary",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Generate Sync Summary": {
      "main": [
        [
          {
            "node": "Send Success Notification",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "active": false,
  "settings": {
    "executionOrder": "v1",
    "saveDataErrorExecution": "all",
    "saveDataSuccessExecution": "all",
    "saveManualExecutions": true,
    "callerPolicy": "workflowsFromSameOwner",
    "errorWorkflow": {
      "id": "error-handler-workflow"
    }
  },
  "versionId": "crm-sync-advanced-v1",
  "meta": {
    "templateCredsSetupCompleted": true
  },
  "id": "crm-database-sync-advanced",
  "tags": ["crm", "database", "synchronization", "error-handling", "validation"]
}
```

## 2. Multi-Step Order Processing Pipeline

**Purpose**: Complex order processing with inventory checks, payment processing, and fulfillment
**Use Case**: E-commerce order management, supply chain automation

```json
{
  "name": "Advanced Order Processing Pipeline",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "orders/process",
        "authentication": "headerAuth",
        "options": {
          "allowedOrigins": "*",
          "rawBody": true
        }
      },
      "id": "order-webhook",
      "name": "Order Processing Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1.1,
      "position": [240, 400],
      "webhookId": "order-processing-webhook-id"
    },
    {
      "parameters": {
        "language": "javaScript",
        "jsCode": "// Initialize order processing with comprehensive validation\nconst order = $input.first().json;\nconst orderId = order.id || `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;\n\n// Comprehensive validation\nconst validationErrors = [];\nconst requiredFields = ['customer_id', 'items', 'total_amount', 'shipping_address'];\n\nrequiredFields.forEach(field => {\n  if (!order[field]) {\n    validationErrors.push(`Missing required field: ${field}`);\n  }\n});\n\n// Validate items array\nif (order.items && Array.isArray(order.items)) {\n  order.items.forEach((item, index) => {\n    if (!item.product_id || !item.quantity || !item.price) {\n      validationErrors.push(`Item ${index + 1}: Missing required fields (product_id, quantity, price)`);\n    }\n    if (item.quantity <= 0) {\n      validationErrors.push(`Item ${index + 1}: Invalid quantity`);\n    }\n    if (item.price <= 0) {\n      validationErrors.push(`Item ${index + 1}: Invalid price`);\n    }\n  });\n} else if (order.items) {\n  validationErrors.push('Items must be an array');\n}\n\n// Validate shipping address\nif (order.shipping_address) {\n  const addr = order.shipping_address;\n  const addressFields = ['street', 'city', 'country'];\n  addressFields.forEach(field => {\n    if (!addr[field]) {\n      validationErrors.push(`Missing shipping address field: ${field}`);\n    }\n  });\n}\n\nif (validationErrors.length > 0) {\n  throw new Error(`Order validation failed: ${validationErrors.join(', ')}`);\n}\n\n// Initialize workflow state\nconst state = $workflow.staticData;\nif (!state.orders) state.orders = {};\nif (!state.processingEvents) state.processingEvents = [];\n\n// Create comprehensive order state\nstate.orders[orderId] = {\n  id: orderId,\n  original_order: order,\n  status: 'received',\n  customer_id: order.customer_id,\n  items: order.items.map(item => ({\n    ...item,\n    line_total: item.quantity * item.price\n  })),\n  total_amount: parseFloat(order.total_amount),\n  currency: order.currency || 'USD',\n  shipping_address: order.shipping_address,\n  billing_address: order.billing_address || order.shipping_address,\n  payment_method: order.payment_method || 'credit_card',\n  priority: order.priority || 'standard',\n  created_at: new Date().toISOString(),\n  updated_at: new Date().toISOString(),\n  processing_pipeline: {\n    validation: { status: 'completed', completed_at: new Date().toISOString() },\n    inventory_check: { status: 'pending' },\n    pricing_validation: { status: 'pending' },\n    payment_processing: { status: 'pending' },\n    fulfillment_creation: { status: 'pending' },\n    notification: { status: 'pending' }\n  },\n  metrics: {\n    processing_start_time: new Date().toISOString(),\n    items_count: order.items.length,\n    calculated_total: order.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)\n  }\n};\n\n// Log processing start event\nstate.processingEvents.push({\n  order_id: orderId,\n  event_type: 'order_received',\n  timestamp: new Date().toISOString(),\n  data: { \n    items_count: order.items.length,\n    total_amount: order.total_amount,\n    customer_id: order.customer_id\n  }\n});\n\nconsole.log(`Order ${orderId} initialized and validated successfully`);\n\nreturn [{ json: { \n  ...state.orders[orderId], \n  processing_stage: 'inventory_check',\n  validation_passed: true\n}}];"
      },
      "id": "initialize-order",
      "name": "Initialize & Validate Order",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [460, 400]
    },
    {
      "parameters": {
        "batchSize": 5,
        "options": {
          "reset": false
        }
      },
      "id": "batch-process-items",
      "name": "Batch Process Items",
      "type": "n8n-nodes-base.splitInBatches",
      "typeVersion": 3,
      "position": [680, 400]
    },
    {
      "parameters": {
        "fieldToSplitOut": "items",
        "options": {}
      },
      "id": "split-order-items",
      "name": "Split Order Items",
      "type": "n8n-nodes-base.itemLists",
      "typeVersion": 3.3,
      "position": [900, 400]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://api.inventory.internal/v2/check-availability",
        "authentication": "predefinedCredentialType",
        "nodeCredentialType": "httpHeaderAuth",
        "sendBody": true,
        "bodyContentType": "json",
        "jsonBody": "={{ {\n  product_id: $json.product_id,\n  quantity_requested: $json.quantity,\n  warehouse_preference: $('Initialize & Validate Order').first().json.shipping_address.country,\n  priority: $('Initialize & Validate Order').first().json.priority,\n  customer_tier: 'standard'\n} }}",
        "options": {
          "timeout": 8000,
          "retry": {
            "enabled": true,
            "maxTries": 3,
            "waitBetweenTries": 1500
          }
        }
      },
      "id": "check-inventory-availability",
      "name": "Check Inventory Availability",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [1120, 400],
      "credentials": {
        "httpHeaderAuth": {
          "id": "inventory-service-api",
          "name": "Inventory Service API"
        }
      }
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://api.pricing.internal/v1/validate-pricing",
        "authentication": "predefinedCredentialType",
        "nodeCredentialType": "httpHeaderAuth",
        "sendBody": true,
        "bodyContentType": "json",
        "jsonBody": "={{ {\n  product_id: $json.product_id,\n  stated_price: $json.price,\n  quantity: $json.quantity,\n  customer_id: $('Initialize & Validate Order').first().json.customer_id,\n  currency: $('Initialize & Validate Order').first().json.currency,\n  effective_date: new Date().toISOString()\n} }}",
        "options": {
          "timeout": 5000,
          "retry": {
            "enabled": true,
            "maxTries": 2,
            "waitBetweenTries": 1000
          }
        }
      },
      "id": "validate-pricing",
      "name": "Validate Item Pricing",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [1120, 320],
      "credentials": {
        "httpHeaderAuth": {
          "id": "pricing-service-api",
          "name": "Pricing Service API"
        }
      }
    },
    {
      "parameters": {
        "mode": "combine",
        "combinationMode": "mergeByPosition",
        "options": {}
      },
      "id": "merge-item-checks",
      "name": "Merge Inventory & Pricing",
      "type": "n8n-nodes-base.merge",
      "typeVersion": 2.1,
      "position": [1340, 360]
    },
    {
      "parameters": {
        "language": "javaScript",
        "jsCode": "// Process and aggregate item validation results\nconst currentBatch = $input.all();\nconst orderId = $('Initialize & Validate Order').first().json.id;\nconst state = $workflow.staticData;\n\n// Initialize aggregation results if not exists\nif (!state.orders[orderId].item_validation_results) {\n  state.orders[orderId].item_validation_results = {\n    processed_items: [],\n    inventory_issues: [],\n    pricing_issues: [],\n    total_items: state.orders[orderId].items.length,\n    processed_count: 0,\n    all_items_available: true,\n    all_prices_valid: true\n  };\n}\n\nconst results = state.orders[orderId].item_validation_results;\n\n// Process current batch\ncurrentBatch.forEach(item => {\n  const originalItem = item.json;\n  const inventoryCheck = $('Check Inventory Availability').itemMatching(results.processed_count).json;\n  const pricingCheck = $('Validate Item Pricing').itemMatching(results.processed_count).json;\n  \n  const itemResult = {\n    product_id: originalItem.product_id,\n    requested_quantity: originalItem.quantity,\n    stated_price: originalItem.price,\n    inventory_available: inventoryCheck.available_quantity >= originalItem.quantity,\n    available_quantity: inventoryCheck.available_quantity,\n    warehouse_locations: inventoryCheck.warehouse_locations || [],\n    pricing_valid: pricingCheck.price_valid,\n    current_price: pricingCheck.current_price,\n    price_difference: pricingCheck.current_price - originalItem.price,\n    validation_timestamp: new Date().toISOString()\n  };\n  \n  results.processed_items.push(itemResult);\n  results.processed_count += 1;\n  \n  // Track issues\n  if (!itemResult.inventory_available) {\n    results.all_items_available = false;\n    results.inventory_issues.push({\n      product_id: itemResult.product_id,\n      requested: itemResult.requested_quantity,\n      available: itemResult.available_quantity,\n      shortage: itemResult.requested_quantity - itemResult.available_quantity\n    });\n  }\n  \n  if (!itemResult.pricing_valid) {\n    results.all_prices_valid = false;\n    results.pricing_issues.push({\n      product_id: itemResult.product_id,\n      stated_price: itemResult.stated_price,\n      current_price: itemResult.current_price,\n      difference: itemResult.price_difference\n    });\n  }\n});\n\n// Check if all items processed\nconst allItemsProcessed = results.processed_count >= results.total_items;\n\nif (allItemsProcessed) {\n  // Update order status based on validation results\n  if (results.all_items_available && results.all_prices_valid) {\n    state.orders[orderId].status = 'validated';\n    state.orders[orderId].processing_pipeline.inventory_check.status = 'completed';\n    state.orders[orderId].processing_pipeline.pricing_validation.status = 'completed';\n  } else {\n    state.orders[orderId].status = 'validation_failed';\n    if (!results.all_items_available) {\n      state.orders[orderId].processing_pipeline.inventory_check.status = 'failed';\n    }\n    if (!results.all_prices_valid) {\n      state.orders[orderId].processing_pipeline.pricing_validation.status = 'failed';\n    }\n  }\n  \n  state.orders[orderId].processing_pipeline.inventory_check.completed_at = new Date().toISOString();\n  state.orders[orderId].processing_pipeline.pricing_validation.completed_at = new Date().toISOString();\n  state.orders[orderId].updated_at = new Date().toISOString();\n  \n  // Log validation completion event\n  state.processingEvents.push({\n    order_id: orderId,\n    event_type: results.all_items_available && results.all_prices_valid ? 'validation_passed' : 'validation_failed',\n    timestamp: new Date().toISOString(),\n    data: {\n      items_processed: results.processed_count,\n      inventory_available: results.all_items_available,\n      pricing_valid: results.all_prices_valid,\n      inventory_issues: results.inventory_issues.length,\n      pricing_issues: results.pricing_issues.length\n    }\n  });\n}\n\nreturn [{ json: {\n  ...state.orders[orderId],\n  validation_complete: allItemsProcessed,\n  processing_stage: allItemsProcessed ? \n    (results.all_items_available && results.all_prices_valid ? 'payment_processing' : 'validation_failed') : \n    'validating_items'\n}}];"
      },
      "id": "aggregate-validation",
      "name": "Aggregate Item Validation",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [1560, 360]
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "leftValue": "={{ $json.validation_complete && $json.item_validation_results.all_items_available && $json.item_validation_results.all_prices_valid }}",
            "operation": "equal",
            "rightValue": true
          }
        }
      },
      "id": "validation-success-check",
      "name": "Validation Passed?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [1780, 360]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://api.payments.internal/v2/process-payment",
        "authentication": "predefinedCredentialType",
        "nodeCredentialType": "httpHeaderAuth",
        "sendBody": true,
        "bodyContentType": "json",
        "jsonBody": "={{ {\n  order_id: $json.id,\n  customer_id: $json.customer_id,\n  amount: $json.total_amount,\n  currency: $json.currency,\n  payment_method: $json.payment_method,\n  billing_address: $json.billing_address,\n  items: $json.items.map(item => ({\n    product_id: item.product_id,\n    quantity: item.quantity,\n    unit_price: item.price,\n    line_total: item.line_total\n  })),\n  metadata: {\n    order_created_at: $json.created_at,\n    processing_priority: $json.priority,\n    customer_tier: 'standard'\n  }\n} }}",
        "options": {
          "timeout": 15000,
          "retry": {
            "enabled": true,
            "maxTries": 2,\n            \"waitBetweenTries\": 3000\n          }\n        }\n      },\n      \"id\": \"process-payment\",\n      \"name\": \"Process Payment\",\n      \"type\": \"n8n-nodes-base.httpRequest\",\n      \"typeVersion\": 4.2,\n      \"position\": [2000, 280],\n      \"credentials\": {\n        \"httpHeaderAuth\": {\n          \"id\": \"payment-service-api\",\n          \"name\": \"Payment Service API\"\n        }\n      }\n    },\n    {\n      \"parameters\": {\n        \"language\": \"javaScript\",\n        \"jsCode\": \"// Handle payment processing response\\nconst order = $input.first().json;\\nconst paymentResponse = $('Process Payment').first().json;\\nconst orderId = order.id;\\nconst state = $workflow.staticData;\\n\\n// Update payment processing status\\nstate.orders[orderId].processing_pipeline.payment_processing.status = 'completed';\\nstate.orders[orderId].processing_pipeline.payment_processing.completed_at = new Date().toISOString();\\n\\n// Store detailed payment information\\nstate.orders[orderId].payment_details = {\\n  transaction_id: paymentResponse.transaction_id,\\n  gateway_response_id: paymentResponse.gateway_response_id,\\n  payment_method_used: paymentResponse.payment_method,\\n  amount_charged: paymentResponse.amount_charged,\\n  currency: paymentResponse.currency,\\n  gateway_status: paymentResponse.status,\\n  gateway_message: paymentResponse.message,\\n  processing_fee: paymentResponse.processing_fee || 0,\\n  net_amount: paymentResponse.amount_charged - (paymentResponse.processing_fee || 0),\\n  processed_at: paymentResponse.processed_at,\\n  risk_score: paymentResponse.risk_assessment?.score || null,\\n  fraud_flags: paymentResponse.risk_assessment?.flags || []\\n};\\n\\nif (paymentResponse.status === 'success' || paymentResponse.status === 'completed') {\\n  state.orders[orderId].status = 'payment_confirmed';\\n  \\n  // Calculate processing metrics\\n  const processingTime = new Date().getTime() - new Date(state.orders[orderId].created_at).getTime();\\n  state.orders[orderId].metrics.payment_processing_time_ms = processingTime;\\n  \\n  // Log successful payment\\n  state.processingEvents.push({\\n    order_id: orderId,\\n    event_type: 'payment_success',\\n    timestamp: new Date().toISOString(),\\n    data: {\\n      transaction_id: paymentResponse.transaction_id,\\n      amount_charged: paymentResponse.amount_charged,\\n      processing_time_ms: processingTime,\\n      risk_score: paymentResponse.risk_assessment?.score\\n    }\\n  });\\n} else {\\n  state.orders[orderId].status = 'payment_failed';\\n  state.orders[orderId].processing_pipeline.payment_processing.status = 'failed';\\n  state.orders[orderId].processing_pipeline.payment_processing.error = {\\n    code: paymentResponse.error_code,\\n    message: paymentResponse.error_message,\\n    details: paymentResponse.error_details\\n  };\\n  \\n  // Log payment failure\\n  state.processingEvents.push({\\n    order_id: orderId,\\n    event_type: 'payment_failed',\\n    timestamp: new Date().toISOString(),\\n    data: {\\n      error_code: paymentResponse.error_code,\\n      error_message: paymentResponse.error_message,\\n      amount_attempted: order.total_amount\\n    }\\n  });\\n}\\n\\nstate.orders[orderId].updated_at = new Date().toISOString();\\n\\nreturn [{ json: { \\n  ...state.orders[orderId], \\n  payment_successful: paymentResponse.status === 'success' || paymentResponse.status === 'completed',\\n  processing_stage: (paymentResponse.status === 'success' || paymentResponse.status === 'completed') ? 'fulfillment_creation' : 'payment_failed'\\n}}];\"\n      },\n      \"id\": \"handle-payment-response\",\n      \"name\": \"Handle Payment Response\",\n      \"type\": \"n8n-nodes-base.code\",\n      \"typeVersion\": 2,\n      \"position\": [2220, 280]\n    }\n  ],\n  \"connections\": {\n    \"Order Processing Webhook\": {\n      \"main\": [\n        [\n          {\n            \"node\": \"Initialize & Validate Order\",\n            \"type\": \"main\",\n            \"index\": 0\n          }\n        ]\n      ]\n    },\n    \"Initialize & Validate Order\": {\n      \"main\": [\n        [\n          {\n            \"node\": \"Batch Process Items\",\n            \"type\": \"main\",\n            \"index\": 0\n          }\n        ]\n      ]\n    },\n    \"Batch Process Items\": {\n      \"main\": [\n        [\n          {\n            \"node\": \"Split Order Items\",\n            \"type\": \"main\",\n            \"index\": 0\n          }\n        ]\n      ]\n    },\n    \"Split Order Items\": {\n      \"main\": [\n        [\n          {\n            \"node\": \"Check Inventory Availability\",\n            \"type\": \"main\",\n            \"index\": 0\n          },\n          {\n            \"node\": \"Validate Item Pricing\",\n            \"type\": \"main\",\n            \"index\": 0\n          }\n        ]\n      ]\n    },\n    \"Check Inventory Availability\": {\n      \"main\": [\n        [\n          {\n            \"node\": \"Merge Inventory & Pricing\",\n            \"type\": \"main\",\n            \"index\": 0\n          }\n        ]\n      ]\n    },\n    \"Validate Item Pricing\": {\n      \"main\": [\n        [\n          {\n            \"node\": \"Merge Inventory & Pricing\",\n            \"type\": \"main\",\n            \"index\": 1\n          }\n        ]\n      ]\n    },\n    \"Merge Inventory & Pricing\": {\n      \"main\": [\n        [\n          {\n            \"node\": \"Aggregate Item Validation\",\n            \"type\": \"main\",\n            \"index\": 0\n          }\n        ]\n      ]\n    },\n    \"Aggregate Item Validation\": {\n      \"main\": [\n        [\n          {\n            \"node\": \"Validation Passed?\",\n            \"type\": \"main\",\n            \"index\": 0\n          }\n        ]\n      ]\n    },\n    \"Validation Passed?\": {\n      \"main\": [\n        [\n          {\n            \"node\": \"Process Payment\",\n            \"type\": \"main\",\n            \"index\": 0\n          }\n        ],\n        []\n      ]\n    },\n    \"Process Payment\": {\n      \"main\": [\n        [\n          {\n            \"node\": \"Handle Payment Response\",\n            \"type\": \"main\",\n            \"index\": 0\n          }\n        ]\n      ]\n    }\n  },\n  \"active\": false,\n  \"settings\": {\n    \"executionOrder\": \"v1\",\n    \"saveDataErrorExecution\": \"all\",\n    \"saveDataSuccessExecution\": \"all\",\n    \"saveManualExecutions\": true,\n    \"callerPolicy\": \"workflowsFromSameOwner\",\n    \"errorWorkflow\": {\n      \"id\": \"order-processing-error-handler\"\n    }\n  },\n  \"versionId\": \"advanced-order-processing-v1\",\n  \"meta\": {\n    \"templateCredsSetupCompleted\": true\n  },\n  \"id\": \"advanced-order-processing-pipeline\",\n  \"tags\": [\"order-processing\", \"e-commerce\", \"payment\", \"inventory\", \"validation\"]\n}\n```\n\n## Setup Instructions for Advanced Workflows\n\n### Prerequisites:\n1. **Database Setup** (PostgreSQL recommended):\n   ```sql\n   CREATE TABLE contacts (\n     id SERIAL PRIMARY KEY,\n     external_id VARCHAR(255) UNIQUE NOT NULL,\n     first_name VARCHAR(255) NOT NULL,\n     last_name VARCHAR(255),\n     email VARCHAR(255) UNIQUE NOT NULL,\n     phone VARCHAR(50),\n     company VARCHAR(255),\n     status VARCHAR(50) DEFAULT 'active',\n     tags TEXT,\n     created_at TIMESTAMP,\n     updated_at TIMESTAMP,\n     sync_timestamp TIMESTAMP,\n     is_deleted BOOLEAN DEFAULT false,\n     source VARCHAR(100)\n   );\n   ```\n\n2. **API Credentials Setup**:\n   - CRM API authentication\n   - Inventory service API\n   - Payment processing API\n   - Pricing service API\n   - Slack workspace integration\n\n### Import Process:\n1. Copy the JSON workflow\n2. Import via n8n interface\n3. Configure all credential connections\n4. Update API endpoints to match your services\n5. Test with sample data\n6. Set up error handling workflows\n7. Configure monitoring and alerting\n\n### Key Features:\n- **State Management**: Uses `workflowStaticData` for complex state tracking\n- **Batch Processing**: Handles large datasets efficiently\n- **Comprehensive Validation**: Multi-level data validation\n- **Error Handling**: Robust error tracking and notifications\n- **Performance Monitoring**: Processing time and success metrics\n- **Audit Trail**: Complete event logging for compliance\n- **Scalable Architecture**: Microservice integration patterns
          {
            "node": "Fetch CRM Contacts",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Fetch CRM Contacts": {
      "main": [
        [
          {
            "node": "Has Contact Data?",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Has Contact Data?": {
      "main": [
        [
          {
            "node": "Split Contact Array",
            "type": "main",
            "index": 0
          }
        ],
        