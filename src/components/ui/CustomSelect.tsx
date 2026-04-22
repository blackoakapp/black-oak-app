import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./Button";

interface Option {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  label?: string;
}

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select option",
  className,
  triggerClassName,
  label
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.id === value);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("space-y-1.5", className)} ref={containerRef}>
      {label && (
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider dark:text-gray-500">
          {label}
        </label>
      )}
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800/50",
            triggerClassName
          )}
        >
          <div className="flex items-center space-x-2 truncate">
            {selectedOption?.icon}
            <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
          </div>
          <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform duration-200", isOpen && "rotate-180")} />
        </Button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute z-50 mt-2 w-full min-w-[160px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="max-h-[280px] overflow-y-auto custom-scrollbar">
                {options.map((option) => {
                  const isSelected = option.id === value;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        onChange(option.id);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "group relative flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all",
                        isSelected 
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" 
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                      )}
                    >
                      <div className="flex items-center space-x-2">
                        {option.icon}
                        <span>{option.label}</span>
                      </div>
                      {isSelected && (
                        <motion.div
                          layoutId="active-check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white"
                        >
                          <Check className="h-3 w-3 stroke-[3]" />
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
