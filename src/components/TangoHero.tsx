
import React from 'react';
import { motion } from "framer-motion";
import TangoLogo from "@/components/TangoLogo";

const TangoHero: React.FC = () => {
  return (
    <div className="flex flex-col items-center mb-4 relative z-20">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.22, 1, 0.36, 1]
        }}
        className="relative z-20"
      >
        <TangoLogo variant="full" className="h-48 w-auto" linkTo={null} />
      </motion.div>
      
      <motion.p
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.8, 
          delay: 0.2,
          ease: [0.22, 1, 0.36, 1]
        }}
        className="text-xl font-medium text-center bg-clip-text text-transparent bg-gradient-to-r from-tango-primary to-tango-secondary relative z-20"
      >
        Discover nightlife, buy tickets, and enjoy the night!
      </motion.p>
    </div>
  );
};

export default TangoHero;
