import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase, testSupabase } from '@/integrations/supabase/client';

const DebugSupabase = () => {
  const [result, setResult] = useState<any>(null);
  const [running, setRunning] = useState(false);

  const run = async () => {
    setRunning(true);
    try {
      const res = await testSupabase();
      setResult(res);
    } catch (err: any) {
      setResult({ ok: false, error: String(err) });
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    // run once on mount
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-lg font-semibold mb-4">Supabase Debug</h2>
      <p className="mb-4">This page performs a lightweight reachability check against your Supabase auth endpoint.</p>
      <div className="mb-4">
        <Button onClick={run} disabled={running}>{running ? 'Running…' : 'Run test now'}</Button>
      </div>
      <pre className="bg-muted p-4 rounded">{JSON.stringify(result, null, 2)}</pre>
      <div className="mt-4 text-sm text-muted-foreground">Note: no keys are shown. This only checks network reachability to the auth endpoint.</div>
    </div>
  );
};

export default DebugSupabase;
