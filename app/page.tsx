"use client";
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, SessionProvider } from 'next-auth/react';
import Image from 'next/image';
import { ChevronRight, Star, Shield, Users, Clock, ArrowRight, TrendingUp } from 'lucide-react';

// Animated roulette wheel component
const RouletteWheel = () => {
  return (
    <div className="relative w-64 h-64 mx-auto md:w-80 md:h-80 lg:w-96 lg:h-96">
      <motion.div
        className="w-full h-full rounded-full border-8 border-yellow-600 bg-gradient-to-br from-red-700 to-red-900 shadow-2xl"
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        {/* Wheel segments */}
        {Array.from({ length: 36 }).map((_, i) => (
          <div 
            key={i} 
            className={`absolute w-1 h-full origin-bottom ${i % 2 === 0 ? 'bg-black' : 'bg-red-500'}`}
            style={{ transform: `rotate(${i * 10}deg)` }}
          />
        ))}
        
        {/* Wheel center */}
        <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-yellow-500 border-4 border-yellow-600" />
      </motion.div>
      
      {/* Ball */}
      <motion.div
        className="absolute w-4 h-4 rounded-full bg-white shadow-md"
        initial={{ x: '50%', y: '0%' }}
        animate={{
          x: ['50%', '100%', '0%', '50%', '25%', '75%', '50%'],
          y: ['0%', '50%', '75%', '100%', '50%', '25%', '0%'],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

// Animated statistics counter
const AnimatedCounter = ({ value, label, icon }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
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
      className="flex flex-col items-center p-6 bg-gray-800 rounded-xl"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="text-red-500 mb-2">{icon}</div>
      <h3 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
        {count.toLocaleString()}+
      </h3>
      <p className="text-gray-400">{label}</p>
    </motion.div>
  );
};

// Testimonial card component
const TestimonialCard = ({ name, quote, rating, image }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-xl"
  >
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-red-500">
        <Image src={image} alt={name} width={48} height={48} className="object-cover" />
      </div>
      <div>
        <h4 className="font-bold">{name}</h4>
        <div className="flex">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
          ))}
        </div>
      </div>
    </div>
    <p className="text-gray-300 italic">{quote}</p>
  </motion.div>
);

// Game card component
const GameCard = ({ title, description, image, popular }) => (
  <motion.div
    whileHover={{ y: -10 }}
    className="relative overflow-hidden rounded-xl shadow-xl"
  >
    <div className="relative h-64 overflow-hidden">
      <Image src={image} alt={title} fill className="object-cover transition-transform duration-700 hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80" />
      
      {popular && (
        <div className="absolute top-3 right-3 bg-red-600 text-xs py-1 px-2 rounded-full font-bold">
          POPULAR
        </div>
      )}
      
      <div className="absolute bottom-0 left-0 p-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-300 text-sm">{description}</p>
        
        <motion.button 
          className="mt-4 bg-red-600 hover:bg-red-700 text-white flex items-center py-2 px-4 rounded-lg text-sm font-medium transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/roulette')}
        >
          Play Now <ArrowRight size={16} className="ml-2" />
        </motion.button>
      </div>
    </div>
  </motion.div>
);

const RedirectHandler = ({ router }) => {
    const { data: session } = useSession();

    useEffect(() => {
      if (session) {
        router.push('/rulette');
      }
    }, [session, router]);

    return (
        <div></div>  
    )
}

