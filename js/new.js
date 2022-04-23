//mapbox accessToken
mapboxgl.accessToken = 'pk.eyJ1IjoicnVvY2hhbmciLCJhIjoiY2plMGN5NmduNTBzMzJ3cXA4OHJqbTg1MCJ9.hVntg2f96UxD239bHHlQFw';

//Set the map
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/ruochang/cjgx7h9d8000b2so75lhsbpjh',
    center: [-97,39],
    zoom: 3.5
});
map.addControl(new mapboxgl.NavigationControl());



//Get and Plot Live and historical data
//Size and fill styling are based on bike and dock availability
var yieldurl = 'https://raw.githubusercontent.com/RuochangH/test/0350e597361ad5a2e3ed5c2fdcb6413e79bd2bd7/Output.geojson';
var predURL = 'https://raw.githubusercontent.com/CSE6242Team45/CSE6242Team45.github.io/main/PricePred.geojson';

var landingPage =function(){

// Get and plot historical data as icons
//later used to provide historical information on click
    $.ajax(predURL).done(function(data) {
      var parsedData = JSON.parse(data);
        //plot
        map.addSource('pred',{type:'geojson',data:parsedData});
 
        map.addLayer({
          "id":"color",
          "type":"fill",
          "source":"pred",
          "filter":
          ["==","Field2","Corn"],
          "layout":{},
          "paint":{'fill-color':['interpolate',['linear'],['get','26_Dec'],0, '#B4E7CE', 5,'#9BDEAC',10,'#59A96A',15,'#636940',20,'#474A2C'],
                   'fill-opacity':0.75}
          
        });
        map.addLayer({
          "id":"outline",
          "type":"line",
          "source":"pred",
          "layout":{},
          "paint":{'line-color':'gray',
                   'line-width':2}  
        });
        map.addLayer({
          "id":"prediction",
          "type":"symbol",
          "source":"pred",
          "filter":
          ["==","Field2","Corn"],
          "layout":{
            "icon-image":"garden-11"
          }
        });
    });
    

    //Create click Event
    map.on('click', 'prediction', function (e) {
      map.flyTo({center: e.features[0].geometry.coordinates[0][0]});
      var coordinates = e.features[0].geometry.coordinates.slice()[0][0];
  
        var div = window.document.createElement('div');
        div.innerHTML ='<h5 style="color:#535E80 text-align: center">Five Year Price Prediction by Month</h5><svg/>';
                var values = e.features[0].properties;
                var data =[values['22_Mar'],values['22_Apr'],values['22_May'],values['22_Jun'],values['22_Jul'],values['22_Aug'],values['22_Sep'],values['22_Oct'],values['22_Nov'],values['22_Dec'],values['23_Jan'],values['23_Feb'],
                values['23_Mar'],values['23_Apr'],values['23_May'],values['23_Jun'],values['23_Jul'],values['23_Aug'],values['23_Sep'],values['23_Oct'],values['23_Nov'],values['23_Dec'],values['24_Jan'],values['24_Feb'],
                values['24_Mar'],values['24_Apr'],values['24_May'],values['24_Jun'],values['24_Jul'],values['24_Aug'],values['24_Sep'],values['24_Oct'],values['24_Nov'],values['24_Dec'],values['25_Jan'],values['25_Feb'],
                values['25_Mar'],values['25_Apr'],values['25_May'],values['25_Jun'],values['25_Jul'],values['25_Aug'],values['25_Sep'],values['25_Oct'],values['25_Nov'],values['25_Dec'],values['26_Jan'],values['26_Feb'],
                values['26_Mar'],values['26_Apr'],values['26_May'],values['26_Jun'],values['26_Jul'],values['26_Aug'],values['26_Sep'],values['26_Oct'],values['26_Nov'],values['26_Dec']];
                var predmonth = [];
                for (var yr=2022; yr < 2027; yr++){
                  for(var mth=1; mth < 13; mth++){
                    predmonth.push(new Date(mth+"/01/"+yr));
                  }
                }
                predmonth = predmonth.slice(2);

                var margin = {top:20, right:50,bottom:20,left:50},
                    width = 340 - margin.left - margin.right,
                    height = 200 - margin.top - margin.bottom,
                    barHeight = height/data.length;

                    var y0 = Math.max(Math.abs(d3.min(data)), Math.abs(d3.max(data)));
                    var y = d3.scale.linear()
                      .domain([0, y0])
                      .range([height,0])
                      .nice();

                    var timescale = d3.time.scale()
                      .range([1.5,width-1.5])
                      .domain(d3.extent(predmonth));

                    var x = d3.scale.linear()
                      .domain([0,data.length])
                      .range([0, width]);

                    var svg = d3.select(div).select("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    var yAxis = d3.svg.axis()
                      .scale(y)
                      .orient("left");

                    var xAxis = d3.svg.axis()
                      .scale(timescale)
                      .ticks(d3.time.month,6)
                      .tickFormat(d3.time.format('%b %y'))
                      .orient("bottom");

                    var bar = svg.selectAll("g.bar")
                    .data(data)
                    .enter().append("g");

                    bar.append("rect")
                    .attr("class", function(d) { return d < 0 ? "bar negative" : "bar positive"; })
                    .attr("y", function(d) { return y(Math.max(0, d)); })
                    .attr("x", function(d, i) { return x(i); })
                    .attr("height", function(d) { return Math.abs(y(d) - y(0)); })
                    .attr("width", 3);

                  svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text").text("Price ($)")
                    .attr("transform","rotate(-90)")
                    .attr("text-anchor","middle")
                    .attr("x",-height/2)
                    .attr("y",0)
                    .attr("dy","-3em");

                  svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform","translate(0,"+height+")")
                    .call(xAxis)
                    .selectAll("text")
                    .attr("transform","rotate(-20)")
                    .attr("text-anchor","middle")
                    
                  // svg.append("g")
                  //   .attr("class", "x axis")
                  //   .append("line")
                  //   .attr("y1", y(0))
                  //   .attr("y2", y(0))
                  //   .attr("x1", 0)
                  //   .attr("x2", width);

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        var popup =new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setDOMContent(div)
        popup.addTo(map)
    });



map.on('load', function () {
    //map.addSource('pred', { type: 'geojson', data: predURL})
    
    map.addLayer({
      "id":"color-Hover",
      "type":"fill",
      "source":"pred",
      "layout":{},
      "filter":
      ["==","GEOID",""],
      "paint":{'fill-color':'#0080ff',
               'fill-opacity':1}
      
    });
    map.addLayer({
      "id":"outline-Hover",
      "type":"line",
      "source":"pred",
      "layout":{},
      "filter":
      ["==","GEOID",""],
      "paint":{'line-color':'black',
               'line-width':2}
      
    });

//Hover Effect
    map.on('mouseenter', 'prediction', function(e) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';
        map.setFilter("color-Hover",["==","GEOID",e.features[0].properties.GEOID]);
        map.setFilter("outline-Hover",["==","GEOID",e.features[0].properties.GEOID]);
        var coordinates = e.features[0].geometry.coordinates.slice()[0][0];
        var description = "<strong>"+e.features[0].properties.NAME + " State</strong><br>"+
        " $"+ e.features[0].properties['26_Dec']+"<br>";
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        var station = map.queryRenderedFeatures(e.point, {
          layers: ['prediction']
        });

          if (station.length > 0) {
            document.getElementById('pd').innerHTML = description;
          } else {
            document.getElementById('pd').innerHTML = '<p>Hover Over a State for Detail!</p>';
          }

    });

    map.on('mouseleave', 'color', function() {
        map.setFilter("color-Hover",["==","GEOID",""]);
        map.setFilter("outline-Hover",["==","GEOID",""]);
        map.getCanvas().style.cursor = '';
    });

});
};

