import { Routes, Route } from 'react-router-dom';
import Home from '@/containers/Home';

function Shell() {
  return(
    <Routes>
      <Route path='/' element={<Home />} />
    </Routes>
  )
}

export default Shell;
