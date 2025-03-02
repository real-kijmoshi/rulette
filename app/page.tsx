/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSession, SessionProvider } from 'next-auth/react';
import Image from 'next/image';
import { ChevronRight, Star, Shield, Users, Clock } from 'lucide-react';

// Define types for components
type AnimatedCounterProps = {
  value: string;
  label: string;
  icon: React.ReactNode;
};

type TestimonialCardProps = {
  name: string;
  quote: string;
  rating: number;
  image: string;
};

type GameCardProps = {
  title: string;
  description: string;
  image: string;
  popular: boolean;
};

type RedirectHandlerProps = {
  router: ReturnType<typeof useRouter>;
};

// Animated rulette wheel component
const RuletteWheel: React.FC = () => {
  return (
    <div className="relative w-64 h-64 mx-auto">
      <motion.div
        className="w-full h-full rounded-full border-4 border-yellow-600 bg-gradient-to-br from-red-700 to-red-900 shadow-xl"
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        {/* Wheel center */}
        <div className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-yellow-500 border-2 border-yellow-600" />
      </motion.div>
      
      {/* Ball */}
      <motion.div
        className="absolute w-3 h-3 rounded-full bg-white shadow-md"
        initial={{ x: '50%', y: '0%' }}
        animate={{
          x: ['50%', '100%', '0%', '50%'],
          y: ['0%', '50%', '75%', '0%'],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

// Animated statistics counter
const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, label, icon }) => {
  const [count, setCount] = React.useState(0);
  
  React.useEffect(() => {
    let start = 0;
    const end = parseInt(value.toString().replace(/,/g, ''));
    const incrementTime = Math.min(50, Math.max(10, 1000 / end));
    
    if (start === end) return;
    
    const timer = setInterval(() => {
      start = start + Math.ceil((end - start) / 20);
      setCount(start);
      
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      }
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return (
    <motion.div 
      className="flex flex-col items-center p-4 bg-gray-800 rounded-lg"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
    >
      <div className="text-red-500 mb-2">{icon}</div>
      <h3 className="text-2xl font-bold mb-1 bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
        {count.toLocaleString()}+
      </h3>
      <p className="text-gray-400 text-sm">{label}</p>
    </motion.div>
  );
};

// Testimonial card component
const TestimonialCard: React.FC<TestimonialCardProps> = ({ name, quote, rating, image }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="bg-gray-800 p-4 rounded-lg shadow-lg"
  >
    <div className="flex items-center mb-3">
      <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border border-red-500">
        <Image src={image} alt={name} width={40} height={40} className="object-cover" />
      </div>
      <div>
        <h4 className="font-bold text-sm">{name}</h4>
        <div className="flex">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} size={12} className="text-yellow-500 fill-yellow-500" />
          ))}
        </div>
      </div>
    </div>
    <p className="text-gray-300 text-sm italic">{quote}</p>
  </motion.div>
);

// Game card component
const GameCard: React.FC<GameCardProps> = ({ title, description, image, popular }) => {
  const router = useRouter();
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="relative overflow-hidden rounded-lg shadow-lg"
    >
      <div className="relative h-48 overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover transition-transform duration-500 hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70" />
        
        {popular && (
          <div className="absolute top-2 right-2 bg-red-600 text-xs py-1 px-2 rounded-full font-bold">
            POPULAR
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-lg font-bold mb-1">{title}</h3>
          <p className="text-gray-300 text-xs">{description}</p>
          
          <motion.button 
            className="mt-2 bg-red-600 hover:bg-red-700 text-white flex items-center py-1 px-3 rounded text-xs font-medium transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/rulette')}
          >
            Play Now <ChevronRight size={12} className="ml-1" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const RedirectHandler: React.FC<RedirectHandlerProps> = ({ router }) => {
    const { data: session } = useSession();

    React.useEffect(() => {
      if (session) {
        router.push('/rulette');
      }
    }, [session, router]);

    return null;
};

const LandingPage: React.FC = () => {
  const router = useRouter();
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };
  
  return (
    <div className="min-h-screen bg-black text-white">
      <SessionProvider>
        <RedirectHandler router={router} />
      </SessionProvider>

      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/60 border-b border-gray-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <motion.div 
                whileHover={{ rotate: 90 }}
                className="mr-2 text-red-600"
              >
                <div className="w-6 h-6 border-2 border-red-600 rounded-full border-t-transparent animate-spin" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
                RULETTE
              </span>
            </div>
            
            <nav className="hidden md:flex space-x-6 items-center">
              <a href="#games" className="hover:text-red-500 transition-colors text-sm">Games</a>
              <a href="#features" className="hover:text-red-500 transition-colors text-sm">Features</a>
              <a href="#testimonials" className="hover:text-red-500 transition-colors text-sm">Testimonials</a>
            </nav>
            
            <div className="space-x-2">
              <motion.button 
                onClick={() => router.push('/login')}
                className="px-3 py-1 border border-red-600 rounded text-sm hover:bg-red-600/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.button>
              
              <motion.button 
                onClick={() => router.push('/rulette')}
                className="bg-gradient-to-r from-red-600 to-red-800 px-4 py-1 rounded text-sm font-bold shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Play Now
              </motion.button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        <div className="container mx-auto px-4 z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                <span className="block">Spin the</span>
                <span className="bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
                  Wheel of Fortune
                </span>
              </h1>
              
              <p className="text-gray-300 text-lg mb-6 max-w-lg">
                Experience the thrill of the casino from anywhere. Place your bets, spin the wheel, and win big.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button 
                  onClick={() => router.push('/rulette')}
                  className="bg-gradient-to-r from-red-600 to-red-800 px-6 py-3 rounded-lg font-bold text-base shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Play Now <ChevronRight className="ml-1 inline" size={16} />
                </motion.button>
                
                <motion.button 
                  onClick={() => router.push('/leaderboard')}
                  className="border border-gray-700 hover:border-gray-500 px-6 py-3 rounded-lg font-bold text-base transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Leaderboard
                </motion.button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center"
            >
              <RuletteWheel />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Games Section */}
      <section id="games" className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold mb-3">Our Popular Games</h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm">
              Choose from a variety of thrilling casino games, each offering unique ways to test your luck.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GameCard
              title="European rulette"
              description="Classic single zero variant with better odds."
              image="/api/placeholder/400/320"
              popular={true}
            />
            <GameCard
              title="American rulette"
              description="Double zero variant for bigger thrills."
              image="/api/placeholder/400/320"
              popular={false}
            />
            <GameCard
              title="French rulette"
              description="Features La Partage rule for even-money bets."
              image="/api/placeholder/400/320"
              popular={false}
            />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold mb-3">Why Choose Rulette</h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm">
              Our platform combines the excitement of real casino gaming with innovative features.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.div
              variants={item}
              className="bg-gray-800 p-6 rounded-lg shadow-lg"
            >
              <div className="bg-red-600/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Shield className="text-red-500" size={20} />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure & Fair</h3>
              <p className="text-gray-400 text-sm">
                Our games use cryptographically secure random number generation to ensure fair outcomes every time.
              </p>
            </motion.div>
            
            <motion.div
              variants={item}
              className="bg-gray-800 p-6 rounded-lg shadow-lg"
            >
              <div className="bg-red-600/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Users className="text-red-500" size={20} />
              </div>
              <h3 className="text-xl font-bold mb-2">Social Gaming</h3>
              <p className="text-gray-400 text-sm">
                Connect with friends and other players around the world for a truly immersive casino experience.
              </p>
            </motion.div>
            
            <motion.div
              variants={item}
              className="bg-gray-800 p-6 rounded-lg shadow-lg"
            >
              <div className="bg-red-600/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Clock className="text-red-500" size={20} />
              </div>
              <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
              <p className="text-gray-400 text-sm">
                Our dedicated support team is available around the clock to assist you with any questions or issues.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold mb-3">What Our Players Say</h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm">
              Hear from our satisfied players around the world.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestimonialCard 
              name="Jennifer L."
              quote="The most realistic online rulette experience I've ever tried. The animations are smooth and the odds feel fair."
              rating={5}
              image="/api/placeholder/48/48"
            />
            <TestimonialCard 
              name="Michael T."
              quote="I love the social features that let me play with friends. We have a weekly game night on Rulette now!"
              rating={5}
              image="/api/placeholder/48/48"
            />
            <TestimonialCard 
              name="Sarah K."
              quote="Customer support is amazing. Had an issue with a payment and they resolved it within minutes."
              rating={4}
              image="/api/placeholder/48/48"
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-red-900/30 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Try Your Luck?</h2>
            <p className="text-gray-300 max-w-xl mx-auto mb-6 text-sm">
              Sign up now and get 1000 free credits to start your gaming journey. No deposits required!
            </p>
            
            <motion.button 
              onClick={() => router.push('/rulette')}
              className="bg-gradient-to-r from-red-600 to-red-800 px-8 py-3 rounded-lg font-bold shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Playing Now
            </motion.button>
            
            <p className="text-gray-500 mt-4 text-xs">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-black py-8 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center mb-3">
                <div className="w-6 h-6 border-2 border-red-600 rounded-full border-t-transparent mr-2" />
                <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
                  RULETTE
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-3">
                The premier destination for online rulette games.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-sm font-bold mb-3">Games</h4>
                <ul className="space-y-1 text-xs">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">European rulette</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">American rulette</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">French rulette</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-bold mb-3">Support</h4>
                <ul className="space-y-1 text-xs">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Responsible Gaming</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-bold mb-3">Contact</h4>
                <ul className="space-y-1 text-xs">
                  <li className="text-gray-400">support@rulette.com</li>
                  <li className="text-gray-400">+1 (555) 123-4567</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} Rulette. All rights reserved. 18+ only. Please play responsibly.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Demo project by <span className="text-red-500">real-kijmoshi</span>
            </p>
            <p className="text-gray-500 text-xs mt-1">
              This is a demo project. No real money is involved. Gambling can be addictive.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;