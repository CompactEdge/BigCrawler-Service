import popup from '../common/popup.js';
import table from '../table/drawTable.js';
import {
  _TABLE,
  _NAME_DATA_INDEX,
} from '../common/constants.js';

function initNodeTable() {
  fetch(`/resource/node/all`, {
    method: "GET"
  }).then(res => {
    return res.json();
  }).then(nodesData => {
    const tableInstance = table.drawTable(_TABLE.RNODES, nodesData.nodes);
    tableInstance.on('click', `tbody>tr>td:nth-child(${_NAME_DATA_INDEX.NODE+1})`, newPopup);
  }).catch(err => {
    console.error(err);
  });
}

const newPopup = (e) => {
  const windowFeatures = popup();
  const nodeName = e.target.innerText;
  const windowObjectReference = window.open(`/resource/node/${nodeName}`, `Node Info`, windowFeatures);
  if (window.focus) windowObjectReference.focus();
  // console.log(windowObjectReference.opener.rnodes);
}

const rNode = {
  initNodeTable: initNodeTable,
}

export default rNode;