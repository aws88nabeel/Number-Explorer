import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Volume2, VolumeX, Lightbulb, X, ChevronLeft, ChevronRight,
  Sparkles, Star, PartyPopper, RefreshCw, Eye, EyeOff, Palette, Trophy
} from 'lucide-react';

interface NumberBlock {
  value: number;
  isEven: boolean;
  isOdd: boolean;
  isPrime: boolean;
  isMultipleOf5: boolean;
  isMultipleOf10: boolean;
  isSquare: boolean;
  word: string;
  fact: string;
}

const numberWords: { [key: number]: string } = {
  1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five',
  6: 'Six', 7: 'Seven', 8: 'Eight', 9: 'Nine', 10: 'Ten',
  11: 'Eleven', 12: 'Twelve', 13: 'Thirteen', 14: 'Fourteen', 15: 'Fifteen',
  16: 'Sixteen', 17: 'Seventeen', 18: 'Eighteen', 19: 'Nineteen', 20: 'Twenty',
  21: 'Twenty-one', 22: 'Twenty-two', 23: 'Twenty-three', 24: 'Twenty-four', 25: 'Twenty-five',
  30: 'Thirty', 40: 'Forty', 50: 'Fifty', 60: 'Sixty', 70: 'Seventy', 80: 'Eighty', 90: 'Ninety',
  100: 'One hundred', 200: 'Two hundred', 300: 'Three hundred', 400: 'Four hundred', 500: 'Five hundred',
  600: 'Six hundred', 700: 'Seven hundred', 800: 'Eight hundred', 900: 'Nine hundred', 1000: 'One thousand'
};

const funFacts = [
  (n: number) => n === 1 ? "1 is the first number! It's the start of everything! 🌟" : null,
  (n: number) => n === 2 ? "2 is the only even prime number! How special! ✨" : null,
  (n: number) => n === 3 ? "3 is a magic number in fairy tales! 🧚" : null,
  (n: number) => n === 4 ? "4 legs help animals like dogs and cats walk! 🐕" : null,
  (n: number) => n === 5 ? "5 fingers on each hand help us count! ✋" : null,
  (n: number) => n === 6 ? "6 sides make a hexagon, like a honeycomb! 🐝" : null,
  (n: number) => n === 7 ? "7 colors make a rainbow! 🌈" : null,
  (n: number) => n === 8 ? "8 legs make a spider special! 🕷️" : null,
  (n: number) => n === 9 ? "9 planets were in our solar system (now 8)! 🪐" : null,
  (n: number) => n === 10 ? "10 fingers and 10 toes - perfect for counting! 👣" : null,
  (n: number) => n === 12 ? "12 makes a dozen - great for eggs! 🥚" : null,
  (n: number) => n === 20 ? "20 fingers and toes on a human! 🖐️" : null,
  (n: number) => n === 25 ? "25 is a quarter of 100! 🎯" : null,
  (n: number) => n === 50 ? "50 is half of 100! 🌟" : null,
  (n: number) => n === 100 ? "100 is a century! Perfect score! 💯" : null,
  (n: number) => n === 365 ? "365 days in a year! 📅" : null,
  (n: number) => n === 1000 ? "1000 is a millennium! A thousand years! 🎉" : null,
  (n: number) => isPrime(n) ? `${n} is a prime number! It only has 2 factors! 🔢` : null,
  (n: number) => isSquareNumber(n) ? `${n} is a perfect square! ${Math.sqrt(n)} × ${Math.sqrt(n)}! 📐` : null,
  (n: number) => n % 10 === 0 && n > 0 ? `${n} ends with a zero! Easy to count by tens! 🔟` : null,
];

function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

function isSquareNumber(n: number): boolean {
  const sqrt = Math.sqrt(n);
  return sqrt === Math.floor(sqrt);
}

function getNumberWord(n: number): string {
  if (numberWords[n]) return numberWords[n];
  
  if (n < 100) {
    const tens = Math.floor(n / 10) * 10;
    const ones = n % 10;
    if (ones === 0) return numberWords[tens] || `${tens}`;
    return `${numberWords[tens]}-${numberWords[ones]?.toLowerCase()}`;
  }
  
  if (n < 1000) {
    const hundreds = Math.floor(n / 100);
    const remainder = n % 100;
    const hundredWord = numberWords[hundreds * 100];
    if (remainder === 0) return hundredWord;
    return `${hundredWord} and ${getNumberWord(remainder).toLowerCase()}`;
  }
  
  return n.toString();
}

function getFact(n: number): string {
  for (const factFn of funFacts) {
    const fact = factFn(n);
    if (fact) return fact;
  }
  return `${n} is a great number! Keep exploring! 🎉`;
}

