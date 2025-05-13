import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  endDate: Date;
  className?: string;
}

export default function CountdownTimer({ endDate, className = '' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endDate.getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setIsExpired(true);
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
      }
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (isExpired) {
    return null;
  }

  return (
    <div className={`countdown-timer ${className}`}>
      <div className="countdown-timer-content">
        <div className="countdown-timer-unit">
          <span className="countdown-timer-value">{timeLeft.days}</span>
          <span className="countdown-timer-label">dias</span>
        </div>
        <div className="countdown-timer-separator">:</div>
        <div className="countdown-timer-unit">
          <span className="countdown-timer-value">{timeLeft.hours.toString().padStart(2, '0')}</span>
          <span className="countdown-timer-label">horas</span>
        </div>
        <div className="countdown-timer-separator">:</div>
        <div className="countdown-timer-unit">
          <span className="countdown-timer-value">{timeLeft.minutes.toString().padStart(2, '0')}</span>
          <span className="countdown-timer-label">min</span>
        </div>
        <div className="countdown-timer-separator">:</div>
        <div className="countdown-timer-unit">
          <span className="countdown-timer-value">{timeLeft.seconds.toString().padStart(2, '0')}</span>
          <span className="countdown-timer-label">seg</span>
        </div>
      </div>
    </div>
  );
}