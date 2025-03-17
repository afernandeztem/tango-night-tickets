
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";
import TangoLogo from "@/components/TangoLogo";
import { ChevronRight } from "lucide-react";
import CitySelector from "@/components/CitySelector";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <AuroraBackground>
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl w-full flex flex-col items-center"
        >
          {/* Larger logo */}
          <div className="flex justify-center mb-8">
            <TangoLogo variant="full" className="h-32 w-auto" linkTo={null} />
          </div>
          
          {/* Animated tagline */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-2xl md:text-3xl text-center text-gray-700 mb-10 font-darker"
          >
            Discover nightlife, buy tickets, and enjoy the night!
          </motion.p>
          
          {/* Call to action buttons with staggered animation */}
          <motion.div 
            className="flex flex-col items-center w-full gap-6 max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Button 
              onClick={() => navigate('/landing')} 
              className="bg-tango-primary hover:bg-tango-primary/90 text-white px-8 py-7 text-xl font-medium rounded-xl w-full md:w-3/4 relative overflow-hidden group"
            >
              Get Started
              <span className="absolute right-6 transition-transform duration-300 group-hover:translate-x-2">
                <ChevronRight size={22} />
              </span>
            </Button>
            
            {/* City selector component */}
            <div className="mt-4">
              <CitySelector 
                className="text-base md:text-lg hover:text-tango-primary transition-colors"
                onSelectCity={() => navigate('/landing')} 
              />
            </div>
          </motion.div>
        </motion.div>
        
        {/* Decorative elements */}
        <motion.div
          className="absolute bottom-6 left-0 right-0 flex justify-center opacity-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} TangoApp • The best way to enjoy nightlife</p>
        </motion.div>
      </div>
    </AuroraBackground>
  );
};

export default Index;
