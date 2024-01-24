import React, { useState } from "react";
import { useRouter } from "next/router";
import { startOfWeek, addDays, format } from "date-fns";
import clientPromise from "../lib/mongodb";

const Timesheet = ({ projects, leave }) => {
  const [timesheetData, setTimesheetData] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [hours, setHours] = useState();
  const [confirmation, setConfirmation] = useState(false);
  const router = useRouter();
  const { user, mentor, userid } = router.query;
  const projectdetails = projects[0]?.projects;

  const startDate = startOfWeek(new Date());
  const weekDates = Array.from({ length: 7 }, (_, index) =>
    format(addDays(startDate, index), "yyyy-MM-dd")
  );
  const weekarray = weekDates.map((date, index) => ({ date, index }));
  console.log("weekDates altered", weekarray);
  const holidayleave = leave.filter((e) => {
    return e.type === "Holiday";
  });
  const ptoarray = leave.filter((e) => {
    return e.type === "PTO";
  });
  console.log("holiday", ptoarray);
  console.log("timesheet", timesheetData);

  function filterObjectsWithSameDate(weekarray, holidayleave) {
    return weekarray.filter((obj1) =>
      holidayleave.some((obj2) => obj2.date === obj1.date)
    );
  }
  // function PTOfilterObjectsWithSameDate(weekarray, ptoarray) {
  //   return weekarray.filter((obj1) =>
  //     ptoarray.some((obj2) => obj2.date === obj1.date)
  //   );
  // }

  const filteredArray = filterObjectsWithSameDate(weekarray, holidayleave);
  // const filteredptoArray = PTOfilterObjectsWithSameDate(weekarray, ptoarray);
  // console.log("fiyyy", filteredptoArray);

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const handleInputChange = (dayIndex, type, value) => {
    const newData = [...timesheetData];
    const day = daysOfWeek[dayIndex];
    const currentDate = format(addDays(startDate, dayIndex), "yyyy/MM/dd");
    setDateValue(currentDate);

    const dayIndexInData = newData.findIndex((item) => item.day === day);
    const isHoliday = filteredArray.some((obj) => obj.index === dayIndex);

    if (dayIndexInData !== -1) {
      newData[dayIndexInData][type] = value;
    } else {
      newData.push({
        day,
        date: currentDate,
        [type]: isHoliday ? "Holiday" : value,
        project: selectedProject,
      });
    }

    setTimesheetData(newData);
  };

  const handleSubmit = () => {
    const newData = [...timesheetData];

    // Iterate through filteredArray and add holiday entries to timesheetData
    filteredArray.forEach((holiday) => {
      const dayIndexInData = newData.findIndex(
        (item) => item.day === daysOfWeek[holiday.index]
      );

      if (dayIndexInData === -1) {
        newData.push({
          day: daysOfWeek[holiday.index],
          date: holiday.date,
          hours: 10,
          command: "Holiday",
          project: selectedProject,
        });
      }
    });

    // Calculate total hours
    const totalHours = newData.reduce((acc, item) => {
      return acc + (parseInt(item.hours, 10) || 0);
    }, 0);

    setTimesheetData(newData);
    setHours(totalHours);
    setConfirmation(true);
  };

  const handletimesheet = async () => {
    try {
      const response = await fetch("/api/timesheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user,
          mentor: mentor,
          userid: userid,
          Timesheet: timesheetData,

          hours: hours,
          status: false,
        }),
      });

      if (response.ok) {
        console.log("Timesheet is submitted successfully");
      } else {
        console.log("Error in submitting the timesheet");
      }
    } catch (error) {
      console.error("Error:", error.message);
    }

    setConfirmation(false);
  };

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Project Id
              </th>
              {daysOfWeek.map((day, index) => (
                <th key={index} scope="col" className="px-6 py-3">
                  {`${day} ${weekDates[index]}`}
                </th>
              ))}
              <th scope="col" className="px-6 py-3">
                Submit
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
              <td className="px-6 py-4">
                <select
                  className="w-full border rounded py-1 px-2"
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(() => e.target.value)}
                >
                  <option value="">Select Project</option>
                  {projectdetails.map((project) => (
                    <option key={project.id} value={project.name}>
                      {project.name}
                    </option>
                  ))}
                  <option>Bench</option>
                </select>
              </td>
              {daysOfWeek.map((day, dayIndex) => (
                <React.Fragment key={dayIndex}>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      className="w-full border rounded py-1 px-2"
                      onChange={(e) =>
                        handleInputChange(dayIndex, "hours", e.target.value)
                      }
                      value={
                        filteredArray.some((obj) => obj.index === dayIndex)
                          ? 10
                          : timesheetData.find(
                              (item) => item.day === daysOfWeek[dayIndex]
                            )?.hours || ""
                      }
                    />
                    <textarea
                      id="message"
                      rows="4"
                      className={`block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                        filteredArray.some((obj) => obj.index === dayIndex)
                          ? "opacity-50"
                          : ""
                      }`}
                      placeholder="Command..."
                      value={
                        filteredArray.some((obj) => obj.index === dayIndex)
                          ? "Holiday"
                          : timesheetData.find(
                              (item) => item.day === daysOfWeek[dayIndex]
                            )?.command || ""
                      }
                      onChange={(e) =>
                        handleInputChange(dayIndex, "command", e.target.value)
                      }
                      disabled={filteredArray.some(
                        (obj) => obj.index === dayIndex
                      )}
                    ></textarea>
                  </td>
                </React.Fragment>
              ))}
              <td className="px-6 py-4">
                <button>{hours}</button>
                <button
                  onClick={handleSubmit}
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  Submit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        {confirmation && (
          <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-gray-500 opacity-75 blur"></div>
            <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
              <div className="modal-content py-4 text-left px-6">
                <div className="flex justify-between items-center pb-3">
                  <p className="text-2xl">CONFIRMATION</p>
                  <button
                    className="modal-close cursor-pointer relative -top-7 -right-6 z-50 text-white bg-red-500 hover:bg-red-700"
                    onClick={() => setConfirmation(false)}
                  >
                    <span className="text-3xl">×</span>
                  </button>
                </div>
                <p>
                  Check the entered fields are correct. Press the confirm button
                  so that we can send the details to your mentor for submission.
                </p>
              </div>
              <button
                onClick={handletimesheet}
                className="mt-4 px-4 py-2 bg-blue-500 text-white ml-40 rounded-md hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  try {
    const client = await clientPromise;
    const db = client.db("projects");
    const leave = client.db("leave");

    const users = await db.collection("details").find({}).limit(20).toArray();
    const leaveholiday = await leave
      .collection("details")
      .find({})
      .limit(20)
      .toArray();

    return {
      props: {
        projects: JSON.parse(JSON.stringify(users)),
        leave: JSON.parse(JSON.stringify(leaveholiday)),
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { projects: [] },
    };
  }
}

export default Timesheet;
