import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Star, Trophy, BookOpen, Calculator, Target, Puzzle } from 'lucide-react';

export default function LevelSelect() {
  const levels = [
    {
      id: 'foundation',
      title: 'Number Friends',
      subtitle: '1 - 10',
      description: 'Meet your first number friends!',
      icon: Star,
      color: 'from-pink-400 to-rose-500',
      bgColor: 'bg-pink-50',
      range: '1-10',
      path: '/chart/foundation'
    },
    {
      id: 'teens',
      title: 'Teen Adventures',
      subtitle: '11 - 20',
      description: 'Explore the teen numbers!',
      icon: Sparkles,
      color: 'from-purple-400 to-violet-500',
      bgColor: 'bg-purple-50',
      range: '11-20',
      path: '/chart/teens'
    },
    {
      id: 'tens',
      title: 'Tens Journey',
      subtitle: '1 - 100',
      description: 'Master counting to 100!',
      icon: Calculator,
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-blue-50',
      range: '1-100',
      path: '/chart/tens'
    },
    {
      id: 'hundreds',
      title: 'Hundreds Quest',
      subtitle: '101 - 500',
      description: 'Discover the hundreds!',
      icon: BookOpen,
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-50',
      range: '101-500',
      path: '/chart/hundreds'
    },
    {
      id: 'thousands',
      title: 'Big Numbers',
      subtitle: '501 - 1000',
      description: 'Conquer numbers to 1000!',
      icon: Trophy,
      color: 'from-amber-400 to-orange-500',
      bgColor: 'bg-amber-50',
      range: '501-1000',
      path: '/chart/thousands'
    },
    {
      id: 'puzzle',
      title: 'Number Shape Puzzle',
      subtitle: 'Letters A-Z & Cross',
      description: 'Fill letter shapes with numbers!',
      icon: Puzzle,
      color: 'from-cyan-400 to-blue-500',
      bgColor: 'bg-cyan-50',
      range: 'Game',
      path: '/puzzle'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0, rotateX: -15 },
    visible: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: { type: 'spring' as const, stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-8 h-8 rounded-full opacity-20"
            style={{
              background: `hsl(${Math.random() * 360}, 70%, 60%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent mb-4"
            style={{ textShadow: '0 4px 20px rgba(168, 85, 247, 0.3)' }}
          >
            Number Explorer
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-purple-700 font-medium"
          >
            🎯 Learn numbers from 1 to 1000! 🚀
          </motion.p>
        </motion.div>

        {/* Level Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {levels.map((level) => (
            <motion.div
              key={level.id}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.05, 
                rotateY: 5,
                rotateX: 5,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
              whileTap={{ scale: 0.98 }}
              className="perspective-1000 h-full"
            >
              <Link
                to={level.path}
                className={`flex flex-col h-full ${level.bgColor} rounded-3xl p-6 shadow-xl border-2 border-white/50 transform-gpu transition-all duration-300`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* 3D Card effect */}
                <div className="relative flex flex-col flex-1">
                  {/* Glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${level.color} opacity-0 rounded-3xl blur-xl transition-opacity duration-300 group-hover:opacity-30`} />
                  
                  <div className="flex items-start gap-4">
                    <motion.div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${level.color} flex items-center justify-center shadow-lg shrink-0`}
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                      style={{ transform: 'translateZ(20px)' }}
                    >
                      <level.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-800 mb-1">{level.title}</h2>
                      <p className={`text-lg font-bold bg-gradient-to-r ${level.color} bg-clip-text text-transparent`}>
                        {level.subtitle}
                      </p>
                    </div>
                  </div>
                  
                  <p className="mt-4 text-gray-600 text-sm md:text-base flex-1">
                    {level.description}
                  </p>
                  
                  {/* Progress indicator */}
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-white/50 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${level.color} rounded-full transition-all duration-500`}
                        style={{ width: `${Math.random() * 40 + 10}%` }}
                      />
                    </div>
                    <Target className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Fun facts */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="inline-block bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-lg">
            <p className="text-lg text-purple-700 font-medium">
              ✨ Tap any number to hear it spoken and learn fun facts! ✨
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}