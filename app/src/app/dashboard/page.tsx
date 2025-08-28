"use client";

import { UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import UploadDocument from "@/components/UploadDocument";
import FeedbackForm from "@/components/FeedbackForm"; // Import the new component

export default function DashboardPage() {
  const me = useQuery(api.users.getMe);
  const cases = useQuery(api.cases.getCasesForCurrentUser);

  if (!me || cases === undefined) {
    return <div className="p-8">Loading...</div>;
  }

  // Lawyer View
  if (me.role === "lawyer") {
    return (
      <div className="p-8">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Lawyer Dashboard</h1>
          <UserButton />
        </header>
        <main className="mt-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">My Assigned Cases</h2>
            {cases.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {cases.map((c) => (
                  <div key={c._id} className="p-4 border rounded-lg">
                    <h3 className="text-xl font-semibold">{c.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">Status: {c.status}</p>
                    {/* Additional lawyer-specific case details could go here */}
                  </div>
                ))}
              </div>
            ) : (
              <p>No cases assigned to you yet.</p>
            )}
          </div>
        </main>
      </div>
    );
  }

  // Client View
  if (me.role === "client") {
    return (
      <div className="p-8">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Client Portal</h1>
          <UserButton />
        </header>
        <main className="mt-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">My Cases</h2>
            {cases.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {cases.map((c) => (
                  <div key={c._id} className="p-4 border rounded-lg flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{c.title}</h3>
                      <p className="text-sm text-gray-500 mb-4">Status: {c.status}</p>
                      <div>
                        <h4 className="font-semibold">Documents</h4>
                        {c.documents && c.documents.length > 0 ? (
                          <ul className="list-disc list-inside">
                            {c.documents.map((doc, index) => (
                              <li key={index}>
                                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                  {doc.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500">No documents uploaded yet.</p>
                        )}
                        <UploadDocument caseId={c._id} />
                      </div>
                    </div>
                    <FeedbackForm caseId={c._id} />
                  </div>
                ))}
              </div>
            ) : (
              <p>You have no cases yet.</p>
            )}
          </div>
        </main>
      </div>
    );
  }

  return <div className="p-8">You do not have a role assigned. Please contact support.</div>;
}
