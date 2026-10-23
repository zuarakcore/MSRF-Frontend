import logo from "@/assets/logo.jpg.asset.json";
import argentinosCrest from "@/assets/arg.png";
import heroStadium from "@/assets/hero-stadium.jpg";
// Home "Three steps" images, in step order: dream -> training -> India jersey.
import journeyDream from "@/assets/journey-dream.jpg";
import journeyTraining from "@/assets/journey-training.jpg";
import journeyIndia from "@/assets/journey-india.jpg";
import train1 from "@/assets/train-1.jpg.asset.json";
import train2 from "@/assets/train-2.jpg.asset.json";
import train3 from "@/assets/train-3.jpg.asset.json";
import train4 from "@/assets/train-4.jpg.asset.json";
import ajVisit from "@/assets/aj-visit.jpg";
import contactBanner from "@/assets/contact-banner.webp";
import squad1 from "@/assets/squad-1.jpg.asset.json";
import squad2 from "@/assets/squad-2.jpg.asset.json";
import squadWide from "@/assets/squad-wide.jpg.asset.json";
// Argentinos Juniors delegation visit to Kozhikode.
import ajDelegationWelcome from "@/assets/aj/aj-delegation-welcome.webp";
import ajDelegationSeated from "@/assets/aj/aj-delegation-seated.webp";
import ajJerseyHandover from "@/assets/aj/aj-jersey-handover.webp";
import ajPitchPresentation from "@/assets/aj/aj-pitch-presentation.webp";
import ajRainCelebrationWide from "@/assets/aj/aj-rain-celebration-wide.webp";
import ajRainCelebration from "@/assets/aj/aj-rain-celebration.webp";
import ajMaradonaBook from "@/assets/aj/aj-maradona-book.webp";
import ajMaradonaBookCheer from "@/assets/aj/aj-maradona-book-cheer.webp";
import ajTeamStand from "@/assets/aj/aj-team-stand.webp";
import ajTeamStandWide from "@/assets/aj/aj-team-stand-wide.webp";

const url = (asset: unknown) => (asset as { url: string }).url;

export const img = {
  logo: url(logo),
  argentinosCrest: argentinosCrest.src,
  hero: heroStadium.src,
  journey: [journeyDream.src, journeyTraining.src, journeyIndia.src] as [string, string, string],
  training: [url(train1), url(train2), url(train3), url(train4)] as [
    string,
    string,
    string,
    string,
  ],
  ajVisit: ajVisit.src,
  contactBanner: contactBanner.src,
  squad: [url(squad1), url(squad2), url(squadWide)] as [string, string, string],
  aj: {
    delegationWelcome: ajDelegationWelcome.src,
    delegationSeated: ajDelegationSeated.src,
    jerseyHandover: ajJerseyHandover.src,
    pitchPresentation: ajPitchPresentation.src,
    rainCelebrationWide: ajRainCelebrationWide.src,
    rainCelebration: ajRainCelebration.src,
    maradonaBook: ajMaradonaBook.src,
    maradonaBookCheer: ajMaradonaBookCheer.src,
    teamStand: ajTeamStand.src,
    teamStandWide: ajTeamStandWide.src,
  },
};

export const club = {
  name: "Malabar Challengers Football Club",
  short: "Malabar Challengers FC",
  abbr: "MCFC",
  foundation: "Malabar Sports & Recreation Foundation",
  tagline: "We create professional footballers",
  kicker: "We are different",
  malayalam: "നമ്മുടെ സ്വന്തം",
  phone: "77 36 32 91 11",
  phoneHref: "+917736329111",
  email: "coo@msrf.co.in",
  website: "www.malabarchallengersfc.com",
  base: "Kozhikode, Keralam, India",
  hours: "Monday – Saturday · 10:00 AM – 5:00 PM",
  /** Official profile URLs. The footer shows an icon only for the ones filled in. */
  social: {
    instagram: "",
    facebook: "",
    youtube: "",
    x: "",
  },
};

