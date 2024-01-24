import React from "react";
import { useRouter } from "next/router";
import { format } from "date-fns"; // Import date-fns for date formatting

const Meetings = () => {
  const router = useRouter();
  const { user, id, meetings } = router.query;

  // Check if user and meetings are defined
  if (!user || !meetings) {
    return <div>Invalid URL or missing parameters</div>;
  }

  const meetingArray = JSON.parse(meetings);
  const meetingsScheduled = meetingArray.filter((e) => e.user === user);

  console.log("name and id", meetingsScheduled);

  return (
    <div>
      <h1 className="text-center text-teal-700 text-2xl font-extrabold my-5">
        Meetings
      </h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Start Time
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              End Time
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Trainee
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {meetingsScheduled.map((meeting) => (
            <tr key={meeting._id}>
              <td className="px-6 py-4 whitespace-no-wrap">{meeting.title}</td>
              <td className="px-6 py-4 whitespace-no-wrap">
                {format(new Date(meeting.start), "MMMM d, yyyy HH:mm:ss")}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap">
                {format(new Date(meeting.end), "MMMM d, yyyy HH:mm:ss")}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap">
                {meeting.trainee}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Meetings;
