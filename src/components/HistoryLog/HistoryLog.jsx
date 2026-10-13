import React from 'react';
import { History } from 'lucide-react';

export function HistoryLog({ historyLog }) {
  return (
    <div className="panel-card">
      <h3 className="panel-title">
        <History size={16} color="#f59e0b" />
        Histórico da Batalha
      </h3>
      <div className="history-list">
        {historyLog.map((item) => (
          <div key={item.id} className={`history-item ${item.type}`}>
            <span className="history-time">{item.time}</span>
            <span className="history-text">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
