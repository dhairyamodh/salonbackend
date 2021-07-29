var mongoose = require("mongoose");
const { Salon } = require("../models/backEnd/superAdmin");
const models = require("../models/backEnd/salon");

async function setrestaurantdb(salonId, next) {
  let currentSalon = await Salon.findById(salonId);
  const salonName = await currentSalon.name.split(" ").join("");
  // console.log('after add salon');
  if (
    typeof salonName !== "undefined" &&
    !global.salons[salonId]
  ) {
    if (salonName) {
      // console.log('setting db for salon ' + salonName);

      let salon = mongoose.createConnection(
        `mongodb://127.0.0.1:27017/${salonName}`
      );

      salon.on("connected", async function () {
        // console.log('Mongoose default connection open to  ' + salonName);
        await Promise.all(
          Object.keys(models).map((key) => {
            global.salons[salonId] = {
              ...global.salons[salonId],
              [key]: salon.model(key, models[key]),
            };
          })
        );
        // console.log('after promise');
        // if (next) {
        //     return await next()
        // }
        // console.log("global res", global.salons);
      });
      salon.on("disconnected", function () {
        console.log("Mongoose " + salonName + " connection disconnected");
      });

      process.on("SIGINT", function () {
        salon.close(function () {
          // console.log(salonName + ' connection disconnected through app termination');
          process.exit(0);
        });
      });
    }
  }
  next && next();

}

function setallrestaurantdb() {
  return async function (req, res, next) {
    let currentSalon = await Salon.find();
    if (
      Object.keys(global.salons).length !=
      currentSalon.length > 0
    ) {
      if (
        Object.keys(global.salons).length === 0 &&
        currentSalon.length > 0
      ) {
        currentSalon.forEach((res, index) => {
          const salonName = res.name.split(" ").join("");
          const salonId = res._id;
          async function importDbs() {
            await Promise.all(
              Object.keys(models).map((key) => {
                global.salons[salonId] = {
                  ...global.salons[salonId],
                  [key]: salon.model(key, models[key]),
                };
              })
            );
          }
          // console.log('setting db for salon ' + salonName);

          let salon = mongoose.createConnection(
            `mongodb://127.0.0.1:27017/${salonName}`
          );

          salon.on("connected", async function () {
            importDbs();
            // console.log('Mongoose default connection open to  ' + salonName);
            // console.log("global res", global.salons);
          });
          salon.on("disconnected", function () {
            console.log(
              "Mongoose " + salonName + " connection disconnected"
            );
          });

          process.on("SIGINT", function () {
            salon.close(function () {
              console.log(
                salonName +
                " connection disconnected through app termination"
              );
              process.exit(0);
            });
          });
        });
      }
    }

    next();
  };
}

module.exports = { setallrestaurantdb, setrestaurantdb };
