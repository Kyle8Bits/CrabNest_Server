import { useEffect, useState } from 'react'

function App() {
  const URL = "http://localhost:1414/getUsers"

  const [users,setUsers] = useState([])

  async function getData() {
    try {
      const res = await fetch(URL, { method: "GET" });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const json = await res.json();
      console.log(json);
      setUsers(json);
    } catch (error) {
      console.error("Error fetching the users:", error);
    }
  }

  useEffect(()=>{
    getData();
  },[])
  
  const userData = users.map(u =>{
    return (<tr key={u._id}>
      <td>{u._id}</td>
      <td>{u.name}</td>
      <td>{u.username}</td>
      <td>{u.phoneNum}</td>
      <td>
        {u.info.map((i,index)=>{
          return (
            <div key={index}>
              {i.action} at {i.place}
            </div>
          );
      })}
      </td>
    </tr>);
  })

  return (
    <>
      <table>
         <thead>
         <tr>
            <th>ID</th>
            <th>Name</th>
            <th>UserName</th>
            <th>Phone</th>
            <th>Info</th>
          </tr>
         </thead>
         <tbody>
          {userData}
         </tbody>
      </table>
    </>
  )
}

export default App
