export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  registeredDate: string;
  totalEarnings: number;
  puzzlesCreated: number;
  puzzlesSolved: number;
}

export interface Puzzle {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  creatorId: string;
  creatorName: string;
  question: string;
  answer: string;
  reward: number;
  createdDate: string;
  solveCount: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  imageUrl: string;
}

export interface Earning {
  id: string;
  userId: string;
  userName: string;
  type: "puzzle_created" | "puzzle_solved";
  amount: number;
  date: string;
  puzzleTitle: string;
}

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "user",
    registeredDate: "2026-01-15",
    totalEarnings: 245.5,
    puzzlesCreated: 12,
    puzzlesSolved: 34,
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    role: "user",
    registeredDate: "2026-01-20",
    totalEarnings: 189.25,
    puzzlesCreated: 8,
    puzzlesSolved: 28,
  },
  {
    id: "3",
    name: "Carol White",
    email: "carol@example.com",
    role: "user",
    registeredDate: "2026-02-01",
    totalEarnings: 312.75,
    puzzlesCreated: 15,
    puzzlesSolved: 42,
  },
  {
    id: "4",
    name: "David Brown",
    email: "david@example.com",
    role: "user",
    registeredDate: "2026-02-10",
    totalEarnings: 156.0,
    puzzlesCreated: 5,
    puzzlesSolved: 21,
  },
  {
    id: "admin",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    registeredDate: "2026-01-01",
    totalEarnings: 0,
    puzzlesCreated: 0,
    puzzlesSolved: 0,
  },
];

export const mockPuzzles: Puzzle[] = [
  {
    id: "1",
    title: "The Missing Number",
    description: "Find the missing number in the sequence",
    difficulty: "easy",
    category: "Math",
    creatorId: "1",
    creatorName: "Alice Johnson",
    question:
      "What is the missing number in this sequence: 2, 4, 6, ?, 10, 12",
    answer: "8",
    reward: 5.0,
    createdDate: "2026-02-20",
    solveCount: 45,
  },
  {
    id: "2",
    title: "Word Riddle",
    description: "Solve this tricky word puzzle",
    difficulty: "medium",
    category: "Riddle",
    creatorId: "2",
    creatorName: "Bob Smith",
    question:
      "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
    answer: "echo",
    reward: 10.0,
    createdDate: "2026-02-22",
    solveCount: 32,
  },
  {
    id: "3",
    title: "Logic Challenge",
    description: "Test your logical thinking",
    difficulty: "hard",
    category: "Logic",
    creatorId: "3",
    creatorName: "Carol White",
    question:
      "If five cats can catch five mice in five minutes, how many cats does it take to catch 100 mice in 100 minutes?",
    answer: "5",
    reward: 15.0,
    createdDate: "2026-02-23",
    solveCount: 18,
  },
  {
    id: "4",
    title: "Pattern Recognition",
    description: "Identify the pattern",
    difficulty: "medium",
    category: "Pattern",
    creatorId: "1",
    creatorName: "Alice Johnson",
    question: "What comes next in the pattern: A, C, F, J, ?",
    answer: "O",
    reward: 8.0,
    createdDate: "2026-02-24",
    solveCount: 27,
  },
  {
    id: "5",
    title: "Math Brain Teaser",
    description: "Quick mental math challenge",
    difficulty: "easy",
    category: "Math",
    creatorId: "4",
    creatorName: "David Brown",
    question:
      "If you multiply all the numbers on a telephone keypad (0-9), what is the result?",
    answer: "0",
    reward: 5.0,
    createdDate: "2026-02-25",
    solveCount: 52,
  },
];