landingPage();




  //Allow user to check selected types of availabilities without accessing there locations
  $('#viewAll').click(function(){
    
    function readInput(){
      switch($('#crops').find(":selected").text()){
        case 'Barley': return 'Barley';
        case 'Corn':  return 'Corn';
        case 'Potato': return 'Potato';
        case 'Soybean': return 'Soybean';
        case 'Wheat': return 'Wheat'}
  }
    var availability = readInput();


    function readTime(){
      switch($('#time').find(":selected").text()){
        case '2022 Mar': return '22_Mar';
        case '2022 Apr':  return '22_Apr';
        case '2022 May': return '22_May';
        case '2022 Jun':  return '22_Jun';
        case '2022 Jul': return '22_Jul';
        case '2022 Aug': return '22_Aug';
        case '2022 Sept': return '22_Sept';
        case '2022 Oct': return '22_Oct';
        case '2022 Nov': return '22_Nov';
        case '2022 Dec': return '22_Dec';
        case '2023 Jan': return '23_Jan';
        case '2023 Feb': return '23_Feb';
        case '2023 Mar': return '23_Mar';
        case '2023 Apr':  return '23_Apr';
        case '2023 May': return '23_May';
        case '2023 Jun':  return '23_Jun';
        case '2023 Jul': return '23_Jul';
        case '2023 Aug': return '23_Aug';
        case '2023 Sept': return '23_Sept';
        case '2023 Oct': return '23_Oct';
        case '2023 Nov': return '23_Nov';
        case '2023 Dec': return '23_Dec';
        case '2024 Jan': return '24_Jan';
        case '2024 Feb': return '24_Feb';
        case '2024 Mar': return '24_Mar';
        case '2024 Apr':  return '24_Apr';
        case '2024 May': return '24_May';
        case '2024 Jun':  return '24_Jun';
        case '2024 Jul': return '24_Jul';
        case '2024 Aug': return '24_Aug';
        case '2024 Sept': return '24_Sept';
        case '2024 Oct': return '24_Oct';
        case '2024 Nov': return '24_Nov';
        case '2024 Dec': return '24_Dec';
        case '2025 Jan': return '25_Jan';
        case '2025 Feb': return '25_Feb';
        case '2025 Mar': return '25_Mar';
        case '2025 Apr':  return '25_Apr';
        case '2025 May': return '25_May';
        case '2025 Jun':  return '25_Jun';
        case '2025 Jul': return '25_Jul';
        case '2025 Aug': return '25_Aug';
        case '2025 Sept': return '25_Sept';
        case '2025 Oct': return '25_Oct';
        case '2025 Nov': return '25_Nov';
        case '2025 Dec': return '25_Dec';
        case '2026 Jan': return '26_Jan';
        case '2026 Feb': return '26_Feb';
        case '2026 Mar': return '26_Mar';
        case '2026 Apr':  return '26_Apr';
        case '2026 May': return '26_May';
        case '2026 Jun':  return '26_Jun';
        case '2026 Jul': return '26_Jul';
        case '2026 Aug': return '26_Aug';
        case '2026 Sept': return '26_Sept';
        case '2026 Oct': return '26_Oct';
        case '2026 Nov': return '26_Nov';
        case '2026 Dec': return '26_Dec';}
    }
    var time = readTime();

   // if(popup.isOpen()){popup.remove();}
    //if(newpopup.isOpen()){newpopup.remove();}
    if(map.getLayer('color')){map.removeLayer('color');}
    if(map.getLayer('prediction')){map.removeLayer('prediction');}
    if(map.getLayer('outline')){map.removeLayer('outline');}
    if(map.getLayer('color-Hover')){map.removeLayer('color-Hover');}
    if(map.getLayer('outline-Hover')){map.removeLayer('outline-Hover')}

    if(map.getLayer('new-color')){map.removeLayer('new-color');}
    if(map.getLayer('new-prediction')){map.removeLayer('new-prediction');}
    if(map.getLayer('new-outline')){map.removeLayer('new-outline');}
    if(map.getLayer('new-color-Hover')){map.removeLayer('new-color-Hover');}
    if(map.getLayer('new-outline-Hover')){map.removeLayer('new-outline-Hover');}
    

    map.addLayer({
      "id":"new-color",
      "type":"fill",
      "source":"pred",
      "filter":
      ["==","Field2",availability],
      "layout":{},
      "paint":{'fill-color':['interpolate',['linear'],['get',time],0, '#B4E7CE', 5,'#9BDEAC',10,'#59A96A',15,'#636940',20,'#474A2C'],
               'fill-opacity':0.75}
      
    });

    map.addLayer({
      "id":"new-outline",
      "type":"line",
      "source":"pred",
      "layout":{},
      "paint":{'line-color':'gray',
               'line-width':2}
      
    });

    map.addLayer({
      "id":"new-prediction",
      "type":"symbol",
      "source":"pred",
      "filter":
      ["==","Field2",availability],
      "layout":{
        "icon-image":"garden-11"
      }
  });

    map.addLayer({
      "id":"new-color-Hover",
      "type":"fill",
      "source":"pred",
      "layout":{},
      "filter":
      ["==","GEOID",""],
      "paint":{'fill-color':'#0080ff',
               'fill-opacity':1}
      
    });
    map.addLayer({
      "id":"new-outline-Hover",
      "type":"line",
      "source":"pred",
      "layout":{},
      "filter":
      ["==","GEOID",""],
      "paint":{'line-color':'black',
               'line-width':2}
      
    });
    map.on('mouseenter', 'new-prediction', function(e) {
      // Change the cursor style as a UI indicator.
      map.getCanvas().style.cursor = 'pointer';
      map.setFilter("new-color-Hover",["==","GEOID",e.features[0].properties.GEOID]);
      map.setFilter("new-outline-Hover",["==","GEOID",e.features[0].properties.GEOID]);
      var coordinates2 = e.features[0].geometry.coordinates.slice()[0][0];
      var description2 = "<strong>"+e.features[0].properties['NAME'] + " State</strong><br>"+
      " $"+ e.features[0].properties[time]+"<br>";

      while (Math.abs(e.lngLat.lng - coordinates2[0][0]) > 180) {
          coordinates2[0][0] += e.lngLat.lng > coordinates2[0][0] ? 360 : -360;
      }
      var station0 = map.queryRenderedFeatures(e.point, {
        layers: ['new-color']
      });

        if (station0.length > 0) {
          document.getElementById('pd').innerHTML = description2;
        } else {
          document.getElementById('pd').innerHTML = '<p>Hover Over a County for Detail!</p>';
        }

  });

  map.on('mouseleave', 'new-prediction', function() {
    map.setFilter("new-color-Hover",["==","GEOID",""]);
    map.setFilter("new-outline-Hover",["==","GEOID",""]);
      map.getCanvas().style.cursor = '';});


      map.on('click', 'new-prediction', function (e) {
        map.flyTo({center: e.features[0].geometry.coordinates[0][0]});
        var coordinates = e.features[0].geometry.coordinates.slice()[0][0];
    
          var div = window.document.createElement('div');
          div.innerHTML ='<h5 style="color:#535E80 text-align: center">Five Year Price Prediction by Month</h5><svg/>';
                  var values = e.features[0].properties;
                  var data =[values['22_Mar'],values['22_Apr'],values['22_May'],values['22_Jun'],values['22_Jul'],values['22_Aug'],values['22_Sep'],values['22_Oct'],values['22_Nov'],values['22_Dec'],values['23_Jan'],values['23_Feb'],
                  values['23_Mar'],values['23_Apr'],values['23_May'],values['23_Jun'],values['23_Jul'],values['23_Aug'],values['23_Sep'],values['23_Oct'],values['23_Nov'],values['23_Dec'],values['24_Jan'],values['24_Feb'],
                  values['24_Mar'],values['24_Apr'],values['24_May'],values['24_Jun'],values['24_Jul'],values['24_Aug'],values['24_Sep'],values['24_Oct'],values['24_Nov'],values['24_Dec'],values['25_Jan'],values['25_Feb'],
                  values['25_Mar'],values['25_Apr'],values['25_May'],values['25_Jun'],values['25_Jul'],values['25_Aug'],values['25_Sep'],values['25_Oct'],values['25_Nov'],values['25_Dec'],values['26_Jan'],values['26_Feb'],
                  values['26_Mar'],values['26_Apr'],values['26_May'],values['26_Jun'],values['26_Jul'],values['26_Aug'],values['26_Sep'],values['26_Oct'],values['26_Nov'],values['26_Dec']];
                  var predmonth = [];
                  for (var yr=2022; yr < 2027; yr++){
                    for(var mth=1; mth < 13; mth++){
                      predmonth.push(new Date(mth+"/01/"+yr));
                    }
                  }
                  predmonth = predmonth.slice(2);
                  var margin = {top:20, right:50,bottom:20,left:50},
                      width = 340 - margin.left - margin.right,
                      height = 200 - margin.top - margin.bottom,
                      barHeight = height/data.length;
  
                      var y0 = Math.max(Math.abs(d3.min(data)), Math.abs(d3.max(data)));
                      var y = d3.scale.linear()
                        .domain([0, y0])
                        .range([height,0])
                        .nice();
  
                      var timescale = d3.time.scale()
                        .range([1.5,width-1.5])
                        .domain(d3.extent(predmonth));
  
                      var x = d3.scale.linear()
                        .domain([0,data.length])
                        .range([0, width]);
  
                      var svg = d3.select(div).select("svg")
                          .attr("width", width + margin.left + margin.right)
                          .attr("height", height + margin.top + margin.bottom)
                          .append("g")
                          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
                      var yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left");

                      var xAxis = d3.svg.axis()
                        .scale(timescale)
                        .ticks(d3.time.month,6)
                        .tickFormat(d3.time.format('%b %y'))
                        .orient("bottom");  
                        
                      var bar = svg.selectAll("g.bar")
                      .data(data)
                      .enter().append("g");
  
                      bar.append("rect")
                      .attr("class", function(d) { return d < 0 ? "bar negative" : "bar positive"; })
                      .attr("y", function(d) { return y(Math.max(0, d)); })
                      .attr("x", function(d, i) { return x(i); })
                      .attr("height", function(d) { return Math.abs(y(d) - y(0)); })
                      .attr("width", 3);

                      svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                        .append("text").text("Price ($)")
                        .attr("transform","rotate(-90)")
                        .attr("text-anchor","middle")
                        .attr("x",-height/2)
                        .attr("y",0)
                        .attr("dy","-3em");
    
                      svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform","translate(0,"+height+")")
                        .call(xAxis)
                        .selectAll("text")
                        .attr("transform","rotate(-20)")
                        .attr("text-anchor","middle")
                        
          // Ensure that if the map is zoomed out such that multiple
          // copies of the feature are visible, the popup appears
          // over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
  
          var newpopup =new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setDOMContent(div)
          newpopup.addTo(map)
      });
  });

 

  





    //Add geolocator
  var geolocate= new mapboxgl.GeolocateControl({
      positionOptions: {
          enableHighAccuracy: true
      },
      //trackUserLocation: true,
      showUserLocation:false
  });

  map.addControl(geolocate);


