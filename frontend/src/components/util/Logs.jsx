/* eslint-disable react/prop-types */
import "../../css/proposalTable.css";

const Logs = ({data, setShowTable}) => {
    const headers = ['Proposal Number', 'Title', 'PACMan Science Category', 'PACMan Probability', 'Original Science Category'];
    const csvContent =
    headers.join(',') +
    '\n' +
    data.map((row) => Object.values(row).join(',')).join('\n');

    const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`);
    const handleTable = async(event) => {
        event.preventDefault();
        setShowTable(true);
    }

  return (
        <>
        <div id="log-container" className="container-fluid mt-5">
            {data.map((log, index) => (
                <div key={index}>
                    {log}
                </div>
            ))}
        </div>
        <div className='button-tray p-0 container-fluid'>
            <button className='btn rounded-0' onClick={handleTable}>See Results</button>
            <a href={encodedUri} download='proposals.csv'>
                <button className='btn rounded-0'>Download As CSV</button>
            </a>
            <button className='btn rounded-0'>View Logs</button>
        </div>
    </>
  )
}

export default Logs