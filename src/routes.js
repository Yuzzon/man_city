import React from 'react'
import Layout from './Hoc/Layout'
import { Switch } from 'react-router-dom'

import PrivateRoute from './Components/authRoutes/privateRoutes'
import PublicRoute from './Components/authRoutes/publicRoutes'

import SignIn from './Components/signin/index'
import Home from './Components/home'

import Dashboard from './Components/admin/Dashboard'
import AdminMatches from './Components/admin/matches'
import AddEditMatch from './Components/admin/matches/addEditMatch'
import AdminPlayers from './Components/admin/players'
import AddEditPlayers from './Components/admin/players/addEditPlayers'

import NotFound from './Components/ui/not_found'
import TheTeam from './Components/theTeam'
import TheMatches from './Components/theMatches'

const Routes = (props) => {
  return (
    <Layout>
      <Switch>
        <PrivateRoute {...props} path="/admin_players" exact component={AdminPlayers} />
        <PrivateRoute {...props} path="/admin_players/add_players" exact component={AddEditPlayers} />
        <PrivateRoute {...props} path="/admin_players/add_players/:id" exact component={AddEditPlayers} />
        <PrivateRoute {...props} path="/admin_matches" exact component={AdminMatches} />
        <PrivateRoute {...props} path="/admin_matches/edit_match" exact component={AddEditMatch} />
        <PrivateRoute {...props} path="/admin_matches/edit_match/:id" exact component={AddEditMatch} />
        <PrivateRoute {...props} path="/dashboard" exact component={Dashboard} />
        <PublicRoute {...props} restricted={true} exact component={SignIn} path="/sign_in" />
        <PublicRoute {...props} restricted={false} exact component={Home} path="/" />
        <PublicRoute {...props} restricted={false} exact component={TheTeam} path="/the_team" />
        <PublicRoute {...props} restricted={false} exact component={TheMatches} path="/the_matches" />
        <PublicRoute {...props} restricted={false} component={NotFound} />
      </Switch>
    </Layout>
  );
}

export default Routes;
