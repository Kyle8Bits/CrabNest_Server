import { useEffect, useState } from 'react'

function App() {
  const URL = "http://localhost:1414/getUsers"

  const [users,setUsers] = useState([])

  const [name,setName] = useState()
  const [username,setUname] = useState()
  const [phone,setPhone] = useState()
  const [job,setJob] = useState()
  const [place,setPlace] = useState()



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

  const createUser = () => {
    const user = {
      name,
      username,
      phone,
      job,
      place
    };
    
    fetch('http://localhost:1414/getUsers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
    .then(response => response.json())
    .then(data => {
      console.log('User created:', data);
      // Optionally, reset the form fields here
      getData();

    })
    .catch((error) => {
      console.error('Error creating user:', error);
    });
  };

  function deleteUser(userId) {
    fetch(`http://localhost:1414/getUsers/${userId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        console.log('User deleted:', data);
        // Optionally, refresh the user list or update the state
        getData();
    })
    .catch((error) => {
        console.error('Error deleting user:', error);
    });
  }
  
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
      <td><button type='button' onClick={() => deleteUser(u._id)}>Delete</button></td>
    </tr>);
  })


  return (
    <>
      <input type="text" placeholder='Name' onChange={(e)=> setName(e.target.value)}/>
      <input type="text" placeholder='Username' onChange={(e)=> setUname(e.target.value)} />
      <input type="text" placeholder='Phone' onChange={(e)=> setPhone(e.target.value)} />
      <input type="text" placeholder='Job' onChange={(e)=> setJob(e.target.value)} />
      <input type="text" placeholder='Place' onChange={(e)=> setPlace(e.target.value)}/>

      <button type='button' onClick={createUser}>Create</button>



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

      <button type='button' onClick={getData}>Get</button>
    </>
  )
}

export default App
