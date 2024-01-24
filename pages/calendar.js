import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import { useRouter } from "next/router";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import clientPromise from "../lib/mongodb";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Calender = ({ meetings }) => {
  const router = useRouter();
  const { user, trainees, title, id } = router.query;

  console.log("iser", id);
  const [newEvent, setNewEvent] = useState({
    title: title,
    start: "",
    end: "",
    trainee: trainees,
  });

  const [allEvents, setAllEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const meet = meetings.filter((e) => {
      return e.userid === id;
    });
    console.log("meet", meet);
    const formattedMeetings = meet.map((meeting) => ({
      ...meeting,
      start: new Date(meeting.start),
      end: new Date(meeting.end),
    }));

    setAllEvents(formattedMeetings);
  }, [meetings]);

  function handleAddEvent() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  const handleSaveEvent = async () => {
    setIsModalOpen(false);
    try {
      const response = await fetch("/api/submitMeeting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newEvent.title,
          start: newEvent.start,
          end: newEvent.end,
          trainee: newEvent.trainee,
          user: user,
          userid: id,
        }),
      });

      if (response.ok) {
        console.log("Form submitted successfully!");
      } else {
        console.error("Error submitting form:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting form:", error.message);
    }
  };

  return (
    <div className="container mx-auto p-8 relative">
      <h2 className="text-teal-700 text-center text-2xl font-extrabold">
        MEETING PORTAL
      </h2>
      <div className="ml-32 flex items-center space-x-4 mb-4">
        <button
          className="bg-teal-500  absolute right-20 text-white rounded p-2"
          onClick={handleAddEvent}
        >
          Meeting
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-filter backdrop-blur-md">
          <div className="bg-white w-96 p-6 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">Add Custom Event</h2>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">
                Title: <span>{title}</span>
              </label>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Start Date:</label>
              <DatePicker
                selected={newEvent.start}
                onChange={(date) => setNewEvent({ ...newEvent, start: date })}
                className="border rounded p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">End Date:</label>
              <DatePicker
                selected={newEvent.end}
                onChange={(date) => setNewEvent({ ...newEvent, end: date })}
                className="border rounded p-2 w-full"
              />
            </div>
            <span className="mb-4 bg-slate-200 p-1">{trainees}</span>

            <div className="flex justify-end">
              <button
                onClick={handleSaveEvent}
                className="bg-blue-500 text-white rounded p-2 mr-2"
              >
                Save Event
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-gray-500 text-white rounded p-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Calendar
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: "50px" }}
        views={["month"]}
        formats={{ eventTimeRangeFormat: () => null }}
        components={{
          event: ({ event }) => (
            <div>
              <p>{event.title}</p>
            </div>
          ),
        }}
      />
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

export default Calender;
