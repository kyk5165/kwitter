import { dbService } from "fbase";
import React, { useEffect, useState } from "react";

const Home = ({userObj}) => {
    const [kweet, setKweet] = useState("");
    const [kweets, setKweets] = useState([]);
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection("kweets").add({
            text:kweet,
            createAt: Date.now(),
            creatorId: userObj.uid
        });
        setKweet("");
    };
    const onChange = (event) => {
        const {
            target: {value}
        } = event;
        setKweet(value);
    };
    useEffect(()=>{
        dbService.collection("kweets").onSnapshot((snapshot) =>{
            const kweetArray = snapshot.docs.map(doc => ({id:doc.id, ...doc.data()}));
            setKweets(kweetArray);
        });
    },[]);
    return (
    <div>
        <form onSubmit={onSubmit}>
            <input type="text" placeholder="What's on your mind?" value={kweet} maxLength={120} onChange={onChange} />
            <input type="submit" value="Kweet" />
        </form>
        <div>
            {kweets.map((kweet) => (
                <div key={kweet.id}>
                    <h4>{kweet.text}</h4>
                </div>
            ))}
        </div>
    </div>
)};
export default Home;