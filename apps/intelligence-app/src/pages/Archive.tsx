import React from 'react';
import { Link } from 'react-router-dom';

export const Archive: React.FC = () => {
  // Mock historical data - replace with actual data fetching
  const historicalWeeks = [
    { year: 2025, week: 29, date: '2025-07-17', immunity: 2.8 },
    { year: 2025, week: 28, date: '2025-07-10', immunity: 2.7 },
    { year: 2025, week: 27, date: '2025-07-03', immunity: 2.9 },
    { year: 2025, week: 26, date: '2025-06-26', immunity: 2.6 },
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#091F2C', 
      color: '#ffffff', 
      padding: '40px 20px' 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '48px', 
          background: 'linear-gradient(45deg, #B4B5DF, #6B9BD1)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '40px'
        }}>
          Intelligence Archive
        </h1>
        
        <div style={{ display: 'grid', gap: '20px' }}>
          {historicalWeeks.map(week => (
            <Link 
              key={`${week.year}-${week.week}`}
              to={`/week/${week.year}/${week.week}`}
              style={{
                display: 'block',
                padding: '30px',
                background: 'rgba(180, 181, 223, 0.1)',
                border: '1px solid rgba(180, 181, 223, 0.2)',
                borderRadius: '12px',
                color: '#ffffff',
                textDecoration: 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = '#6B9BD1';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(180, 181, 223, 0.2)';
              }}
            >
              <h3 style={{ color: '#B4B5DF', marginBottom: '10px' }}>
                Week {week.week}, {week.year}
              </h3>
              <p style={{ color: '#A6BBC8' }}>
                {week.date} - Immunity Score: {week.immunity}
              </p>
            </Link>
          ))}
        </div>

        <Link 
          to="/"
          style={{
            display: 'inline-block',
            marginTop: '40px',
            color: '#6B9BD1',
            textDecoration: 'none'
          }}
        >
          ← Back to Current Week
        </Link>
      </div>
    </div>
  );
};