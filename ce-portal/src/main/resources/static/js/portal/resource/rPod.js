import popup from '../common/popup.js';
import util from '../common/util.js';
import table from '../table/drawTable.js';
import {
  _CONSTANT,
  _TABLE,
  _NAME_DATA_INDEX,
} from '../common/constants.js';

// Resource-Pod 메뉴에 들어갈 때 초기화하는 함수
function initPodTable(name) {
  fetch(`/resource/pod/all/all`, {
    method: "GET"
  }).then(res => {
    return res.json();
  }).then(podData => {
    util.renderNamespacePicker(podData[_CONSTANT.NAMESPACES]);
    const tableInstance = table.drawTable(_TABLE.RPODS, dataEntry(podData));
    tableInstance
      .on('click','.badge.remove', function(e) {
        e.preventDefault();
        const check = confirm('정말 삭제하시겠습니까?');
        if (check) deletePod($(this), tableInstance);
      })
      .on('click', `tbody>tr>td:nth-child(${_NAME_DATA_INDEX.POD+1})`, newPopup);
    // console.log(name);
    if (name) {
      const searchInput = document.querySelector('input[type=search]');
      searchInput.value = name;
      searchInput.dispatchEvent(new KeyboardEvent('keyup', {}));
    }

  }).catch(err => {
    console.error(err);
  });
}

// 대시보드에서 특정 pod을 선택했을 때 데이터를 가져오는 함수
function pickType(type, name) {
  const [ typeParam, nameParam ] = arguments;
  fetch(!typeParam
        ? `/resource/pod/select/all/all/${nameParam}`
        : `/resource/pod/select/all/${typeParam}/${nameParam}`, {
    method: "GET"
  }).then(res => {
    return res.json();
  }).then(podData => {
    !typeParam
    ? document.getElementsByClassName("selectpicker")[1].value = "all"
    : document.getElementsByClassName("selectpicker")[1].value = typeParam;

    $('.selectpicker').eq(1).selectpicker('render');
    renderNamespacePicker(podData[_CONSTANT.NAMESPACES]);

    const tableInstance = table.drawTable(_TABLE.RPODS, dataEntry(podData));
    tableInstance
      .on('click', '.badge.remove', function(e) {
        e.preventDefault();
        const check = confirm('정말 삭제하시겠습니까?');
        if (check) deletePod($(this), tableInstance);
      })
      .on('click', `tbody>tr>td:nth-child(${_NAME_DATA_INDEX.POD+1})`, newPopup);

    const searchInput = document.querySelector('input[type=search]');
    searchInput.value = nameParam;
    searchInput.dispatchEvent(new KeyboardEvent('keyup', {}));

  }).catch(err => {
    console.error(err);
  });
}

const select = (e) => {
  const _SELECT_NAMESPACE = document.getElementsByClassName("selectpicker")[0].value;
  const _SELECT_TYPE = document.getElementsByClassName("selectpicker")[1].value;
  fetch(`/resource/pod/${_SELECT_NAMESPACE}/${_SELECT_TYPE}`, {
    method: "GET"
  }).then(res => {
    return res.json();
  }).then(podData => {
    const tableInstance = table.drawTable(_TABLE.RPODS, dataEntry(podData));
    tableInstance
      .on('click', '.badge.remove', function(e) {
        e.preventDefault();
        const check = confirm('정말 삭제하시겠습니까?');
        if (check) deletePod($(this), tableInstance);
      });
  });
};

const newPopup = (e) => {
  const windowFeatures = popup();
  const podName = e.target.innerText;
  const namespaceName = e.target.nextElementSibling.nextElementSibling.innerText;
  const windowObjectReference = window.open(`/resource/pod/${namespaceName}/all/${podName}`, `Pod Info`, windowFeatures);
  if (window.focus) windowObjectReference.focus();
  // console.log(windowObjectReference.opener.rpods);
}

// check = pod의 상태 아이콘
// element = data
// action = 테이블 끝에 삭제 버튼
function dataEntry(data) {
  const [ podData ] = arguments;
  const keys = Object.keys(podData);
  let podDataEntry = [];
  for (let key of keys) {
    if (key === _CONSTANT.NAMESPACES) continue;
    podData[key].forEach(element => {
      element["check"] = `
        <i class='material-icons ${element.running === 'Running' ? 'text-success' : 'text-warning'}'>
          ${element.running === 'Running' ? 'check_circle' : 'warning'}
        </i>
      `;
      podDataEntry.push(element);
      element["action"] = `
        <span class="badge badge-danger remove">DEL</span>
      `;
    });
  }
  return podDataEntry;
}

function deletePod($this, table) {
  const $tr = $this.closest('tr');
  const podName = $tr.find('td').eq(1).text();
  const namespaceName = $tr.find('td').eq(3).text();
  const podType = $('.selectpicker').eq(1).val();

  fetch(`/resource/pod/${namespaceName}/${podType}/${podName}`, {
    method: 'DELETE'
  }).then(res => {
    table.row($tr).remove().draw();
    return res.json();
  }).then(data => {
    console.log(data);
  }).catch(err => {
    console.error(err);
  });
}

const rPod = {
  initPodTable,
  select,
  pickType,
}

export default rPod;