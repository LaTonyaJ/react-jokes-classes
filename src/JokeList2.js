import React from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

class JokeList extends React.Component{
    constructor(props){
        super(props);
        this.state = {numJokesToGet: 10, jokes: []};
        this.generateNewJokes = this.generateNewJokes.bind(this);
        this.vote = this.vote.bind(this);
        this.sortedJokes = this.sortedJokes.bind(this);

    }
    /* get jokes if there are no jokes */
    async componentDidMount(){
        let j = [...this.state.jokes];
        let seenJokes = new Set();
        try{
            while (j.length < this.state.numJokesToGet) {
            let res = await axios.get("https://icanhazdadjoke.com", {
                headers: { Accept: "application/json" }    
            });

                let { status, ...jokeObj } = res.data;
  
                if (!seenJokes.has(jokeObj.id)) {
                    seenJokes.add(jokeObj.id);
                    j.push({ ...jokeObj, votes: 0 });
                } else {
                    console.error("duplicate found!");
                }
            }

            this.setState({jokes: j});

        } catch (e) {
        console.log(e);
        }
    }



    generateNewJokes = () => {
        this.setState({jokes: []});
    }

  /* change vote for this id by delta (+1 or -1) */

    vote = (id, delta) => {
        this.setState({jokes: allJokes =>
            allJokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))}
        );
    }

    /* render: either loading spinner or list of sorted jokes. */
    sortedJokes = () => {
        this.setState({jokes: [...this.state.jokes].sort((a, b) => b.votes - a.votes) })
    }



    render(){
        return(
            <div className="JokeList">
            <button className="JokeList-getmore" onClick={this.generateNewJokes}>
            Get New Jokes
            </button>
            
            
            {this.state.jokes.map(j => (
                <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
            ))}
            </div>
      );
    
    }
}

export default JokeList;
