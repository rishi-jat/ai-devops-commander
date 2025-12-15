#!/bin/bash

echo "Loading workflow into Kestra..."

curl -X POST "http://localhost:8080/api/v1/flows" \
  -u "admin@example.com:Admin123!" \
  -H "Content-Type: application/x-yaml" \
  --data-binary @kestra/workflows/ai-devops-workflow.yml

echo ""
echo ""
echo "Checking if workflow was loaded..."

curl -s "http://localhost:8080/api/v1/flows" \
  -u "admin@example.com:Admin123!" | jq '.[] | select(.namespace == "ai.devops.commander") | {id, namespace}'

echo ""
echo "Done!"
