import React, { useEffect, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

import { Login, Feed, Messages, Discover, ChatBox, Profile, CreatePost, Layout, Connections } from './pages/imports'

import { useUser, useAuth } from '@clerk/clerk-react'
import toast, { Toaster } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser } from './features/user/userSlice'
import { fetchConnections } from './features/connections/connectionsSlice'
import { addMessage } from './features/messages/messagesSlice'
import Notification from './components/Notification'

const App = () => {

  const { user, isSignedIn, isLoaded } = useUser();
  const backendUser = useSelector((state) => state.user.userData);

  const { getToken } = useAuth()
  const dispatch = useDispatch()
  const { pathname } = useLocation()
  const pathnameRef = useRef(pathname)


  useEffect(() => {
    const fetchData = async () => {
      if(user) {
        const token = await getToken()
        dispatch(fetchUser(token))
        dispatch(fetchConnections(token))
      }
    }
    fetchData()
    
  }, [user, getToken, dispatch])

  useEffect(() => {
    pathnameRef.current = pathname
  }, [pathname])

  useEffect(() => {
    if(!backendUser) return

    console.log(backendUser._id)
    if(backendUser) {
      const eventSource = new EventSource(import.meta.env.VITE_BASE_URL + '/api/message/' + backendUser._id)

      eventSource.onopen = () => console.log("SSE Connected");
      eventSource.onerror = (err) => console.log("SSE Error:", err);

      eventSource.onmessage = (event) => {
        if(event.data === 'connected') return

        const message = JSON.parse(event.data)
        console.log("EVENT:", event.data)

        const chatPath = '/messages/' + 
        (message.from_user_id._id === backendUser._id 
          ? message.to_user_id 
          : message.from_user_id);

        if(pathnameRef.current === chatPath) {
          dispatch(addMessage(message))
        }else {
          toast.custom((t) => (
            <Notification t={t} message={message} />
          ), {
            position: 'bottom-right'
          })
        }
      }
      return () => {
        eventSource.close()
      }
    }
  }, [backendUser, dispatch])

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