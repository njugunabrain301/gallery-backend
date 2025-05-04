const mongoose = require("mongoose");
const Vehicle = require("../models/Vehicle");
require("dotenv").config();

const sampleImages = [
  "https://images.unsplash.com/photo-1549399542-7e3f8b79c341", // Toyota Camry front
  "https://images.unsplash.com/photo-1550355291-bbee04a92027", // Toyota Camry side
  "https://images.unsplash.com/photo-1550355291-d6d7c75e8f74", // Interior dashboard
  "https://images.unsplash.com/photo-1550355291-cf2c3325d981", // Back seats
  "https://images.unsplash.com/photo-1550355291-a3d87b82f3fd", // Trunk space
];

const database = process.env.PRODUCTION === "true" ? "live" : "test";
const mongo_url = process.env.MONGO_BASE_URL;

async function addTestVehicle() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      mongo_url + database + "?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    const testVehicle = new Vehicle({
      make: "Toyota",
      model: "Camry",
      plateNo: "KDD 123A",
      YoM: 2020,
      chassisNo: "1HGCM82633A123456",
      engineNo: "ENG123456789",
      vehicleType: "Sedan",
      color: "Silver",
      passengerCapacity: 5,
      picturesArray: sampleImages,
      available: true,
      owner: "64f5a53d9d85a35a7c9c4321", // Replace with an actual user ID
      assessmentPaid: true,
      assessmentPaidDate: new Date(),
      assessed: true,
      dateAdded: new Date(),
      description:
        "Well-maintained Toyota Camry in excellent condition. Features include power steering, air conditioning, and a premium sound system.",
      mileage: 45000,
      transmission: "Automatic",
      fuelType: "Petrol",
      features: [
        "Air Conditioning",
        "Power Steering",
        "Power Windows",
        "ABS",
        "Airbags",
        "Bluetooth",
        "Backup Camera",
        "USB Port",
      ],
      location: "Nairobi, Kenya",
      status: "approved",

      // Rates (in KES)
      hourlyRate: 1000, // 1,000 KES per hour
      dailyRate: 15000, // 15,000 KES per day
      monthlyRate: 300000, // 300,000 KES per month
      reservePercentage: 50, // 50% of total amount required as booking fee
    });

    await testVehicle.save();
    console.log("Test vehicle added successfully!");
    console.log("Vehicle ID:", testVehicle._id);
    console.log("Vehicle Details:", testVehicle);
  } catch (error) {
    console.error("Error adding test vehicle:", error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the function
addTestVehicle();
