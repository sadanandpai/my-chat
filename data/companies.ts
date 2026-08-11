export type CompanyKind =
  /** Primary employment (FTE, contract via staffing firm as employer of record, etc.). */
  | "employer"
  /** Worked at this site/team while employed by a different parent company. */
  | "client"
  /** Interviewed and/or received an offer; did not work there as an employee. */
  | "interview";

export type CompanyRecord = {
  name: string;
  kind: CompanyKind;
  /** Approximate years or span, when known (e.g. "2013-2017", "~2.5 years"). */
  years?: string;
  role?: string;
  location?: string;
  /** Parent employer when kind is "client" (e.g. Infosys for Huawei). */
  parent?: string;
  /**
   * For interviews / offers: what happened.
   * Prefer short facts — deep round-by-round detail stays in search_knowledge.
   */
  outcome?: string;
  /** Chronological career order for employers/clients (1 = earliest). Interviews omit. */
  order?: number;
  notes?: string;
};

/**
 * AUTHORITATIVE company / employer / interview roster for Sadanand Pai.
 * Deep tenure stories and interview round detail live in data/data.txt (RAG).
 * This list is the source of truth for "did you work at X?" and "where have you worked?".
 */
export const companies: CompanyRecord[] = [
  // —— Career timeline (employer / client) ——
  {
    name: "Infosys",
    kind: "employer",
    years: "~2013-2017 (~5 years)",
    role: "QA (after training); brief support stint; back to QA",
    location: "Mangalore, then Bangalore (client site)",
    order: 1,
    notes:
      "First job after college. Campus hire; training in Mangalore/fast track advanced Java; allocated to QA. Later transferred Bangalore and deputed to Huawei client site. Left for Sears.",
  },
  {
    name: "Huawei",
    kind: "client",
    years: "~8 months (during Infosys tenure)",
    role: "QA / Jubula automation (Infosys contractor)",
    location: "Bangalore / Electronic City",
    parent: "Infosys",
    order: 2,
    notes:
      "Client site while employed by Infosys. Networking-tool QA; built Jubula (Java) automation with mentor Shardul. Not a direct Huawei employee.",
  },
  {
    name: "Sears",
    kind: "employer",
    years: "joined Dec 2017; a few weeks only",
    role: "Senior QA Engineer (manual testing)",
    location: "Sesna Tech Park, Bangalore",
    order: 3,
    notes:
      "Joined after Infosys. Laid off within weeks during company firings. Brief tenure — still a real employer.",
  },
  {
    name: "TekSystems",
    kind: "employer",
    years: "~1 year (intro bio); ~2018 into early 2019",
    role: "Contract employee placed at Schneider Electric",
    location: "Bangalore (client site)",
    order: 4,
    notes:
      "Consulting/staffing employer of record after Sears. Placed me at Schneider Electric. Parent company on paper while day-to-day work was at Schneider.",
  },
  {
    name: "Schneider Electric",
    kind: "client",
    years: "~2018-early 2019 (via TekSystems)",
    role: "QA / platform work (auth, authorization, terms & conditions)",
    location: "BGRT, Bangalore",
    parent: "TekSystems",
    order: 5,
    notes:
      "Client site via TekSystems (not a direct Schneider hire). Chose this path over a pending Wipro development offer. Upskilled toward frontend while here; left for first frontend role at Trelleborg.",
  },
  {
    name: "Trelleborg",
    kind: "employer",
    years: "joined March 2019; ~2 years (through CoinDCX move)",
    role: "Frontend / UI developer; later frontend lead on a sales sub-product",
    location: "Bangalore; WFH from mid-March 2020",
    order: 6,
    notes:
      "First developer job after ~6 years QA. jQuery UI revamp, then React/Angular maintenance; led frontend on a sales sub-product. Left for CoinDCX.",
  },
  {
    name: "CoinDCX",
    kind: "employer",
    years: "~2.5 years",
    role: "SDE2 frontend",
    location: "Bangalore (WFH entire tenure)",
    order: 7,
    notes:
      "Accepted as first offer after parallel late-stage processes elsewhere. Homepage/core web revamp, payments frontend, foundation of Advanced Web Trading Terminal (AWT). Built Algo Visualizers in parallel.",
  },
  {
    name: "Atlassian",
    kind: "employer",
    years: "~2.5 years (current)",
    role: "Frontend and AI engineer; SDE3 / Senior Software Engineer",
    location: "Bangalore",
    order: 8,
    notes:
      "Current employer. Reached via LinkedIn outreach while at CoinDCX. Multi-round interview loop (Karat, browser coding, JS coding, system design, hiring manager, values).",
  },

  // —— Interviews / offers (did not work as employee) ——
  {
    name: "Redbus",
    kind: "interview",
    role: "Development (attempted switch from QA)",
    outcome:
      "Rejected after onsite; interviewer said knowledge felt fresher-level",
    notes: "Post-Sears job search. Java algo-style coding round.",
  },
  {
    name: "Nokia",
    kind: "interview",
    role: "Development",
    outcome: "Rejected after telephonic round",
    notes: "Post-Sears referral; could not answer much on the call.",
  },
  {
    name: "Adobe",
    kind: "interview",
    role: "QA (via TekSystems arrangement)",
    outcome: "Not a fit — they wanted manual QA, not automation",
    notes: "Two QA rounds at Adobe office arranged by TekSystems.",
  },
  {
    name: "Wipro",
    kind: "interview",
    role: "Development",
    outcome:
      "Selected / offer path; did not join — chose TekSystems → Schneider instead",
    notes:
      "Crowded hiring drive; surprised to clear Java development interview.",
  },
  {
    name: "Tredence",
    kind: "interview",
    role: "Frontend",
    outcome: "Cleared interviews / offer; accepted Trelleborg instead",
    notes: "Early 2019 first frontend job search (~4-5 days).",
  },
  {
    name: "Pearson",
    kind: "interview",
    role: "Frontend",
    outcome: "Cleared interviews / offer; accepted Trelleborg instead",
    notes:
      "Early 2019 first frontend job search alongside Trelleborg and Tredence.",
  },
  {
    name: "Flipkart",
    kind: "interview",
    role: "SDE2 (also considered SDE1)",
    outcome: "Rejected",
    notes:
      "Memorable process; learnings fed into open-source JavaScript Code Challenges. Deep round detail via search_knowledge.",
  },
  {
    name: "Typeset",
    kind: "interview",
    role: "Frontend / product engineering",
    outcome: "Not selected after round 2",
    notes:
      "Chat box and collaborative editor style rounds; paired with Flipkart learnings era.",
  },
  {
    name: "PhiGRC",
    kind: "interview",
    outcome: "Cleared early rounds; did not proceed — hike not worth switching",
    notes: "Pre-CoinDCX job search; visibility partly from GitHub.",
  },
  {
    name: "Visa",
    kind: "interview",
    outcome: "Rejected after a couple of rounds",
    notes: "Pre-CoinDCX job search.",
  },
  {
    name: "Skuad",
    kind: "interview",
    outcome: "Rejected after a couple of rounds",
    notes: "Pre-CoinDCX job search.",
  },
  {
    name: "Ormae",
    kind: "interview",
    outcome:
      "Reached final rounds; declined after accepting CoinDCX (first-offer rule)",
    notes: "Parallel late-stage process with Glowroad, Byjus, MediaMonks.",
  },
  {
    name: "Glowroad",
    kind: "interview",
    outcome: "Reached final rounds; declined after accepting CoinDCX",
    notes:
      "Some peers offered ~50% higher hike than CoinDCX; stuck to first-offer rule.",
  },
  {
    name: "Byjus",
    kind: "interview",
    outcome: "Reached final rounds; declined after accepting CoinDCX",
    notes: "Pre-CoinDCX parallel processes.",
  },
  {
    name: "MediaMonks",
    kind: "interview",
    outcome: "Reached final rounds; declined after accepting CoinDCX",
    notes: "Pre-CoinDCX parallel processes.",
  },
  {
    name: "Enthire",
    kind: "interview",
    role: "Platform screen (path into CoinDCX)",
    outcome: "Strong rating; forwarded toward CoinDCX",
    notes:
      "Job portal that ran a generic frontend JS+DSA screen (~45 mins), then routed resume to companies including CoinDCX. Not an employer.",
  },
];
