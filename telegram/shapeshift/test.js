const {ShapeShift} = require("./shapeshift");

ShapeShift.getExchangeLimit(ShapeShift.pairs.ethereum.bitcoin).then(x=>console.log(x));
ShapeShift.investment.getAllExchangeLimits("bitcoin").then(x=>console.log(x));

