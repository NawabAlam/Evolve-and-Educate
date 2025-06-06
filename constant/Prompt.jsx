import dedent from "dedent";

export default {
  IDEA: dedent`: As you are a coaching teacher
    - User wants to learn about the topic
    - Generate 5-7 course titles for study (Short)
    - Make sure it is related to the description
    - Output must be an ARRAY of Strings in JSON FORMAT only
    - Do not add any plain text in output
    - Ensure output is a well-formed JSON object
    `,

  COURSE: dedent`: As you are a coaching teacher
    - User wants to learn about all topics
    - Create 2 courses with Course Name, Description, and 5-8 Chapters in each course
    - Make sure to add chapters based on the selected topics
    - Each chapter should come from the list of selected topics provided in the prompt
    - List content in each chapter along with a description in 5 to 8 lines
    - Do not just explain what the chapter is about; explain in detail with examples
    - Generate content as structured data, ensuring correct JSON formatting
    - Provide courses at Easy, Moderate, and Advanced levels depending on topics
    - Add a Course Banner Image randomly from ('/banner1.png','/banner2.png','/banner3.png','/banner4.png','/banner5.png','/banner6.png')
    - Each course should belong to one category from: ["Tech & Coding", "Business & Finance", "Health & Fitness", "Science & Engineering", "Arts & Creativity"]
    - Generate 10 Quiz questions, 10 Flashcards, and 10 Question-Answer pairs
    - Ensure output is in valid JSON format only

    { // 🔹 ADDED explicit JSON wrapper to ensure correct structure
      "courses": [
        {
          "courseTitle": "<Intro to Python>",
          "description": "<Provide a concise course description>",
          "banner_image": "/banner1.png",
          "category": "<Category from the list>",
          "chapters": [
            {
              "chapterName": "<Chapter Name>",
              "content": [
                {
                  "topic": "<Topic Name (e.g., Creating Variables)>",
                  "explain": "<Detailed Explanation in 5 to 8 Lines>",
                  "code": "<Code example if required, else null>",
                  "example": "<Example if required, else null>"
                }
              ]
            }
          ],
          "quiz": [
            {
              "question": "<Sample question>",
              "options": ["a", "b", "c", "d"],
              "correctAns": "<Correct option>"
            }
          ],
          "flashcards": [
            {
              "front": "<Front side>",
              "back": "<Back side>"
            }
          ],
          "qa": [
            {
              "question": "<Question>",
              "answer": "<Answer>"
            }
          ]
        }
      ]
    } // 🔹 ADDED explicit JSON wrapper to match API response format
    `,
};
