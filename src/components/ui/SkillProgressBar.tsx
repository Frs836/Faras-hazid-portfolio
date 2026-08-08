import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface SkillProgressBarProps {
  proficiency: number;
  delay?: number;
}

export const SkillProgressBar: React.FC<SkillProgressBarProps> = ({ proficiency, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });

  return (
    <div ref={ref} className="w-full">
      <div className="w-full h-1 bg-paper2 border hairline rounded-full overflow-hidden">
        <motion.div
          initial={{ width: '0%' }}
          animate={isInView ? { width: `${proficiency}%` } : { width: '0%' }}
          transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full bg-accent"
        />
      </div>
    </div>
  );
};

export const AnimatedSkillBadge: React.FC<SkillProgressBarProps> = ({ proficiency, delay = 0 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1100;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime - delay * 1000;
      if (elapsed < 0) {
        requestAnimationFrame(animate);
        return;
      }
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * proficiency));
      if (progress < 1) requestAnimationFrame(animate);
      else setCount(proficiency);
    };

    const frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isInView, proficiency, delay]);

  return (
    <span
      ref={ref}
      className="mono-label text-ink-muted tabular-nums"
    >
      {count}%
    </span>
  );
};
