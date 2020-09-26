import React from 'react';
import {useState} from 'react';
import Top from './Top';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import {useAuthState} from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
    apiKey: "AIzaSyABJ5iShrHH-c5EwP08wr4ZVP7MLXhpMo4",
    authDomain: "chatapp-2ea7e.firebaseapp.com",
    databaseURL: "https://chatapp-2ea7e.firebaseio.com",
    projectId: "chatapp-2ea7e",
    storageBucket: "chatapp-2ea7e.appspot.com",
    messagingSenderId: "316774506107",
    appId: "1:316774506107:web:188b255832b9549fbc8cde"
})
const auth= firebase.auth();
const firestore=firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
        <div className="header">
          <div>
          <Top />
          </div>
            
        </div>
        <section>
          {user ? <Chat /> : <Signin />}
        </section>
    </div>
  );
}

function Signin(){
  const signInWithGoogle=()=>{
    const provider= new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(
      <div className="signin-box">
        <button onClick={signInWithGoogle}> sign In With Google</button>
      </div>
    )
}


function Chat(){
  const messagesRef=firestore.collection('messages');
  const query=messagesRef.orderBy('createdAt').limit(25);
  const [messages]= useCollectionData(query,{idField:'id'});
  const [formValue,setFormValue]=useState('');

  const sendMessage = async(e) =>{
    e.preventDefault();
    const {uid,photoURL}=auth.currentUser;
    await messagesRef.add({
      text:formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');

  }

 return(

    <>
    <div className="chat-box">
        <div className="sign-out">
              <button onClick={()=> auth.currentUser && auth.signOut()}> Sign Out</button>
            </div>
              {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />) }     
        <form onSubmit={sendMessage}>
          <div>
            <input value={formValue} onChange={(e)=> setFormValue(e.target.value)} />
            <button className="btn-send" type="submit">Send</button>
          </div>
        </form>
    </div>
    </>
 )
}

function ChatMessage(props){
 
  const{text,uid,photoURL}= props.message;
  const messageClass=uid === auth.currentUser.uid ? 'sent' : 'recieved';
  return (
        <div className="messages-box">
          <div className="img-profile">
                <img className="avatar" src={photoURL} alt="user-profile"/>
            </div>
            <div className="message-text">
                <p>{text}</p> 
            </div>
          
        </div>
  )
}


export default App;
