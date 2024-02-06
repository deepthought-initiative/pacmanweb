import { useState } from "react";

const UploadZipForm = () => {
  const [zipFile, setZipFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    setZipFile(event.target.files[0]);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!zipFile) {
      alert("Please select a zip file");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("zipFile", zipFile);

      const response = await fetch("http://example.com/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      console.log("File uploaded successfully:", data);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button className="btn rounded-1" type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </>
  );
};

export default UploadZipForm;
