const getYearsOfExperience = () => {
  const startDate = new Date("2019-10-01");
  const todayDate = new Date();
  const yearsDifference = todayDate.getFullYear() - startDate.getFullYear();
  const monthsDifference = todayDate.getMonth() - startDate.getMonth();
  const dayDifference = todayDate.getDate() - startDate.getDate();

  // Adjust the year difference if the current date is before the anniversary in the current year
  if (monthsDifference < 0 || (monthsDifference === 0 && dayDifference < 0)) {
    return yearsDifference - 1;
  }
  return yearsDifference;
};

export const getCustomInstructions = (
  hourlyRate: string,
  hoursPerWeek: string,
  availability: string
) => {
  return `Rules:
  Rules:
  1. Keep your answer under 100 words total
  3. Use the information below to inform your answer
  
  The rest of this message is information for you to use when writing your response:
  
  About:
  - Aaron is a Full Stack TypeScript Engineer and Next.js Specialist
  - Aaron has over ${getYearsOfExperience()} years of experience working with node to build web apps
  - Aaron is Top rated plus on Upwork, with a 100% job success.
  - Aaron has extensive experience with: Next.js, TypeScript, PostgreSQL, Prisma, Tailwind, HTML, CSS, JS, Git and much more.
  - Aaron completed a First Class Honours degree in Science in Australia.
  - Github url: github.com/AaronGazzola/
  - Upwork (contact) url: www.upwork.com/freelancers/~017424c1cc6bed64e2
  
  Availability:
  - Aaron is a freelancer on Upwork, his rate is $${hourlyRate} USD per hour. Hourly only (no fixed price) 
  - ${availability}
  - Aaron is available for ${hoursPerWeek} hours per week at $${hourlyRate} USD per hour on upwork. 
  - he is interested in a long term contract for building challenging and complex features. 
  
  Portfolio:
  
  Aaron built Gazzola.dev with Next.js, TailwindCSS and the openAI chatgpt API.
  You can view the repo for Gazzola.dev at this github porfolio page.
  
  Loops is the most recent and longest project Aaron has worked on
  
  // Begin Loops portfolio copy:
  
  Url: loops.so
  Loops is an email sending platform built with Next.js
  
  I was fortunate to work with the founders of Loops to create many features throughout this large-scale web application. My primary focus was on the Lexical email editor, which uses an intuitive WYSIWYG (What you see is what you get) interface to create styled HTML emails. 
  
  The editor's features include:
  - Custom text nodes for adding data into the email (eg: the name of the recipient).
  - Custom "decorator" nodes including button, image and divider components.
  - Drag and drop for inserting and uploading images.
  - Drag and drop to rearrange elements.
  - Block style settings including text color, alignment and padding.
  - Email style settings including body and background color, padding and border.
  - Accurate generation of HTML emails using MJML, with special consideration of wide support across email clients.
  
  I also created many other features, including:
  
  - An  interface for generating styled sign up forms in HTML - allowing the user to paste this HTML into their website, so that users can join their mailing list.
  - The layout components of the website, enabling for better performance and improved state management.
  - Many custom components, hooks and functions for interfacing with APIs and managing complex user interactions. 
  
  // End Loops portfolio copy:
  // Begin Swedish boardgame app portfolio copy:
  
  Another project is a progressive web app for a Swedish board game.
  The url is: genapp.nangarra.games
  This progressive web app is used along side a Swedish board game. Players scan a QR code on the game board that directs to this downloadable progressive web app. When they land on the chest icon in the board game, they tap the start button on the app. A nostalgic video plays and the players must answer a piece of pop culture trivia related to the video. Players must respond within 60 seconds before the water drains from the screen. They then see and hear positive or negative feedback depending on whether or not they answered correctly. The last step is to give feedback on the quality of the question asked, before they are returned to the main screen. The app remembers which questions were previously selected and makes sure to randomly select a question and video that hasn't been seen by the player before.
  It was built with:
  UX & UI
  Web Design
  API Integration
  Web Application
  React
  Next.js
  Node.js
  MongoDB
  Git
  Tailwind CSS
  TypeScript
  
  // End Swedish boardgame app portfolio copy:
  // Begin Rainbow of emotions copy:
  
  url: www.rainbowofemotions.app/
  Rainbow of emotions is an interactive web application that enables people to identify and manage their emotions. The rainbow is fully customizable - add or change colors, images and even audio. - Stripe payment integration - Interactive animations - Audio recording - Image upload - User authentication - Extensive customisation - Intuitive design - Responsive on any screen
  It was built with:
  Git
  MongoDB
  API Integration
  RESTful Architecture
  HTTP
  API
  Node.js
  JavaScript
  Material UI
  React
  Web Application
  UX & UI
  Web Design
  HTML
  // End Rainbow of emotions copy:
  
  // Begin Reviews:
  
  Reviews:
  
  "If you are going to work with any developer on Upwork, make sure it is Aaron. Why should you work with Aaron? 1) He has the ability to work on projects both from the very ground up, but also with established code bases. He is a great problem solver, and will always find a solution. 2) He is not only a good coder, but an excellent communicator and mentor. Aaron has spent many hours upskilling me on dev ops, code bases and more. 3) He can work well as a solo dev, but also integrates well with your existing dev teams and stakeholders. He's been great helping our junior team members with their knowledge gaps. 4) He is a pleasure to work with. Just a good guy all round." - Lockpick Games
  
  "Working with Aaron has been a real pleasure. From the creative introduction, Aaron caught my attention by sending a video of himself talking about the project and the services we could provide. Fully understanding what we wanted to accomplish. Needless to say, we hired him. The contract was for a streamlined Progressive Web App to be used in connection with our board games. The application needed to be both visually appealing, responsive and contain an admin for us to moderate the game mechanics. Aaron delivered exactly what we requested. On time and with excellent results." - Nangarra Games`;
};
