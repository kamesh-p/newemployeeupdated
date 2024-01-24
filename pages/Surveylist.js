import React, { useState } from "react";

const Surveylist = ({ form }) => {
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  const openSurveyDialog = (surveyDetails) => {
    setSelectedSurvey(surveyDetails);
  };

  const closeSurveyDialog = () => {
    setSelectedSurvey(null);
  };

  return (
    <div className="container mx-auto">
      {/* <h2 className="text-3xl font-bold mb-6">Survey List</h2> */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-2 border-b">Name</th>
              <th className="py-2 px-2 border-b">Mentor</th>
              {/* <th className="py-2 px-2 border-b">Survey</th> */}
              <th className="py-2 px-2 border-b">Command</th>
              <th className="py-2 px-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {form.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">
                  {item.user?.user?.user?.name}
                </td>
                <td className="py-3 px-4 border-b">
                  {item.user?.user?.user?.mentor}
                </td>

                <td className="py-3 px-4 border-b">{item.command}</td>
                <td className="py-3 px-4 border-b">
                  <button
                    className="bg-teal-500 text-white px-4 py-2 rounded-md"
                    onClick={() => openSurveyDialog(item)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Survey Dialog */}
      {selectedSurvey && (
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full sm:max-w-md">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-bold mb-2">Survey Details</h3>
                <div className="mt-4">
                  {Object.entries(selectedSurvey)
                    .filter(([key, value]) =>
                      ["your rating", "How do you", "Describe"].some((prefix) =>
                        key.startsWith(prefix)
                      )
                    )
                    .map(([key, value]) => (
                      <p key={key}>{`${key}: ${value}`}</p>
                    ))}
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={closeSurveyDialog}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-500 text-base font-medium text-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Surveylist;
