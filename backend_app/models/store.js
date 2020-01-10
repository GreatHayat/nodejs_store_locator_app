const Joi = require("joi");
const mongoose = require("mongoose");
const geocoder = require("../utils/geoCoder");
const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ["Point"]
    },
    coordinates: {
      type: [Number]
    },
    city: {
      type: String
    },
    country: {
      type: String
    },
    countryCode: {
      type: String
    },
    stateCode: {
      type: String
    },
    zipCode: {
      type: String
    },
    formated_address: {
      type: String
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  created_date: {
    type: Date,
    default: Date.now()
  }
});
storeSchema.pre("save", async function(next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formated_address: loc[0].formattedAddress,
    city: loc[0].city,
    country: loc[0].country,
    countryCode: loc[0].countryCode,
    stateCode: loc[0].stateCode,
    zipCode: loc[0].zipcode
  };
});
const Store = mongoose.model("Store", storeSchema);

function validateStore(store) {
  const schema = {
    name: Joi.string().required(),
    address: Joi.string().required(),
    user: Joi.string().required()
  };
  return Joi.validate(store, schema);
}
exports.Store = Store;
exports.validate = validateStore;
