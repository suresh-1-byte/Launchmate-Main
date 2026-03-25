// ============================================================
// LAUNCHMATE LEARNING MODULE — STATIC DATA
// All career roadmaps, resources, interview prep, practice links
// ============================================================

export interface Resource {
    id: string;
    title: string;
    url: string;
    type: "article" | "video" | "course" | "practice" | "interview";
    isFree: boolean;
    platform?: string;
}

export interface Topic {
    id: string;
    title: string;
    description: string;
    duration: string;
    videoId?: string; // YouTube video ID
    resources: Resource[];
    practiceLinks?: { title: string; url: string; platform: string }[];
}

export interface RoadmapModule {
    id: string;
    title: string;
    level: "beginner" | "intermediate" | "advanced";
    duration: string;
    topics: Topic[];
}

export interface CareerPath {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    gradient: string;
    skills: string[];
    avgSalary: string;
    jobRoles: string[];
    modules: RoadmapModule[];
    interviewPrep: {
        technical: { q: string; a: string }[];
        hr: { q: string; a: string }[];
        resumeTips: string[];
        projectIdeas: string[];
    };
    practicePlatforms: { name: string; url: string; description: string; icon: string }[];
}

export const CAREER_PATHS: CareerPath[] = [
    {
        id: "software-developer",
        title: "Software Developer",
        description: "Master full-stack development, DSA, system design and land your dream SDE role",
        icon: "💻",
        color: "#6366f1",
        gradient: "from-indigo-500 to-purple-600",
        skills: ["DSA", "Java/Python/C++", "System Design", "Git", "SQL", "OS Concepts"],
        avgSalary: "₹6–25 LPA",
        jobRoles: ["SDE-1", "Backend Developer", "Full Stack Developer", "Software Engineer"],
        practicePlatforms: [
            { name: "LeetCode", url: "https://leetcode.com", description: "DSA problems & contests", icon: "🟡" },
            { name: "GeeksforGeeks", url: "https://geeksforgeeks.org", description: "Theory + practice problems", icon: "🟢" },
            { name: "HackerRank", url: "https://hackerrank.com", description: "Coding challenges & certifications", icon: "🟢" },
            { name: "Codeforces", url: "https://codeforces.com", description: "Competitive programming", icon: "🔵" },
            { name: "InterviewBit", url: "https://interviewbit.com", description: "Interview-focused DSA", icon: "🔴" },
            { name: "CodeChef", url: "https://codechef.com", description: "Competitive coding contests", icon: "🟤" },
        ],
        modules: [
            {
                id: "sd-m1",
                title: "Programming Fundamentals",
                level: "beginner",
                duration: "4 weeks",
                topics: [
                    {
                        id: "sd-t1",
                        title: "Choose Your Language (Java / Python / C++)",
                        description: "Pick one language and master its syntax, OOP concepts, and standard library",
                        duration: "1 week",
                        videoId: "eIrMbAQSU34",
                        resources: [
                            { id: "r1", title: "Java Full Course – FreeCodeCamp", url: "https://www.youtube.com/watch?v=eIrMbAQSU34", type: "video", isFree: true, platform: "YouTube" },
                            { id: "r2", title: "Python for Beginners – CS50", url: "https://cs50.harvard.edu/python/", type: "course", isFree: true, platform: "Harvard" },
                            { id: "r3", title: "C++ Tutorial – GeeksforGeeks", url: "https://www.geeksforgeeks.org/c-plus-plus/", type: "article", isFree: true, platform: "GFG" },
                        ],
                    },
                    {
                        id: "sd-t2",
                        title: "Data Structures Basics",
                        description: "Arrays, Strings, Linked Lists, Stacks, Queues",
                        duration: "2 weeks",
                        videoId: "RBSGKlAvoiM",
                        resources: [
                            { id: "r4", title: "Data Structures – Full Course (FreeCodeCamp)", url: "https://www.youtube.com/watch?v=RBSGKlAvoiM", type: "video", isFree: true, platform: "YouTube" },
                            { id: "r5", title: "DSA Roadmap – Striver's Sheet", url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/", type: "course", isFree: true, platform: "TakeUForward" },
                            { id: "r6", title: "LeetCode Easy Problems", url: "https://leetcode.com/problemset/?difficulty=EASY", type: "practice", isFree: true, platform: "LeetCode" },
                        ],
                        practiceLinks: [
                            { title: "Array Problems – LeetCode", url: "https://leetcode.com/tag/array/", platform: "LeetCode" },
                            { title: "String Problems – HackerRank", url: "https://www.hackerrank.com/domains/algorithms?filters%5Bsubdomains%5D%5B%5D=strings", platform: "HackerRank" },
                        ],
                    },
                    {
                        id: "sd-t3",
                        title: "OOP Concepts",
                        description: "Classes, Objects, Inheritance, Polymorphism, Encapsulation, Abstraction",
                        duration: "1 week",
                        videoId: "pTB0EiLXUC8",
                        resources: [
                            { id: "r7", title: "OOP in Java – Kunal Kushwaha", url: "https://www.youtube.com/watch?v=BSVKUk58K6U", type: "video", isFree: true, platform: "YouTube" },
                            { id: "r8", title: "OOP Concepts – GFG", url: "https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/", type: "article", isFree: true, platform: "GFG" },
                        ],
                    },
                ],
            },
            {
                id: "sd-m2",
                title: "Advanced DSA & Algorithms",
                level: "intermediate",
                duration: "8 weeks",
                topics: [
                    {
                        id: "sd-t4",
                        title: "Trees & Graphs",
                        description: "Binary Trees, BST, DFS, BFS, Shortest Path algorithms",
                        duration: "2 weeks",
                        videoId: "fAAZixBzIAI",
                        resources: [
                            { id: "r9", title: "Trees Playlist – Striver", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0q8Hkd7bK2Bpryj2xVJk8Vk", type: "video", isFree: true, platform: "YouTube" },
                            { id: "r10", title: "Graph Algorithms – Abdul Bari", url: "https://www.youtube.com/watch?v=0sYCCpNd-fY", type: "video", isFree: true, platform: "YouTube" },
                            { id: "r11", title: "Tree Problems – LeetCode", url: "https://leetcode.com/tag/tree/", type: "practice", isFree: true, platform: "LeetCode" },
                        ],
                    },
                    {
                        id: "sd-t5",
                        title: "Dynamic Programming",
                        description: "Memoization, Tabulation, Classic DP patterns",
                        duration: "3 weeks",
                        videoId: "oBt53YbR9Kk",
                        resources: [
                            { id: "r12", title: "DP Playlist – Aditya Verma", url: "https://www.youtube.com/playlist?list=PL_z_8CaSLPWekqhdCPmFohncHwz8TY2Go", type: "video", isFree: true, platform: "YouTube" },
                            { id: "r13", title: "DP Problems – LeetCode", url: "https://leetcode.com/tag/dynamic-programming/", type: "practice", isFree: true, platform: "LeetCode" },
                            { id: "r14", title: "DP Patterns – GFG", url: "https://www.geeksforgeeks.org/dynamic-programming/", type: "article", isFree: true, platform: "GFG" },
                        ],
                    },
                    {
                        id: "sd-t6",
                        title: "Sorting, Searching & Recursion",
                        description: "Quick Sort, Merge Sort, Binary Search, Backtracking",
                        duration: "2 weeks",
                        videoId: "kgBjXUE_Nwc",
                        resources: [
                            { id: "r15", title: "Sorting Algorithms Visualized", url: "https://visualgo.net/en/sorting", type: "article", isFree: true, platform: "VisuAlgo" },
                            { id: "r16", title: "Binary Search – Striver", url: "https://www.youtube.com/watch?v=W9QJ8HaRvJQ", type: "video", isFree: true, platform: "YouTube" },
                        ],
                    },
                ],
            },
            {
                id: "sd-m3",
                title: "System Design & CS Fundamentals",
                level: "advanced",
                duration: "6 weeks",
                topics: [
                    {
                        id: "sd-t7",
                        title: "Operating Systems",
                        description: "Processes, Threads, Memory Management, Deadlocks, Scheduling",
                        duration: "2 weeks",
                        videoId: "vBURTt97EkA",
                        resources: [
                            { id: "r17", title: "OS Concepts – Gate Smashers", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p", type: "video", isFree: true, platform: "YouTube" },
                            { id: "r18", title: "OS Notes – GFG", url: "https://www.geeksforgeeks.org/operating-systems/", type: "article", isFree: true, platform: "GFG" },
                        ],
                    },
                    {
                        id: "sd-t8",
                        title: "System Design Basics",
                        description: "Scalability, Load Balancing, Caching, Databases, Microservices",
                        duration: "3 weeks",
                        videoId: "xpDnVSmNFX0",
                        resources: [
                            { id: "r19", title: "System Design Primer – GitHub", url: "https://github.com/donnemartin/system-design-primer", type: "article", isFree: true, platform: "GitHub" },
                            { id: "r20", title: "System Design Interview – Gaurav Sen", url: "https://www.youtube.com/playlist?list=PLMCXHnjXnTnvo6alSjVkgxV-VH6EPyvoX", type: "video", isFree: true, platform: "YouTube" },
                            { id: "r21", title: "High Level Design – Concept & Coding", url: "https://www.youtube.com/playlist?list=PL6W8uoQQ2c61X_9e6Net0WdYZidm7zooW", type: "video", isFree: true, platform: "YouTube" },
                        ],
                    },
                ],
            },
        ],
        interviewPrep: {
            technical: [
                { q: "What is the difference between Array and LinkedList?", a: "Arrays have O(1) random access but O(n) insertion. LinkedLists have O(n) access but O(1) insertion at head. Arrays use contiguous memory; LinkedLists use pointers." },
                { q: "Explain time and space complexity with Big O notation", a: "Big O describes worst-case performance. O(1) = constant, O(log n) = logarithmic, O(n) = linear, O(n²) = quadratic. Space complexity measures memory usage." },
                { q: "What is a Hash Map and how does it work?", a: "A HashMap stores key-value pairs using a hash function to map keys to array indices. Average O(1) for get/put. Collisions handled via chaining or open addressing." },
                { q: "Explain OOP principles with examples", a: "Encapsulation (hiding data), Inheritance (extending classes), Polymorphism (same method, different behavior), Abstraction (hiding implementation details)." },
                { q: "What is the difference between Stack and Queue?", a: "Stack is LIFO (Last In First Out) - used in function calls, undo operations. Queue is FIFO (First In First Out) - used in BFS, scheduling." },
            ],
            hr: [
                { q: "Tell me about yourself", a: "Start with your education, mention key projects/internships, highlight relevant skills, and end with why you're excited about this role." },
                { q: "Why do you want to join our company?", a: "Research the company beforehand. Mention their products, culture, growth opportunities, and how your skills align with their mission." },
                { q: "Where do you see yourself in 5 years?", a: "Show ambition but be realistic. Mention growing technically, taking on more responsibility, and contributing to impactful projects." },
                { q: "What is your greatest weakness?", a: "Choose a real weakness you're actively working on. Show self-awareness and the steps you're taking to improve." },
            ],
            resumeTips: [
                "Use action verbs: Built, Designed, Implemented, Optimized, Led",
                "Quantify achievements: 'Reduced load time by 40%' not 'improved performance'",
                "Keep it 1 page for freshers, use ATS-friendly format",
                "List projects with GitHub links and tech stack used",
                "Include competitive programming ratings (LeetCode, Codeforces)",
                "Mention CGPA only if above 7.5",
            ],
            projectIdeas: [
                "URL Shortener with analytics dashboard",
                "Real-time chat application using WebSockets",
                "E-commerce platform with payment integration",
                "Task management app with drag-and-drop",
                "Blog platform with markdown editor",
                "Weather app with location-based forecasts",
            ],
        },
    },
    {
        id: "data-science",
        title: "Data Science / AI",
        description: "From Python basics to ML models, deep learning, and AI applications",
        icon: "🤖",
        color: "#f59e0b",
        gradient: "from-amber-500 to-orange-600",
        skills: ["Python", "Statistics", "Machine Learning", "Deep Learning", "SQL", "Data Visualization"],
        avgSalary: "₹7–30 LPA",
        jobRoles: ["Data Scientist", "ML Engineer", "AI Researcher", "Data Analyst"],
        practicePlatforms: [
            { name: "Kaggle", url: "https://kaggle.com", description: "ML competitions & datasets", icon: "🔵" },
            { name: "Google Colab", url: "https://colab.research.google.com", description: "Free GPU for ML experiments", icon: "🟡" },
            { name: "HuggingFace", url: "https://huggingface.co", description: "Pre-trained models & datasets", icon: "🟤" },
            { name: "DataCamp", url: "https://datacamp.com", description: "Interactive data science courses", icon: "🟢" },
        ],
        modules: [
            {
                id: "ds-m1",
                title: "Python & Statistics Foundation",
                level: "beginner",
                duration: "4 weeks",
                topics: [
                    {
                        id: "ds-t1",
                        title: "Python for Data Science",
                        description: "NumPy, Pandas, Matplotlib, Seaborn",
                        duration: "2 weeks",
                        videoId: "LHBE6Q9XlzI",
                        resources: [
                            { id: "ds-r1", title: "Python for Data Science – FreeCodeCamp", url: "https://www.youtube.com/watch?v=LHBE6Q9XlzI", type: "video", isFree: true, platform: "YouTube" },
                            { id: "ds-r2", title: "Kaggle Python Course", url: "https://www.kaggle.com/learn/python", type: "course", isFree: true, platform: "Kaggle" },
                            { id: "ds-r3", title: "Pandas Documentation", url: "https://pandas.pydata.org/docs/", type: "article", isFree: true, platform: "Official" },
                        ],
                    },
                    {
                        id: "ds-t2",
                        title: "Statistics & Probability",
                        description: "Descriptive stats, distributions, hypothesis testing, correlation",
                        duration: "2 weeks",
                        videoId: "xxpc-HPKN28",
                        resources: [
                            { id: "ds-r4", title: "Statistics for Data Science – StatQuest", url: "https://www.youtube.com/playlist?list=PLblh5JKOoLUK0FLuzwntyYI10UQFUhsY9", type: "video", isFree: true, platform: "YouTube" },
                            { id: "ds-r5", title: "Khan Academy Statistics", url: "https://www.khanacademy.org/math/statistics-probability", type: "course", isFree: true, platform: "Khan Academy" },
                        ],
                    },
                ],
            },
            {
                id: "ds-m2",
                title: "Machine Learning",
                level: "intermediate",
                duration: "8 weeks",
                topics: [
                    {
                        id: "ds-t3",
                        title: "Supervised Learning",
                        description: "Linear Regression, Logistic Regression, Decision Trees, Random Forest, SVM",
                        duration: "3 weeks",
                        videoId: "NWONeJKn9Kc",
                        resources: [
                            { id: "ds-r6", title: "ML Course – Andrew Ng (Coursera)", url: "https://www.coursera.org/learn/machine-learning", type: "course", isFree: true, platform: "Coursera" },
                            { id: "ds-r7", title: "Scikit-learn Tutorials", url: "https://scikit-learn.org/stable/tutorial/", type: "article", isFree: true, platform: "Official" },
                            { id: "ds-r8", title: "Kaggle ML Micro-Courses", url: "https://www.kaggle.com/learn", type: "course", isFree: true, platform: "Kaggle" },
                        ],
                    },
                    {
                        id: "ds-t4",
                        title: "Deep Learning & Neural Networks",
                        description: "ANN, CNN, RNN, LSTM, Transformers",
                        duration: "4 weeks",
                        videoId: "aircAruvnKk",
                        resources: [
                            { id: "ds-r9", title: "Neural Networks – 3Blue1Brown", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi", type: "video", isFree: true, platform: "YouTube" },
                            { id: "ds-r10", title: "Deep Learning Specialization – Coursera", url: "https://www.coursera.org/specializations/deep-learning", type: "course", isFree: true, platform: "Coursera" },
                            { id: "ds-r11", title: "Fast.ai Practical Deep Learning", url: "https://course.fast.ai/", type: "course", isFree: true, platform: "Fast.ai" },
                        ],
                    },
                ],
            },
            {
                id: "ds-m3",
                title: "Advanced AI & Deployment",
                level: "advanced",
                duration: "6 weeks",
                topics: [
                    {
                        id: "ds-t5",
                        title: "NLP & Large Language Models",
                        description: "Text processing, BERT, GPT, HuggingFace Transformers",
                        duration: "3 weeks",
                        videoId: "CMrHM8a3hqw",
                        resources: [
                            { id: "ds-r12", title: "HuggingFace NLP Course", url: "https://huggingface.co/learn/nlp-course/", type: "course", isFree: true, platform: "HuggingFace" },
                            { id: "ds-r13", title: "LLM Bootcamp – Full Stack Deep Learning", url: "https://fullstackdeeplearning.com/llm-bootcamp/", type: "course", isFree: true, platform: "FSDL" },
                        ],
                    },
                ],
            },
        ],
        interviewPrep: {
            technical: [
                { q: "Explain the bias-variance tradeoff", a: "High bias = underfitting (model too simple). High variance = overfitting (model too complex). Goal is to find the sweet spot with good generalization." },
                { q: "What is gradient descent?", a: "An optimization algorithm that iteratively adjusts model parameters in the direction of steepest descent of the loss function to minimize error." },
                { q: "Difference between supervised and unsupervised learning?", a: "Supervised: labeled data, predicts output (classification, regression). Unsupervised: unlabeled data, finds patterns (clustering, dimensionality reduction)." },
                { q: "What is cross-validation?", a: "Technique to evaluate model performance by splitting data into k folds, training on k-1 folds and testing on the remaining fold, repeated k times." },
            ],
            hr: [
                { q: "Tell me about a data project you're proud of", a: "Describe the problem, your approach, tools used, results achieved, and what you learned from it." },
                { q: "How do you handle missing data?", a: "Depends on the context: remove rows, impute with mean/median/mode, use model-based imputation, or flag as a separate category." },
            ],
            resumeTips: [
                "Highlight Kaggle competition rankings",
                "Include GitHub with ML project notebooks",
                "Mention specific metrics: 'Achieved 94% accuracy on...'",
                "List frameworks: TensorFlow, PyTorch, Scikit-learn",
                "Include any published papers or blog posts",
            ],
            projectIdeas: [
                "Sentiment analysis on product reviews",
                "Image classification with CNN",
                "Stock price prediction with LSTM",
                "Recommendation system for movies/products",
                "Chatbot using transformer models",
                "Resume parser using NLP",
            ],
        },
    },
    {
        id: "web-development",
        title: "Web Development",
        description: "Build modern web apps with React, Node.js, databases and deploy to cloud",
        icon: "🌐",
        color: "#06b6d4",
        gradient: "from-cyan-500 to-blue-600",
        skills: ["HTML/CSS", "JavaScript", "React", "Node.js", "SQL/NoSQL", "REST APIs"],
        avgSalary: "₹5–20 LPA",
        jobRoles: ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Web Developer"],
        practicePlatforms: [
            { name: "Frontend Mentor", url: "https://frontendmentor.io", description: "Real-world frontend challenges", icon: "🎨" },
            { name: "The Odin Project", url: "https://theodinproject.com", description: "Free full-stack curriculum", icon: "⚔️" },
            { name: "freeCodeCamp", url: "https://freecodecamp.org", description: "Free web dev certifications", icon: "🔥" },
            { name: "Scrimba", url: "https://scrimba.com", description: "Interactive coding environment", icon: "🟣" },
        ],
        modules: [
            {
                id: "wd-m1",
                title: "HTML, CSS & JavaScript",
                level: "beginner",
                duration: "4 weeks",
                topics: [
                    {
                        id: "wd-t1",
                        title: "HTML & CSS Fundamentals",
                        description: "Semantic HTML, Flexbox, Grid, Responsive Design",
                        duration: "1.5 weeks",
                        videoId: "qz0aGYrrlhU",
                        resources: [
                            { id: "wd-r1", title: "HTML & CSS Full Course – Dave Gray", url: "https://www.youtube.com/watch?v=mU6anWqZJcc", type: "video", isFree: true, platform: "YouTube" },
                            { id: "wd-r2", title: "CSS Flexbox – FreeCodeCamp", url: "https://www.freecodecamp.org/learn/responsive-web-design/", type: "course", isFree: true, platform: "FCC" },
                            { id: "wd-r3", title: "CSS Grid Garden", url: "https://cssgridgarden.com/", type: "practice", isFree: true, platform: "Game" },
                        ],
                    },
                    {
                        id: "wd-t2",
                        title: "JavaScript Essentials",
                        description: "ES6+, DOM manipulation, Async/Await, Fetch API",
                        duration: "2.5 weeks",
                        videoId: "PkZNo7MFNFg",
                        resources: [
                            { id: "wd-r4", title: "JavaScript Full Course – FreeCodeCamp", url: "https://www.youtube.com/watch?v=PkZNo7MFNFg", type: "video", isFree: true, platform: "YouTube" },
                            { id: "wd-r5", title: "JavaScript.info", url: "https://javascript.info/", type: "article", isFree: true, platform: "JS.info" },
                            { id: "wd-r6", title: "30 Days of JavaScript", url: "https://github.com/Asabeneh/30-Days-Of-JavaScript", type: "practice", isFree: true, platform: "GitHub" },
                        ],
                    },
                ],
            },
            {
                id: "wd-m2",
                title: "React & Modern Frontend",
                level: "intermediate",
                duration: "6 weeks",
                topics: [
                    {
                        id: "wd-t3",
                        title: "React.js",
                        description: "Components, Hooks, State Management, React Router",
                        duration: "3 weeks",
                        videoId: "bMknfKXIFA8",
                        resources: [
                            { id: "wd-r7", title: "React Full Course – FreeCodeCamp", url: "https://www.youtube.com/watch?v=bMknfKXIFA8", type: "video", isFree: true, platform: "YouTube" },
                            { id: "wd-r8", title: "Official React Docs", url: "https://react.dev/", type: "article", isFree: true, platform: "React" },
                            { id: "wd-r9", title: "React Projects – Traversy Media", url: "https://www.youtube.com/playlist?list=PLillGF-RfqbY3c2r0htQyVbDJJoBFE6Rb", type: "video", isFree: true, platform: "YouTube" },
                        ],
                    },
                    {
                        id: "wd-t4",
                        title: "Node.js & Express Backend",
                        description: "REST APIs, Middleware, Authentication, Database integration",
                        duration: "3 weeks",
                        videoId: "Oe421EPjeBE",
                        resources: [
                            { id: "wd-r10", title: "Node.js Full Course – FreeCodeCamp", url: "https://www.youtube.com/watch?v=Oe421EPjeBE", type: "video", isFree: true, platform: "YouTube" },
                            { id: "wd-r11", title: "Express.js Docs", url: "https://expressjs.com/", type: "article", isFree: true, platform: "Official" },
                        ],
                    },
                ],
            },
        ],
        interviewPrep: {
            technical: [
                { q: "What is the Virtual DOM in React?", a: "A lightweight JavaScript representation of the real DOM. React uses it to batch updates and minimize expensive real DOM operations, improving performance." },
                { q: "Explain event loop in JavaScript", a: "JavaScript is single-threaded. The event loop manages the call stack, callback queue, and microtask queue to handle async operations without blocking." },
                { q: "What is REST API?", a: "Representational State Transfer - architectural style for APIs using HTTP methods (GET, POST, PUT, DELETE) with stateless communication and resource-based URLs." },
                { q: "Difference between == and === in JavaScript?", a: "== does type coercion (1 == '1' is true). === is strict equality, no coercion (1 === '1' is false). Always prefer === for predictable behavior." },
            ],
            hr: [
                { q: "What projects have you built?", a: "Describe 2-3 projects with the problem solved, tech stack, your role, challenges faced, and what you learned." },
                { q: "How do you stay updated with web technologies?", a: "Mention following blogs (CSS-Tricks, Smashing Magazine), YouTube channels, Twitter developers, and building side projects." },
            ],
            resumeTips: [
                "Include live demo links for all projects",
                "Mention specific frameworks and versions",
                "Highlight responsive design and accessibility",
                "Include GitHub contribution graph",
                "List performance optimizations you've done",
            ],
            projectIdeas: [
                "Portfolio website with animations",
                "Full-stack e-commerce with cart & payments",
                "Real-time collaborative notes app",
                "Job board with filtering and search",
                "Social media dashboard with charts",
                "Recipe finder with API integration",
            ],
        },
    },
    {
        id: "government-exams",
        title: "Government Exams",
        description: "Prepare for UPSC, SSC, Banking, Railway and other government competitive exams",
        icon: "🏛️",
        color: "#10b981",
        gradient: "from-emerald-500 to-teal-600",
        skills: ["General Knowledge", "Reasoning", "Quantitative Aptitude", "English", "Current Affairs"],
        avgSalary: "₹4–15 LPA + Benefits",
        jobRoles: ["IAS/IPS Officer", "Bank PO", "SSC CGL", "Railway Officer", "Defence Officer"],
        practicePlatforms: [
            { name: "Testbook", url: "https://testbook.com", description: "Mock tests for all govt exams", icon: "📝" },
            { name: "Adda247", url: "https://adda247.com", description: "Comprehensive exam preparation", icon: "📚" },
            { name: "GradeUp (BYJU's Exam Prep)", url: "https://byjusexamprep.com", description: "Topic-wise practice", icon: "🎯" },
            { name: "Unacademy", url: "https://unacademy.com", description: "Live classes & mock tests", icon: "🎓" },
        ],
        modules: [
            {
                id: "gov-m1",
                title: "Quantitative Aptitude",
                level: "beginner",
                duration: "6 weeks",
                topics: [
                    {
                        id: "gov-t1",
                        title: "Number System & Arithmetic",
                        description: "HCF, LCM, Percentages, Profit & Loss, Simple & Compound Interest",
                        duration: "3 weeks",
                        videoId: "pTnEG_WGd2Q",
                        resources: [
                            { id: "gov-r1", title: "Quantitative Aptitude – Arun Sharma Book", url: "https://www.amazon.in/Quantitative-Aptitude-Competitive-Examinations-Sharma/dp/9390711487", type: "article", isFree: false, platform: "Book" },
                            { id: "gov-r2", title: "Maths Tricks – Unacademy", url: "https://unacademy.com/goal/ssc-cgl-tier-i/SSCCGL/practice/quantitative-aptitude", type: "course", isFree: true, platform: "Unacademy" },
                        ],
                    },
                    {
                        id: "gov-t2",
                        title: "Logical Reasoning",
                        description: "Syllogisms, Blood Relations, Coding-Decoding, Puzzles, Seating Arrangement",
                        duration: "3 weeks",
                        videoId: "mKiNFMGFGLo",
                        resources: [
                            { id: "gov-r3", title: "Reasoning – Testbook Free Tests", url: "https://testbook.com/reasoning", type: "practice", isFree: true, platform: "Testbook" },
                            { id: "gov-r4", title: "Reasoning Tricks – YouTube", url: "https://www.youtube.com/results?search_query=reasoning+tricks+for+government+exams", type: "video", isFree: true, platform: "YouTube" },
                        ],
                    },
                ],
            },
            {
                id: "gov-m2",
                title: "General Awareness & Current Affairs",
                level: "intermediate",
                duration: "Ongoing",
                topics: [
                    {
                        id: "gov-t3",
                        title: "Current Affairs",
                        description: "Daily news, monthly current affairs, important events",
                        duration: "Daily practice",
                        resources: [
                            { id: "gov-r5", title: "The Hindu Newspaper", url: "https://www.thehindu.com/", type: "article", isFree: false, platform: "Newspaper" },
                            { id: "gov-r6", title: "GK Today", url: "https://www.gktoday.in/", type: "article", isFree: true, platform: "GKToday" },
                            { id: "gov-r7", title: "Adda247 Monthly Current Affairs", url: "https://www.adda247.com/current-affairs/", type: "article", isFree: true, platform: "Adda247" },
                        ],
                    },
                ],
            },
        ],
        interviewPrep: {
            technical: [
                { q: "What is the difference between UPSC CSE and State PSC?", a: "UPSC CSE is for central government services (IAS, IPS, IFS). State PSCs conduct exams for state government services. Both have prelims, mains, and interview stages." },
                { q: "Explain the structure of the Indian Parliament", a: "Parliament consists of President, Rajya Sabha (upper house, 245 members), and Lok Sabha (lower house, 543 members). Bills must pass both houses." },
            ],
            hr: [
                { q: "Why do you want to join government service?", a: "Mention job security, serving the nation, work-life balance, and the opportunity to implement policies that impact millions of citizens." },
                { q: "What are your strengths for this role?", a: "Highlight analytical thinking, communication skills, integrity, and commitment to public service." },
            ],
            resumeTips: [
                "Highlight academic achievements and percentages",
                "Mention NCC/NSS activities",
                "Include any social work or community service",
                "List relevant internships with government bodies",
                "Mention sports achievements if applicable",
            ],
            projectIdeas: [
                "Create a current affairs tracker app",
                "Build a mock test platform",
                "Make study notes on Indian Constitution",
                "Prepare topic-wise GK flashcards",
            ],
        },
    },
    {
        id: "core-engineering",
        title: "Core Engineering Jobs",
        description: "Prepare for PSU, GATE, and core engineering company placements",
        icon: "⚙️",
        color: "#8b5cf6",
        gradient: "from-violet-500 to-purple-600",
        skills: ["Core Subject Knowledge", "GATE Preparation", "Technical Skills", "Problem Solving"],
        avgSalary: "₹5–18 LPA",
        jobRoles: ["PSU Engineer", "R&D Engineer", "Design Engineer", "Manufacturing Engineer"],
        practicePlatforms: [
            { name: "GATE Overflow", url: "https://gateoverflow.in", description: "GATE previous year questions", icon: "🔵" },
            { name: "Made Easy", url: "https://madeeasy.in", description: "GATE preparation material", icon: "🟢" },
            { name: "NPTEL", url: "https://nptel.ac.in", description: "Free IIT/IISc courses", icon: "🟡" },
        ],
        modules: [
            {
                id: "ce-m1",
                title: "GATE Core Subjects",
                level: "beginner",
                duration: "6 months",
                topics: [
                    {
                        id: "ce-t1",
                        title: "Engineering Mathematics",
                        description: "Linear Algebra, Calculus, Probability, Discrete Math",
                        duration: "6 weeks",
                        resources: [
                            { id: "ce-r1", title: "Engineering Maths – NPTEL", url: "https://nptel.ac.in/courses/111/105/111105035/", type: "course", isFree: true, platform: "NPTEL" },
                            { id: "ce-r2", title: "GATE Maths PYQs – GATE Overflow", url: "https://gateoverflow.in/", type: "practice", isFree: true, platform: "GATE Overflow" },
                        ],
                    },
                ],
            },
        ],
        interviewPrep: {
            technical: [
                { q: "What is the difference between stress and strain?", a: "Stress is force per unit area (σ = F/A). Strain is the ratio of deformation to original dimension (ε = ΔL/L). They are related by Young's modulus: E = σ/ε." },
                { q: "Explain the working principle of a heat exchanger", a: "Heat exchangers transfer heat between two fluids at different temperatures without mixing them. Types include shell-and-tube, plate, and finned tube exchangers." },
            ],
            hr: [
                { q: "Why core engineering over software?", a: "Express genuine interest in the domain, mention specific projects or subjects that excited you, and how you want to apply engineering principles to real-world problems." },
            ],
            resumeTips: [
                "Highlight GATE score prominently",
                "Include core engineering projects and labs",
                "Mention any internships in manufacturing/R&D",
                "List relevant software tools (AutoCAD, MATLAB, ANSYS)",
            ],
            projectIdeas: [
                "Design a heat exchanger simulation",
                "Build an IoT-based monitoring system",
                "Create a structural analysis model",
                "Develop an automation script for manufacturing",
            ],
        },
    },
    {
        id: "mba",
        title: "MBA / Higher Studies",
        description: "Crack CAT, GMAT, GRE and prepare for top B-schools and universities",
        icon: "🎓",
        color: "#ec4899",
        gradient: "from-pink-500 to-rose-600",
        skills: ["Quantitative Ability", "Verbal Ability", "Data Interpretation", "Logical Reasoning", "GD/PI Skills"],
        avgSalary: "₹10–50 LPA (post MBA)",
        jobRoles: ["Management Consultant", "Product Manager", "Investment Banker", "Marketing Manager"],
        practicePlatforms: [
            { name: "IMS Learning", url: "https://imsindia.com", description: "CAT preparation", icon: "🔴" },
            { name: "TIME Institute", url: "https://time4education.com", description: "MBA entrance coaching", icon: "🟡" },
            { name: "2IIM", url: "https://2iim.com", description: "Free CAT preparation", icon: "🟢" },
            { name: "GMAT Official", url: "https://mba.com", description: "Official GMAT prep", icon: "🔵" },
        ],
        modules: [
            {
                id: "mba-m1",
                title: "CAT/GMAT Quantitative",
                level: "beginner",
                duration: "4 months",
                topics: [
                    {
                        id: "mba-t1",
                        title: "Arithmetic & Algebra",
                        description: "Percentages, Ratios, Time-Speed-Distance, Equations",
                        duration: "6 weeks",
                        resources: [
                            { id: "mba-r1", title: "CAT Quant – 2IIM Free Course", url: "https://2iim.com/cat-quant/", type: "course", isFree: true, platform: "2IIM" },
                            { id: "mba-r2", title: "CAT Previous Papers", url: "https://www.ims.ac.in/cat-previous-year-papers.aspx", type: "practice", isFree: true, platform: "IMS" },
                        ],
                    },
                ],
            },
        ],
        interviewPrep: {
            technical: [
                { q: "Why MBA after engineering?", a: "Explain how you want to combine technical knowledge with business acumen to solve larger organizational problems and lead cross-functional teams." },
                { q: "What is your long-term career goal?", a: "Be specific: mention the industry, role, and impact you want to create. Show how MBA is a necessary step in that journey." },
            ],
            hr: [
                { q: "Tell me about a leadership experience", a: "Use STAR method: Situation, Task, Action, Result. Highlight your decision-making, team management, and outcome." },
                { q: "What are your strengths and weaknesses?", a: "Be honest and specific. For weaknesses, show self-awareness and the steps you're taking to improve." },
            ],
            resumeTips: [
                "Highlight leadership roles in college",
                "Quantify achievements wherever possible",
                "Include extracurricular activities and sports",
                "Mention any entrepreneurial ventures",
                "List certifications and online courses",
            ],
            projectIdeas: [
                "Business plan for a startup idea",
                "Market analysis report for an industry",
                "Case study on a company's strategy",
                "Financial model for a business",
            ],
        },
    },
    {
        id: "placement-prep",
        title: "Placement Preparation",
        description: "Comprehensive preparation for campus placements - aptitude, coding, and interviews",
        icon: "🚀",
        color: "#f97316",
        gradient: "from-orange-500 to-red-600",
        skills: ["Aptitude", "Coding", "Communication", "Resume Building", "Interview Skills"],
        avgSalary: "₹3–15 LPA (fresher)",
        jobRoles: ["Software Trainee", "Analyst", "Associate Engineer", "Graduate Engineer Trainee"],
        practicePlatforms: [
            { name: "IndiaBix", url: "https://indiabix.com", description: "Aptitude & reasoning practice", icon: "🟢" },
            { name: "PrepInsta", url: "https://prepinsta.com", description: "Company-specific prep", icon: "🔵" },
            { name: "Placement Season", url: "https://placementseason.com", description: "Interview experiences", icon: "🟡" },
            { name: "AmbitionBox", url: "https://ambitionbox.com", description: "Company reviews & salaries", icon: "🔴" },
        ],
        modules: [
            {
                id: "pp-m1",
                title: "Aptitude & Reasoning",
                level: "beginner",
                duration: "3 weeks",
                topics: [
                    {
                        id: "pp-t1",
                        title: "Quantitative Aptitude",
                        description: "Number systems, Percentages, Profit & Loss, Time & Work, Speed & Distance",
                        duration: "1.5 weeks",
                        videoId: "pTnEG_WGd2Q",
                        resources: [
                            { id: "pp-r1", title: "Aptitude Questions – IndiaBix", url: "https://www.indiabix.com/aptitude/questions-and-answers/", type: "practice", isFree: true, platform: "IndiaBix" },
                            { id: "pp-r2", title: "Aptitude for Placements – PrepInsta", url: "https://prepinsta.com/aptitude/", type: "course", isFree: true, platform: "PrepInsta" },
                        ],
                    },
                    {
                        id: "pp-t2",
                        title: "Verbal Ability & Communication",
                        description: "Grammar, Reading Comprehension, Vocabulary, Email Writing",
                        duration: "1.5 weeks",
                        resources: [
                            { id: "pp-r3", title: "English for Placements – IndiaBix", url: "https://www.indiabix.com/verbal-ability/questions-and-answers/", type: "practice", isFree: true, platform: "IndiaBix" },
                            { id: "pp-r4", title: "Communication Skills – Coursera", url: "https://www.coursera.org/learn/wharton-communication-skills", type: "course", isFree: true, platform: "Coursera" },
                        ],
                    },
                ],
            },
            {
                id: "pp-m2",
                title: "Technical & Coding Rounds",
                level: "intermediate",
                duration: "4 weeks",
                topics: [
                    {
                        id: "pp-t3",
                        title: "DSA for Placements",
                        description: "Arrays, Strings, Linked Lists, Trees, DP - most asked patterns",
                        duration: "3 weeks",
                        videoId: "RBSGKlAvoiM",
                        resources: [
                            { id: "pp-r5", title: "Love Babbar DSA Sheet", url: "https://drive.google.com/file/d/1FMdN_OCfOI0iAeDlqswCiC2DZzD4nPsb/view", type: "practice", isFree: true, platform: "Google Drive" },
                            { id: "pp-r6", title: "Company-wise Questions – LeetCode", url: "https://leetcode.com/company/", type: "practice", isFree: true, platform: "LeetCode" },
                            { id: "pp-r7", title: "Placement Coding Questions – GFG", url: "https://www.geeksforgeeks.org/must-do-coding-questions-for-companies-like-amazon-microsoft-adobe/", type: "practice", isFree: true, platform: "GFG" },
                        ],
                    },
                ],
            },
            {
                id: "pp-m3",
                title: "HR & Soft Skills",
                level: "advanced",
                duration: "2 weeks",
                topics: [
                    {
                        id: "pp-t4",
                        title: "HR Interview Preparation",
                        description: "Common HR questions, body language, professional etiquette",
                        duration: "1 week",
                        resources: [
                            { id: "pp-r8", title: "HR Interview Questions – IndiaBix", url: "https://www.indiabix.com/hr-interview/questions-and-answers/", type: "practice", isFree: true, platform: "IndiaBix" },
                            { id: "pp-r9", title: "How to Answer HR Questions – YouTube", url: "https://www.youtube.com/results?search_query=hr+interview+questions+for+freshers", type: "video", isFree: true, platform: "YouTube" },
                        ],
                    },
                ],
            },
        ],
        interviewPrep: {
            technical: [
                { q: "What is your final year project about?", a: "Explain clearly: the problem statement, your approach, technologies used, your specific contribution, and results/outcomes." },
                { q: "What programming languages do you know?", a: "Mention languages with proficiency levels. Be honest. Highlight the one you're most comfortable with and give examples of what you've built." },
                { q: "Explain a sorting algorithm", a: "Choose Bubble Sort (simplest) or Quick Sort (most efficient). Explain the logic, time complexity O(n²) or O(n log n), and when to use each." },
            ],
            hr: [
                { q: "Are you willing to relocate?", a: "Be honest. If yes, express enthusiasm. If no, explain your constraints politely and ask about remote work options." },
                { q: "What is your expected salary?", a: "Research the company's package range. For freshers, say you're flexible and open to the company's standard package, then mention your research." },
                { q: "Why should we hire you?", a: "Highlight your unique combination of skills, projects, and attitude. Show enthusiasm for the role and company. Be specific, not generic." },
            ],
            resumeTips: [
                "Keep resume to 1 page for freshers",
                "Use bullet points, not paragraphs",
                "Start each bullet with an action verb",
                "Include CGPA if above 7.0",
                "Add links: GitHub, LinkedIn, Portfolio",
                "Tailor resume for each company",
            ],
            projectIdeas: [
                "Build a CRUD application with database",
                "Create a REST API with authentication",
                "Make a data visualization dashboard",
                "Develop a mobile-responsive web app",
                "Build a chatbot for a specific domain",
            ],
        },
    },
];

export const INTERVIEW_QUESTION_BANKS: Record<string, { technical: { q: string; a: string }[]; hr: { q: string; a: string }[] }> = {
    "Software Developer": {
        technical: CAREER_PATHS.find(p => p.id === "software-developer")?.interviewPrep.technical || [],
        hr: CAREER_PATHS.find(p => p.id === "software-developer")?.interviewPrep.hr || [],
    },
    "Data Science / AI": {
        technical: CAREER_PATHS.find(p => p.id === "data-science")?.interviewPrep.technical || [],
        hr: CAREER_PATHS.find(p => p.id === "data-science")?.interviewPrep.hr || [],
    },
};

export function getCareerPath(id: string): CareerPath | undefined {
    return CAREER_PATHS.find(p => p.id === id);
}
