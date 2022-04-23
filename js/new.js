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
var url = 'https://raw.githubusercontent.com/RuochangH/test/0350e597361ad5a2e3ed5c2fdcb6413e79bd2bd7/Output.geojson';
var predURL = 'https://raw.githubusercontent.com/CSE6242Team45/CSE6242Team45.github.io/main/PricePred.geojson';

var landingPage =function(){

// Get and plot historical data as icons
//later used to provide historical information on click
    $.ajax(predURL).done(function(data) {
      var parsedData = JSON.parse(data);
        //plot
        map.addSource('pred',{type:'geojson',data:parsedData});
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
        map.addLayer({
          "id":"color",
          "type":"fill",
          "source":"pred",
          "filter":
          ["==","Field2","Corn"],
          "layout":{},
          "paint":{'fill-color':['interpolate',['linear'],['get','26_Dec'],0, '#474A2C', 5,'#636940',10,'#59A96A',15,'#9BDEAC',20,'#B4E7CE'],
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

                var margin = {top:20, right:50,bottom:20,left:50},
                    width = 340 - margin.left - margin.right,
                    height = 200 - margin.top - margin.bottom,
                    barHeight = height/data.length;

                    var y0 = Math.max(Math.abs(d3.min(data)), Math.abs(d3.max(data)));
                    var y = d3.scale.linear()
                      .domain([0, y0])
                      .range([height,0])
                      .nice();

                    var x = d3.scale.ordinal()
                      .domain(d3.range(data.length))
                      .rangeRoundBands([0, width], 0.2);

                    var svg = d3.select(div).select("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    var yAxis = d3.svg.axis()
                      .scale(y)
                      .orient("left");

                    var bar = svg.selectAll("g.bar")
                    .data(data)
                    .enter().append("g");

                    bar.append("rect")
                    .attr("class", function(d) { return d < 0 ? "bar negative" : "bar positive"; })
                    .attr("y", function(d) { return y(Math.max(0, d)); })
                    .attr("x", function(d, i) { return x(i); })
                    .attr("height", function(d) { return Math.abs(y(d) - y(0)); })
                    .attr("width", x.rangeBand());

                    svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)

                    svg.append("g")
                    .attr("class", "x axis")
                    .append("line")
                    .attr("y1", y(0))
                    .attr("y2", y(0))
                    .attr("x1", 0)
                    .attr("x2", width);

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setDOMContent(div)
            .addTo(map);
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
        var description = "<strong>"+e.features[0].properties.NAME + " County</strong><br>"+
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
        map.setFilter("color-Hover",["==","GEO_ID",""]);
        map.setFilter("outline-Hover",["==","GEO_ID",""]);
        map.getCanvas().style.cursor = '';
        popup.remove();
    });

});
};

landingPage();




  //Allow user to check selected types of availabilities without accessing there locations
  $('#viewAll').click(function(){
    
    function readInput(){
      switch($('#prediction').find(":selected").text()){
        case 'Barley': return 'Barley';
        case 'Corn':  return 'Corn';
        case 'Potato': return 'Potato';
        case 'Soybean': return 'Soybean';
        case 'Wheat': return 'Wheat'}
  }
    var availability = readInput();
    
    if(map.getLayer('color')){map.removeLayer('color');}
    if(map.getLayer('new')){
      map.removeLayer('new');}
    map.addLayer({
      "id":"new",
      "type":"fill",
      "source":"pred",
      "filter":
      ["==","Field2",availability],
      "layout":{},
      "paint":{'fill-color':['interpolate',['linear'],['get','26_Dec'],0, '#474A2C', 5,'#636940',10,'#59A96A',15,'#9BDEAC',20,'#B4E7CE'],
               'fill-opacity':0.75}
      
    });
 
  });

 

  map.on('mouseenter', 'new', function(e) {
      // Change the cursor style as a UI indicator.
      map.getCanvas().style.cursor = 'pointer';
      map.setFilter("new-Hover",["==","GEO_ID",e.features[0].properties.GEO_ID]);
      var coordinates2 = e.features[0].geometry.coordinates.slice()[0][0];
      var description2 = "<strong>"+e.features[0].properties.NAME + " County</strong><br>"+
      e.features[0].properties[availability] +" "+ availability;

      while (Math.abs(e.lngLat.lng - coordinates2[0][0]) > 180) {
          coordinates2[0][0] += e.lngLat.lng > coordinates2[0][0] ? 360 : -360;
      }
      var station0 = map.queryRenderedFeatures(e.point, {
        layers: ['new']
      });

        if (station0.length > 0) {
          document.getElementById('pd0').innerHTML = description2;
        } else {
          document.getElementById('pd0').innerHTML = '<p>Hover Over a County for Detail!</p>';
        }

  });

  map.on('mouseleave', 'new', function() {
      map.setFilter("new-Hover",["==","GEO_ID",""]);
      map.getCanvas().style.cursor = '';});


    $.ajax({method: 'GET',url:url,}).done(function(data){
      var filteredFeatures = data.features.filter(function(feature){
        return feature.properties[availability]>1;
      });

      var filteredFeatureCollection = {
        "type":"FeatureCollection",
        "features":filteredFeatures
      };
      console.log(filteredFeatureCollection);
      map.getSource('liveBike').setData(filteredFeatureCollection);
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

          //calculate available station according to user input


          //})
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

              //  map.getSource('nearest').setData(coorr);
              //console.log(nearest);

              //Find the neares station that needs rebalancing
              //Get the next hour
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



                  var routeURL = 'https://api.mapbox.com/directions/v5/mapbox/walking/' +
                  user[0] + ',' + user[1] + ';' + coor[0] + ',' + coor[1] + '?geometries=polyline&access_token='+mapboxgl.accessToken;
                  console.log(routeURL);
                  var routeURL2 = 'https://api.mapbox.com/directions/v5/mapbox/walking/' +
                  user[0] + ',' + user[1] + ';' + coor2[0] + ',' + coor2[1] + '?geometries=polyline&access_token='+mapboxgl.accessToken;

                    $.ajax(routeURL).done(function(routes){
                          var routePoints = decode(routes.routes[0].geometry);
                                var revisedPoints = _.map(routePoints,function(point){
                                      return [point[1],point[0]];
                                        });
                                      var route = turf.lineString(revisedPoints);
                                      console.log(route);


                                        $.ajax(routeURL2).done(function(routes){
                                          var routePoints2 = decode(routes.routes[0].geometry);
                                          var revisedPoints2 = _.map(routePoints2,function(point){
                                            return [point[1],point[0]];
                                          });
                                          var route2 = turf.lineString(revisedPoints2);
                                          console.log(route2);

                                          $('#route').click(function(){
                                            $("#all").show;

                                            if(map.getLayer('route')){
                                            map.removeLayer('route');
                                            map.removeSource('route');}


                                              if(map.getLayer('route2')){
                                              map.removeLayer('route2');
                                              map.removeSource('route2');}


                                            map.addSource(
                                              'route',{
                                              'type':'geojson',
                                              'data':route
                                            });

                                            map.addLayer({
                                              "id": "route",
                                              "type": "line",
                                              "source": 'route',
                                              "layout": {
                                                "line-join": "round",
                                                "line-cap": "round"
                                              },
                                              "paint": {
                                                "line-color": "orange",
                                                "line-width": 4
                                              }
                                            });
                                            map.addSource(
                                              'route2',{
                                              'type':'geojson',
                                              'data':route2
                                            });

                                            map.addLayer({
                                              "id": "route2",
                                              "type": "line",
                                              "source": 'route2',
                                              "layout": {
                                                "line-join": "round",
                                                "line-cap": "round"
                                              },
                                              "paint": {
                                                "line-color": "green",
                                                "line-width": 4
                                              }
                                            });

                                        });


                                        });






              });






            });

          });
    });
});

