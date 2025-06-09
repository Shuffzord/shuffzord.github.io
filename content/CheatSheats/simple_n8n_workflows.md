---
title: N8N Simple n8n workflow examples
date: 2025-09-06
publishdate: 2025-09-06
---

# Simple n8n Workflow Examples - Ready to Import JSON

Complete, working JSON examples for basic n8n workflows. Copy and import these directly into your n8n instance.

## 1. Webhook to Slack Notification

**Purpose**: Receive webhook data and send notification to Slack
**Use Case**: Simple alert system, form submissions, external service notifications

```json
{
  "name": "Webhook to Slack Alert",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "webhook-alert",
        "options": {}
      },
      "id": "webhook-node",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1.1,
      "position": [240, 300],
      "webhookId": "12345678-1234-1234-1234-123456789abc"
    },
    {
      "parameters": {
        "resource": "message",
        "operation": "post",
        "channel": "#alerts",
        "text": "🚨 New Alert Received!\n\n*Message:* {{ $json.message || 'No message provided' }}\n*Source:* {{ $json.source || 'Unknown' }}\n*Time:* {{ new Date().toLocaleString() }}",
        "otherOptions": {
          "username": "Alert Bot",
          "icon_emoji": ":warning:"
        }
      },
      "id": "slack-node",
      "name": "Send Slack Message",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 2.1,
      "position": [460, 300],
      "credentials": {
        "slackApi": {
          "id": "slack-credentials",
          "name": "Slack API Credentials"
        }
      }
    }
  ],
  "connections": {
    "Webhook": {
      "main": [
        [
          {
            "node": "Send Slack Message",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "active": false,
  "settings": {
    "executionOrder": "v1"
  },
  "versionId": "simple-webhook-slack-v1",
  "meta": {
    "templateCredsSetupCompleted": true
  },
  "id": "webhook-slack-simple",
  "tags": ["webhook", "slack", "alerts", "simple"]
}
```

## 2. Daily API Data Fetch

**Purpose**: Schedule daily API calls to fetch and process data
**Use Case**: Daily reports, data synchronization, monitoring

```json
{
  "name": "Daily API Data Fetch",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "cronExpression",
              "expression": "0 9 * * *"
            }
          ]
        }
      },
      "id": "schedule-trigger",
      "name": "Daily at 9 AM",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1.2,
      "position": [240, 300]
    },
    {
      "parameters": {
        "method": "GET",
        "url": "https://jsonplaceholder.typicode.com/posts",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Accept",
              "value": "application/json"
            },
            {
              "name": "User-Agent",
              "value": "n8n-workflow/1.0"
            }
          ]
        },
        "options": {
          "timeout": 10000,
          "retry": {
            "enabled": true,
            "maxTries": 3,
            "waitBetweenTries": 1000
          }
        }
      },
      "id": "fetch-data",
      "name": "Fetch API Data",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [460, 300]
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "processed-time",
              "name": "processedAt",
              "value": "={{ new Date().toISOString() }}",
              "type": "string"
            },
            {
              "id": "record-count",
              "name": "totalRecords",
              "value": "={{ $json.length }}",
              "type": "number"
            },
            {
              "id": "workflow-name",
              "name": "workflowName",
              "value": "={{ $workflow.name }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "id": "add-metadata",
      "name": "Add Processing Metadata",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.3,
      "position": [680, 300]
    },
    {
      "parameters": {
        "resource": "message",
        "operation": "post",
        "channel": "#reports",
        "text": "📊 Daily Data Fetch Complete\n\n*Records Retrieved:* {{ $json.totalRecords }}\n*Processed At:* {{ $json.processedAt }}\n*Workflow:* {{ $json.workflowName }}",
        "otherOptions": {
          "username": "Data Bot",
          "icon_emoji": ":chart_with_upwards_trend:"
        }
      },
      "id": "report-success",
      "name": "Send Success Report",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 2.1,
      "position": [900, 300],
      "credentials": {
        "slackApi": {
          "id": "slack-credentials",
          "name": "Slack API Credentials"
        }
      }
    }
  ],
  "connections": {
    "Daily at 9 AM": {
      "main": [
        [
          {
            "node": "Fetch API Data",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Fetch API Data": {
      "main": [
        [
          {
            "node": "Add Processing Metadata",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Add Processing Metadata": {
      "main": [
        [
          {
            "node": "Send Success Report",
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
    "saveDataSuccessExecution": "all"
  },
  "versionId": "daily-fetch-v1",
  "meta": {},
  "id": "daily-api-fetch",
  "tags": ["schedule", "api", "reports", "daily"]
}
```

## 3. Simple Email Processing

**Purpose**: Process incoming emails and extract key information
**Use Case**: Contact forms, support tickets, email automation

