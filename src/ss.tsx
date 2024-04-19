import { Refine } from '@refinedev/core'
import React from 'react'
import { dataProvider } from './providers/data-provider'
import UserList from './components/UserList'
import HomePage from './components/navbar'
import { authProvider } from './providers/auth-provider'
import DashBoard from './components/sidebar'

export default function ss() {


  return (
    <div>
      <Refine
      authProvider={authProvider}
      dataProvider={dataProvider}>
        <HomePage/>
        <DashBoard/>
        <UserList/>
      </Refine>
    </div>
  )
}
