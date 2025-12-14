'use client'

import { CheckCircle, XCircle, Activity } from 'lucide-react'
import { formatDistance } from 'date-fns'

interface Deployment {
  deployment_id: string
  timestamp: string
  service: string
  version: string
  status: string
  ai_decision: string
}

interface Props {
  deployments: Deployment[]
  selectedId?: string
  onSelect: (deployment: Deployment) => void
}

export default function DeploymentTimeline({ deployments, selectedId, onSelect }: Props) {
  return (
    <div className="metric-card">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Deployment History
      </h2>
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {deployments.map((deployment, index) => (
          <button
            key={deployment.deployment_id}
            onClick={() => onSelect(deployment)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selectedId === deployment.deployment_id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Status Icon */}
              <div className="mt-1">
                {deployment.ai_decision === 'ROLLBACK' ? (
                  <XCircle className="w-5 h-5 text-red-500" />
                ) : deployment.ai_decision === 'CONTINUE' ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Activity className="w-5 h-5 text-yellow-500" />
                )}
              </div>

              {/* Deployment Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {deployment.service}
                  </p>
                  <span className="text-xs text-gray-500 ml-2">
                    {formatDistance(new Date(deployment.timestamp), new Date(), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {deployment.version}
                </p>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${
                    deployment.ai_decision === 'ROLLBACK'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-green-600 dark:text-green-400'
                  }`}>
                    {deployment.ai_decision}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className={`text-xs ${
                    deployment.status === 'healthy'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {deployment.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Connector Line (except for last item) */}
            {index < deployments.length - 1 && (
              <div className="ml-2.5 mt-2 h-6 w-0.5 bg-gray-200 dark:bg-gray-700" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
