import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UploadFile from '../src/component/uploadFile';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<UploadFile/>} exact />
        {/* <Route path='/audio' element={<AudioApp/>} exact /> */}
      </Routes>
    </Router>
  );
}

export default App;
