import React from 'react'

class TextEntry extends React.Component {
	constructor() {
		super()
		this.state = {
			useTimer: false,
			disableBackspace: false,
			showTimeRemaining: false,
			minutes: 0,
			time: {},
			totalTime: 0,
			showWordCount: false,
			startWriting: false,
			promptResponse: '',
			wordCount: 0,
		}
		this.timer = 0
		this.handleChange = this.handleChange.bind(this)
		this.handleClick = this.handleClick.bind(this)
		this.handleText = this.handleText.bind(this)
		this.startTimer = this.startTimer.bind(this)
		this.countDown = this.countDown.bind(this)
		this.onKeyDown = this.onKeyDown.bind(this)
	}

	handleChange(event) {
		const target = event.target
		const value = target.type === 'checkbox' ? target.checked : target.value
		const name = target.name
		
		//checkboxes --> just flip the boolean
		this.setState({
			[name]: value
		}, () => {
			//executed only after the state has updated
			const minutes = this.state.minutes == '' ? 0 : parseInt(this.state.minutes)
			const totalTime = (minutes * 60)
			this.setState({
				totalTime: totalTime
			})
		})
		
		
		//timer --> convert to seconds?

	}

	handleClick(){
	(this.state.minutes <= 60) ? 
		this.setState({
			startWriting: true
		})
		:
		alert('Please check your timer input.')
	

	}

	handleText(text){
			
			this.setState({
				promptResponse: text
			}) 
			let str = text
			const arr = str.trim().split(/\s+/)
			const count = (arr[0] == '' ? 0 : arr.length)
			this.setState({
				wordCount: count
			})
	}


	onKeyDown(event) {
		if (this.state.disableBackspace && event.key == 'Backspace')
			event.preventDefault()
		//
		if (event.key === 'Tab') {
			// Prevent the default action to not lose focus when tab
			event.preventDefault();
	  
			//this.setState((prevState) => ({promptResponse: prevState.promptResponse + '	', wordCount: prevState.wordCount}))
			document.getElementById('textarea').value += '	'
			//this.handleText(document.getElementById('textarea').value)
		  }
	}

	secondsToTime(secs){
		//let hours = Math.floor(secs / (60 * 60));
	
		let divisor_for_minutes = secs % (60 * 60);
		let minutes = Math.floor(divisor_for_minutes / 60);
	
		let divisor_for_seconds = divisor_for_minutes % 60;
		let seconds = Math.ceil(divisor_for_seconds);
	
		let obj = {
		  //"h": hours,
		  "m": minutes,
		  "s": seconds
		};
		return obj;
	  }

	startTimer() {
		if (this.timer == 0 && this.state.totalTime > 0) {
			this.timer = setInterval(this.countDown, 1000);
		  }
	} 

	countDown() {
		// Remove one second, set state so a re-render happens.
		let totalTime = this.state.totalTime - 1;
		this.setState({
		  time: this.secondsToTime(totalTime),
		  totalTime: totalTime,
		});
		
		// Check if we're at zero.
		if (totalTime == 0) { 
		  clearInterval(this.timer)
		  alert("Time's up!")
		}
	}

	render() {
		return (
			<div>
			{!this.state.startWriting ? (<div>
				<div>
				
				<input
					//className = 'form-check-input'
					type = 'checkbox'
					id = 'useTimer'
					name = 'useTimer'
					value = {this.state.timer}
					onChange = {this.handleChange}	
				/>
				<label for="useTimer">
					<span></span>
					Use timer?
				</label>
				<br/>
				{this.state.useTimer ? 
					(<div>
						<table className = 'center'>
							<tr>
							<td>
								<input 
									type= 'text'
									onKeyPress = {(event) => (event.key >= 0 || event.key <= 9) ? null : event.preventDefault() }
									name = 'minutes' 
									value = {this.state.minutes} 
									onChange= {this.handleChange}
								/> minutes
							</td>
							</tr>
						</table>
					<br/>
					<br/>
					<input 
						//className = 'styled-checkbox'
						type= 'checkbox'
						label = 'Show time remaining?' 
						id = 'showTimeRemaining'
						name = 'showTimeRemaining'  
						value = {this.state.showTimeRemaining} 
						onChange= {this.handleChange}
						
					/>
					<label for="showTimeRemaining">
						<span></span>
						Show time remaining?
					</label>
					</div>)
					 : null}
				<input
					//className = 'styled-checkbox'
					type = 'checkbox'
					id = 'disableBackspace'
					name = 'disableBackspace'
					value = {this.state.disableBackspace}
					onChange = {this.handleChange}
				/>
				<label for="disableBackspace">
						<span></span>
						Disable backspace?
				</label>
				<br/>
				<input 
					//className = 'styled-checkbox'
					type = 'checkbox'
					id = 'showWordCount'
					name = 'showWordCount'
					value = {this.state.showWordCount}
					onChange = {this.handleChange}
				/>
				<label for="showWordCount">
						<span></span>
						Show word count?
				</label>
				</div>
				<br/>
				<div>
					<button className="button" onClick={this.handleClick}>Start writing!</button>
					<br /><br />
				</div>
				</div>)
				: 
					(
						<div>
							<br/>
							<textarea 
							className = "styled-textarea"
							id = 'textarea'
							type = 'text' 
							rows = {10}ue
							onChange = {(event) => this.handleText(event.target.value)}
							onKeyDown = {this.onKeyDown}
							value = {this.state.promptResponse}
							/>
							{this.state.showWordCount ? 
								<h3>Word count: {this.state.wordCount} </h3> 
							: null}
							{this.state.useTimer ?
								(
									this.startTimer()
								)
							: null}
							{this.state.useTimer && this.state.showTimeRemaining ?
								<h3>Time remaining: {this.state.time.m} minutes and {this.state.time.s} seconds</h3>
							: null}
							<br/><br/>
							<button className="button" onClick={() => {navigator.clipboard.writeText(this.state.promptResponse)}}>Copy text</button>
            				<button className="button" onClick={() => (this.setState({promptResponse: "", wordCount: 0}))}>Clear text</button>
         				 	<br/><br/>
						</div>
					)
				}

			</div>
			
			
		)
	}
}

export default TextEntry