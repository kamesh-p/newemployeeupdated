import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import React from "react";
import clientPromise from "../lib/mongodb";

const Project = ({ answers, questionproject }) => {
  const router = useRouter();
  const project = JSON.parse(router.query.project);
  const trainee = JSON.parse(router.query.trainee);
  const userid = router.query.userid;
  const user = router.query.user;
  const [click, setClick] = useState(false);
  const [selectedTrainee, setSelectedTrainee] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [surveyQuestions, setSurveyQuestions] = useState(Array(6).fill(""));
  const [submittedQuestions, setSubmittedQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  console.log("projects:", userid);

  const id = project.id;
  const title = project.name;
  console.log("tt", title);
  const handlemeeting = () => {
    router.push({
      pathname: "/calendar",
      query: {
        user: user,
        trainees: project.assist,
        title: project.name,
        id: userid,
      },
    });
  };

  const handleSelectChange = (event) => {
    const selectedName = event.target.value;
    setSelectedTrainee(selectedName);
  };

  const handleButtonClick = async () => {
    setClick(true);
    setButtonDisabled(true);

    console.log("selectedtrainee, id", selectedTrainee, id);

    try {
      const response = await fetch("/api/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedTrainee,
          id,
          title: project.name,
        }),
      });

      if (response.ok) {
        console.log("Form submitted successfully!");
      } else {
        console.error("Error submitting form:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting form:", error.message);
    }
  };

  const handleQuestionChange = (index, event) => {
    const updatedQuestions = [...surveyQuestions];
    updatedQuestions[index] = event.target.value;
    setSurveyQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    if (newQuestion.trim() !== "") {
      const updatedQuestions = [...surveyQuestions, newQuestion];
      setSurveyQuestions(updatedQuestions);
      setNewQuestion("");
    }
  };

  const handleQuestionSubmission = async () => {
    try {
      const response = await fetch("/api/submitQuestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questions: surveyQuestions,
          user: user,
          trainee: trainee,
          title: title,
        }),
      });

      if (response.ok) {
        console.log("Survey questions submitted successfully!");
        setSubmittedQuestions(surveyQuestions);
      } else {
        console.error(
          "Failed to submit survey questions:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error submitting survey questions:", error);
    }
  };

  useEffect(() => {
    return () => setButtonDisabled(false);
  }, []);
  const answerFilter = answers.filter((ans) => {
    return ans.mentor === user && ans.projectTitle === title;
  });
  console.log("filtere projects:.....", answerFilter);
  return (
    <>
      <div className="container mx-auto mt-8 p-6 bg-white rounded-md flex">
        <div className="flex-1 pr-8">
          <h1 className="text-3xl text-teal-700 font-bold text-center mb-10">
            {project.name}
          </h1>

          <div className="grid grid-cols-4 gap-2">
            <div>
              <p className="text-gray-600">Start Date:</p>
              <p className="font-semibold text-teal-700">{project.startDate}</p>
            </div>
            <div>
              <p className="text-gray-600">End Date:</p>
              <p className="font-semibold text-teal-700">{project.endDate}</p>
            </div>
            {project.assist !== "" && (
              <button
                className="bg-teal-500 text-white h-max w-20 px-4 py-2 shadow-md hover:bg-teal-600"
                onClick={handlemeeting}
              >
                Meeting
              </button>
            )}
          </div>

          <div className="mt-4">
            <p className="my-10">{project.details}</p>
            <p className="text-gray-600">Assigned To:</p>
            <p className="font-semibold">{project.assigned}</p>
          </div>

          <div className="mt-4">
            <div className="flex flex-wrap mb-4">
              <p className="text-gray-600 mr-5">Technologies Used:</p>
              {project.technologies.map((e) => (
                <span
                  key={e}
                  className="bg-teal-700 text-white px-2 py-1 mr-2 mb-2 rounded"
                >
                  {e}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div>
          <img className="w-64 h-100" src={project.img} alt={project.name} />
        </div>
      </div>
      <div>
        {click && (
          <>
            <p className="mt-4">Selected assistant: {selectedTrainee}</p>
          </>
        )}
        {project.assist !== "" && (
          <>
            <p className="mt-4 ml-7">Assistant: {project.assist}</p>
          </>
        )}
        {project.assist === "" && (
          <h2 className="text-2xl text-center text-teal-700 font-bold mb-4">
            Project Survey Questions
          </h2>
        )}
        <div className="flex justify-between">
          <div className="w-1/2">
            {project.assist === "" && (
              <div className="mt-8 p-4 bg-white rounded-md shadow-md">
                {submittedQuestions.length > 0 ? (
                  <div>
                    <p className="text-gray-600">Submitted Questions:</p>
                    <ul>
                      {submittedQuestions.map((question, index) => (
                        <li key={index}>{question}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-10 text-lg">
                      Generate 6 Questions or more based on the questions :
                    </p>
                    <div className="flex flex-wrap mb-4">
                      {project.technologies.map((e) => (
                        <span
                          key={e}
                          className="bg-gray-200 px-2 py-1 mr-2 mb-2 rounded"
                        >
                          {e}
                        </span>
                      ))}
                    </div>
                    {surveyQuestions.map((question, index) => (
                      <div key={index} className="mb-2">
                        <input
                          type="text"
                          value={question}
                          onChange={(event) =>
                            handleQuestionChange(index, event)
                          }
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                          placeholder={`Question ${index + 1}`}
                        />
                      </div>
                    ))}
                    <div className="mb-2">
                      <input
                        type="text"
                        value={newQuestion}
                        onChange={(event) => setNewQuestion(event.target.value)}
                        placeholder="New Question"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                      />
                    </div>
                    <button
                      className="bg-teal-500 text-white p-2 rounded shadow-md hover:bg-teal-600"
                      onClick={handleAddQuestion}
                    >
                      +
                    </button>
                    <button
                      className="bg-teal-500 text-white p-2 ml-96 rounded shadow-md hover:bg-teal-600 "
                      onClick={handleQuestionSubmission}
                    >
                      Submit Questions
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="w-1/2">
            {!click && project.assist === "" && (
              <div className="mt-8 p-4 bg-white rounded-md shadow-md">
                <section className="p-4">
                  {answerFilter?.map((e) => (
                    <div
                      key={e._id}
                      className="mb-4 p-4 bg-gray-100 rounded-md"
                    >
                      <p className="text-xl font-bold text-center text-teal-700">
                        {e.name}
                      </p>
                      <p className="text-lg text-center my-5">
                        {e.projectTitle}
                      </p>
                      <ol className="list-decimal  pl-6">
                        {Object.entries(e.formDataproject).map(
                          ([key, value]) => (
                            <li key={key} className="my-3">
                              <strong>{key}:</strong> {value}
                            </li>
                          )
                        )}
                      </ol>
                    </div>
                  ))}
                </section>
                <label
                  htmlFor="traineeDropdown"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Trainee:
                </label>
                <select
                  id="traineeDropdown"
                  name="trainee"
                  value={selectedTrainee}
                  onChange={handleSelectChange}
                  className="mt-1 w-full block p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                >
                  {trainee.map((name, index) => (
                    <option key={index} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <button
                  className="bg-teal-500 text-white p-2 w-full rounded shadow-md hover:bg-teal-600 mt-2"
                  onClick={handleButtonClick}
                  disabled={buttonDisabled}
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  try {
    const client = await clientPromise;
    const db = client.db("answers");
    const question = client.db("questions");

    const existingQuestions = await db
      .collection("project")
      .find({})
      .limit(20)
      .toArray();
    const projects = await question
      .collection("project")
      .find({})
      .limit(20)
      .toArray();

    return {
      props: {
        answers: JSON.parse(JSON.stringify(existingQuestions)),
        questionproject: JSON.parse(JSON.stringify(projects)),
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { answers: [] },
    };
  }
}

export default Project;
