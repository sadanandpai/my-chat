import { tool } from "langchain";
import { z } from "zod";

/** LangChain tool: hardcoded personal intro for "about me" style asks. */
export const getIntroTool = tool(
  async () => {
    return `My name is Sadanand Pai. I am currently working at Atlassian as a Frontend and AI engineer in an SDE3 / Senior Software Engineer role (2.5 years). 
    I have a total of 12+ years of experience, of which the initial 6 years I spent as a QA and the rest as a frontend engineer.
    I live in Bangalore, Karnataka, India. My previous companies are CoinDCX (2.5 years), Trelleborg (2 years), TekSystems (1 year), and Infosys (5 years). 
    I am active in the open source community and contribute to it. You can contact me at my email address: sadypai@gmail.com.
    My GitHub profile is https://github.com/sadanandpai. My LinkedIn profile is https://linkedin.com/in/sadanandpai. My Twitter profile is https://x.com/sadanand_pai. My portfolio website is https://sadanandpai.github.io
    
    In my free time, I prefer going out with friends, watching web series, or playing computer games.
    A few of the web series that I liked are Game of Thrones, Prison Break, and Scam 1992. My favorite movies are Interstellar, Inception, and Pele.
    These are some of my hobbies. I used to play chess during my childhood and was a chess champion during my school days.
    I was a winner at the district level and also participated in state-level chess, where I lost. I used to be active in sports as well, such as cricket, kabaddi, volleyball, and football.
    In computer games, I play Counter-Strike, FIFA, Assassin's Creed, and Command & Conquer. My favorite computer games are Anno 1800, AC Odyssey, and Need for Speed: Most Wanted.
    I am not a big fan of reading novels, though I've read a few novels like Master of the Game, Tell Me Your Dreams, and Rich Dad Poor Dad.
    I follow chess updates frequently and watch chess matches on YouTube occasionally.`;
  },
  {
    name: "getIntro",
    description:
      "AUTHORITATIVE source for Sadanand Pai's bio/overview facts: current company & role, total years of experience, current and previous companies/employers (where he worked, past jobs), where he lives, social media and contact links, hobbies, favorite games/movies/series. ALWAYS prefer this over search_knowledge for any of these. Call this for 'who are you', 'introduce yourself', 'tell me about yourself', 'where do/did you work', 'your previous company/companies', 'past jobs', contact/socials, location, hobbies, or games. Do NOT use for 'do you know X' / people in his network — use lookup_person. Do NOT use for interviews, hiring rounds, or what he worked on at a company — use search_knowledge for those, and for any deep project/skill/technical detail not covered here.",
    schema: z.object({}),
  },
);
