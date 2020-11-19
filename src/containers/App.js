import React, { useState } from 'react';
import { Route } from 'react-router-dom';

import './App.css';
import Nav from '../components/Nav.jsx';
import Cards from '../components/Cards.jsx';

import About from '../components/About.jsx';
import Ciudad from '../components/Ciudad.jsx';


function App() {
  const [cities, setCities] = useState([]);
  function onClose(id) {
    setCities(oldCities => oldCities.filter(c => c.id !== id));
  }
  function onSearch(ciudad) {
    const apiKey = '4ae2636d8dfbdc3044bede63951a019b';
    //Llamado a la API del clima
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric`)
      .then(r => r.json()) 
      .then((recurso) => {
        if(recurso.main !== undefined){
          const ciudad = {
            min: Math.round(recurso.main.temp_min),
            max: Math.round(recurso.main.temp_max),
            img: recurso.weather[0].icon,
            id: recurso.id,
            wind: recurso.wind.speed,
            temp: recurso.main.temp,
            name: recurso.name,
            weather: recurso.weather[0].main,
            clouds: recurso.clouds.all,
            latitud: recurso.coord.lat,
            longitud: recurso.coord.lon
          };
          setCities(oldCities => [...oldCities, ciudad]);
        } else {
          alert("Ciudad no encontrada");
        }
      });
  }
  function onFilter(ciudadId) {
    let ciudad = cities.filter(c => c.id === parseInt(ciudadId));
    if(ciudad.length > 0) {
        return ciudad[0];
    } else {
        return null;
    }
  }
  return (
    <div className="App">
      <Route
        path='/' 
        render={() => <Nav onSearch={onSearch} />} // se usa cuando recibe una funcion y esta funcion recibe
      />                                           {/* props, es mas bien una function estatica */}
      <Route
        path='/about' 
        component={About} // componente estatico por eso usamos 'component'
      />
      <div>
        <Route 
          exact     // usamos exact xq matcheamos sobre la pag principal y queremos que se vean los componentes
          path='/'  // ahi, en caso de seleccionar otra ruta, estos componentes se borraran xq no es mas la
          render={() => <Cards  // ruta exacta
            cities={cities}
            onClose={onClose}
          /> }
        />
      </div>
        <Route
          exact
          path='/ciudad/:ciudadId'
          render={({match}) => <Ciudad
          city={onFilter(match.params.ciudadId)} /* usamos el metodo match que nos provee params, donde aparece */
        />}                                    /* ciudadId con su numero de id correspondiente */
        />
      <hr />
    </div>
  );
}

export default App;
