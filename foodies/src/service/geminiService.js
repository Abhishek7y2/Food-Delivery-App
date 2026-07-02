// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(
//   import.meta.env.VITE_GEMINI_API_KEY
// );

// export const askGemini = async (question) => {
//   try {
//     const model = genAI.getGenerativeModel({
//       model: "gemini-2.5-flash"
//     });

//     const result = await model.generateContent(question);

//     return result.response.text();
//   } catch (error) {
//     console.error(error);
//     return "Sorry, I am unable to answer right now.";
//   }
// };