import { tool } from "langchain";
import { z } from "zod";

/** LangChain tool: hardcoded personal intro for "about me" style asks. */
export const getIntroTool = tool(
  async () => {
    return `My name is Sadanand Pai. I am currently working at Atlassian as a Frontend and AI engineer in an SDE3 / Senior Software Engineer role (2.5 years). 
    I have a total of 12+ years of experience, of which the initial 6 years I spent as a QA and the rest as a frontend engineer.
    I live in Bangalore, Karnataka, India. Career path in short: Infosys (~5 years QA, including Huawei client site) → Sears (briefly) → TekSystems / Schneider Electric (~1 year) → Trelleborg (~2 years, first frontend role) → CoinDCX (~2.5 years) → Atlassian (current).
    I am active in the open source community and contribute to it. You can contact me at my email address: sadypai@gmail.com.
    Friends also call me by my nickname is Saddy or Sada and some people know me by the name Akshay.
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
      "AUTHORITATIVE source for Sadanand Pai's bio/overview facts: current role title and seniority, total years of experience, where he lives, nicknames, social media and contact links, hobbies, favorite games/movies/series. Call this for 'who are you', 'introduce yourself', 'tell me about yourself', contact/socials, location, hobbies, or games. For employment history, 'where did you work', 'previous companies', 'did you work at X', or any named employer/interview — use lookup_company (intro's company line is only a short summary and is incomplete). Do NOT use for people in his network — use lookup_person. Do NOT use for open-source / GitHub projects — use lookup_projects. Do NOT use for interview rounds or deep day-to-day work at a company — use lookup_company first, then search_knowledge.",
    schema: z.object({}),
  },
);
