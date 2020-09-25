import React from 'react';
import  Header  from './Components/Header';
import './App.css';
import MainContainer from './Components/MainContainer';
class App extends React.Component {
  render() {
    return (
      <div className="final__UI">
       <Header/>
        <MainContainer />       
      </div>
    );
  }
}

export default App;
