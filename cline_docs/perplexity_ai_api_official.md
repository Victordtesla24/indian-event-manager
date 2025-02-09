# Perplexity AI MCP Server

## Task

Update and fix the Perplexity AI MCP Server, ensuring that it is functional and utilizes exactly the details provided below.

**Priority 1:** Using the following exact API details, first test a simple API connection and verify if the API call is functional.

## Perplexity AI API Details

- **API Key:** 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
- **Model:** sonar-reasoning-pro (127k), sonar-reasoning (127k), sonar-pro (200k), sonar (127k)
- **Model Type:** Chat Completion
- **Model Selection:** Dynamic, based on the complexity, token size and context

**Important Note:** sonar-reasoning-pro and sonar-pro have a max output token limit of 8k. The reasoning models output CoTs in their responses as well.

## Make API Call

Use the following script from the perplexity ai official document as is to test the API.

```cURL
curl --location 'https://api.perplexity.ai/chat/completions' \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --header 'Authorization: Bearer {API_KEY}' \
  --data '{
    "model": "sonar-pro ",
    "messages": [
      {
        "role": "system",
        "content": "Be precise and concise."
      },
      {
        "role": "user",
        "content": "How many stars are there in our galaxy?"
      }
    ]
  }'
```

## Rate Limits and Usage Tiers

We follow the usage tier system below to set rate limits and give access to beta features for both Sonar Pro and Sonar. You can check your usage tier by going to your API settings page.

| Tier   | Credit Purchase (all time) | Requests per Minute (RPM) | Beta Features                                  |
|--------|----------------------------|---------------------------|------------------------------------------------|
| Tier 0 | -                          | 50                        | -                                              |
| Tier 1 | $50                        | 150                       | -                                              |
| Tier 2 | $250                       | 500                       | images, related questions                      |
| Tier 3 | $500                       | 1000                      | search domain filter, structured outputs       |

*The tiers are based on cumulative purchases on a given account. The beta features accumulate as you progress through the tiers.*

## Structured Outputs Guide

Structured outputs is currently a beta feature and only available to users in Tier-3.

### Overview

We currently support two types of structured outputs: **JSON Schema** and **Regex**. LLM responses will work to match the specified format, except for the following cases:

- The output exceeds max_tokens

Enabling the structured outputs can be done by adding a `response_format` field in the request:

#### JSON Schema

```json
{
  "response_format": { "type": "json_schema", "json_schema": { "schema": object } }
}
```

*The schema should be a valid JSON schema object.*

#### Regex (only available for sonar right now)

```json
{
  "response_format": { "type": "regex", "regex": { "regex": "string" } }
}
```

*The regex is a regular expression string.*

We recommend giving the LLM some hints about the output format in the prompts.

The first request with a new JSON Schema or Regex expects to incur delay on the first token. Typically, it takes 10 to 30 seconds to prepare the new schema. Once the schema has been prepared, the subsequent requests will not see such delay.

## Examples

### 1. Get a response in JSON format

**Request:**

```python
import requests
from pydantic import BaseModel

class AnswerFormat(BaseModel):
    first_name: str
    last_name: str
    year_of_birth: int
    num_seasons_in_nba: int

url = "https://api.perplexity.ai/chat/completions"
headers = {"Authorization": "Bearer YOUR_API_KEY"}
payload = {
    "model": "sonar",
    "messages": [
        {"role": "system", "content": "Be precise and concise."},
        {"role": "user", "content": (
            "Tell me about Michael Jordan. "
            "Please output a JSON object containing the following fields: "
            "first_name, last_name, year_of_birth, num_seasons_in_nba. "
        )},
    ],
    "response_format": {
        "type": "json_schema",
        "json_schema": {"schema": AnswerFormat.model_json_schema()},
    },
}
response = requests.post(url, headers=headers, json=payload).json()
print(response["choices"][0]["message"]["content"])
```

**Response:**

```json
{"first_name": "Michael", "last_name": "Jordan", "year_of_birth": 1963, "num_seasons_in_nba": 15}
```

