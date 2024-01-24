import React, { useState } from "react";
import { useSelector } from "react-redux";

import clientPromise from "../../lib/mongodb";
import { useRouter } from "next/router";
import Teammembersproject from "../teammemberproject";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Link from "next/link";
const Teammemberdashboard = ({
  Users,
  forms,
  projects,
  survey,
  projectquestion,
}) => {
  console.log("question", projectquestion);
  const router = useRouter();
  const user = useSelector((state) => state.user);
  const loggined = user.user.user._id;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialog, setdialog] = useState(false);
  const [isreview, setreview] = useState(false);
  const [isprojectreview, setprojectreview] = useState(false);
  const [formDataproject, setFormDataproject] = useState({});

  // Function to handle changes in the input fields
  const handleAnswerChange = (questionLabel, answer) => {
    setFormDataproject((prevData) => ({
      ...prevData,
      [questionLabel]: answer,
    }));
  };

  const loggedInUserDetails = Users.find(
    (member) => member.userId === loggined
  );
  console.log("loggedin user:", loggedInUserDetails);

  const handledialog = () => {
    setreview(true);
  };

  const handleclose = () => {
    setdialog(false);
  };

  const email = user?.user?.user?.email;
  const id = user?.user?.user?.id;
  const name = user?.user?.user?.name;
  const servey = user?.user?.user.survey;
  const Role = user?.user?.user?.type;
  const mentor = user?.user?.user?.mentor;

  let meetingScheduled = forms.filter((f) => {
    return f.trainee === name;
  });
  console.log("is", meetingScheduled);

  let meetingcount = meetingScheduled.length;
  console.log("mee", forms, name);
  let reviewdetails = Users.filter((review) => {
    return review.user.user.user.name === name;
  });
  let reviewcommand = reviewdetails[0]?.command;
  console.log("review", reviewcommand);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  // State to manage the form data
  const [formData, setFormData] = useState({});

  const handleStarRatingChange = (questionId, rating) => {
    setFormData((prevData) => ({
      ...prevData,
      [questionId]: rating,
    }));
  };

  const HandleAnswerSubmit = async (e, projectTitle) => {
    e.preventDefault();
    console.log("forms::", formDataproject);
    console.log("forms::", projectTitle);
    setprojectreview(false);

    try {
      const response = await fetch("/api/updateAnswer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formDataproject,
          name,
          projectTitle,
          mentor,
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
  const [selectedProjectTitle, setSelectedProjectTitle] = useState("");

  const handleProjectClick = (title) => {
    setSelectedProjectTitle(title);

    setprojectreview(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("formmmm", formData);
    try {
      const formDataWithUserId = {
        ...formData,
        user: user,
        userId: id,
        command: "",
      };

      console.log("formDataWithUserId:", formDataWithUserId);

      const response = await fetch("/api/new-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataWithUserId),
      });

      if (response.ok) {
        console.log("Form submitted successfully!");
      } else {
        console.error("Error submitting form:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting form:", error.message);
    }
    setIsModalOpen(false);
  };
  console.log("user", user);

  const projectsurvey = projectquestion.filter((question) => {
    return (
      question.trainee.includes(name) && question.title === selectedProjectTitle
    );
  });
  console.log("pr", projectsurvey);
  const handleleave = () => {
    router.push({
      pathname: "/leavecalender",
      query: {
        user: name,
        mentor: mentor,
      },
    });
  };
  const handletimesheet = () => {
    router.push({
      pathname: "/timesheet",
      query: {
        user: name,
        mentor: mentor,
        userid: id,
      },
    });
  };
  const handlechangepassword = () => {
    router.push({
      pathname: "/changepassword",
      query: {
        user: name,
        mentor: mentor,
        userid: id,
      },
    });
  };

  return (
    <div>
      {/* <Header /> */}
      <h1 className="text-2xl font-extrabold mb-4 text-center  text-teal-700">
        Teammember Dashboard
      </h1>
      <div className="min-h-screen flex ">
        <div className="w-1/5  ml-5 mt-5 ">
          {email && name && (
            <div className="bg-gray-200 p-4 text-black">
              <h2 className="text-center text-teal-700 text-xl mb-5 font-extrabold">
                PERSONAL INFO
              </h2>
              <span className="font-bold text-black ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6 inline-block mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 13c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
                  />
                </svg>
              </span>
              <span className="text-black">{name}</span> <br />
              <br />
              <span className="font-bold  text-black">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6 inline-block mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 3l7 7L19 3"
                  />
                </svg>
              </span>
              <span className="text-black">{email}</span> <br /> <br />
              <span className="font-bold  text-black">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6 inline-block mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 21l-7-7M19 21l-7-7m7 7H5M6 3h14a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z"
                  />
                </svg>
              </span>
              <span className="text-black">{Role}</span> <br />
            </div>
          )}
          <div className="h-full   bg-gray-200">
            <h2 className="text-teal-700 font-extrabold text-center text-xl px-10 pt-10">
              DETAILS
            </h2>
            <br />
            <ul className="list-none text-black px-6">
              <li className="text-base text-black mb-5">Dashboard 📊</li>
              <br />
              <li className="text-base text-black mb-5">Review</li>
              <br />

              <li className="text-base text-black mb-5 cursor-pointer">
                Meeting{" "}
                <sup className="bg-red-700 text-white p-0.5 rounded-full">
                  {meetingcount}
                </sup>
              </li>
              <br />

              <li
                className="text-base text-black mb-5 cursor-pointer"
                onClick={handleleave}
              >
                Leave 🗓️
              </li>
              <li
                className="text-base text-black mb-5 mt-10 cursor-pointer"
                onClick={handletimesheet}
              >
                Timesheet 🗓️
              </li>
              <li
                className="text-base text-black mb-5 mt-10 cursor-pointer"
                onClick={handlechangepassword}
              >
                Changepassword
              </li>
              <br />
              <Link href="/chat">
                <li className="text-base text-black mb-5">Messages 💬</li>
              </Link>
              <br />
            </ul>
          </div>
        </div>

        <div className="flex-1  px-8">
          <div className="bg-white p-8 h-44 rounded shadow-md w-full">
            <div className="bg-gray-200 p-4 rounded-lg flex items-center justify-between">
              <div className="text-lg">
                {servey ? (
                  <>
                    <p>You've already filled the survey. Thank you!</p>
                    <p className="text-blue-500 cursor-pointer underline">
                      Click to see the review
                    </p>
                    <button
                      className="absolute  right-20 top-48 bg-teal-700 p-2 text-white px-2 py-1 rounded"
                      onClick={handledialog}
                    >
                      Review
                    </button>
                    {isreview && (
                      <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-gray-500 opacity-75 blur"></div>
                        <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
                          <div className="modal-content py-4 text-left px-6">
                            <div className="flex justify-between items-center pb-3">
                              <p className="text-2xl font-bold">
                                {reviewcommand !== ""
                                  ? reviewcommand
                                  : "No command"}
                              </p>
                              <button
                                className="modal-close cursor-pointer relative -top-7 -right-6 z-50 text-white bg-red-500   hover:bg-red-700"
                                onClick={() => setreview(false)}
                              >
                                <span className="text-3xl">×</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div>
                    <div>
                      <p>
                        Haven't filled the survey yet? Let us know your
                        thoughts!
                      </p>
                      <p className="text-blue-500 cursor-pointer underline">
                        Click Survey to fill
                      </p>
                    </div>
                    <div>
                      <button
                        onClick={toggleModal}
                        className="bg-teal-700 text-white absolute right-20 top-48 px-4 py-2 rounded-full"
                      >
                        Fill Survey
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* {!servey && (
              )} */}
            </div>
            {/* {isDialog && (
              <>
                <div className="fixed top-0 right-0 left-0 z-50 overflow-y-auto overflow-x-hidden hidden md:flex md:items-center md:justify-center ml-64 w-full h-[calc(100%-1rem)] max-h-full">
                  <div className="fixed inset-0 backdrop-blur bg-black bg-opacity-50">
                    <div className="relative p-4 w-full max-w-2xl max-h-full bg-opacity-80 ml-56 mt-20 bg-white dark:bg-gray-700">
                      <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          Terms of Service
                        </h3>
                        <button
                          type="button"
                          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                          data-modal-hide="default-modal"
                          onClick={handleclose}
                        >
                          <svg
                            className="w-3 h-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                          </svg>
                          <span className="sr-only">Close modal</span>
                        </button>
                      </div>

                      <div>
                        {survey.map((s) => {
                          <div>{s.text}</div>;
                        })}
                      </div>
                      <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <button
                          data-modal-hide="default-modal"
                          type="button"
                          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          I accept
                        </button>
                        <button
                          data-modal-hide="default-modal"
                          type="button"
                          className="ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )} */}

            {isModalOpen && (
              <div
                id="default-modal"
                tabIndex="-1"
                aria-hidden="true"
                className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center"
              >
                <div className="relative p-4 w-full max-w-2xl max-h-full">
                  <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Trainee Details
                      </h3>
                      <button
                        type="button"
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={toggleModal}
                      >
                        <svg
                          className="w-3 h-3"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 14"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                          />
                        </svg>
                        <span className="sr-only">Close modal</span>
                      </button>
                    </div>

                    <div className="p-4 md:p-5 space-y-4">
                      <div>
                        <p className="mb-4">
                          Please complete the self-survey form:
                        </p>
                        <form onSubmit={handleSubmit}>
                          {survey
                            .filter((q) =>
                              ["your rating", "How do you", "Describe"].some(
                                (prefix) => q.text.startsWith(prefix)
                              )
                            )
                            .map((q) => (
                              <div key={q._id}>
                                <p>{q.text}</p>
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((rating) => (
                                    <span
                                      key={rating}
                                      onClick={() =>
                                        handleStarRatingChange(q.text, rating)
                                      }
                                      className={`cursor-pointer ${
                                        rating > formData[q.text]
                                          ? "text-gray-300"
                                          : "text-yellow-500"
                                      }`}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}

                          <button
                            type="submit"
                            className="bg-teal-500 text-white px-4 py-2 w-full my-10 rounded hover:bg-teal-700"
                          >
                            Submit
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* project survey details */}

          <div className="container mx-auto bg-white shadow-md rounded-md p-6 mt-10">
            <h2 className="text-2xl font-extrabold text-center text-teal-700 mb-4">
              Project Details
            </h2>
            <p className="text-gray-600 my-5">
              Welcome to the project survey section! Here, you'll find surveys
              sent by your mentors that are associated with various projects.
              Explore and provide your valuable feedback to contribute to the
              success of each project.
            </p>

            <div className="flex flex-wrap">
              {projectquestion.map((e) => (
                <div key={e._id} className="w-1/3 p-2">
                  <button
                    className="text-white bg-teal-700 py-2 px-4  rounded-lg mt-4 w-full"
                    onClick={() => handleProjectClick(e.title)}
                  >
                    {e.title}
                  </button>
                </div>
              ))}
            </div>
          </div>
          {isprojectreview && (
            <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-gray-500 opacity-75 blur"></div>
              <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
                <div className="modal-content py-4 text-left px-6">
                  <button
                    className="modal-close cursor-pointer absolute right-96 z-50 bg-red-500 p-2 mx-10 rounded-lg text-white"
                    onClick={() => setprojectreview(false)}
                  >
                    <span className="">x</span>
                  </button>
                  <div className="justify-between items-center pb-3 w-full">
                    {projectsurvey.map((project) => (
                      <div key={project._id}>
                        <h2 className="text-center text-xl font-semibold">
                          {project.title}
                        </h2>
                        {project.questions.map((e, index) => (
                          <div key={index} className="mb-4">
                            <label className="block text-sm text-gray-700 mb-1">
                              {e}:
                            </label>
                            <input
                              type="text"
                              className="form-input w-full h-12 px-4 border rounded-md text-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                              onChange={(event) =>
                                handleAnswerChange(e, event.target.value)
                              }
                            />
                          </div>
                        ))}

                        <button
                          className="bg-teal-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-teal-600"
                          onClick={(event) =>
                            HandleAnswerSubmit(event, project.title)
                          }
                        >
                          <span className="w-full">Submit</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <Teammembersproject projects={projects} username={name} />
        </div>
      </div>
    </div>
  );
};
export async function getServerSideProps() {
  try {
    const client = await clientPromise;

    const db = client.db("form");
    const dbs = client.db("Meetings");
    const projects = client.db("projects");
    const question = client.db("question");
    const projectsurvey = client.db("questions");
    const product = await db.collection("members").find({}).limit(20).toArray();
    const products = await dbs
      .collection("events")
      .find({})
      .limit(20)
      .toArray();
    const projectsdetails = await projects
      .collection("details")
      .find({})
      .limit(20)
      .toArray();
    const survey = await question
      .collection("survey")
      .find({})
      .limit(20)
      .toArray();
    const projectquestions = await projectsurvey
      .collection("project")
      .find({})
      .limit(20)
      .toArray();

    return {
      props: {
        Users: JSON.parse(JSON.stringify(product)),
        forms: JSON.parse(JSON.stringify(products)),
        projects: JSON.parse(JSON.stringify(projectsdetails)),
        survey: JSON.parse(JSON.stringify(survey)),
        projectquestion: JSON.parse(JSON.stringify(projectquestions)),
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { Users: [] },
    };
  }
}

export default Teammemberdashboard;
