import groq from "../config/groq.js";

export const analyzeResumeWithAI = async (resumeText, jobDescription) => {
    try {
const prompt = `
You are a Brutally Honest ATS System. Your goal is to filter out unqualified candidates. 
Be very strict with the atsScore. 

SCORING RULES (Follow strictly):
- 0-40: Poor match. Major skills missing or experience doesn't align at all.
- 41-60: Average. Has some skills but lacks core requirements.
- 61-80: Good. Matches most skills but missing some experience or advanced tools.
- 81-100: Exceptional. Perfect match in skills, years of experience, and relevant projects/FYP.

PENALTIES:
- Deduct 20 points if "Years of Experience" required in JD is more than what's in the Resume.
- Deduct 15 points if 3 or more "Core Skills" are missing.
- Deduct 10 points if the Summary is generic and not tailored to the JD.
Return ONLY a JSON object:
{
  "atsScore": number,
  "summary": "3-5 line impactful professional summary tailored to the JD",
  "missingSkills": ["skill 1", "skill 2"],
  "recommendations": ["Actionable tip 1", "Actionable tip 2"],
  "interviewQuestions": {
    "technical": ["5-7 deep technical questions based on JD"],
    "behavioral": ["3-5 situational questions"]
  },
  "parsedData": {
    "skills": ["all extracted skills"],
    "experience": "years and summary of experience",
    "education": "degree and major",
    "university": "university name",
    "home_town": "city",
    "name":"user name ",
    "email":"user email",
    "phoneNumber": "user phone Number",
    "interest": "core professional interests",
    "fyp": "Final Year Project title and brief tech stack used",
    "certifications": ["list of relevant certifications found"]
  }
}

Rules:
1. If FYP or Certs match the JD keywords, explain this in 'recommendations' as a strength.
2. Ensure the ATS score reflects the 'Project Boost' logic.
3. If no certifications are found, return an empty array.

Resume: ${resumeText}
Job Description: ${jobDescription}
`;
        const completion = await groq.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.1, // Precision ke liye temperature kam rakha hai
            response_format: { type: "json_object" } // Groq supports this for JSON output
        });                          

        let result = completion.choices[0].message.content;

        // Production-level check: Agar AI markdown backticks bhej de
        if (result.includes("```json")) {
            result = result.split("```json")[1].split("```")[0];
        } else if (result.includes("```")) {
            result = result.split("```")[1].split("```")[0];
        }

        return JSON.parse(result.trim());
    } catch (error) {
        console.error("AI Analysis Error:", error.message);
        throw new Error("AI Analysis failed: " + error.message);
    }
}; 