import React, { useState, useEffect } from 'react';
import {
  Flex,
  Heading,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  Text,
  IconButton,
  Divider,
  Link,
} from "@chakra-ui/react";

import { AddIcon } from "@chakra-ui/icons";
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction } from 'next-firebase-auth';
import { getFirebaseAdmin } from 'next-firebase-auth';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Header from '../../components/Header';

const SingleEvent = ({ itemData }) => {
  const AuthUser = useAuthUser();
  const [inputGame, setInputName] = useState(itemData.game); //changed from name to game
  const [inputDate, setInputDate] = useState(itemData.date);
  const [inputFg, setInputFg] = useState(itemData.fgType);
  const [statusMsg, setStatusMsg] = useState('');

  const sendData = async () => {
    try {
      console.log("sending!");
      // try to update doc
      const docref = firebase.firestore().collection("events").doc(itemData.id)//.get();
      const doc = await docref.get();

      if (!doc.empty) {
        docref.update(
          {
            game: inputGame,
            date: firebase.firestore.Timestamp.fromDate(new Date(inputDate)),
            fgType: inputFg
          }
        );
        setStatusMsg("Updated!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Header email={AuthUser.email} signOut={AuthUser.signOut} />

      <Flex flexDir="column" maxW={800} align="center" justify="start" minH="100vh" m="auto" px={4} py={3}>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<AddIcon color="gray.300" />}
          />
          <Input type="text" value={inputGame} onChange={(e) => setInputName(e.target.value)} placeholder="Event Title" />
          <Input type="text" value={inputDate} onChange={(e) => setInputDate(e.target.value)} placeholder="Event Date" />
          <Input type="text" value={inputFg} onChange={(e) => setInputFg(e.target.value)} placeholder="Event fg type" />
          <Button
            ml={2}
            onClick={() => sendData()}
          >
            Update
          </Button>
        </InputGroup>
        <Text>
          {statusMsg}
        </Text>
      </Flex>
    </>
  );
};

//checking to make sure authenticated if not go back to login page
export const getServerSideProps = withAuthUserTokenSSR({

  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN
})

  (
    async ({ AuthUser, params }) => {

      //to get access to the firestore database
      const db = getFirebaseAdmin().firestore();

      //query finding from the database the events collection and grabbing the params.id from it
      const doc = await db.collection("events").doc(params.id).get();

      console.log("the doc is: \n");
      console.log(params);
      console.log(doc.data());

      //sample code
      db.collection("events")
        .where('user', '==', AuthUser.id)
        .onSnapshot(
          snapshot => {
            snapshot.docs.map(
              doc => {
                console.log(doc.id);
              }
            )
          }
        );
      //sample code end

      let itemData;
      if (!doc.empty) { // if doc is found

        // if doc.data was found return into itemData variable
        itemData = {
          id: doc.id,
          game: doc.data().game,
          date: doc.data().date.toDate().toDateString(),
          fgType: doc.data().fgType
        }
      }

      // if doc.data was not found return nothing
      else {
        itemData = null;
      }

      //return the data found

      return {
        props: {
          itemData
        }
      }
    }
  )


// to make sure it will render ONLY if authenticated
export default withAuthUser(
  {
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    whenUnauthedBeforeInit: AuthAction.REDIRECT_TO_LOGIN,
  }
)(SingleEvent)
