import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  const { diet, calories, allergies, pantry } = await req.json();

  const prompt = `
    Generate a weekly meal plan (Monday to Sunday) for a user with the following profile:
    - Diet: ${diet}
    - Daily Calories: ${calories}
    - Allergies: ${allergies.join(", ")}
    - Pantry Ingredients (Prioritize these): ${pantry.join(", ")}

    Return ONLY valid JSON in the following format:
    {
      "Monday": {
        "breakfast": { "id": "unique_id", "name": "Meal Name", "calories": 500, "protein": 30, "carbs": 40, "fat": 20, "ingredients": ["ing1", "ing2"], "instructions": ["step1", "step2"] },
        "lunch": { ... },
        "dinner": { ... }
      },
      ... (for all 7 days)
    }
    Do not include markdown formatting or explanations.
  `;

  try {
    // Try OpenAI first
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are a professional nutritionist and chef." }, { role: "user", content: prompt }],
      model: "gpt-4o",
      response_format: { type: "json_object" },
    });

    const plan = JSON.parse(completion.choices[0].message.content || "{}");
    return NextResponse.json(plan);
  } catch (openaiError) {
    console.error("OpenAI Error:", openaiError);
    
    try {
      // Fallback to Gemini
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log("Gemini Raw Response:", text); // Debug log

      // Clean up markdown code blocks if present
      let jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
      
      // Ensure we have valid JSON start/end
      const startIndex = jsonString.indexOf("{");
      const endIndex = jsonString.lastIndexOf("}");
      if (startIndex !== -1 && endIndex !== -1) {
        jsonString = jsonString.substring(startIndex, endIndex + 1);
      }

      const plan = JSON.parse(jsonString);
      
      return NextResponse.json(plan);
    } catch (geminiError) {
      console.error("Gemini Error:", geminiError);
      return NextResponse.json({ error: "API is not working, try again later" }, { status: 500 });
    }
  }
}
