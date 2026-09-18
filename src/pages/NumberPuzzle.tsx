import { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Volume2, VolumeX, RefreshCw, Star, Trophy, Lightbulb,
  Check, X, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Puzzle as PuzzleIcon
} from 'lucide-react';

type Direction = 'up' | 'down' | 'left' | 'right';

interface CellResult {
  status: 'empty' | 'correct' | 'wrong';
}

const blocks = [
  { label: '1 - 100', start: 1, end: 100, color: 'from-pink-400 to-rose-500' },
  { label: '101 - 200', start: 101, end: 200, color: 'from-purple-400 to-violet-500' },
  { label: '201 - 300', start: 201, end: 300, color: 'from-blue-400 to-cyan-500' },
  { label: '301 - 400', start: 301, end: 400, color: 'from-teal-400 to-emerald-500' },
  { label: '401 - 500', start: 401, end: 500, color: 'from-green-400 to-lime-500' },
  { label: '501 - 600', start: 501, end: 600, color: 'from-yellow-400 to-amber-500' },
  { label: '601 - 700', start: 601, end: 700, color: 'from-orange-400 to-red-500' },
  { label: '701 - 800', start: 701, end: 800, color: 'from-red-400 to-rose-600' },
  { label: '801 - 900', start: 801, end: 900, color: 'from-fuchsia-400 to-purple-600' },
  { label: '901 - 1000', start: 901, end: 1000, color: 'from-indigo-400 to-blue-600' },
];

