let token = localStorage.getItem('token');
let count = 0;

const trucksInfo = document.getElementById('trucks-info');
const aboutTrucks = document.getElementsByClassName('aboutTrucks');
const profileBlock = document.getElementsByClassName('profile-block');
const trucksBlock = document.getElementsByClassName('trucks-block');
const showAllTrucks = document.getElementById('showAllTrucks');
const allTrucks = document.getElementById('allTrucks');
const addTruck = document.getElementById('addTruck');
const truck = document.getElementById('truck');
const findTruck = document.getElementById('findTruck');

const getTruck = document.getElementById('getTruck');
const assignTruck = document.getElementById('assignTruck');
const changeTruckButton = document.getElementById('changeTruckButton');
const deleteTruck = document.getElementById('deleteTruck');
const activeLoad = document.getElementById('activeLoad');
const loadState = document.getElementById('loadState');

const getAllLoadsButton = document.getElementById('getAllLoadsButton');
const allLoads = document.getElementById('allLoads');
const getLoadById = document.getElementById('getLoadById');


trucksInfo.addEventListener('click', () => {
  count++;
  if (count % 2) {
    aboutTrucks[0].style.display = "block";
  } else {
    aboutTrucks[0].style.display = "none";
  }
})

showAllTrucks.addEventListener('click', () => {
  getTrucks()
  async function getTrucks() {
    const response = await fetch('http://localhost:8080/api/trucks', {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
    });

    allTrucks.innerHTML = ""
    let info = await response.json();
    if (response.status === 200) {
      for (let truck of info.trucks) {
        if (!info.trucks.includes(truck._id)) {
          allTrucks.innerHTML += `
          <li>
          <h3>${truck.type}</h3>
          <p>Truck number: ${truck._id}</p>
          <p>Truck status: ${truck.status}</p>
          <p>Assigned to: ${truck.assigned_to || 'not asigned yet'}</p>
          <p> Created by and when: ${truck.created_by} , ${truck.createdDate}</p>
          </li>  
          `
        }
      }
    }
    if (response.status === 400) {
      allTrucks.innerHTML = 'No trucks'
    }
  }
})

addTruck.addEventListener('click', () => {
  const newTruck = document.getElementById('newTruck').value;
  addOneTruck()
  async function addOneTruck() {
    const response = await fetch('http://localhost:8080/api/trucks', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "type": newTruck,
      })
    })

    if (newTruck.length <= 0) {
      truck.innerHTML = `No truck created`
      return
    }

    if (response.status === 200) {
      truck.innerHTML = `Truck ${newTruck} added succesfully`;
    }
    if (response.status === 400) {
      truck.innerHTML = 'No trucks';
    }
  }

})

loadState.addEventListener('click', () => {
  changeActiveLoad()

  async function changeActiveLoad() {
    const response = await fetch(`http://localhost:8080/api/loads/active/state`, {
      method: 'PATCH',
      credentials: 'same-origin',
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
    })

    let info = await response.json();
    if (response.status === 200) {
      truck.innerHTML = info.message;
      return;
    } else {
      truck.innerHTML = 'No changes'
      return
    }
  }
})

activeLoad.addEventListener('click', () => {
  getActiveLoad()

  async function getActiveLoad() {
    const response = await fetch(`http://localhost:8080/api/loads/active`, {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
    })

    let info = await response.json();
    if (response.status === 200) {
      truck.innerHTML = `
        <table>
      <tr>
        <th>Load Name</th>
        <th>Created date</th>
        <th>Pickup adress</th>
        <th>Delivery adress</th>
      </tr> `
      for (let load of info.load) {
        truck.innerHTML += `
            <tr>
              <td>${load.name}</td>
              <td>${load.created_date}</td>
              <td>${load.pickup_address}</td>
              <td>${load.delivery_address}</td>
            </tr> 
            <div id='addInfo' 
            >
            <p>Payload: ${load.payload}</p>
              <p>Load number: ${load._id}</p>
              <p>Dimensions: <br>
              width: ${load.dimensions.width},
              height: : ${load.dimensions.height},
              length: ${load.dimensions.length}
              </p>
              <p>Load status: ${load.status}</p>
              <p>Load state: ${load.state}</p>
              <p>Assigned to: ${load.assigned_to || 'not asigned yet'}</p>
              <p> Created by: ${load.created_by}</p>
              </div>
              </table>
              `}
      return
    } else {
      truck.innerHTML = 'Please provide correct truck number'
      return
    }
  }
})

getTruck.addEventListener('click', () => {
  const truckNumber = document.getElementById('findTruck').value;
  getOnetruck()

  async function getOnetruck() {
    const response = await fetch(`http://localhost:8080/api/trucks/${truckNumber}`, {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
    })

    let info = await response.json();
    if (truckNumber.length === 0) {
      truck.innerHTML = 'Please provide truck number';
      return;
    }
    if (response.status === 200) {
      truck.innerHTML =
        ` <h3>${info.truck.type}</h3>
        <p>Truck number: ${info.truck._id}</p>
        <p>Truck status: ${info.truck.status}</p>
        <p>Assigned to: ${info.truck.assigned_to || 'not asigned yet'}</p>
        <p> Created by and when: ${info.truck.created_by} , ${info.truck.createdDate}</p>`
      return
    }
    if (response.status === 400) {
      truck.innerHTML = 'No such truck';
      return
    } else {
      truck.innerHTML = 'Please provide correct truck number'
      return
    }
  }
})

