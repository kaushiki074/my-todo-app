import { useState, useEffect } from 'react';

// ProfileCard Component
function ProfileCard({ name, age, bio, isCompleted, onDelete, onUpdate, onToggleComplete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editAge, setEditAge] = useState(age);
  const [editBio, setEditBio] = useState(bio);

  if (isEditing) {
    return (
      <div style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
        <input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Name" />
        <input value={editAge} onChange={(e) => setEditAge(e.target.value)} placeholder="Age" />
        <input value={editBio} onChange={(e) => setEditBio(e.target.value)} placeholder="Bio" />
        <button onClick={() => {
          onUpdate(editName, editAge, editBio);
          setIsEditing(false);
        }}>Save</button>
      </div>
    );
  }

  return (
    <div style={{ 
      border: "1px solid black", 
      margin: "10px", 
      padding: "10px",
      opacity: isCompleted ? 0.5 : 1
    }}>
      <div onClick={onToggleComplete} style={{ cursor: "pointer", fontWeight: "bold" }}>
        {isCompleted ? "✅ Completed" : "⏳ Pending"}
      </div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Bio: {bio}</p>
      <button onClick={onDelete} style={{ marginRight: "10px" }}>Delete</button>
      <button onClick={() => setIsEditing(true)}>Edit</button>
    </div>
  );
}

// App Component
export default function App() {
  const [users, setUsers] = useState([
    { name: "Joe", age: 30, bio: "Engineer", isCompleted: false },
    { name: "Jane", age: 25, bio: "Designer", isCompleted: false }
  ]);

  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newBio, setNewBio] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem("myUsers"));
    if (savedUsers) setUsers(savedUsers);
  }, []);

  useEffect(() => {
    localStorage.setItem("myUsers", JSON.stringify(users));
  }, [users]);

  const addUser = () => {
    if (newName.trim() !== "") {
      setUsers([...users, { name: newName, age: newAge, bio: newBio, isCompleted: false }]);
      setNewName(""); setNewAge(""); setNewBio("");
    }
  };

  const deleteUser = (index) => setUsers(users.filter((_, i) => i !== index));
  
  const updateUser = (index, n, a, b) => {
    setUsers(users.map((u, i) => (i === index ? { ...u, name: n, age: a, bio: b } : u)));
  };

  const toggleComplete = (index) => {
    setUsers(users.map((u, i) => (i === index ? { ...u, isCompleted: !u.isCompleted } : u)));
  };

  const sortUsersByAge = () => {
    setUsers([...users].sort((a, b) => Number(a.age) - Number(b.age)));
  };

  const sortUsersByName = () => {
    setUsers([...users].sort((a, b) => a.name.localeCompare(b.name)));
  };

  const filteredUsers = filter === "All" ? users : users.filter(user => user.bio === filter);

  return (
    <div style={{ padding: "20px" }}>
      <h1>To Do List</h1>
      
      <div>
        <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Name" />
        <input value={newAge} onChange={(e) => setNewAge(e.target.value)} placeholder="Age" />
        <input value={newBio} onChange={(e) => setNewBio(e.target.value)} placeholder="Bio" />
        <button onClick={addUser}>Add Task</button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={sortUsersByAge}>Sort by Age</button>
        <button onClick={sortUsersByName} style={{ marginLeft: "10px" }}>Sort by Name</button>
        <label style={{ marginLeft: "20px" }}>Filter: </label>
        <select onChange={(e) => setFilter(e.target.value)} value={filter}>
          <option value="All">All</option>
          <option value="Engineer">Engineer</option>
          <option value="Designer">Designer</option>
        </select>
      </div>

      {filteredUsers.map((user, index) => (
        <ProfileCard
          key={index}
          {...user}
          onDelete={() => deleteUser(index)}
          onUpdate={(n, a, b) => updateUser(index, n, a, b)}
          onToggleComplete={() => toggleComplete(index)}
        />
      ))}
    </div>
  );
}
