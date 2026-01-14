import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  Link
} from "react-router-dom";
// import './index.css'
import UserPage from './screens/users.page.tsx';
import { AudioOutlined, CommentOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import TrackPage from './screens/tracks.page.tsx';
import CommentPage from './screens/comments.page.tsx';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    label: <Link to={'/'}>Home</Link>,
    key: 'home',
    icon: <HomeOutlined />,
  },
  {
    label: <Link to={'/users'}>Manager Users</Link>,
    key: 'users',
    icon: <UserOutlined />,
  },
  {
    label: <Link to={'/tracks'}>Manager Tracks</Link>,
    key: 'tracks',
    icon: <AudioOutlined />,
  },
  {
    label: <Link to={'/comments'}>Manager Comments</Link>,
    key: 'comments',
    icon: <CommentOutlined />,
  },
];

const Header = () => {
  const [current, setCurrent] = useState('');

  useEffect(() => {
    if (location.pathname === "/users") {
      setCurrent("users");

    } else if (location.pathname === "/tracks") {
      setCurrent("tracks");
    } else if (location.pathname === "/comments") {
      setCurrent("comments");
    }
    else {
      setCurrent("home");
    }
  }, [location]);

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
  };

  return (<Menu
    onClick={onClick}
    selectedKeys={[current]}
    mode="horizontal"
    items={items} />);
};


const LayoutAdmin = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutAdmin />,
    children: [
      { index: true, element: <App /> },
      {
        path: "users",
        element: <UserPage />,
      },
      {
        path: "tracks",
        element: <TrackPage />,
      },
      {
        path: "comments",
        element: <CommentPage />,
      },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
