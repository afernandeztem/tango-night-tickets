
import React from 'react';
import { motion } from "framer-motion";

interface TitleSectionProps {
  title: string;
}

const TitleSection: React.FC<TitleSectionProps> = ({ title }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="text-center mb-4 relative z-20"
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-tango-primary to-tango-secondary">
        {title}
      </h1>
      
      <motion.div
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ delay: 0.5, duration: 1 }}
        className="relative max-w-md mx-auto"
      >
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="h-0.5 w-28 mx-auto bg-gradient-to-r from-tango-primary to-tango-secondary"
        />
      </motion.div>
    </motion.div>
  );
};

export default TitleSection;