### 2. Use a regex to output the format

**Request:**

```python
import requests

url = "https://api.perplexity.ai/chat/completions"
headers = {"Authorization": "Bearer YOUR_API_KEY"}
payload = {
    "model": "sonar",
    "messages": [
        {"role": "system", "content": "Be precise and concise."},
        {"role": "user", "content": "What is the IPv4 address of OpenDNS DNS server?"},
    ],
    "response_format": {
        "type": "regex",
        "regex": {"regex": r"(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)"}
    },
}
response = requests.post(url, headers=headers, json=payload).json()
print(response["choices"][0]["message"]["content"])
```

**Response:**

```bash
208.67.222.222
```

## Best Practices

### Generating responses in a JSON Format

For Python users, we recommend using the Pydantic library to generate JSON schema.

### Unsupported JSON Schemas

Recursive JSON schema is not supported. As a result, unconstrained objects are not supported either. Here are a few examples of unsupported schemas:

#### UNSUPPORTED

```python
from typing import Any
from pydantic import BaseModel

class UnconstrainedDict(BaseModel):
   unconstrained: dict[str, Any]

class RecursiveJson(BaseModel):
   value: str
   child: list["RecursiveJson"]
```

## Prompt Guide

### System Prompt

You can use the system prompt to provide instructions related to style, tone, and language of the response.

The real-time search component of our models does not attend to the system prompt.
Example of a system prompt:

"You are a seasoned computer programmer/developer with vast experience over 20 years. You always write simple and minimum code, and strictly avoid unnecessary code generation, replacement or deletion. You focus on the logic and believe in "for the code to be elegant, it has to be simple and minimum". You always finish your task at hand and never fails to concentrate on the task. You are well known for your "not jumping to conclusions" mindset, and always analyse every single step 2-3 times before stating an answer or conclude

Rules:

1. Provide only the final answer. It is important that you do not include any explanation on the steps below.
2. Only provide precise and specific details to the question being asked.
3. Do not show the intermediate steps information.

Steps:

1. Decide if the answer should be a brief sentence or a list of suggestions.
2. If it is a list of suggestions, first, write a brief and natural introduction based on the original query.
3. Followed by a list of suggestions, each suggestion should be split by two newlines.

### User Prompt

You should use the user prompt to pass in the actual query for which you need an answer for. The user prompt will be used to kick off a real-time web search to make sure the answer has the latest and the most relevant information needed.

Example of a user prompt

## Pricing

### Sonar Reasoning

Model Input Tokens (Per Million Tokens) Output Tokens (Per Million Tokens) Price per 1000 searches
sonar-reasoning-pro $2 $8 $5
sonar-reasoning $1 $5 $5
sonar-pro $3 $15 $5
sonar $1 $1 $5
Detailed Pricing Breakdown for Sonar Reasoning Pro and Sonar Pro

Input Tokens

Input tokens are priced at $3/1M tokens

Input tokens comprise of Prompt tokens (user prompt) + Citation tokens (these are processed tokens from running searches)

Search Queries

To give detailed answers, both the Pro APIs also run multiple searches on top of the user prompt where necessary for more exhaustive information retrieval

Searches are priced at $5/1000 searches

A request that does 3 searches will cost $0.015 in this step.

Output Tokens

Output tokens (Completion tokens) are priced at $15/1M tokens
Total Price

Your total price per request finally is a sum of the above 3 components

Sonar Reasoning and Sonar

Citation tokens are not considered as part of input tokens and each request does 1 search for Sonar Reasoning and Sonar.

Rate Limits and Usage Tiers
We follow the usage tier system below to set rate limits and give access to beta features for both Sonar Pro and Sonar. You can check your usage tier by going to your API settings page.

Tier Credit Purchase (all time) Requests per minute (RPM) Beta Features
Tier 0 - 50 -
Tier 1 $50 150 -
Tier 2 $250 500 images, related questions
Tier 3 $500 1000 search domain filter, structured outputs
The tiers are based on cumulative purchases on a given account
The beta features accumulate as you progress through the tiers
