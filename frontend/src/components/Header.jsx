// import { FaBell, FaUserCircle } from "react-icons/fa";

// // 1. We receive the "toggleSidebar" function from Dashboard.jsx
// function Header({ toggleSidebar }) {

//   const name = localStorage.getItem("name") || "Student";
//   const course = localStorage.getItem("course") || "Course Not Added";

//   return (
//     <header className="header">
      
//       {/* 2. We put the button and the Welcome text side-by-side using flex */}
//       <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        
//         {/* 3. The Toggle Button itself */}
//         <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
//           ☰
//         </button>

//         <div>
//           <h2>Welcome Back 👋</h2>
//           <p>AI Student Portal Dashboard</p>
//         </div>
//       </div>

//       <div className="header-right">
//         <button className="notification-btn">
//           <FaBell />
//         </button>

//         <div className="profile">
//           <FaUserCircle className="profile-icon" />
//           <div>
//             <h4>{name}</h4>
//             <span>{course}</span>
//           </div>
//         </div>
//       </div>

//     </header>
//   );
// }

// export default Header;





// import { useState } from "react";
// import { FaBell } from "react-icons/fa";

// // 1. We receive the "toggleSidebar" function from Dashboard.jsx
// function Header({ toggleSidebar }) {

//   const name = localStorage.getItem("name") || "Student";
//   const course = localStorage.getItem("course") || "Course Not Added";
  
//   // NEW: State to hold the dynamic profile image
//   const [profileImage, setProfileImage] = useState(localStorage.getItem("userPic") || "");

//   // NEW: Function to handle the live image upload
//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         const base64String = event.target.result;
//         setProfileImage(base64String);
//         localStorage.setItem("userPic", base64String); // Save permanently to browser
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <header className="header">
      
//       {/* 2. We put the button and the Welcome text side-by-side using flex */}
//       <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        
//         {/* 3. The Toggle Button itself */}
//         <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
//           ☰
//         </button>

//         <div>
//           <h2>Welcome Back 👋</h2>
//           <p>AI Student Portal Dashboard</p>
//         </div>
//       </div>

//       <div className="header-right">
//         <button className="notification-btn">
//           <FaBell />
//         </button>

//         <div className="profile">
//           {/* --- THE INVISIBLE UPLOAD WRAPPER --- */}
//           <label style={{ cursor: "pointer" }} title="Click to upload new photo">
//             <img 
//               // Shows uploaded photo OR generates a cyan icon with their initial
//               src={profileImage || `https://ui-avatars.com/api/?name=${name}&background=00e5ff&color=000&rounded=true&bold=true`} 
//               alt="Profile" 
//               className="user-avatar"
//             />
            
//             {/* Hidden file input triggered by clicking the image */}
//             <input 
//               type="file" 
//               accept="image/*" 
//               onChange={handleImageUpload} 
//               style={{ display: "none" }} 
//             />
//           </label>

//           <div>
//             <h4>{name}</h4>
//             <span>{course}</span>
//           </div>
//         </div>
//       </div>

//     </header>
//   );
// }

// export default Header;

import { useState } from "react";
import { FaBell } from "react-icons/fa";

function Header({ toggleSidebar }) {
  const name = localStorage.getItem("name") || "Student";
  const course = localStorage.getItem("course") || "Course Not Added";
  const [profileImage, setProfileImage] = useState(localStorage.getItem("userPic") || "");

  const handleImageUpload = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfileImage(ev.target.result);
        localStorage.setItem("userPic", ev.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <header className="header">
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <button className="sidebar-toggle-btn" onClick={toggleSidebar} style={{ display: "block", fontSize: "24px", cursor: "pointer", background: "transparent", border: "none", color: "white" }}>☰</button>
        <div><h2>Welcome Back 👋</h2><p>AI Student Portal Dashboard</p></div>
      </div>
      <div className="header-right">
        <button className="notification-btn"><FaBell /></button>
        <div className="profile">
          <label style={{ cursor: "pointer" }} title="Click to upload new photo">
            <img src={profileImage || `https://ui-avatars.com/api/?name=${name}&background=00e5ff&color=000&rounded=true&bold=true`} alt="Profile" className="user-avatar" />
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
          </label>
          <div><h4>{name}</h4><span>{course}</span></div>
        </div>
      </div>
    </header>
  );
}

export default Header;