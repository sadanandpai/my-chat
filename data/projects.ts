export type ProjectRecord = {
  name: string;
  /** Alternate names / short names for fuzzy lookup. */
  aliases: string[];
  repo: string;
  homepage?: string;
  description: string;
  tech: string[];
  /** Approximate GitHub stars (static snapshot; not live). */
  starsApprox: number;
  highlights?: string;
  notes?: string;
};

/** Notable open-source projects by Sadanand Pai (GitHub: sadanandpai). */
export const projects: ProjectRecord[] = [
  {
    name: "Frontend Learning Kit",
    aliases: [
      "frontend-learning-kit",
      "frontend learning kit",
      "FLK",
      "frontend tech guide",
    ],
    repo: "https://github.com/sadanandpai/frontend-learning-kit",
    description:
      "Frontend tech guide and curated collection of frontend learning materials covering HTML, CSS, JavaScript, React, Angular, Vue, and interview prep.",
    tech: ["Markdown", "frontend learning resources"],
    starsApprox: 4700,
    highlights:
      "Most-starred repo; widely used as a frontend roadmap / resource kit.",
    notes:
      "Curated guide rather than an app. Topics include Angular, CSS, React, Vue, web development, and interview preparation.",
  },
  {
    name: "JavaScript Code Challenges",
    aliases: [
      "javascript-code-challenges",
      "JS code challenges",
      "JS challenges",
      "javascript interview questions",
      "jscodechallenges",
    ],
    repo: "https://github.com/sadanandpai/javascript-code-challenges",
    homepage: "https://jscodechallenges.vercel.app",
    description:
      "Collection of modern JavaScript interview code challenges for beginners to experts — a question bank built after Flipkart/Typeset interview learnings.",
    tech: ["MDX", "TypeScript", "JavaScript", "CSS"],
    starsApprox: 4500,
    highlights:
      "First community-focused repo; ~180+ questions; 1000+ stars in the first week; trending on GitHub for a couple of days.",
    notes:
      "Built over ~3 months to curate JS interview questions in one place. Great learning experience for JS concepts and techniques.",
  },
  {
    name: "Frontend Mini Challenges",
    aliases: [
      "frontend-mini-challenges",
      "frontend mini challenges",
      "mini challenges",
      "FMC",
    ],
    repo: "https://github.com/sadanandpai/frontend-mini-challenges",
    homepage: "https://sadanandpai.github.io/frontend-mini-challenges/",
    description:
      "Hands-on collection of frontend challenges for learning and interviews (HTML, CSS, JavaScript, and framework variants).",
    tech: ["JavaScript", "TypeScript", "CSS", "HTML", "Vue"],
    starsApprox: 2400,
    highlights:
      "Popular practice playground for interview-style UI challenges.",
  },
  {
    name: "Resume Builder",
    aliases: ["resume-builder", "e-resume", "eresume", "custom resume builder"],
    repo: "https://github.com/sadanandpai/resume-builder",
    homepage: "https://e-resume.vercel.app",
    description:
      "Build a standard, professional single-page resume in the browser.",
    tech: ["TypeScript", "React", "Next.js", "CSS"],
    starsApprox: 1200,
    highlights:
      "Used his own custom resume builder when applying out of Trelleborg (including Flipkart shortlist).",
    notes: "Also known as e-resume.",
  },
  {
    name: "Algo Visualizers",
    aliases: [
      "algo-visualizers",
      "algo visualizers",
      "Sorting Visualizers",
      "sorting visualizer",
      "path finder",
      "maze generator",
      "algorithm visualizer",
    ],
    repo: "https://github.com/sadanandpai/algo-visualizers",
    homepage: "https://sadanandpai.github.io/algo-visualizers/",
    description:
      "Interactive algorithm visualizers: sorting visualizers, path finders, and maze generators — built while learning DSA at CoinDCX.",
    tech: ["React", "TypeScript", "Redux Toolkit", "SCSS"],
    starsApprox: 700,
    highlights:
      "Shared on social media → ~8000+ likes and 1M+ views. Started as Sorting Visualizers; later added path finder and maze generators.",
  },
  {
    name: "Git Guide",
    aliases: ["git-guide", "git guide", "everyday git"],
    repo: "https://github.com/sadanandpai/git-guide",
    description: "Practical guide to everyday Git commands for real workflows.",
    tech: ["Markdown", "Git"],
    starsApprox: 600,
    notes: "Covers Git, GitHub, GitLab, Bitbucket, and pull-request workflows.",
  },
  {
    name: "DSA Interview Challenges",
    aliases: [
      "dsa-interview-challenges",
      "DSA challenges",
      "DSA interview",
      "data structures interview",
    ],
    repo: "https://github.com/sadanandpai/dsa-interview-challenges",
    homepage: "https://dsa-interview-challenges.vercel.app",
    description:
      "Curated data structures and algorithms problems with JavaScript solutions for engineering interviews.",
    tech: ["MDX", "TypeScript", "JavaScript"],
    starsApprox: 400,
    notes:
      "LeetCode-style DSA prep focused on frontend/engineering interviews.",
  },
  {
    name: "ClearFrontend",
    aliases: ["clearfrontend", "clear frontend"],
    repo: "https://github.com/sadanandpai/clearfrontend",
    homepage: "https://clearfrontend.vercel.app",
    description: "Frontend learning / practice project hosted as a web app.",
    tech: ["TypeScript", "SCSS", "JavaScript", "CSS"],
    starsApprox: 200,
  },
  {
    name: "AI Learning Kit",
    aliases: [
      "ai-learning-kit",
      "AI learning kit",
      "AI kit",
      "ML learning kit",
    ],
    repo: "https://github.com/sadanandpai/ai-learning-kit",
    description:
      "Curated collection of AI learning materials spanning ML, deep learning, LLMs, and generative AI.",
    tech: ["Markdown", "AI / ML learning resources"],
    starsApprox: 160,
    notes:
      "Topics include machine learning, deep learning, generative AI, LLMs, MLOps, PyTorch, TensorFlow, NumPy, pandas.",
  },
  {
    name: "Sudoku Solver",
    aliases: ["sudoku-solver", "sudoku"],
    repo: "https://github.com/sadanandpai/sudoku-solver",
    homepage: "https://sadanandpai.github.io/sudoku-solver/dist/",
    description: "Sudoku solver demo using backtracking.",
    tech: ["JavaScript", "TypeScript", "SolidJS", "CSS", "HTML"],
    starsApprox: 66,
  },
  {
    name: "ML Mini Challenges",
    aliases: [
      "ml-mini-challenges",
      "ML mini challenges",
      "machine learning challenges",
    ],
    repo: "https://github.com/sadanandpai/ml-mini-challenges",
    homepage: "https://sadanandpai.github.io/ml-mini-challenges/",
    description: "Collection of machine learning / AI mini challenges.",
    tech: ["TypeScript", "CSS", "HTML"],
    starsApprox: 2,
  },
];
