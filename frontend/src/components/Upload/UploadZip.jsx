import { useState, useContext } from "react";
import "../../css/Upload.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import AppContext from "../../context/AppContext";
import CustomToast from "../util/CustomToast";

const UploadZipForm = () => {
  const [zipFile, setZipFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const { showToast, setShowToast, toastVariant, setToastVariant } =
    useContext(AppContext);

  const handleFileChange = (event) => {
    setZipFile(event.target.files[0]);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!zipFile) {
      setUploadError("Please select a zip file");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", zipFile);
      const response = await fetch(`/api/upload`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to upload file");
      }
      const message = await response.json();
      setUploadError(message["response"]);
      setShowToast(true);
      setToastVariant("success");
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadError("Failed to upload file");
      setShowToast(true);
      setToastVariant("danger");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {showToast && (
        <CustomToast
          showToast={showToast}
          setShowToast={setShowToast}
          variant={toastVariant}
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            backgroundColor: "transparent",
          }}
        />
      )}
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
      <Form className="button-tray" onSubmit={handleFormSubmit}>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Control onChange={handleFileChange} type="file" />
          {uploadError && (
            <Form.Control.Feedback type="invalid">
              {uploadError}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Button className="btn rounded-1" disabled={uploading} type="submit">
          {uploading ? "Uploading..." : "Upload File"}
        </Button>
      </Form>
    </>
  );
};

export default UploadZipForm;
