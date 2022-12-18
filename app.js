//q1 area_pollution//
var grpc = require("@grpc/grpc-js")
var protoLoader = require("@grpc/proto-loader")
var PROTO_PATH = __dirname + "/protos/area_pollution.proto"
var packageDefinition = protoLoader.loadSync(PROTO_PATH)
var area_pollution_proto = grpc.loadPackageDefinition(packageDefinition).area_pollution

function generateRandomComponent(call, callback){
	for(var i=0; i<call.request.amount; i++){

	call.write({
		value: Math.round(Math.random() * 100)
	})
	}
	call.end()
}




//q2 compare_pollution//
var grpc = require("@grpc/grpc-js")
var protoLoader = require("@grpc/proto-loader")
var PROTO_PATH = __dirname + "/protos/compare_pollution.proto"
var packageDefinition = protoLoader.loadSync(PROTO_PATH)
var compare_pollution_proto = grpc.loadPackageDefinition(packageDefinition).compare_pollution


function subtract(call, callback){
  try{
  var city1 = parseInt(call.request.city1)
  var city2 = parseInt(call.request.city2)
  if(city1 > 6 || city2 > 6 || city1===0 || city2===0 ) {
    callback(null, {
      message: "There is no such a city on the list, please choose beween 1-6"
    })
    }
  
 else if(!isNaN(city1) && !isNaN(city2)){
    var result = city2 - city1
    console.log(result)
    callback(null, {
      message:undefined,
      result: result
     })
  } else{
    callback(null, {
      message: "Please provide two cities"
    })
  }
}catch(e){
  callback(null, {
    message: "An error occured during computation"
  })
}

}


function divide(call, callback) {
  try {
    var city1 = parseInt(call.request.city1)
    var city2 = parseInt(call.request.city2)
    if(city2 === 0 || city1===0 || city1>6 || city2>6 ) {
      callback(null, {
        message: "There is no such a city on the list please choose between 1-6"
      })
    }
    else if(!isNaN(city1) && !isNaN(city2)) {
      var result = city2 / city1
      callback(null, {
        message: undefined,
        result: result
      })
    } else {
      callback(null, {
        message: "Please provide two cities"
      })

    }

  } catch(e) {
    callback(null, {
      message: "An error occured during computation"
    })

  }

}




//q3 ranking//
var grpc = require("@grpc/grpc-js")
var protoLoader = require("@grpc/proto-loader")
var PROTO_PATH = __dirname + "/protos/ranking.proto"
var packageDefinition = protoLoader.loadSync(PROTO_PATH)
var ranking_proto = grpc.loadPackageDefinition(packageDefinition).ranking

var data = [
  {placeRanking: 1, cityName:"Dublin", pollutionLevel: 55},
  {placeRanking: 2, cityName:"Cork", pollutionLevel: 41},
  {placeRanking: 3, cityName:"Sligo", pollutionLevel: 37},
  {placeRanking: 4, cityName:"Limerick", pollutionLevel: 29},
  {placeRanking: 5, cityName:"Galway", pollutionLevel: 25},
  {placeRanking: 6, cityName:"Waterford", pollutionLevel: 22},
  {placeRanking: 7, cityName:"Wexford", pollutionLevel: 19},
  {placeRanking: 8, cityName:"Ballina", pollutionLevel: 18},
  {placeRanking: 9, cityName:"Carlow", pollutionLevel: 17},
  {placeRanking: 10, cityName:"Athlone", pollutionLevel: 12}]

function getCityRanking(call, callback) {
  for(var i=0; i<data.length; i++){
    call.write({
      placeRanking: data[i].placeRanking,
      cityName: data[i].cityName,
      pollutionLevel: data[i].pollutionLevel
    })
  }
  call.end()
}




//q4 average//
var grpc = require("@grpc/grpc-js")
var protoLoader = require("@grpc/proto-loader")
var PROTO_PATH = __dirname + "/protos/average.proto"
var packageDefinition = protoLoader.loadSync(PROTO_PATH)
var average_proto = grpc.loadPackageDefinition(packageDefinition).average

function calcAverage(call, callback) {
  var cities = 0
  var sum = 0

  call.on('data', function(request){
    sum += request.level
    cities += 1
    
  })
  
    call.on("end", function(){
      callback(null,{
        average: sum/cities,
	     cities: cities
        
      })
    })
  
  call.on('error', function(e){
	console.log("An error occured")
  })
}

var server = new grpc.Server()
server.addService(area_pollution_proto.RandomService.service,{generateRandomComponent: generateRandomComponent})
server.addService(compare_pollution_proto.CalcService.service, {subtract: subtract, divide: divide})
server.addService(ranking_proto.RankingService.service, {getCityRanking: getCityRanking})
server.addService(average_proto.AverageService.service, {calcAverage: calcAverage})
server.bindAsync("0.0.0.0:40000", grpc.ServerCredentials.createInsecure(), function() { server.start()
})
