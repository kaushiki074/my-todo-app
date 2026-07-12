import { useState, useEffect } from "react";

import "./App.css";



function ProfileCard({ name, description, status, onDelete, onUpdate }) {

  const [isEditing, setIsEditing] = useState(false);

  const [editName, setEditName] = useState(name);

  const [editDescription, setEditDescription] = useState(description);

  const [editStatus, setEditStatus] = useState(status);



  if (isEditing) {

    return (

      <div className="edit-card">

        <input

          type="text"

          value={editName}

          onChange={(e) => setEditName(e.target.value)}

          placeholder="Task Name"

        />



        <input

          type="text"

          value={editDescription}

          onChange={(e) => setEditDescription(e.target.value)}

          placeholder="Description"

        />



        <div className="actions-wrapper">

          <div className="status-options">

            <label>

              <input

                type="radio"

                name="editStatus"

                value="Pending"

                checked={editStatus === "Pending"}

                onChange={(e) => setEditStatus(e.target.value)}

              />

              Pending

            </label>

            <label>

              <input

                type="radio"

                name="editStatus"

                value="Complete"

                checked={editStatus === "Complete"}

                onChange={(e) => setEditStatus(e.target.value)}

              />

              Complete

            </label>

            <label>

              <input

                type="radio"

                name="editStatus"

                value="In Progress"

                checked={editStatus === "In Progress"}

                onChange={(e) => setEditStatus(e.target.value)}

              />

              In Progress

            </label>

          </div>



          <div className="edit-buttons">

            <button

              className="save-btn"

              onClick={() => {

                onUpdate(editName, editDescription, editStatus);

                setIsEditing(false);

              }}

            >

              Save

            </button>

            <button

              className="cancel-btn"

              onClick={() => {

                setIsEditing(false);

                setEditName(name);

                setEditDescription(description);

                setEditStatus(status);

              }}

            >

              Cancel

            </button>

          </div>

        </div>

      </div>

    );

  }



  return (

    <div className="profile-card">

      <h2>{name}</h2>

      <p>{description}</p>

      <p>{status}</p>

      <button className="delete-btn" onClick={onDelete}>

        Delete

      </button>

      <button className="edit-btn" onClick={() => setIsEditing(true)}>

        Edit

      </button>

    </div>

  );

}



export default function App() {

  const [users, setUsers] = useState([

    { name: "Buy Groceries", description: "Milk, Bread, Eggs", status: "Pending" },

    { name: "Finish Project", description: "Complete React App", status: "Complete" },

    { name: "Read Book", description: "Complete 2 chapters of current book", status: "In Progress" },

    { name: "Learn React Hooks", description: "Practice useState and useEffect examples", status: "In Progress" },

    { name: "Prepare Assignment", description: "Complete FLAT module notes", status: "Pending" },

    { name: "Update Resume", description: "Add new projects and skills", status: "Pending" }

  ]);



  const [newName, setNewName] = useState("");

  const [newDescription, setNewDescription] = useState("");

  const [newStatus, setNewStatus] = useState("Pending");

  const [filter, setFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);



  useEffect(() => {

    const savedUsers = JSON.parse(localStorage.getItem("myUsers"));

    if (savedUsers) setUsers(savedUsers);

  }, []);



  useEffect(() => {

    localStorage.setItem("myUsers", JSON.stringify(users));

  }, [users]);



  const addUser = () => {

    if (newName.trim() !== "") {

      setUsers([...users, { name: newName, description: newDescription, status: newStatus }]);

      setNewName("");

      setNewDescription("");

      setNewStatus("Pending");

      setShowForm(false);

    }

  };



  const deleteUser = (index) => setUsers(users.filter((_, i) => i !== index));



  const updateUser = (index, n, d, s) => {

    setUsers(users.map((u, i) => (i === index ? { ...u, name: n, description: d, status: s } : u)));

  };



  const filteredUsers = filter === "All" ? users : users.filter((user) => user.status === filter);



  return (

    <div className="container">

      <h1>To Do List</h1>



      <div className="input-section">

        {!showForm ? (

          <button className="add-btn" onClick={() => setShowForm(true)}>

            + Add Task

          </button>

        ) : (

          <>

            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Task Name" />

            <input type="text" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="Description" />



            <div className="actions-wrapper">

              <div className="status-options">

                <label>

                  <input type="radio" name="newStatus" value="Pending" checked={newStatus === "Pending"} onChange={(e) => setNewStatus(e.target.value)} />

                  Pending

                </label>

                <label>

                  <input type="radio" name="newStatus" value="In Progress" checked={newStatus === "In Progress"} onChange={(e) => setNewStatus(e.target.value)} />

                  In Progress

                </label>

                <label>

                  <input type="radio" name="newStatus" value="Complete" checked={newStatus === "Complete"} onChange={(e) => setNewStatus(e.target.value)} />

                  Complete

                </label>

              </div>



              <div className="edit-buttons">

                <button className="save-btn" onClick={addUser}>Add</button>

                <button className="cancel-btn" onClick={() => { setShowForm(false); setNewName(""); setNewDescription(""); setNewStatus("Pending"); }}>

                  Cancel

                </button>

              </div>

            </div>

          </>

        )}

      </div>



      <div className="controls">

        <label className="filter-label">Filter:</label>

        <select value={filter} onChange={(e) => setFilter(e.target.value)}>

          <option value="All">All</option>

          <option value="Pending">Pending</option>

          <option value="In Progress">In Progress</option>

          <option value="Complete">Complete</option>

        </select>

      </div>



      {filteredUsers.map((user, index) => (

        <ProfileCard key={index} {...user} onDelete={() => deleteUser(index)} onUpdate={(n, d, s) => updateUser(index, n, d, s)} />

      ))}

    </div>

  );

}