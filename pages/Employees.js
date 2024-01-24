import React, { useState } from "react";

const Employees = ({ Employeesdetails }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const teammember = Employeesdetails.filter(
    (e) =>
      e.type === "teammember" &&
      e.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const teamlead = Employeesdetails.filter(
    (e) =>
      e.type === "teamlead" &&
      e.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const openEmployeeDetails = (employee) => {
    setSelectedEmployee(employee);
  };

  const closeEmployeeDetails = () => {
    setSelectedEmployee(null);
  };

  return (
    <div className="mt-10 mx-10">
      <form className="flex items-center absolute right-5">
        <label htmlFor="simple-search" className="sr-only">
          Search
        </label>
        <div className="relative w-60 ">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 18 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
              />
            </svg>
          </div>
          <input
            type="text"
            id="simple-search"
            value={searchQuery}
            onChange={handleSearchChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search branch name..."
            required
          />
        </div>
        <button
          type="submit"
          className="p-2.5 ms-2 text-sm font-medium text-white bg-teal-700 rounded-lg border border-teal-800 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-800 dark:bg- dark:hover:bg-teal-700 dark:focus:ring-black"
        >
          <svg
            className="w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
          <span className="sr-only">Search</span>
        </button>
      </form>

      {/* Team Members Section */}
      <div className="mb-8 mt-10">
        <h2 className="text-2xl font-bold mb-4">Team Members</h2>
        <div className="grid grid-cols-5 gap-4">
          {teammember.length === 0 ? (
            <p>No team members found.</p>
          ) : (
            teammember.map((member) => (
              <div key={member.id} className="flex items-center">
                <button
                  className="bg-white mt-5 text-black rounded px-4 py-2 hover:bg-gray-50 shadow-lg focus:outline-none focus:ring focus:border-gray-300"
                  onClick={() => openEmployeeDetails(member)}
                >
                  {member.name}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Team Leads Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4 mt-10">Team Leads</h2>
        <div className="grid grid-cols-5 gap-4">
          {teamlead.length === 0 ? (
            <p>No team leads found.</p>
          ) : (
            teamlead.map((lead) => (
              <div key={lead.id} className="flex items-center">
                <button
                  className="bg-white mt-5 text-black rounded px-4 py-2 hover:bg-gray-50 shadow-lg focus:outline-none focus:ring focus:border-gray-300"
                  onClick={() => openEmployeeDetails(lead)}
                >
                  {lead.name}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Employee Details Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div
            className="bg-black bg-opacity-50 absolute inset-0"
            onClick={closeEmployeeDetails}
          ></div>
          <div className="bg-white p-10 w-fit rounded-lg z-10">
            <h2 className="text-xl font-extrabold text-center text-teal-700 mb-2">
              {selectedEmployee.name}
            </h2>
            <p className="my-2">Email: {selectedEmployee.email}</p>
            {selectedEmployee.type === "teammember" ? (
              <p className="my-2">Mentor: {selectedEmployee.mentor}</p>
            ) : (
              <div className="my-2">
                <p>Trainees:</p>
                <ul>
                  {selectedEmployee.trainee.map((t) => (
                    <li key={t.id}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="my-2">
              Servey: {selectedEmployee.servey ? "true" : "false"}
            </p>

            <button
              className="bg-teal-500 text-center justify-center text-white rounded px-4 py-2 mt-4 w-full hover:bg-teal-600 focus:outline-none focus:ring focus:border-blue-300"
              onClick={closeEmployeeDetails}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
