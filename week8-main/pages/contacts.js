import React, { useState, useEffect } from 'react'
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
    Container,
    VStack,
    SimpleGrid,
    GridItem,
    FormLabel,
    FormControl,
    useBreakpointValue,
    Link
} from "@chakra-ui/react"

import DarkModeSwitch from '../components/DarkModeSwitch'

import Header from '../components/Header';

import {
    useAuthUser,
    withAuthUser,
    withAuthUserTokenSSR,
    AuthAction,
} from 'next-firebase-auth'
import getAbsoluteURL from '../utils/getAbsoluteURL'
import { AddIcon, DeleteIcon, StarIcon } from "@chakra-ui/icons"
import firebase from 'firebase/app'
import 'firebase/firestore'

//importing cart and details .js files


export const Event = () => {
    const AuthUser = useAuthUser()
    const [inputFirstName, setInputFirstName] = useState('')
    const [inputLastName, setInputLastName] = useState('')
    const [inputEmail, setInputEmail] = useState('')
    const [inputPhone, setInputPhone] = useState('')
    const [contacts, setContacts] = useState([])

    console.log("the AuthUser is = " + AuthUser.id)
    console.log(contacts)

    useEffect(() => {
        AuthUser.id &&
            firebase
                .firestore()
                .collection("contacts")
                .where('user', '==', AuthUser.id)
                .onSnapshot(
                    snapshot => {
                        setContacts(
                            snapshot.docs.map(
                                doc => {
                                    return {
                                        eventID: doc.id,
                                        eventEmail: doc.data().email,
                                        eventFirstName: doc.data().firstName,
                                        eventLastName: doc.data().lastName,
                                        eventPhone: doc.data().phone
                                    }
                                }
                            )
                        )
                    }
                )
    })

    const sendData = () => {
        try {
            // try to update doc
            firebase
                .firestore()
                .collection("contacts") //all users will share one collection
                .add({ //.add with add documents to the events collection
                    firstName: inputFirstName,
                    lastName: inputLastName,
                    email: inputEmail,
                    phone: inputPhone,
                    user: AuthUser.id //how each document in contacts is releated back to the user
                })
                .then(console.log('Data was successfully sent to cloud firestore!'))
            setInputFirstName('');
            setInputLastName('');
            setInputEmail('');
            setInputPhone('');
        }

        catch (error) {
            console.log(error)
        }
    }

    const deleteEvent = (t) => {
        try {
            firebase
                .firestore()
                .collection("contacts")
                .doc(t) //unique identifier is passed to t and used to delete the event
                .delete()
                .then(console.log('Data was successfully deleted!'));
        } catch (error) {
            console.log(error)
        }
    }

    const Details = () => {
        const colSpan = useBreakpointValue({ base: 2, md: 1 });
        return (
            <VStack
                w="full"
                h="full"
                p={10}
                spacing={10}
                alignItems="flex-start"
                bg="#698989"
            >
                <VStack spacing={3} alignItems="flex-start">
                    <Heading size="2xl">Your Details</Heading>
                    <Text>Form below</Text>
                </VStack >

                {/*column gap and rowGap are in increments of 4px*/}
                {/*originally was cart.js*/}
                <SimpleGrid columns={2} columnGap={3} rowGap={6} w="full">

                    <GridItem colSpan={colSpan}>
                        <FormControl>
                            <FormLabel color="#171923">First Name</FormLabel>
                            <Input color="#424242"
                                border="black"
                                border-width="thick"
                                backgroundColor="#050808"
                                placeholder="Musa"
                                type="text"
                                value={inputFirstName} />
                        </FormControl>
                    </GridItem>

                    <GridItem colSpan={colSpan}>
                        <FormControl>
                            <FormLabel color="#171923">Last Name</FormLabel>
                            <Input color="#424242"
                                border="black"
                                border-width="thick"
                                backgroundColor="#050808"
                                placeholder="Goes Buck"
                                type="text"
                                value={inputLastName} />
                        </FormControl>
                    </GridItem>

                    <GridItem colSpan={2}>
                        <FormControl>
                            <FormLabel color="#171923">Email</FormLabel>
                            <Input color="#424242"
                                border="black"
                                border-width="thick"
                                backgroundColor="#050808"
                                placeholder="MusaCanKrump@freemusa.com"
                                type="text"
                                value={inputEmail} />
                        </FormControl>
                    </GridItem>

                    <GridItem colSpan={colSpan}>
                        <FormControl>
                            <FormLabel color="#171923">Phone</FormLabel>
                            <Input color="#424242"
                                border="black"
                                border-width="thick"
                                backgroundColor="#050808"
                                placeholder="555-555-5555"
                                type="text"
                                value={inputPhone} />
                        </FormControl>
                    </GridItem>

                    <GridItem colSpan={2}>
                        <Button width="full"
                            size="lg"
                            backgroundColor="#424242"
                            color="white"
                            ml={2}
                            onClick={() => sendData()}
                        >Finish</Button>
                    </GridItem>

                </SimpleGrid>
            </VStack>
        );
    };

    return (
        //inputting new contacts page from egghead.io inside react component
        <>
            <Header email={AuthUser.email} signOut={AuthUser.signOut} />

            <Flex flexDir="column" maxW="container.xl" align="center" justify="center" minH="100vh" m="auto" px={4}>
                <Flex justify="space-between" w="100%" align="center">
                    <Heading mb={0}>Welcome, {AuthUser.email}!</Heading>
                </Flex>

                {/*
                <InputGroup>
                    <InputLeftElement
                        pointerEvents="none"
                        children={<AddIcon color="gray.300" />}
                    />

                    inputFirstName('');
                    
                    <Input type="text" value={inputFirstName} onChange = {(e) => setInputFirstName(e.target.value)} placeholder="First Name" />

                <Input type="text" value={inputLastName} onChange={(e) => setInputLastName(e.target.value)} placeholder="Last Name" />

                <Input type="text" value={inputPhone} onChange={(e) => setInputLastName(e.target.value)} placeholder="Phone" />

                <Input type="text" value={inputEmail}onChange={(e) => setInputLastName(e.target.value)} placeholder="Email" />

                the above will allow (but its old code):
                this will allow after outputting value to be reset to have nothign in the field
                this will allow after outputting value to be reset to have nothign in the field
                this will allow after outputting value to be reset to have nothign in the field
                this will allow after outputting value to be reset to have nothign in the field

                <Button
                    ml={2}
                    onClick={() => sendData()}
                >
                    Add Event
                </Button>
            </InputGroup>

            */}

                < Container maxWidth="container.xl" padding={0}>
                    <Flex height={{ base: 'auto', md: '100vh' }} py={[0, 10, 20]} direction={{ base: 'column-reverse', md: 'row' }}>

                        <Details />

                        {/*originally was cart.js*/}
                        <VStack
                            w="full"
                            h="full"
                            p={10}
                            spacing={10}
                            alignItems="flex-start"
                            backgroundColor="#896969"
                        >

                            <VStack spacing={3} alignItems="flex-start">
                                <Heading size="2xl">Contacts</Heading>
                                <Text>Contacts we have on hand</Text>
                            </VStack >
                            {contacts.map((item, i) => {
                                return (
                                    <React.Fragment key={i}>
                                        {i > 0}

                                        <SimpleGrid columns={2} columnGap={1} rowGap={1} w="full">
                                            <GridItem colSpan={2}></GridItem>
                                            {/*<Text fontSize="xl" mr={4}>{i + 1}.</Text>*/}
                                            <Link href={'/contacts/' + item.eventID}><GridItem colSpan={2}><Text mr={1}>{item.eventFirstName} {item.eventLastName}</Text></GridItem></Link>
                                            <GridItem colSpan={2}><Text mr={1}>{item.eventEmail}</Text></GridItem>
                                            <GridItem colSpan={2}><Text mr={1}>{item.eventPhone}</Text></GridItem>

                                        </SimpleGrid>

                                    </React.Fragment>
                                )
                            })}

                        </VStack>



                    </Flex>
                </Container>

            </Flex>

        </>
    )
}



export const getServerSideProps = withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, req }) => {
    return {
        props: {
        }
    }
})

export default withAuthUser({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    whenUnauthedBeforeInit: AuthAction.REDIRECT_TO_LOGIN,
})(Event)