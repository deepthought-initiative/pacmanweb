export const runPacman = async (inputFields) => {
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
  if (!spawnResponse.ok) {
    throw new Error(spawnResponse);
  }
  const data = await spawnResponse.json();
  return data["result_id"];
};
