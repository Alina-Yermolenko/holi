let token = localStorage.getItem('token');
let count = 0;
const loadsBlock = document.getElementsByClassName('loads-block');
const loadsInfo = document.getElementById('loadsInfo');
const getAllLoadsButton = document.getElementById('getAllLoadsButton');
const getNewLoadsButton = document.getElementById('getNewLoadsButton');
const allLoads = document.getElementById('allLoads');
const addLoad = document.getElementById('addLoad');
const editLoad = document.getElementById('editLoad');
const deleteLoad = document.getElementById('deleteLoad');
const loads = document.getElementsByClassName('loads');
const load = document.getElementById('load');

const postLoad = document.getElementById('postLoad');
const postLoadButton = document.getElementById('postLoadButton');
const newLoadsTable = document.getElementById('newLoadsTable');
const loadFormButton = document.getElementById('loadFormButton');
const formData = document.getElementById('formData');
const getLoadById = document.getElementById('getLoadById');
const shippingInfo = document.getElementById('shippingInfo');

loadsInfo.addEventListener('click', () => {
  count++;
  if (count % 2) {
    loads[0].style.display = "none";
  } else {
    loads[0].style.display = "block";
  }
})

loadFormButton.addEventListener('click', () => {
  count++;
  if (count % 2) {
    formData.style.display = "block";
  } else {
    formData.style.display = "none";
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
        if (!info.loads.includes(loads._id)) {
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
    }
    if (response.status === 400) {
      trucksList.innerHTML = 'No loads'
    }
  }
})

getNewLoadsButton.addEventListener('click', () => {
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
        if (!info.loads.includes(loads._id) && load.status === "NEW") {
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
    }
    if (response.status === 400) {
      trucksList.innerHTML = 'No new loads'
    }
  }
})

addLoad.addEventListener('click', () => {
  const name = document.getElementById('name').value;
  const payload = document.getElementById('payload').value;
  const pickupAddress = document.getElementById('pickup_address').value;
  const deliveryAddress = document.getElementById('delivery_address').value;
  const width = document.getElementById('width').value;
  const length = document.getElementById('length').value;
  const height = document.getElementById('height').value;

  addOneLoad()
  async function addOneLoad() {
    const response = await fetch('http://localhost:8080/api/loads', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "name": name,
        "payload": payload,
        "pickup_address": pickupAddress,
        "delivery_address": deliveryAddress,
        'dimensions': {
          'width': width,
          'length': length,
          'height': height,
        },
      })
    })

    if (pickupAddress.length <= 0 || deliveryAddress.length <= 0) {
      load.innerHTML = `Please, fill up the necessary fields`;
      return
    }
    if (response.status === 200) {
      load.innerHTML = `Load created succesfully`;
      return
    } else {
      load.innerHTML = 'Load not created';
      return
    }
  }
})

postLoadButton.addEventListener('click', () => {
  const findLoad = document.getElementById('findLoad').value;
  postOneLoad();
  async function postOneLoad() {
    const response = await fetch(`http://localhost:8080/api//loads/${findLoad}/post`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
    })

    if (response.status === 200) {
      load.innerHTML = `Load posted sucessfully`;
    } else {
      load.innerHTML = `Load not posted`;
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
      load.innerHTML = 'Please provide load number';
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
      allLoads.innerHTML = '';
      load.innerHTML = 'No such load';
      return
    } else {
      allLoads.innerHTML = '';
      load.innerHTML = 'Please provide correct load number'
      return
    }
  }
})

editLoad.addEventListener('click', () => {
  const findLoad = document.getElementById('findLoad').value;

  const name = document.getElementById('name').value;
  const payload = document.getElementById('payload').value;
  const pickupAddress = document.getElementById('pickup_address').value;
  const deliveryAddress = document.getElementById('delivery_address').value;
  const width = document.getElementById('width').value;
  const length = document.getElementById('length').value;
  const height = document.getElementById('height').value;

  editOneLoad()
  async function editOneLoad() {
    const response = await fetch(`http://localhost:8080/api/loads/${findLoad}`, {
      method: 'PUT',
      credentials: 'same-origin',
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "name": name,
        "payload": payload,
        "pickup_address": pickupAddress,
        "delivery_address": deliveryAddress,
        'dimensions': {
          'width': width,
          'length': length,
          'height': height,
        },
      })
    })

    if (response.status === 200) {
      load.innerHTML = `Load edited succesfully`;
      return
    } else {
      load.innerHTML = 'Load not edited';
      return
    }
  }
})

deleteLoad.addEventListener('click', () => {
  const findLoad = document.getElementById('findLoad').value;
  deleteOneLoad()
  async function deleteOneLoad() {
    const response = await fetch(`http://localhost:8080/api/loads/${findLoad}`, {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
    })

    if (response.status === 200) {
      load.innerHTML = 'Load deleted succesfully'
    }
    if (response.status === 400) {
      load.innerHTML = 'Load not deleted'
    }
  }
})



shippingInfo.addEventListener('click', () => {
  const findLoad = document.getElementById('findLoad').value;
  getShippingInfo()

  async function getShippingInfo() {
    const response = await fetch(`http://localhost:8080/api/loads/${findLoad}/shipping_info`, {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
    })

    let info = await response.json();

    if (findLoad.length === 0) {
      load.innerHTML = 'Please provide load number';
      return;
    }
    if (response.status === 200) {
      const {truck} = info;
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
            <div>
            TRUCK:
            <h3>${truck.type}</h3>
            <p>Truck number: ${truck._id}</p>
            <p>Truck status: ${truck.status}</p>
            <p>Assigned to: ${truck.assigned_to || 'not asigned yet'}</p>
            <p> Created by and when: ${truck.created_by} , ${truck.createdDate}</p>
            </div>
            </div>
            `
      return
    }
    if (response.status === 400) {
      allLoads.innerHTML = '';
      load.innerHTML = 'No such load';
      return
    } else {
      allLoads.innerHTML = '';
      load.innerHTML = 'Please provide correct load number'
      return
    }
  }
})