import React from 'react'
import App from '../App'
import '../App.css'
import TextEntry from './TextEntry.js'

function Prompt(props) {
	return (
		<div className = "promptBackground">
			<h2>{props.text}</h2>
			<h3>Submitted by u/{props.user} to r/{props.subreddit}</h3>
			<button 
                className = 'button'
            	onClick ={() => props.handleClick('fiction')}>
                  Give me a different prompt
            </button>
			<br />
			<br />
			<TextEntry />
		</div>
	)
}

export default Prompt