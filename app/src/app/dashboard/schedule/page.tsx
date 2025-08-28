"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedLawyer, setSelectedLawyer] = useState<Id<"users"> | undefined>();

  const lawyers = useQuery(api.users.getLawyers);
  const createAppointment = useMutation(api.appointments.createAppointment);

  const handleBooking = async () => {
    if (!selectedDay || !selectedTime || !selectedLawyer) {
      alert("Please select a lawyer, day, and time.");
      return;
    }
    
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const appointmentDateTime = new Date(selectedDay);
    appointmentDateTime.setHours(hours, minutes);

    try {
      await createAppointment({
        lawyerId: selectedLawyer,
        dateTime: appointmentDateTime.toISOString(),
      });
      alert("Appointment successfully booked!");
      setSelectedDay(undefined);
      setSelectedTime("");
      setSelectedLawyer(undefined);
    } catch (error) {
      console.error(error);
      alert("Failed to book appointment. Please try again.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Schedule an Appointment</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div>
            <h2 className="text-xl font-semibold mb-2">1. Select a Lawyer</h2>
            <select
                value={selectedLawyer}
                onChange={(e) => setSelectedLawyer(e.target.value as Id<"users">)}
                className="p-2 border rounded-lg w-full"
            >
                <option value="">Select a lawyer</option>
                {lawyers?.map((lawyer) => (
                <option key={lawyer._id} value={lawyer._id}>
                    {lawyer.name}
                </option>
                ))}
            </select>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">2. Select a Day</h2>
          <DayPicker
            mode="single"
            selected={selectedDay}
            onSelect={setSelectedDay}
            disabled={!selectedLawyer}
            className="border rounded-lg"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">3. Select a Time</h2>
          {selectedDay && (
            <div className="flex flex-col gap-2">
              {/* Replace with actual available time slots */}
              {["09:00", "10:00", "11:00", "14:00", "15:00"].map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-2 border rounded-lg ${selectedTime === time ? "bg-blue-500 text-white" : ""}`}
                >
                  {time}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {selectedDay && selectedTime && selectedLawyer && (
        <div className="mt-8">
            <button
                onClick={handleBooking}
                className="bg-green-500 text-white p-2 rounded-lg"
            >
                Book Appointment
            </button>
        </div>
      )}
    </div>
  );
}