function randomCenter(blockStart: number, blockEnd: number): number {
  // Keep a safe margin so up(-10), down(+10), left(-1), right(+1) all stay within 1..1000
  const safeMin = Math.max(blockStart, 11);
  const safeMax = Math.min(blockEnd, 990);
  const lo = Math.min(safeMin, safeMax);
  const hi = Math.max(safeMin, safeMax);
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

export default function NumberPuzzle() {
  const [blockIndex, setBlockIndex] = useState(0);
  const [center, setCenter] = useState(() => randomCenter(blocks[0].start, blocks[0].end));
  const [inputs, setInputs] = useState<Record<Direction, string>>({ up: '', down: '', left: '', right: '' });
  const [results, setResults] = useState<Record<Direction, CellResult>>({
    up: { status: 'empty' }, down: { status: 'empty' }, left: { status: 'empty' }, right: { status: 'empty' }
  });
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const inputRefs = useRef<Record<Direction, HTMLInputElement | null>>({ up: null, down: null, left: null, right: null });

  const answers: Record<Direction, number> = {
    up: center - 10,
    down: center + 10,
    left: center - 1,
    right: center + 1,
  };

  const speak = useCallback((text: string) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1.2;
    speechSynthesis.speak(utterance);
  }, [soundEnabled]);

  const newPuzzle = useCallback((idx?: number) => {
    const bi = idx ?? blockIndex;
    const block = blocks[bi];
    setCenter(randomCenter(block.start, block.end));
    setInputs({ up: '', down: '', left: '', right: '' });
    setResults({ up: { status: 'empty' }, down: { status: 'empty' }, left: { status: 'empty' }, right: { status: 'empty' } });
    setChecked(false);
    setShowHint(false);
  }, [blockIndex]);

  useEffect(() => {
    // Announce the puzzle's center number when a new one appears
  }, [center]);

  const handleBlockChange = (idx: number) => {
    setBlockIndex(idx);
    newPuzzle(idx);
  };

  const handleInputChange = (dir: Direction, value: string) => {
    if (value !== '' && !/^\d{1,4}$/.test(value)) return;
    setInputs(prev => ({ ...prev, [dir]: value }));
  };

  const focusNext = (dir: Direction) => {
    const order: Direction[] = ['up', 'left', 'right', 'down'];
    const idx = order.indexOf(dir);
    const next = order[(idx + 1) % order.length];
    inputRefs.current[next]?.focus();
  };

  const checkAnswers = () => {
    const newResults: Record<Direction, CellResult> = { up: { status: 'empty' }, down: { status: 'empty' }, left: { status: 'empty' }, right: { status: 'empty' } };
    let allCorrect = true;
    (Object.keys(answers) as Direction[]).forEach(dir => {
      const val = parseInt(inputs[dir], 10);
      const correct = val === answers[dir];
      newResults[dir] = { status: inputs[dir] === '' ? 'wrong' : (correct ? 'correct' : 'wrong') };
      if (!correct) allCorrect = false;
    });
    setResults(newResults);
    setChecked(true);
    setAttempts(a => a + 1);

    if (allCorrect) {
      setScore(s => s + 10);
      setStreak(s => s + 1);
      setShowCelebration(true);
      speak('Great job! You got it right!');
      setTimeout(() => setShowCelebration(false), 1800);
      setTimeout(() => newPuzzle(), 1600);
    } else {
      setStreak(0);
      speak('Not quite, try again!');
    }
  };

  const allFilled = Object.values(inputs).every(v => v !== '');

  const cellClasses = (dir: Direction) => {
    const r = results[dir];
    if (!checked || r.status === 'empty' && !checked) {
      return 'border-purple-300 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-300';
    }
    if (r.status === 'correct') return 'border-green-500 bg-green-50 text-green-700';
    if (r.status === 'wrong') return 'border-red-400 bg-red-50 text-red-600';
    return 'border-purple-300 bg-white';
  };

  const currentBlock = blocks[blockIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative overflow-hidden">
      {/* Celebration */}
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
                initial={{ y: 0, x: 0, scale: 0, opacity: 1 }}
                animate={{
                  y: [0, -200 - Math.random() * 200],
                  x: (Math.random() - 0.5) * 400,
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0],
                  rotate: Math.random() * 360
                }}
                transition={{ duration: 1.8, delay: i * 0.03 }}
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

            <h1 className="text-lg md:text-2xl font-bold text-gray-800 text-center flex-1 flex items-center justify-center gap-2">
              <PuzzleIcon className="w-6 h-6 text-purple-500" />
              Number Cross Puzzle
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

      <div className="container mx-auto px-4 py-6">
        {/* Block selector */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {blocks.map((b, idx) => (
            <motion.button
              key={b.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBlockChange(idx)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                blockIndex === idx
                  ? `bg-gradient-to-r ${b.color} text-white shadow-lg`
                  : 'bg-white/70 text-gray-700 hover:bg-white'
              }`}
            >
              {b.label}
            </motion.button>
          ))}
        </div>

        {/* Score bar */}
        <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-2 bg-white/70 rounded-full px-4 py-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-bold text-gray-700">Score: {score}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/70 rounded-full px-4 py-2">
            <Trophy className="w-5 h-5 text-orange-500" />
            <span className="font-bold text-gray-700">Streak: {streak}</span>
          </div>
          <button
            onClick={() => setShowHint(h => !h)}
            className="flex items-center gap-2 bg-yellow-100 rounded-full px-4 py-2 font-bold text-yellow-700 hover:bg-yellow-200 transition-colors"
          >
            <Lightbulb className="w-5 h-5" />
            Hint
          </button>
        </div>

        {/* Hint box */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-md mx-auto mb-6 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 text-center text-gray-700">
                <p className="mb-1">⬆️ <b>Up</b> = 10 less &nbsp; ⬇️ <b>Down</b> = 10 more</p>
                <p>⬅️ <b>Left</b> = 1 less &nbsp; ➡️ <b>Right</b> = 1 more</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Puzzle grid */}
        <motion.div
          key={center}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 150 }}
          className="max-w-sm mx-auto"
        >
          <div
            className="grid grid-cols-3 gap-3"
            style={{ gridTemplateRows: 'repeat(3, 1fr)' }}
          >
            {/* row 1 */}
            <div />
            <PuzzleCell>
              <ArrowUp className="w-4 h-4 text-purple-400 mb-1" />
              <input
                ref={el => { inputRefs.current.up = el; }}
                type="text"
                inputMode="numeric"
                value={inputs.up}
                onChange={e => handleInputChange('up', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && focusNext('up')}
                className={`w-full text-center text-lg md:text-xl font-bold rounded-xl border-2 py-2 outline-none transition-all ${cellClasses('up')}`}
                placeholder="?"
              />
            </PuzzleCell>
            <div />

            {/* row 2 */}
            <PuzzleCell>
              <ArrowLeft className="w-4 h-4 text-purple-400 mb-1" />
              <input
                ref={el => { inputRefs.current.left = el; }}
                type="text"
                inputMode="numeric"
                value={inputs.left}
                onChange={e => handleInputChange('left', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && focusNext('left')}
                className={`w-full text-center text-lg md:text-xl font-bold rounded-xl border-2 py-2 outline-none transition-all ${cellClasses('left')}`}
                placeholder="?"
              />
            </PuzzleCell>

            <div className="aspect-square rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-xl">
              <span className="text-2xl md:text-3xl font-black text-white drop-shadow-lg">{center}</span>
            </div>

            <PuzzleCell>
              <ArrowRight className="w-4 h-4 text-purple-400 mb-1" />
              <input
                ref={el => { inputRefs.current.right = el; }}
                type="text"
                inputMode="numeric"
                value={inputs.right}
                onChange={e => handleInputChange('right', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && focusNext('right')}
                className={`w-full text-center text-lg md:text-xl font-bold rounded-xl border-2 py-2 outline-none transition-all ${cellClasses('right')}`}
                placeholder="?"
              />
            </PuzzleCell>

            {/* row 3 */}
            <div />
            <PuzzleCell>
              <ArrowDown className="w-4 h-4 text-purple-400 mb-1" />
              <input
                ref={el => { inputRefs.current.down = el; }}
                type="text"
                inputMode="numeric"
                value={inputs.down}
                onChange={e => handleInputChange('down', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && checkAnswers()}
                className={`w-full text-center text-lg md:text-xl font-bold rounded-xl border-2 py-2 outline-none transition-all ${cellClasses('down')}`}
                placeholder="?"
              />
            </PuzzleCell>
            <div />
          </div>

          {/* Feedback icons */}
          {checked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-4 gap-2 mt-3 text-center"
            >
              {(['up', 'left', 'right', 'down'] as Direction[]).map(dir => (
                <div key={dir} className="flex items-center justify-center gap-1 text-sm">
                  {results[dir].status === 'correct' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                  <span className="capitalize text-gray-500">{dir}</span>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={checkAnswers}
            disabled={!allFilled}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Check className="w-5 h-5" />
            Check Answers
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => newPuzzle()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            New Puzzle
          </motion.button>
        </div>

        {checked && !Object.values(results).every(r => r.status === 'correct') && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-4 text-red-500 font-medium"
          >
            Not quite right — check the highlighted squares and try again! 💪
          </motion.p>
        )}

        <div className="text-center mt-6 text-gray-500 text-sm">
          Attempts: {attempts} &nbsp;•&nbsp; Practicing block: <b>{currentBlock.label}</b>
        </div>
      </div>
    </div>
  );
}

function PuzzleCell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center">
      {children}
    </div>
  );
}
