
import React from 'react';
import { Bell, Check, X, Clock, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useNotifications, type Notification } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onNotificationClick: (notification: Notification) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onMarkAsRead, 
  onNotificationClick 
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'document_completion':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'tax_deadline':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'progress_update':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'welcome':
        return <CheckCircle className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'document_completion':
        return 'Document';
      case 'tax_deadline':
        return 'Deadline';
      case 'progress_update':
        return 'Progress';
      case 'welcome':
        return 'Welcome';
      default:
        return 'General';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 hover:bg-gray-50 transition-colors duration-200 border-l-4 ${
        notification.read ? 'border-transparent' : 'border-blue-500'
      } cursor-pointer group`}
      onClick={() => onNotificationClick(notification)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-1">
            {getIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="text-xs">
                {getTypeLabel(notification.type)}
              </Badge>
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
            <h4 className="font-semibold text-gray-900 text-sm mb-1">
              {notification.title}
            </h4>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
              {notification.message}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>
                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
        {!notification.read && (
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(notification.id);
            }}
          >
            <Check className="w-4 h-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
};

interface NotificationGroupProps {
  type: string;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onNotificationClick: (notification: Notification) => void;
}

const NotificationGroup: React.FC<NotificationGroupProps> = ({
  type,
  notifications,
  onMarkAsRead,
  onNotificationClick
}) => {
  const getGroupTitle = (type: string) => {
    switch (type) {
      case 'document_completion':
        return 'Documents';
      case 'tax_deadline':
        return 'Deadlines';
      case 'progress_update':
        return 'Progress Updates';
      case 'welcome':
        return 'Welcome';
      default:
        return 'General';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900 text-sm">
            {getGroupTitle(type)}
          </h3>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount}
            </Badge>
          )}
        </div>
        <span className="text-xs text-gray-500">
          {notifications.length} total
        </span>
      </div>
      <div className="divide-y divide-gray-100">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkAsRead={onMarkAsRead}
            onNotificationClick={onNotificationClick}
          />
        ))}
      </div>
    </div>
  );
};

interface EnhancedNotificationsProps {
  onNotificationClick: (notification: Notification) => void;
}

export const EnhancedNotifications: React.FC<EnhancedNotificationsProps> = ({
  onNotificationClick
}) => {
  const { 
    groupedNotifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const hasNotifications = Object.keys(groupedNotifications).length > 0;

  return (
    <div className="w-96 max-h-96">
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-blue-600 hover:text-blue-700"
            >
              <Check className="w-4 h-4 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        {unreadCount > 0 && (
          <p className="text-sm text-gray-600 mt-1">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      <ScrollArea className="max-h-80">
        {hasNotifications ? (
          <div className="divide-y divide-gray-100">
            {Object.entries(groupedNotifications).map(([type, notifications]) => (
              <NotificationGroup
                key={type}
                type={type}
                notifications={notifications}
                onMarkAsRead={markAsRead}
                onNotificationClick={onNotificationClick}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="font-medium text-gray-900 mb-2">No notifications</h4>
            <p className="text-sm text-gray-600">
              You're all caught up! New notifications will appear here.
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
