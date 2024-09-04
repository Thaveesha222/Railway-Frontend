import React, { useState, useEffect } from "react";

const TrainLocation = () => {
  const [deviceIds, setDeviceIds] = useState([]); // To store the list of device IDs
  const [selectedDeviceId, setSelectedDeviceId] = useState(""); // To store the selected device ID
  const [gpsRecords, setGpsRecords] = useState([]); // To store the GPS records for the selected device
  const [intervalId, setIntervalId] = useState(null); // To store the interval ID for clearing it later

  useEffect(() => {
    // Fetch GPS records when the component mounts
    fetch("http://34.238.235.189/gpsRecords")
      .then((response) => response.json())
      .then((data) => {
        // Extract unique device IDs from the data
        const uniqueDeviceIds = [...new Set(data.map((record) => record.deviceId))];
        setDeviceIds(uniqueDeviceIds);
      })
      .catch((error) => console.error("Error fetching GPS records:", error));
  }, []);

  useEffect(() => {
    if (selectedDeviceId) {
      // Fetch data every second for the selected device ID
      const id = setInterval(() => {
        fetch("http://34.238.235.189/gpsRecords")
          .then((response) => response.json())
          .then((data) => {
            const filteredRecords = data.filter((record) => record.deviceId === selectedDeviceId);
            setGpsRecords(filteredRecords);
          })
          .catch((error) => console.error("Error fetching GPS records:", error));
      }, 1000);

      // Save the interval ID to clear it later
      setIntervalId(id);

      // Clear the interval when the component unmounts or device ID changes
      return () => clearInterval(id);
    }
  }, [selectedDeviceId]);

  const handleDeviceIdChange = (event) => {
    const deviceId = event.target.value;
    setSelectedDeviceId(deviceId);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Train Location Tracker</h1>

      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <label htmlFor="deviceId" style={{ marginRight: "10px", fontSize: "16px" }}>
          Select Device ID:
        </label>
        <select
          id="deviceId"
          value={selectedDeviceId}
          onChange={handleDeviceIdChange}
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            minWidth: "200px",
          }}
        >
          <option value="" disabled>
            -- Select a Device ID --
          </option>
          {deviceIds.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        {gpsRecords.length > 0 ? (
          <table
            style={{
              width: "50%",
              borderCollapse: "collapse",
              fontSize: "16px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Time</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Location</th>
              </tr>
            </thead>
            <tbody>
              {gpsRecords.map((record) => (
                <tr key={record._id}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {new Date(record.time).toLocaleString()}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{record.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            {selectedDeviceId ? "No records found for the selected device." : "Please select a device ID to see records."}
          </p>
        )}
      </div>
    </div>
  );
};

export default TrainLocation;