```json
{
  "name": "Email Processing Workflow",
  "nodes": [
    {
      "parameters": {
        "pollTimes": {
          "item": [
            {
              "mode": "everyMinute"
            }
          ]
        },
        "options": {}
      },
      "id": "email-trigger",
      "name": "Email Trigger",
      "type": "n8n-nodes-base.emailReadImap",
      "typeVersion": 2.1,
      "position": [240, 300],
      "credentials": {
        "imap": {
          "id": "email-credentials",
          "name": "Email IMAP"
        }
      }
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "sender-email",
              "name": "senderEmail",
              "value": "={{ $json.from.value[0].address }}",
              "type": "string"
            },
            {
              "id": "sender-name",
              "name": "senderName",
              "value": "={{ $json.from.value[0].name || 'Unknown' }}",
              "type": "string"
            },
            {
              "id": "email-subject",
              "name": "emailSubject",
              "value": "={{ $json.subject }}",
              "type": "string"
            },
            {
              "id": "received-date",
              "name": "receivedDate",
              "value": "={{ $json.date }}",
              "type": "string"
            },
            {
              "id": "has-attachments",
              "name": "hasAttachments",
              "value": "={{ $json.attachments && $json.attachments.length > 0 }}",
              "type": "boolean"
            }
          ]
        }
      },
      "id": "extract-info",
      "name": "Extract Email Info",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.3,
      "position": [460, 300]
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "leftValue": "={{ $json.emailSubject }}",
            "operation": "contains",
            "rightValue": "urgent",
            "options": {
              "caseSensitive": false
            }
          }
        }
      },
      "id": "check-urgent",
      "name": "Is Urgent?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [680, 300]
    },
    {
      "parameters": {
        "resource": "message",
        "operation": "post",
        "channel": "#urgent-emails",
        "text": "🚨 URGENT EMAIL RECEIVED\n\n*From:* {{ $json.senderName }} ({{ $json.senderEmail }})\n*Subject:* {{ $json.emailSubject }}\n*Received:* {{ $json.receivedDate }}\n*Has Attachments:* {{ $json.hasAttachments ? 'Yes' : 'No' }}",
        "otherOptions": {
          "username": "Email Bot",
          "icon_emoji": ":email:"
        }
      },
      "id": "urgent-notification",
      "name": "Urgent Email Alert",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 2.1,
      "position": [900, 200],
      "credentials": {
        "slackApi": {
          "id": "slack-credentials",
          "name": "Slack API Credentials"
        }
      }
    },
    {
      "parameters": {
        "resource": "message",
        "operation": "post",
        "channel": "#general-emails",
        "text": "📧 New Email Received\n\n*From:* {{ $json.senderName }} ({{ $json.senderEmail }})\n*Subject:* {{ $json.emailSubject }}\n*Received:* {{ $json.receivedDate }}\n*Has Attachments:* {{ $json.hasAttachments ? 'Yes' : 'No' }}",
        "otherOptions": {
          "username": "Email Bot",
          "icon_emoji": ":email:"
        }
      },
      "id": "regular-notification",
      "name": "Regular Email Alert",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 2.1,
      "position": [900, 400],
      "credentials": {
        "slackApi": {
          "id": "slack-credentials",
          "name": "Slack API Credentials"
        }
      }
    }
  ],
  "connections": {
    "Email Trigger": {
      "main": [
        [
          {
            "node": "Extract Email Info",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Extract Email Info": {
      "main": [
        [
          {
            "node": "Is Urgent?",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Is Urgent?": {
      "main": [
        [
          {
            "node": "Urgent Email Alert",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Regular Email Alert",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "active": false,
  "settings": {
    "executionOrder": "v1"
  },
  "versionId": "email-processing-v1",
  "meta": {},
  "id": "email-processing-simple",
  "tags": ["email", "processing", "notifications", "conditional"]
}
```

## Setup Instructions

### For All Workflows:

1. **Import the Workflow:**
   - Copy the JSON code
   - In n8n, go to Workflows → Import from File
   - Paste the JSON or upload as file

2. **Set Up Credentials:**
   - **Slack API**: Create a Slack app and get Bot User OAuth Token
   - **Email IMAP**: Configure your email provider's IMAP settings
   - **HTTP Basic Auth**: For API endpoints requiring authentication

3. **Configure Node Parameters:**
   - Update webhook paths and URLs as needed
   - Modify Slack channels to match your workspace
   - Adjust schedule times for your timezone
   - Update API endpoints to your actual services

4. **Test the Workflow:**
   - Use the "Test Workflow" button
   - Check execution logs for any errors
   - Verify data flows correctly between nodes

5. **Activate:**
   - Toggle the "Active" switch to enable the workflow
   - Monitor the execution history for successful runs

### Quick Tips:
- Start with the Webhook to Slack example - it's the simplest
- Test with sample data before connecting real services
- Use the "Pin Data" feature to test with static data
- Check the n8n community forum for troubleshooting help