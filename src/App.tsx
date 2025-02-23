import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Book } from './components/Book';
import NavbarComponent from './components/Navbar';

function App() {
  return (
    <div className="App">
      <NavbarComponent />
      <main>
          <Book />
      </main>
      
    </div>
  );
}

export default App;
