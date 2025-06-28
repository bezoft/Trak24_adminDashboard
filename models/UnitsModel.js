import mongoose from "mongoose";

const unitsSchema = new mongoose.Schema({
  imei: {
    type: String,
  },
  rawData: {
    type: String,
  },
  simNumber: {
    type: Number,
  },
  simAttached: {
    type: Boolean,
    default:false
  },
  installation: {
    type: Date
  },
  renewRange: {
    type: Number
  },
  expiry: {
    type: Date
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  assetRegNo: {
    type: String,
    default: "-- -- -- ----"
  },
  assetType: {
    type: String,
    default: "car"
  },
  assetMake: {
    type: String,
  },
  assetModel: {
    type: String,
  },
  gprsPort: {
    type: String,
  },
 liveData: {
  header: { type: String, default: "" },
  device_id: { type: String, default: "" },
  gps_validity: { type: String, default: "" },
  date: { type: String, default: "" },
  time: { type: String, default: "" },
  latitude: { type: String, default: "" },
  latitude_direction: { type: String, default: "" },
  longitude: { type: String, default: "" },
  longitude_direction: { type: String, default: "" },
  speed: { type: String, default: "" },
  gps_odometer: { type: String, default: "" },
  direction: { type: String, default: "" },
  num_satellites: { type: String, default: "" },
  box_status: { type: String, default: "" },
  gsm_signal: { type: String, default: "" },
  main_battery_status: { type: String, default: "" },
  digital_input_1_status: { type: String, default: "" },
  digital_input_2_status: { type: String, default: "" },
  digital_input_3_status: { type: String, default: "" },
  analog_input_1: { type: String, default: "" },
  reserved: { type: String, default: "" },
  internal_battery_voltage: { type: String, default: "" },
  firmware_version: { type: String, default: "" },
  ccid_number: { type: String, default: "" },
  external_battery_voltage: { type: String, default: "" },
  rpm_value: { type: String, default: "" },
},
  shipment: {
    type: String,
  },
  model: {
    type: String,
  },
  status: {
    type: String,
  },
  remarks: {
    type: String,
  },
  stockListed: {
    type: Boolean,
    default:false
  },
 settings: {
  odometer: {
    type: Boolean,
    default: true,
  },
  tripStart: {
    type: Boolean,
    default: false,
  },
  tripStop: {
    type: Boolean,
    default: false,
  },
  powerDisconnected: {
    type: Boolean,
    default: false,
  },
  powerConnected: {
    type: Boolean,
    default: false,
  },
  acOn: {
    type: Boolean,
    default: false,
  },
  acOff: {
    type: Boolean,
    default: false,
  },
  doorOpen: {
    type: Boolean,
    default: false,
  },
  doorClose: {
    type: Boolean,
    default: false,
  },
  overSpeed: {
    type: Boolean,
    default: false,
  },
  harshAcceleration: {
    type: Boolean,
    default: false,
  },
  harshBraking: {
    type: Boolean,
    default: false,
  },
  noMovement: {
    type: Boolean,
    default: false,
  },
  idling: {
    type: Boolean,
    default: false,
  },
  acOnAlert: {
    type: Boolean,
    default: false,
  }
},
  reports: [{
    travelid: {
      type: String
    },
    imei: {
      type: String
    },
    startDate: {
      type: Date
    },
    path:
    {
      start: {
        latitude: {
          type: Number,
        },
        latiD: {
          type: String,
        },
        longitude: {
          type: Number,
        },
        longiD: {
          type: String,
        },
      },
      stop: {
        latitude: {
          type: Number,
        },
        latiD: {
          type: String,
        },
        longitude: {
          type: Number,
        },
        longiD: {
          type: String,
        },
      },
    },
    Distance: {
      startOdometer: {
        type: Number,
      },
      endOdometer: {
        type: Number,
      },
    },
    totalTime: {
      startTime: {
        type: String,
      },
      endTime: {
        type: String,
      },
      startDate: {
        type: String
      },
      stopDate: {
        type: String
      },
    },
    avgSpeed: {
      type: [Number],
      default: [],
    },

  }],
  activity: [{
    type: {
      type: String
    },
    body: {
      type: String
    },
    date: { 
      type: Date,
      default: Date.now
    }
  }]

});

// Default export for the model
export default mongoose.model("Units", unitsSchema);
