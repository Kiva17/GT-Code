import './App.css';
// import PaginationLogic from './component/PaginationLogic';

import UsersList from './component/PaginationLogic';
export const config = {
  endpoint: `https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json`
};

function App() {
  return (
    <div className="App">
     {/* <PaginationLogic /> */}
     <UsersList/>
    </div>
  );
}

export default App;
