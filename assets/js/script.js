var nasaApiKey = "1llD9DAh0o9mULhBTzPplZoykdIkOTrg66rQ4ciP";
var natParkApiKey = "I1t6bTsAuMW8WN9jdopUBpMPtyWv6bDT6L6tKgkB" //"HOc5nfvbGjSS66EfdDsWgh7bNIAeKEp9DwSgJTT4" might still be one? i do have it lol
var oWApiKey = "22699aa722b7a79950a6f5dfaa6a318e";
var bodyEl = $(".body");
var lat;
var lon;
var searchBtn;
var selSection = $("#sel-section");
var selectText = $(".select-text");
var stateSelect = $("#state-select");
var checkList = $(".checklist");
var weatherEl = $(".weather");
var weatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + oWApiKey;
var packingList = $(".packing-list");
var addBtn = $("#add-item");
var toPack = [];


// General path forward:
// 1. State input [STATE INPUT WORKS AND LOGS PROPERLY] and then park code input
// 2. Call function from NPS, based on state code input 
// 2a. This brings up a list of the parks that are in that state, with name and park code
// 3. Call function for the state park that is on the button click from the park code input search
// 3a. This will search the NPS for the specific park that has been selected
// 4. Call function for weather based on the lat/lon from the state park
// 5. Call function for the satellite image based on the lat/lon from the state park 

stateSelect.on("change", function () {
    console.log($(this).val());
    var stateCode = $(this).val();
    var natParkURL = "https://developer.nps.gov/api/v1/parks?stateCode=" + stateCode + "&api_key=" + natParkApiKey;

    fetch(natParkURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (natParks) {
            var parkData = natParks.data;
            parkCodeHandler(parkData);
        })

});

// on click for dropdown content, generate a park list dropdown for that state.

function parkCodeHandler(parkData) {
    $(selectText).text("Select a Park");
    var parkSelect = $("<select>").attr("class", "select ml-2 park-select");
    console.log(parkSelect);
    $(selSection).append(parkSelect);
    $.each(parkData, function (index, value) {
        var parkOptions = $("<option>").text(value.fullName).attr("class", "dropdown-item").attr("data-lat", value.latitude).attr("data-lon", value.longitude);
        $(parkSelect).append(parkOptions);
        // need on change for parkSelect
        console.log(value);
    });
    parkSelect.on("change", function (event) {
        event.stopPropagation();
        var parkLoc = ($(this).find(":selected").data())
        // var parkLat = $(this).data("lat");
        console.log("lat: " + parkLoc.lat);
        console.log("lon: " + parkLoc.lon);

        lat = parkLoc.lat;
        lon = parkLoc.lon;

        nasaCall(lat, lon)
    })
}

function renderPackList() {
    var packListHistory = JSON.parse(localStorage.getItem("packingList"));

    if (packListHistory !== null) {
        toPack = packListHistory;
        $.each(packListHistory, function (index, val) {
            packingList.append("<input type='checkbox'><label> " + packListHistory[index] + "</label><br />")
            console.log(packListHistory[index]);
        });
    }
    else {
        return;
    }

}

renderPackList();

addBtn.on("click", function (event) {
    event.preventDefault();
    var listItem = $("#pack-item").val();
    // on click of add button, i want to create a checkbox and label
    // make the val of listItem what the checkbox label will say
    packingList.append("<input type='checkbox'><label> " + listItem + "</label><br />");

    toPack.push(listItem);
    localStorage.setItem("packingList", JSON.stringify(toPack));
})

// take lat and lon from parkOptions and pass it into NASA.
// Make call for Weather nested in NASA api call.



function nasaCall(lat, lon) {
    var nasaURL = "https://api.nasa.gov/planetary/earth/imagery?lon=" + lon + "&lat=" + lat + "&dim=0.3&date=2020-09-24&api_key=" + nasaApiKey;
    fetch(nasaURL)
        .then(function (response) {
            return response.blob();
        })
        .then(function (data) {
            console.log(data);
            var nasaImage = URL.createObjectURL(data);
            $(".image").attr("src", nasaImage);
        })
}
