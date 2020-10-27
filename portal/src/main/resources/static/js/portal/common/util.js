import table from '../table/drawTable.js';
import {
  _FIXED_POINT,
} from './constants.js';

/**
 * [array]
 * [
 *  {metric: {}, values: [[], [], []]}
 * ]
 *
 * [object]
 * {
 *  name0: { value[0]: value[1] }, { value[0]: value[1] },
 *  name1: { value[0]: value[1] }, { value[0]: value[1] },
 * }
 * @param {*} form
 */
// function mapToArray(arg) {
//   const [ map ] = arguments;
//   let arr = [];

//   for (const [e] of Object.entries(map)) {
//     console.log(e);
//   }
//   return arr;
// }

/**
 * array를 map형식의 object로 변환
 * @param {*} form
 */
// function arrayToMap(arg) {
//   const [ arr ] = arguments;
//   let map = {};

//   return map;
// }

/**
 * form 데이터를 json 형태로 parsing
 * @param {*} form
 */
function form2json(form) {
  const formData = new FormData(form);
  let jsonData = {};
  for (const [key, value] of formData.entries()) {
    // console.log(`${key} : ${value}`);
    jsonData[key] = value;
  }
  return jsonData;
  // console.log(JSON.stringify(jsonData));
}

/**
 * Using Fetch API async-await data
 * @param {*} url
 * @param {*} searchParams
 */
async function fetchTableData(url, searchParams) {
  const response = await fetch(`${url}?${searchParams}`, { method: "GET" });
  const json = await response.json();
  return json;
}

/**
 * 대시보드 테이블 생성
 * @param {*} type
 * @param {*} data
 */
function k8sObjectArrayTable(type, data) {
  const $table = $(`#${type}`).closest(`.card`);
  const $tbody = $(`#${type} tbody`);

  $table.css('display', 'table');
  $tbody.html('');
  // console.log(data);
  if (typeof data === 'undefined' || data === null || data.length === 0) {
    $table.css('display', 'none');
    return;
  }

  return table.drawTable(type, data);
}

/**
 * label 컬럼에서 더보기-숨기기 버튼
 * @param {*} arr
 */
function labelsShowAllButton(arr) {
  if (arr) {
    let accessModeEntry = [];
    for (let [key, value] of Object.entries(arr)) {
      if (key >= 2) {
        accessModeEntry.push(`<span class='hide-label'>${value}</span>\n`);
      } else {
        accessModeEntry.push(`<span>${value}</span>\n`);
      }
    }
    return accessModeEntry;
  } else {
    return null;
  }
}

/**
 * namespace select 옵션 삽입
 */
function renderNamespacePicker(ns) {
  const [ namespace ] = arguments;
  namespace.forEach(ns => {
    let nsOptions = `<option>${ns.name}</option>`;
    $(".selectpicker").eq(0).append(nsOptions);
  });
  $('.selectpicker').eq(0).selectpicker('refresh');
}

/**
 * 비율 단위 변환
 * @param {*} args
 */
function makePercent(args) {
  const [ arg ] = arguments;
  if (arg) {
    const rate = parseFloat(arg) * 100;
    return `${rate.toFixed(2)}%`;
  } else {
    return `-`;
  }
}

/**
 * CPU metric 정보 parsing
 * @param {*} args
 */
function makeCpuMetric(args) {
  const [ arg ] = arguments;
  if (arg) {
    return parseFloat(parseFloat(arg).toFixed(_FIXED_POINT)).toString();
  } else {
    return `-`;
  }
}

/**
 * MiB, GiB 로 단위 변환
 * @param {*} args
 */
function makeBiByte(args) {
  const [ arg ] = arguments;
  if (arg) {
    const size = parseFloat(arg)/1024/1024;
    if (size > 1000) {
      return `${(size/1024).toFixed(2)}GiB`;
    } else {
      return `${size.toFixed(2)}MiB`;
    }
  } else {
    return `-`;
  }
}

/**
 * selectpicker 생성
 * @param {*} label
 * @param {*} object
 * @param {*} pickerindex
 */
function drawPicker(label, object, pickerindex) {
  $('.selectpicker').eq(pickerindex).html(`<optgroup label="${label}" data-max-options="1"></optgroup>`);
  object.forEach((obj, index) => {
    if (index === 0) {
      const options = `<option selected>${obj.name}</option>`;
      $(".selectpicker").eq(pickerindex).find('optgroup').append(options);
    } else {
      const options = `<option>${obj.name}</option>`;
      $(".selectpicker").eq(pickerindex).find('optgroup').append(options);
    }
  });
  $('.selectpicker').eq(pickerindex).selectpicker('refresh');
}

function getCookie(name) {
  function escape(s) { return s.replace(/([.*+?\^${}()|\[\]\/\\])/g, '\\$1'); };
  var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
  return match ? match[1] : null;
}

const util = {
  form2json,
  k8sObjectArrayTable,
  fetchTableData,
  labelsShowAllButton,
  renderNamespacePicker,
  makePercent,
  makeCpuMetric,
  makeBiByte,
  drawPicker,
  getCookie,
}

export default util;