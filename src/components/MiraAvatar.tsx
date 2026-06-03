"use client";
import { motion } from "framer-motion";

interface Props {
  size?: number;
  scanning?: boolean;
  className?: string;
}

export default function MiraAvatar({ size = 80, scanning = false, className = "" }: Props) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
        <circle cx="60" cy="54" r="46" fill="white" stroke="#e5e7eb" strokeWidth="1.5" />

        <rect x="14" y="51" width="92" height="5" rx="2.5"
          fill={scanning ? "#ef4444" : "#16a34a"} opacity="0.2" />

        {scanning ? (
          <>
            <motion.rect x="26" y="45" width="26" height="5" rx="2.5"
              fill="#ef4444"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 0.7, repeat: Infinity }} />
            <motion.rect x="68" y="45" width="26" height="5" rx="2.5"
              fill="#ef4444"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 0.7, repeat: Infinity, delay: 0.1 }} />
          </>
        ) : (
          <>
            <ellipse cx="39" cy="48" rx="9" ry="7" fill="#111827" />
            <ellipse cx="81" cy="48" rx="9" ry="7" fill="#111827" />
            <circle cx="43" cy="45" r="2.5" fill="white" />
            <circle cx="85" cy="45" r="2.5" fill="white" />
          </>
        )}

        <path d="M44 67 Q60 75 76 67"
          stroke="#111827" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        <ellipse cx="60" cy="107" rx="30" ry="10"
          fill="white" stroke="#e5e7eb" strokeWidth="1.5" />
      </svg>
    </motion.div>
  );
}