import React, { useState } from "react";
import { useSelector } from "react-redux";
import clientPromise from "../lib/mongodb";
import Link from "next/link";

import { useRouter } from "next/router";

const Teamleaddashboard = ({ Users, forms, leave, questions, meetings }) => {
  const details = forms[0].projects;
  console.log("forms", meetings);

  const user = useSelector((state) => state.user);

  const [command, setCommand] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const email = user?.user?.user?.email;
  const name = user?.user?.user?.name;
  const iduser = user?.user?.user?.id;
  console.log(iduser);

  const assistArray = user?.user?.user?.trainee || [];
  const router = useRouter();
  console.log("selected user", selectedUser);
  const selectiontrainee = selectedUser?.userName;
  console.log("User", Users);
  const surveylist = Users.filter((e) => {
    return e.user?.user?.user.name === selectiontrainee;
  });
  console.log("survey:", surveylist);
  let leaverequest = leave.filter((i) => {
    return i.mentor === name;
  });
  console.log("leave detils...", leaverequest.length);
  const handleProjectClick = (project) => {
    router.push({
      pathname: "/project",
      query: {
        project: JSON.stringify(project),
        trainee: JSON.stringify(assistArray),
        user: name,
        userid: iduser,
      },
    });
  };
  const handlemeetingClick = () => {
    router.push({
      pathname: "/meetings",
      query: {
        id: iduser,
        user: name,
        meetings: JSON.stringify(meetings),
      },
    });
  };
  const meetingsscheduled = meetings.filter((meet) => {
    return meet.user === name;
  });
  console.log("fil", meetingsscheduled?.length);
  const handleleaverequest = () => {
    router.push({
      pathname: "/leaverequest",
      query: {
        user: name,
      },
    });
  };
  const handletimesheet = () => {
    router.push({
      pathname: "/leadtimesheet",
      query: {
        user: name,
        id: iduser,
      },
    });
  };

  let filteredUsers = details.filter((user) => {
    return user.assigned === name;
  });
  console.log("asssis", filteredUsers);
  console.log("asssis fsf", assistArray);

  const handleUserButtonClick = (userName, id) => {
    setIsModalOpen(true);
    console.log("id", id);
    setSelectedUser({ userName, id });
  };

  const handleCommandChange = (e) => {
    setCommand(e.target.value);
  };
  const userid = selectedUser?.id;
  console.log("sele", surveylist);
  const handlechangepassword = () => {
    router.push({
      pathname: "/changepassword",
      query: {
        user: name,

        userid: iduser,
      },
    });
  };

  const handleExecuteCommand = async () => {
    try {
      // Make a POST request to the API route
      const response = await fetch("/api/updateCommand", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid,
          command,
        }),
      });

      if (response.ok) {
        console.log("Command executed successfully");
      } else {
        console.error("Failed to execute command:", response.statusText);
      }
    } catch (error) {
      console.error("Error executing command:", error);
    }
    console.log("user", userid, command);
    setIsModalOpen(false);
  };

  const matchingUsers = assistArray.map((assistUserName) => {
    const user = Users.find(
      (u) => u?.user?.user?.user?.name === assistUserName
    );
    console.log("matchinguser", user);

    if (user) {
      console.log("kkkkkkk", user._id);
      return (
        <>
          <div key={assistUserName} className="ml-4 w-full h-10">
            <div>
              <button
                onClick={() =>
                  handleUserButtonClick(
                    assistUserName,

                    user._id
                  )
                }
                className="bg-teal-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-teal-600"
                type="button"
              >
                <p className=""> {assistUserName}</p>
              </button>
              <></>
              {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gray-500 opacity-75 blur"></div>
                  <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
                    <div className="modal-content py-4 text-left px-6">
                      <div className="flex justify-between  items-center pb-3">
                        <p className="text-2xl text-center  text-teal-700 font-bold">
                          General Survey
                        </p>
                        <button
                          className="modal-close cursor-pointer z-50"
                          onClick={() => setIsModalOpen(false)}
                        >
                          <span className="text-3xl">×</span>
                        </button>
                      </div>
                      {surveylist.map((survey, index) => (
                        <div key={index}>
                          {Object.entries(survey)
                            .filter(([key, value]) =>
                              ["your rating", "How do you", "Describe"].some(
                                (prefix) => key.startsWith(prefix)
                              )
                            )
                            .map(([key, value]) => (
                              <p
                                className="my-3"
                                key={key}
                              >{`${key}: ${value}`}</p>
                            ))}
                        </div>
                      ))}

                      <div className="space-y-4">
                        <div className="mb-6">
                          <textarea
                            id="command"
                            className="border rounded w-full h-20 p-2 resize-none"
                            value={command}
                            onChange={handleCommandChange}
                          />
                        </div>

                        <button
                          className="bg-teal-700 w-full text-white px-4 py-2  mb-5 rounded"
                          onClick={handleExecuteCommand}
                        >
                          Execute Command
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      );
    }

    return null;
  });

  return (
    <>
      <div className="min-h-screen flex ">
        <div className="w-full  h-90 ">
          <div className="flex">
            <div className="">
              <div className=" w-52p-4 rounded-lg shadow-md">
                {email && name && (
                  <div>
                    <div className="bg-gray-200  text-black font-semibold py-6">
                      <h2 className="text-teal-700 text-lg mb-5 text-center font-extrabold">
                        PERSONAL INFO
                      </h2>
                      <span className="font-bold  ">
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
                      <span className="text-center">{name}</span> <br />
                      <br />
                      <span className="font-bold">
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
                      <span className="">{email}</span> <br /> <br />
                      <span className="  text-gray-700">
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
                        <span>
                          Number of Trainees: <span>{assistArray.length}</span>
                        </span>
                        <br />
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-200 w-56 p-4 h-full border-r text-gray-600 border-gray-300">
                <ul className="list-none pl-0">
                  <h2 className="text-teal-700 text-xl text-center mb-10 font-extrabold">
                    DETAILS
                  </h2>
                  <li className="text-lg font-semibold mb-9 flex items-center">
                    <span>Employee Data 📊</span>
                  </li>
                  <li
                    onClick={() => {
                      handlemeetingClick();
                    }}
                    className="text-lg font-semibold mb-9 flex items-center"
                  >
                    <span>
                      Meeting ⏰
                      <sup className="p-1 bg-red-600 font-sm h-4 rounded-lg text-white">
                        {meetingsscheduled?.length}
                      </sup>
                    </span>
                  </li>
                  <li className="text-lg font-semibold  mb-9 flex items-center">
                    <span>Performance Metrics 🚀</span>
                  </li>
                  <li
                    onClick={handleleaverequest}
                    className="text-base  mb-9 flex items-center cursor-pointer"
                  >
                    <span className="text-lg font-semibold">
                      Leave Requests
                      <sup className="bg-red-500 text-white mb-3 rounded-full p-1">
                        {leaverequest.length}
                      </sup>
                    </span>
                  </li>
                  <li
                    onClick={handletimesheet}
                    className="text-base  mb-9 flex items-center cursor-pointer"
                  >
                    <span className="text-lg font-semibold">Timesheet</span>
                  </li>
                  <li
                    className="text-lg font-semibold  mb-9 flex items-center cursor-pointer"
                    onClick={handlechangepassword}
                  >
                    Changepassword
                  </li>
                  <Link href="/chat">
                    <p className="text-lg font-semibold">Message </p>
                  </Link>
                </ul>
              </div>
            </div>

            <div className="w-full ">
              <div className="container bg-white rounded-lg shadow-md mx-auto px-4 py-6">
                <h3 className="text-teal-700 text-center font-extrabold text-2xl mb-6">
                  TRAINEE DETAILS
                </h3>
                <p className="mb-6 ml-4  pr-10 text-gray-700 tracking-wide">
                  The Trainee Details container showcases trainees' general
                  surveys, offering insights into their performance. It serves
                  as a vital platform for team members and leads to review and
                  provide essential feedback, promoting continuous improvement
                  and collaboration within the team.
                </p>
                <div className="flex">{matchingUsers}</div>
              </div>
              <div className="mx-auto container rounded-lg bg-gray-50 mt-10 p-6 text-lg text-gray-700 tracking-wide shadow- leading-relaxed">
                {filteredUsers.length === 0 ? (
                  <h2 className="text-2xl text-teal-700 font-semibold text-center w-full">
                    NO PROJECT FOUND
                  </h2>
                ) : (
                  <>
                    <h1 className="text-2xl text-teal-700 ml-10 font-extrabold text-center mb-10 w-full">
                      PROJECT DETAILS
                    </h1>
                    {/* <p className="mb-6 ml-4  pr-10 text-gray-700 tracking-wide">
                      Explore diverse projects that fuel creativity and
                      collaboration. Each project tells a unique story,
                      fostering innovation and teamwork. Join us in the exciting
                      journey of transforming ideas into impactful solutions.
                    </p> */}
                  </>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
                  {filteredUsers.map((project) => (
                    <div
                      key={project.id}
                      className="max-w-xs mx-auto bg-teal-500 ml-3 border rounded-lg shadow overflow-hidden"
                      onClick={() => handleProjectClick(project)}
                    >
                      <a>
                        <img
                          className="w-full h-32 object-cover rounded-t-lg"
                          src={project.img}
                          alt={project.name}
                        />
                      </a>
                      <div className="bg-teal-500 text-white h-max p-4  shadow-md hover:bg-teal-600">
                        <h2 className="text-lg font-semibold mb-2">
                          {project.name}
                        </h2>
                        <hr className="my-3" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export async function getServerSideProps() {
  try {
    const client = await clientPromise;
    const db = client.db("projects");
    const ds = client.db("form");
    const leave = client.db("leave");
    const answers = client.db("questions");
    const Meetings = client.db("Meetings");

    const product = await db.collection("details").find({}).limit(20).toArray();
    const products = await ds
      .collection("members")
      .find({})
      .limit(20)
      .toArray();
    const membersleave = await leave
      .collection("details")
      .find({})
      .limit(20)
      .toArray();
    const answersproject = await answers
      .collection("project")
      .find({})
      .limit(20)
      .toArray();
    const events = await Meetings.collection("events")
      .find({})
      .limit(20)
      .toArray();

    return {
      props: {
        forms: JSON.parse(JSON.stringify(product)),
        Users: JSON.parse(JSON.stringify(products)),
        leave: JSON.parse(JSON.stringify(membersleave)),
        questions: JSON.parse(JSON.stringify(answersproject)),
        meetings: JSON.parse(JSON.stringify(events)),
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: {
        Users: [],
        forms: [],
      },
    };
  }
}
export default Teamleaddashboard;
