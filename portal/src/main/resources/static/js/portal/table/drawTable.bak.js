
function k8sPo(name, arr) {
  arr.forEach((element, index) => {
    let containers = "";
    if (element.containers.length > 1) {
      element.containers.forEach((item, index) => {
        if (index === 0)
          containers += item.image;
        else 
          containers += "\n" + item.image;
      });
    } else {
      containers += element.containers[0].image;
    }
    tr = `<tr>
            <td>
              <i class="material-icons ${element.running === 'Running' ? 'text-success' : 'text-danger'}">
                ${element.running === 'Running' ? 'check_circle' : 'error'}
              </i>
            </td>
            <td>${element.name}</td>
            <td>${containers}</td>
            <td>${element.namespace}</td>
            <td>${element.serviceAccount ? element.serviceAccount : ''}</td>
            <td>${element.pods}</td>
            <td>${element.running}</td>
          </tr>
          `.trim();
    $(`#${name} tbody`).append(tr);
  });
}

function k8sPoDataTables(name, arr) {
  arr.forEach((element, index) => {
    let containers = "";
    if (element.containers.length > 1) {
      element.containers.forEach((item, index) => {
        if (index === 0)
          containers += item.image;
        else 
          containers += "\n" + item.image;
      });
    } else {
      containers += element.containers[0].image;
    }
    tr = `<tr>
            <td>
              <i class="material-icons ${element.running === 'Running' ? 'text-success' : 'text-danger'}">
                ${element.running === 'Running' ? 'check_circle' : 'error'}
              </i>
            </td>
            <td>${element.name}</td>
            <td>${containers}</td>
            <td>${element.namespace}</td>
            <td>${element.serviceAccount ? element.serviceAccount : ''}</td>
            <td>${element.pods}</td>
            <td>${element.running}</td>
          </tr>
          `.trim();
    $(`#${name} tbody`).append(tr);
  });
}

function k8sDeploy(name, arr) {
  arr.forEach(element => {
    tr = `<tr>
            <td>
              <i class="material-icons ${element.running === 'Running' ? 'text-success' : 'text-danger'}">
                ${element.running === 'Running' ? 'check_circle' : 'error'}
              </i>
            </td>
            <td>${element.name}</td>
            <td>${element.namespace}</td>
            <td>${element.pods}</td>
            <td>${element.running}</td>
          </tr>
          `.trim();
    $(`#${name} tbody`).append(tr);
  });
}

function k8sSts(name, arr) {
  arr.forEach(element => {
    let containers = "";
    if (element.containers.length > 1) {
      element.containers.forEach((item, index) => {
        if (index === 0)
          containers += item.image;
        else 
          containers += "\n" + item.image;
      });
    } else {
      containers += element.containers[0].image;
    }
    tr = `<tr>
            <td>
              <i class="material-icons ${element.running === 'Running' ? 'text-success' : 'text-danger'}">
                ${element.running === 'Running' ? 'check_circle' : 'error'}
              </i>
            </td>
            <td>${element.name}</td>
            <td>${containers}</td>
            <td>${element.namespace}</td>
            <td>${element.pods}</td>
            <td>${element.running}</td>
            </tr>
            `.trim();
            // <td>${element.pods}</td>
    $(`#${name} tbody`).append(tr);
  });
}

function k8sDs(name, arr) {
  arr.forEach((element, index) => {
    tr = `<tr>
            <td>
              <i class="material-icons ${element.running === 'Running' ? 'text-success' : 'text-danger'}">
                ${element.running === 'Running' ? 'check_circle' : 'error'}
              </i>
            </td>
            <td>${element.name}</td>
            <td>${element.namespace}</td>
            <td>${element.status.desiredNumberScheduled}</td>
            <td>${element.status.currentNumberScheduled}</td>
            <td>${element.status.numberReady}</td>
            <td>${element.status.updatedNumberScheduled}</td>
            <td>${element.status.numberAvailable}</td>
            <td>${element.running}</td>
          </tr>
          `.trim();
    $(`#${name} tbody`).append(tr);
  });
}

function k8sSvc(name, arr) {
  arr.forEach((element, index) => {
    let ports = "";
    element.ports.forEach((item, index) => {
      if (index === 0) {
        ports = `${item.port}${element.type === 'NodePort' ? `:${item.nodePort}` : ''}/${item.protocol}`;
      } else {
        ports += `, ${item.port}${element.type === 'NodePort' ? `:${item.nodePort}` : ''}/${item.protocol}`;
      }
    });

    tr = `<tr>
            <td>${index + 1}</td>
            <td>${element.name}</td>
            <td>${element.namespace}</td>
            <td>${element.type}</td>
            <td>${element.clusterIp}</td>
            <td>${ports}</td>
          </tr>
          `.trim();
    $(`#${name} tbody`).append(tr);
  });
}