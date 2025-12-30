import React from 'react';
import '../css/admin/DashboardCards.css';

const DashboardCards = ({ stats }) => {
  const cards = [
    {
      icon: '👥',
      value: stats.totalStudents,
      label: 'Total Students',
      variant: 'primary'
    },
    {
      icon: '✅',
      value: stats.activeStudents,
      label: 'Active Students',
      variant: 'success'
    },
    {
      icon: '⏳',
      value: stats.pendingApprovals,
      label: 'Pending Approvals',
      variant: 'warning'
    },
    {
      icon: '📊',
      value: `${stats.todayPresent}/${stats.activeStudents}`,
      label: "Today's Attendance",
      variant: 'primary'
    }
  ];

  return (
    <div className="dashboard-cards">
      {cards.map((card, index) => (
        <div key={index} className={`dashboard-card ${card.variant}`}>
          <span className="card-icon">{card.icon}</span>
          <div className="card-value">{card.value}</div>
          <div className="card-label">{card.label}</div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;