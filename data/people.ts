export type PersonRecord = {
  name: string;
  /** Individual names when the Name field lists several people. */
  aliases: string[];
  company?: string;
  relationship?: string;
  notes?: string;
};

export const people: PersonRecord[] = [
  {
    name: "Utkarsh Tyagi",
    aliases: ["Utkarsh"],
    relationship: "guide (resources); skilled full-stack engineer",
    notes:
      'Recommended the "You Don\'t Know JS" book and assured that completing it would build strong JavaScript proficiency for front-end development. He is key person who helped me to transition from QA to frontend engineering. Served as a guide for learning resources. He is an experienced Backend Engineer | Cloud-Native Solutions Architect | Distributed Systems Specialist with 10+ years of experience in backend engineering, building scalable, high-performance systems.',
  },
  {
    name: "Prashant Sharma",
    aliases: ["Prashant"],
    relationship: "guide; skilled front-end engineer",
    notes:
      "Provided ongoing guidance while I was learning JavaScript and preparing to move into front-end. Having already transitioned from another domain into front-end himself, he was especially helpful. A skilled front-end engineer.",
  },
  {
    name: "Megha",
    aliases: ["Megha"],
    company: "Huawei",
    relationship: "colleague; teammate; initially acted as lead;",
    notes:
      "Colleague and teammate at Huawei who initially acted as lead. Guided me on test planning and testing activities for our project. Knowledgeable QA engineer.",
  },
  {
    name: "Shardul Negi",
    aliases: ["Shardul"],
    company: "Huawei",
    relationship: "mentor; QA automation engineer",
    notes:
      "Joined the Huawei team as a QA automation engineer responsible for all automation work. Mentored and supported me in building an automation tool with Jubula in Java—something I could not have done without his guidance. Strong QA tester, automation engineer, and mentor. He is a humble and approachable person who is always ready to share his knowledge and experience. He was a QA engineer but now working as Software Engineer with 6+ years of building scalable backend systems, distributed infrastructure, and end-to-end features across both enterprise and consumer-facing domains. He has led feature teams, shipped production-grade systems, and helped drive product-market fit at startups and global tech companies alike. He is specialized in architecting systems that are reliable, performant, and user-aware, whether it's designing API gateways, building VM backup pipelines, or integrating payment and notification flows at scale. I'm equally comfortable working across the stack, mentoring teammates, or making architectural calls that align with long-term business goals. He is passionate about developer experience, clean system design, and infrastructure problems.",
  },
  {
    name: "Manjunath Sarode",
    aliases: ["Manjunath", "Manju"],
    company: "Huawei",
    relationship: "project lead and manager",
    notes:
      "Project lead and manager at Huawei. Guided and supported my automation learning and product development alongside Shardul. Strong in people management and consistently supportive.",
  },
  {
    name: "Keerthini",
    aliases: ["Keerthini"],
    company: "Huawei (different team; contract-based, different company)",
    relationship: "peer / collaborator",
    notes:
      "We often discussed technologies, libraries, backend, frontend, algorithms, and more. Collaborated on outside projects where collaborative learning helped me pick up a lot of new things.",
  },
  {
    name: "Prashanth",
    aliases: ["Prashanth"],
    company: "Schneider Electric",
    relationship: "mentor and guide",
    notes:
      "Mentor and guide at Schneider Electric. While I was learning frontend and trying to understand architecture, workflows, and how frontend teams operate, he helped me grasp how frontend engineering works—tools in active use, designer/developer/lead interactions, and how to work as a frontend engineer. One of the main people who helped me move from QA into frontend engineering.",
  },
  {
    name: "Tahir Ahmed",
    aliases: ["Tahir"],
    company: "Schneider Electric",
    relationship: "colleague; teammate; QA team lead; interviewer",
    notes:
      "Colleague, teammate, and QA team lead at Schneider Electric. Highly skilled QA engineer; friendly and approachable. Shared a lot of knowledge with me and conducted my interview at Schneider Electric.",
  },
  {
    name: "Mir",
    aliases: ["Mir"],
    company: "Trelleborg",
    relationship: "team lead; mentor",
    notes:
      "Team lead at Trelleborg. Friendly, hardworking, and among the most dedicated people I've worked with. Extremely skilled and mentored me by guiding and unblocking tough technical frontend challenges.",
  },
  {
    name: "Shanmugam",
    aliases: ["Shan"],
    company: "Trelleborg",
    relationship: "team lead",
    notes:
      "Team lead at Trelleborg. Friendly and knowledgeable. Great to work with on his team; always available when issues came up or something needed attention.",
  },
  {
    name: "Sunny Puri",
    aliases: ["Sunny"],
    company: "Paypal",
    relationship: "mentor; guide; friend",
    notes:
      "Mentor and friend—one of the people who helped me excel in frontend engineering. Connected through a DOM challenge he ran under Team Devkode; also joined November Talks and many Team Devkode activities. Later joined Team Devkode's organizing committee. Always helped me learn, guided me as a senior with deep knowledge when things were tough. Among the most highly skilled frontend engineers I've seen.",
  },
  {
    name: "NC Patro",
    aliases: ["Patro"],
    company: "frontend/JavaScript meetup; React Nexus; JS conference events",
    relationship: "friend; meetup organizer",
    notes:
      "Connected at a frontend/JavaScript meetup; later met in person at React Nexus and JS conference events. Knowledgeable, hardworking guide.",
  },
  {
    name: "Priyaranjan Dubey",
    aliases: ["Priyaranjan", "Ranjan"],
    company: "React Nexus organizing committee",
    relationship: "friend; collaborator",
    notes:
      "Friend; strong frontend developer/engineer. Long-time collaborators on the React Nexus organizing committee. Both of us worked there as volunteers. We often discuss various topics about frontend technologies and AI.",
  },
  {
    name: "Chirag Goel",
    aliases: ["Chirag Goel", "Chirag", "Chirag Goyal"],
    company: "Google",
    relationship: "friend; podcast host (I spoke on one of his podcasts)",
    notes:
      "Highly skilled frontend engineer and system design expert. His videos were highly beneficial for me and many others. Friend; also appeared as a speaker on one of his YouTube podcasts.",
  },
  {
    name: "Gopalakrishnan C",
    aliases: ["Gopal", "Gopal K", "Gopalakrishnan"],
    company: "Freshworks",
    relationship: "friend; collaborator",
    notes:
      "Friend; collaborated on multiple open-source projects. Met through Team Devkode. Highly skilled lead and one who goes in depth to understand various concepts.",
  },
  {
    name: "Vivek",
    aliases: ["Vivek"],
    company: "open-source projects",
    relationship: "UX designer collaborator",
    notes:
      "UX designer for our open-source work. When we needed UX design for our projects, he stepped up and we built a couple of open-source projects together with him as designer. Highly skilled and experienced UX professional.",
  },
  {
    name: "Siva",
    aliases: ["Siva"],
    company: "Resume Builder (open source); introduced by Gopal",
    relationship: "open-source collaborator",
    notes:
      "Hard working and highly skilled frontend engineer who contributed significantly to Resume Builder project. His work was key to shipping Resume Builder.",
  },
  {
    name: "Rakesh Saini",
    aliases: ["Rakesh"],
    company: "PWC",
    relationship:
      "Jscoders (WhatsApp community co-founder); weekly meetups/sessions; collaborator",
    notes:
      "Full-stack developer and manager. Collaborated on weekly meetups, sessions, and knowledge sharing. Co-founded the WhatsApp community JSCoders. He is an Application Architect & AI Engineer | Building Production-Grade LLM Systems  at Scale | 14+ Years in Distributed Systems & Full-Stack Engineering",
  },
  {
    name: "Kiran Abburi",
    aliases: ["Kiran"],
    company: "React Nexus India (founder)",
    relationship: "event founder; volunteer opportunity",
    notes:
      "Founder of React Nexus India. Met during the event after he gave me the opportunity to volunteer at React Nexus events.",
  },
  {
    name: "Manoj Mukherjee",
    aliases: ["Manoj"],
    company: "React Nexus",
    relationship: "met at React Nexus",
    notes:
      "Frontend + AI architect met at React Nexus. Highly skilled AI engineer who shares knowledge and stays curious about exploring new things in the AI space.",
  },
  {
    name: "Sunil Nayak",
    aliases: ["Sunil", "Sunil L"],
    company: "Siemens",
    relationship: "friend",
    notes:
      "Friend; fullstack engineer and solutions engineer. Enjoys exploring cloud, AWS, and AI. We connect often and discuss a wide range of technical topics. He has is a Tech Lead with knowledge of Typescript (Angular & React) | AI (Copilot/Claude Code) | Python ( FastAPI) | AWS (ECS, DynamoDB, S3, Cloudformation) | Docker | CI/CD(Jenkins, Gitlab)",
  },
  {
    name: "Rajshekhar Bhat",
    aliases: ["Rajshekhar"],
    relationship: "friend",
    notes:
      "Friend; QA engineer. We discuss various topics about technologies, algorithms, libraries. He also shares a lot of knowledge around QA space and has strong QA foundation.",
  },
  {
    name: "Naveen Kumar",
    aliases: ["Naveen"],
    company: "lead at Nevius",
    relationship: "friend",
    notes:
      "Friend; Backend engineer working with Java. Hardworking, highly skilled solutions engineer and lead at his company. We regularly discuss AI, backend, frontend, architecture, algorithms and data structures, and product design.",
  },
  {
    name: "Ajith Rebello",
    aliases: ["Ajith"],
    relationship: "friend",
    notes:
      "Friend; Frontend engineer. We discuss various topics about technologies, frameworks & job conditions.",
  },
  {
    name: "Shailendra Sahu",
    aliases: ["Shailendra"],
    company: "CoinDCX",
    relationship: "team lead; guide",
    notes:
      "Team lead at CoinDCX. Highly skilled frontend solutions architect, and guide. Helped with learning and guidance while I worked at CoinDCX.",
  },
  {
    name: "Yoga",
    aliases: ["Yoga", "Yoga Rakshith"],
    company: "CoinDCX (under Shailendra)",
    relationship: "teammate; colleague; solution architect",
    notes:
      "Highly skilled fullstack solution architect. He led and supported me in building payment system for CoinDCX as a separate portal in Angular. He also shares knowledge on various tech trends in the industry.",
  },
  {
    name: "Rahul Kumar, Rohit Sawant, Vikash Singh, Robin Raju",
    aliases: ["Rahul", "Rohit", "Vikash", "Robin"],
    company: "CoinDCX (under Shailendra)",
    relationship: "teammates; colleagues",
    notes:
      "Teammates and colleagues at CoinDCX under Shailendra. Highly skilled frontend engineers with a hardworking mindset.",
  },
  {
    name: "Tarun Gupta",
    aliases: ["Tarun"],
    company: "Atlassian",
    relationship: "teammate",
    notes:
      "Teammate at Atlassian. Hardworking, highly skilled and critical thinker; I was mentored to onboard into Atlassian and work on the project.",
  },
];