changeTruckButton.addEventListener('click', () => {
  const truckNumber = document.getElementById('findTruck').value;
  const changeTruck = document.getElementById('newTruck').value;

  changeOnetruck()
  async function changeOnetruck() {
    const response = await fetch(`http://localhost:8080/api/trucks/${truckNumber}`, {
      method: 'PUT',
      credentials: 'same-origin',
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "type": changeTruck,
      })
    })

    if (changeTruck.length <= 0) {
      truck.innerHTML = 'Please, provide truck type';
      return
    }

    if (response.status === 200) {
      truck.innerHTML =
        `<h3>Truck ${truckNumber} changed to ${changeTruck}</h3>`
      return;
    }
    if (response.status === 400) {
      truck.innerHTML = 'No such truck';
      return
    }
    if (response.status === 400) {
      truck.innerHTML = 'Please provide truck number';
      return
    }
  }
})

deleteTruck.addEventListener('click', () => {
  const truckNumber = document.getElementById('findTruck').value;
  deleteOnetruck()
  async function deleteOnetruck() {
    const response = await fetch(`http://localhost:8080/api/trucks/${truckNumber}`, {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
    })

    if (response.status === 200) {
      truck.innerHTML = 'Truck deleted succesfully'
    }
    if (response.status === 400) {
      truck.innerHTML = 'Truck not deleted'
    }
  }
})

assignTruck.addEventListener('click', () => {
  const truckNumber = document.getElementById('findTruck').value;
  assignOnetruck()

  async function assignOnetruck() {
    const response = await fetch(`http://localhost:8080/api/trucks/${truckNumber}/assign`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
    });

    if (truckNumber.length <= 0) {
      truck.innerHTML = 'Please provide truck number';
      return;
    }
    if (response.status === 200) {
      truck.innerHTML =
        `<p>Succesfully assigned to driver </p>`
      return
    }
    if (response.status === 400) {
      truck.innerHTML = 'No such truck'
      return
    } else {
      truck.innerHTML = 'Please provide correct truck number'
      return
    }
  }
})




getAllLoadsButton.addEventListener('click', () => {
  getLoads()
  async function getLoads() {
    const response = await fetch('http://localhost:8080/api/loads', {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
    });

    allLoads.innerHTML = `
    <tr>
      <th>Load Name</th>
      <th>Created date</th>
      <th>Pickup adress</th>
      <th>Delivery adress</th>
    </tr>`;
    let info = await response.json();
    if (response.status === 200) {
      for (let load of info.loads) {
        allLoads.innerHTML += `
          <tr>
            <td>${load.name}</td>
            <td>${load.created_date}</td>
            <td>${load.pickup_address}</td>
            <td>${load.delivery_address}</td>
          </tr> 
          <div id='addInfo' 
          >
          <p>Payload: ${load.payload}</p>
            <p>Load number: ${load._id}</p>
            <p>Dimensions: <br>
            width: ${load.dimensions.width},
            height: : ${load.dimensions.height},
            length: ${load.dimensions.length}
            </p>
            <p>Load status: ${load.status}</p>
            <p>Assigned to: ${load.assigned_to || 'not asigned yet'}</p>
            <p> Created by: ${load.created_by}</p>
            </div>
            `
      }
    }
    if (response.status === 400) {
      trucksList.innerHTML = 'No loads'
    }
  }
})

getLoadById.addEventListener('click', () => {
  const findLoad = document.getElementById('findLoad').value;
  getOneLoad()

  async function getOneLoad() {
    const response = await fetch(`http://localhost:8080/api/loads/${findLoad}`, {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
    })

    let info = await response.json();
    if (findLoad.length === 0) {
      allLoads.innerHTML = 'Please provide load number';
      return;
    }
    if (response.status === 200) {
      allLoads.innerHTML = `
      <tr>
      <th>Load Name</th>
      <th>Created date</th>
      <th>Pickup adress</th>
      <th>Delivery adress</th>
    </tr>
          <tr>
            <td>${info.load.name}</td>
            <td>${info.load.created_date}</td>
            <td>${info.load.pickup_address}</td>
            <td>${info.load.delivery_address}</td>
          </tr> 
          <div id='addInfo'
           >
          <p>Payload: ${info.load.payload}</p>
            <p>Load number: ${info.load._id}</p>
            <p>Dimensions: <br>
            width: ${info.load.dimensions.width},
            height: : ${info.load.dimensions.height},
            length: ${info.load.dimensions.length}
            </p>
            <p>Load status: ${info.load.status}</p>
            <p>Assigned to: ${info.load.assigned_to || 'not asigned yet'}</p>
            <p> Created by: ${info.load.created_by}</p>
            </div>
            `
      return
    }
    if (response.status === 400) {
      allLoads.innerHTML = 'No such load';
      return
    } else {
      allLoads.innerHTML = 'Please provide correct load number'
      return
    }
  }
})