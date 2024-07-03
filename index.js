const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb'); // Import ObjectId directly
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://nishad27:nishad123@cluster0.xjglkfb.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    const appointmentCollection = client.db("managementSystem").collection("appointments");

    app.get("/appointments", async (req, res) => {
      const result = await appointmentCollection.find().toArray();
      res.send(result);
    });

    app.post("/appointments", async (req, res) => {
      const newAppointment = req.body;
      const result = await appointmentCollection.insertOne(newAppointment);
      res.send(result);
    });

    app.delete('/appointments/:id', async (req, res) => {
      try {
        const appointmentId = req.params.id;
        console.log(appointmentId);

        const objectId = new ObjectId(appointmentId); // Create ObjectId from appointmentId
        const result = await appointmentCollection.deleteOne({ _id: objectId });
        console.log(result);
        if (result.deletedCount === 1) {
          res.status(200).send({ message: 'Appointment deleted successfully' });
        } else {
          res.status(404).send({ message: 'Appointment not found' });
        }
      } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).send({ message: 'Error deleting appointment' });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hospital management server is running...");
});

app.listen(port, () => {
  console.log(`Hospital management system is running on port: ${port}`);
});
