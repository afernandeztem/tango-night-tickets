
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";
import TangoLogo from "@/components/TangoLogo";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <AuroraBackground>
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <div className="flex justify-center mb-6">
            <TangoLogo variant="full" className="h-20 w-auto" linkTo={null} />
          </div>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 font-darker">
            Discover nightlife, buy tickets, and enjoy the night!
          </p>
          <Button 
            onClick={() => navigate('/landing')} 
            className="bg-tango-primary hover:bg-tango-primary/90 text-white px-8 py-6 text-lg font-medium rounded-xl"
          >
            Get Started
          </Button>
        </motion.div>
      </div>
    </AuroraBackground>
  );
};

export default Index;
