export const DownloadFile = async (currentId, currentCycle, mode, fileType) => {
  const Url = `/api/outputs/download/${fileType}/${currentId}?cycle_number=${currentCycle}&mode=${mode}`;
  try {
    const response = await fetch(Url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const fileName = response.headers.get("content-disposition").split("=")[1];
    let blob;
    if (fileType == "csv" && mode !== "MATCH"){
        const data = await response.text();
        blob = new Blob([data], { type: "text/csv" });
    } else {
        blob = await response.blob();
    }
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
};