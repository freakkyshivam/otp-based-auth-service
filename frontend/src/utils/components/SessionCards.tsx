
import {  Globe, Calendar, MapPin, Shield } from 'lucide-react';
 import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
   import type { Session } from '@/types/types';
import formatDate from '@/utils/formatdate';
import { getDeviceIcon } from '@/utils/getDeviceIcon';

interface SessionCardsProps {
  session: Session;
  handleRevokeSession: (sid: string) => Promise<void> | void;
  isCurrent? : boolean
}

  
 const SessionCards = ({
  session,
  handleRevokeSession,
  isCurrent
}: SessionCardsProps) => {
  const DeviceIcon = getDeviceIcon(session.deviceType);

  return (
    <div
      key={session.id}
      className="bg-card/50 backdrop-blur-sm rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow relative"
    >
      {session.isActive ? (
        <div className=''>
            {isCurrent && (
                <Badge className="mr-20 absolute top-4 right-4 bg-green-500/10 text-green-600 border-green-500/20">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
          Current
        </Badge>
            )}
           <Badge className="absolute top-4 right-4 bg-green-500/10 text-green-600 border-green-500/20">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
          Active
        </Badge> 
        </div>
        
      ) : (
        <Badge className="absolute top-4 right-4 bg-red-500/10 text-red-600 border-red-500/20">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse" />
          Revoked
        </Badge>
      )}

      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 rounded-lg bg-primary/10">
          <DeviceIcon className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">
            {session.deviceName}
          </h3>
          <p className="text-sm text-muted-foreground">
            {session.deviceType}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Browser:</span>
          <span className="font-medium">{session.browser}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Last used:</span>
          <span className="font-medium">
            {formatDate(session.lastUsedAt)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">IP:</span>
          <span className="font-mono text-xs font-medium">
            {session.ipAddress}
          </span>
        </div>
      </div>

      {(session.isActive && !isCurrent) && (
        <div className="mt-4 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-destructive hover:text-destructive"
            onClick={() => handleRevokeSession(session.id)}
          >
            <Shield className="h-4 w-4 mr-2" />
            Revoke Session
          </Button>
        </div>
      )}
    </div>
  );
};

export default SessionCards;
