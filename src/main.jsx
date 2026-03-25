import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './componants/Home.jsx'

import { Provider } from 'react-redux'
import store from './store/store.js'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import AddEditPost from './pages/AddEditPost.jsx'
import Blogs from './pages/Blogs.jsx'
import PostPage from './pages/PostPage.jsx'
import Privacy from './pages/Privacy.jsx'
import Terms from './pages/Terms.jsx'


const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        {
          index: true,
          element: <Home />
        },
        {
          path: "/login",
          element: <Login />
        },
        {
          path: "/sign-up",
          element: <Signup />
        },
        {
          path: "/write-blog",
          element: <AddEditPost />
        },
        {
          path: "/blogs",
          element: <Blogs />
        },
        {
          path: "/post/:slug",
          element: <PostPage />
        },
        {
          path: "/edit/:slug",
          element: <AddEditPost />
        },
        {
          path:"/privacy",
          element: <Privacy/>
        },

        {
          path:"/terms",
          element: <Terms/>
        }


      ]
    }


  ]
)

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <Provider store={store} >
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>


)
