import { useState } from "react";
import "../../css/Upload.css";

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

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", zipFile);

      const response = await fetch(
        "http://127.0.0.1:5000/api/upload?api_key=barebones",
        {
          method: "POST",
          headers: {
            Authorization: "Basic " + btoa("default:barebones"),
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const message = await response.json();
      alert(message["response"]);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="instructions-container">
        <ul className="instructions-list">
          <li>The contents of the zip file:</li>
          <li>
            1. Proposal files need to be inside folders, the folder names being
            the cycle names. The proposal folder name can be anything, just
            needs to contain the word &quot;proposal&quot; (case sensitive).
            <ul className="folder-structure">
              Sample directory structure:
              <li>
                <span className="folder">-proposals (or some other name)</span>
                <ul>
                  <li>
                    <span className="folder">---221023</span>
                    <ul>
                      <li>
                        <span className="file">------00001.txtx</span>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <span className="folder">---221212</span>
                    <ul>
                      <li>
                        <span className="file">------00001.txtx</span>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li>
            2. All files ending either with joblib or npy would move to the
            models folder.
          </li>
          <li>
            3. All files ending with _panelist.csv will be moved to the panelist
            folder.
          </li>
        </ul>
      </div>
      <form className="button-tray" onSubmit={handleFormSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button className="btn rounded-1" type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </>
  );
};

export default UploadZipForm;
