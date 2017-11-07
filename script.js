var COLUMN_STYLES = {
  'Hoax Beneficiaries': [
    {"group": "Non-Whites", 'color': '#5880FC'},
    {"group": "Whites", 'color': '#FFFFFF'},
    {"group": "Other", 'color': '#8EFEEE'},
    {"group": "Muslims/Arabs", 'color': '#5FFD81'},
    {"group": "LGBT", 'color': '#FC6356'}
  ],
  'Group Falsely Accused': [
    {'group': "Whites", 'color': '#FFFFFF'},
    {'group': "Heterosexuals", 'color': '#FCF356'},
    {'group': "Blacks", 'color': '#5880FC'},
    {'group': "Unknown/None", 'color': '#8EFEEE'}
  ]
};

function addLegend(map) {
  if (document.getElementById("legendWrapper")) {
    document.getElementById("legendWrapper").remove();
  }
  var legendWrapper = document.createElement('div');
  legendWrapper.id = 'legendWrapper';
  legendWrapper.index = 1;
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legendWrapper);
  legendContent(legendWrapper, column);
}

function legendContent(legendWrapper, column) {
  var legend = document.createElement('div');
  legend.id = 'legend';

  var title = document.createElement('div');
  title.innerHTML = column;
  title.style.marginBottom = "10px";
  legend.appendChild(title);

  var columnStyle = COLUMN_STYLES[column];
  for (var i in columnStyle) {
    var style = columnStyle[i];

    var legendItem = document.createElement('div');

    var color = document.createElement('div');
    color.classList.add("color-box");
    color.style.backgroundColor = style.color;
    legendItem.appendChild(color);

    var group = document.createElement('div');
    group.classList.add("group")
    group.innerHTML = style.group;
    legendItem.appendChild(group);

    legend.appendChild(legendItem);
  }

  legendWrapper.appendChild(legend);
}

function initSelectmenu() {
  var selectMenu = document.getElementById('selector');
  for (column in COLUMN_STYLES) {
    if (isMobile) {
      selectMenu.classList.add("mobile-select");
    } else {
      selectMenu.classList.add("desktop-select");
    }
    var option = document.createElement('option');
    option.setAttribute('value', column);
    option.innerHTML = column;
    selectMenu.appendChild(option);
  }
}

function initialize() {
  window.isMobile = (navigator.userAgent.toLowerCase().indexOf('android') > -1) ||
    (navigator.userAgent.match(/(iPod|iPhone|iPad|BlackBerry|Windows Phone|iemobile)/));
  if (isMobile) {
    var viewport = document.querySelector("meta[name=viewport]");
    viewport.setAttribute('content', 'initial-scale=1.0, user-scalable=no');
  }
  var mapDiv = document.getElementById('googft-mapCanvas');
  var map = new google.maps.Map(mapDiv, {
    center: new google.maps.LatLng(39.8283, -98.5795),
    zoom: 3,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  var groupFalselyImplicatedLayer = new google.maps.FusionTablesLayer({
    heatmap: { enabled: false },
    query: {
      select: "Address",
      from: "1ZqWOgWVNehnvFHJR1NNMspCXNJdElNwtnTya6EOD"
    },
    options: {
      styleId: 2,
      templateId: 2
    },
    styles: [
      { markerOptions: { iconName: 'ltblu_circle' }},
      { where: "'Group Falsely Accused' = 'Whites'", markerOptions: { iconName: 'wht_circle' }}, 
      { where: "'Group Falsely Accused' = 'Heterosexuals'", markerOptions: { iconName: 'ylw_circle' }},
      { where: "'Group Falsely Accused' = 'Blacks'", markerOptions: { iconName: 'blu_circle' }}
    ]
  });

  var hoaxBeneficiariesLayer = new google.maps.FusionTablesLayer({
    heatmap: { enabled: false },
    query: {
      select: "Address",
      from: "1ZqWOgWVNehnvFHJR1NNMspCXNJdElNwtnTya6EOD"
    },
    options: {
      styleId: 2,
      templateId: 2
    },
    styles: [
      {markerOptions: { iconName: 'ltblu_circle' }},
      { where: "'Hoax Beneficiaries' = 'Non-Whites'", markerOptions: { iconName: 'blu_circle' }},
      { where: "'Hoax Beneficiaries' = 'Whites'", markerOptions: { iconName: 'wht_circle' }},
      { where: "'Hoax Beneficiaries' = 'LGBT'", markerOptions: { iconName: 'red_circle' }},
      { where: "'Hoax Beneficiaries' = 'Arabs/Muslims'", markerOptions: { iconName: 'grn_circle' }}      
    ]
  });

  hoaxBeneficiariesLayer.setMap(map);
  window.column = 'Hoax Beneficiaries';
  addLegend(map);
  initSelectmenu();
  
  google.maps.event.addDomListener(document.getElementById('selector'),
    'change', function() {
      var selectedColumn = this.value;
      if (this.value == "Group Falsely Accused") {
        hoaxBeneficiariesLayer.setMap(null);
        groupFalselyImplicatedLayer.setMap(map);
        window.column = "Group Falsely Accused";
      } else if (this.value == "Hoax Beneficiaries") {
        groupFalselyImplicatedLayer.setMap(null);
        hoaxBeneficiariesLayer.setMap(map);
        window.column = "Hoax Beneficiaries";
      }
      addLegend(map);
    });
}

google.maps.event.addDomListener(window, 'load', initialize);