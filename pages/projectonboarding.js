import React from "react";
import clientPromise from "../lib/mongodb";
import { useState } from "react";

const CompanyProjects = ({ projects, users }) => {
  const projectdetails = projects?.[0]?.projects || [];
  const [mentoremail, setmentoremail] = useState("");
  const [assistemail, setassistemail] = useState("");
  console.log("user", users);

  const handlesend = async (assist, title) => {
    console.log("assist", assist);
    const assistDetails = users.find((user) => user.name === assist);
    if (assistDetails) {
      console.log("assist email:", assistDetails.email);
      setassistemail(assistDetails.email);
    }
    try {
      const response = await fetch("/api/assist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assistemail, title: title }),
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

  const handlementor = async (mentor, title) => {
    console.log("mentor", title);
    // settile(title);

    const mentorDetails = users.find((user) => user.name === mentor);
    if (mentorDetails) {
      console.log("mentor email:", mentorDetails.email);
      setmentoremail(mentorDetails.email);
    }
    try {
      const response = await fetch("/api/sendmentor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mentoremail, title: title }),
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
  console.log(mentoremail);
  console.log(assistemail);
  return (
    <div className="container mx-auto ">
      <h2 className="text-center mb-10 text-teal-700  font-extrabold text-2xl">
        Project onboarding{" "}
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-2 border-b">S.No</th>
              <th className="py-2 px-2 border-b">Project Name</th>
              <th className="py-2 px-2 border-b">Assigned To</th>
              <th className="py-2 px-2 border-b">Assist</th>
              <th className="py-2 px-2 border-b">Status</th>
              <th className="py-2 px-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {projectdetails.map((project, index) => (
              <tr key={project.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">{index + 1}</td>
                <td className="py-3 px-4 border-b">{project.name}</td>
                <td className="py-3 px-4 border-b">{project.assigned}</td>
                <td className="py-3 px-4 border-b">
                  {project.assist === "" ? "x" : project.assist}
                </td>
                <td className="py-3 px-4 border-b">{project.status}</td>
                <td className="py-3 px-4 border-b">
                  {project.assist ? (
                    <button
                      className="bg-green-500 text-black px-4 py-2 border-2 border-black rounded-md"
                      onClick={() => handlesend(project.assist, project.name)}
                    >
                      Onboarding
                    </button>
                  ) : (
                    <button
                      className="bg-red-500 text-black border-2  border-black rounded-md px-4 py-2 "
                      onClick={() =>
                        handlementor(project.assigned, project.name)
                      }
                    >
                      Mentor
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  try {
    const client = await clientPromise;
    const db = client.db("projects");
    const test = client.db("test");

    const product = await db.collection("details").find({}).toArray();
    const users = await test.collection("users").find({}).toArray();

    return {
      props: {
        projects: JSON.parse(JSON.stringify(product)),
        users: JSON.parse(JSON.stringify(users)),
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { projects: [] },
    };
  }
}

export default CompanyProjects;
