"use client"

import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

export interface SliderProps {
  className?: string;
  value: number[];
  onValueChange: (value: number[]) => void;
  min: number;
  max: number;
  step?: number;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ className, value, onValueChange, min = 0, max = 100, step = 1 }, ref) => {
    const currentValue = value[0] ?? min;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onValueChange([parseFloat(e.target.value)]);
    };

    const percentage = ((currentValue - min) / (max - min)) * 100;

    return (
      <div 
        ref={ref}
        className={cn("relative flex w-full touch-none select-none items-center py-2", className)}
      >
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onChange={handleChange}
          className="absolute w-full h-4 opacity-0 cursor-pointer z-20"
        />
        <div className="relative w-full h-1.5 bg-primary/20 rounded-full overflow-hidden">
          <div 
            className="absolute h-full bg-primary transition-all duration-150" 
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div 
          className="absolute h-4 w-4 bg-background border-2 border-primary rounded-full shadow-lg pointer-events-none transition-all duration-150"
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
