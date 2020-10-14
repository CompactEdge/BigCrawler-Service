import popup from '../common/popup.js';
import util from '../common/util.js';
import table from '../table/drawTable.js';
import {
  _CONSTANT,
  _TABLE,
  _NAME_DATA_INDEX,
} from '../common/constants.js';

function initPvcTable() {
  fetch(`/resource/storage/all`, {
    method: "GET"
  }).then(res => {
    return res.json();
  }).then(storageData => {
    if (storageData === null) throw new Error("services data is null!");

    util.renderNamespacePicker(storageData[_CONSTANT.NAMESPACES]);

    // Draw table
    const tableInstance = table.drawTable(_TABLE.RSTORAGES, storageData.persistentVolumeClaims);

    // Delete a record
    tableInstance.on('click', '.badge.remove', function(e) {
      $tr = $(this).closest('tr');
      tableInstance.row($tr).remove().draw();
      e.preventDefault();
    });

    tableInstance.on('click.DT', `tbody>tr>td:nth-child(${_NAME_DATA_INDEX.STORAGE+1})`, newPopup);

  }).catch(err => {
    console.error(err);
  });
}

// selectpicker (namespace)
const select = (e) => {
  e.preventDefault();

  const _SELECT_NAMESPACE = document.getElementsByClassName('selectpicker')[0].value;

  fetch(`/resource/storage/${_SELECT_NAMESPACE}`, {
    method: "GET"
  }).then(res => {
    return res.json();
  }).then(storageData => {
    if (storageData === null) throw new Error("services data is null!");

    const tableInstance = table.drawTable(_TABLE.RSTORAGES, storageData.persistentVolumeClaims);

    tableInstance.on('click', '.badge.remove', function(e) {
      $tr = $(this).closest('tr');
      tableInstance.row($tr).remove().draw();
      e.preventDefault();
    });

    tableInstance.on('click.DT', `tbody>tr>td:nth-child(${_NAME_DATA_INDEX.STORAGE+1})`, newPopup);

  }).catch(err => {
    console.error(err);
  });
};

const newPopup = (e) => {
  const windowFeatures = popup();
  const storageName = e.target.innerText;
  const namespaceName = e.target.nextElementSibling.innerText;
  const windowObjectReference = window.open(`/resource/storage/${namespaceName}/${storageName}`, `Storage Info`, windowFeatures);
  if (window.focus) windowObjectReference.focus();
  // console.log(windowObjectReference.opener.rstorages);
}

const rStorage = {
  initPvcTable: initPvcTable,
  select: select,
}

export default rStorage;