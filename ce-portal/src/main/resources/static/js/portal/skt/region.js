import table from '../table/drawTable.js';
import {
  _TABLE,
  // _NAME_DATA_INDEX,
} from '../common/constants.js';

let map;
let markers = [];
function initMap(data) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 37.380918, lng: 127.115756 },
    zoom: 5,
  });
  console.log(data);
  data.forEach((region) => {
    region.datacenter.forEach((dc) => {
      addMarker(dc)
    });
  });
  setMapOnAll(map);
}

function addMarker(datacenter) {
  const marker = new google.maps.Marker({
    position: {lat: datacenter.latitude, lng: datacenter.longitude},
    map: map,
  });
  marker.addListener("click", () => {
    table.drawTable(_TABLE.SKT_REGION, datacenter);

    fetch(`/skt/apps`, {
      method: "GET",
    })
    .then((data) => {
      return data.json();
    })
    .then((json) => {
      if (json) {
        let dcArray = [];
        json.applications.forEach(dc => {
          if (dc.datacenter_id === datacenter.id) {
            dcArray.push(dc);
          }
        });
        table.drawTable(_TABLE.SKT_APPS, dcArray);
      }
    })
    .catch(err => {
      console.log(err);
    });
  });
  markers.push(marker);
}

function setMapOnAll(map) {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function kakaoMap(data) {
  // console.log("kakaoMap : ", data);

  let positions = [];
  data.forEach((region) => {
    region.datacenter.forEach((dc) => {
      dc.latlng = new kakao.maps.LatLng(dc.latitude, dc.longitude);
      positions.push(dc);
    });
  });

  const mapContainer = document.getElementById("map"), // 지도를 표시할 div
    mapOption = {
      center: new kakao.maps.LatLng(35.907800, 127.766900), // 지도의 중심좌표
      level: 13, // 지도의 확대 레벨
    };

  // 지도를 생성합니다
  const map = new kakao.maps.Map(mapContainer, mapOption);

  for (let i = 0; i < positions.length; i ++) {
    // 마커를 생성합니다
    let marker = new kakao.maps.Marker({
        map: map, // 마커를 표시할 지도
        position: positions[i].latlng, // 마커를 표시할 위치
        title : positions[i].name, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        // image : markerImage // 마커 이미지
    });

    let iwContent = `
    <div style="width:150px;text-align:left;padding:6px 10px;">
      name: ${positions[i].name}<br>
      deploy: ${positions[i].deploy_type}<br>
      service: ${positions[i].service_type}<br>
    </div>`;

    // 인포윈도우로 장소에 대한 설명을 표시합니다
    let infowindow = new kakao.maps.InfoWindow({
      content: iwContent,
    });
    infowindow.open(map, marker);

    // 마커에 마우스오버 이벤트를 등록합니다
    kakao.maps.event.addListener(marker, 'mouseover', function() {
      // 마커에 마우스오버 이벤트가 발생하면 인포윈도우를 마커위에 표시합니다
      infowindow.open(map, marker);
    });

    // 마커에 마우스아웃 이벤트를 등록합니다
    // kakao.maps.event.addListener(marker, 'mouseout', function() {
    //   // 마커에 마우스아웃 이벤트가 발생하면 인포윈도우를 제거합니다
    //   infowindow.close();
    // });

    // 마커에 클릭이벤트를 등록합니다
    kakao.maps.event.addListener(marker, 'click', function() {
      table.drawTable(_TABLE.SKT_REGION, positions[i]);

      fetch(`/skt/apps`, {
        method: "GET",
      })
      .then((data) => {
        return data.json();
      })
      .then((json) => {
        if (json) {
          let dcArray = [];
          json.applications.forEach(dc => {
            if (dc.datacenter_id === positions[i].id) {
              dcArray.push(dc);
            }
          });
          table.drawTable(_TABLE.SKT_APPS, dcArray);
        }
      })
      .catch(err => {
        console.log(err);
      });
    });
  }
}

// Resource-Pod 메뉴에 들어갈 때 초기화하는 함수
function initRegionTable(data) {
  // console.log("data :", data);
  // table.drawTable("sktRegion", data);
}

const region = {
  initRegionTable,
  initMap,
  kakaoMap,
  // resizeMap,
  // relayout,
}

export default region;