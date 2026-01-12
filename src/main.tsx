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
import { AudioOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import TrackPage from './screens/tracks.page.tsx';

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
  }, {
    label: <Link to={'/tracks'}>Manager Tracks</Link>,
    key: 'tracks',
    icon: <AudioOutlined />,
  },
];

const Header = () => {
  const [current, setCurrent] = useState('');

  useEffect(() => {
    if (location.pathname === "/users") {
      setCurrent("users");

    } else if (location.pathname === "/tracks") {
      setCurrent("tracks");
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
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
