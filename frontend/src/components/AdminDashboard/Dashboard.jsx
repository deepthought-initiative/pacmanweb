import Table from "react-bootstrap/Table";
import UserDelete from "../../assets/UserDelete.png";
import UserEdit from "../../assets/UserEdit.png";

const Dashboard = () => {
  const users = [
    {
      UID: "1",
      Username: "user1",
      Password: "password1",
      Status: "normal",
    },
    {
      UID: "2",
      Username: "user2",
      Password: "password2",
      Status: "admin",
    },
    {
      UID: "3",
      Username: "user3",
      Password: "password3",
      Status: "normal",
    },
    {
      UID: "4",
      Username: "user4",
      Password: "password4",
      Status: "admin",
    },
    {
      UID: "5",
      Username: "user5",
      Password: "password5",
      Status: "normal",
    },
  ];
  return (
    <div className="user-list-container">
      <h2>All Users</h2>
      <div className="row"></div>
      <div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Password</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user["UID"]}>
                <td>{index}</td>
                <td>{user["Username"]}</td>
                <td>{user["Password"]}</td>
                <td>{user["Status"]}</td>
                <td>
                  <div className="user-edit-options">
                    <img src={UserEdit} />
                    <img src={UserDelete} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Dashboard;
