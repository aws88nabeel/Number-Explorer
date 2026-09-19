# 🔢 Number Explorer - Interactive 3D Numbers Chart for Kids

An immersive, interactive 3D numbers chart designed to help young learners understand numbers from 1 to 1000. Built with React, TypeScript, and Tailwind CSS, this educational tool makes learning numbers engaging and fun!

![Number Explorer](https://img.shields.io/badge/Educational-Numbers%20To%201000-blue)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)

---

## 🎯 Overview

Number Explorer is a visually engaging educational application that helps children master number recognition, counting, and numerical patterns. Through interactive 3D-styled number blocks, audio pronunciation, and pattern discovery modes, children can explore numbers from 1 to 1000 in a playful, intuitive environment.

Online Game : [https://number-explorer-grjg.arcada.app](https://kn3g8e-pacucjl7h-arcadawebapps6.vercel.app/) 
---

## ✨ Features

### 📚 Progressive Learning Levels
The app is structured into five progressive levels to match different learning stages:

| Level | Range | Description |
|-------|-------|-------------|
| **Number Friends** | 1-10 | Foundation level with large, friendly blocks for beginners |
| **Teen Adventures** | 11-20 | Explore and master the tricky teen numbers |
| **Tens Journey** | 1-100 | Classic hundreds chart for developing number sense |
| **Hundreds Quest** | 100-500 | Discover the patterns in hundreds |
| **Big Numbers** | 500-1000 | Conquer numbers up to one thousand |

### 🎨 Interactive 3D Visual Design
- **Rainbow-colored number blocks** - Each number has a unique color based on its value
- **3D CSS transforms** - Blocks respond to hover with rotation and scaling effects
- **Animated backgrounds** - Floating, colorful shapes create an engaging atmosphere
- **Celebration animations** - Confetti effects for milestones (10, 50, 100, etc.)

### 🔊 Audio Learning
- **Text-to-Speech pronunciation** - Tap any number to hear it spoken aloud
- **Child-friendly voice settings** - Slower rate and higher pitch for clarity
- **Toggle sound on/off** - Easy control for quiet environments

### 🧩 Pattern Discovery Mode
Children can visualize mathematical patterns by highlighting:

| Pattern | Color | Educational Value |
|---------|-------|-------------------|
| **Even Numbers** | Blue | Understanding divisibility by 2 |
| **Odd Numbers** | Purple | Recognizing alternating patterns |
| **Prime Numbers** | Yellow | Identifying numbers with only 2 factors |
| **Count by 5s** | Green | Skip counting practice |
| **Count by 10s** | Orange | Place value understanding |
| **Square Numbers** | Pink | Introduction to multiplication concepts |

### 📊 Interactive Number Details
Tapping any number reveals a detailed modal with:
- Large number display with gradient coloring
- Written word form (e.g., "Twenty-three")
- Mathematical properties (even, odd, prime, multiples)
- Fun facts about the number
- "Say It" button for audio pronunciation

### 🏆 Progress Tracking
- **Stars on visited numbers** - Visual indication of explored numbers
- **Progress counter** - Shows total numbers explored
- **Achievement badges** - Unlock "Explorer" badge after exploring 10 numbers

---

## 🎓 Educational Benefits

### For Students

1. **Number Recognition**
   - Visual association between numerals and quantities
   - Color-coded blocks help distinguish between numbers
   - Written word forms reinforce reading skills

2. **Counting Skills**
   - Sequential counting from 1 to 1000
   - Skip counting patterns (by 5s, 10s)
   - Understanding number sequences

3. **Mathematical Concepts**
   - **Even/Odd numbers** - Foundation for division
   - **Prime numbers** - Introduction to factors
   - **Square numbers** - Early multiplication concepts
   - **Place value** - Understanding hundreds and thousands

4. **Pattern Recognition**
   - Visual patterns in the hundreds chart
   - Number relationships and sequences
   - Predicting "what comes next"

5. **Auditory Learning**
   - Correct pronunciation of numbers
   - Reinforcement through multiple senses
   - Support for different learning styles

6. **Engagement & Motivation**
   - Gamified elements (achievements, celebrations)
   - Self-paced exploration
   - Immediate feedback on interactions

### For Teachers & Parents

- **Free exploration** - Children learn at their own pace
- **No wrong answers** - Encourages curiosity without pressure
- **Visual differentiation** - Patterns help explain abstract concepts
- **Accessible design** - Works on tablets, phones, and computers
- **No login required** - Start learning immediately

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/aws88nabeel/number-explorer.git

# Navigate to project directory
cd number-explorer

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework |
| **TypeScript** | Type-safe development |
| **Tailwind CSS 4** | Styling and responsive design |
| **Framer Motion** | Animations and transitions |
| **Lucide React** | Beautiful icons |
| **React Router** | Navigation between levels |
| **Vite** | Fast build tool |
| **Web Speech API** | Text-to-speech pronunciation |

---

## 📱 Responsive Design

Number Explorer is fully responsive and optimized for:

- 📱 **Mobile phones** - Touch-friendly, large tap targets
- 📟 **Tablets** - Perfect for young learners
- 💻 **Desktop computers** - Full-featured experience
- 🖥️ **Interactive whiteboards** - Great for classroom use

---

## 🎮 How to Use

1. **Select a Level** - Start with "Number Friends" (1-10) for beginners
2. **Explore Numbers** - Tap or click any number block
3. **Listen & Learn** - Hear the number pronounced
4. **Discover Properties** - See if it's even, odd, prime, etc.
5. **Find Patterns** - Use the pattern buttons to highlight number types
6. **Track Progress** - Watch your exploration count grow!

---

## 📖 Learning Activities

### Suggested Activities for Teachers

1. **Number Hunt** - Ask students to find specific numbers
2. **Pattern Walk** - Use pattern modes to discuss even/odd, primes
3. **Counting Challenge** - Count by 5s or 10s using the highlight feature
4. **Number Stories** - Read the fun facts and create stories around them
5. **Before & After** - Practice "what comes before/after" questions

### Suggested Activities for Parents

1. **Daily Number** - Explore one number each day
2. **Sound Match** - Say the number, then tap to check
3. **Color Patterns** - Discuss why numbers have different colors
4. **Milestone Celebrations** - Celebrate when reaching 10, 50, 100!

---

## 🔧 Configuration

The app uses environment variables for Supabase (optional, for future features):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

---

## 🙏 Acknowledgments

Built with love for young learners everywhere. Special thanks to:
- The React team for an amazing framework
- Tailwind CSS for beautiful styling
- Framer Motion for smooth animations
- Lucide for the beautiful icons

---

**Made with ❤️ for education**
