import React from "react";
import { useRouter } from "next/router";

const Teammembersproject = ({ projects, username, meetings }) => {
  const selectedProject = projects[0]?.projects;
  const router = useRouter();
  console.log("meetings", meetings);

  const filteredProjects = selectedProject.filter(
    (project) => project.assigned === username || project.assist === username
  );
  console.log("filtered", filteredProjects);

  const handleProjectClick = (project) => {
    console.log("project", project);
    if (project) {
      // Push the project details to the new route
      router.push({
        pathname: "/teammemberprojectdetails",
        query: {
          projects: JSON.stringify(project),
          username: username,
          meetings: JSON.stringify(meetings),
        },
      });
    }
  };

  return (
    <div className="mt-8 shadow-lg px-4 py-4">
      <h2 className="text-2xl font-extrabold text-center text-teal-700 mb-4">
        Projects Assigned To You
      </h2>
      <p className="text-gray-600 mb-4 mt-8">
        Explore the projects you are assigned to or assisting with. Click on a
        project to view more details, including meetings associated with each
        project. Gain insights into project progress, collaborate with your
        team, and stay informed about upcoming meetings that play a crucial role
        in achieving project success.
      </p>

      <div className="flex flex-wrap">
        {filteredProjects.map((project) => (
          <div
            key={project._id}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 mb-4 p-4"
          >
            <div
              onClick={() => handleProjectClick(project)}
              className="bg-teal-700 text-white rounded overflow-hidden shadow-lg cursor-pointer"
            >
              <img
                src={project.img}
                alt={project.name}
                className="w-full h-48 object-cover"
              />
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{project.name}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Teammembersproject;
