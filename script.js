var COLUMN_STYLES = {
  '\"Victim\" Group': [
    {"group": "Blacks", 'color': '#5880FC'},
    {"group": "Whites", 'color': '#FFFFFF'},
    {"group": "Religious", 'color': '#5FFD81'},
    {"group": "LGBT", 'color': '#FC6355'},
    {"group": "Other Non-Whites", 'color': '#FCF457'}
  ],
  'Race of Hoaxer': [
    {'group': "Black", 'color': '#5880FC'},
    {'group': "White", 'color': '#FFFFFF'},
    {'group': "Middle Eastern", 'color': '#00DF3C'},
    {'group': "Hispanic", 'color': '#FF9B00'},
    {"group": "Other", 'color': '#FCF457'}
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
      from: "19UyeEhyEKazXypEgBiY-8VOYVQ2VNaM4xENLqJHB"
    },
    options: {
      styleId: 2,
      templateId: 2
    },
    styles: [
      { markerOptions: { iconName: 'ylw_circle' }},
      { where: "'Race' = 'White'", markerOptions: { iconName: 'wht_circle' }}, 
      { where: "'Race' = 'Hispanic'", markerOptions: { iconName: 'orange_circle' }},
      { where: "'Race' = 'Black'", markerOptions: { iconName: 'blu_circle' }},
      { where: "'Race' = 'Middle Eastern'", markerOptions: { iconName: 'grn_circle' }}
    ]
  });

  var hoaxBeneficiariesLayer = new google.maps.FusionTablesLayer({
    heatmap: { enabled: false },
    query: {
      select: "Address",
      from: "19UyeEhyEKazXypEgBiY-8VOYVQ2VNaM4xENLqJHB"
    },
    options: {
      styleId: 2,
      templateId: 2
    },
    styles: [
      {markerOptions: { iconName: 'ylw_circle' }},
      { where: "'\"Victim\" Group' = 'Blacks'", markerOptions: { iconName: 'blu_circle' }},
      { where: "'\"Victim\" Group' = 'Whites'", markerOptions: { iconName: 'wht_circle' }},
      { where: "'\"Victim\" Group' = 'LGBT'", markerOptions: { iconName: 'red_circle' }},
      { where: "'\"Victim\" Group' = 'Arabs/Muslims'", markerOptions: { iconName: 'grn_circle' }}      
    ]
  });

  hoaxBeneficiariesLayer.setMap(map);
  window.column = '\"Victim\" Group';
  addLegend(map);
  initSelectmenu();
  
  google.maps.event.addDomListener(document.getElementById('selector'),
    'change', function() {
      var selectedColumn = this.value;
      if (this.value == "Race of Hoaxer") {
        hoaxBeneficiariesLayer.setMap(null);
        groupFalselyImplicatedLayer.setMap(map);
        window.column = "Race of Hoaxer";
      } else if (this.value == "\"Victim\" Group") {
        groupFalselyImplicatedLayer.setMap(null);
        hoaxBeneficiariesLayer.setMap(map);
        window.column = "\"Victim\" Group";
      }
      addLegend(map);
    });
}

google.maps.event.addDomListener(window, 'load', initialize);
// group fraudlently claimed to have been victimized

// display instituation as location
// no group falsely accused