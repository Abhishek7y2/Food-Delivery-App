import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const sendChatMessage = async (message) => {
  const lowerMsg = message.toLowerCase().trim();

  // Try real Gemini API if key starts with valid format
  if (API_KEY && API_KEY.startsWith("AIza")) {
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const supportedModels = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash"];

      for (const modelName of supportedModels) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const prompt = `
You are Foodie Bot, a passionate, energetic food & health assistant for "Foodies".
The user says: "${message}"

Respond strictly in JSON format with exactly this structure:
{
  "reply": "Your engaging, friendly, interactive text response here. Ask follow up questions!",
  "recommendedFoods": ["Food Item 1", "Food Item 2"]
}
Only recommend items from these categories: Biryani, Burger, Cake, Ice cream, Pizza, Rolls, Salad.
Keep the tone fun, appetizing, and conversational with emojis!
`;
          const result = await model.generateContent(prompt);
          const text = result.response.text();
          
          let jsonStr = text;
          if (jsonStr.includes("```json")) {
            jsonStr = jsonStr.split("```json")[1].split("```")[0].trim();
          } else if (jsonStr.includes("```")) {
            jsonStr = jsonStr.split("```")[1].split("```")[0].trim();
          }
          
          return JSON.parse(jsonStr);
        } catch (mErr) {
          console.warn(`Model ${modelName} attempt failed:`, mErr);
        }
      }
    } catch (e) {
      console.warn("Gemini API call failed, switching to Foodie Engine:", e);
    }
  }

  // High-Quality Interactive Conversational AI Engine
  if (lowerMsg.includes("spicy") || lowerMsg.includes("hot") || lowerMsg.includes("masala") || lowerMsg.includes("fiery") || lowerMsg.includes("chili")) {
    return {
      reply: "Craving that extra heat? 🔥 We've got spicy delicacies that will set your tastebuds ablaze! Try our fiery **Spicy Jalapeno Burger**, zesty **Paneer Tikka Spice Pizza**, or authentic **Hyderabadi Dum Biryani** cooked with rich Indian spices! Do you prefer chicken or vegetarian?",
      recommendedFoods: ["Spicy Jalapeno Burger", "Paneer Tikka Spice Pizza", "Hyderabadi Dum Biryani"]
    };
  }

  if (lowerMsg.includes("biryani") || lowerMsg.includes("rice") || lowerMsg.includes("pulao") || lowerMsg.includes("dum")) {
    return {
      reply: "Ah, the royal aroma of Dum Biryani! 🍚 Slow-cooked to perfection with premium basmati rice & aromatic spices. Our top seller is the **Hyderabadi Dum Biryani** and the rich **Mutton Dum Biryani**! Are you ordering for lunch or dinner?",
      recommendedFoods: ["Hyderabadi Dum Biryani", "Mutton Dum Biryani", "Paneer Tikka Biryani"]
    };
  }

  if (lowerMsg.includes("burger") || lowerMsg.includes("zinger") || lowerMsg.includes("fast food") || lowerMsg.includes("patty")) {
    return {
      reply: "Burger craving detected! 🍔 Nothing hits the spot like our extra crunchy **Crispy Chicken Zinger Burger** or the mammoth **Monster Double Patty Burger** stacked with melted cheddar! Would you like cheese or extra bacon?",
      recommendedFoods: ["Crispy Chicken Zinger Burger", "Monster Double Patty Burger", "Double Cheese Veggie Burger"]
    };
  }

  if (lowerMsg.includes("pizza") || lowerMsg.includes("cheese") || lowerMsg.includes("italian") || lowerMsg.includes("crust")) {
    return {
      reply: "Pizza party time! 🍕 Savor the epic cheese pull on our **Four Cheese Alfredo Pizza** or the fiery **Pepperoni Feast Pizza**! Thin crust or thick cheese stuffed?",
      recommendedFoods: ["Four Cheese Alfredo Pizza", "Pepperoni Feast Pizza", "Margherita Fresh Basil Pizza"]
    };
  }

  if (lowerMsg.includes("roll") || lowerMsg.includes("wrap") || lowerMsg.includes("kathi") || lowerMsg.includes("burrito")) {
    return {
      reply: "Delicious wraps on the go! 🌯 Bite into a juicy **Chicken Kathi Roll** or our savory **Cheesy Butter Chicken Roll** wrapped in a hot buttery paratha with mint chutney!",
      recommendedFoods: ["Chicken Kathi Roll", "Cheesy Butter Chicken Roll", "Paneer Tikka Wrap"]
    };
  }

  if (lowerMsg.includes("cake") || lowerMsg.includes("sweet") || lowerMsg.includes("dessert") || lowerMsg.includes("ice cream") || lowerMsg.includes("chocolate")) {
    return {
      reply: "Indulge your sweet tooth! 🎂🍦 Treat yourself to our decadent **Rich Dark Chocolate Cake** or a creamy scoop of **Belgian Dark Chocolate Ice Cream**! Life is sweet, order dessert first!",
      recommendedFoods: ["Rich Dark Chocolate Cake", "Belgian Dark Chocolate Ice Cream", "Blueberry New York Cheesecake"]
    };
  }

  if (lowerMsg.includes("healthy") || lowerMsg.includes("salad") || lowerMsg.includes("diet") || lowerMsg.includes("protein") || lowerMsg.includes("calorie") || lowerMsg.includes("fit")) {
    return {
      reply: "Fueling up clean & green! 🥗 Check out our nutrient-dense **Grilled Chicken Avocado Salad** or superfood **Quinoa & Roasted Veggie Bowl**! Wholesome, crisp, and super refreshing!",
      recommendedFoods: ["Grilled Chicken Avocado Salad", "Quinoa & Roasted Veggie Bowl", "Greek Feta & Olive Salad"]
    };
  }

  if (lowerMsg.includes("paneer") || lowerMsg.includes("veg") || lowerMsg.includes("vegetarian")) {
    return {
      reply: "100% Pure Veg Goodness! 🧀 Try our tandoori-marinated **Paneer Tikka Biryani**, crunchy **Double Cheese Veggie Burger**, or rich **Paneer Tikka Wrap**! What's your favorite veg ingredient?",
      recommendedFoods: ["Paneer Tikka Biryani", "Double Cheese Veggie Burger", "Paneer Tikka Wrap"]
    };
  }

  if (lowerMsg.includes("chicken") || lowerMsg.includes("mutton") || lowerMsg.includes("meat") || lowerMsg.includes("non veg")) {
    return {
      reply: "Juicy non-veg feast incoming! 🍗🍖 Order our royal **Lucknowi Dum Biryani**, **Mutton Seekh Kebab Roll**, or crispy **Tandoori Chicken Supreme Pizza**!",
      recommendedFoods: ["Lucknowi Dum Biryani", "Mutton Seekh Kebab Roll", "Tandoori Chicken Supreme Pizza"]
    };
  }

  if (lowerMsg.includes("cheap") || lowerMsg.includes("budget") || lowerMsg.includes("price") || lowerMsg.includes("under") || lowerMsg.includes("offer")) {
    return {
      reply: "Great taste on a budget! 💰 Check out these tasty steals under ₹150:\n• **Classic Vanilla Bean Ice Cream** (₹100)\n• **Crispy Vegetable Spring Rolls** (₹120)\n• **Spicy Egg Kathi Roll** (₹140)!",
      recommendedFoods: ["Classic Vanilla Bean Ice Cream", "Crispy Vegetable Spring Rolls", "Spicy Egg Kathi Roll"]
    };
  }

  if (lowerMsg.includes("hi") || lowerMsg.includes("hello") || lowerMsg.includes("hey") || lowerMsg.includes("who are you") || lowerMsg.includes("bot")) {
    return {
      reply: "Hey there, foodie! 😋 I'm **Foodie Bot**, your personal dining assistant! Whether you're craving spicy biryanis, cheesy pizzas, juicy burgers, or sweet cakes, I'm here to help you pick the perfect meal! What are you craving right now?",
      recommendedFoods: ["Hyderabadi Dum Biryani", "Crispy Chicken Zinger Burger", "Four Cheese Alfredo Pizza"]
    };
  }

  // Default interactive response for any prompt
  return {
    reply: `Mmm, "${message}" sounds like a delicious idea! 😋 Let me suggest some of our top-rated dishes crafted fresh by our chefs! Would you like something spicy, cheesy, or sweet?`,
    recommendedFoods: ["Hyderabadi Dum Biryani", "Crispy Chicken Zinger Burger", "Rich Dark Chocolate Cake"]
  };
};