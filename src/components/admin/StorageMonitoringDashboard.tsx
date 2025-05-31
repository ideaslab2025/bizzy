
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useStorageMonitoring } from '@/hooks/useStorageMonitoring';
import { HardDrive, Files, Download, RefreshCw } from 'lucide-react';

export const StorageMonitoringDashboard = () => {
  const { stats, loading, refresh, formatFileSize } = useStorageMonitoring();

  const storageLimit = 1024 * 1024 * 1024; // 1GB limit for demo
  const usagePercentage = (stats.totalSize / storageLimit) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Storage Monitoring</h2>
        <Button onClick={refresh} disabled={loading} variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Storage Usage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatFileSize(stats.totalSize)}</div>
            <div className="text-xs text-muted-foreground">
              of {formatFileSize(storageLimit)} limit
            </div>
            <Progress value={usagePercentage} className="mt-2" />
            <div className="text-xs text-muted-foreground mt-1">
              {usagePercentage.toFixed(1)}% used
            </div>
          </CardContent>
        </Card>

        {/* Total Files */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <Files className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFiles}</div>
            <div className="text-xs text-muted-foreground">
              Files stored across all buckets
            </div>
          </CardContent>
        </Card>

        {/* Bandwidth (Mock) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bandwidth (Month)</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatFileSize(stats.totalSize * 2.5)}</div>
            <div className="text-xs text-muted-foreground">
              Estimated monthly bandwidth
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bucket Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Documents Bucket</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Files:</span>
                <span className="font-medium">{stats.bucketStats.documents.files}</span>
              </div>
              <div className="flex justify-between">
                <span>Size:</span>
                <span className="font-medium">{formatFileSize(stats.bucketStats.documents.size)}</span>
              </div>
              <div className="flex justify-between">
                <span>Type:</span>
                <Badge variant="outline">Public</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Files Bucket</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Files:</span>
                <span className="font-medium">{stats.bucketStats.userFiles.files}</span>
              </div>
              <div className="flex justify-between">
                <span>Size:</span>
                <span className="font-medium">{formatFileSize(stats.bucketStats.userFiles.size)}</span>
              </div>
              <div className="flex justify-between">
                <span>Type:</span>
                <Badge variant="secondary">Private</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* File Types Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Files by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.filesByType).map(([type, count]) => (
              <div key={type} className="text-center">
                <div className="text-2xl font-bold text-blue-600">{count}</div>
                <div className="text-sm text-gray-600 uppercase">{type}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
