import { Suspense, useContext, lazy, useEffect } from 'react'
import { isUserLoggedIn } from '@utils'
import { useLayout } from '@hooks/useLayout'
import { AbilityContext } from '@src/utility/context/Can'
import { useRouterTransition } from '@hooks/useRouterTransition'
import LayoutWrapper from '@layouts/components/layout-wrapper'
import { BrowserRouter as AppRouter, Route, Switch, Redirect } from 'react-router-dom'
import { DefaultRoute, Routes } from './routes'
import BlankLayout from '@layouts/BlankLayout'
import VerticalLayout from '@src/layouts/VerticalLayout'
import { useSelector } from 'react-redux'

const Router = () => {
  const [layout, setLayout] = useLayout()
  const [transition, setTransition] = useRouterTransition()
  const { userData } = useSelector(state => state.auth)
  const ability = useContext(AbilityContext)
  // const DefaultLayout = layout === 'horizontal' ? 'HorizontalLayout' : 'VerticalLayout'
  // const Layouts = { BlankLayout, VerticalLayout, HorizontalLayout }
  const DefaultLayout = 'VerticalLayout'
  const Layouts = { BlankLayout, VerticalLayout }
  const currentActiveItem = null
  const LayoutRoutesAndPaths = layout => {
    const LayoutRoutes = []
    const LayoutPaths = []
    if (Routes) {
      Routes.filter(route => {
        if (route.layout === layout || (route.layout === undefined && DefaultLayout === layout)) {
          LayoutRoutes.push(route)
          LayoutPaths.push(route.path)
        }
      })
    }
    return { LayoutRoutes, LayoutPaths }
  }

  const Login = lazy(() => import('@src/views/authentication/Login'))
  const Register = lazy(() => import('@src/views/authentication/Register'))
  const Error = lazy(() => import('@src/views/Error'))

  const FinalRoute = props => {
    const route = props.route
    let action, resource
    if (route.meta) {
      action = route.meta.action ? route.meta.action : null
      resource = route.meta.resource ? route.meta.resource : null
    }
    if (
      (!isUserLoggedIn() && route.meta === undefined) ||
      (!isUserLoggedIn() && route.meta && !route.meta.authRoute && !route.meta.publicRoute)
    ) {
      return <Redirect to='/login' />
    } else if (route.meta && route.meta.authRoute && isUserLoggedIn()) {
      return <Redirect to='/game' />
    } else {
      return <route.component {...props} />
    }
  }

  useEffect(() => {
    console.log(userData)
  }, [userData])

  const ResolveRoutes = () => {
    return Object.keys(Layouts).map((layout, index) => {
      const LayoutTag = Layouts[layout]
      const { LayoutRoutes, LayoutPaths } = LayoutRoutesAndPaths(layout)
      const routerProps = {}
      return (
        <Route path={LayoutPaths} key={index}>
          <LayoutTag
            routerProps={routerProps}
            layout={layout}
            setLayout={setLayout}
            transition={transition}
            setTransition={setTransition}
            currentActiveItem={currentActiveItem}
          >
            <Switch>
              {LayoutRoutes.map(route => {
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    exact={route.exact === true}
                    render={props => {
                      Object.assign(routerProps, {
                        ...props,
                        meta: route.meta
                      })
                      return (
                        <Suspense fallback={null}>
                          <LayoutWrapper
                            layout={DefaultLayout}
                            transition={transition}
                            setTransition={setTransition}
                          >
                            <FinalRoute route={route} {...props} />
                          </LayoutWrapper>
                        </Suspense>
                      )
                    }}
                  />
                )
              })}
            </Switch>
          </LayoutTag>
        </Route>
      )
    })
  }

  return (
    <AppRouter basename={process.env.REACT_APP_BASENAME}>
      <Switch>
        <Route
          exact
          path='/'
          render={() => {
            return <Redirect to={DefaultRoute} />
          }}
        />
        <Route
          exact
          path='/login'
          render={props => (
            <Layouts.BlankLayout>
              <Login />
            </Layouts.BlankLayout>
          )}
        />
        <Route
          exact
          path='/register'
          render={props => (
            <Layouts.BlankLayout>
              <Register />
            </Layouts.BlankLayout>
          )}
        />
        {ResolveRoutes()}
        <Route path='*' component={Error} />/
      </Switch>
    </AppRouter>
  )
}

export default Router
