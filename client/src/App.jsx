import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'

import { Login, Feed, Messages, Discover, ChatBox, Profile, CreatePost, Layout, Connections } from './pages/imports'

import { useUser, useAuth } from '@clerk/clerk-react'
import { Toaster } from 'react-hot-toast'

const App = () => {

  const { user, isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth()

  useEffect(() => {
    if(user) {
      getToken().then((token) => console.log(token))
    }
  }, [user])

  if(!isLoaded) return null;
  
  return (
    <>
    <Toaster />
    <Routes>
      <Route path='/' element={ !isSignedIn ? <Login /> : <Layout /> }>
        <Route index element={ <Feed /> } />
        <Route path='messages' element={ <Messages /> } />
        <Route path='messages/:userId' element={ <ChatBox /> } />
        <Route path='discover' element={ <Discover /> } />
        <Route path='profile' element={ <Profile /> } />
        <Route path='connections' element={ <Connections /> } />
        <Route path='profile/:profileId' element={ <Profile /> } />
        <Route path='create-post' element={ <CreatePost /> } />
      </Route>
    </Routes>
    </>
  )
}

export default App