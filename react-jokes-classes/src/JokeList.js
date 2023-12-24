// JokesList.js

import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */
/** List of jokes. */
function JokesList({ numJokesToGet = 5 }) {
	const [jokes, setJokes] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	async function getJokes() {
		console.log("Getting Jokes!");
		setIsLoading(true);

		try {
			let jokesArray = [];
			let seenJokes = new Set();

			while (jokesArray.length < numJokesToGet) {
				let res = await axios.get("https://icanhazdadjoke.com", {
					headers: { Accept: "application/json" },
				});
				let { ...joke } = res.data;

				if (!seenJokes.has(joke.id)) {
					seenJokes.add(joke.id);
					jokesArray.push({ ...joke, votes: 0 });
				} else {
					console.log("duplicate found!");
				}
			}

			setJokes(jokesArray);
		} catch (err) {
			console.error("Caught Error!", err);
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		console.log("USE EFFECT");
		getJokes();
	}, []);

	const vote = (id, delta) => {
		console.log("VOTING!", id, delta);
		setJokes((prevJokes) =>
			prevJokes.map((j) => (j.id === id ? { ...j, votes: j.votes + delta } : j))
		);
	};

	const sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

	return (
		<div className="JokeList">
			<button className="JokeList-getmore" onClick={getJokes}>
				Get New Jokes
			</button>

			{sortedJokes.map((j) => (
				<Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={vote} />
			))}
		</div>
	);
}

export default JokesList;

// class JokeList extends Component {
//   static defaultProps = {
//     numJokesToGet: 5
//   };

//   constructor(props) {
//     super(props);
//     this.state = {
//       jokes: [],
//       isLoading: true
//     };

//     this.generateNewJokes = this.generateNewJokes.bind(this);
//     this.vote = this.vote.bind(this);
//   }

//   /* at mount, get jokes */

//   componentDidMount() {
//     this.getJokes();
//   }

//   /* retrieve jokes from API */

//   async getJokes() {
//     try {
//       // load jokes one at a time, adding not-yet-seen jokes
//       let jokes = [];
//       let seenJokes = new Set();

//       while (jokes.length < this.props.numJokesToGet) {
//         let res = await axios.get("https://icanhazdadjoke.com", {
//           headers: { Accept: "application/json" }
//         });
//         let { ...joke } = res.data;

//         if (!seenJokes.has(joke.id)) {
//           seenJokes.add(joke.id);
//           jokes.push({ ...joke, votes: 0 });
//         } else {
//           console.log("duplicate found!");
//         }
//       }

//       this.setState({ jokes, isLoading: false });
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   /* empty joke list, set to loading state, and then call getJokes */

//   generateNewJokes() {
//     this.setState({ isLoading: true});
//     this.getJokes();
//   }

//   /* change vote for this id by delta (+1 or -1) */

//   vote(id, delta) {
//     this.setState(st => ({
//       jokes: st.jokes.map(j =>
//         j.id === id ? { ...j, votes: j.votes + delta } : j
//       )
//     }));
//   }

//   /* render: either loading spinner or list of sorted jokes. */

//   render() {
//     let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);
//     if (this.state.isLoading) {
//       return (
//         <div className="loading">
//           <i className="fas fa-4x fa-spinner fa-spin" />
//         </div>
//       )
//     }

//     return (
//       <div className="JokeList">
//         <button
//           className="JokeList-getmore"
//           onClick={this.generateNewJokes}
//         >
//           Get New Jokes
//         </button>

//         {sortedJokes.map(j => (
//           <Joke
//             text={j.joke}
//             key={j.id}
//             id={j.id}
//             votes={j.votes}
//             vote={this.vote}
//           />
//         ))}
//       </div>
//     );
//   }
// }

// export default JokeList;
