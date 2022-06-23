import { Db, MongoClient } from "mongodb";

// /api/new-meetup
// POST /api/new-meetup

async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;

    // Connect the client to the server
    const client = await MongoClient.connect(
      "mongodb+srv://admin:fullspeed123@cluster0.fnewt.mongodb.net/meetups?retryWrites=true&w=majority"
    );

    //Establish and verify connection
    const db = client.db();

    // Create collection and document in database
    const meetupsCollection = db.collection("meetups");

    const result = await meetupsCollection.insertOne(data);

    console.log(result);
    client.close();

    res.status(201).json({message: "Meetup inserted!!"});
  }
}

export default handler;