import popup from '../common/popup.js';
import util from '../common/util.js';
import table from '../table/drawTable.js';
import {
  _CONSTANT,
  _TABLE,
  _NAME_DATA_INDEX,
} from '../common/constants.js';

function initServiceTable(name) {
  fetch(`/resource/service/all`, {
    method: "GET"
  }).then(res => {
    return res.json();
  }).then(servicesData => {
    util.renderNamespacePicker(servicesData[_CONSTANT.NAMESPACES]);

    const tableInstance = table.drawTable(_TABLE.RSERVICES, servicesData.services);

    tableInstance.on('click', '.badge.remove', function(e) {
      $tr = $(this).closest('tr');
      tableInstance.row($tr).remove().draw();
      e.preventDefault();
    });

    tableInstance.on('click', `tbody>tr>td:nth-child(${_NAME_DATA_INDEX.SERVICE+1})`, newPopup);

    // const queryString = window.location.search;
    // const urlParams = new URLSearchParams(queryString);
    // const serviceName = urlParams.get('serviceName');

    if (name) {
      const searchInput = document.querySelector('input[type=search]');
      searchInput.value = name;
      searchInput.dispatchEvent(new KeyboardEvent('keyup', {}));
    }

  }).catch(err => {
    console.error(err);
  });
}

const select = (e) => {
  e.preventDefault();
  const _SELECT_NAMESPACE = document.getElementsByClassName('selectpicker')[0].value;

  fetch(`/resource/service/${_SELECT_NAMESPACE}`, {
    method: "GET"
  }).then(res => {
    return res.json();
  }).then(servicesData => {

    const tableInstance = table.drawTable(_TABLE.RSERVICES, servicesData.services);
    tableInstance.on('click', '.badge.remove', function(e) {
      $tr = $(this).closest('tr');
      tableInstance.row($tr).remove().draw();
      e.preventDefault();
    });
    tableInstance.on('click', `tbody>tr>td:nth-child(${_NAME_DATA_INDEX.SERVICE+1})`, popup);

  }).catch(err => {
    console.error(err);
  });
};

const newPopup = (e) => {
  const windowFeatures = popup();
  const serviceName = e.target.innerText;
  const namespaceName = e.target.nextElementSibling.innerText;
  const windowObjectReference = window.open(`/resource/service/${namespaceName}/${serviceName}`, `Service Info`, windowFeatures);
  if (window.focus) windowObjectReference.focus();
  // console.log(windowObjectReference.opener.rservices);
}

const rService = {
  initServiceTable: initServiceTable,
  select: select,
}

export default rService;