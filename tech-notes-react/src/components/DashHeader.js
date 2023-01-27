import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { useNavigate, useLocation, Link } from 'react-router-dom'

import { useSendLogoutMutation } from '../features/auth/authApiSlice'

const DASH_REGEX = /^\/dash(\/)?$/
const NOTES_REGEX = /^\/dash\/notes(\/)?$/
const USER_REGEX = /^\/dash\/users(\/)?$/

const DashHeader = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation()

  useEffect(() => {
    if (isSuccess) navigate('/')
  }, [isSuccess, navigate])

  if (isLoading) return <p>Logging out...</p>

  if (isError) return <p>Error: {error.data?.message}</p>

  let dashClass = null
  if (
    !DASH_REGEX.test(pathname) &&
    !USER_REGEX.test(pathname) &&
    !NOTES_REGEX.test(pathname)
  ) {
    dashClass = 'dash-header__container--small'
  }

  const logoutButton = (
    <button className='icon-button' title='Logout' onClick={sendLogout}>
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  )
  const content = (
    <header className='dash-header'>
      <div className={`dash-header__container ${dashClass}`}>
        <Link to='/dash'>
          <h1 className='dash-header__title'>TechNotes</h1>
        </Link>
        <nav className='dash-header__nav'>
          {/* add more buttons later */} {logoutButton}
        </nav>
      </div>
    </header>
  )

  return content
}

export default DashHeader
