//Server1 area_pollution//
var readlineSync = require('readline-sync')
var grpc = require("@grpc/grpc-js")
var protoLoader = require("@grpc/proto-loader")
var PROTO_PATH = __dirname + "/protos/area_pollution.proto"

var packageDefinition = protoLoader.loadSync(PROTO_PATH)
var area_pollution = grpc.loadPackageDefinition(packageDefinition).area_pollution
var client = new area_pollution.RandomService("0.0.0.0:40000", grpc.credentials.createInsecure());

var action = readlineSync.question(
"What would you like to do?\n"
+" \t 1 Check the pollution in the area\n"
+ "\t 2 Compare the pollution in different cities\n"
+ "\t 3 Check the ranking of most polluted cities\n"
+ "\t 4 Check the average pollution in different cities\n")

action = parseInt(action)

if(action ===1){
var amount = parseInt(readlineSync.question("How many cities would you like to see the components of the smog for?"))
var call = client.generateRandomComponent({amount: amount})

call.on('data', function(response){
	console.log("\nIn requested city. \nThe PM2.5 level is: " + response.value + "\nThe PM10 level is: " + (response.value+15) + 
    "\nThe CO level is: " + (response.value+23) + 
    "\nThe SO2 level is: " + (response.value+29) + "\nThe C6H6 level is: " + response.value + 
    "\nThe O3 level is: " + (response.value+5) + "\nThe NO2 level is: " + (response.value+31)  )
    
})
 	
	 call.on('end', function(){
	})
	
	call.on('error', function(e){
	console.log(e)
	console.log("An error occured")
	})  


//Server2 compare_pollution//
}else if(action ===2){
var readlineSync = require('readline-sync')
var grpc = require("@grpc/grpc-js")
var protoLoader = require("@grpc/proto-loader")
var PROTO_PATH = __dirname + "/protos/compare_pollution.proto"

var packageDefinition = protoLoader.loadSync(PROTO_PATH)
var compare_pollution_proto = grpc.loadPackageDefinition(packageDefinition).compare_pollution
var client = new compare_pollution_proto.CalcService("0.0.0.0:40000", grpc.credentials.createInsecure());
var monitor = readlineSync.question(
  "What would you like to monitor?\n"
  + "\t 1 The difference in pollution between two cities\n"
  + "\t 2 How many times one city is more polluted than the other one\n"
)
monitor = parseInt(monitor)
if(monitor === 1) {
  var city1 = readlineSync.question("What is the first city, provide a number:\n 1 Dublin\n 2 Galway\n 3 Cork\n 4 Limerick\n 5 Waterford\n 6 Sligo\n ")
  var city2 = readlineSync.question("What is the second city, provide a number:\n 1 Dublin\n 2 Galway\n 3 Cork\n 4 Limerick\n 5 Waterford\n 6 Sligo\n ")
  try {
    client.subtract({city1: city1, city2: city2}, function(error, response) {
      try {
        if(response.message) {
          console.log(response.message)
        } else {
          console.log("First city is of" + response.result + " AAQI more polluted than second city.")
        }
      } catch(e) {
        console.log("Could not connect to server")
      }
    })

  } catch(e) {
    console.log("An error occured")
  }

} else if(monitor === 2) {
	var city1 = readlineSync.question("What is the first city, provide a number:\n 1 Dublin\n 2 Galway\n 3 Cork\n 4 Limerick\n 5 Waterford\n 6 Sligo\n ")
  	var city2 = readlineSync.question("What is the second city, provide a number:\n 1 Dublin\n 2 Galway\n 3 Cork\n 4 Limerick\n 5 Waterford\n 6 Sligo\n ")
    try {
      client.divide({city1: city1, city2: city2}, function(error, response) {
        try {
          if(response.message) {
            console.log(response.message)
          } else {
            console.log("First city is " + response.result + " times more polluted than second city.")
          }
        } catch(e) {
          console.log("Could not connect to server")
        }
      })
    } catch(e) {
      console.log("An error occured")
    }
} else {
  console.log("Error: Operation not recognized")
}

//Server3 ranking//
}else if( action===3){
var grpc = require("@grpc/grpc-js")
var protoLoader = require("@grpc/proto-loader")
var PROTO_PATH = __dirname + "/protos/ranking.proto"

var packageDefinition = protoLoader.loadSync(PROTO_PATH);
var ranking= grpc.loadPackageDefinition(packageDefinition).ranking;
var client = new ranking.RankingService('localhost:40000', grpc.credentials.createInsecure());
var call = client.getCityRanking({ });

call.on('data', function (response){
  console.log(response.placeRanking + " most polluted city in Ireland is " + response.cityName + " with " + response.pollutionLevel + " AAQI level" )
});

call.on('end', function(){
});

call.on('error', function(e){
  console.log(e)
});


//Server4 average//
}else if(action === 4){
var readlineSync = require('readline-sync')
var grpc = require("@grpc/grpc-js")
var protoLoader = require("@grpc/proto-loader")
var PROTO_PATH = __dirname + "/protos/average.proto"

var packageDefinition = protoLoader.loadSync(PROTO_PATH)
var average_proto = grpc.loadPackageDefinition(packageDefinition).average
var client = new average_proto.AverageService("0.0.0.0:40000", grpc.credentials.createInsecure());
var call = client.calcAverage(function(error, response){
  if(error){
    console.log("An error occured")
  }else{
    console.log("The average pollution of " + response.cities + " cities, is: " + response.average)
  }
})


while (true){
  var city_name = readlineSync.question("What is the name of the city? (q to Quit):")
  if(city_name.toLowerCase() === "q"){
    break
  }
  var level = readlineSync.question("What is the pollution level in this city?")

  call.write({level: parseFloat(level),  cityname: city_name})
}

call.end()


}