import { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Volume2, VolumeX, RefreshCw, Star, Trophy, Lightbulb,
  Check, X, Puzzle as PuzzleIcon, Shuffle
} from 'lucide-react';

// 5-wide x 7-tall dot-matrix bitmaps for letters, plus a 3x3 "+" cross shape.
// '1' = part of the shape (fillable/given cell), '0' = empty space.
const LETTER_SHAPES: Record<string, string[]> = {
  CROSS: ['010', '111', '010'],
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  C: ['01110', '10001', '10000', '10000', '10000', '10001', '01110'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  G: ['01110', '10001', '10000', '10111', '10001', '10001', '01110'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  J: ['00111', '00010', '00010', '00010', '10010', '10010', '01100'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  N: ['10001', '11001', '10101', '10101', '10011', '10001', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  Q: ['01110', '10001', '10001', '10001', '10101', '10010', '01101'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  V: ['10001', '10001', '10001', '10001', '01010', '01010', '00100'],
  W: ['10001', '10001', '10001', '10101', '10101', '11011', '10001'],
  X: ['10001', '01010', '00100', '00100', '00100', '01010', '10001'],
  Y: ['10001', '01010', '00100', '00100', '00100', '00100', '00100'],
  Z: ['11111', '00001', '00010', '00100', '01000', '10000', '11111'],
};

const shapeOrder = ['H', 'CROSS', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

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

interface Cell { r: number; c: number; }
interface PuzzleData {
  bitmap: string[];
  rows: number;
  cols: number;
  givenKey: string;
  values: Record<string, number>;
  onKeys: string[];
}

function buildPuzzle(shapeId: string, blockIdx: number): PuzzleData {
  const bitmap = LETTER_SHAPES[shapeId];
  const rows = bitmap.length;
  const cols = bitmap[0].length;
  const onCells: Cell[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (bitmap[r][c] === '1') onCells.push({ r, c });
    }
  }
  const given = onCells[0];
  const offsets = onCells.map(cell => ({
    key: `${cell.r}-${cell.c}`,
    off: (cell.r - given.r) * 10 + (cell.c - given.c),
  }));
  const minOff = Math.min(...offsets.map(o => o.off));
  const maxOff = Math.max(...offsets.map(o => o.off));

  const lowBound = Math.max(1 - minOff, 1);
  const highBound = Math.min(999 - maxOff, 999);
  const block = blocks[blockIdx];
  let lo = Math.max(lowBound, block.start);
  let hi = Math.min(highBound, block.end);
  if (lo > hi) { lo = lowBound; hi = highBound; }
  const start = Math.floor(Math.random() * (hi - lo + 1)) + lo;

  const values: Record<string, number> = {};
  offsets.forEach(o => { values[o.key] = start + o.off; });

  return {
    bitmap,
    rows,
    cols,
    givenKey: `${given.r}-${given.c}`,
    values,
    onKeys: onCells.map(c => `${c.r}-${c.c}`),
  };
}

export default function NumberPuzzle() {
  const [shapeId, setShapeId] = useState('H');
  const [blockIndex, setBlockIndex] = useState(0);
  const [puzzle, setPuzzle] = useState<PuzzleData>(() => buildPuzzle('H', 0));
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, 'empty' | 'correct' | 'wrong'>>({});
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const speak = useCallback((text: string) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1.2;
    speechSynthesis.speak(utterance);
  }, [soundEnabled]);

  const newPuzzle = useCallback((sId?: string, bIdx?: number) => {
    const sid = sId ?? shapeId;
    const bidx = bIdx ?? blockIndex;
    const p = buildPuzzle(sid, bidx);
    setPuzzle(p);
    setInputs({});
    setResults({});
    setChecked(false);
    setShowHint(false);
  }, [shapeId, blockIndex]);

  const handleShapeChange = (sid: string) => {
    setShapeId(sid);
    newPuzzle(sid, blockIndex);
  };

  const handleBlockChange = (idx: number) => {
    setBlockIndex(idx);
    newPuzzle(shapeId, idx);
  };

  const handleRandomShape = () => {
    const options = shapeOrder.filter(s => s !== shapeId);
    const pick = options[Math.floor(Math.random() * options.length)];
    handleShapeChange(pick);
  };

  const handleInputChange = (key: string, value: string) => {
    if (value !== '' && !/^\d{1,4}$/.test(value)) return;
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const fillableKeys = useMemo(
    () => puzzle.onKeys.filter(k => k !== puzzle.givenKey),
    [puzzle]
  );

  const allFilled = fillableKeys.every(k => inputs[k] && inputs[k] !== '');

  const checkAnswers = () => {
    const newResults: Record<string, 'empty' | 'correct' | 'wrong'> = {};
    let allCorrect = true;
    fillableKeys.forEach(key => {
      const val = parseInt(inputs[key] ?? '', 10);
      const correct = val === puzzle.values[key];
      newResults[key] = inputs[key] ? (correct ? 'correct' : 'wrong') : 'wrong';
      if (!correct) allCorrect = false;
    });
    setResults(newResults);
    setChecked(true);
    setAttempts(a => a + 1);

    if (allCorrect) {
      setScore(s => s + 10);
      setStreak(s => s + 1);
      setShowCelebration(true);
      speak('Great job! You completed the shape!');
      setTimeout(() => setShowCelebration(false), 1800);
      setTimeout(() => newPuzzle(), 1600);
    } else {
      setStreak(0);
      speak('Not quite, try again!');
    }
  };

  const cellClasses = (key: string) => {
    const r = results[key];
    if (!checked) return 'border-purple-300 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-300';
    if (r === 'correct') return 'border-green-500 bg-green-50 text-green-700';
    if (r === 'wrong') return 'border-red-400 bg-red-50 text-red-600';
    return 'border-purple-300 bg-white';
  };

  const currentBlock = blocks[blockIndex];
  const cellSize = puzzle.cols <= 3 ? 'w-16 h-16 md:w-20 md:h-20' : 'w-11 h-11 md:w-14 md:h-14';
  const fontSize = puzzle.cols <= 3 ? 'text-xl md:text-2xl' : 'text-xs md:text-base';

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
              Number Shape Puzzle
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
        {/* Shape selector */}
        <div className="mb-4">
          <p className="text-center text-sm font-bold text-gray-500 mb-2">Choose a Shape</p>
          <div className="flex flex-wrap gap-2 justify-center max-w-3xl mx-auto">
            {shapeOrder.map(sid => (
              <motion.button
                key={sid}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleShapeChange(sid)}
                className={`w-10 h-10 rounded-xl font-bold text-sm flex items-center justify-center transition-all ${
                  shapeId === sid
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg scale-110'
                    : 'bg-white/70 text-gray-700 hover:bg-white'
                }`}
              >
                {sid === 'CROSS' ? '➕' : sid}
              </motion.button>
            ))}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRandomShape}
              className="w-10 h-10 rounded-xl bg-yellow-100 text-yellow-700 flex items-center justify-center shadow hover:shadow-lg transition-all"
              title="Random shape"
            >
              <Shuffle className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

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
                <p className="mb-1">➡️ Moving <b>one square right</b> = add 1</p>
                <p className="mb-1">⬇️ Moving <b>one square down</b> = add 10</p>
                <p>Combine both to solve diagonal squares — just like a real number chart!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Puzzle grid */}
        <motion.div
          key={puzzle.givenKey + shapeId + blockIndex + JSON.stringify(puzzle.values)}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 150 }}
          className="flex justify-center"
        >
          <div
            className="inline-grid gap-1.5 md:gap-2 bg-white/40 p-3 md:p-4 rounded-3xl shadow-xl"
            style={{
              gridTemplateColumns: `repeat(${puzzle.cols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${puzzle.rows}, minmax(0, 1fr))`,
            }}
          >
            {puzzle.bitmap.map((rowStr, r) =>
              rowStr.split('').map((bit, c) => {
                const key = `${r}-${c}`;
                if (bit !== '1') {
                  return <div key={key} className={cellSize} />;
                }
                if (key === puzzle.givenKey) {
                  return (
                    <div
                      key={key}
                      className={`${cellSize} rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg`}
                    >
                      <span className={`${fontSize} font-black text-white drop-shadow-lg`}>
                        {puzzle.values[key]}
                      </span>
                    </div>
                  );
                }
                return (
                  <input
                    key={key}
                    type="text"
                    inputMode="numeric"
                    value={inputs[key] || ''}
                    onChange={e => handleInputChange(key, e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && allFilled && checkAnswers()}
                    className={`${cellSize} ${fontSize} text-center font-bold rounded-xl border-2 outline-none transition-all ${cellClasses(key)}`}
                    placeholder="?"
                  />
                );
              })
            )}
          </div>
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

        {checked && Object.values(results).some(r => r !== 'correct') && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-4 text-red-500 font-medium"
          >
            Not quite right — check the highlighted squares and try again! 💪
          </motion.p>
        )}

        <div className="text-center mt-6 text-gray-500 text-sm">
          Attempts: {attempts} &nbsp;•&nbsp; Shape: <b>{shapeId === 'CROSS' ? 'Plus' : `Letter ${shapeId}`}</b>
          &nbsp;•&nbsp; Practicing block: <b>{currentBlock.label}</b>
        </div>
      </div>
    </div>
  );
}
