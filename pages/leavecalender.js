import React, { useState } from "react";
import { useRouter } from "next/router";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import clientPromise from "../lib/mongodb";
import { format, startOfWeek, getDay } from "date-fns";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  startOfWeek,
  getDay,
  locales,
});

function Leavecalender({ Leave }) {
  const Holidayarray = Leave.filter((leave) => leave.type === "Holiday");
  console.log("Holiday", Holidayarray);
  const Ptoarray = Leave.filter((leave) => leave.type === "PTO");
  console.log("PTO", Ptoarray);

  const holidayEvents = Holidayarray.map((holiday) => ({
    start: new Date(holiday.date),
    end: new Date(holiday.date),
    title: `Holiday - ${holiday.name}`,
    tooltip: `Holiday: ${holiday.name}`,
    type: "Holiday",
  }));

  const leaveRequestEvents = Ptoarray.map((leave) => ({
    start: new Date(leave.newEvent.start),
    end: new Date(leave.newEvent.end),
    title: `Leave Request - ${leave.newEvent.reason}`,
    tooltip: `Start Date: ${format(
      new Date(leave.newEvent.start),
      "MM/dd/yyyy"
    )}
    End Date: ${format(new Date(leave.newEvent.end), "MM/dd/yyyy")}
    Reason: ${leave.reason}`,
    type: "LeaveRequest",
    status: leave.status,
  }));

  const router = useRouter();
  const { user, mentor } = router.query;

  const [newEvent, setNewEvent] = useState({ start: "", end: "", reason: "" });
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  const openLeaveModal = () => {
    setIsLeaveModalOpen(true);
  };

  const handleleave = async (e) => {
    setIsLeaveModalOpen(false);
    e.preventDefault();

    try {
      const response = await fetch("/api/submitLeave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newEvent,
          user,
          mentor,
          status: false,
          type: "PTO",
        }),
      });

      if (response.ok) {
        console.log("leave submitted");
      } else {
        console.error("error in submitting");
      }
    } catch (error) {
      console.error("Error submitting leave:", error.message);
    }
  };

  const eventStyleGetter = (event) => {
    if (event.type === "Holiday") {
      return {
        style: {
          backgroundColor: "green",
          color: "white",
        },
      };
    } else if (event.type === "LeaveRequest") {
      return {
        style: {
          backgroundColor: event.status ? "green" : "yellow",
          color: event.status ? "white" : "black",
        },
      };
    }

    return {};
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-teal-700 text-center text-2xl font-extrabold">
        LEAVE PORTAL
      </h2>
      <div className="ml-32 absolute right-20 items-center space-x-4 mb-4">
        <button
          className="bg-teal-500  text-white rounded p-2"
          onClick={openLeaveModal}
        >
          Leave
        </button>
      </div>

      <Calendar
        localizer={localizer}
        events={[...leaveRequestEvents, ...holidayEvents]}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: "50px" }}
        eventPropGetter={eventStyleGetter}
        tooltipAccessor="tooltip"
      />

      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <button
              className="relative bg-red-500 p-1 text-white left-80"
              onClick={() => setIsLeaveModalOpen(false)}
            >
              x
            </button>
            <h2 className="text-lg font-bold mb-4">Leave Request</h2>
            <div>
              <label htmlFor="startDate">Start Date:</label>
              <DatePicker
                id="startDate"
                className="border rounded p-2"
                selected={newEvent.start}
                onChange={(start) => setNewEvent({ ...newEvent, start })}
              />
            </div>
            <div className="mt-2">
              <label htmlFor="endDate">End Date:</label>
              <DatePicker
                id="endDate"
                className="border rounded p-2"
                selected={newEvent.end}
                onChange={(end) => setNewEvent({ ...newEvent, end })}
              />
            </div>
            <div className="mt-2">
              <label htmlFor="leaveReason">Reason for Leave:</label>
              <input
                type="text"
                id="leaveReason"
                className="border rounded p-2 w-full"
                value={newEvent.reason}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, reason: e.target.value })
                }
              />
            </div>
            <button
              className="bg-blue-500 text-white rounded p-2 mt-4"
              onClick={handleleave}
            >
              Submit Leave Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const client = await clientPromise;
    const db = client.db("leave");

    const product = await db.collection("details").find({}).limit(20).toArray();

    return {
      props: { Leave: JSON.parse(JSON.stringify(product)) },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { Leave: [] },
    };
  }
}

export default Leavecalender;