export const heroStats = [
  { value: "U-20", label: "India team mission" },
  { value: "5 yrs", label: "To the National League" },
  { value: "AJ", label: "Argentinos Juniors partner" },
];

export const visionPillars = [
  {
    title: "Restore",
    body: "Restore Keralam's football prominence and elevate Indian football to international standards.",
    image: img.aj.rainCelebration,
  },
  {
    title: "Promote",
    body: "Promote a vibrant sports culture among youth and foster professionalism across the football industry.",
    image: img.aj.pitchPresentation,
  },
  {
    title: "Benchmarks",
    body: "Establish exceptional standards for other clubs and join the National League as a professional team within five years.",
    image: img.aj.jerseyHandover,
  },
  {
    title: "Enrich",
    body: "Enrich the overall Indian football ecosystem with a focus on professionalism and excellence.",
    image: img.aj.maradonaBookCheer,
  },
];

export const missionPillars = [
  {
    title: "World class training",
    body: "Establish a world-class grassroots academy to develop and nurture local talent, fostering ownership and community engagement among fans.",
  },
  {
    title: "Top tier coaching",
    body: "Implement top-tier coaching practices tailored to Indian conditions, ensuring the highest standards of training and development.",
  },
  {
    title: "Empowerment",
    body: "Give young boys and girls opportunities to lead productive lives by channelling their creative energy away from negative influences.",
  },
  {
    title: "Football over addiction",
    body: "Our mission is to inspire young minds to move away from destructive influences and towards a passion for football, discipline and a purposeful future.",
  },
  {
    title: "Comprehensive growth",
    body: "Promote proper nutrition and physical development while encouraging responsible parental involvement in every child's progress.",
  },
];

export const journey = [
  {
    step: "01",
    title: "A child's dream",
    body: "A ten-year-old, passionate about football, is selected into the MCFC Academy.",
    image: img.journey[0],
  },
  {
    step: "02",
    title: "Training",
    body: "The child trains with unwavering dedication, supported by comprehensive coaching at the MCFC Academy.",
    image: img.journey[1],
  },
  {
    step: "03",
    title: "Donning the India jersey",
    body: "That child becomes a member of the U-20 India team competing in the FIFA Cup.",
    image: img.journey[2],
  },
];

export const roadmap = [
  {
    year: "2024",
    title: "Elite coaching staff training",
    body: "Shaping top-tier coaches with cutting-edge, internationally accredited programmes supported by Argentinos Juniors coaches.",
  },
  {
    year: "2024",
    title: "Youth development programme",
    body: "Building tomorrow's football stars through expert youth development pathways.",
  },
  {
    year: "2028",
    title: "Development of professional team",
    body: "Transforming talent into elite professionals through strategic team development.",
  },
  {
    year: "2029",
    title: "Induction into the National League",
    body: "Executing our strategy to propel the team into the National Football League.",
  },
];

// Programmes (including dated events), team members and gallery photos are managed in the admin CMS and
// loaded from the backend's public API (see src/lib/api.ts).

export const partnership = {
  club: "Argentinos Juniors",
  nickname: "Semillero del Mundo — The World's Football Nursery",
  country: "Argentina",
  body: "Renowned for cultivating exceptional football talent and shaping future stars on the global stage. Argentinos Juniors partners MCFC on coach education, methodology and international exposure for our young players.",
  benefits: [
    {
      title: "Coach education",
      body: "Internationally accredited coaching curriculum delivered and audited by AJ staff.",
    },
    {
      title: "Methodology transfer",
      body: "The AJ training model adapted to Indian conditions across every academy age group.",
    },
    {
      title: "Player development",
      body: "Individual development plans, periodised loads and continuous technical review.",
    },
    {
      title: "International exposure",
      body: "Exchange visits, camps and friendly fixtures that put our players on a global stage.",
    },
  ],
};

export const trustPoints = [
  "Founded and governed by retired civil servants of the highest standing",
  "A not-for-profit Section 8 company — every rupee returns to the game",
  "Nutrition, education and welfare tracked alongside football",
  "Transparent progress reporting for every parent",
];
