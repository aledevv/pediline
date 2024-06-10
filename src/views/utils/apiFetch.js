const HOST = 'http://localhost:3000/api/v1';
import { setLoggedUser, loggedUser, getInfo } from '../../states/loggedUser.js';

const API_ENDPOINTS = {
  LINE_URL: `${HOST}/lines`,
  STOP_URL: `${HOST}/stops`,
  USER_URL: `${HOST}/users`,
  SCHOOL_URL: `${HOST}/schools`,
  TOKEN_URL: `${HOST}/token`,
  ALERT_URL: `${HOST}/alerts`
};


// ----------------------- FETCH FUNCTIONS --------------------


// ----------------------------------- SCHOOLS
const fetchSchoolsFull = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.SCHOOL_URL);
    const data = await response.json();

    let schools = {};

    for (let school of data) {
      const schoolLines = await fetchStopsByLines(school.linesId);
      schools[school.name] = {
        id: school.id,
        name: school.name,
        lines: schoolLines,
        position: school.position
      };
    }

    return schools;

  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const fetchSchools = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.SCHOOL_URL);
    const data = await response.json();

    // let schools = {};

    // for (let school of data) {
    //   schools[school.name] = {
    //     id: school.id,
    //     name: school.name,
    //     lines: school.linesId,
    //     position: school.position
    //   };
    // }

    return data;

  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const fetchSchoolFromId = async (id) => {
  try {
    const response = await fetch(API_ENDPOINTS.SCHOOL_URL + `/${id}`);
    const data = await response.json();

    return data;

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}


async function createSchool(school){
  const response = await fetch(API_ENDPOINTS.SCHOOL_URL, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(school),
  });
  const data = await response.json();
  console.log('School created:', data);
  return data;
}

async function deleteSchool(id) {
  try {
      const response = await fetch(API_ENDPOINTS.SCHOOL_URL + `/${id}`, {
          method: 'DELETE',
      });

      if (!response.ok) {
          throw new Error('Errore durante l\'eliminazione della scuola');
      }

      // Ritorna un oggetto di successo
      return { success: true, message: 'Scuola eliminata con successo' };
  } catch (error) {
      console.error('Errore durante l\'eliminazione della scuola:', error);
      // Ritorna un oggetto di errore
      return { success: false, message: 'Errore durante l\'eliminazione della scuola' };
  }
}

async function updateSchool(id, body){
  const response = await fetch(API_ENDPOINTS.SCHOOL_URL + `/${id}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
  });
  const data = await response.json();
  console.log('School updated:', data);
  return data;
}

// ----------------------------------- TOKEN 

async function fetchToken() {
  try {
    const response = await fetch(API_ENDPOINTS.TOKEN_URL, {
      method: 'GET',
      credentials: 'include'
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }

    if (data.loggedUser) {
      await fetchUserInfo(data);
      console.log('Dati utente:', data.loggedUser);
    }

  } catch (error) {
    console.error('Errore durante la verifica del token:', error.message);
    // window.location.href = "/login"; 
  }
}
// ----------------------------------------- USER INFO

async function fetchUserInfo(data) {
  const response = await fetch(API_ENDPOINTS.USER_URL + `?email=${data.loggedUser.email}`);
  const userInfo = await response.json();
  //console.log('User info:', userInfo);
  setLoggedUser(userInfo[0]);
  loggedUser.token = data.token;
}

async function updateUserInfo(id, body){
  const response = await fetch(API_ENDPOINTS.USER_URL + `/${id}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
  });
  const data = await response.json();
  console.log('User updated:', data);
  return data;
}

// ------------------------------------- STOPS AND LINES

async function fetchStopsByLines(lineList) {
  const linesArray = [];
  try {
    for (let lineId of lineList) {
      const response = await fetch(`${API_ENDPOINTS.LINE_URL}/${lineId}`);
      const lineData = await response.json();

      const stopsResponse = await fetch(`${API_ENDPOINTS.STOP_URL}/?line=${lineId}`);
      const stopsData = await stopsResponse.json();
      linesArray.push({
        id: lineData.id,
        name: lineData.name,
        color: lineData.color,
        stops: stopsData
      });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  return linesArray;
};

async function fetchLines() {
  const response = await fetch(API_ENDPOINTS.LINE_URL);
  const data = await response.json();
  //lines.value = data.map(line => line.name);  // Assuming the API response is a list of objects with a 'name' property
  //console.log("Lines fetched:", lines.value);
  return data;
}

async function fetchStops(stops) {
  const response = await fetch(API_ENDPOINTS.STOP_URL);
  const data = await response.json();
  stops.value = data.map(stop => stop.name);  // Assuming the API response is a list of objects with a 'name' property
  console.log("Stops fetched:", stops.value);
}

async function fetchLineFromId(id){
  const response = await fetch(API_ENDPOINTS.LINE_URL + `/${id}`);
  const lineInfo = await response.json();
  return lineInfo;
}

async function fetchStopFromId(id){
  const response = await fetch(API_ENDPOINTS.STOP_URL + `/${id}`);
  const stopInfo = await response.json();
  return stopInfo;
}

async function fetchAlerts() {
  const response = await fetch(API_ENDPOINTS.ALERT_URL);
  const alerts = await response.json();
  
  return alerts;

}

async function createLine(line){
  const response = await fetch(API_ENDPOINTS.LINE_URL, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(line),
  });
  const data = await response.json();
  console.log('Line created:', data);
  return data;
}

async function deleteLine(id) {
  try {
      const response = await fetch(API_ENDPOINTS.LINE_URL + `/${id}`, {
          method: 'DELETE',
      });

      if (!response.ok) {
          throw new Error('Errore durante l\'eliminazione della linea');
      }

      // Ritorna un oggetto di successo
      return { success: true, message: 'Linea eliminata con successo' };
  } catch (error) {
      console.error('Errore durante l\'eliminazione della linea:', error);
      // Ritorna un oggetto di errore
      return { success: false, message: 'Errore durante l\'eliminazione della linea' };
  }
}

async function updateLine(id, body){
  const response = await fetch(API_ENDPOINTS.LINE_URL + `/${id}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
  });
  const data = await response.json();
  //console.log('Line updated:', data);
  return data;
}

async function createStop(stop){
  const response = await fetch(API_ENDPOINTS.STOP_URL, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(stop),
  });
  const data = await response.json();
  //console.log('Stop created:', data);
  return data;
}

async function deleteStop(id) {
  try {
      const response = await fetch(API_ENDPOINTS.STOP_URL + `/${id}`, {
          method: 'DELETE',
      });

      if (!response.ok) {
          throw new Error('Errore durante l\'eliminazione della fermata');
      }

      // Ritorna un oggetto di successo
      return { success: true, message: 'Fermata eliminata con successo' };
  } catch (error) {
      console.error('Errore durante l\'eliminazione della fermata:', error);
      // Ritorna un oggetto di errore
      return { success: false, message: 'Errore durante l\'eliminazione della fermata' };
  }
}

// ----------------------- EXPORT FUNCTIONS --------------------

export { fetchSchools, fetchSchoolsFull, fetchToken, fetchUserInfo, fetchStopsByLines, fetchLineFromId, fetchStopFromId, 
  fetchStops, fetchLines, createSchool, deleteSchool, fetchAlerts, createLine, updateSchool, fetchSchoolFromId, deleteLine, 
  updateLine, createStop, deleteStop, updateUserInfo };