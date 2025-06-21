---
title: "Pydantic + LLM Structured Outputs Cheat Sheet"
date: "2025-06-21"
tags: [llm]
---


## What is Pydantic?
A Python library for **data validation** and **serialization** that automatically:
- Validates data types
- Converts types when possible
- Provides clear error messages
- Serializes to/from JSON, dictionaries

## Basic Pydantic Model

```python
from pydantic import BaseModel

class Evaluation(BaseModel):
    is_acceptable: bool
    feedback: str
```

## Using with LLMs

### The Problem
- LLMs return unstructured text
- Hard to parse and validate
- Inconsistent formats

### The Solution
Use Pydantic models to enforce structure!

```python
response = gemini.beta.chat.completions.parse(
    model="gemini-2.0-flash", 
    messages=messages, 
    response_format=Evaluation  # Your Pydantic model
)

# Returns validated Evaluation object
print(response.is_acceptable)  # bool
print(response.feedback)       # str
```

## How It Works Under the Hood

1. **Your Pydantic Model** → **JSON Schema** (automatic conversion)
2. **JSON Schema** → **LLM API** (as instructions)
3. **LLM generates** → **JSON matching schema**
4. **Library parses** → **Validated Pydantic object**

### Example JSON Schema Generated
```json
{
  "type": "object",
  "properties": {
    "is_acceptable": {"type": "boolean"},
    "feedback": {"type": "string"}
  },
  "required": ["is_acceptable", "feedback"]
}
```

## Benefits

✅ **Guaranteed structure** - Always get expected fields  
✅ **Type safety** - Fields are correct types  
✅ **Error handling** - Validation catches format errors  
✅ **Easy processing** - Use data immediately in code  
✅ **No manual parsing** - Library handles conversion  

## Popular Libraries

- **Instructor** - Easy structured outputs with OpenAI/Anthropic
- **Marvin** - Another structured LLM library
- **LangChain** - Built-in Pydantic output parsers
- **Gemini** - Native `response_format` support

## Quick Example

```python
from pydantic import BaseModel

class MovieReview(BaseModel):
    title: str
    rating: int  # 1-10
    summary: str
    recommended: bool

# LLM automatically returns structured data
review = api_call(response_format=MovieReview)
print(f"Rating: {review.rating}")  # Guaranteed integer
```

## Key Takeaway
**Pydantic models become "contracts"** - you define what you want, and the LLM API ensures you get exactly that structure. No more messy text parsing!