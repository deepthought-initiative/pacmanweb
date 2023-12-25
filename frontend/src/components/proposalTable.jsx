import '../css/proposalTable.css'

const ProposalTable = () => {
    const data = [
    { id: 1, column1: 'Text1-1', column2: 'Text1-2', column3: 'Text1-3', column4: 'Text1-4' },
    { id: 2, column1: 'Text2-1', column2: 'Text2-2', column3: 'Text2-3', column4: 'Text2-4' },
    { id: 3, column1: 'Text3-1', column2: 'Text3-2', column3: 'Text3-3', column4: 'Text3-4' },
    { id: 4, column1: 'Text4-1', column2: 'Text4-2', column3: 'Text4-3', column4: 'Text4-4' },
    { id: 5, column1: 'Text5-1', column2: 'Text5-2', column3: 'Text5-3', column4: 'Text5-4' },
    { id: 6, column1: 'Text6-1', column2: 'Text6-2', column3: 'Text6-3', column4: 'Text6-4' },
    { id: 7, column1: 'Text7-1', column2: 'Text7-2', column3: 'Text7-3', column4: 'Text7-4' },
    { id: 8, column1: 'Text8-1', column2: 'Text8-2', column3: 'Text8-3', column4: 'Text8-4' },
    { id: 9, column1: 'Text9-1', column2: 'Text9-2', column3: 'Text9-3', column4: 'Text9-4' },
    { id: 10, column1: 'Text10-1', column2: 'Text10-2', column3: 'Text10-3', column4: 'Text10-4' }
]

  return (
    <>
        <div id="outer-container"className="container border mt-5">
            <div id="left-section" className='border'>
                <h6 className=''>All Proposals</h6>
                <div className='table-container'>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">First</th>
                                <th scope="col">Last</th>
                                <th scope="col">Handle</th>
                                <th scope="col">Handle</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row) => (
                                <tr key={row.id}>
                                    <th className="w-11" scope="row">{row.id}</th>
                                    <td className="w-22">{row.column1}</td>
                                    <td className="w-33">{row.column2}</td>
                                    <td className='w-11'>{row.column3}</td>
                                    <td className='w-22'>{row.column4}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div id="right-section" className='border'>
                <h6 className=''>Alternate Categories</h6>
                <div className='table-container'>
                    <table className="table table-bordered right-table">
                        <thead>
                            <tr>
                                <th scope="col">PACMan Science Category</th>
                                <th scope="col">PACMan Probability</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="w-22">Stellar Physics</td>
                                <td className='w-11'>0.68</td>
                            </tr>
                            <tr>
                                <td className="w-22">Stellar Physics</td>
                                <td className='w-11'>0.68</td>
                            </tr>
                            <tr>
                                <td className="w-22">Stellar Physics</td>
                                <td className='w-11'>0.68</td>
                            </tr>
                            <tr>
                                <td className="w-22">Stellar Physics</td>
                                <td className='w-11'>0.68</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div className='button-tray container border'>
            <button className='btn'>Categorize Another Cycle</button>
            <button className='btn'>Download As CSV</button>
            <button className='btn'>View Logs</button>
        </div>
    </>
  )
}

export default ProposalTable