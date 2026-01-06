import { useState,useEffect } from 'react'
import { allSessions } from '@/api/userApi'
  import type { Session } from '@/types/types';
import {   Loader2, AlertCircle } from 'lucide-react';
 
import { Alert, AlertDescription } from '@/components/ui/alert';
 
import { revokeSessionApi } from '@/api/authApi';
import SessionCards from '@/utils/components/SessionCards';

const AllSessions = () => {
  const [otherSessions, setOtherSessions] = useState<Session[] | null>(null);
  const [currentSession, setCurrentSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

   
    async function fetchSessions() {
      try {
        setLoading(true);
        setError(null);
        const res = await allSessions();

        if (!res.success) {
          setError('Failed to load sessions');
          return;
        }
        if (res.success && res.data) {  
          setOtherSessions(res.data.otherSessions);
          setCurrentSession(res.data.currentSession)
        }
      } catch (err) {
        setError('An error occurred while fetching sessions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    useEffect(() => {
  fetchSessions();
}, []);

   

  const handleRevokeSession = async (sid:string)=>{
       await revokeSessionApi(sid)
      await fetchSessions();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading sessions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if ((!otherSessions || otherSessions.length === 0) && !currentSession ) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>No sessions found.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4 overflow-auto">
      

       {currentSession && (
  <SessionCards
    session={currentSession}
    handleRevokeSession={handleRevokeSession}
    isCurrent={true}
  />
)}

<div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          You have {otherSessions?.length} others session{otherSessions?.length !== 1 ? 's' : ''} across your devices
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {otherSessions?.map((session) => {
         
          
          return (
             <SessionCards session={session}
              handleRevokeSession = {handleRevokeSession}
             />
          );
        })}
      </div>
    </div>
  );
};

export default AllSessions;