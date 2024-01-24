// pages/index.js
import React, { useState } from "react";
import clientPromise from "../lib/mongodb";

const GeneralSurvey = ({ existingQuestions }) => {
  const [questions, setQuestions] = useState(existingQuestions);
  const [newQuestion, setNewQuestion] = useState({ text: "", type: "soft" });

  const handleQuestionTextChange = (index, text) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].text = text;
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { ...newQuestion }]);
    setNewQuestion({ text: "", type: "soft" });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();

    try {
      const newQuestions = questions.filter(
        (question) => question.type === "soft" && question.text !== "New Question"
      );

      const response = await fetch("/api/updateSurvey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ questions: newQuestions }),
      });

      if (response.ok) {
        console.log("New questions submitted successfully.");
      } else {
        console.error("Failed to submit new questions.");
      }
    } catch (error) {
      console.error("Error submitting new questions:", error.message);
    }
  };

  return (
    <div className="">
      <div className="">
        <h2 className="text-2xl font-bold mb-4 text-center">Fresher Skill Assessment</h2>

        <form onSubmit={handlesubmit}>
          <div className="flex flex-wrap -mx-2">
            {questions.map((question, index) => (
              <div key={index} className="mb-4 px-2 w-1/3 ml-20">
                <label className="block text-sm font-medium text-gray-700">
                  Question {index + 1}
                </label>
                <input
                  type="text"
                  value={question.text}
                  onChange={(e) => handleQuestionTextChange(index, e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                  placeholder={`Enter Question ${index + 1}`}
                />
              </div>
            ))}
          </div>
          <div className="ml-96">
          <button
            type="button"
            onClick={handleAddQuestion}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Add Question
          </button>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-4 mt-4"
          >
            Submit Assessment
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  try {
    const client = await clientPromise;
    const db = client.db("question");

    const existingQuestions = await db
      .collection("survey")
      .find({})
      .limit(20)
      .toArray();

    return {
      props: { existingQuestions: JSON.parse(JSON.stringify(existingQuestions)) },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { existingQuestions: [] },
    };
  }
}

export default GeneralSurvey;
