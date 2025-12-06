import Sidebar from "./sidebar.tsx/sidebar";
// import Navbar from "./navbar/navbar";


function App() {
  return (
   < div className="max-w-96 ">
    <div className="container">
      <div className="header">
        {/* <Navbar /> */}
        <Sidebar/>
      </div>
    </div>
    </div>
  ); 
}

export default App;
