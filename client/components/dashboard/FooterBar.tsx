import React from 'react';

interface FooterBarProps {
  lastRefresh: Date;
  uptimePct?: number;
}

export const FooterBar: React.FC<FooterBarProps> = ({ lastRefresh, uptimePct = 99.97 }) => {
  return (
    <footer className="mt-6 py-4 text-xs text-muted-foreground flex flex-col md:flex-row gap-2 md:items-center md:justify-between border-t">
      <div>System Uptime: <span className="font-medium">{uptimePct.toFixed(2)}%</span></div>
      <div className="flex items-center gap-4">
        <span>Last Refresh: {lastRefresh.toLocaleTimeString()}</span>
        <button className="underline hover:text-foreground">Export Report</button>
        <button className="underline hover:text-foreground">Send to Metabase</button>
      </div>
    </footer>
  );
};
