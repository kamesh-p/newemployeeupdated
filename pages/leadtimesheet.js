// Import necessary libraries
import React, { useState } from "react";
import clientPromise from "../lib/mongodb";
import { useRouter } from "next/router";

const Leadtimesheet = ({ timesheet }) => {
  const router = useRouter();
  const { user, id } = router.query;
  const [activeTab, setActiveTab] = useState("accepted");

  const filtertimesheet = timesheet.filter((e) => {
    return e.mentor === user;
  });
  const acceptfiltertimeshett = filtertimesheet.filter((e) => {
    return e.status === true;
  });
  const pendingfiltertimeshett = filtertimesheet.filter((e) => {
    return e.status === false;
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleAccept = async (timesheetId, user) => {
    try {
      const response = await fetch("/api/accepttimesheet", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ timesheetId }),
      });

      if (response.ok) {
        console.log("Timesheet accepted successfully.");
      } else {
        console.error("Failed to accept timesheet.");
      }
    } catch (error) {
      console.error("Error accepting timesheet:", error.message);
    }
    console.log(`Accepted timesheet with ID: ${timesheetId}`);
  };

  const handleDecline = async (timesheetId) => {
    try {
      const response = await fetch("/api/deletetimesheet", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ timesheetId }),
      });

      if (response.ok) {
        console.log("Timesheet deleted successfully.");
      } else {
        console.error("Failed to delete timesheet.");
      }
    } catch (error) {
      console.error("Error accepting timesheet:", error.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl mb-4 text-center text-teal-700 font-extrabold">
        Lead Timesheet
      </h1>
      <div>
        <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px">
            <li className="me-2">
              <a
                href="#"
                onClick={() => handleTabChange("accepted")}
                className={`inline-block p-4 border-b-2 border-transparent rounded-t-lg ${
                  activeTab === "profile"
                    ? "text-gray-600 border-gray-300"
                    : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                }`}
              >
                Accepted
              </a>
            </li>
            <li className="me-2">
              <a
                href="#"
                onClick={() => handleTabChange("pending")}
                className={`inline-block p-4 rounded-t-lg ${
                  activeTab === "dashboard"
                }`}
              >
                Pending
              </a>
            </li>
          </ul>
        </div>
        {activeTab === "accepted" && (
          <div className="mt-4">
            {acceptfiltertimeshett.map((entry) => (
              <div
                key={entry._id}
                className="border p-4 rounded-md shadow-md mb-4"
              >
                <div className="grid grid-cols-3 gap-4 my-5">
                  <p className="text-lg font-semibold">
                    Username: {entry.user}
                  </p>
                  <p>{`Hours: ${entry.hours}`}</p>
                  <p>{`Status: ${entry.status ? "Accepted" : "Pending"}`}</p>
                </div>
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">Day</th>
                      <th className="py-2 px-4 border-b">Hours</th>
                      <th className="py-2 px-4 border-b">Project</th>
                      <th className="py-2 px-4 border-b">Command</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entry.Timesheet.map((day) => (
                      <tr key={day.date}>
                        <td className="py-2 px-4 border-b">{day.day}</td>
                        <td className="py-2 px-4 border-b">{day.hours}</td>
                        <td className="py-2 px-4 border-b">{day.project}</td>
                        <td className="py-2 px-4 border-b">{day.command}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
        {activeTab === "pending" && (
          <div className="mt-4">
            {pendingfiltertimeshett.map((entry) => (
              <div
                key={entry._id}
                className="border p-4 rounded-md shadow-md mb-4"
              >
                <div className="grid grid-cols-3 gap-4 my-5">
                  <p className="text-lg font-semibold">{entry.user}</p>
                  <p>{`Hours: ${entry.hours}`}</p>
                  <p>{`Status: ${entry.status ? "Accepted" : "Pending"}`}</p>
                </div>
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">Day</th>
                      <th className="py-2 px-4 border-b">Hours</th>
                      <th className="py-2 px-4 border-b">Project</th>
                      <th className="py-2 px-4 border-b">Command</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entry.Timesheet.map((day) => (
                      <tr key={day.date}>
                        <td className="py-2 px-4 border-b">{day.day}</td>
                        <td className="py-2 px-4 border-b">{day.hours}</td>
                        <td className="py-2 px-4 border-b">{day.project}</td>
                        <td className="py-2 px-4 border-b">{day.command}</td>
                      </tr>
                    ))}
                  </tbody>
                  <div className="flex  mt-4 space-x-4">
                    <button
                      onClick={() => handleAccept(entry._id, entry.user)}
                      className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleDecline(entry._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
                    >
                      Decline
                    </button>
                  </div>
                </table>
              </div>
            ))}
          </div>
        )}
        {activeTab === "pending" && pendingfiltertimeshett.length === 0 && (
          <p className="text-center mt-10 font-semibold">
            No Pending Timesheet
          </p>
        )}
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  try {
    const client = await clientPromise;
    const db = client.db("Timesheet");

    const timesheet = await db
      .collection("details")
      .find({})
      .limit(20)
      .toArray();

    return {
      props: {
        timesheet: JSON.parse(JSON.stringify(timesheet)),
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { timesheet: [] },
    };
  }
}

export default Leadtimesheet;
