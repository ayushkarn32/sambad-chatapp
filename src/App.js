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
    <>
      <div className="main-box">
        <div className="info-box">
            <h3>Please Signin to continue</h3>
        </div>
        <div className="signin-box">
          <button className="sign-in" onClick={signInWithGoogle}> 
          <svg xmlns="http://www.w3.org/2000/svg" id="Capa_1" enable-background="new 0 0 512 512" height="32" viewBox="0 0 512 512" width="32"><g><path d="m120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308h-86.308c-34.255 44.488-52.823 98.707-52.823 155.785s18.568 111.297 52.823 155.785h86.308v-86.308c-12.142-20.347-19.131-44.11-19.131-69.477z" fill="#fbbd00"/><path d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216c-20.525 12.186-44.388 19.039-69.569 19.039z" fill="#0f9d58"/><path d="m139.131 325.477-86.308 86.308c6.782 8.808 14.167 17.243 22.158 25.235 48.352 48.351 112.639 74.98 181.019 74.98v-120c-49.624 0-93.117-26.72-116.869-66.523z" fill="#31aa52"/><path d="m512 256c0-15.575-1.41-31.179-4.192-46.377l-2.251-12.299h-249.557v120h121.452c-11.794 23.461-29.928 42.602-51.884 55.638l86.216 86.216c8.808-6.782 17.243-14.167 25.235-22.158 48.352-48.353 74.981-112.64 74.981-181.02z" fill="#3c79e6"/><path d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606c-48.352-48.352-112.639-74.981-181.02-74.981l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z" fill="#cf2d48"/><path d="m256 120v-120c-68.38 0-132.667 26.629-181.02 74.98-7.991 7.991-15.376 16.426-22.158 25.235l86.308 86.308c23.753-39.803 67.246-66.523 116.87-66.523z" fill="#eb4132"/></g></svg>
         Sign In With Google</button>
        </div>
      </div>
    </>
    )
}


function Chat(){
  const messagesRef=firestore.collection('messages');
  const query=messagesRef.orderBy('createdAt').limit(25);
  const [messages]= useCollectionData(query,{idField:'id'});
  const [formValue,setFormValue]=useState('');

  const sendMessage = async(e) =>{
    e.preventDefault();
    const {uid,displayName,photoURL}=auth.currentUser;
    await messagesRef.add({
      text:formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      displayName,
      photoURL
    });

    setFormValue('');

  }

 return(

    <>
    <div className="chat-box">
        <div className="chat-head">
          <span className="head-text"> Messages </span>
          <div className="sign-out">
                  <button classname="btn-out" onClick={()=> auth.currentUser && auth.signOut()}> Sign Out</button>
              </div>
        </div>

              {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />) }     
        <form onSubmit={sendMessage}>
          <div>
            <input value={formValue} onChange={(e)=> setFormValue(e.target.value)} placeholder="Write your message here"/>
            <button className="btn-send" type="submit">Send</button>
          </div>
        </form>
    </div>
    </>
 )
}

function ChatMessage(props){
 
  const{text,uid,displayName,photoURL}= props.message;
  const messageClass=uid === auth.currentUser.uid ? 'sent' : 'recieved';
  return (
        <div className="messages-box">
          <div className="img-profile">
                <img className="avatar" src={photoURL} alt="user-profile"/>
            </div>
            <div className="message-text">
                <p>{text}</p> 
            </div>
            <div className="sent-by">
              Sent by {displayName}
            </div>
          
        </div>
  )
}


export default App;
