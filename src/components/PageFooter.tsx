
import React from 'react';
import { motion } from "framer-motion";

interface PageFooterProps {
  delay?: number;
}

const PageFooter: React.FC<PageFooterProps> = ({ delay = 1.2 }) => {
  return (
    <motion.footer
      className="mt-auto pt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 0.8, y: 0 }}
      transition={{ delay, duration: 0.8 }}
    >
      <p className="text-sm text-gray-500">© {new Date().getFullYear()} TangoApp • The best way to enjoy nightlife</p>
    </motion.footer>
  );
};

export default PageFooter;
