#!/bin/bash
# Cline Automation Trigger Script
# This script is called by Kestra when a ROLLBACK decision is made

set -e

DEPLOYMENT_ID=$1
SERVICE_NAME=$2
DECISION=$3
ERROR_TYPE=$4

echo "🤖 Cline Automation Triggered"
echo "Deployment: $DEPLOYMENT_ID"
echo "Service: $SERVICE_NAME"
echo "Decision: $DECISION"
echo "Error Type: $ERROR_TYPE"

# Only proceed if ROLLBACK decision
if [ "$DECISION" != "ROLLBACK" ]; then
    echo "✅ No action needed - deployment continuing normally"
    exit 0
fi

echo "🔧 Initiating automated fix based on error type..."

# Determine which fix script to run based on error type
case "$ERROR_TYPE" in
    *memory*|*OutOfMemoryError*|*leak*)
        echo "Running memory leak fix..."
        bash "$(dirname "$0")/auto-fix-memory-leak.sh" "$SERVICE_NAME"
        ;;
    *database*|*timeout*|*connection*)
        echo "Running database fix..."
        bash "$(dirname "$0")/auto-fix-database-timeout.sh" "$SERVICE_NAME"
        ;;
    *response*|*latency*|*slow*)
        echo "Running performance optimization..."
        bash "$(dirname "$0")/auto-fix-performance.sh" "$SERVICE_NAME"
        ;;
    *)
        echo "Generic automated remediation..."
        bash "$(dirname "$0")/auto-fix-generic.sh" "$SERVICE_NAME"
        ;;
esac

echo "✅ Cline automation completed"
echo "📝 Creating PR with fixes..."

# Create git branch and PR (simulated for demo)
BRANCH_NAME="auto-fix/${DEPLOYMENT_ID}-$(date +%s)"
echo "Branch: $BRANCH_NAME"
echo "PR Title: [AUTO] Fix ${ERROR_TYPE} in ${SERVICE_NAME}"
echo ""
echo "✅ Automated fix applied and PR created!"
