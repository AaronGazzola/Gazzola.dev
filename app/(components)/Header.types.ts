//-| File path: app/(components)/Header.types.ts

export interface YouTubeSubscriberData {
  subscriberCount: number;
}

export interface YouTubeAPIResponse {
  items: Array<{
    statistics: {
      subscriberCount: string;
    };
  }>;
}

export interface Testimonial {
  title: string;
  rating: string;
  dateRange: string;
  quote: string;
  amount: string;
  contractType: "Fixed price" | "Hourly";
  hourlyRate?: string;
  hours?: number;
}

export interface HeaderState {
  isExpanded: boolean;
  hasBeenCollapsed: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
  reset: () => void;
}

export const testimonials: Testimonial[] = [
  {
    title: "Next.js Supabase School Menu Feature Development",
    rating: "5.0",
    dateRange: "Jul 5, 2025 - Sep 22, 2025",
    quote:
      "Aaron was great and would definitely work with him in the future! Super communicative and completed the project above and beyond",
    amount: "$2,125.00",
    contractType: "Fixed price",
  },
  {
    title: "Kitcode Tests",
    rating: "5.0",
    dateRange: "Apr 14, 2025 - Apr 26, 2025",
    quote:
      "Aaron is a talented freelancer who makes an effort to understand the problems he is asked to solve.",
    amount: "$400.00",
    contractType: "Fixed price",
  },
  {
    title: "Kitcode improvements",
    rating: "5.0",
    dateRange: "Mar 29, 2025 - Apr 14, 2025",
    quote:
      "Aaron is an extremely talented and thoughtful developer who writes and engineers excellent code and is focused on a quality, maintainable deliverable.",
    amount: "$800.00",
    contractType: "Fixed price",
  },
  {
    title: "Mednotes Kitcodes",
    rating: "5.0",
    dateRange: "Mar 18, 2025 - Mar 27, 2025",
    quote:
      "Aaron is a highly conscientious and talented developer who really came through on my project(s). I look forward to working with him again many times!",
    amount: "$1,350.00",
    contractType: "Fixed price",
  },
  {
    title: "NextJS developer to pass Google Core Web Vitals",
    rating: "5.0",
    dateRange: "Nov 4, 2023 - Sep 4, 2024",
    quote:
      "Aaron is a great communicator and gets work done. He helped us with NextJs and other frameworks.",
    amount: "$35,565.81",
    contractType: "Hourly",
    hourlyRate: "$65.00",
    hours: 547,
  },
  {
    title: "Product development using Next.js/Ant D/Typescript/Supabase",
    rating: "5.0",
    dateRange: "Mar 25, 2024 - May 14, 2024",
    quote:
      "Great to work with Aaron. He understood what we were trying to achieve and was swiftly up and running on the project. He provided great value suggestions and came up…",
    amount: "$10,139.99",
    contractType: "Hourly",
    hourlyRate: "$65.00",
    hours: 156,
  },
  {
    title: "NextJS Engineer",
    rating: "5.0",
    dateRange: "Dec 7, 2021 - Dec 9, 2023",
    quote:
      "Aaron helped us create an MVP of a key feature of our product in an efficient manner. The scope of the contract grew as he continued delivering features and was very enjoyable to work with. I appreciated that he frequently sought feedback and worked to deliver a high quality product.",
    amount: "$218,441.66",
    contractType: "Hourly",
    hourlyRate: "$70.00",
    hours: 3251,
  },
  {
    title:
      "Firebase authentication and Realtime database with Next.js for an RPG Maker JavaScript game",
    rating: "5.0",
    dateRange: "Dec 18, 2021 - Nov 3, 2023",
    quote:
      "If you are going to work with any developer on Upwork, make sure it is Aaron. Why should you work with Aaron? 1) He has the ability to work on…",
    amount: "$4,322.67",
    contractType: "Hourly",
    hourlyRate: "$50.00",
    hours: 85,
  },
  {
    title: "Reporting dashboard for Facebook digital marketing agency",
    rating: "5.0",
    dateRange: "Dec 16, 2021 - Feb 12, 2022",
    quote:
      "Aaron is extremely professional & knowledge. Aaron sends video updates on all work that has been completed & at each step of the milestone. I would definitely work with Aaron…",
    amount: "$205.80",
    contractType: "Fixed price",
  },
  {
    title:
      "Board Game Company looking for PWA Developer for Fun Web App for existing Physical Game",
    rating: "5.0",
    dateRange: "Oct 27, 2021 - Dec 3, 2021",
    quote:
      "Working with Aaron has been a real pleasure. From the creative introduction, Aaron caught my attention by sending a video of himself talking about the project and the services we could provide. Fully understanding what we wanted to accomplish. Needless to say, we hired him. The contract was for a streamlined Progressive Web App to be used in connection with our board games. The application needed to be both visually appealing, responsive and contain an admin for us to moderate the game mechanics. Aaron delivered exactly what we requested. On time and with excellent results.",
    amount: "$1,876.00",
    contractType: "Fixed price",
  },

  {
    title: "Rainbow of Emotions web app",
    rating: "5.0",
    dateRange: "Jun 25, 2021 - Jul 14, 2021",
    quote:
      "Even though Aaron appeared to be alot younger and not as the experienced as the other Freelancers I feel so blessed that I chose him. His professionalism, insight and communication skills was exactly what I needed. Thankyou Aaron.",
    amount: "$1,980.00",
    contractType: "Fixed price",
  },
];