const patterns = {
  none: { label: 'All Numbers', color: null, filter: () => true },
  evens: { label: 'Even Numbers', color: 'bg-blue-400', filter: (n: number) => n % 2 === 0 },
  odds: { label: 'Odd Numbers', color: 'bg-purple-400', filter: (n: number) => n % 2 !== 0 },
  primes: { label: 'Prime Numbers', color: 'bg-yellow-400', filter: isPrime },
  fives: { label: 'Count by 5s', color: 'bg-green-400', filter: (n: number) => n % 5 === 0 },
  tens: { label: 'Count by 10s', color: 'bg-orange-400', filter: (n: number) => n % 10 === 0 },
  squares: { label: 'Square Numbers', color: 'bg-pink-400', filter: isSquareNumber },
};

export default function NumbersChart() {
  const { level } = useParams<{ level: string }>();
  const [numbers, setNumbers] = useState<NumberBlock[]>([]);
  const [selectedNumber, setSelectedNumber] = useState<NumberBlock | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentPattern, setCurrentPattern] = useState<keyof typeof patterns>('none');
  const [currentPage, setCurrentPage] = useState(0);
  const [visitedNumbers, setVisitedNumbers] = useState<Set<number>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);

  const levelConfig = {
    foundation: { start: 1, end: 10, perPage: 10, title: 'Number Friends (1-10)', color: 'pink' },
    teens: { start: 11, end: 20, perPage: 10, title: 'Teen Adventures (11-20)', color: 'purple' },
    tens: { start: 1, end: 100, perPage: 100, title: 'Tens Journey (1-100)', color: 'blue' },
    hundreds: { start: 100, end: 500, perPage: 100, title: 'Hundreds Quest (100-500)', color: 'green' },
    thousands: { start: 500, end: 1000, perPage: 100, title: 'Big Numbers (500-1000)', color: 'amber' },
  };

  const config = levelConfig[level as keyof typeof levelConfig] || levelConfig.foundation;

  useEffect(() => {
    const nums: NumberBlock[] = [];
    for (let i = config.start; i <= config.end; i++) {
      nums.push({
        value: i,
        isEven: i % 2 === 0,
        isOdd: i % 2 !== 0,
        isPrime: isPrime(i),
        isMultipleOf5: i % 5 === 0,
        isMultipleOf10: i % 10 === 0,
        isSquare: isSquareNumber(i),
        word: getNumberWord(i),
        fact: getFact(i),
      });
    }
    setNumbers(nums);
    setCurrentPage(0);
    setSelectedNumber(null);
  }, [level]);

  const speakNumber = useCallback((num: NumberBlock) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    
    const utterance = new SpeechSynthesisUtterance(num.word);
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    speechSynthesis.speak(utterance);
  }, [soundEnabled]);

  const handleNumberClick = (num: NumberBlock) => {
    setSelectedNumber(num);
    speakNumber(num);
    setVisitedNumbers(prev => {
      const newSet = new Set(prev);
      newSet.add(num.value);
      return newSet;
    });
    
    // Celebration for milestones
    if (num.value % 100 === 0 || num.value === 10 || num.value === 50) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
  };

  const getColorClass = (num: NumberBlock) => {
    if (currentPattern !== 'none') {
      if (patterns[currentPattern].filter(num.value)) {
        return patterns[currentPattern].color;
      }
      return 'bg-gray-200';
    }
    
    // Rainbow gradient based on number
    const hue = (num.value * 3.6) % 360;
    return `bg-gradient-to-br`;
  };

  const getBlockStyle = (num: NumberBlock, index: number) => {
    if (currentPattern !== 'none' && !patterns[currentPattern].filter(num.value)) {
      return { 
        background: 'linear-gradient(135deg, #e5e7eb, #d1d5db)',
        opacity: 0.5 
      };
    }
    
    const hue = (num.value * 3.6) % 360;
    return {
      background: `linear-gradient(135deg, hsl(${hue}, 70%, 60%), hsl(${(hue + 30) % 360}, 70%, 50%))`,
    };
  };

  const filteredNumbers = numbers.filter(n => currentPattern === 'none' || patterns[currentPattern].filter(n.value));
  const totalPages = Math.ceil(numbers.length / config.perPage);
  const pageNumbers = numbers.slice(currentPage * config.perPage, (currentPage + 1) * config.perPage);

  const gridSize = config.perPage <= 10 ? 'grid-cols-5' : config.perPage <= 100 ? 'grid-cols-10' : 'grid-cols-10';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative overflow-hidden">
      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  y: 0, 
                  x: 0, 
                  scale: 0,
                  opacity: 1 
                }}
                animate={{ 
                  y: [0, -200 - Math.random() * 200],
                  x: (Math.random() - 0.5) * 400,
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0],
                  rotate: Math.random() * 360
                }}
                transition={{ duration: 2, delay: i * 0.05 }}
                className="absolute text-4xl"
              >
                {['🎉', '⭐', '🌟', '✨', '🎊'][Math.floor(Math.random() * 5)]}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            
            <h1 className="text-lg md:text-2xl font-bold text-gray-800 text-center flex-1">
              {config.title}
            </h1>
            
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-3 rounded-full ${soundEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'} shadow-lg hover:shadow-xl transition-all`}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Pattern Selector */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          <Palette className="w-5 h-5 text-purple-600 self-center mr-2" />
          {Object.entries(patterns).map(([key, pattern]) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPattern(key as keyof typeof patterns)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                currentPattern === key 
                  ? `${pattern.color || 'bg-purple-500'} text-white shadow-lg` 
                  : 'bg-white/70 text-gray-700 hover:bg-white'
              }`}
            >
              {pattern.label}
            </motion.button>
          ))}
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="flex items-center gap-2 bg-white/70 rounded-full px-4 py-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-bold text-gray-700">
              {visitedNumbers.size} numbers explored!
            </span>
          </div>
          {visitedNumbers.size >= 10 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2 bg-yellow-100 rounded-full px-4 py-2"
            >
              <Trophy className="w-5 h-5 text-yellow-600" />
              <span className="font-bold text-yellow-700">Explorer!</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Number Grid */}
      <div className="container mx-auto px-4 pb-8">
        <motion.div
          className={`grid ${gridSize} gap-2 md:gap-3 max-w-4xl mx-auto`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {pageNumbers.map((num, index) => (
            <motion.button
              key={num.value}
              initial={{ opacity: 0, scale: 0, rotateY: -90 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                rotateY: 0,
              }}
              transition={{ 
                delay: index * 0.02,
                type: 'spring',
                stiffness: 200
              }}
              whileHover={{ 
                scale: 1.15, 
                rotateY: 15,
                rotateX: 10,
                zIndex: 20
              }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleNumberClick(num)}
              className="aspect-square rounded-xl md:rounded-2xl flex items-center justify-center font-bold text-lg md:text-xl shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
              style={{ 
                ...getBlockStyle(num, index),
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              {/* 3D depth effect */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)',
                }}
              />
              
              <span 
                className={`relative z-10 ${config.perPage <= 10 ? 'text-4xl md:text-5xl' : 'text-sm md:text-lg'} text-white drop-shadow-lg`}
                style={{ transform: 'translateZ(10px)' }}
              >
                {num.value}
              </span>
              
              {/* Visited indicator */}
              {visitedNumbers.has(num.value) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center"
                >
                  <Star className="w-2 h-2 text-white" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="p-3 bg-white rounded-full shadow-lg disabled:opacity-50"
            >
              <ChevronLeft className="w-6 h-6 text-purple-600" />
            </motion.button>
            
            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentPage === i ? 'bg-purple-500 scale-125' : 'bg-purple-200'
                  }`}
                />
              ))}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
              className="p-3 bg-white rounded-full shadow-lg disabled:opacity-50"
            >
              <ChevronRight className="w-6 h-6 text-purple-600" />
            </motion.button>
          </div>
        )}
      </div>

      {/* Number Detail Modal */}
      <AnimatePresence>
        {selectedNumber && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setSelectedNumber(null)}
          >
            <motion.div
              initial={{ scale: 0.5, rotateY: -90, y: 50 }}
              animate={{ scale: 1, rotateY: 0, y: 0 }}
              exit={{ scale: 0.5, rotateY: 90, y: 50 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Background decoration */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  background: `linear-gradient(135deg, hsl(${(selectedNumber.value * 3.6) % 360}, 70%, 60%), hsl(${(selectedNumber.value * 3.6 + 60) % 360}, 70%, 60%))`
                }}
              />
              
              <button
                onClick={() => setSelectedNumber(null)}
                className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              <div className="relative z-10">
                {/* Number display */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                  className="text-center mb-6"
                >
                  <div 
                    className="text-7xl md:text-8xl font-black mb-2"
                    style={{
                      background: `linear-gradient(135deg, hsl(${(selectedNumber.value * 3.6) % 360}, 70%, 50%), hsl(${(selectedNumber.value * 3.6 + 60) % 360}, 70%, 40%))`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {selectedNumber.value}
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-700">
                    {selectedNumber.word}
                  </div>
                </motion.div>

                {/* Properties */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap gap-2 justify-center mb-6"
                >
                  {selectedNumber.isEven && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                      Even
                    </span>
                  )}
                  {selectedNumber.isOdd && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
                      Odd
                    </span>
                  )}
                  {selectedNumber.isPrime && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold">
                      Prime ⭐
                    </span>
                  )}
                  {selectedNumber.isMultipleOf5 && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                      ×5
                    </span>
                  )}
                  {selectedNumber.isMultipleOf10 && (
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-bold">
                      ×10
                    </span>
                  )}
                  {selectedNumber.isSquare && (
                    <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-bold">
                      Square 📐
                    </span>
                  )}
                </motion.div>

                {/* Fun fact */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 mb-6"
                >
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                    <p className="text-gray-700 text-lg">{selectedNumber.fact}</p>
                  </div>
                </motion.div>

                {/* Actions */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => speakNumber(selectedNumber)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Volume2 className="w-5 h-5" />
                    Say It
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}