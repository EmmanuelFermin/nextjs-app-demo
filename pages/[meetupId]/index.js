import { MongoClient, ObjectId } from "mongodb";
import { Fragment } from "react";
import Head from "next/head";

import MeetupDetail from "../../components/meetups/MeetupDetail";
import { useRouter } from "next/router";

function MeetupDetails(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
}

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://admin:fullspeed123@cluster0.fnewt.mongodb.net/meetups?retryWrites=true&w=majority"
  );

  const db = client.db();
  const meetupsCollection = db.collection("meetups");

  // Only include the id with no fetch values
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    fallback: "blocking",
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  // fetch data for a single meet up
  const meetupId = context.params.meetupId;
  console.log(meetupId);

  const client = await MongoClient.connect(
    "mongodb+srv://admin:fullspeed123@cluster0.fnewt.mongodb.net/meetups?retryWrites=true&w=majority"
  );

  const db = client.db();
  const meetupsCollection = db.collection("meetups");

  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });

  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
      // {
      //   id: meetupId,
      //   image: "https://picsum.photos/200",
      //   title: "A First Meetup",
      //   address: "Some street 5, Some City",
      //   description: "The meetup description",
      // }
    },
  };
}

export default MeetupDetails;
