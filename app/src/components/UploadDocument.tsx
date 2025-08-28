"use client";

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";

export default function UploadDocument({ caseId }: { caseId: Id<"cases"> }) {
  const [file, setFile] = useState<File | null>(null);
  const generateUploadUrl = useMutation(api.cases.generateUploadUrl);
  const saveDocument = useMutation(api.cases.saveDocument);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;

    const postUrl = await generateUploadUrl();

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });

    const { storageId } = await result.json();

    await saveDocument({
      caseId,
      storageId,
      fileName: file.name,
    });

    setFile(null);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="border p-2 rounded"
      />
      <button
        type="submit"
        disabled={!file}
        className="bg-blue-500 text-white p-2 rounded ml-2 disabled:bg-gray-400"
      >
        Upload
      </button>
    </form>
  );
}