var user=[0,0];
geolocate.on('geolocate', function(e){
//var userUpdate=[0,0];
map.flyTo({
  center:[e.coords.longitude, e.coords.latitude], 
  zoom:8});
  user[0]=e.coords.longitude;
  user[1]=e.coords.latitude;

  console.log(user);

  var canvas = map.getCanvasContainer();

  var geojson = {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": user
        }
    }]
};
map.addSource('point', {
    "type": "geojson",
    "data": geojson
});
map.addLayer({
        "id": "point",
        "type": "circle",
        "source": "point",
        "paint": {
            "circle-radius": 8,
            "circle-color": "#3887be"
        }
    });


  function onMove(e) {
    var coords = e.lngLat;

    // Set a UI indicator for dragging.
    canvas.style.cursor = 'grabbing';

    // Update the Point feature in `geojson` coordinates
    // and call setData to the source layer `point` on it.
    geojson.features[0].geometry.coordinates = [coords.lng, coords.lat];

    map.getSource('point').setData(geojson);
}

function onUp(e) {
    var coords = e.lngLat;
    user[0]=coords.lng;
    user[1]=coords.lat;
    canvas.style.cursor = '';

    // Unbind mouse/touch events
    map.off('mousemove', onMove);
    map.off('touchmove', onMove);
}


    // When the cursor enters a feature in the point layer, prepare for dragging.
    map.on('mouseenter', 'point', function() {
        map.setPaintProperty('point', 'circle-color', '#3bb2d0');
        canvas.style.cursor = 'move';
    });

    map.on('mouseleave', 'point', function() {
        map.setPaintProperty('point', 'circle-color', '#3887be');
        canvas.style.cursor = '';
    });

    map.on('mousedown', 'point', function(e) {
        // Prevent the default map drag behavior.
        e.preventDefault();

        canvas.style.cursor = 'grab';

        map.on('mousemove', onMove);
        map.once('mouseup', onUp);
    });

    map.on('touchstart', 'point', function(e) {
        if (e.points.length !== 1) return;

        // Prevent the default map drag behavior.
        e.preventDefault();

        map.on('touchmove', onMove);
        map.once('touchend', onUp);
          });

          //read user input
          $('#findStation').click(function(){
            map.removeLayer('liveBike');
            map.removeLayer('liveBike-Hover');
            map.removeLayer('new');
            map.removeLayer('new-Hover');
            //map.addLayer('nearest');
            //map.addLayer('balance');

            if(map.getLayer('nearest')){
            map.removeLayer('nearest');
            map.removeSource('coorr');}

            if(map.getLayer('balance')){
            map.removeLayer('balance');
            map.removeSource('coorr2');}

            if(map.getLayer('route')){
            map.removeLayer('route');
            map.removeSource('route');}

            if(map.getLayer('route2')){
            map.removeLayer('route2');
            map.removeSource('route2');}

            $('.legend0').hide();
            $('.legend1').hide();
            $('#routttt').show();
            $('#alllll').hide();
            $('#route').show();



          function readInput(){
            switch($('#purpose').find(":selected").text()){
              case 'Station Check': return 'totalDocks';
              case 'Rent':  return 'bikesAvailable';
              case 'Return': return 'docksAvailable';}
          }
          var availability = readInput();
          

            $.ajax({method: 'GET',url:url,}).done(function(data){
              var filteredFeatures = data.features.filter(function(feature){
                return feature.properties[availability]>1;
              });


          //get raw coordinates for turf
              var forturf= _.map(filteredFeatures, function(feature){
                var a=feature.geometry.coordinates[1];
                var b=feature.geometry.coordinates[0];
                return turf.point([a,b]);});
              var selection=turf.featureCollection(forturf);
              //console.log(forturf);
              var foruser = [0,0];
              foruser[0]=user[1];
              foruser[1]=user[0];
              var target = turf.point(foruser);
              console.log(target);
              var nearest = turf.nearestPoint(target,selection);
              var coor = [nearest.geometry.coordinates[1],nearest.geometry.coordinates[0]];
              console.log(coor);

              var coorr =
               {
                  "type": "Feature",
                  "geometry": {
                      "type": "Point",
                      "coordinates": coor
                  }
              };

              map.addSource(
                'coorr',{
                'type':'geojson',
                'data':coorr
              });

              map.addLayer({
                'id': 'nearest',
                'type': 'circle',
                'source': 'coorr',
                  'paint': {
                    'circle-color': 'orange',
                    'circle-opacity': 0.8,
                    'circle-radius':12
                  }
                },'hist');


              var d = new Date();
              var hr= d.getHours()+1;

              $.ajax(histURL).done(function(data) {
                var parsedData = JSON.parse(data);
                var filteredFeatures2;

                var forhist = function(){
                  switch($('#purpose').find(":selected").text()){
                    case 'Station Check': filteredFeatures2= parsedData.features.filter(function(feature){
                      return feature.properties['h'+hr]>0.1 | feature.properties['h'+hr]<-0.1;}); break;
                      case 'Rent': filteredFeatures2= parsedData.features.filter(function(feature){
                        return feature.properties['h'+hr]>0.1;}); break;
                        case 'Return': filteredFeatures2= parsedData.features.filter(function(feature){
                          return feature.properties['h'+hr]<-0.1;}); break;
                  }
                };

                forhist();
                var forturf2= _.map(filteredFeatures2, function(feature){
                  var a=feature.geometry.coordinates[1];
                  var b=feature.geometry.coordinates[0];
                  return turf.point([a,b]);});
                var selection2=turf.featureCollection(forturf2);
                console.log(selection2);

                var balance = turf.nearestPoint(target,selection2);
                console.log(balance);
                var coor2 = [balance.geometry.coordinates[1],balance.geometry.coordinates[0]];
                console.log(coor2);

                var coorr2 =
                 {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": coor2
                    }
                };

                map.addSource(
                  'coorr2',{
                  'type':'geojson',
                  'data':coorr2
                });

                map.addLayer({
                  'id': 'balance',
                  'type': 'circle',
                  'source': 'coorr2',
                    'paint': {
                      'circle-color': 'green',
                      'circle-opacity': 0.8,
                      'circle-radius':12
                    }
                  },'hist');
                  console.log(user);
                  console.log(coor);
                  console.log(coor2);

            });

          });
    });
});

