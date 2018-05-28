var tmrSplash;
    tmrSplash=setTimeout("document.getElementById('splash').style.display='none';document.getElementById('splash').style.top='1024px';",3000);

    var _map = null;
    var map = null;
    var geocoder;
    var _seconds = 30;
	var _llbounds = null;

	var boolTripTrack=true;  //use this flag to continually update the GPS location and leave markers every 30 seconds
    function initialize()
    { }
    function pageScroll() {
        window.scrollBy(0,50); 
        scrolldelay = setTimeout('pageScroll()',100);
    }
    function drawMap()
    {
        var latlng = new google.maps.LatLng(currentLatitude,currentLongitude);
        var mapOptions = {
            zoom:10,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.SATELLITE,
            mapTypeControl: false,
			zoomControl: true,
            zoomControlOptions: {
              style: google.maps.ZoomControlStyle.MEDIUM,
			  position: google.maps.ControlPosition.LEFT_TOP
            },
        };

        if (boolTripTrack==true)
        {
            _map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        }
        
    }


    //40.7655,-73.97204 = NYC
    var currentLatitude = "40.713768";
    var currentLongitude = "-115.016696";
    var places = {
        name:"restaurant",
        lat: "40.713768",
        long: "-115.016696"
    };
    var options = {
					 timeout: 10000,
					 maximumAge: 11000,
					 enableHighAccuracy: true
				  };

	var suc = function(p){
		console.log("geolocation success",4);
        
		if( _map == null ) {
			places.lat = p.coords.latitude;
			places.long = p.coords.longitude;
			drawMap();
		}
        //alert(p.coords.longitude);
        if ((Math.abs(places.lat - p.coords.latitude)) < 10 && (Math.abs(places.long - p.coords.longitude) < 10)){
            drawMap();
        }
	  	var myLatLng = new google.maps.LatLng(places.lat, places.long);
	  	var marker = new google.maps.Marker({
		  position: myLatLng,
		  map: _map,
        });
        
		if( _llbounds == null )
			_llbounds = new google.maps.LatLngBounds(new google.maps.LatLng(p.coords.latitude, p.coords.longitude));
		else
			_llbounds.extend(new google.maps.LatLng(p.coords.latitude, p.coords.longitude));
		_map.fitBounds(_llbounds);       
        var request = {
            location: myLatLng,
            types:['food'],
            rankBy: google.maps.places.RankBy.DISTANCE, //Note there is no quotes here, I made that mistake.
        };      
        var service = new google.maps.places.PlacesService(_map);
        service.search(request, callback);
        function callback(results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
              var place = results[i];
                var marker = new google.maps.Marker({
                    map: _map,
                    position: place.geometry.location
                  });
                var elDiv = document.createElement("div");
                elDiv.className = "result";
                elDiv.id = i;
                if (i==0)
                {
                    var elImg = document.createElement("img");
                    elImg.className = "highlight";
                    elImg.src = "images/highlight.png";
                    var h=document.createElement("H3");
                    var t=document.createTextNode(results[i].name);
                    h.appendChild(t);
                    h.position = "absolute"; 
                    var a=document.createElement("a");
                    a.href = "#/hubs/" + results[i].id;
                    elDiv.appendChild(elImg);
                    elDiv.style.height = "10vw";
                    a.appendChild(h)
                    elDiv.appendChild(a);
                    document.getElementById("results").appendChild(elDiv);
                    continue;
                }
                var h=document.createElement("H2");
                var t=document.createTextNode(results[i].name);
                h.appendChild(t);
                h.position = "absolute"; 
                h.style.marginTop = "5%";
                var a=document.createElement("a");
                a.href = "#/hubs/" + results[i].id;
                a.appendChild(h)
                elDiv.appendChild(a);
                document.getElementById("results").appendChild(elDiv);
            }
          }
        }    

	};
    function sub(obj){
        var file = obj.value;
        var fileName = file.split("\\");
        document.getElementsByClassName("barcode").innerHTML = fileName[fileName.length-1];
        document.myForm.submit();
        event.preventDefault();
    }
    function drawOnCanvas(file) {
      var reader = new FileReader();
    
      reader.onload = function (e) {
        var dataURL = e.target.result,
            c = document.querySelector('canvas'), // see Example 4
            ctx = c.getContext('2d'),
            img = new Image();
    
        img.onload = function() {
          c.width = img.width;
          c.height = img.height;
          ctx.drawImage(img, 0, 0);
        };
    
        img.src = dataURL;
      };
    
      reader.readAsDataURL(file);
    }
    function setLink(id)
    {
        alert(id);
    }
    function getID(url)
    {
        return url.substr(url.lastIndexOf("/")+1);
    }
    function attachMap(p) 
    {
        var LatLng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);
        var mapOptions = {
            zoom: 8,
            center: LatLng
        }
        map = new google.maps.Map(document.getElementById('attach-map-canvas'), mapOptions);
    }
    function attachResults() {}
    function searchEst() {
        geocoder = new google.maps.Geocoder(); 
        var address = document.getElementById('estSearch').value;
        geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          _map.setCenter(results[0].geometry.location);
          var marker = new google.maps.Marker({
              map: _map,
              position: results[0].geometry.location
          });
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
        });
    }    
    function attach(id)
    {
        var json = '{"id": 1", "image":"images/Magners.png"}'; 
        var URL = 'hubs/' + id + '/receivers';
        $.ajax
        ({
            type: "POST",
            url: '/attach.php',
            dataType: 'text',
            async: false,
            data: {json : json,URL: URL}
        });
        router.navigate('/', {trigger:true});        
    }
    function showComment(message)
    {
        document.getElementById("pComment").innerHTML = message;
        document.location.href = "#commentModal";
    }
	var fail = function(){
		console.log("Geolocation failed. \nPlease enable GPS in Settings.",1);
	};
    var getLocation = function()
    {
        console.log("in getLocation",4);
    }
    function locate()
    {
        //intel.xdk.geolocation.getCurrentPosition(suc,fail,options);
        navigator.geolocation.getCurrentPosition(suc,fail);
    }
    function prompter()
    {
        var person = prompt("Please enter your name","Harry Potter");
    }
    function scroll()
    {
        window.scrollTo(0,0);
    }
    function onDeviceReady()
    {
        try
        {
            //lock orientation
            intel.xdk.device.setRotateOrientation("portrait");
            intel.xdk.device.setAutoRotate(false);
        }
        catch(e) {}

        try
        {
            //manage power
            intel.xdk.device.managePower(true,false);
        }
        catch(e) {}
		
		try
		{
			//hide splash screen
			intel.xdk.device.hideSplashScreen();
        }
        catch(e) {}
    }

    document.addEventListener("intel.xdk.device.ready",onDeviceReady,false);