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
      loading: false,
      promptData: {},
      prompt: '',
      user:'',
      subreddit: ''
    }
    this.sortSelect = ['top/?t=week&limit=50', 'top/?t=month&limit=250', 'top/?t=all&limit=1000']
    this.subSelect = ['WritingPrompts', 'SimplePrompts']
    this.handleClick = this.handleClick.bind(this)
  }

  async handleClick (type) {
    this.setState({
      buttonClicked: true,
      loading: true,
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
      let tokenData = await fetch(REDDIT_ACCESS_TOKEN_URL, {
        method: 'POST',
        body: params,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${'gJg9wlHwic_raQ'}:`).toString('base64')}` // Put password as empty
        }
      }).then(res => res.json()) 
      
      // randomly choose sub
      const sub = this.subSelect[Math.floor(Math.random() * this.subSelect.length)]
      //(type == 'fiction' ? 'WritingPrompts' : null)
      // randomly choose what to sort by
      const sort = (sub === 'SimplePrompts' ? 'top/?t=all&limit=300' : this.sortSelect[Math.floor(Math.random() * this.sortSelect.length)])
      //const sort = this.sortSelect[Math.floor(Math.random() * this.sortSelect.length)] 
      
      // get listings (fetchPromptData randomly chooses a listing and updates promptData)
      //const prompt = await fetchPromptData(sub, sort, tokenData.access_token)
      // update state with randomly chosen prompt's title and author

      let prompt = await fetchPromptData(sub, sort, tokenData.access_token)
      
      
      
      if (sub === 'WritingPrompts') {
        
        while (this.state.promptData.link_flair_text == "Established Universe"
        || this.state.promptData.link_flair_text == "Theme Thursday"
        || this.state.promptData.link_flair_text == "Prompt Me"
        || this.state.promptData.link_flair_text == "Media Prompt"
        || this.state.promptData.link_flair_text == "Image Prompt"
        || this.state.promptData.link_flair_text == "Prompt Inspired"
        || this.state.promptData.link_flair_text == "Off Topic"    
        || this.state.promptData.title.includes("Follow Me Friday")
        || this.state.promptData.title.includes("Smash 'Em Up Sunday")
        || this.state.promptData.title.includes("Flash Fiction Challenge"))
          {
              prompt = await fetchPromptData(sub, sort, tokenData.access_token)
              
        } 
        
      } 
      

      if (sub === 'SimplePrompts') {
        // make sure flair is anything but 'Meta' or 'Image Prompt'
        
        while (this.state.promptData.link_flair_text == 'Meta'
            || this.state.promptData.link_flair_text == 'Image Prompt')
            {
              prompt = await fetchPromptData(sub, sort, tokenData.access_token)
            }
            

      } 
      
      
      //console.log(this.state.promptData)
      this.setState({
        prompt: this.state.promptData.title,
        user: this.state.promptData.author,
        loading: false,
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
          {this.state.loading ?
              <div className="loader book">
                <figure className="page"></figure>
                <figure className="page"></figure>
                <figure className="page"></figure>
              </div>
           : null}
          <br/>
    
          {this.state.promptLoaded ? <Prompt text= {this.state.prompt} user= {this.state.user} subreddit={this.state.subreddit} handleClick = {this.handleClick}/> : null}

          <br/>
          <h4> Created by Rachel George </h4>
        </header>
        
      </div>
    );
  }
}

export default App;
