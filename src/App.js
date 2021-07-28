import './App.css'
import React from 'react'
import Prompt from './Components/Prompt.js'
import TextEntry from './Components/TextEntry.js'

class App extends React.Component {
  constructor () {
    super()
    this.state = 
      {
      buttonClicked: false,
      promptLoaded: false,
      promptData: {},
      prompt: '',
      user:'',
      subreddit: ''
    }
    this.sortSelect = ['top/?t=week&limit=100', 'top/?t=month&limit=500', 'top/?t=all&limit=1000']
    this.handleClick = this.handleClick.bind(this)
  }

  async handleClick (type) {
    this.setState({
      buttonClicked: true,
      promptLoaded: false
    })
    try {
      const REDDIT_ACCESS_TOKEN_URL = 'https://www.reddit.com/api/v1/access_token'
      const APP_ONLY_GRANT_TYPE = 'https://oauth.reddit.com/grants/installed_client'
      const params = new URLSearchParams()
      params.append('grant_type', APP_ONLY_GRANT_TYPE)
      params.append('device_id', 'DO_NOT_TRACK_THIS_DEVICE')

      const fetchPromptData = (sub, sort, accessToken) => fetch(`https://oauth.reddit.com/r/${sub}/${sort}`, 
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }}
      ).then(res => res.json())
      .then(prompt => this.setState({
        promptData: prompt.data.children[Math.floor(Math.random() * prompt.data.children.length)].data,
        subreddit: sub
       })) 

      // get access token
      const tokenData = await fetch(REDDIT_ACCESS_TOKEN_URL, {
        method: 'POST',
        body: params,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${'gJg9wlHwic_raQ'}:`).toString('base64')}` // Put password as empty
        }
      }).then(res => res.json()) 
      
      // randomly choose sub based on type of prompt requested
      const sub = (type == 'fiction' ? 'WritingPrompts' : null)
      // randomly choose what to sort by
      const sort = this.sortSelect[Math.floor(Math.random() * this.sortSelect.length)] 
      
      // get listings (fetchPromptData randomly chooses a listing and updates promptData)
      const prompt = await fetchPromptData(sub, sort, tokenData.access_token)
      // update state with randomly chosen prompt's title and author
      
      this.setState({
        prompt: this.state.promptData.title,
        user: this.state.promptData.author,
        promptLoaded: true,
      })
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Welcome to WriteNow!</h1>
          {!this.state.buttonClicked? 
              <p>Need writing inspiration? You've come to the right place.</p>
              : 
              null
          } 
          <br/>
          {!this.state.buttonClicked ? 
            <button className='button' onClick={() => this.handleClick('fiction')}>Give me an idea!</button>
          : null}
          <br/>
          {this.state.promptLoaded ? <Prompt text= {this.state.prompt} user= {this.state.user} subreddit={this.state.subreddit} handleClick = {this.handleClick}/> : null}

          <br/>
        </header>
      </div>
    );
  }
}

export default App;
