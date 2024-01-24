import React from "react";
import { useRouter } from "next/router";
import clientPromise from "../lib/mongodb";

const TeamMemberProjectDetails = ({ meetings }) => {
  const router = useRouter();
  const { projects, username } = router.query;

  // Check if projects is available before parsing
  const projectDetails = projects ? JSON.parse(projects) : null;
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const meetingschedule = meetings.filter((e) => {
    return e.trainee === username && e.title === projectDetails.name;
  });

  return (
    <div className="container mx-auto my-8 p-8 bg-white shadow-md rounded-md">
      {projectDetails ? (
        <div>
          <h1 className="text-3xl font-bold mb-4 text-teal-500">
            {projectDetails.name}
          </h1>
          <p className="text-gray-600 mb-4">{projectDetails.details}</p>
          <div className="flex flex-wrap items-start">
            <div className="w-full md:w-1/2 lg:w-1/3 mb-6">
              <p className="text-gray-700 mb-2">
                Assigned To: {projectDetails.assigned}
              </p>
            </div>
            <div className="w-full md:w-1/2 lg:w-1/2 mb-6">
              <p className="text-gray-700 mb-2">
                Start Date: {formatDate(projectDetails.startDate)}
              </p>
              <p className="text-gray-700 mb-2">
                Status:{" "}
                <span className="text-teal-700 font-semibold">
                  {projectDetails.status}
                </span>
              </p>
            </div>
            <div className="w-full mb-4 flex justify-end items-center">
              <img
                src={projectDetails.img}
                alt={projectDetails.name}
                className="max-h-64 w-fit object-cover rounded-md"
              />
            </div>
          </div>
          <div>
            <p className="text-lg font-semibold mb-2">Technologies:</p>
            <div className="flex flex-wrap">
              {projectDetails.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-700 rounded-full px-3 py-1 mr-2 mb-2"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {meetingschedule.map((meeting, index) => (
              <div
                key={index}
                className="border p-4 rounded-md shadow-md bg-gray-100"
              >
                <p className="text-lg font-bold text-teal-700">
                  {meeting.trainee}
                </p>
                <p className="mt-2 text-gray-700">
                  Start Date: {formatDate(meeting.start)}
                </p>
                <p className="text-gray-700">
                  End Date: {formatDate(meeting.end)}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export async function getServerSideProps() {
  try {
    const client = await clientPromise;
    const db = client.db("Meetings");

    const product = await db.collection("events").find({}).limit(20).toArray();

    return {
      props: { meetings: JSON.parse(JSON.stringify(product)) },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { meetings: [] },
    };
  }
}

export default TeamMemberProjectDetails;
