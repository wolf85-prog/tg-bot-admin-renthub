import React from 'react'
import {Routes, Route } from 'react-router-dom';
import {authRoutes} from "./routes_start";
import {observer} from "mobx-react-lite";
import PrivateRoute from './PrivateRoute';
import DistributionRPlaner from './pages/DistributionRPlaner';


// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const ChatWorker = React.lazy(() => import('./pages/ChatWorker'))
const ChatRentPerson = React.lazy(() => import('./pages/ChatRentPerson'))
const DistributionR = React.lazy(() => import('./pages/DistributionR'))
const DistributionAddR = React.lazy(() => import('./pages/DistributionAddR'))

const AppRouter = observer(() => {

  return (
    <Routes> 
      <Route exact path='/' element={<PrivateRoute/>}>
        {authRoutes.map(({path, Component}) =>
            <Route key={path} path={path} element={<Component/>} exact/>
        )} 
      </Route>         

      <Route exact path="/login" name="Login Page" element={<Login />} />
      <Route exact path="/register" name="Register Page" element={<Register />} />
      <Route exact path="/404" name="Page 404" element={<Page404 />} />
      <Route exact path="/500" name="Page 500" element={<Page500 />} />

      <Route exact path="/chatrent" name="Renthub" element={<ChatWorker />} />
      <Route exact path="/:id" name="Renthub" element={<ChatRentPerson />} />

      <Route exact path="/distributionr" name="Renthub" element={<DistributionR />} />
      <Route exact path="/distributionr_add" name="Renthub" element={<DistributionAddR />} />
      <Route exact path="/distributionr_planer" name="Renthub" element={<DistributionRPlaner />} />
    </Routes>
  );
});

export default AppRouter;