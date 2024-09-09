export const runPacman = async (inputFields, setModalShow) => {
  const params = new URLSearchParams();
  Object.entries(inputFields).forEach(([key, value]) => {
    params.append(key, value);
  });
  const query = params.toString();
  const url = `/api/run_pacman?${query}`;
  const spawnResponse = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Basic " + btoa("default:barebones"),
      "Content-Type": "application/json",
    },
  });
  if (spawnResponse.status === 429) {
    setModalShow(true);
  }
  if (!spawnResponse.ok) {
    throw new Error(spawnResponse);
  }

  const data = await spawnResponse.json();
  return data["result_id"];
};

export const fetchTableData = async (
  mode,
  curId,
  currentCycle,
  setProgressPercentage
) => {
  let tableCategory = "";
  if (mode === "PROP") {
    tableCategory = "proposal_cat_output";
  }
  if (mode == "DUP") {
    tableCategory = "duplicates_output";
  }
  if (mode == "MATCH") {
    tableCategory = "match_reviewers_output";
  }
  const tableResponse = await fetch(
    `/api/outputs/${tableCategory}/${curId}?cycle_number=${currentCycle}`,
    {
      method: "GET",
      credentials: "include",
      headers: { Authorization: "Basic " + btoa("default:barebones") },
    }
  );
  if (!tableResponse.ok) {
    setProgressPercentage(100);
    throw new Error(`Failed to fetch table data: ${tableResponse.statusText}`);
  }
  const tableData = await tableResponse.json();
  const [tabularData, code] = tableData;
  return { tabularData, code };
};

export const terminateCurrentProcess = async(currentTaskId, mode) => {
  await fetch(`/api/terminate/${currentTaskId}?mode=${mode}`, {
    method: "POST",
  });
}

export const DownloadFile = async (currentTaskId, currentCycle, mode, fileType) => {
  const Url = `/api/outputs/download/${fileType}/${currentTaskId}?cycle_number=${currentCycle}&mode=${mode}`;
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