export const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Welcome to PuzzleHub: Where Creativity Meets Challenges",
    excerpt:
      "Discover how our platform connects puzzle creators and solvers from around the world.",
    content: `Welcome to PuzzleHub, the premier platform for puzzle enthusiasts! Whether you're a creative mind who loves crafting brain teasers or someone who enjoys the thrill of solving them, this is the place for you.

Our mission is simple: create a vibrant community where puzzle creators can showcase their talents and earn rewards, while puzzle solvers can challenge themselves and also earn by demonstrating their skills.

What makes PuzzleHub unique?

1. **Earn While You Play**: Both creators and solvers earn money for their contributions
2. **Diverse Categories**: From math puzzles to riddles, logic challenges to pattern recognition
3. **Fair Rewards System**: Transparent payment structure based on puzzle difficulty and engagement
4. **Community-Driven**: User ratings and feedback help surface the best content

Join us today and become part of a growing community of puzzle enthusiasts!`,
    author: "PuzzleHub Team",
    date: "2026-02-15",
    imageUrl: "",
  },
  {
    id: "2",
    title: "Tips for Creating Engaging Puzzles",
    excerpt: "Learn the secrets to crafting puzzles that challenge and delight solvers.",
    content: `Creating great puzzles is an art form. Here are some tips to help you craft engaging challenges that will attract solvers:

**1. Start with a Clear Concept**
Every great puzzle begins with a clear idea. What skill are you testing? What insight do you want solvers to discover?

**2. Balance Difficulty**
Too easy and it's boring. Too hard and it's frustrating. Aim for that sweet spot where solvers feel challenged but not defeated.

**3. Test Your Puzzle**
Before publishing, test your puzzle with friends or family. Fresh eyes often catch ambiguities you might have missed.

**4. Write Clear Instructions**
Ambiguous wording leads to frustration. Be precise about what you're asking.

**5. Consider Multiple Solutions**
Sometimes the best puzzles have elegant solutions that surprise you. Be open to alternative answers.

Happy puzzle creating!`,
    author: "Alice Johnson",
    date: "2026-02-18",
    imageUrl: "",
  },
  {
    id: "3",
    title: "How Our Earning System Works",
    excerpt: "Understand how creators and solvers get rewarded on PuzzleHub.",
    content: `Transparency is important to us. Here's exactly how our earning system works:

**For Puzzle Creators:**
- Base reward for each approved puzzle: $5-$20 based on difficulty
- Bonus rewards when your puzzle gets solved
- Monthly bonuses for top-rated puzzles
- Popularity multipliers for highly engaged content

**For Puzzle Solvers:**
- Earn a percentage of the puzzle's reward pool for correct solutions
- First solvers get bonus rewards
- Streak bonuses for consecutive days of solving
- Leaderboard prizes for top performers

**How We Fund This:**
Our platform is supported by strategically placed advertisements and premium memberships. A portion of this revenue goes directly back to our community of creators and solvers.

**Payment Schedule:**
Earnings are calculated weekly and paid out monthly via your preferred payment method. Minimum payout threshold is $25.

Start creating or solving today and watch your earnings grow!`,
    author: "PuzzleHub Team",
    date: "2026-02-20",
    imageUrl: "",
  },
];

export const mockEarnings: Earning[] = [
  { id: "1", userId: "1", userName: "Alice Johnson", type: "puzzle_created", amount: 15.0, date: "2026-02-20", puzzleTitle: "The Missing Number" },
  { id: "2", userId: "2", userName: "Bob Smith", type: "puzzle_solved", amount: 8.5, date: "2026-02-21", puzzleTitle: "Word Riddle" },
  { id: "3", userId: "3", userName: "Carol White", type: "puzzle_created", amount: 20.0, date: "2026-02-22", puzzleTitle: "Logic Challenge" },
  { id: "4", userId: "1", userName: "Alice Johnson", type: "puzzle_solved", amount: 12.0, date: "2026-02-23", puzzleTitle: "Pattern Recognition" },
  { id: "5", userId: "4", userName: "David Brown", type: "puzzle_created", amount: 10.0, date: "2026-02-24", puzzleTitle: "Math Brain Teaser" },
];

let currentUser: User | null = null;

function loadFromStorage() {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem("currentUser");
    return saved ? (JSON.parse(saved) as User) : null;
  } catch {
    return null;
  }
}

export function getCurrentUser(): User | null {
  if (typeof window !== "undefined" && currentUser === null) {
    currentUser = loadFromStorage();
  }
  return currentUser;
}

export function setCurrentUser(user: User | null) {
  currentUser = user;
  if (typeof window !== "undefined") {
    if (user) localStorage.setItem("currentUser", JSON.stringify(user));
    else localStorage.removeItem("currentUser");
  }
}

export function isAdmin(): boolean {
  return getCurrentUser()?.role === "admin";
}
