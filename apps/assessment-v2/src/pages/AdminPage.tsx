/**
 * Admin Page
 * Main admin interface for managing companies and system data
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, History, BarChart } from 'lucide-react';
import { cn } from '@shared/utils/cn';
import { AdminCompanyManager } from '@/components/admin/AdminCompanyManager';
import { HistoricalDashboard } from '@/components/admin/historical';

type AdminTab = 'companies' | 'historical' | 'analytics';

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('companies');

  const tabs = [
    { id: 'companies' as AdminTab, label: 'Company Management', icon: Building2 },
    { id: 'historical' as AdminTab, label: 'Historical Data Quality', icon: History },
    { id: 'analytics' as AdminTab, label: 'Analytics', icon: BarChart, disabled: true }
  ];

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Tab Navigation */}
      <div className="bg-dark-surface border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => !tab.disabled && setActiveTab(tab.id)}
                  disabled={tab.disabled}
                  className={cn(
                    "px-6 py-4 flex items-center gap-2 transition-all relative",
                    activeTab === tab.id
                      ? "text-primary-600"
                      : "text-dark-text-secondary hover:text-dark-text-primary",
                    tab.disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                    />
                  )}
                  {tab.disabled && (
                    <span className="ml-2 text-xs bg-dark-bg px-2 py-0.5 rounded">
                      Coming Soon
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'companies' && <AdminCompanyManager />}
        {activeTab === 'historical' && <HistoricalDashboard />}
        {activeTab === 'analytics' && (
          <div className="max-w-7xl mx-auto p-6">
            <div className="text-center py-12">
              <BarChart className="w-12 h-12 text-dark-text-secondary mx-auto mb-4" />
              <p className="text-dark-text-primary">Analytics dashboard coming soon</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}