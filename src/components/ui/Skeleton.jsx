import React from 'react';
import { cn } from '../../utils/cn';

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-300 dark:bg-white/10", className)}
      {...props}
    />
  );
};

export { Skeleton };