export default function LandingPage() {
  const router = useRouter();

  
  // Stagger animation for sections
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };
  
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <SessionProvider>
        <RedirectHandler 
            router={router}
        />
      </SessionProvider>

      {/* Background particles */}
      <div className="fixed inset-0 z-0 opacity-20">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-500 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
      
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/60 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <motion.div 
                whileHover={{ rotate: 90 }}
                className="mr-2 text-red-600"
              >
                <div className="w-8 h-8 border-4 border-red-600 rounded-full border-t-transparent animate-spin" />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
                RULETTE
              </span>
            </div>
            
            <nav className="hidden md:flex space-x-8 items-center">
              <a href="#games" className="hover:text-red-500 transition-colors">Games</a>
              <a href="#features" className="hover:text-red-500 transition-colors">Features</a>
              <a href="#testimonials" className="hover:text-red-500 transition-colors">Testimonials</a>
              <a href="#stats" className="hover:text-red-500 transition-colors">Stats</a>
            </nav>
            
            <div className="space-x-4">
              <motion.button 
                onClick={() => router.push('/login')}
                className="px-4 py-2 border border-red-600 rounded-lg hover:bg-red-600/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.button>
              
              <motion.button 
                onClick={() => router.push('/roulette')}
                className="bg-gradient-to-r from-red-600 to-red-800 px-6 py-2 rounded-lg font-bold shadow-lg shadow-red-600/20"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(220, 38, 38, 0.4)" }}
                whileTap={{ scale: 0.95 }}
              >
                Play Now
              </motion.button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
                <span className="block">Spin the</span>
                <span className="bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
                  Wheel of Fortune
                </span>
              </h1>
              
              <p className="text-gray-300 text-xl mb-8 max-w-lg">
                Experience the thrill of the casino from anywhere. Place your bets, spin the wheel, and win big with our premium roulette experience.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button 
                  onClick={() => router.push('/roulette')}
                  className="bg-gradient-to-r from-red-600 to-red-800 px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-red-600/20 flex items-center justify-center"
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(220, 38, 38, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Play Now <ChevronRight className="ml-2" />
                </motion.button>
                
                <motion.button 
                  onClick={() => router.push('/leaderboard')}
                  className="border-2 border-gray-700 hover:border-gray-500 px-8 py-4 rounded-xl font-bold text-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Leaderboard
                </motion.button>
              </div>
              
              <div className="mt-10 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-red-500">1000+</div>
                  <div className="text-sm text-gray-400">Daily Players</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-red-500">$50K+</div>
                  <div className="text-sm text-gray-400">Won Today</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-red-500">97%</div>
                  <div className="text-sm text-gray-400">Payout Rate</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="flex justify-center"
            >
              <RouletteWheel />
            </motion.div>
          </div>
        </div>
        
        {/* Scroll down indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="flex flex-col items-center">
            <p className="text-gray-400 mb-2">Scroll to explore</p>
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center pt-2">
              <motion.div 
                className="w-1 h-1 bg-white rounded-full"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </div>
        </motion.div>
      </section>
      
      {/* Games Section */}
      <section id="games" className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Popular Games</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Choose from a variety of thrilling casino games, each offering unique ways to test your luck and strategy.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <GameCard
              title="European Roulette"
              description="The classic casino game with better odds thanks to its single zero."
              image="/api/placeholder/400/320"
              popular={true}
            />
            <GameCard
              title="American Roulette"
              description="Double zero variant offering more risk and bigger thrills."
              image="/api/placeholder/400/320"
              popular={false}
            />
            <GameCard
              title="French Roulette"
              description="Play with the La Partage rule for lower house edge on even bets."
              image="/api/placeholder/400/320"
              popular={false}
            />
          </div>
          
          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg flex items-center mx-auto"
            >
              View All Games <ArrowRight className="ml-2" />
            </motion.button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Rulette</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our platform combines the excitement of real casino gaming with innovative features designed for the modern player.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.div
              variants={item}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl shadow-xl hover:shadow-red-900/10 transition-shadow"
            >
              <div className="bg-red-600/20 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Shield className="text-red-500" size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Secure & Fair</h3>
              <p className="text-gray-400">
                Our games use cryptographically secure random number generation to ensure fair outcomes every time.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-gray-300">
                  <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                  Provably fair algorithms
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                  Transparent operations
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                  Secure transactions
                </li>
              </ul>
            </motion.div>
            
            <motion.div
              variants={item}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl shadow-xl hover:shadow-red-900/10 transition-shadow"
            >
              <div className="bg-red-600/20 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Users className="text-red-500" size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Social Gaming</h3>
              <p className="text-gray-400">
                Connect with friends and other players around the world for a truly immersive casino experience.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-gray-300">
                  <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                  Live chat with players
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                  Create private tables
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                  Compete on leaderboards
                </li>
              </ul>
            </motion.div>
            
            <motion.div
              variants={item}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl shadow-xl hover:shadow-red-900/10 transition-shadow"
            >
              <div className="bg-red-600/20 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Clock className="text-red-500" size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4">24/7 Support</h3>
              <p className="text-gray-400">
                Our dedicated support team is available around the clock to assist you with any questions or issues.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-gray-300">
                  <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                  Live chat assistance
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                  Comprehensive guides
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                  VIP account managers
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section id="stats" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Numbers Never Lie</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Join thousands of players already enjoying our platform every day.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatedCounter value="250,000" label="Registered Players" icon={<Users size={32} />} />
            <AnimatedCounter value="5,000,000" label="Games Played" icon={<TrendingUp size={32} />} />
            <AnimatedCounter value="50,000" label="Daily Active Users" icon={<Users size={32} />} />
            <AnimatedCounter value="99.9" label="Uptime Percentage" icon={<Shield size={32} />} />
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What Our Players Say</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Don&apos;t just take our word for it - hear from our satisfied players around the world.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              name="Jennifer L."
              quote="The most realistic online roulette experience I've ever tried. The animations are smooth and the odds feel fair."
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
      <section className="py-20 bg-gradient-to-r from-red-900/50 to-black relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 rounded-full border border-red-500"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 2, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-4 z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Try Your Luck?</h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
              Sign up now and get 1000 free credits to start your gaming journey. No deposits required!
            </p>
            
            <motion.button 
              onClick={() => router.push('/roulette')}
              className="bg-gradient-to-r from-red-600 to-red-800 px-10 py-4 rounded-xl font-bold text-lg shadow-xl shadow-red-600/20"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(220, 38, 38, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              Start Playing Now
            </motion.button>
            
            <p className="text-gray-500 mt-6">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-black py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 border-4 border-red-600 rounded-full border-t-transparent mr-2" />
                <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
                  RULETTE
                </span>
              </div>
              <p className="text-gray-400 mb-4">
                The premier destination for online roulette games.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 411.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 01.8 5.878v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Games</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">European Roulette</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">American Roulette</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">French Roulette</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Live Dealer Tables</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Responsible Gaming</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Contact Us</h4>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-400">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  support@rulette.com
                </li>
                <li className="flex items-center text-gray-400">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  +1 (555) 123-4567
                </li>
              </ul>
              
              <div className="mt-6">
                <h5 className="text-sm font-bold mb-2">Subscribe to our newsletter</h5>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="bg-gray-800 border border-gray-700 px-4 py-2 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-red-500 w-full"
                  />
                  <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-r-lg transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-500">
              © {new Date().getFullYear()} Rulette. All rights reserved. 18+ only. Please play responsibly.
            </p>

            <p className="text-gray-500 mt-2">
                This is a demo project created by 
                <span className="text-red-500">
                    real-kijmoshi
                </span>


            </p>
                <p>
                none of the data is real and the project is not for commercial use.
                i strongly disrecomand gambling because it can be addictive and dangerous.
                money attached to the account is not real and can&apos;t be withdrawn.
                </p>
          </div>
        </div>
      </footer>
    </div>
  );
}