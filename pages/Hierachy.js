import React from "react";

const MemberCard = ({ name, role }) => (
  <div className="h-16 mb-4 items-center">
    <div className="w-40 h-max bg-gray-200 p-2 text-center rounded-md">
      <p className="text-gray-800 font-bold text-lg">{name}</p>
      <p className="text-sm">{role}</p>
    </div>
  </div>
);

const Hierachy = ({ Employeesdetails }) => {
  const teamLeads = Employeesdetails.filter((user) => user.type === "teamlead");
  const trainees = Employeesdetails.filter((user) => user.type !== "teamlead");

  return (
    <div className="flex flex-row items-center">
      <div className="container mx-auto text-center pt-10">
        {teamLeads.map((teamLead, index) => (
          <div key={teamLead._id} className="mb-8">
            <div>
              <MemberCard name={teamLead.name} role="Team Lead" />
            </div>
            <div className="flex flex-wrap">
              {trainees
                .filter((trainee) => trainee.mentor === teamLead.name)
                .map((trainee) => (
                  <React.Fragment key={trainee._id}>
                    <div
                      className={`relative flex justify-center items-center mb-4 ${
                        index > 0 ? "" : ""
                      }`}
                    >
                      <div className="-mt-6 border-l-2 absolute h-6 border-gray-400 top-0"></div>
                    </div>
                    <MemberCard name={trainee.name} role="Trainee" />
                  </React.Fragment>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hierachy;
